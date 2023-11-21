<template>
  <div>
    <h2>Dados Exportados</h2>
    <button @click="exportToExcel">Exportar para Excel</button>
    <table>
      <thead>
      <tr>
        <th>Cep Origem</th>
        <th>Cep Destino</th>
        <th>Distância</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(distancia, index) in distancias" :key="index">
        <td>{{ distancia.cepOrigem }}</td>
        <td>{{ distancia.cepDestino }}</td>
        <td>{{ distancia.distancia }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
export default {
  computed: {
    distancias() {
      return this.$store.state.distancias;
    },
  },
  methods: {
    exportToExcel() {
        const headers = ['Cep Origem', 'Cep Destino', 'Distância'];


        const data = this.distancias.map(distancia => [
          distancia.cepOrigem,
          distancia.cepDestino,
          distancia.distancia
        ]);

        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'dados');

        XLSX.writeFile(wb, 'dados.xlsx');
    },
  },
};
</script>

<style>

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>
