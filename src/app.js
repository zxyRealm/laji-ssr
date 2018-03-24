/**
 * Created by Administrator on 2018/3/20.
 */
import Vue from 'vue'
import App from './App.vue'
import './assets/js/common'
import Consume from './components/custom/src/consume.vue'
import filter from './filter'
import myIcon from './components/custom/icon.vue'
import Hint from './components/common/hint.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import titleMixin from './util/title'
import * as filters from './util/filters'

import ElementUI from 'element-ui'
Vue.use(ElementUI);
Vue.component(Consume.name,Consume);
Vue.component(myIcon.name,myIcon);
Vue.component(Hint.name,Hint);
Vue.use(require('vue-wechat-title'));
Vue.use(require('./assets/js/fun'));
Vue.prototype.$md5 = require('md5');
// Vue.prototype.$consume = Consume; //打赏、小米椒、金椒


// mixin for handling title
Vue.mixin(titleMixin);

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  const store = createStore();
  const router = createRouter();

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router);

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    filter,
    render: h => h(App)
  });

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
