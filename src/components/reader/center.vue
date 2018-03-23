<template>
  <div style="padding-left:18px" class="reader-common-center clear">
    <div class="mw-frc-left">
      <div class="mine-record bsw br5 cmb">
        <div class="area-title">TA的{{identity?'小说':'阅读记录'}}
          <router-link :to="'/bookshelf/'+$route.params.uid">
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <ul v-if="recordList" class="prlb15">
          <template v-if="recordList.length>0" >
            <li v-for="(item,$index) in recordList" v-if="$index<8" class="record-list-item">
              <router-link :to="'/book/'+item.bookId" :title="item.bookName">
                <img :src="item.bookImage" :alt="item.bookName">
              </router-link>
            </li>
          </template>
          <zdy-hint v-else :size="0" :type="identity?'bli':'rec'"></zdy-hint>
        </ul>
      </div>
      <div class="user-message-wrapper bsw br5 cmb">
        <div class="area-title reader-title">
          <span>TA的书评</span>
          <router-link class="fr" :to="'/book_review/'+$route.params.uid">
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <ul class="umw-list">
          <template v-if="commentList.list && commentList.list.length>0" >
            <li v-for="(item,$index) in commentList.list" v-if="$index<3" class="umw-list-item clear">
              <div class="user-pic">
                <router-link :to="'/reader/'+item.userId" :target="'_blank'">
                  <img class="avatar" :src="item.userHeadPortraitURL" :alt="item.pseudonym">
                </router-link>
                <i v-if="item.vipGrade" class="zdy-icon__user_vip t2"></i>
              </div>
              <div class="message-content">
                <div class="message-info">
                  <span class="time fr color6">{{item.commentDateTime|time('long')}}</span>
                  <div class="user-msg">
                    <p class="name fl txt-overflow">{{item.pseudonym}}</p>
                    <i class="zdy-icon__sex v-item"></i>
                  </div>
                </div>
                <p class="b-title color6"><router-link class="clr9" :to="'/book/'+item.bookId" >《{{item.bookName}}》</router-link></p>
                <div class="message-txt">
                  {{item.commentContext}}
                </div>
              </div>
            </li>
          </template>
          <zdy-hint v-else :size="0"></zdy-hint>
        </ul>
      </div>
      <div class="user-message-wrapper bsw br5 cmb">
        <div class="area-title">
          <span>TA的吐槽</span>
          <router-link class="fr" :to="'/spit_slot/'+$route.params.uid">
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <ul class="umw-list br5">
          <template v-if="spitList.list && spitList.list.length>0" >
            <li v-for="(item,$index) in spitList.list" v-if="$index<3" class="umw-list-item clear">
              <div class="user-pic">
                <router-link :to="'/reader/'+item.userId" :target="'_blank'">
                  <img class="avatar" :src="item.userHeadPortraitURL" :alt="item.userName">
                </router-link>
                <i v-if="item.vipGrade" class="zdy-icon__user_vip t2"></i>
              </div>
              <div class="message-content">
                <div class="message-info">
                  <span class="time fr color6">{{item.commentDateTime|time('long')}}</span>
                  <div class="user-msg">
                    <p class="name fl txt-overflow">{{item.pseudonym}}</p>
                    <i class="zdy-icon__sex v-item" :class="item.userSex?'girl':null"></i>
                    <zdy-icon__user_level :grade="item.userGrade"></zdy-icon__user_level>
                  </div>
                </div>
                <p class="b-title color6">
                  <router-link class="clr9" :to="'/chapter/'+item.chapterId" target="_blank">《{{item.bookName}}》{{item.chapterName}}</router-link>
                </p>
                <div class="message-txt">
                  {{item.commentContext}}
                </div>
              </div>
            </li>
          </template>
          <zdy-hint v-else :size="0"></zdy-hint>
        </ul>
      </div>
    </div>
    <div class="mw-frc-right">
      <div class="mine-attention bsw br5 cmb">
        <div class="area-title">TA关注的
          <router-link class="more" :to="'/attention/'+$route.params.uid">
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <ul v-if="attentionList.list">
          <template v-if="attentionList.list.length>0">
            <li v-for="(item,$index) in attentionList.list" v-if="$index<5" class="mf-list-item">
              <router-link :to="'/reader/'+item.followId" :target="'_blank'">
                <img class="fl" :src="item.userHeadPortraitURL" :alt="item.followUserName">
              </router-link>
              <span class="handle-btn fr" @click="$send('letter',{sendName:item.followUserName,sendUserId:item.followId})">私信</span>
              <p class="username txt-overflow">{{item.followUserName}}</p>
            </li>
          </template>
          <zdy-hint v-else type="atn" :size="0"></zdy-hint>
        </ul>
      </div>
      <div class="mine-fans bsw br5 cmb">
        <div class="area-title">TA的粉丝
          <router-link class="more" :to="'/fans/'+$route.params.uid">
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <ul v-if="fansList.list">
          <template v-if="fansList.list.length>0" >
            <li v-for="(item,$index) in fansList.list" v-if="$index<5" class="mf-list-item">
              <router-link :to="'/reader/'+item.userId" :target="'_blank'">
                <img class="fl" :src="item.userHeadPortraitURL" alt="">
              </router-link>
              <span class="zdy-icon__atn" :class="{cancel:item.isfollow}" @click="item.isfollow?$cancelAttention($index,'fans'):$addAttention($index,'fans')">关注</span>
              <p class="username txt-overflow">{{item.followUserName}}</p>
            </li>
          </template>
          <zdy-hint v-else type="fans" :size="0"></zdy-hint>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { FetchGetUserData,FetchGetPrattle,FetchAuthorBookList } from '../../api'
  export default{
    props:['identity'],
    data() {
      return {
        commentList:{},
        spitList:{},
        recordList:null,
        fansList:{},
        attentionList:{}
      };
    },
    methods: {
      //        获取评论信息列表
      getDataList(){
//      书评
        let id = this.$route.params.uid;
        FetchGetUserData(1,'bcom',id).then(json=>{
          if(json.returnCode===200){
            this.commentList = json.data
          }
        });

//        吐槽
        FetchGetPrattle(id,1,'user').then(json=>{
          if(json.returnCode===200){
            this.spitList = json.data
          }
        });


//        用户粉丝列表
        FetchGetUserData(1,'reFan',id).then(json=>{
          if(json.returnCode===200){
            this.fansList = json.data
          }
        });
        

//        用户关注列表
        FetchGetUserData(1,'reAtt',id).then(json=>{
          if(json.returnCode===200){
            this.attentionList = json.data
          }
        });

      },
      getBookList(){
         let id = this.$route.params.uid;
        if(this.identity===1){
//            作者书籍
          FetchAuthorBookList(id).then(json=>{
            if(json.returnCode===200){
              this.recordList = json.data
            }else if(json.returnCode===500){
              this.recordList = []
            }
          })
        }else if(this.identity===0) {
          //        阅读记录
          FetchGetUserData(1,'reLog',id).then(json=>{
            if(json.returnCode===200){
              this.recordList = json.data.list
            }
          });
        }
      }
    },
    mounted(){
      this.getDataList();
      this.getBookList()
    },
    watch:{
        identity:function (val) {
          this.getBookList()
        }
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">

.no-book
  position relative
  height 320px
  background url('../../../static/img/no-book-bg@1_01.png') no-repeat center top
  .txt
    position absolute
    bottom 0
    left 0
    width 100%
    height 1em
    line-height 1em
    color #666
    font-size 16px
    text-align center
.mw-frc-left
  float: left
  width :500px
  margin-right :20px
  .mfr-wallet
    background :#fff
    height :200px
  /*我的钱包 */
  .mine-wealth-wrapper
    height:208px
    background :#fff
    padding :25px 15px
    .mw-ft
      height :40px
      line-height :1em
      font-size :16px
    .mw-fc
      height :26px
      margin-bottom :64px
      .recharge
        display :inline-block
        padding :4px 10px
        border :1px solid #f73d51
      h2
        font-weight:500
        font-size 20px
    .user-rich
      font-size:14px
      text-align :center
  /*我的阅读记录 */
  .mine-record
    background :#fff
    .record-list-item
      display:inline-block
      margin:14px 16px 0 0
      &:nth-child(4n)
        margin-right 0
      img
        width :98px
        height :130px
        border-radius :5px
  /*我的消息*/
  .user-message-wrapper
    background: #fff
    position relative
    .reader-title
      line-height 1
      padding 15px
    a.more
      position absolute
      right :15px
      top :10px
      font-size :28px
      line-height :20px
      height :24px
      z-index :9
    .umw-list-item:last-child
      border :none
    .umw-list-item
      display:list-item
      min-height :74px
      padding:12px 14px
      border-bottom :1px solid #efefef
      .active
        box-shadow :none
      .user-pic
        float left
        position :relative
        width :76px
        height :74px
        .avatar
          width :48px
          height :48px
          border-radius :50%
          border :1px solid #9c9c9c
        .vip
          position absolute
          left :35px
          top :-3px
          height :16px
          width :16px
      .message-content
        overflow hidden
        .message-info
          height :24px
          .user-msg
            overflow hidden
            .name
              font-size: 14px
              max-width: 120px
              margin-right:5px
            .level
              background #74f3fe
              border-radius :4px
              padding : 0 6px
              font-size :12px
              zoom :.8
              color :#fff
            .time
              color :#999
        .message-txt
          font-size:12px
          line-height:22px
          color :#666
          margin-top 8px
          word-break break-all
.mw-frc-right
  float left
  width 260px
  padding-bottom :15px
  .mine-creation
    height :99px
    background :#fff
    border-radius :5px
    font-size 18px
    line-height :1
    text-align center
    padding:35px 0
    a
      padding :4px 0 4px 36px
      background :url("/assets/image/icon/creation-icon.png") no-repeat left center
    span
      display inline-block
      font-size: 26px
      line-height :.86
      transform :scale(.6,1.2)
  .mine-attention
  .mine-fans
    background :#fff
    border-radius :5px
    box-shadow: 1px 2px 8px 0 rgba(0,0,0,0.1);
  .title
    height :34px
    padding :0 12px
  .mf-list-item:last-child
    border:none
  .mf-list-item
    display :list-item
    overflow :hidden
    padding :6px 10px
    border-bottom:1px solid #efefef
    >a
      display inline
    img
      width:36px
      height :36px
      border-radius 50%
    .username
      overflow hidden
      text-indent:15px
      margin-top :10px
    .handle-btn
      margin-top :8px
      padding :0 6px
      font-size :12px
      border :1px solid #fb5e6f
      border-radius :5px
      cursor pointer

</style>
