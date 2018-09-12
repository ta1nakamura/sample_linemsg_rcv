<template>
<v-layout fill-height>
<!-- [main] -->
<v-flex xs11 text-xs-left>
  <v-card>
    <h1> sample_linemsg_rcv </h1>
    <pre>
      [Component]
      - Nuxt 1.4, axios, vuetify,
      - Mongdb,Mongoose
      - Expless
      [Server]
      - Heroku
      [Function]
      - dummyLogin (test for LINELOGIN)
      - LINELOGIN
      - TodoList
      - LINE Send/recieveM essage
      [LINE SITE]
      - <a href="https://developers.line.me/console/">Line Developper Console</a> 
      - <a href="https://developers.line.me/ja/docs/messaging-api/"> LINE Message API</a>
      <a href="https://developers.line.me/ja/reference/messaging-api/#message-objects"> LINE Message Format</a>
    </pre>
  </v-card>

  <v-card>
    <v-card-text>
      <h2>Login Test</h2>
      <v-text-field label="input dummy lineuserid" v-model="dummyid"></v-text-field>
      <v-btn @click="onDummyLogin()">Dummy-Login</v-btn>
      <v-btn @click="location('/api/auth')" color="green">LINE-Login</v-btn>
      <v-divider></v-divider>
      <h2>this.$store.getters.currentUser</h2>
      {{currentUser}}
      <hr>
    </v-card-text>
    
  </v-card>
</v-flex>

</v-layout>
</template>

<script>
export default {
  data() {
    return {
      dummyid:'test',
      // items:null
    };
  },
  async asyncData(context){
    console.log('--asyncData');
    try{
      // let data = await context.app.$axios.$get('/api/test/3');
      // console.log(data);
    }catch(e){
      console.log(e);
      context.error(e)
    }
  },
  created(){
    console.log('--crated')
  },
  computed:{
    currentUser(){
      return this.$store.getters.currentUser;
    },
  },
  methods:{
    //Goto Outside
    location(url){
        console.log('--methods.locathon',url)
        location.href=url;
    },
    async onDummyLogin(context){
      console.log('--onDummyLogin');
      if(!this.dummyid) {
        console.log('no dumyid')
        return
      }
      try{
        let data = await this.$axios.$post('/api/dummylogin',{
          lineuserid : this.dummyid
        });
        console.log(data);
        this.$store.commit('setLineuser', data.lineuser);
      }catch(e){
        console.log(e);
      }
    }
  }//end methods
};
</script>

