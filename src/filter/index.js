/**
 * Created by Administrator on 2017/11/27.
 */
import Vue from 'vue'

// 数字过滤器
Vue.filter('number',function (value) {
  let rxxNum = parseInt(value);
  if(rxxNum>1000 && rxxNum){
    rxxNum= (rxxNum/10000).toFixed(1) + 'w';
  }else{
    rxxNum = '0.1w';
  }
  return rxxNum
});
// 时间格式化过滤器
Vue.filter('time',function (value,type,separator) {
  let T,Time;
  if(separator===undefined){
    separator = '-'
  }
  if(value===undefined || value===''){
    T = new  Date()
  }else {
    T = new Date(value)
  }
  let year = T.getFullYear();
  let years = String(year).slice(2);
  let mon  = T.getMonth()+1<10?'0'+(T.getMonth()+1):T.getMonth()+1;
  let date = T.getDate()<10?'0' + T.getDate():T.getDate();
  let hour = T.getHours()<10?'0' + T.getHours():T.getHours();
  let min  = T.getMinutes()<10?'0'+T.getMinutes():T.getMinutes();
  let sec  = T.getSeconds()<10?'0'+T.getSeconds():T.getSeconds();

  if(type==='long'){
    Time = year + separator + mon + separator + date + ' ' + hour + ':' + min +':' + sec
  }
  if(type==='middle'){
    Time = year + separator + mon + separator + date + ' ' + hour + ':' + min
  }
  if(type==='special'){
    Time = years + separator + mon + separator + date
  }
  if(type==='sort'||type===undefined){
    Time = year + separator + mon + separator + date
  }

  return Time
});

// 文本内容字数统计
Vue.filter("words",function (value){
  let sLen = 0;
  let str = value;
  try{
    //先将回车换行符做特殊处理
    str = str.replace(/(\r\n+|\s+| )+/g,"龘");
    //处理英文字符数字，连续字母、数字、英文符号视为一个单词
    str = str.replace(/[\x00-\xff]/g,"m");
    //合并字符m，连续字母、数字、英文符号视为一个单词
    str = str.replace(/m+/g,"*");
    //去掉回车换行符
    str = str.replace(/龘+/g,"");
    //返回字数
    sLen += str.length;
  }catch (e){
    console.log(e)
  }
  return sLen;
});

