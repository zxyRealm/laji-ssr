<template>
    <div class="zxy-comment-wrap">
      <div class="zxy-comment">
        <ul v-if="dataList" class="zxy-comment-list">
          <template v-if="dataList.length>0" >
            <li v-for="(item,$index) in dataList"  v-if="$route.name==='userIndex'?($index===0):true"  class="zxy-comment-list-item clear">
              <div class="comment-list-item clear" :style="{paddingLeft:labelWidth+'px'}">
                <div class="user-avatar">
                  <router-link :to="'/reader/'+(!item.commUserId?item.userId:item.commUserId)" :target="'_blank'">
                    <img class="pic" :src="item.userHeadPortraitURL" :alt="item.userName">
                    <i class="zdy-icon__user_vip r-5X0" v-if="item.vipGrade"></i>
                  </router-link>
                </div>
                <div class="comment-content">
                  <div class="user-info">
                    <span class="user-name font14">{{item.pseudonym?item.pseudonym:item.replyUserName}}</span>
                    <i class="zdy-icon__sex v-item" :class="item.userSex?'girl':null"></i>
                    <zdy-icon__user_level :grade="item.userGrade"></zdy-icon__user_level>
                    <div v-if="isHandle && $route.name!=='messageHarvest'" class="handle fr">
                      <span class="delete" @click="handleClick(item.id,'delete1')">删除</span>
                      <span class="upTop" v-if="item.isTo!=undefined" @click="handleClick({id:item.id,bid:item.bookId,state:item.isTo},'upTop')">
                        {{item.isTo?'取消置顶':'置顶'}}
                      </span>
                      <!--<span class="btn ban" @click="handleClick(item.userId,'ban')">禁言</span>-->
                    </div>
                    <span class="fr harvest-icon" v-else-if="$route.name==='messageHarvest'">
                      <img src="../../assets/image/icon/pepper@x1_1.png" alt="">
                      X {{item.spicyiTicketCount}}
                    </span>
                    <span class="fr clr9" v-else>{{item.commentDateTime | time('long')}}</span>
                  </div>
                  <p class="mt5 clr9" v-if="$route.name==='messageHarvest'">《{{item.bookName?item.bookName:item.commBookName}}》</p>
                  <p v-if="$route.name==='userMessage'" class="clr9 font14">回复了你</p>
                  <div class="comment-txt">
                    <template v-if="$route.name==='messageHarvest'">
                      <font color="#F73D51" class="font14">留言：</font>{{item.arewardContent}}
                    </template>
                    {{item.replyCommentsContent?item.replyCommentsContent:item.commentContext}}
                  </div>
                  <div class="reply-comment-text" v-if="item.replyCommentsContent">
                    <router-link v-if="$route.name==='bookReview'" style="color:#3B7ADB" target="_blank" :to="'/reader/'+item.commentuserid">{{item.cmname}}：</router-link>
                    <font color="#666" v-else>
                      评论：
                    </font>{{item.commentContext}}
                  </div>
                  <div class="more-about clr9">
                    <span v-if="isHandle" class="date">{{!item.commentDateTime?item.giveDateTime:item.commentDateTime | time('long')}}</span>
                    <span class="date" v-else>
                      <router-link class="clr9 txt-overflow" style="max-width: 30em;display: inline-block;" :to="!item.chapterId?'/book/'+item.bookId:'/chapter/'+item.chapterId" target="_blank">
                        《{{item.bookName?item.bookName:item.commBookName}}》{{item.chapterName}}    {{item.showText}}
                      </router-link>
                    </span>
                    <div class="handle fr" v-if="$route.name!=='userIndex'">
                      <span class="btn zan" @click="handleClick($index,'zan')" :class="{past:item.isthumbs}">
                        {{item.thumbsCount}}
                      </span>
                      <span class="btn reply" v-if="!isNaN(item.replyCommentInfoCount)&& $route.name!=='commentBook'" @click="handleClick($index,'reply')">
                        {{item.replyCommentInfoCount}}
                      </span>
                      <!--用户中心书评、吐槽删除-->
                      <span class="btn delete" v-if="$route.name==='commentBook'|| $route.name==='commentChapter'" @click="handleClick($index,'delete')"></span>
                      <span class="btn clr9 font14" v-if="$route.name==='messageHarvest'" @click="!item.disposeState?handleClick($index,'reply'):false">
                        {{item.disposeState===1?'已回复':'回复'}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.state" class="comment-reply-wrap">
                <div class="reply">
                  <div class="avatar-wrap">
                    <router-link to="/user/index" class="avatar" :target="'_blank'">
                      <img :src="$store.state.userInfo.userHeadPortraitURL?$store.state.userInfo.userHeadPortraitURL:'http://useravatarimg.oss-cn-hangzhou.aliyuncs.com/UserAvatar/userDefaultHandImg2.jpg'" :alt="$store.state.userInfo.pseudonym">
                    </router-link>
                  </div>
                  <div class="reply-wrap">
                    <button type="button" @click="handleClick({index:$index,content:replyData.replyContent},'Reply')" class="comment-btn">发布<br>评论</button>
                    <div class="rw-left">
                      <input type="hidden" v-model="item.id">
                      <textarea name="" v-model="replyData.replyContent" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。" id="" cols="30" rows="10" class="reply-content"></textarea>
                      <p class="more clear">
                        <span class="emoji">添加表情</span>
                        <span class="words fr">{{words}}/100</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.dataList" class="comment-list-child">
                <template v-for="(item2,$index2) in item.dataList.list">
                  <div class="comment-list-item clear">
                    <div class="user-avatar">
                      <router-link :to="'/reader/'+item2.commUserId" :target="'_blank'">
                        <img class="pic" :src="item2.userHeadPortraitURL" :alt="item2.userName">
                        <img class="icon" src="../../assets/image/icon/uservip-icon.png" alt="用户VIP">
                      </router-link>
                    </div>
                    <div class="comment-content">
                      <div class="user-info">
                        <span class="user-name">{{item2.pseudonym}}</span>
                        <i class="zdy-icon__sex v-item" :class="item2.userSex?'girl':null"></i>
                        <zdy-icon__user_level :grade="item.userGrade"></zdy-icon__user_level>
                        <div v-if="isHandle" class="handle fr">
                          <span class="btn delete" @click="handleClick(item2.id,'delete2')">删除</span>
                          <!--<span class="btn ban" @click="handleClick(item.userId,'ban')">禁言</span>-->
                        </div>
                        <span class="fr" v-else>{{item2.commentDateTime | time('long')}}</span>
                      </div>
                      <div class="comment-txt">
                        {{item2.replyCommentsContent}}
                      </div>

                      <div class="more-about">
                        <span v-if="isHandle" class="date">{{item2.commentDateTime | time('long')}}</span>
                        <span v-else class="date">{{item2.bookName}}</span>
                        <div class="handle fr">
                          <span class="btn zan" @click="handleClick($index,'zan')" :class="{past:item2.isthumbs}">{{item2.thumbsCount}}</span>
                          <span class="btn reply" @click="handleClick($index,'reply')">{{item2.replyCommentInfoCount}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <el-pagination
                  v-if="item.dataList.total>item.dataList.pageSize"
                  @current-change="handleClick({index:$index,page:currentPage2,id:item.id},'page2')"
                  :current-page.sync="currentPage2"
                  small
                  :page-size="item.dataList.pageSize"
                  layout="prev, pager, next"
                  :total="item.dataList.total">
                </el-pagination>
              </div>
            </li>
          </template>
          <zdy-hint v-else :size="$route.name!=='userIndex'?1:0"></zdy-hint>
        </ul>
        <template v-if="$route.name!=='userIndex'">
          <template v-if="value.total">
            <el-pagination v-if="value.total && value.total>value.pageSize"
               class="pbg"
               @current-change="handleClick(value.pageNum,'page1')"
               :current-page.sync="value.pageNum"
               :page-size="value.pageSize"
               layout="prev, pager, next, jumper"
               :total="value.total">
            </el-pagination>
          </template>
          <el-pagination v-else-if="total && $route.name!=='userIndex' && total>20"
             class="pbg"
             @current-change="handleClick(currentPage3,'page1')"
             :current-page.sync="currentPage3"
             :page-size="20"
             layout="prev, pager, next, jumper"
             :total="total">
          </el-pagination>
        </template>
      </div>
      <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      props:{
        value:{
            type:[Array,Object]
        },
        currentPage1:{
          type:[Number,String],
          default:1
        },
        labelWidth:{
          type:[Number,String],
          default:0
        },
        isHandle:{
          type:Boolean,
          default:true
        }
      },
      data(){
        return {
          currentPage2:1,
          currentPage3:1,
          replyData:{
            replyContent:''
          }
        }
      },
      methods:{
        handleClick(index,type){
          this.$emit("handleClick", index, type);
        }
      },
      mounted(){
        this.currentPage3 = parseInt(this.$route.params.page)
      },
      computed:{
          "words"(){
              if(this.$trim(this.replyData.replyContent).length>100){
                 this.replyData.replyContent = this.replyData.replyContent.substring(0,100)
              }
             return this.$trim(this.replyData.replyContent).length
          },
          dataList(){
            if(this.value.list){
              return this.value.list
            }else {
              return this.value.allCommentList
            }
          },
          total:function () {
            if(this.value.commentNum || this.value.commentReply){
              return this.value.commentNum + this.value.commentReply
            }
          }
      },
      watch:{
        "$route.params.page":function (val) {
        }
      }
    }
</script>
<style lang="stylus" scoped type="text/stylus" rel="stylesheet/stylus">
.zxy-comment-wrap
  .zxy-comment
    .zxy-comment-list
      .zxy-comment-list-item:last-child
        .comment-list-item
          border-bottom none
      .zxy-comment-list-item
        >.comment-reply-wrap
          padding-top:15px
        .comment-list-item
          padding :32px 0 20px
          border-bottom 1px solid #efefef
          background:#fff
          .user-avatar
            float: left
            width: 84px
            >a
              position relative
              display :inline-block
              .pic
                width :54px
                height :54px
                border-radius:50%
                margin-top: 8px
                border:1px solid #ddd
              .icon
                position: absolute
                right: -5px
                top: 3px
                height: auto
                width: 20px
                transform:rotate(10deg)
          .comment-content
            overflow hidden
            padding-right 15px
            span.btn
              cursor pointer
              &:last-child
                 margin-right 0!important
            .user-info
              margin-bottom:8px
              .level
                padding 0 6px
                background: #74f2fe
                border-radius :4px
                color #fff
                line-height: 1
              .user-sex
                padding: 0 10px
                background:url("../../assets/image/icon/boy-icon.png") no-repeat left 2px
                margin: 0 8px 0 6px
              .user-sex.girl
                background-image :url("../../assets/image/icon/girl-icon.png")
              .harvest-icon
                font-size: 14px
                color:#333
                >img
                  display inline-block
                  width 16px
                  vertical-align middle
              .handle
                span
                  margin-left 40px
                  user-select none
                  cursor pointer
                .delete
                  color: #fa6d7d
                .upTop
                  color: #9cd95a
                .ban
                  color: #ffa12d
            .comment-txt
              margin :8px 0 15px
              font-size :14px
              min-height: 1.5em
              padding-right :20px
              word-break break-all
            .reply-comment-text
              font-size 14px
              line-height 1.5em
              min-height 2em
              background #F3F3F3
              padding:10px 8px 10px 28px
              margin-bottom 12px
              word-break break-all
            .more-about
              height: 24px
              line-height: 24px
              .handle
                span
                  display:inline-block
                  padding-left:40px
                  margin-right: 20px
                  background:no-repeat left top
                  user-select none
                  vertical-align middle
                  cursor pointer
                  &.zan
                    padding-left:30px
                    background-image url("../../assets/image/icon/laud-grey.png")
                    color #999
                    &.past
                      background-image url("../../assets/image/icon/laud-red.png")
                  &.reply
                    background-image: url("../../assets/image/icon/icon-message@1x.png")
                    &:hover
                      background-image: url("../../assets/image/icon/icon-message@1x.png")
                  &.delete
                    background-image: url("../../assets/image/icon/delete-icon@1_01.png")
                    padding: 11px
        .comment-list-child
          padding-left :84px
        /*width: 70px;*/
    .el-pagination
      padding ;15px!important
      background #fff
.comment-reply-wrap
  .reply
    padding-left :84px
    .avatar-wrap
      float: left;
      width: 80px;
      margin-top: 8px;
      a
        display inline-block
        img
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid #a2a2a2;
    .reply-wrap
      overflow hidden
      .comment-btn
        height: 64px;
        float: right;
        padding: 4px 20px;
        font-size: 14px;
        color: #fff;
        border-radius: 4px;
        text-align: center;
        min-width: 60px;
        background-color: #f77583;
        border: 1px solid #f77583;
        line-height: 1.1em;
      .rw-left
        position: relative
        overflow: hidden;
        margin-right: 90px;
        textarea
          font-size: 12px;
          display: inline-block;
          box-sizing: border-box;
          background-color: #f4f5f7;
          border: 1px solid #e5e9ef;
          overflow: auto;
          border-radius: 4px;
          color: #555;
          width: 100% !important;
          height: 65px;
          transition: 0s;
          padding: 5px 10px;
          resize: none;
          line-height: 2em;
        .more
          box-sizing: content-box;
          padding: 10px 0;
          color: #747474;
          .emoji
            background: url(../../assets/image/icon/emoji-icon.png) no-repeat 4px 5px;
            padding: 7px 4px 7px 28px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            background-size: auto 70%;

</style>
