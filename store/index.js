import Vuex from 'vuex'
import { STATUS_CODES } from 'http';
const SIGIN_TIMEOUT = 600

const createStore = ()=>{
    return new Vuex.Store({
        state: {
            drawerflg: false, // left side menu
            lineuser: null,   // ?, line object for access user
            lineusers:[],     //for admin page from mongoDB
            todos: [],
        },
        mutations:{
            setLineuser(state,user){
                console.log('--[$sotre.mutations]setLineuser')
                state.lineuser = user
                // state.idToken = user.id_token
            },
            clearAuthData(state){
                state.lineuser = null;
                // state.idToken = null;
            }
        },
        actions:{
            nuxtServerInit(vuexContext,context){
                console.log('--[$sotre.nextServerInit]')
                if (context.req.session.lineuser) {
                    // vuexContext.commit('setLineuser', context.req.session.lineuser)
                    vuexContext.state.lineuser = context.req.session.lineuser;
                }
                else{
                    console.log('---[$sotre.nextServerInit] no lineuser')
                }
            },
            async logout(vuexContext) { //Delte Session Data
                try{
                    const res = await this.$axios.post('/api/logout')
                    vuexContext.state.todos = []; //clear todos
                    vuexContext.commit('clearAuthData')
                    this.$router.push('/dashboard')
                }
                catch(err){console.log(err)}  
            },
            async addTodo(vuexContext,newTask){
                const config = { headers: { 'x-auth':vuexContext.state.lineuser.id_token } }
                try{
                    const res = await this.$axios.post('/api/todos',
                     { "text": newTask }, config)
                    vuexContext.dispatch('fetchTodo');
                }
                catch(err){
                    console.log(err);
                }
            },
            //[ChangeTodo]
            async changeTodo(vuexContext,todo){

                const config = { headers: { 'x-auth': vuexContext.state.lineuser.id_token } }
                try{
                    const res = await this.$axios.patch(`/api/todos/${todo._id}`,
                        {"completed":!todo.completed},config)
                        vuexContext.dispatch('fetchTodo');
                }
                catch(err){
                    console.log(err);
                }
            },
            //[fetchTodo]
            async fetchTodo(vuexContext){
                console.log('--[fetchTodo]')
                const config = { headers: { 'x-auth':vuexContext.state.lineuser.id_token } }
                try{
                    const res = await this.$axios.get('/api/todos',config)
                    vuexContext.state.todos = []; //clear todos
                    for (var i = 0; i < res.data.todos.length; i++) {
                        vuexContext.state.todos.push(res.data.todos[i]);
                    }
                }
                catch(err){
                    console.log(err);
                }
            },
            //[pushMessage to Lineid]
            async pushMessageToSelf(vuexContext,sendline){
                console.log('--[store.pushMessageSelf]',sendline)
                const config = { headers: { 'x-auth':vuexContext.state.lineuser.id_token } }
                try{
                    const res = await this.$axios.post('/api/line_push_self',{
                        "lineuserid":sendline.lineuserid,
                        "message":sendline.message
                    },
                    config)
                }catch(err){
                    console.log(err);
                }
            },
            //[pushMessage to Lineid]
            async pushMessage(vuexContext,sendline){
                console.log('--[store.pushMessage]',sendline)
                const config = { headers: { 'x-auth':vuexContext.state.lineuser.id_token } }
                try{
                    const res = await this.$axios.post('/api/line_push',{
                        "lineuserid":sendline.lineuserid,
                        "message":sendline.message
                    },
                    config)
                }catch(err){
                    console.log(err);
                }
            },
            //[pushMessage to dbuserid]
            async pushMessageToDbuserid(vuexContext,{userid,message}){
                console.log('--[store.pushMessageToDbuserid]',userid)
                console.log('--[store.pushMessageToDbuserid]',message)
                const config = { headers: { 'x-auth':vuexContext.state.lineuser.id_token } }
                try{
                    const res = await this.$axios.post('/api/line_push_dbuserid',{
                        "dbuserid": userid,
                        "message" : message
                    },
                    config)
                }catch(err){
                    console.log(err);
                }
            },
            //[GET lineusers]
            async fetchLineusers(vuexContext){
                const config = { headers: { 'x-auth':vuexContext.state.lineuser.id_token } }
                try{
                    const res = await this.$axios.$get('/api/lineusers',config)
                    vuexContext.state.lineusers = res.lineusers
                }catch(err){
                    console.log(err)
                }
            },
        },
        getters:{
            todos(state) {
                return state.todos;
            },
            currentUser(state){
                return state.lineuser
            },
            isAuthenticated(state){
                return state.lineuser !=null
            },
            lineusers(state){
                return state.lineusers;
            },
        }
    });
}
export default createStore