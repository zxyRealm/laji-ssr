/**
 * Created by Administrator on 2017/9/18.
 */
import Vue from 'vue'

export default {
  SET_LOADING(state,data){
      state.loading = data
  },

  // 网站首页数据
  SET_INDEX_DATA(state,data){
    if(data.total){
      Vue.set(state.indexInfo,'total',data.total) //首页总数据
    }
    if(data.latest){
      Vue.set(state.indexInfo,'latest',data.latest) //最新更新章节、最新签约书籍
    }
    if(data.sign){
      Vue.set(state.indexInfo,'sign',data.sign) //最新更新章节、最新签约书籍
    }
  },

  // 排行榜
  SET_RANK_DATA(state,{data}){
    Vue.set(state,'rankData',data)
  },

  // 书籍详情页
  //   书籍详情
  SET_BOOK_DETAIL(state,{data}){
      Vue.set(state,'bookDetail',data)
  },

  // 书籍列表
  SET_CHAPTER_LIST(state,arr){
    Vue.set(state,'chapterList',arr)
  },

  // 书评列表
  SET_BOOK_COMMENT_LIST(state,{data}){
    Vue.set(state,'bookCommentList',data)
  },

  // 热评
  SET_BOOK_COMMENT_HOT(state,{data}){
    Vue.set(state,'bookCommentList',data)
  },

  // 书评回复
  SET_BOOK_COMMENT_REPLY(state,{data,index}){
    Vue.set(state.bookCommentList.data.list[index],'childList',data)
  },

  // 搜索热词

  SET_SEARCH_HOT_WORDS(state,{data}){
    state.hotWords = data
  },

  // 书籍分类
  SET_BOOK_CLASS_NAME(state,data){
    state.bookClassName = data
  },

  // 书库
  SET_STACK_LIST_DATA(state,data){
    state.stackList = data
  },
  // 热门标签
  SET_STACK_HOT_LABEL(state,data){
    state.bookStackHotLabel = data
  },
  // 畅销榜
  SET_STACK_SELL(state,data){
    state.bookStackSell = data
  },
  SET_AUTHOR_WELFARE(state,data){
    state.authorWelfare = data
  },

  // 用户信息
  SET_USER_INFO(state,info){
    if(info){
      state.userInfo = info
    }else {
      state.userInfo = {}
    }
  },
  SET_AUTHOR_CHAPTER_LIST(state,data){
    state.authorChapterList = data || [];
  }
}
