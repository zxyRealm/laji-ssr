/**
 * Created by Administrator on 2017/9/15.
 */
let ERR_OK = 200;
let ERR_NO = 400;
import axios from 'axios'
import { aycn,FetchUpdateInfo } from '../../api'
exports.install = function (Vue, options) {
  // 异步请求统一设置
  Vue.prototype.$ajax = function (url, data, type ,tip=true) {
    return (url,data,type,tip=true) => {
      let format = '';
      if(typeof data !=='string'){
        if(type!=='get'){
          for (let k in data){
            format += k+'='+ data[k] +'&'
          }
          data = format.slice(0,-1)
        }
      }else {
        tip = type;
        type = data;
        data = {}
      }
      // logRequests && console.log(`fetching ${child}...`);
      const cache = api.cachedItems;
      if (cache && cache.has(child)) {
        // logRequests && console.log(`cache hit for ${child}.`);
        return Promise.resolve(cache.get(child))
      } else {
        return new Promise((resolve, reject) => {
          axios({
            method:type,
            url:child,
            baseURL:'http://www.lajixs.com',
            data:data,
            headers:{
              "Content-Type":"application/x-www-form-urlencoded"
            },
            withCredentials:true
          }).then((res)=>{
            const val = res.data;
            if (val) val.__lastUpdated = Date.now();
            cache && cache.set(child, val);
            // logRequests && console.log(`fetched ${child}.`);
            resolve(val);
            if(res.data.returnCode!==200 && tip){
              Message({message:res.data.msg,type:'warning'})
            }else if(res.returnCode===400){
              router.push('/login')
            }
          },reject).catch(reject)

        })
      }
    }

  };

  // 校验文本内容是否包含emoji 表情
  Vue.prototype.$regEmoji = function (val) {
    let regx = /[\ud83c-\ud83e][\udc00-\udfff]|[\u2600-\u27ff]/;
    return regx.test(val)
  };

  // 校验手机号是否合法
  Vue.prototype.$regMob = function (val) {
    let regx = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/;
    return regx.test(val)
  };

  // 添加关注
  Vue.prototype.$addAttention = function (index,type){
    if(!this.$store.state.userInfo.userId){this.$router.push('/login');return false}
    let data;
    if(index>=0){
      let id,name;
      if(type==='fans'){
        id = this.fansList.list[index].userId;
        name = this.fansList.list[index].followUserName;
      }else if(type==='ate') {
        id = this.attentionList.list[index].followId;
        name = this.attentionList.list[index].followUserName;
      }
      data = {
        token:this.$store.state.userInfo.userId,
        followUserName:name,
        followId:id
      };
    }else {
      data = {
        token:this.$store.state.userInfo.userId,
        followUserName:this.readerInfo.pseudonym,
        followId:this.readerInfo.userId
      }
    }
    FetchUpdateInfo('add',data.token,data.followId,data.followUserName).then(json=>{
      if(json.returnCode===200){
        this.$message("关注成功");
        if(index>=0){
          if(type==='fans'){
            this.fansList.list[index].isfollow = true
          }else if(type==='ate') {
            this.attentionList.list[index].isfollow = true
          }
        }else{
          this.readerInfo.isfollow = true
        }
      }
    });

  };
  // 取消关注
  Vue.prototype.$cancelAttention = function(index,type){
    if(!this.$store.state.userInfo.userId){this.$router.push('/login');return false}
    let data;
    if(index>=0){
      let id;
      if(type==='fans'){
        id = this.fansList.list[index].userId
      }else if(type==='ate') {
        id = this.attentionList.list[index].followId
      }
      data = {
        followId:id,
        userid:this.$store.state.userInfo.userId
      };
    }else {
      data = {
        followId:this.readerInfo.userId,
        userid:this.$store.state.userInfo.userId
      }
    }
    this.$alert('', '您要取消关注吗？(⋟﹏⋞)', {
      confirmButtonText: '是',
      showCancelButton:true,
      customClass:'middle confirm-msg-box',
      cancelButtonText:'否',
      callback: action => {
        if(action==='confirm'){
          FetchUpdateInfo('cancel',data.userid,data.followId).then(json=>{
            if(json.returnCode===200){
              this.$message("取消关注");
              if(index>=0){
                if(type==='fans'){
                  this.fansList.list[index].isfollow = false
                }else if(type==='ate'){
                  this.attentionList.list[index].isfollow = false
                }
              }else {
                this.readerInfo.isfollow = false
              }
            }
          })
        }
      }
    });

  };
  Vue.prototype.$formTime = function (date,type,separator) {
    separator = separator===undefined?"-":separator;
    let time = new Date(date) || new Date();
    let Time,T;
    T = time;
    let year = T.getFullYear();
    let mon  = T.getMonth()+1<10?'0'+(T.getMonth()+1):T.getMonth()+1;
    let Date1 = T.getDate()<10?'0' + T.getDate():T.getDate();
    let hour = T.getHours()<10?'0' + T.getHours():T.getHours();
    let min  = T.getMinutes()<10?'0'+T.getMinutes():T.getMinutes();
    let sec  = T.getSeconds()<10?'0'+T.getSeconds():T.getSeconds();
    if(type==='long'){
      Time = year + separator + mon + separator + Date1 + ' ' + hour + ':' + min +':' + sec
    }
    if(type==='middle'){
      Time = year + separator + mon + separator + Date1 + ' ' + hour + ':' + min
    }
    if(type==='sort'||type===undefined){
      Time = year + separator + mon + separator + Date1
    }
    return Time
  };

  // cookies 设置、获取、删除
  Vue.prototype.$cookie = (key,value,expiredays,path,domain)=>{
      // try{
        if(typeof value !== "undefined"){//write
          let cookieValue = key + "=" + encodeURIComponent(value);
          if(expiredays){
            let exdate = new Date();
            exdate.setDate(exdate.getDate()+expiredays);
            cookieValue += ";expires="+exdate.toGMTString()
          }
          cookieValue += ";path=" + (path?path:'/');
          if(domain){
            cookieValue += ";domain=" + domain
          }
          document.cookie = cookieValue;
        }else{//read
          if ( document.cookie.length>0) {
            var cookie = {}, all =  document.cookie, list, item, index;
            if (all === '') {
              return cookie;
            }
            list = all.split('; ');
            for (var i = 0, len = list.length; i < len; i++) {
              item = list[i];
              index = item.indexOf('=');
              var cookieNow;
              try {
                cookieNow = decodeURIComponent(item.substring(index + 1));
              } catch (e) {
                cookieNow = item.substring(index + 1);
              }
              cookie[item.substring(0, index)] = cookieNow;
            }
            return cookie[key];
          }else {
            return null
          }
        }
      // }catch (err){
      //   return null
      // }
  };

  // 用户发送私信

  Vue.prototype.$reLogin = function (url) {

    let href = url || this.$route.path;
    if(!url){
      this.$router.push({
        path:'/login',
        query:{ redirect: href }
      });
    }
    if(this.$store.state.userInfo.userId){
       return href;
    }else {
      return {
        path:'/login',
        query:{ redirect: href }
      }
    }
  };

  // 检测浏览器是否为IE
  Vue.prototype.$isIE = function () {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
      return true;
    }else{
      return false;
    }
  };

  // 格式化私信、回复、书评 内容
  Vue.prototype.$formatMsg = function(val){
    let str = val;
    if(str){
      str = this.$http.trim(str).replace(/\s*\n+\s*/g,'\n  ');
    }
    return str
  };

  // loading 加载遮罩层
  Vue.prototype.$myLoad = function (txt) {
    this.$loading({
      lock: true,
      text: !txt?'数据努力提交中...':txt,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  };

  // 格式化章节内容
  Vue.prototype.$resetChapterTxt = (txt) =>{
    if(txt){
      let reg1 = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/g;
      let reg2 = /<LG>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}<\/?LG ?\/?>/g;
      let newArr = [];
      let idArr = txt.match(reg1);
      let txtArr = txt.replace(/(&nbsp;||\s){2,4}/g,'').split(reg2);
      if(!txt.split(reg2)){
        txtArr = txt.split(reg2).splice(1)
      }
      idArr.forEach(function (item,index) {
        newArr.push({
          id:item,
          content:txtArr[index]
        })
      });
      return newArr;
    }
  };
  Vue.prototype.$trim = (str)=>{
    if(typeof str === 'string'){
      str = str.replace(/^(\s|| )?/,'').replace(/(\s|| )$/,'')
    }
    return str
  }
};
