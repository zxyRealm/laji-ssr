/**
 * Created by Administrator on 2018/3/14.
 */
import Vue from 'vue'
const Consume = {
  state:{
    formData:{
      content:'',
      count:'188'
    },
    messageContent:'',
    visible:false,
    type:'',
    title:''
  },
  actions:{
      init({commit,dispatch},data){
          console.log(data.type,data.add,'查看看');
          switch (data.type){
            case 'reward':
              commit('setCount',188);
              break;
            default:
              commit('setCount',1)
          }
          commit("setData",data);
          // commit("setValue",data.add?data.add:'');
          // commit('changeType',data.type);
          dispatch("close")
      },
      close({commit}){
          commit('changeVisible')
      },
      updateCount({commit},num){
        commit("setCount",num)
      }
  },
  mutations:{
    changeType(state,type){
      state.type = type
    },
    changeVisible(state){
      state.visible?state.visible = false:state.visible = true;
    },
    setCount(state,val){
      state.formData.count = val
    },
    setData(state,val){
      for(let k in val){
        Vue.set(state,k,val[k])
      }
    },
    setValue(state,val){
      state.title = val;
    }
  },
  getters:{

  }
};
export default {
  Consume
}
