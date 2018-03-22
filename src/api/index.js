// this is aliased in webpack config based on server/client build
// import {createAPI} from './create-api-client';
// import Category from '../config/category';
import LRU from 'lru-cache'
import Com from '../assets/js/common'
import axios from 'axios';
import { Message } from 'element-ui'
const logRequests = true || !!process.env.DEBUG_API;
const prod = process.env.NODE_ENV == 'production'
const api = createAPI();
function createAPI() {
  let api = {};
  api.onServer = true;
  // api.cachedItems = LRU({
  //   max: 1000,
  //   maxAge: 1000 * 60 * 2 // 2 min cache
  // });
  return api;
}

function fetchUrl (url) {
  if(!prod){
    url = '/api' + url
  }
  return url
}

function checkTxt(val,len) {
  if(Com.regEmoji(val)){
    Message({message:"内容不可包含emoji表情图",type:'warning'});
    return false
  }else if(Com.trim(val).length>len){
    Message({message:"评论内容长度不得超过"+len+"字符",type:'warning'});
    return false
  }else if(!Com.trim(val).length){
    Message({message:"请输入内容",type:'warning'});
    return false
  }
  return true
}

// warm the front page cache every 15 min
// make sure to do this only once across all requests

function fetch(child,data,type,tip=true) {
    let format = '';
    child = fetchUrl(child);
    if(typeof data !=='string'){
      for (let k in data){
        format += k+'='+ data[k] +'&'
      }
      data = format.slice(0,-1)
    }else {
      tip = type;
      type = data;
      data = {}
    }
    // logRequests && console.log(`fetching ${child}...`);
    const cache = api.cachedItems;
    if (cache && cache.has(child)) {
        // logRequests && console.log(`cache hit for ${child}.`);
        return Promise.resolve(cache.get(child))
    } else {
        return new Promise((resolve, reject) => {
            if(type==='get'){
              axios.get(child,data).then(res => {
                const val = res.data;
                if (val) val.__lastUpdated = Date.now();
                cache && cache.set(child, val);
                // logRequests && console.log(`fetched ${child}.`);
                resolve(val);
                if(res.data.returnCode!==200 && tip){
                  Message({message:res.data.msg,type:'warning'})
                }
              }, reject).catch(reject);
            }else {
              axios.post(child,data).then(res => {
                const val = res.data;
                if (val) val.__lastUpdated = Date.now();
                cache && cache.set(child, val);
                // logRequests && console.log(`fetched ${child}.`);
                resolve(val);
                if(res.data.returnCode!==200 && tip){
                  Message({message:res.data.msg,type:'warning'})
                }
              }, reject).catch(reject);
            }
        })
    }
}
export function aycn(url,data,type,tip) {
  return fetch(url,data,type,tip)
}

// 获取网络时间

export function FetchNetTime() {
  return fetch('/sys-getNetWorkDateTime','get',false)
}

// 网站首页数据获取
export function FetchIndexData () {
  return fetch('/indexdataload','get')
}
// 首页最新更新书籍和最新签约书籍
export function FetchIndexLatest () {
  return fetch('/getMaxNewChapterVOList','get',false)
}
// 首页最新签约
export function FetchIndexSign() {
  return fetch("/stacks-bookFiltering",{type:4,page:1},'post',false)
}

// 网站排行榜数据加载
export function FetchRankData (type,page) {
  return fetch('/books-rank',{type:type,page:page},'post',false)
}

// 网站书库数据加载
export function FetchStackListData (op1,op2,op3,op4,op5,page,op6) {
  let data = {
    bookClassificationid:op1,
    bookWorldCount:op2,
    updateTime:op3,
    bookStatus:op4,
    bookCheckStatus:op5,
    startPage:page
  };
  if(Number(op6)){
    data.bookLabid = op6
  }
  return fetch("/stacks-bookFiltering",data,'post',false)
}

// 书籍详情页数据加载
// 书籍信息
export function FetchBookDetailData (bid) {
  return fetch('/book-bookInfo',{bookid:bid},'post',false)
}

// 书籍信息简化版
export function FetchBookInfo(bid) {
  return fetch('/book-showBookInfo',{ bookid:bid },'post',false)
}

// 章节列表
export function FetchChapterList (bid) {
  return fetch('/books-volumeChapterList/'+bid,'get',false)
}

// 书籍评论信息列表
export function FetchBookCommentList (bid,page) {
  return fetch('/comm-getcomminfo',{id:bid,startPage:page,commentType:0,type:1,},'post',false)
}
// 热评
export function FetchBookCommentHot (bid) {
  return fetch('/comm-HotCommentInfo',{bookid:bid},'post',false)
}

// 书评回复列表
export function FetchBookCommentReply (cid,page) {
  return fetch("/comm-replyInfo",{commentid:cid,startPage:page},'post',false)
}

// 发布书评

export function FetchAddBookComment(data) {
  let val = data.commentContext;
  if(checkTxt(val,200)){
    return fetch("/add-getcomminfo",data)
  }else {
    return Promise.resolve({})
  }
}

// 回复书评

export function FetchReplyBookComment(data) {
  let val = data.replyCommentsContent;
  if(checkTxt(val,100)){
    return fetch("/add-replyInfo",data)
  }else {
    return Promise.resolve({})
  }
}

// 书评点赞

export function FetchCommentLaud(id) {
  return fetch("/comm-GiveThumbs",{commentId:id})
}

// 书籍自动订阅
export function FetchAutoSubscribe (bid,type,select) {
  return fetch("/userRmemberChose",{bookid:bid,type:type,isisSelect:select},'post',false)
}

// 搜索热词
export function FetchSearchHotWords() {
  return fetch('/sys-hotwords','get',false)
}

// 书籍分类
export function FetchBookClassName() {
  return fetch("/ranking-classification",'get',false)
}

// 书库畅销榜
export function FetchBookRankSell() {
  return fetch('/stacks-changxiaobang','get',false)
}

// 书库热门标签
export function FetchBookLabel() {
  return fetch("/stacks-hotLable",'get',false)
}

// 福利
export function FetchAuthorWelfare() {
  return fetch("/sys-welfareBulletin",'get',false)
}

// 登录
export function FetchUserLogin(data) {
  return fetch("/person-login",data)
}
// 校验登录或刷新用户信息
export function FetchFreshenInfo() {
  return fetch("/person-info",'post',false)
}

// 注册

export function FetchUserRegister(data) {
  return fetch('/person-regInfo',data)
}

// 忘记密码


// 阅读章节
export function FetchReadChapter(data) {
  return fetch('/book-read',data,'post',false)
}

// 加入书架
export function FetchAddBookShelf(bid,user,book) {
  if(Com.cookie("user_id")){
    return fetch("/bookshelf-adduserbookshelf",{
      bookId:bid,
      userName:user,
      bookName:book})
  }else {
    return Promise.resolve({returnCode:400})
  }
}


// 阅读章节

// 吐槽列表
export function FetchGetPrattle(id,page) {
  page = page | 1;
  return fetch("/pcomm-getParagraphcommentpid/"+id+'/'+page,'get',false)
}

// 发布吐槽

export function FetchAddPrattle(data) {
  let val = data.commentContext;
  if(checkTxt(val,50)){
    return fetch("/pcomm-addParagraphcomment",data)
  }else {
    return Promise.resolve({})
  }
}

// 添加阅读记录

export function FetchAddRecords(data) {
  return fetch("/person-addBookReadRecord",data,'post',false)
}

// 订阅章节
export function FetchSubscribeChapter(data) {
  return fetch("/book-subscription",data)
}

// 支付

export function FetchWebPay(type,name,sum) {
  switch (type){

    case 'alipay':{ //支付宝支付
      return fetch("/payment-alipay",{
        username:name,
        apymentType:1,
        WIDtotal_fee:sum
      })
    }
    case 'weixin':{ //微信支付
      return fetch("/WeChatPay/ScanCodePayment",{
        nickName:name,
        userPayMoney:sum
      })
    }
    default:{
      return Promise.resolve({})
    }
  }
}

// 作者中心

// 作者书籍列表
export function FetchAuthorBookList(aid) {
  return fetch("book-AuthorAllBookInfo",{authorId:aid},'post',false)
}

// 作者收入
export function FetchAuthorIncome(type,data) {
  switch (type){
    case 'allIncome':{   //总收入
      return fetch("/allincomestatistics",data,'post',false)
    }
    case 'monIncome':{ // 月报
      return fetch("/getAuthorMonthlyreportByAuthormonByAuthorIDWeb",data,'post',false)
    }
    case 'chapter':{  // 书籍章节订阅详情
      return fetch("/subscriptionstatistics",data,'post',false)
    }
    default:{
      return Promise.resolve({returnCode:500})
    }
  }
}

// 最新月报时间

export function FetchLatestMonth() {
  return fetch('/sys-getDataPosition','get',false)
}
