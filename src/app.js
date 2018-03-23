/**
 * Created by Administrator on 2018/3/20.
 */
import Vue from 'vue'
import App from './App.vue'
import './assets/js/common'
import axios from 'axios'
// import Consume from './components/custom/custom'
import filter from './filter'
import myIcon from './components/custom/icon.vue'
import Hint from './components/common/hint.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import titleMixin from './util/title'
import * as filters from './util/filters'
import { aycn } from './api'
import ElementUI from 'element-ui'
Vue.use(ElementUI);
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

  // 全局导航钩子
  // router.beforeEach((to, from, next) => {
  //   let uid = Number(router.app.$cookie('user_id'));
  //   // let uid = 0
  //   if(to.name==='Login' && uid){
  //     next({
  //       path: '/',
  //     });
  //     return false
  //   }
  //   if(uid && Number(to.params.uid)===uid){
  //     if(to.name==='Reader'){
  //       next({
  //         path:'/user/index'
  //       })
  //     }else if(to.name==='bookShelf'){
  //       next({
  //         path:'/user/shelf'
  //       })
  //     }else if(to.name==='bookReview'){
  //       next({
  //         path:'/user/comment/book/1'
  //       })
  //     }else if(to.name==='spitSlot'){
  //       next({
  //         path:'/user/comment/chapter'
  //       })
  //     }else if(to.name==='Attention'){
  //       next({
  //         path:'/user/attention'
  //       })
  //     }else if(to.name==='Fans'){
  //       next({
  //         path:'/user/fans'
  //       })
  //     }
  //   }
  //   // 判断该路由是否需要登录权限
  //   if (to.meta.requireAuth) {
  //     if(uid){
  //       aycn('/person-checkLoginState','post',false).then(res=>{
  //         if(res.data.returnCode===200){
  //           if(to.path.indexOf('/author')>-1){
  //             if(res.data.data===1 && to.name!=='authorApply'){
  //               next({
  //                 path:"/author/apply"
  //               })
  //             }else {
  //               if(res.data.data===2 &&!from.name&&to.name==='authorApply'){
  //                 next({
  //                   path:'/author/writing/index'
  //                 })
  //               }else {
  //                 next()
  //               }
  //             }
  //           }else {
  //             next()
  //           }
  //         }else{
  //           router.app.$options.store.state.userInfo = {};
  //           next({
  //             path: '/login',
  //             query: {redirect: to.fullPath}
  //           })
  //         }
  //       })
  //     }else {
  //       router.app.$options.store.state.userInfo = {};
  //       next({
  //         path: '/login',
  //         query: {redirect: to.fullPath}
  //       })
  //     }
  //   }else if(to.fullPath==='/login'){
  //     next({
  //       path: '/login',
  //       query: {redirect: from.fullPath}
  //     })
  //   }else {
  //     next();
  //   }
  // });
  //
  //
  //
  // router.afterEach(() => {
  //
  //
  // });



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
