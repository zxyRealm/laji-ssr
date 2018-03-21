/**
 * Created by Administrator on 2017/8/31.
 */

import Vue from 'vue';
import { PopupManager } from 'element-ui/src/utils/popup';
import { isVNode } from 'element-ui/src/utils/vdom';
let ConsumeConstructor = Vue.extend(require('./src/consume.vue'));

let instance;
let instances = [];
let seed = 1;
let Consume = function(options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  if (typeof options === 'string') {
    options = {
      type: options
    };
  }
  let userOnClose = options.onClose;
  let id = 'consume_' + seed++;

  options.onClose = function() {
    Consume.close(id, userOnClose);
  };
  instance = new ConsumeConstructor({
    data: options
  });
  instance.id = id;
  if (isVNode(instance.type)) {
    instance.$slots.default = [instance.type];
    instance.type = null;
  }
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  instance.dom.style.zIndex = PopupManager.nextZIndex();
  instances.push(instance);
  return instance.vm;
};


Consume.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
};

Consume.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};
export default Consume;
