<template>
  <!-- sample xs12 -->
  <!-- <v-flex v-for="i in 12" :key="`1${i}`" xs1  >
    <v-card dark color="secondary">
      <v-card-text class="px-0">{{i}}</v-card-text>
    </v-card>
  </v-flex> -->
  <v-flex xs12 sm8 md7 >
    <v-card>
    <!-- [Toolbar] -->
    <v-toolbar color="teal" dark>
      <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
      <v-toolbar-title>Your TodoList</v-toolbar-title>
    </v-toolbar>

    <!-- [Header] -->
    <v-list  subheader>
      <!-- <v-subheader>Account Information</v-subheader> -->

      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-title>Your Name</v-list-tile-title>
          <v-list-tile-sub-title v-if="currentUser"> {{ currentUser.displayname }}</v-list-tile-sub-title>
          <v-list-tile-sub-title v-else> No Sigin</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile >
        <v-list-tile-content>
          <v-list-tile-title>Task Status</v-list-tile-title>
          <v-list-tile-sub-title>completed yy / xx : zz %</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    
    <!-- [Add Todo] -->
    <v-subheader>Add new task</v-subheader>
      <v-list-tile >
        <v-text-field v-model="newTask"></v-text-field>
        <v-btn fab dark color="red" @click="createTask">
          <v-icon dark>add</v-icon>
    </v-btn>
      </v-list-tile>
    </v-list>
    <!-- [========= divider line ========] -->
     <v-divider></v-divider>

     <!-- [TodoList] -->
      <v-subheader>Todo Lists</v-subheader>
      <v-list-tile v-for="todo in todos" 
      v-if="!todo.completed" v-bind:key="'row_task_' + todo._id">
        <v-list-tile-action>
          <v-checkbox   @click.self="changeStatus(todo)" 
           ></v-checkbox>
        </v-list-tile-action>
        <v-list-tile-content @click="changeStatus(todo)">
          <v-list-tile-title>{{todo.text}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <!-- ================= -->
      <v-divider></v-divider>
      <!-- [Completed List] -->
      <v-subheader>Completed Lists</v-subheader>
      <v-list-tile  v-for="todo in todos" 
      v-if="todo.completed" v-bind:key="'row_task_' + todo._id" >
        <v-list-tile-action>
          <v-checkbox   @click.self="changeStatus(todo)" 
          v-model="todo.completed" ></v-checkbox>
        </v-list-tile-action>

        <v-list-tile-content  @click="changeStatus(todo)">
          <v-list-tile-title>{{todo.text}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </v-card>
  </v-flex>
  
</template>
<script>
export default {
    data(){
      return {
        notifications: false,
        sound: false,
        newTask:''
      }
    },
    computed:{
      // email(){
      //   return this.$store.getters.currentUserMail
      // },
      currentUser(){
        if(this.$store.getters.isAuthenticated){
          return this.$store.getters.currentUser;
        }
        else{
          return null;
        } 
      },
      todos(){
        return this.$store.getters.todos
      }
    },
    methods:{
      createTask(){
        console.log('--createTask', this.newTask)
        if(!this.newTask)return;
        this.$store.dispatch('addTodo',this.newTask);
      },
      changeStatus(todo){
        this.$store.dispatch('changeTodo',todo)
      }
    },
    created() {
      console.log('--created()')
      this.$store.dispatch('fetchTodo')
    }
}
</script>

