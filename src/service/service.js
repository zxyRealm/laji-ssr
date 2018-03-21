/**
 * Created by Administrator on 2018/3/9.
 */
import Axios from 'axios'
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
exports.install = function(_this,option) {
  // 异步请求
  _this.prototype.$aycn = function (url, data,callBack, type,show) {
    let loading;
    url = '/api'+url;
    if(typeof data ==='function'){
      callBack = data;
      data = {};
    }else {
      let format = '';
      for (let k in data){
        format += k+'='+ data[k] +'&'
      }
      data = format.slice(0,-1)
    }
    if(show){
      loading = this.$loading({
        lock: true,
        text: '数据努力提交中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    if(type && type!=='post'){
      Axios.get(url,data).then( res =>{
        if(show){
          this.$nextTick(()=>{
            this.$loading().close()
          })
        }
        callBack(res.data)
      }).catch( err =>{
        if(show){
          this.$nextTick(()=>{
            this.$loading().close()
          })
        }
        console.log(err)
      })
    }else{
      Axios.post(url,data).then( res => {
        if(show){
          this.$nextTick(()=>{
            this.$loading().close()
          })
        }
        callBack(res.data)
      }).catch( err => {
        if(show){
          this.$nextTick(()=>{
            this.$loading().close()
          })
        }
        console.log(err)
      })
    }
  }
};
