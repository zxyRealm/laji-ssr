<template id="Detail">
    <div v-wechat-title="Title+'－辣鸡小说'" class="container clear" :style="{ minHeight:minHeight + 'px'}">
      <template v-if="bookDetail.bookListInfo">
        <div class="subNavWrap">
          <span class="fl">当前位置：</span>
          <div class="sub-nav">
            <el-breadcrumb  separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{path:'/class_total/'+bookDetail.bookListInfo.bookClassificationId+'/0/0/0/0/1/0'}" >{{bookDetail.bookListInfo.classificationName}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{bookDetail.bookListInfo.bookName}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="main-left" style="width: 760px">
          <!--书籍详情信息 start-->
          <div class="bookWrap clear">
            <div class="bw-left">
              <img class="cover" :src="bookDetail.bookListInfo.bookImage" :alt="bookDetail.bookListInfo.bookName">
              <i v-if="bookDetail.bookListInfo.bookAuthorization===2||bookDetail.bookListInfo.bookAuthorization===3" class="zdy-icon__sign">签约</i>
            </div>
            <div class="bw-right">
              <div class="b-title">
                <strong>{{bookDetail.bookListInfo.bookName}}</strong>
                <i v-if="bookDetail.bookListInfo.bookCheckStatus===2" class="zdy-icon__vip big"></i>
                <span class="b-state" :class="{end:bookDetail.bookListInfo.bookStatus}">{{bookDetail.bookListInfo.bookStatus?'已完结':'连载中'}}</span>
              </div>
              <div class="b-info">
                <p class="base">
                <span>作者：
                  <router-link class="txt-overflow" :to="'/reader/'+bookDetail.bookListInfo.bookWriterId">{{bookDetail.bookListInfo.writerName}}</router-link>
                </span>
                  <span v-if="bookDetail.lastChapterView">更新：{{bookDetail.lastChapterView.releaseTime|time }}</span>
                  <span>字数：{{bookDetail.bookListInfo.bookWorldCount}}</span>
                  <span>分类：{{bookDetail.bookListInfo.classificationName}}</span>
                </p>
                <p>标签：
                  <span v-for="(item,$index) in bookDetail.bookLable">{{item.bookLableName}}{{($index==bookDetail.bookLable.length-1)?'':'、'}}</span>
                </p>
                <div class="bi-center">
                  <p >
                    <span>点击：{{bookDetail.bookdate?bookDetail.bookdate.bookClickCount:0 | number}}</span>
                    <span>书评：{{commentList.total?commentList.total:0}}</span>
                    <span>吐槽：{{bookDetail.bookdate?bookDetail.bookdate.tucaoIndex:0}}</span>
                  </p>
                  <p >
                  <span class="red-pepper">
                    打赏：{{bookDetail.bookdate?bookDetail.bookdate.areward:0}}
                  </span>
                    <span class="green-pepper">
                    小米椒：{{bookDetail.bookdate?bookDetail.bookdate.bookRecommend:0}}
                  </span>
                    <span class="gloden-pepper">
                    金椒：{{bookDetail.bookdate?bookDetail.bookdate.goldenTicket:0}}
                  </span>
                  </p>
                </div>
                <div class="bookIntro scrollBar" :class="showDetail?' auto':''" >
                  <div class="text" v-html="bookDetail.bookListInfo.bookIntroduction"></div>
                  <span class="show" @click="showDetail?showDetail=false:showDetail=true">
                    {{showDetail?'全部收起':'全部展开'}}
                    <i :class="'el-icon-' + (showDetail?'minus':'plus')" ></i>
                  </span>
                </div>
              </div>
              <div class="b-handle clear">
                <div class="clear fl">
                  <router-link v-if="bookDetail.chapterOne" class="read" :to="'/chapter/'+bookDetail.chapterOne.id" target="_blank">点击阅读</router-link>
                  <a class="addShelf" @click="addBookshelf" href="javascript:;" >{{bookDetail.bookListInfo.collectionStatus?'已收藏':'收藏'}}</a>
                </div>
                <span class="spec">|</span>
                <div class="clear">
                  <span class="btn pepper" @click="myConsume('ticket')">投喂金椒</span>
                  <span class="btn annume" @click="myConsume('recommend')">投喂小米椒</span>
                  <span class="btn reward" @click="myConsume('reward')">打赏</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bd-share-box clear">
            <span class="fl">分享到：</span>
            <div class="bdsharebuttonbox fl" data-tag="share_1">
              <a class="bds_tsina" data-cmd="tsina"></a>
              <a class="bds_qzone" data-cmd="qzone"></a>
              <a class="bds_sqq" data-cmd="sqq"></a>
              <a class="bds_weixin" data-cmd="weixin"></a>
            </div>
          </div>
          <!--章节更新及章节列表信息 start-->
          <div class="book-chapter">
            <div class="tabWrap">
              <router-link v-if="activeName1==='first' && bookDetail.lastChapterView" class="reading more" :to="'/chapter/'+bookDetail.lastChapterView.id" target="_blank">阅读本章节 <i class="el-icon-d-arrow-right"></i></router-link>
              <template>
                <el-tabs v-model="activeName1" type="card" @tab-click="handleClick1">
                  <el-tab-pane label="最新章节"  name="first">
                    <div class="c-main">
                      <div class="c-title"  v-if="bookDetail.lastChapterView" >
                        <p class="txt-overflow">
                          <router-link
                            :to="'/chapter/'+ bookDetail.lastChapterView.id"
                            target="_blank">{{ bookDetail.lastChapterView.chapterTitle }}
                          </router-link>
                        </p>
                        <span class="date">更新时间：{{ bookDetail.lastChapterView.releaseTime | time('long')}}</span>
                      </div>
                      <div class="c-content overLine4">
                        <p class="c-txt" v-for="item in bookDetail.bookListInfo.lastChapter">
                          {{item.content}}
                        </p>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="全部目录" name="second">
                    <el-collapse v-model="activeName" class="b_chapter_list">
                      <template v-for="(item,$index) in chapterList">
                        <el-collapse-item :title="item.volumeName" :name="item.volumeId" :icon="'el-icon-caret-right'">
                          <div v-for="(item2,$index2) in item.resultList" class="collapse-item-link txt-overflow">
                            <router-link :to="'/chapter/'+item2.id" target="_blank" @click='visible=false' :title="item2.chapterTitle" :alt="item2.chapterTitle" class="txt-overflow" >{{item2.chapterTitle}}</router-link>
                            <i v-if="item2.chapterIsvip" class="zdy-icon__vip"></i>
                          </div>
                        </el-collapse-item>
                      </template>
                    </el-collapse>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </div>
          </div>
          <!--章节更新及章节列表信息 over-->

          <!--书评列表 start-->
          <div class="book-review mb20 pt20" id="comment-list-wrap">
            <div class="tabWrap commentTab">
                <div class="font16 mb20">
                  评论
                </div>
            </div>
            <div class="review-list">
              <div v-if="commentList.list && commentList.list.length>6" :class="$store.state.userInfo.userName?'reply':'reply no-login'">
                <div class="avatar-wrap">
                  <a class="avatar" href="javascript:;">
                    <img :src="$store.state.userInfo.userName?$store.state.userInfo.userHeadPortraitURL:'http://useravatarimg.oss-cn-hangzhou.aliyuncs.com/UserAvatar/userDefaultHandImg2.jpg'" :alt="$store.state.userInfo.userName">
                  </a>
                </div>
                <div class="reply-wrap">
                  <button type="button" class="comment-btn" @click="addComment">发布评论</button>
                  <div class="rw-left">
                    <textarea name="" v-model="commentText" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。(不可输入表情图)" class="reply-content" cols="30" rows="10"></textarea>
                    <p class="more">
                      <!--<span class="emoji">添加表情</span>-->
                      <span class="words">{{commentText.length}}/200</span>
                    </p>
                    <div v-if="!$store.state.userInfo.userName" class="baffle">
                      请先
                      <router-link to="/login" class="b-btn btn-open-mini-Login">登录</router-link>
                      后发表评论 (・ω・)
                    </div>
                  </div>
                </div>
              </div>
              <ul v-if="commentList.list" class="review-ul">
                <li v-for="(item,$index) in commentList.list" class="review-item">
                  <div class="avatar-wrap">
                    <router-link class="avatar" :to="'/reader/'+item.userId">
                      <img :src="item.userHeadPortraitURL" :alt="item.userName">
                    </router-link>
                  </div>
                  <div class="comments-wrap">
                    <div class="info">
                      <p>
                        <span class="nickname">{{item.pseudonym}}</span>
                        <i class="zdy-icon__sex" :class="item.userSex?'girl':null"></i>
                        <zdy-icon__user_level :grade="item.userGrade" class="vat"></zdy-icon__user_level>
                        <span class="hotCom" v-if="item.isHot">热评</span>
                      </p>
                    </div>
                    <div class="context">
                      {{item.commentContext}}
                    </div>
                    <div class="data">
                      <span class="date">{{item.commentDateTime|time('long')}}</span>
                      <p class="handle">
                        <button @click="addLaud($index)" :class="item.isthumbs!=1?'laud':'laud lauded'">{{item.thumbsCount}}</button>
                        <button class="msg" @click="getAnswer($index)">{{item.replyCount}}</button>
                      </p>
                    </div>
                    <div class="comment-child">
                      <div v-if="item.answer" :class="$store.state.userInfo.userName?'reply':'reply no-login'">
                        <div class="avatar-wrap">
                          <a class="avatar" href="javascript:;">
                            <img :src="$store.state.userInfo.userName?$store.state.userInfo.userHeadPortraitURL:'http://useravatarimg.oss-cn-hangzhou.aliyuncs.com/UserAvatar/userDefaultHandImg2.jpg'" :alt="$store.state.userInfo.userName">
                          </a>
                        </div>
                        <form class="reply-wrap">
                          <button type="button" @click="addReplyComment(item.id,$index)" class="comment-btn">发布评论</button>
                          <div class="rw-left">
                            <textarea name="" v-model="answerTxt" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。" class="reply-content" cols="30" rows="10"></textarea>
                            <p class="more clear">
                              <!--<span class="emoji">添加表情</span>-->
                              <span class="words">{{answerTxt.length}}/100</span>
                            </p>
                            <div v-if="!$store.state.userInfo.userName" class="baffle">
                              请先
                              <router-link to="/login" class="b-btn btn-open-mini-Login">登录</router-link>
                              后发表评论 (・ω・)
                            </div>
                          </div>
                        </form>
                      </div>
                      <template v-if="item.childList">
                        <ul >
                          <li v-for="(item2,$index2) in item.childList.list" class="child-item clear">
                            <div class="avatar-wrap">
                              <router-link class="avatar" :to="'/reader/'+item2.userId">
                                <img :src="item2.userHeadPortraitURL" :alt="item2.userName">
                              </router-link>
                            </div>
                            <div class="comments-wrap">
                              <div class="info">
                                <p>
                                  <span class="nickname">{{item2.pseudonym}}</span>
                                  <i class="zdy-icon__sex" :class="item2.userSex?'girl':null"></i>
                                  <zdy-icon__user_level class="vat" :grade="item2.userGrade"></zdy-icon__user_level>
                                </p>
                                <span class="date fr">{{item2.commentDateTime|time('long')}}</span>
                              </div>
                              <div class="context" v-html="item2.replyCommentsContent">
                                <!--{{item2.replyCommentsContent}}-->
                              </div>
                            </div>
                          </li>
                        </ul>
                        <el-pagination
                          v-if="item.childList.total>item.childList.pageSize"
                          small
                          :current-page.sync="page2"
                          :page-size="item.childList.pageSize"
                          @current-change="pageHandler($event,$index)"
                          layout="prev, pager, next"
                          :total="item.childList.total">
                        </el-pagination>
                      </template>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="commentList.total>commentList.pageSize" style="padding-left:90px;overflow: hidden;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="page"
                  :page-size="commentList.pageSize"
                  layout="prev, pager, next, jumper"
                  :total="commentList.total">
                </el-pagination>
              </div>
              <div :class="$store.state.userInfo.userName?'reply':'reply no-login'" class="mt20">
                <div class="avatar-wrap">
                  <a class="avatar" href="javascript:;">
                    <img :src="$store.state.userInfo.userName?$store.state.userInfo.userHeadPortraitURL:'http://useravatarimg.oss-cn-hangzhou.aliyuncs.com/UserAvatar/userDefaultHandImg2.jpg'" :alt="$store.state.userInfo.userName">
                  </a>
                </div>
                <div class="reply-wrap">
                  <button type="button" @click="addComment" class="comment-btn">发布评论</button>
                  <div class="rw-left">
                    <textarea name="" v-model="commentText" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。(不可输入表情图)" class="reply-content" id="" cols="30" rows="10"></textarea>
                    <p class="more clear">
                      <!--<span class="emoji">添加表情</span>-->
                      <span class="words">{{commentText.length}}/200</span>
                    </p>
                    <div v-if="!$store.state.userInfo.userName" class="baffle">
                      请先
                      <router-link to="/login" class="b-btn btn-open-mini-Login">登录</router-link>
                      后发表评论 (・ω・)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--书评列表 end-->

          <!--同类推荐书籍列表 start-->
          <div class="recommend">
            <div class="heading">
              <div class="h-title fl font16">
                同类推荐
              </div>
            </div>
            <div class="recommendList">
              <zdy-carousel-roll :imgArray="bookDetail.similarRecommendation"></zdy-carousel-roll>
            </div>
          </div>
          <!--同类推荐书籍列表 end-->
        </div>
        <div class="main-right" style="width: 264px">
          <div class="mr-wrap author">
            <div class="title">
              作者
            </div>
            <router-link :to="'/reader/'+bookDetail.bookListInfo.bookWriterId" target="_blank" :title="bookDetail.AuthorInfo.pseudonym">
              <img :src="bookDetail.AuthorInfo.userHeadPortraitURL" alt="">
            </router-link>
            <p class="name txt-overflow">{{bookDetail.AuthorInfo.pseudonym}}</p>

            <p class="font14 clr6">{{bookDetail.AuthorInfo.userAutograph}}</p>
          </div>

          <!--给作者奖励模块 start-->
          <div class="mr-wrap fans">
            <div class="title">
              粉丝榜
            </div>
            <ul v-if="bookDetail.fansInfoList.list" class="fans-list">

              <template v-if="bookDetail.fansInfoList.list.length" >
                <li v-for="(item,$index) in bookDetail.fansInfoList.list" v-if="$index<3">
                  <span class="fl order">{{$index+1}}</span>
                  <router-link class="fans-face" :to="'/reader/'+item.userId">
                    <img  :src="item.userHeadPortraitURL" :alt="item.userName">
                  </router-link>
                  <div class="fans-info">
                    <p class="fans-name txt-overflow">{{item.userName}}</p>
                    <p class="fr grade">{{item.fansCount}}</p>
                  </div>
                </li>
                <li v-for="(item,$index) in bookDetail.fansInfoList.list" v-if="$index>=3&&$index<10">
                  <span class="fl order">{{$index+1}}</span>
                  <div class="fans-info">
                    <p class="fans-name txt-overflow">{{item.userName}}</p>
                    <p class="fr grade">{{item.fansCount}}</p>
                  </div>
                </li>
              </template>
              <zdy-hint v-else :size="0" type="fans"></zdy-hint>
            </ul>
          </div>
        </div>
      </template>
      <zdy-hint v-else-if="bookDetail.bookListInfo===''" type="book-not"></zdy-hint>
      <my-consume></my-consume>
    </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import CarouseRoll from '../carousel/caroual_rec.vue'
  import { FetchUserGift,FetchUpdateInfo,FetchBookDetailData,FetchBookCommentReply,FetchCommentLaud,FetchReplyBookComment,FetchAddBookComment,FetchAddBookShelf } from '../../api'
  import { mapGetters } from 'vuex'
  let ERR_OK = 200;
  let ERR_NO = 400;
  export default{
      components:{
        child: require('../nav/nav.vue'),
        'zdy-carousel-roll': CarouseRoll
      },
      data() {
        return {
          showDetail:false, //是否展示全部书籍简介
          imgArray:[],
          rewardNum:188,
          answer:false, //书评回复状态
          answerTxt:'', //书评回复内容
          commentText:'', //书评内容
          activeName1:'first',
          pageChange:false,
          page: 1, //书评列表页码
          page2:1, //书评回复列表页码
          maxPage: 5,
          fansList:{}, //粉丝列表信息
          reply:'',
          onceShow:false,
          minHeight:400
        }
      },
      methods: {
//        滚动指定高度
        toLocation(h){
          if(document.documentElement.scrollTop){
            document.documentElement.scrollTop = h
          }else if(document.body.scrollTop) {
            document.body.scrollTop = h
          } else{
            window.pageYOffset = h
          }
        },
//        书评列表分页
        handleCurrentChange(page) {
          this.$store.dispatch("FETCH_COMMENT_LIST",{bid:this.$route.params.bid,page:page}).then(()=>{
            this.$nextTick(()=>{
              const h = document.getElementById("comment-list-wrap").offsetTop;
              this.toLocation(h-35)
            })
          })
        },
//        书评回复列表
        pageHandler(page,index) {
            FetchBookCommentReply(this.commentList.list[index].id,page).then(res=>{
                if(res.returnCode===ERR_OK){
                  this.$set(this.commentList.list[index],'childList',res.data)
                }
            });
        },
//        书籍章节列表
        handleClick1(tab) {
            if(tab.name==='second'&& !this.firstOne){
                this.$store.dispatch("FETCH_CHAPTER_LIST",{bid:this.$route.params.bid}).then(()=>{
                  this.firstOne = true
                })
            }
        },
//        打赏、推荐票、金票
        myConsume:function (type) {
          this.$store.dispatch('init',{type:type});
            console.log(this.$store.state.Consume);
            if(!this.$store.state.userInfo.userId){this.$router.push("/login");return false}
//
        },
//        点击回复
        getAnswer(index){
          let self = this;
          if(!this.commentList.list[index].answer){
            this.answerTxt = '';
            this.commentList.list.map(function (item) {
              self.$set(item,'answer',false)
            });
            this.commentList.list[index].answer = true
          }else {
            this.commentList.list[index].answer = false
          }
          if(this.commentList.list[index].answer){
            this.pageHandler(1,index)
          }
        },
//        获取书籍详情页信息
        getBookInfo(){
          this.$store.dispatch("FETCH_BOOK_DETAIL",{ bid:this.$route.params.bid })
        },
//        发布评论
        addComment(){
            FetchAddBookComment({
              bookId:this.bookDetail.bookListInfo.bookId,
              bookName:this.bookDetail.bookListInfo.bookName,
              userName:this.$store.state.userInfo.pseudonym,
              commentContext:this.commentText
            }).then(json=>{
                if(json.returnCode===ERR_OK){
                  this.$message("评论成功！");
                  this.commentText = '';
                  this.handleCurrentChange(1)
                }
            });
        },
//        回复评论
        addReplyComment(id,index){
            FetchReplyBookComment({
              bookid:this.bookDetail.bookListInfo.bookId,
              bookName:this.bookDetail.bookListInfo.bookName,
              commentId:id,
              userName:this.$store.state.userInfo.pseudonym,
              replyCommentsContent:this.answerTxt,
              puserId:this.commentList.list[index].userId
            }).then(json=>{
                if(json.returnCode===ERR_OK){
                  this.$message("评论成功！");
                  this.answerTxt = '';
                  this.pageHandler(1,index);
                  this.commentList.list[index].replyCount++
                }
            });
        },
//        评论点赞
        addLaud(index){
            FetchCommentLaud(this.commentList.list[index].id).then(json=>{
                if(json.returnCode===ERR_OK){
                    this.$message(this.commentList.list[index].isthumbs?'取消成功':'点赞成功');
                    if(this.page===1){
                        this.commentList.list.forEach((item)=>{
                            if(item.id===this.commentList.list[index].id){
                              item.isthumbs = item.isthumbs?0:1;
                              item.isthumbs?item.thumbsCount++:item.thumbsCount--
                            }
                        });
                    }else {
                        this.commentList.list[index].isthumbs = this.commentList.list[index].isthumbs?0:1;
                        this.commentList.list[index].isthumbs?this.commentList.list[index].thumbsCount++:this.commentList.list[index].thumbsCount--
                    }
                }
            });
        },
//        关注用户
        addAttention(id,name){
          FetchUpdateInfo('add',this.$cookie('user_id'),id,name).then(json=>{
            if(json.returnCode===ERR_OK){
              this.$message("关注成功");
              this.handleCurrentChange(this.page)
            }
          });
        },
//        加入书架
        addBookshelf(){
            FetchAddBookShelf(this.bookDetail.bookListInfo.bookId,this.$store.state.userInfo.pseudonym,this.bookDetail.bookListInfo.bookName).then(json=>{
              if(json.returnCode===200){
                  this.bookDetail.bookListInfo.collectionStatus = (this.bookDetail.bookListInfo.collectionStatus?0:1);
                  this.$message(json.msg)
              }
            });
        }
      },
      mounted(){
        this.$store.dispatch("FETCH_BOOK_DETAIL",{ bid:this.$route.params.bid });
        this.onceShow = true;
//        let height = this.$http(window).height()-440;
//        this.minHeight = height
      },
      watch:{
        page:function (val,old) {
          this.pageChange = true;
        }
      },
      computed:{
        ...mapGetters({
          bookDetail:'bookDetail',
          commentList:'bookCommentList',
          chapterList:'chapterList',
          activeName:'activeName'
        }),
        words:function () {
          return this.reply.replace(/\s/g,'').length +'/'+this.$trim(this.commentText).length
        },
        Title:function () {
          return this.bookDetail.bookListInfo?(this.bookDetail.bookListInfo.bookName +'－' +this.bookDetail.bookListInfo.writerName):'书籍不存在'
        }
      }
    };
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

  font-color = #FB5E6F
  btn-color =  #F77583
.tabWrap
  position relative
  .more
    position absolute
    z-index 99
    right 5px
    top 10px
  .c-main
    border-bottom 1px solid #e4e4e4
  .el-tabs__header
    border none
    .el-tabs__item
      padding 0
      margin-right 50px
      transition none
      font-size 16px
    .el-tabs__item.is-active
      border none!important
      border-bottom 2px solid btn-color!important
      color font-color!important
  .el-tabs__content
    border none
    .el-collapse
      border 1px solid #ffc9c9
      border-radius 4px
      min-height 140px
      &.b_chapter_list
        background #fffbfa
        .el-collapse-item
          border-bottom 1px solid #efefef
          &:last-child
            border none!important
            margin-bottom :0
          .el-collapse-item__header
            border none
            color #000
            background #fffbfa
            font-size 15px
            .el-collapse-item__header__arrow
              float right
              margin 13px 8px
              color #F77583
          &.is-active
            .el-collapse-item__header
              border-bottom none
        .el-collapse-item__wrap
          background :#fffbfa
          border-bottom none
          .el-collapse-item__content
            overflow hidden
            padding :0 15px
          .collapse-item-link
            float :left
            width :22%
            height :42px
            line-height :42px
            margin-right :4%
            &:nth-child(4n)
              margin-right 0
            .txt-overflow
              display inline-block
              vertical-align middle
              max-width: calc(100% - 24px)
            .icon-cvip
              display :inline-block
              height :16px
              vertical-align :-3px
              margin-left :4px


.commentTab
  .el-tabs__header
    .el-tabs__item
      font-size :14px
.sub-nav
  height 64px
  font-size:14px
  line-height:64px
  color : #a9a9a9
  .el-breadcrumb
    height :100%
    line-height :64px
    font-size :14px
    color :#666
 .bookWrap
    /*height :349px;*/
    margin-top:10px
    padding-bottom 20px
    .bw-left
      position relative
      width :198px
      float :left
      text-align :center
      height :272px
      .cover
        width :100%
        height :100%
        border-radius :7px
    .bw-right
      position :relative
      height :100%
      overflow: hidden
      padding-left:18px
      font-size: 14px
      .b-handle
        color #fff
        height: 40px
        line-height :38px
        text-align center
        font-size 15px
        .clear
          overflow hidden
        >.fl
          width 232px
        >.fr
          width 250px
        .spec
          float left
          width 48px
          color #d8d8d8
          font-size 22px
        a
          display:inline-block
          float left
          width: 108px
          border-radius :8px
          text-align center
          &.read
            background-color :btn-color
            margin-right 16px
            color:#fff
            &:hover
              color:#fff!important
          &.addShelf
            border :1px solid btn-color
            background-color : #fff
            color font-color
        span.btn
          float right
          height 40px
          line-height 40px
          /*width 80px*/
          padding 0 9px
          border-radius 20px
          margin-left 10px
          min-width 70px
          &:last-child
            margin-left 0
          &.reward
            background #FF5F5F
          &.annume
            /*width 90px*/
            background #8BC34A
          &.pepper
            background #FFD521
      .b-title
        height :30px
        line-height :26px
        font-size: 18px
        strong
          display inline-block
          float left
        span.b-state
          display :inline-block
          border-radius :6px
          padding:0 6px
          font-size:14px
          border :1px solid #47b2b8
          color :#47b2b8
          margin-left :18px
          line-height 24px
          &.end
            color #ff6f00
            border-color #ff6f00
      .b-info
        line-height :26px
        >p
          font-size :12px
          color :#666
          line-height 24px

          &.base
            span
              margin-right 30px
              a
                max-width 64px
                vertical-align baseline
                color #666
              &:last-child
                margin-right 0
        .bi-center
          margin-top 5px
          font-size 14px
          color #333
          >p
            span
              display:inline-block
              width 130px
              background-repeat :no-repeat
              background-position 5px center
          .red-pepper
            padding-left :20px
            background-image: url("../../assets/image/icon/pepper@x1_4.png");
          .green-pepper
            padding-left :20px
            background-image: url("../../assets/image/icon/pepper@x1_5.png");
          .gloden-pepper
            padding-left :20px
            background-image: url("../../assets/image/icon/pepper@x1_6.png")
      .bookIntro
        position relative
        line-height :1.7em
        font-size:14px
        min-height: 5.1em
        height 5.1em
        padding 10px 0 20px
        text-indent 2em
        padding-right 7px
        color #666
        box-sizing content-box
        overflow hidden
        .text
          height 100%
          overflow hidden
          word-break break-all
        &.auto
          height auto
        .show
          position absolute
          bottom 8px
          right 10px
          line-height 1em
          color #ff4d51
          cursor pointer
          text-indent 0
      .bookLabel
        position :absolute
        bottom:0
        width :100%
        height :51px
        line-height :50px
        border-top:1px solid #efefef
        span
          padding:4px 10px
          border:1px solid #dbdbdb
          border-radius :14px
          margin :0 6px


 .bd-share-box
   border-bottom 1px solid #efefef
   padding-bottom 10px
   >span
      line-height 38px
  /*作者相关信息 start*/
.bw-info
  height :112px
  padding:10px 0
  border-bottom:1px solid #efefef
  .picture
    float: left
    width:92px
    img
      width:72px
      height :72px
      border-radius:72px
      border:1px solid #ddd
  .bw-person
    margin :0 102px 0 92px
    overflow: hidden
    padding:0 38px
    height :100%
    h3
      font-size: 14px
      height: 36px
      line-height 44px
    p
      line-height :1.5em
      color: #797979
      max-height: 44px
      width :100%
      overflow :hidden
  .attention
    float: right
    width: 102px
    line-height :48px
    border:1px solid btn-color
    border-radius :51px
    height :48px
    color: font-color
    font-size:14px
    margin:12px auto
    text-indent :20px
    background :url("../../../static/img/icon/class.png") no-repeat 20px center
  /*作者相关信息 end*/

  /* 最新章节及全部章节列表  start */
.book-chapter
  overflow:hidden
  /*border-bottom:1px solid #efefef*/
  padding-top:20px
  transition :1s all ease
  .reading
    color: font-color
  .c-title
    height :28px
    line-height :18px
    p
      font-size: 14px
      color: #000
      font-weight :bold
      float: left
      margin-right :25px
      width :auto
      max-width:260px
    .date
      color :#bfbfbf
  .c-content
     color: #616161
     font-size: 14px
     line-height :2.05
     height :8em
     width:100%
     user-select none
     margin-bottom 1em
     >div
        overflow hidden
     p
        text-indent :2em
        width:100%
  /* 最新章节及全部章节列表 end */

  /*同类推荐书籍列表 start  */
 .recommend
   height :288px
   .recommendList:hover span
     display :block
   .recommendList
     height :206px
     position:relative
     overflow hidden
     margin-bottom :10px
     ul
      height :196px
      width auto
      overflow: hidden
      white-space:nowrap
     span
       display :none
       width: 50px
       height :40px
       background :rgba(0,0,0,0.25)
       text-align: center
       position :absolute
       line-height :38px
       top: 66px
       color: #fff
       font-size:26px
       font-weight :400
       cursor: pointer
       border-radius :3px
       transform :scale(0.6,1.5)
       user-select:none
     .tabRight
       right:-6px
     .tabLeft
        left :-6px
     li:first-child
      margin-left:0
     li
       float left
       width: 130px
       margin-left:24px
       a
          display:block
          img
            width:100%
            height :168px
       p
         width: 100%
         line-height :28px
         text-align: center
         font-size:14px

  /*同类推荐书籍列表 end  */


  /*书籍评论列表  start  */
.main-right
  .title
    height :38px
    width :124px
    margin:0 auto
    line-height :38px
    text-align :center
    font-size:16px
    border-bottom:2px solid #f77583
  .mr-wrap
    float :right
    width: 224px
    border-radius :5px
    border:1px solid #F77583
    &.author
      text-align center
      padding 0 20px 30px
      .name
        font-size 16px
        margin 10px 0
      >a
        img
          width 78px
          height 78px
          border-radius 50%
          margin 16px auto 0
          border 1px solid #979797

    &.fans
      margin-top :63px
      padding-bottom 20px
      .fans-list
        .order
          width :18px
          font-size: 16px
          color #ff8383
        li
          height:38px
          padding:0 10px
          line-height 38px
          &:nth-child(3)
            ~li
              .order
                color #333
          &:nth-child(-n+3)
            margin :6px 0
            .fans-face
              display inline-block
              float :left
              margin:4px 10px 0 0
              width :30px
              height :30px
              img
                width:100%
                height :100%
                border-radius :50%
        .fans-info
          overflow: hidden
          height :100%
          .grade
            padding-right :24px
            background:url('../../assets/image/icon/pepper-coin.png') no-repeat right center
            background-size :auto 56%
          .fans-name
            float :left
            width :auto
            max-width: 60px
      /*粉丝列表区域 end*/

  /*打赏推荐弹窗样式*/
.el-message-box__wrapper .bookInfo-msgbox
  position relative
  width :440px
  overflow visible
  .el-message-box__content
    padding-top :16px
  .el-message-box__header
    position inherit
    padding-top :15px
    .el-message-box__title
      text-align center
      font-size 16px
      font-weight :normal
    .el-message-box__headerbtn
      top :-15px
      right :-15px
      width :40px
      height :40px
      background :#fff
      border-radius :20px
  .el-message-box__btns
    text-align center
    padding-top :0
    padding-bottom :30px
    .el-button--primary
      width :206px
      height :42px
      border-radius :22px
  .alert-form
    padding 0 20px
    .info
      line-height 28px
    .charge-btn
      width:96px
      border-radius:20px
      height:28px
      float:right
      background:#f77583
      color:#fff
      line-height:28px
      text-align center
    .textarea-box
      position :relative
      margin: 20px 0;
      height :60px
      .advice
        border :1px solid #efefef
        border-radius :5px
        height: 60px;
        width: 100%;
        padding :10px
        line-height :1.5
        color :#666
      .words
        position: absolute
        bottom :12px
        right :10px
        line-height :1
    .el-radio-button:last-child
      margin-right :0px
    .el-row:first-child
      .el-radio-button
        margin-bottom :20px
    .el-radio-button.is-active
      .el-radio-button__inner
        border :1px solid #f73d51
        background-color :#fff
        color :#333
    .el-radio-button
      width :104px
      height 104px
      margin-right :22px
      overflow :hidden
      .el-radio-button__inner
        height :100%
        width :100%
        border-radius :5px
        border :1px solid #efefef
        padding-top :80px
        box-shadow :none
        background:#fbf3f3  url("../../../static/img/coin-188.png") no-repeat left top
        background-size:cover
    .el-row:nth-child(1) .el-radio-button:nth-child(2) .el-radio-button__inner
        background-image  url("../../../static/img/coin-288.png")
    .el-row:nth-child(1) .el-radio-button:nth-child(3) .el-radio-button__inner
      background-image  url("../../../static/img/coin-588.png")
    .el-row:nth-child(2) .el-radio-button:nth-child(1) .el-radio-button__inner
      background-image  url("../../../static/img/coin-888.png")
    .el-row:nth-child(2) .el-radio-button:nth-child(2) .el-radio-button__inner
      background-image  url("../../../static/img/coin-1888.png")
    .el-row:nth-child(2) .el-radio-button:nth-child(3) .el-radio-button__inner
      background-image  url("../../../static/img/coin-8888.png")
</style>


