<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Cabeçalho -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Meu Aplicativo Quasar</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Conteúdo da Página -->
    <q-page-container>
      <router-view /> <!-- Este é o ponto onde a sua view será renderizada -->
    </q-page-container>

    <!-- Rodapé -->
    <q-footer elevated>
      <!-- Conteúdo do rodapé, se necessário -->
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'AppLayout',
};
</script>

<style scoped>
/* Adicione estilos conforme necessário */
</style>
