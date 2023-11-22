<template>
  <q-toolbar class="bg-black text-white">
    <a class="navbar-brand">
      <img alt="" src="../assets/logo.png" width="90" style="margin-top: 1%; margin-bottom: 1%;">
    </a>
    <q-toolbar-title>
    </q-toolbar-title>
    <q-btn-dropdown stretch flat v-bind:label="$store.state.usuario">
      <q-list>
        <q-item clickable v-close-popup @click="logout">
          <q-item-section>
            <q-item-label>Log-out</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-btn-dropdown>
  </q-toolbar>
</template>

<script>
export default {
  name: "NavBarTecBan",
  methods: {
    logout() {
      this.$store.commit('logoutUser');
      this.$router.push('/');
    },
    autoLogout() {
      const inativo = () => {
        this.logout();
      };
      var minutos = 120;
      var tempoDeEspera = minutos * (60 * 1000);
      var timeout = setTimeout(inativo, tempoDeEspera);

      const actividade = (e) => {
        clearInterval(timeout);
        timeout = setTimeout(inativo, tempoDeEspera);
        console.log(e.type === 'keyup' ? 'teclado' : 'ponteiro');
      };

      ['keyup', 'touchmove' in window ? 'touchmove' : 'mousemove', "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll"].forEach(function(ev) {
        window.addEventListener(ev, actividade);
      });
    }
  },
  mounted() {
    this.autoLogout();
  }
}
</script>

<style scoped>

</style>
