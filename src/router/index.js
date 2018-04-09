/**
 * Created by Administrator on 2017/7/20.
 */

import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'
import VueAxios from 'vue-axios'
const Home = () => import("../components/home/home.vue");
const authorIndex =() => import('../components/author/index.vue');
const Detail =() => import('../components/book/detail.vue');
const Rank =() => import('../components/ranking/rank.vue');
const rankLoading =() => import('../components/ranking/rankLoading.vue');
const Total =() => import('../components/classify/total.vue');
const Welfare =() => import('../components/author/welfare.vue');
const Charge  =() => import('../components/charge/index.vue');
const Error =() => import('../components/error/404.vue');
const Search =() => import('../components/classify/search.vue');
const Chapter =() => import('../components/book/chapter.vue');
const ChapterList =() => import('../components/book/chapter_list.vue');
const Login =() => import('../components/loginRegister/login.vue');
const getBackPassword =() => import('../components/loginRegister/getBackPassword.vue');
const totalLoading =() => import('../components/classify/totalLoading.vue');


const authorCenter =() => import('../components/author/center.vue');
const Register =() => import('../components/loginRegister/register.vue');
const addBook =() => import('../components/author/addBook.vue');
const addChapter =() => import('../components/author/addChapter.vue');
const editChapter =() => import('../components/author/eidtChapter.vue');
const authorChapterList =() => import('../components/author/chapterList.vue');
const draftList =() => import('../components/author/draftList.vue');
const Income =() => import('../components/author/income.vue');
const authorMessage =() => import('../components/author/message.vue');
const authorNotice =() => import('../components/author/notice.vue');
const authorApply =() => import('../components/author/apply.vue');
const authorTidings =() => import('../components/author/tidings.vue');


const userIndex =() => import('../components/user/index.vue');
const userCenter =() => import('../components/user/center.vue');
const userMessage =() => import('../components/user/message.vue');
const userComment =() => import('../components/user/comment.vue');
const userChat =() => import('../components/user/chat.vue');
const userFans =() => import('../components/user/fans.vue');
const userShelf =() => import('../components/user/shelf.vue');
const userAttention =() => import('../components/user/attention.vue');
const userWallet =() => import('../components/user/wallet.vue');
const userPersonal =() => import('../components/user/personal.vue');
const commonNews =() => import('../components/common/news.vue');
const Download =() => import('../components/common/download.vue');


const readerIndex =() => import('../components/reader/index.vue');
const readerFans =() => import('../components/reader/fans.vue');
const readerCenter =() => import('../components/reader/center.vue');
const readerAttention =() => import('../components/reader/attention.vue');

const readerShelf =() => import('../components/reader/bookshelf.vue');
const readerSpit =() => import('../components/reader/spit_slot.vue');
const readerReview =() => import('../components/reader/book_review.vue');


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
        path:'/user/wallet/charge/:page', name:"walletCharge", component:userWallet
      },
      // 消费记录
      {
        path:'/user/wallet/consume/:page', name:"walletConsume", meta: {requireAuth: true,topName:"User"}, component:userWallet
      },
      // 金椒记录
      {
        path:'/user/wallet/pepper/:page', name:"walletPepper", meta: {requireAuth: true,topName:"User"}, component:userWallet
      },
      // 打赏记录
      {
        path:'/user/wallet/reward/:page', name:"walletReward", meta: {requireAuth: true,topName:"User"}, component:userWallet
      },
      // 小米椒记录
      {
        path:'/user/wallet/annuum/:page', name:"walletAnnuum", meta: {requireAuth: true,topName:"User"}, component:userWallet
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
        path:'/user/charge', name:"userCharge", meta: { title:'充值中心-辣鸡小说',requireAuth: true,topName:"User"}, component:Charge
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
  { path:'/rank/golden/', redirect:'/rank/golden/month/1' },
  { path:'/rank/latest/', redirect:'/rank/latest/all/1' },
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


export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes,
    linkActiveClass:'active'
  })
}
