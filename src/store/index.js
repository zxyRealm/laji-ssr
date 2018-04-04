/**
 * Created by Administrator on 2017/9/18.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import modules from './modules/index'
Vue.use(Vuex);

const state = {
  once:false,
  loading:false,  //数据请求状态
  userInfo:{}, //用户信息
  message:{}, //用户未读消息数目
  count:0,
  indexInfo:{
    total:{},
    latest:{},
    sign:{}
  }, // 网站首页数据
  stackList:{}, //书库列表
  rankData:{}, //排行榜数据
  chapterList:[], //章节列表，
  bookCommentList:{}, //书籍评论列表
  bookDetail:{},
  hotWords:[], //搜索热词
  bookClassName:{}, //书籍分类
  bookStackSell:{}, // 书库畅销榜
  bookStackHotLabel:{}, //书库热门标签
  authorWelfare:[], // 作者福利
  authorChapterList:[],
  chapterDetail:{} //章节详情
};

export function createStore () {
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules
  })
}
