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
      <div v-if="isLoading">Total de consultas a serem realizadas: <b>{{this.totalLinhasCep}}</b></div>
      <div v-if="isLoading">Total de consultas feitas: <b>{{this.totalConsultas}}</b></div>
      <div v-if="isLoading">Total concluído: <b>{{((totalConsultas / totalLinhasCep) * 100).toFixed(1)}}%</b></div>
    </BoxCentralize>
  </div>
  <q-dialog
      v-model="small"
  >
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
import {ref} from "vue";

export default {
  components: { NavBarDefault, BoxCentralize },
  data() {
    return {
      isLoading: false,
      totalLinhasCep: null,
      totalConsultas: 1,
      small: ref(false),
      msgErro : null
    };
  },
  methods: {
    downloadTemplate() {
      const headers = ['cepOrigem', 'cepDestino'];
      const data = ['06787-100', '06787-370'];

      const ws = XLSX.utils.aoa_to_sheet([headers, data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'modelo');

      XLSX.writeFile(wb, 'modelo.xlsx');
    },
    async importData() {
      this.isLoading = true; // Inicia o estado de carregamento

      const file = this.$refs.fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        let removeFile = true; // Flag para remover o arquivo em caso de erro

        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (jsonData.length < 2 || !jsonData.slice(2).every((row) => row[0] && row[1])) {
            this.small = true;
            this.msgErro = "Pelo menos duas linhas devem conter dados em ambas as colunas.";
            throw new Error('Pelo menos duas linhas devem conter dados em ambas as colunas.');
          }

          this.totalLinhasCep = jsonData.slice(1).length;

          for (const row of jsonData.slice(1)) {
            const cepOrigem = row[0];
            const cepDestino = row[1];
            let cepO = cepOrigem.replace('-', '');
            let cepD = cepDestino.replace('-', '');

            const resposta = await this.makeGetRequest(cepO, cepD);

            const novaDistancia = {
              cepOrigem,
              cepDestino,
              distancia: resposta.distancia,
              url: resposta.url,
            };

            this.$store.commit('adicionarDistancia', novaDistancia);
            this.totalConsultas++;
          }

          this.$emit('import', this.$store.state.distancias);
          this.$router.push('/export'); // Redireciona apenas se a importação e as requisições foram bem-sucedidas
        } catch (error) {
          console.error('Erro durante a importação:', error.message);
          this.small = true;
          this.msgErro = 'Erro durante a importação: '+ error.message;
          removeFile = true; // Mantenha essa linha mesmo se a flag já estiver definida como true
          // Trate o erro conforme necessário, não redirecione para '/import'
        } finally {
          this.isLoading = false; // Finaliza o estado de carregamento, independentemente de sucesso ou falha

          // Remover o arquivo se necessário
          if (removeFile) {
            this.$refs.fileInput.value = ''; // Limpa o valor do input de arquivo
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

        const response = await axios.get(`http://localhost:8081/cep/${cepOrigem}/${cepDestino}`, {headers: headers});
        return response.data;
      } catch (error) {
        console.error('Erro na requisição GET:', error.message);
        throw error;
      }
    },
  },
};
</script>
