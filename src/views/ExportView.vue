<template>
  <NavBarTecBan></NavBarTecBan>
  <title>Distância entre os CEPs</title>
    <div>
      <q-table
          :rows="distancias"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :rows-per-page-options="rowsPerPageOptions"
          :options="tableOptions"
      >
        <template v-slot:top-right>
          <q-btn @click="exportToExcel" color="primary" label="Exportar para Excel" />
        </template>
      </q-table>
    </div>


</template>

<script>
import * as XLSX from 'xlsx';
import NavBarTecBan from "@/components/NavBarTecBan.vue";

export default {
  components: { NavBarTecBan},
  computed: {
    distancias() {
      return this.$store.state.distancias;
    },
  },
  data() {
    return {
      columns: [
        { name: 'cepOrigem', label: 'Cep Origem', align: 'center', field: 'cepOrigem' },
        { name: 'cepDestino', label: 'Cep Destino', align: 'center', field: 'cepDestino' },
        { name: 'distancia', label: 'Distância', align: 'center', field: 'distancia' },
        { name: 'url', label: 'URL da consulta', align: 'center', field: 'url' },
      ],
      pagination: { rowsPerPage: 10 },
      rowsPerPageOptions: [10, 20, 30],
      tableOptions: { dense: true },
    };
  },
  methods: {
    exportToExcel() {
      const headers = ['Cep Origem', 'Cep Destino', 'Distância', 'UrlConsulta'];
      const data = this.distancias.map(distancia => [
        distancia.cepOrigem,
        distancia.cepDestino,
        distancia.distancia,
        distancia.url,
      ]);

      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'dados');

      XLSX.writeFile(wb, 'dados.xlsx');
    },
  },
};
</script>


