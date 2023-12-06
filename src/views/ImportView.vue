<template>
  <div>
    <NavBarDefault></NavBarDefault>
    <title>Importar planilha</title>
    <BoxCentralize>
      <q-card-section>
        <q-btn v-bind:disabled="isLoading" color="primary" label="Baixar modelo" @click="downloadTemplate" />
      </q-card-section>

      <q-card-section>
        <input v-bind:disabled="isLoading" type="file" ref="fileInput" @change="importData" />
      </q-card-section>

      <q-spinner v-if="isLoading" color="primary" size="3em" :thickness="2" />
      <div v-if="isLoading">Total de consultas a serem realizadas: <b>{{ totalLinhasCep }}</b></div>
      <div v-if="isLoading">Total de consultas feitas: <b>{{ totalConsultas }}</b></div>
      <div v-if="isLoading">Tempo decorrido: <b>{{ tempoDecorrido }}</b></div>
      <div v-if="isLoading">Tempo estimado restante: <b>{{ calcularTempoRestante() }}</b></div>
    </BoxCentralize>
  </div>
  <q-dialog v-model="small">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">Aviso!</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ msgErro }}
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';
import BoxCentralize from '@/components/BoxCentralize.vue';
import NavBarDefault from '@/components/NavBarDefault.vue';
import { ref } from "vue";

export default {
  components: { NavBarDefault, BoxCentralize },
  data() {
    return {
      isLoading: false,
      totalLinhasCep: null,
      totalConsultas: 1,
      tempoDecorrido: '0:00',
      small: ref(false),
      msgErro: null
    };
  },
  methods: {
    downloadTemplate() {
      const headers = ['cepOrigem', 'cepDestino', 'Tipo de transporte: 1 = A pé; 2 = Carro / Transpote Público;'];
      const data = ['06787-100', '06787-370'];

      const ws = XLSX.utils.aoa_to_sheet([headers, data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'modelo');

      XLSX.writeFile(wb, 'modelo.xlsx');
    },
    async importData() {
      const startTime = Date.now();

      this.isLoading = true;

      const file = this.$refs.fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        let removeFile = true;

        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (jsonData.length < 2 || !jsonData.slice(2).every((row) => row[0] && row[1] && row[2])) {
            this.small = true;
            this.msgErro = "Pelo menos duas linhas devem conter dados em ambas as colunas.";
            throw new Error('Pelo menos duas linhas devem conter dados em ambas as colunas.');
          }

          this.totalLinhasCep = jsonData.slice(1).length;

          for (const row of jsonData.slice(1)) {
            const cepOrigem = row[0];
            const cepDestino = row[1];
            const tipoTransporte = row[2];
            let cepO = cepOrigem.replace('-', '');
            let cepD = cepDestino.replace('-', '');

            const resposta = await this.makeGetRequest(cepO, cepD);

            const novaDistancia = {
              cepOrigem,
              cepDestino,
              transporte: tipoTransporte == 1 ? "A pé" : "Carro / Transporte Público",
              distancia: tipoTransporte == 1 ? resposta.distanciaPe : resposta.distanciaCarro,
              url: resposta.url,
            };

            this.$store.commit('adicionarDistancia', novaDistancia);
            this.totalConsultas++;

            const tempoDecorrido = (Date.now() - startTime) / 1000;
            this.tempoDecorrido = this.formatarTempo(tempoDecorrido);
          }

          this.$emit('import', this.$store.state.distancias);
          this.$router.push('/export');
        } catch (error) {
          console.error('Erro durante a importação:', error.message);
          this.small = true;
          this.msgErro = 'Erro durante a importação: ' + error.message;
          removeFile = true;
        } finally {
          this.isLoading = false;

          if (removeFile) {
            this.$refs.fileInput.value = '';
          }
        }
      };

      reader.readAsArrayBuffer(file);
    },
    async makeGetRequest(cepOrigem, cepDestino) {
      try {
        const headers = {
          'Authorization': 'Bearer ' + this.$store.state.token,
        };

        const response = await axios.get(`http://localhost:8081/cep/${cepOrigem}/${cepDestino}`, { headers: headers });
        return response.data;
      } catch (error) {
        console.error('Erro na requisição GET:', error.message);
        throw error;
      }
    },
    formatarTempo(tempoEmSegundos) {
      const minutos = Math.floor(tempoEmSegundos / 60);
      const segundos = Math.floor(tempoEmSegundos % 60);
      return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    },
    calcularTempoRestante() {
      const tempoRestante = ((this.totalLinhasCep - this.totalConsultas) * this.calcularMediaTempoPorConsulta());
      return this.formatarTempo(tempoRestante);
    },
    calcularMediaTempoPorConsulta() {
      const tempoTotalSegundos = this.tempoDecorrido.split(':').reduce((acc, val, index) => acc + val * (index === 0 ? 60 : 1), 0);
      return this.totalConsultas > 0 ? tempoTotalSegundos / this.totalConsultas : 0;
    },

  },
};
</script>
