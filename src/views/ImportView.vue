<template>
  <NavBarTecBan></NavBarTecBan>
  <title>Importar planilha</title>
  <BoxCentralize>
<!--    <div>-->
<!--      <button @click="downloadTemplate">Baixar Modelo</button>-->
<!--      <input type="file" ref="fileInput" @change="importData" />-->
<!--    </div>-->

    <q-card-section>
      <q-btn color="primary" label="Baixar modelo"  @click="downloadTemplate"/>
    </q-card-section>

    <q-card-section>
      <input type="file" ref="fileInput" @change="importData" />
    </q-card-section>
  </BoxCentralize>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from "axios";
import BoxCentralize from "@/components/BoxCentralize.vue";
import NavBarTecBan from "@/components/NavBarTecBan.vue";

export default {
  components: {NavBarTecBan, BoxCentralize},
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
      const file = this.$refs.fileInput.files[0];

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Verificar se há pelo menos duas linhas e ambas as colunas estão preenchidas
          if (jsonData.length < 3 || !jsonData.slice(2).every(row => row[0] && row[1])) {
            throw new Error('Pelo menos duas linhas devem conter dados em ambas as colunas.');
          }

          for (const row of jsonData.slice(1)) {
            const cepOrigem = row[0];
            const cepDestino = row[1];
            let cepO = cepOrigem.replace("-", "");
            let cepD = cepDestino.replace("-", "");

            const resposta = await this.makeGetRequest(cepO, cepD);


            const novaDistancia = {
              cepOrigem,
              cepDestino,
              distancia: resposta.distancia
            };

            // Adicionar o objeto Distancia à lista na store
            this.$store.commit('adicionarDistancia', novaDistancia);
          }


          console.log('Distancias armazenadas na store:', this.$store.state.distancias[0]);

          // Emitir o evento de importação (se necessário)
          this.$emit('import', this.$store.state.distancias);

        } catch (error) {
          console.error('Erro durante a importação:', error.message);

        }
      };
      this.$router.push('/export');
      reader.readAsArrayBuffer(file);
    },

    async makeGetRequest(cepOrigem, cepDestino) {
      try {
        const response = await axios.get(`http://localhost:8081/cep/${cepOrigem}/${cepDestino}`);
        // Retorna a resposta para ser utilizada na função importData
        return response.data;
      } catch (error) {
        console.error('Erro na requisição GET:', error.message);
        // Tratar o erro de forma apropriada (pode emitir um evento de erro ou exibir uma mensagem ao usuário)
        throw error;
      }
    }
  }
};
</script>
