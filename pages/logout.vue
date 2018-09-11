<template>
<v-layout row wrap >
    <!-- [sample xs12] -->
    <!-- <v-flex v-for="i in 12" :key="`1${i}`" xs1  >
        <v-card dark color="secondary">
          <v-card-text class="px-0">{{i}}</v-card-text>
        </v-card>
    </v-flex> -->
    <v-flex xs12 text-xs-left>
        <v-card>
            <v-toolbar  dark>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
                <v-toolbar-title>Login 
                    <span v-if="currentUser">[{{currentUser.displayname}}]</span>
                    <span v-else>[No Sigin]</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <h1>SignOut ?</h1>
                <h2 v-if="currentUser">You: {{ currentUser.name }}</h2>

                <v-btn @click="signOut" >SignOut
                    <v-icon large right > fa-sign-out</v-icon>
                </v-btn>
        </v-card>
    </v-flex>
</v-layout>
</template>
<script>
export default {
  data() {
    return {
      newTask: ""
    };
  },
  methods: {
    signOut() {
      console.log("--click [signOut]");
      this.$store.dispatch("logout");
    }
  },
  computed: {
    currentUser() {
      if (this.$store.getters.isAuthenticated) {
        return this.$store.getters.currentUser;
      } else {
        return null;
      }
    },
    drawer: {
      get() {
        return this.$store.state.drawerflg;
      },
      set(drawerflg) {
        this.$store.state.drawerflg = drawerflg;
      }
    }
  }
};
</script>