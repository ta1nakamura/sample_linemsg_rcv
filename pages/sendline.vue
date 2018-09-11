<template>
  <v-layout row wrap  justify-center>
    <v-flex xs12 sm10 md8>
      <v-card>
        <!-- [Tool bar] -->
        <v-toolbar  dark>
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title>SendLine Test </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- <v-list three-line> -->
        <v-list >
          <v-subheader>
             LineUsers
          </v-subheader>
          <!-- [divider] -->
          <template v-for="(item, index) in lineusers">
            <!-- [main: avater and lineuser info] -->
            <v-list-tile :key="item.displayname" avatar>
              <!-- [avater] -->
              <v-list-tile-avatar>
                <img :src="item.picture">
              </v-list-tile-avatar>
              <!-- [contents] -->
              <v-list-tile-content>
                <v-list-tile-title v-html="item.displayname"></v-list-tile-title>
                <v-list-tile-sub-title>lastupdate :{{item.lastupdate | date}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- [input push message] -->
            <v-list-tile v-if="item.isfollow" :key="item.title">
              <v-text-field v-model="item.message" label="send push message"></v-text-field>
              <v-icon :color="item.isfollow ? 'teal' : 'grey'"
               @click="onPushMessage(item)" >chat_bubble</v-icon>
            </v-list-tile>

            <v-divider :key="index"></v-divider>
          </template>

        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    Data(){
     
    },
    created(){
      this.$store.dispatch('fetchLineusers')
    },
    computed:{
      lineusers(){
        return this.$store.getters.lineusers
      },
      drawer:{
        get(){ return this.$store.state.drawerflg },
        set(drawerflg){ this.$store.state.drawerflg = drawerflg }
      },  
    },
    methods:{
      onPushMessage(lineuser){
        // console.log('--[onPushMessage]',lineuser)
        this.$store.dispatch('pushMessage',lineuser);
        lineuser.message = null;
      }
    }
  }
        //   dummy_lineusers: [
        //   {
        //     userid      : "U5b6986839debb86192d011f49fb2553e",
        //     isfollow    : true,
        //     picture     : "https://profile.line-scdn.net/0m03da889c7251f88970521db201b8b0016bae261ff104",
        //     displayname : "TaichiNakamura(Ted)",
        //     lastupdate  : 1531455984782,

            
        //   },
        //   {
        //     userid      :  "Uc5943d1660983a3b628916e0efa1d715",
        //     isfollow    : true,
        //     picture     : "https://profile.line-scdn.net/0m039b89f47251b8761aeb7cf993f28e03f679a897d8eb",
        //     displayname : "chanon",
        //     lastupdate  : 1531370145206,
        //     // message :null,
        //   },
        //   {
        //     userid      : "U5b6986839debb86192d011f49fb2553e",
        //     isfollow    : true,
        //     picture     : 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
        //     displayname : 'Oui oui',
        //     lastupdate  : 1531370145206,
        //     message : null
        //   },
        // ]
</script>

