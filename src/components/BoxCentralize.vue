<template>
  <body style="background-color: #e9ecef">
  <div class="container">
    <div class="box">
      <q-card class="my-card">
        <slot></slot>
        <footer style="text-align: center; background-color: rgba(0,0,0,.03); padding: 0.75rem 1.25rem; border-top: 1px solid rgba(0,0,0,.125);">
          <small>
            <img src="../assets/localizacao.png" width="30" height="30" class="d-inline-block align-top" alt="TecBan">
            <cite title="CepExplorer">CepExplorer</cite>
          </small>
        </footer>
      </q-card>
    </div>
  </div>
  </body>
</template>

<script>
export default {
  name: "BoxCentralize"
}
</script>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .box {
    width: 350px;
    height: auto;
    background: #fff;
  }
  body {
    margin: 0px;
  }
</style>
