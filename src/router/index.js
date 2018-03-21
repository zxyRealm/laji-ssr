/**
 * Created by Administrator on 2017/7/20.
 */

import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'
import VueAxios from 'vue-axios'
const Home = () => import("../components/home/home.vue");
import authorIndex from '../components/author/index.vue'
import Detail from '../components/book/detail.vue'
import Rank from '../components/ranking/rank.vue'
import rankLoading from '../components/ranking/rankLoading.vue'
import Total from '../components/classify/total.vue'
import Welfare from '../components/author/welfare.vue'
import Charge from '../components/charge/index.vue'
import Error from '../components/error/404.vue'
import Search from '../components/classify/search.vue'
import Chapter from '../components/book/chapter.vue'
import ChapterList from '../components/book/chapter_list.vue'
import Login from '../components/loginRegister/login.vue'
import getBackPassword from '../components/loginRegister/getBackPassword.vue'
import totalLoading from  '../components/classify/totalLoading.vue'
import authorCenter from '../components/author/center.vue'
import Register from '../components/loginRegister/register.vue'
import addBook from '../components/author/addBook.vue'
import addChapter from '../components/author/addChapter.vue'
import editChapter from '../components/author/eidtChapter.vue'
import authorChapterList from '../components/author/chapterList.vue'
import draftList from '../components/author/draftList.vue'
import Income from '../components/author/income.vue'
import authorMessage from '../components/author/message.vue'
import authorNotice from '../components/author/notice.vue'
import authorApply from '../components/author/apply.vue'
import authorTidings from '../components/author/tidings.vue'

import userIndex from '../components/user/index.vue'
import userCenter from '../components/user/center.vue'
import userMessage from '../components/user/message.vue'
import userComment from '../components/user/comment.vue'
import userChat from '../components/user/chat.vue'
import userFans from '../components/user/fans.vue'
import userShelf from '../components/user/shelf.vue'
import userAttention from '../components/user/attention.vue'
import userRecord from '../components/user/record.vue'
import userWallt from '../components/user/wallet.vue'
import userPersonal from '../components/user/personal.vue'

import commonNews from '../components/common/news.vue'
import Download from '../components/common/download.vue'

import readerIndex from '../components/reader/index.vue'
import readerFans from '../components/reader/fans.vue'
import readerCenter from '../components/reader/center.vue'
import readerAttention from '../components/reader/attention.vue'
import readerShelf from '../components/reader/bookshelf.vue'
import readerSpit from '../components/reader/spit_slot.vue'
import readerReview from '../components/reader/book_review.vue'


// Vue.prototype.$ajax= Axios;
Vue.use(Router,VueAxios,Axios);
Vue.config.productionTip = false;
const routes = [
  { path:"*", component: Error },
  { path:'/error/404', component:Error },

  { path: '/index', name: 'index', meta:{title:'辣鸡小说'}, component: Home },

  // { path: '/latest', name: 'latest', meta:{title:'全网小说-辣鸡小说网'}, component: Latest },
  // 搜索
  { path:'/search/:keywords', redirect:'/search/:keywords/1' },
  { path: '/search/:keywords/:page', name: 'Search', meta:{title:'全网搜索-辣鸡小说网'}, component: Search },
  // 书籍详情信息
  { path: '/book/:bid', name: 'detail', meta:{title:'全网小说-辣鸡小说网'}, component: Detail },
  { path:'/chapter/:cid', name:'Chapter', meta:{title:'阅读页-辣鸡小说'}, component:Chapter },

  { path:'/chapter-list/:bid', name:'chapterList', meta:{title:'章节列表-辣鸡小说'}, component:ChapterList },
  { path: '/login', name: 'Login', meta:{title:'登陆-辣鸡小说'}, component: Login },
  { path: '/register', name: 'Register', meta:{title:'注册-辣鸡小说'}, component: Register },
  // 忘记密码、修改密码
  { path: '/modify_page', name: 'modifyPage', meta:{title:'忘记密码-辣鸡小说',requireAuth: true}, component: getBackPassword },
  { path: '/find_page', name: 'findPage', meta:{title:'修改密码-辣鸡小说'}, component: getBackPassword },
  // 书库
  { path:'/class_total', redirect:'/class_total/0/0/0/0/0/1/0' },
  { path:'/class_total',component:Total ,
    children: [
      { path:':op1/:op2/:op3/:op4/:op5/:page/:op6', name:'totalChild', meta:{title:'全网小说-辣鸡小说'}, component:totalLoading }
    ]
  },
  // 作者福利
  { path: '/welfare', name: 'Welfare', meta:{title:'网站福利-辣鸡小说'}, component: Welfare },
  { path: '/author', meta: {title:'作者中心-辣鸡小说',requireAuth: true}, redirect: '/author/writing/index' },
  { path: '/author/writing', meta: {title:'作者中心-辣鸡小说',requireAuth: true}, redirect: '/author/writing/index' },
  // 作者中心
  { path: '/author', component: authorIndex, name:'author', meta: {requireAuth: true},
    children:[
      { path: 'writing/index', name: 'authorCenter', meta: {title:'作者中心-辣鸡小说',requireAuth: true}, component:authorCenter },
      // 创建新书
      { path: 'writing/indite', name:'addBook', meta: {title:'创建新书-辣鸡小说',requireAuth: true}, component:addBook },
      // 创建新章节
      { path: 'writing/addChapter/:bid', name:'addChapter', meta: {title:'创建章节-辣鸡小说',requireAuth: true}, component:addChapter },
      // 作者编辑章节内容
      { path: 'writing/editChapter/:cid', name:'editChapter', meta: {title:'编辑章节内容-辣鸡小说',requireAuth: true}, component:editChapter },
      // 获取章节列表信息
      { path: 'writing/chapterList/:bid', name:'ChapterList', meta: {title:'章节列表-辣鸡小说',requireAuth: true}, component:authorChapterList },
      // 草稿箱章节列表
      { path: 'writing/draft/:bid', name:'DraftList', meta: {title:'草稿箱-辣鸡小说',requireAuth: true}, component:draftList },

      // 作者编辑书籍信息
      { path: 'writing/editBook/:bid', name:'EditBook', meta: {title:'编辑书籍信息-辣鸡小说',requireAuth: true}, component:addBook },
      // 作者收入
      { path:'income', redirect:'income/all' },
      { path:'income/all', name: 'allIncome', meta: {title:'作者收入-辣鸡小说',requireAuth: true}, component: Income },
      // 作者收入月报
      { path:'income/mon', name: 'monIncome', meta: {title:'作者收入-辣鸡小说',requireAuth: true}, component: Income },
      { path:'income/book/:bid', name: 'bookIncome', meta: {title:'作者收入-辣鸡小说',requireAuth: true}, component: Income },

      // 作者收获辣椒
      { path:'message', redirect:'message/bcom' },
      { path:'message/bcom', name: 'messageBcom', meta: { requireAuth: true }, component:authorMessage },
      { path:'message/ccom', name: 'messageCcom',meta: { requireAuth: true }, component:authorMessage },
      { path:'message/harvest', name: 'messageHarvest', meta: { requireAuth: true }, component:authorMessage },

      // 消息吐槽
      { path:'tidings', name: 'authorTiding', meta: {requireAuth: true}, component:authorTidings },

      // 站内通知
      { path:'notice', name: 'authorNotice', meta: { title:'站内通知-辣鸡小说',requireAuth: true }, component:authorNotice },

      // 申请作者
      { path:'apply', name: 'authorApply',meta: { title:'申请作者-辣鸡小说',requireAuth: true }, component:authorApply }
    ]
  },

  // 个人中心
  {
    path:"/user/:type", name:"User", meta: {requireAuth: true}, component:userIndex,
    children:[
      {
        path:'/user/index', name:"userIndex", meta: {requireAuth: true,topName:"User"}, component:userCenter
      },
      {
        path:'/user/shelf', name:"userShelf", meta: {requireAuth: true,topName:"User"}, component:userShelf
      },
      {
        path:'/user/record', name:"userRecord", meta: {requireAuth: true,topName:"User"}, component:userShelf
      },
      {
        path:'/user/wallet', redirect:'/user/wallet/charge/1'
      },
      {
        path:'/user/wallet/charge', redirect:'/user/wallet/charge/1'
      },
      {
        path:'/user/wallet/pepper', redirect:'/user/wallet/pepper/1'
      },
      {
        path:'/user/wallet/consume', redirect:'/user/wallet/consume/1'
      },
      {
        path:'/user/wallet/reward', redirect:'/user/wallet/reward/1'
      },
      {
        path:'/user/wallet/annuum', redirect:'/user/wallet/annuum/1'
      },
      // 充值记录
      {
        path:'/user/wallet/charge/:page', name:"walletCharge", component:userWallt
      },
      // 消费记录
      {
        path:'/user/wallet/consume/:page', name:"walletConsume", meta: {requireAuth: true,topName:"User"}, component:userWallt
      },
      // 金椒记录
      {
        path:'/user/wallet/pepper/:page', name:"walletPepper", meta: {requireAuth: true,topName:"User"}, component:userWallt
      },
      // 打赏记录
      {
        path:'/user/wallet/reward/:page', name:"walletReward", meta: {requireAuth: true,topName:"User"}, component:userWallt
      },
      // 小米椒记录
      {
        path:'/user/wallet/annuum/:page', name:"walletAnnuum", meta: {requireAuth: true,topName:"User"}, component:userWallt
      },
      {
        path:'/user/comment', redirect:'/user/comment/book/1'
      },
      {
        path:'/user/comment/book/:page', name:"commentBook", meta: {requireAuth: true,topName:"User"}, component:userComment
      },
      {
        path:'/user/comment/chapter', name:"commentChapter", meta: {requireAuth: true,topName:"User"}, component:userComment
      },
      {
        path:'/user/message', redirect:'/user/message/notice'
      },
      {
        path:'/user/message/comment', name:"userComment", meta: {requireAuth: true,topName:"User"}, component:userMessage
      },
      {
        path:'/user/message/notice', name:"userNotice", meta: {requireAuth: true,topName:"User"}, component:userMessage
      },
      {
        path:'/user/message/letter', name:"userLetter", meta: {requireAuth: true,topName:"User"}, component:userMessage
      },
      {
        path:'/user/message/letter/:rid', redirect:'/user/message/letter/:rid/1'
      },
      {
        path:'/user/message/letter/:rid/:page', name:"userChat", meta: {requireAuth: true,topName:"User"}, component:userChat
      },
      {
        path:'/user/charge', name:"userCharge", meta: {title:'充值中心-辣鸡小说',requireAuth: true,topName:"User"}, component:Charge
      },
      {
        path:'/user/attention', name:"userAttention", meta: {requireAuth: true,topName:"User"}, component:userAttention
      },
      {
        path:'/user/fans', name:"userFans", meta: {requireAuth: true,topName:"User"}, component:userFans
      },
      {
        path:'/user/personal', name:"userPersonal", meta: {requireAuth: true,topName:"User"}, component:userPersonal
      }
    ]
  },

  // 网站公告
  { path:'/news/:id', meta:{title:'网站公告-辣鸡小说'}, component: commonNews },
  // 书籍排行榜
  { path:'/rank', meta:{title:'全网书籍排行-辣鸡小说'}, redirect:'/rank/golden/month/1' },
  { path:'/rank/golden', redirect:'/rank/golden/month/1' },
  { path:'/rank/latest', redirect:'/rank/latest/all/1' },
  { path:'/rank/:type', redirect:'/rank/:type/week/1' },
  { path: '/rank/:type', name: 'rank', component: Rank,
    children:[
      { path:':time/:page', name:'rankChild', meta:{title:'全网书籍排行-辣鸡小说'}, component:rankLoading }
    ]
  },

  // 充值中心
  { path: '/charge', name: 'Charge', meta: {requireAuth: true, title:'充值中心-辣鸡小说'}, component: Charge },

  // 用户中心
  { path:'/reader||bookshelf||book_review||attention||spit_slot/:uid', component:readerIndex,
    children:[
      { path:'/reader/:uid', name:'Reader', component:readerCenter },
      { path:'/bookshelf/:uid', name:'bookShelf', component:readerShelf },
      { path:'/book_review/:uid', redirect:'/book_review/:uid/1' },
      { path:'/book_review/:uid/:page', name:'bookReview', component:readerReview },
      { path:'/attention/:uid', name:'Attention', component:readerAttention },
      { path:'/spit_slot/:uid', redirect:'/spit_slot/:uid/1' },
      { path:'/spit_slot/:uid/:page', name:'spitSlot', component:readerSpit },
      { path:'/fans/:uid', name:'Fans', component:readerFans }
    ]
  },
  // APP 下载页面
  { path:'/download/app', name:'download', component:Download },
  { path: '/', redirect:'/index' },
];
// 全局导航钩子
// router.beforeEach((to, from, next) => {
//   let uid = Number(router.app.$cookie('user_id'));
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
//       Axios.post("/person-checkLoginState").then((res)=>{
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
//       }).catch((err)=>{
//         console.log(err)
//       });
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

createRouter().afterEach(() => {
  console.log('分享前')
    if(typeof window!=='undefined'){
      console.log('分享');

      // window.scrollTo(0,0)
      setTimeout(()=>{
        var _hmt = _hmt || [];
        (function() {
          //每次执行前，先移除上次插入的代码
          document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?ae2f46c8c11aad77feae3035de5c127e";
          hm.id = "baidu_tj";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
      },0);
    }

});


export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes,
    linkActiveClass:'active'
  })
}
