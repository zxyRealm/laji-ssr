<template>
    <div class="pl18 clear">
      <div class="mw-frc-left">
        <div class="mine-wealth-wrapper bsw br7 cmb">
          <div class="mw-ft">
            <p class="fl">我的钱包</p>
            <span class="fr font14">
              <router-link to="/user/wallet">
                交易记录
              </router-link>
            </span>
          </div>
          <div class="mw-fc">
            <h2 class="fl">{{$store.state.userInfo.userMoney}} <span class="font16">辣椒</span></h2>
            <router-link class="fr recharge" target="_blank" to="/charge">立即充值</router-link>
          </div>
          <div class="user-rich clear">
            <span class="fl pepper">
              金椒 {{$store.state.userInfo.userGoldenTicket}}
            </span>
            <span class="fr ticket">
              辣椒券 {{$store.state.userInfo.userReadTicket}}
            </span>
            <span class="chilli">
              小米椒 {{$store.state.userInfo.userRecommendTicket}}
            </span>
          </div>
        </div>
        <div class="user-message-wrapper bsw br7 cmb">
          <router-link class="more" :to="moreUrl">
            <i class="el-icon-arrow-right"></i>
          </router-link>
          <template>
            <el-tabs v-model="activeName2" class="user-ct" type="card" @tab-click="handleClick">
              <el-tab-pane :disabled="true" label="我的消息">
              </el-tab-pane>
              <el-tab-pane label="通知" name="first">
                <ul v-if="infoList.list" class="umw-list">
                  <template v-if="infoList.list.length">
                    <li v-for="(item,$index) in infoList.list" v-if="$index<1" class="umw-list-item clear">
                      <div class="message-content">
                        <router-link :to="'/user/message/notice'">
                          <div class="message-info">
                            <span class="time fr">{{item.dateTimes | time('long')}}</span>
                            <div class="user-msg">
                              <p class="name fl txt-overflow">

                                  {{item.title}}

                              </p>
                            </div>
                          </div>
                          <div class="message-txt">
                            {{item.messageContent}}
                          </div>
                        </router-link>
                      </div>
                    </li>
                  </template>
                  <zdy-hint v-else :size="0"></zdy-hint>

                </ul>
              </el-tab-pane>
              <el-tab-pane label="私信" name="second">
                <ul v-if="letterList.list" class="umw-list">
                  <template v-if="letterList.list.length">
                    <li v-for="(item,$index) in letterList.list" v-if="$index<1" class="umw-list-item clear">
                      <div class="user-pic">
                        <router-link target="_blank" :to="'/reader/'+item.userId">
                          <img class="avatar" :src="item.userHeadPortraitURL" alt="">
                        </router-link>
                      </div>
                      <div class="message-content">
                        <div class="message-info">
                          <span class="time fr">{{item.dateTimes | time('long')}}</span>
                          <div class="user-msg">
                            <p class="name fl txt-overflow">{{item.userName}}</p>
                            <i :class="item.userSex?'girl':null" class="zdy-icon__sex v-item"></i>
                          </div>
                        </div>
                        <div class="message-txt">
                          <router-link class="bl" :to="'/user/message/letter/'+item.userId+'/1'">
                            {{item.messageContent}}
                          </router-link>
                        </div>
                      </div>
                    </li>
                  </template>
                  <zdy-hint v-else :size="0"></zdy-hint>
                </ul>
                <zdy-hint v-if="letterList.list===null" :size="0"></zdy-hint>
              </el-tab-pane>
              <el-tab-pane label="评论" name="third">
                <zxy-comment :value="commentList" :isHandle="false"></zxy-comment>
              </el-tab-pane>
            </el-tabs>
          </template>

        </div>
        <div class="mine-record bsw br7">
          <div class="area-title">我的阅读记录
            <router-link to="/user/shelf" class="more"><i class="el-icon-arrow-right"></i></router-link>
          </div>
          <ul v-if="recordList && recordList.list" class="prlb15">
            <template v-if="recordList.list.length">
              <li v-for="(item2,$index2) in recordList.list" v-if="$index2<8" class="record-list-item">
                <router-link  :to="'/chapter/'+item2.chapterId" target="_blank" :title="item2.bookName" >
                  <img :src="item2.bookImage" :alt="item2.bookName">
                  <div class="mark">
                    <p>{{item2.bookName}}</p>
                    <p>上次阅读：{{item2.chapterName}}</p>
                  </div>
                </router-link>
              </li>
            </template>
            <zdy-hint v-else type="record" :size="0"></zdy-hint>
          </ul>
          <zdy-hint v-if="!recordList" type="record" :size="0"></zdy-hint>
        </div>
      </div>
      <div class="mw-frc-right">
        <div class="sign-box">
          <span @click="addSignState">{{!signState?"签到":"已签到"}}</span>
        </div>
        <div class="mine-creation bsw br7 cmb">
          <router-link to="/author/writing/index">我的创作 <i class="el-icon-arrow-right"></i></router-link>
        </div>
        <div class="mine-attention bsw br7 cmb">
          <div class="area-title">
            我的关注
            <router-link class="fr" to="/user/attention"><i class="el-icon-arrow-right"></i></router-link>
          </div>
          <ul v-if="attentionList.list">
            <template v-if="attentionList.list.length>0" >
              <li v-for="(item,$index) in attentionList.list" v-if="$index<5" class="mf-list-item" >
                <router-link :to="'/reader/'+item.followId" :target="'_blank'">
                  <img class="fl" :src="item.userHeadPortraitURL" :alt="item.followUserName">
                </router-link>
                <span
                  class="handle-btn fr"
                  @click="$send('letter',{sendName:item.followUserName,sendUserId:item.followId})">
                  私信
                </span>
                <p class="username txt-overflow">{{item.followUserName}}</p>
              </li>
            </template>
            <zdy-hint v-else type="atn" :size="0"></zdy-hint>
          </ul>
        </div>
        <div class="mine-fans bsw br7">
          <div class="area-title">
            我的粉丝
            <router-link class="fr" to="/user/fans"><i class="el-icon-arrow-right"></i></router-link>
          </div>
          <ul v-if="fansList.list">
            <template v-if="fansList.list.length>0" >
              <li v-for="(item,$index) in fansList.list"  v-if="$index<5" class="mf-list-item">
                <router-link :to="'/reader/'+item.followId" :target="'_blank'">
                  <img class="fl" :src="item.userHeadPortraitURL" :alt="item.followUserName">
                </router-link>
                <span class="zdy-icon__atn" :class="{cancel:item.isfollow}" @click="item.isfollow?$cancelAttention($index,'fans'):$addAttention($index,'fans')">关注</span>
                <p class="username txt-overflow">{{item.followUserName}}</p>
              </li>
            </template>
            <zdy-hint v-else type="fans" :size="0"></zdy-hint>
          </ul>
        </div>
      </div>

      <el-dialog
        title="签到成功"
        custom-class="sign-dialog"
        top="25%"
        :visible.sync="dialogVisible"
        size="tiny"
      >
        <div>
          <div class="sign-dialog-main">
            今日签到成功，已赠送5辣椒券
          </div>

          <div class="bot">
            {{waiting}}秒后自动关闭
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import Comment from '../comment/zxy-comment.vue'
  export default{
      components:{
          'zxy-comment':Comment
      },
      data() {
        return {
          autoTimer:null,
          waiting:3,
          dialogVisible:false,
          activeName2: 'first',
          shelfList:{},
          recordList:{},
          fansList:{},
          attentionList:{},
          commentList:{},
          letterList:{},
          infoList:{},
          weekList:[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          signState:false,
          moreUrl:'/user/message/notice'
        };
      },
      methods: {
        handleClick(tab, event) {
        },
        timer(){
          this.dialogVisible = true;
          this.waiting = 3;
          clearInterval(this.autoTimer);
          this.autoTimer = setInterval(()=>{
            this.waiting--;
            if(this.waiting<=1){
              clearInterval(this.autoTimer);
              this.dialogVisible = false;
            }

          },1000);
        },
        getDataList(){
          let preUrl2 = 'person-UserBookReadRecord';
//          关注列表
          this.$ajax("/fans-Follow",{
            startpage:1
          },json=>{
            if(json.returnCode===200 || !json.data){
              this.attentionList = json.data
            }
          },'get');
//          粉丝列表
          this.$ajax("/fans-myFans",{
                startpage:1
              },json=>{
            if(json.returnCode===200 || !json.data){
              this.fansList = json.data
            }
          },'get');
//        阅读记录
          this.$ajax("/"+preUrl2,{
            userid:this.$cookie('user_id'),
            startpage:1
          },json=>{
              this.recordList = json.data
          });

//          私信
            this.$ajax("/person-message?startpage=1",'',json=>{
              if(json.returnCode===200 || !json.data){
                 this.letterList = json.data
              }
            },'get');

//          评论
            this.$ajax("/comm-coverReplyInfo",{userid:this.$cookie('user_id'),startPage:1},json=>{
              if(json.returnCode===200){
                this.commentList = json.data
              }
            });
//          通知
            this.$ajax("/sys-getsystemmsg",{startpage:1},json=>{
              if(json.returnCode===200){
                this.infoList = json.data
              }
            })
        },
//        获取签到状态
        getSignState(){
          this.$ajax("/user-signinstate",'',json=>{
            if(json.returnCode===200){
                this.signState = true
            }else {
                this.signState = false
            }
          },'get','json',true)
        },
//        用户签到
        addSignState(){
          if(!this.signState){
            this.$ajax("/user-signin",'',json=>{
              if(json.returnCode===200){
                this.signState = true;
                this.dialogVisible = true;
                this.timer();
                this.$freshen();
              }
            })
          }else {
            this.$message({message:'已签到！'})
          }
        }
      },
      mounted(){
        this.getSignState();
        this.getDataList();
      },
      watch:{
        activeName2:function (val) {
          switch (val){
            case 'first':
              this.moreUrl = '/user/message/notice';
              break;
            case 'second':
              this.moreUrl = '/user/message/letter';
              break;
            case 'third':
              this.moreUrl = '/user/message/comment';
              break;
          }
        }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.sign-dialog
  width 90%
  max-width 420px
  .el-dialog__header
    text-align center
  .bot
    font-size 18px
    color #666
    padding-top 30px
    text-align center
    border-top 1px solid #ddd
  .sign-dialog-main
    line-height 40px
    text-align center
.mw-frc-left
  float: left
  width :500px
  margin-right :18px
  a.more
    float: right
    line-height :24px
    height :24px
    color :#666
  .mfr-wallet
    background :#fff
    height :200px
  /*我的钱包 */
  .mine-wealth-wrapper
    height:208px
    padding :25px 15px
    background #fff url('../../assets/image/pic/mine-wealth-bg.png') no-repeat left bottom
    background-size 100% auto
    .mw-ft
      height :40px
      line-height :1em
      font-size :18px
    .mw-fc
      height :26px
      margin-bottom :64px
      .recharge
        display :inline-block
        padding :0 10px
        border :1px solid #f73d51
        border-radius :5px
        line-height 26px
        height 28px
      h2
        font-weight:500
        font-size 30px
    .user-rich
      font-size:16px
      text-align :center
      >span
        display inline-block
        padding 5px 0 5px 26px
        background-repeat no-repeat
        background-position left center
        &.pepper
          background-image url('../../assets/image/icon/pepper@x1_3.png')
        &.chilli
          background-image url('../..//assets/image/icon/pepper@x1_2.png')
        &.ticket
          background-image url('../../../static/img/icon/reading-ticket.png')
          padding-left 30px
 /*我的阅读记录 */
  .mine-record
    background :#fff
    .record-list-item:hover
      .mark
        opacity 1
    .record-list-item
      margin:14px 22px 0 0
      display :inline-block
      &:nth-child(4n)
        margin-right :0
      >a
        position relative
        display block
        overflow hidden
        width :98px
        height :130px
        border-radius :4px
        img
          width 100%
          height 100%
        .mark
          position absolute
          opacity 0
          top:0
          left:0
          width 100%
          height 100%
          padding:10px 6px
          background rgba(0,0,0,0.5)
          color:#fff
          transition:all 0.2s ease


  /*我的消息*/
  .user-message-wrapper
    position relative
    background #fff
    .el-tabs
      background:#fff
      .el-tabs__content
        background :#fff
    a.more
      position absolute
      right :15px
      top :10px
      line-height :24px
      height :24px
      z-index :9
      font-size 16px
    .umw-list-item:last-child
      border :none
    .umw-list-item
      display:list-item
      min-height :74px
      padding:12px 14px
      border-bottom :1px solid #efefef
      .user-pic
        float left
        width :76px
        height :74px
        .avatar
          width :48px
          height :48px
          border-radius :50%
          border :1px solid #9c9c9c
      .message-content
        overflow hidden
        .message-info
          height :24px
          .user-msg
            overflow hidden
            .name
              font-size: 14px
              max-width: 100px
              margin-right:5px
            .sex-boy
              padding :0 10px
              background :url("/assets/image/icon/boy-icon.png") no-repeat center bottom
            .sex-girl
              padding :0 10px
              background-image :url("/assets/image/icon/girl-icon.png")
            .time
              color :#999
        .message-txt
          font-size:14px
          line-height:22px
          color :#666
          max-height 66px
.mw-frc-right
  width 262px
  float left
  padding-bottom :15px
  .sign-box
    height 80px
    text-align center
    line-height 80px
    >span
      display inline-block
      width 138px
      height 36px
      background #F77583
      color:#fff
      font-size 18px
      line-height 36px
      border-radius 5px
      cursor pointer
  .mine-creation
    height :99px
    background :#fff
    font-size 18px
    text-align center
    padding:35px 0
    a
      padding :4px 0 4px 36px
      background :url("../../assets/image/icon/creation-icon.png") no-repeat left center
      background-size:contain
      i
        font-size 17px
        color #666
        margin-left 10px
    span
      display inline-block
      font-size: 26px
      line-height :.86
      transform :scale(.6,1.2)
  .mine-attention
  .mine-fans
    background :#fff
    padding-bottom 10px

  .title
    height :34px
    text-indent:15px
    padding 0 10px
  .mf-list-item:last-child
    border:none
  .mf-list-item
    display :list-item
    overflow :hidden
    padding :6px 10px
    border-bottom:1px solid #efefef
    >a
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
      padding :1px 6px
      font-size :12px
      border :1px solid #fb5e6f
      border-radius :7px
      cursor pointer

</style>
