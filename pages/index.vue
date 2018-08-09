<template>
<div>

<!-- [main] -->
<v-content>
  <v-container fluid>
  <h1> Nuxt App template </h1>
  <pre>
    - Nuxt
    - Vuetify module
    - Expless
    - Axios module
    - Mongdb,Mongoose
    - Heroku
  </pre>
  <v-btn @click="onClickTest">/api/todos</v-btn>
  <p>{{items}}</p>

  </v-container>
</v-content>
<!-- [footer] -->
<v-footer  app inset>
      <span class="white--text">&copy; 2018 footer</span>
</v-footer>

</div>
</template>
<script>
export default {
  data() {
    return {
      items:null
    };
  },
  async asyncData(context){
    console.log('--asyncData');
    try{
      let data = await context.app.$axios.$get('/api/test/3');
      console.log(data);
    }catch(e){
      console.log(e);
      context.error(e)
    }
    // return context.app.$axios.$get('/api/todos')
  },
  created(){
    console.log('--crated')
  },
  methods:{
    async onClickTest(context){
      console.log('--onClickTest');
      try{
        let data = await this.$axios.$get('/api/todos');
        console.log(data);
        this.items = data.todos
      }catch(e){
        console.log(e);
      }
    }
  }
};
</script>

