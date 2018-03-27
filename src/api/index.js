// this is aliased in webpack config based on server/client build
// import {createAPI} from './create-api-client';
// import Category from '../config/category';
import LRU from 'lru-cache'
import Com from '../assets/js/common'
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
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
  return '/api'+ url
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
      if(type!=='get'){
        for (let k in data){
          format += k+'='+ data[k] +'&'
        }
        data = format.slice(0,-1)
      }
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
              axios.get(child,{ params:data }).then(res => {
                const val = res.data;
                // logRequests && console.log(`fetched ${child}.`);
                if (val) val.__lastUpdated = Date.now();
                cache && cache.set(child, val);
                resolve(val);
                if(res.data.returnCode!==200 && tip){
                  Message({message:res.data.msg,type:'warning'})
                }
              }, reject).catch(reject);
            }else {
              axios.post(child,data).then(res => {
                const val = res.data;
                // logRequests && console.log(`fetched ${child}.`);
                if (val) val.__lastUpdated = Date.now();
                cache && cache.set(child, val);
                resolve(val);
                if(res.data.returnCode!==200 && tip){
                  Message({message:res.data.msg,type:'warning'})
                }
              }, reject).catch(reject)
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
  page = page || 1;
  return fetch('/comm-getcomminfo',{id:bid,startPage:page,commentType:0,type:1,},'post',false)
}
// 热评
export function FetchBookCommentHot (bid) {
  return fetch('/comm-HotCommentInfo',{ bookid:bid },'post',false)
}

// 书评回复列表
export function FetchBookCommentReply (cid,page) {
  page = page || 1;
  return fetch("/comm-replyInfo",{ commentid:cid,startPage:page },'post',false)
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
  return fetch("/userRmemberChose",{bookid:bid,type:type,isSelect:select},'post',false)
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
export function FetchUserLogin(data,tip=true) {
  return fetch("/person-login",data,tip)
}

export function FetchExit() {
  return fetch('/person-ClearUserInfo')
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
export function FetchGetPrattle(id,page,type) {
  page = page || 1;
  let url;
  switch (type){
    case 'user':
      url = '/pcomm-getParagraphcommentuid/';
      break;
    case 'book':
      url = '/pcomm-getParagraphcommentbookid/';
      break;
    case 'chapter':
      url = '/pcomm-getParagraphcomment/';
      break;
    default:
      url = "/pcomm-getParagraphcommentpid/";
  }
  return fetch(url+id+'/'+page,'get',false)
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
  return fetch("/book-AuthorAllBookInfo",{authorId:aid},'post',false)
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
// 作者收获辣椒
export function FetchAuthorGainLog(page) {
  return fetch('/spicyirewardticketlog',{ startpage:page },'post',false)
}

// 作者中心章节列表

export function FetchAuthorChapterList(bid,type) {
  type = type || 2;
  return fetch('/books-authorChapterList/'+ bid +'/'+ type,'get')
}

// 站内公告
export function FetchAuthorNotice(page,mid) {
  page = page || 1;
  mid = mid || 2;
  return fetch('/sys-getNotice',{ page:page,menuId:mid },'get',false)
}

// 新增书籍 / 编辑书籍信息
export function FetchAuthorHandleBook(data,type) {
  let url;
  switch (type){
    case 'dd': //删除草稿
      url = '/chapter-deletedrafts';
      break;
    case 'cc': //章节调序
      url = '/sys-chapteOrderUpdate';
      break;
    case 'cv': //调整分卷
      url = '/chapterToVolume';
      break;
    case 'av': //新增分卷
      url = '/books-addvolume';
      break;
    case 'ac': //新增章节
      url = '/chapter-creates';
      break;
    case 'ec':  //修改章节
      url = '/chapter-update';
      break;
    case 'eb': //修改书籍信息
      url = '/book-update';
          break;
    default: //新增书籍
      url = '/book-create'
  }
  return fetch(url,data)
}
// 新建章节

// 获取书籍、章节、分卷信息

export function FetchGetBookInfo(id,type) {
  let url,data,way='post';
  data = { bookid : id };
  switch (type){
    case 'rank':
      url = '/ranking-book';
      data = id;
      break;
    case 'search':
      url = '/stacks-search';
      data = id;
      break;
    case 'draft':
      url = '/chapter-getdrafts';
      data = { bookid : id , startpage:1 };
      break;
    case 'volume':
      url = '/books-getvolume';
      data = { bookId : id };
      break;
    case 'chapter': //章节信息
      url = '/chapter-getChapterInfo';
      data = { chapterid:id };
      break;
    case 'label': //书籍标签分类
      url = '/book-EditBookEcho';
      data = {};
      way = 'get';
      break;
    default: //书籍信息
      url = '/book-showBookInfo';
  }
  return fetch(url,data,way,false)
}

// 校验章节名、书名、卷名
export function FetchCheckName(data,type) {
  let url,way='post';
  switch (type){
    case 'back': //修改密码
      url = '/person-pwdRetrieval';
      break;
    case 'change': //修改密码
      url = '/person-updatepwd';
      break;
    case 'code': //验证码
      url = '/verification/person-checkedCode';
      break;
    case 'phone': //手机号
      url = '/verification/sys-getShortMessage';
      break;
    case 'name': //昵称
      url = '/person-checkNickName/'+data;
      way = 'get';
      data = {};
      break;
    case 'book':
      url = '/book-checkName';
      break;
    case 'chapter':
      url = '/chapter-checkName';
      break;
    default:
      url = '/books-getCheckVolume';
  }
  return fetch(url,data,way,false)
}


// 我的个人中心

export function FetchGetUserData(page,type,id) {
  page = page || 1;
  Number(type)?(id = type,type = page):'';
  let url,way = 'post';
  let data = { startpage:page };
  switch (type){
    case 'su': //个人信息简化版
      url = '/person-SimplifyUserInfo';
      data = { puserid : id };
      break;
    case 'chat': //私聊记录
      url = '/person-messageRecord/'+id+'/'+page;
      data = {};
      way = 'get';
      break;
    case 'bcom':
      url = '/comm-commInfoByUserId';
      data = { startPage:page, userid:id };
      break;
    case 'sign':  //签到
      url = '/user-signin';
      break;
    case 'notice': //通知
      url = '/sys-getsystemmsg';
      break;
    case 'com': //评论
      url = '/comm-coverReplyInfo';
      data = {
        startPage:page,
        userid:id
      };
      break;
    case 'reCom': //ta的评论
      url = '/person-commentACrep';
      data = {
        startPage:page,
        userid:id
      };
      way = 'get';
      break;
    case 'follow': //关注
      url = '/fans-Follow';
      way = 'get';
      id?data.puserid = id:'';
      break;
    case 'fans': //粉丝
      url = '/fans-myFans';
      way = 'get';
      break;
    case 'reAtt': //ta的关注
      url = '/fans-userFollow';
      way = 'get';
      data.puserid = id;
      break;
    case 'reFan': //ta的粉丝
      url = '/fans-userFans';
      way = 'get';
      data.puserid = id;
      break;
    case 'letter': //粉丝
      url = '/person-message';
      way = 'get';
      break;
    case 'shelf': //书架
      url = '/bookshelf-getuserbookshelf';
      data.userid = id;
      break;
    case 'reLog': //阅读记录
      url = '/person-UserBookReadRecord';
      data.userid = id;
      break;
    default: //签到状态
      url = '/user-signinstate';
      data = {};
      way = 'get';
  }
  return fetch(url,data,way,false)
}

export function FetchHandleUserInfo(id,type) {
  let url;
  let data = { id : id };
  switch (type){
    case 'sl': //发送私信
      url = '/person-sendmessage';
      data = id;
      break;
    case 'pal': //吐槽点赞
      url = '/paragraphcomment-GiveThumbs';
      data = { paragraphcommentid:id };
      break;
    case 'bal': //书评点赞
      url = '/comm-GiveThumbs';
      data = { commentId:id };
      break;
    case 'dcr': //删除书评回复
      url = '/comm-deletereplyInfo';
      data = { commentid:id };
      break;
    case 'dc': //删除书评
      url = '/comm-delcomminfo';
      data = { id:id,type:0 };
      break;
    case 'dg': //删除吐槽
      url = '/pcomm-delParagraphcomment';
      break;
    case 'ds': //删除书架
      url = '/bookshelf-deluserbookshelf';
      break;
    default: //删除阅读记录
      url = '/person-delBookReadRecord';
  }
  return fetch(url,data)
}

// 我的钱包
export function FetchMineWallet(type,page,id) {
  let url,data = { startpage:page,userid:id };
  switch (type){
    case 'Annuum': //小米椒记录
      url = '/userRecommendTicketRecord';
      break;
    case 'Reward': //辣椒打赏记录
      url = '/spicyirewardticketlogByUserId';
      break;
    case 'Pepper': //金椒记录
      url = '/userGoldenTicketRecord';
      break;
    case 'Consume': //订阅记录
      url = '/userSubscriptionRecord';
      break;
    default: //充值记录
      url = '/user-RechargeRecord';
  }
  return fetch(url,data,'post',false)
}

// 关注、取消关注
export function FetchUpdateInfo(type,uid,aid,aname) {
  let url,data;
  switch (type){
    case 'add':
      url = '/fans-addFans';
      data = {
        token:uid,
        followUserName:aname,
        followId:aid
      };
      break;
    default:
      url = '/fans-CancelFollow';
      data = {
        followId:aid,
        userid:uid
      };
  }
  return fetch(url,data)
}

export function FetchUserGift(type,count,data) {
  let url;
  switch (type){
    case 'reward': //辣椒
      url = '/user-SpicyiRewardTicket';
      data.spicyiTicketCount = count;
      break;
    case 'ticket': //金椒
      url = '/user-RewardGonderTicket';
      data.goldenTicketCount = count;
      break;
    default: //小米椒
      url = '/user-RecommendationTicket';
      data.recommendTicketCount = count;
  }
  return fetch(url,data)
}
