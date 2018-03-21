/**
 * Created by Administrator on 2018/1/12.
 */
import Vue from 'vue';
let vueTipBox = Vue.extend(require('./vueTip.vue'));
let instance;

var VueTip = function(options){
  if(typeof options === 'string'){
    options = {
      message: options
    }
  }
  //生成组件
  instance = new vueTipBox({
    data: options
  });

  //组件需要挂载在dom元素上
  instance.vm = instance.$mount();

  //根据不同的类型，设置不同消息的背景颜色
  if(options.type){
    instance.vm.$el.children[0].className += ` icon__${options.type}`;
  }
  document.body.appendChild(instance.vm.$el);
  return instance.vm;
};

const type = ['success', 'info', 'warning', 'error','loading'];

type.forEach((type)=>{
  VueTip[type] = options =>{
    if(typeof options === 'string'){
      options = {
        message: options
      }
    }
    options.type = type;
    return VueTip(options);
  }
});

export default VueTip;
