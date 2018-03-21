/**
 * Created by Administrator on 2017/9/18.
 */
export default {
  indexData: (state) => (type) => {
    return state.indexInfo[type].data ? state.indexInfo[type].data : {}
  },
  bookDetail: state => state.bookDetail ? state.bookDetail : {},
  bookCommentList: state => state.bookCommentList.list ? state.bookCommentList : {},
  chapterList: state => state.chapterList ? state.chapterList : [],
  activeName: (state, getters) => {
    return getters.chapterList[0] ? getters.chapterList[0].activeList : []
  },
  bookStackSell: state => state.bookStackSell ? state.bookStackSell.data : [],
  bookStackHotLabel: state => state.bookStackHotLabel ? state.bookStackHotLabel.data : [],
  stackList: state => state.stackList ? state.stackList.data : {},
  bookClassName: state => state.bookClassName ? state.bookClassName.data : []
}



