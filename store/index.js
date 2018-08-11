import Vuex from 'vuex'
import { STATUS_CODES } from 'http';
const SIGIN_TIMEOUT = 600

const createStore = ()=>{
    return new Vuex.Store({
        state: {
            lineuser: null, // ?, line object for access user
        },
        mutations:{
            setLineuser(state,user){
                console.log('--[$sotre.mutations]setLineuser')
                state.lineuser = user
                // state.idToken = user.id_token
            },
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
        },
        getters:{
            currentUser(state){
                return state.lineuser
            },
        }
    });
}
export default createStore