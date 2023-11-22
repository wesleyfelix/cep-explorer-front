<template>
  <title>Entrar</title>
  <BoxCentralize>
    <q-card-section>
      <p class="text-left" for="login">Login: </p>
      <q-input
          v-model="login"
          label="login"
      />
    </q-card-section>



    <q-card-section>
      <p class="text-left" for="senha">Senha: </p>
      <q-input
          v-model="senha"
          type="password"
          label="senha"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="info" @click="entrar">Entrar</q-btn>
    </q-card-actions>
  </BoxCentralize>


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

import {defineComponent} from "vue";
import BoxCentralize from "@/components/BoxCentralize.vue";
import axios from "axios";
import { ref } from 'vue'




export default defineComponent({
  components: {BoxCentralize},
  data() {
    return {
      login: null,
      senha: null,
      small: ref(false),
      msgErro : null
    };
  },
  methods: {
    entrar() {
      if(this.login == null || this.senha == null){
        this.msgErro = 'Login e senha são obrigatórios';
        this.small = true;
      }else{
        this.obterToken();
      }
    },

    obterToken(){
      const data = {
        login: this.login,
        senha: this.senha
      };


      axios.post("http://localhost:8081/usuario/login",  data )
          .then(response => {
            this.$store.commit('setToken', response.data.token);
            this.$store.commit('setUsuario', this.login);
            this.$router.push("/import");
          })
          .catch(error => {
            this.msgErro = "Usuario não cadastrado!: " + error;
            this.small = true;
            console.log(error);
          });
    }
  },

})

</script>
