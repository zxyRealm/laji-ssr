<template>
    <div  class="zdy-consume-wrap" @click.self="handleClickWrap"
      v-if="Consume.visible"
    >
      <div
          class="zdy-consume-box"
          :class="{
            reward:Consume.type==='reward',
            ticket:Consume.type==='ticket',
            recommend:Consume.type==='recommend',
            letter:Consume.type==='letter'
          }"
         :style="{width:Consume.type==='comment'?480:440+'px'}">
        <div
          v-if="Consume.type!=='letter'"
          class="zdy-consume-header"
          :class="{com:Consume.type==='comment'}">

          <template v-if="Consume.type==='comment'">
            <span class="fl">评论：{{Consume.title}}</span>
          </template>
          <template v-else>
            {{Consume.title}}
          </template>
          <i
            class="el-icon-close close"
            :class="{right:Consume.type==='comment'}"
            @click="close">
          </i>
        </div>
        <div class="zdy-consume-main" >
            <div class="common-box-wrap" v-if="Consume.type==='ticket'|| Consume.type==='recommend'">
              <div class="common-box-img" :class="Consume.type">
              </div>
              <div class="common-box-main">
                <div class="cbm-des">
                  <p class="tip">写的真好，支持一下~</p>
                  <p class="num">
                    {{Consume.type==='ticket'?'金椒':'小米椒'}}余额：{{value}}
                  </p>
                </div>
                <div class="cb-count clear">
                  <span class="decrease" @click="decrease">
                    <i class="el-icon-minus"></i>
                  </span>
                  <input type="number" v-model="Consume.formData.count"/>
                  <span class="increase" @click="increase">
                    <i class="el-icon-plus"></i>
                  </span>
                  <span class="all" @click="increase('all')">All</span>
                </div>
                <div class="cb-handle clear">
                  <span
                    class="fr zdy-consume-btn middle"
                    :class="{disable:value==0}"
                    @click="handleAction()">投喂</span>
                </div>
              </div>
            </div>

            <!--发送私信-->
            <form class="letter-box" v-if="Consume.type==='letter'">
              <div class="letter-tit">
                给 <font>{{Consume.title}}</font> 发私信：
              </div>
              <div class="textarea-wrap">
                <textarea name="" v-model="Consume.messageContent"></textarea>
                <p class="tip">还可以输入<span class="count">{{length}}</span>字</p>
              </div>
              <div class="handle-area">
                  <button type="button" class="send fr"  @click="handleAction('confirm')">发送</button>
              </div>
            </form>

            <!--打赏金椒-->
            <form class="reward-box" v-if="Consume.type==='reward'">
              <div class="user-data">
                <span>您的余额：{{value}}</span>
                <a :href="'/charge'" target="_blank" class="fr zdy-consume-btn small" @click="close">充值</a>
              </div>
              <div class="textarea-box">
                <textarea name="" v-model="Consume.formData.content" id="" placeholder="么么哒" cols="30" rows="10"></textarea>
                <span class="word">{{Consume.formData.content.length}}/20</span>
              </div>
              <div class="radio-box">
                <el-radio-group  v-model="Consume.formData.count">
                  <el-radio-button name="radio" :label="188">188辣椒</el-radio-button>
                  <el-radio-button name="radio" :label="288">288辣椒</el-radio-button>
                  <el-radio-button name="radio" :label="588">588辣椒</el-radio-button>
                  <el-radio-button name="radio" :label="888">888辣椒</el-radio-button>
                  <el-radio-button name="radio" :label="1888">1888辣椒</el-radio-button>
                  <el-radio-button name="radio" :label="8888">8888辣椒</el-radio-button>
                </el-radio-group>
              </div>
              <div class="zdy-consume-box_btns">
                <div v-if="showCancel" class="zdy-consume-btn zdy-consume-box_btn_cancel">
                  取消
                </div>
                <div class="zdy-consume-btn zdy-consume-box_btn_submit large" @click="handleAction('confirm')">
                  确定
                </div>
              </div>
            </form>

            <!--发布书评-->

            <form class="comment-box" v-if="Consume.type==='comment'">
              <div class="textarea-wrap">
                <textarea name="" v-model="Consume.messageContent"></textarea>
                <span class="num">{{Consume.messageContent.length}}/200</span>
                <!--<p class="tip">还可以输入<span class="count">{{length}}</span>字</p>-->
              </div>
              <p class="red" style="line-height: 1" :style="{visibility:tipShow}">内容不可包含emoji表情图</p>
              <div class="handle-area clear">
                <span type="button" class="send fr lj-btn"  @click="handleAction('confirm')">评论</span>
              </div>
            </form>
        </div>
        <!--私信弹窗背景图-->
        <img v-if="Consume.type==='letter'" src="../../../../static/img/personal-letter@_01.png" class="letter-icon" alt="">
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters,mapActions,mapMutations,mapState } from 'vuex'
  import { FetchAddBookComment,FetchUserGift,FetchHandleUserInfo } from '../../../api'
    export default{
      name:'my-consume',
      props:{
        info:{}
      },
      data(){
        return {
          tipShow:'hidden',
          closed: false,
          width:480,
          showCancel:false,
          action:'',
        }
      },
      watch: {
        messageContent:function (val){
          if(this.$regEmoji(val)){
            this.tipShow = 'visible'
          }else {
            this.tipShow = 'hidden'
          }
        }
      },
      methods: {
        close() {
            this.$store.dispatch('close');
        },
        handleAction(){
            let info = this.bookDetail.bookListInfo || this.bookDetail.bookInfo;
            let data = {};
            if(this.Consume.type==='comment'){
              data = {
                bookId:info.bookId,
                bookName:info.bookName,
                userName:this.userInfo.pseudonym,
                commentContext:this.Consume.messageContent
              };
              FetchAddBookComment(data).then(json=>{
                if(json.returnCode===200){
                  this.Consume.messageContent = '';
                  this.$message("发送成功！");
                  this.close()
                }
              })
            }else if(this.Consume.type==='letter'){
              data = {
                  userName:this.userInfo.pseudonym,
                  messageContent:this.Consume.messageContent,
                  sendName:this.Consume.title,
                  sendUserId:this.Consume.sid
              };
              if(this.$route.name==='messageHarvest'){
                  data.areaid = this.Consume.aid;
                  data.type = 1
              }
              FetchHandleUserInfo(data,'sl').then(json=>{
                  if(json.returnCode===200){
                    this.Consume.messageContent = '';
                    this.close();
                    this.$message({message:"发送成功"});
                  }
              })
            }else {
              data = {
                message:null,
                bookid:info.bookId,
                bookName:info.bookName,
                userId:this.userInfo.userId,
                authorId:info.bookWriterId
              };
              if(this.Consume.type==='reward'){data.message = this.Consume.formData.content}
                FetchUserGift(this.Consume.type,this.Consume.formData.count,data).then(json=>{
                  if(json.returnCode===200){
                    this.close();
                    this.Consume.formData.content = '';
                    this.$message(json.msg);
                    this.$store.dispatch("FETCH_BOOK_DETAIL",{ bid:info.bookId });
                    this.$store.dispatch("FETCH_FRESHEN_INFO");
                  }
                });
            }
        },
        decrease(){
          if(this.Consume.formData.count>1){
            this.Consume.formData.count--;
          }
        },
        increase(type){
            if(type==='all'){
              this.Consume.formData.count = this.value
            }else if(this.value>this.Consume.formData.count){
              this.Consume.formData.count++;
            }
        },
        handleClickWrap(){
            if(this.Consume.type==='letter'){
                this.close()
            }
        }
      },
      computed:{
        title(){
            if(this.Consume.type==='reward'){
                return '给作者打赏'
            }else {
                return ""
            }
          },
        length(){
          let len = this.$trim(this.Consume.messageContent).length;
          if(len>100){
            this.Consume.messageContent = this.Consume.messageContent.substring(0,100);
            return 0;
          }else {
            return 100-len
          }

        },
        ...mapState([
            'Consume',
            'userInfo',
            'bookDetail'
        ]),
        value:function () {
          let count = 0;
          switch (this.Consume.type){
            case 'reward':
                count = this.userInfo.userMoney;
                break;
            case 'recommend':
              count = this.userInfo.userRecommendTicket;
              break;
            default:
              count = this.userInfo.userGoldenTicket;
          }
          return count;
        }
      },
      watch:{
         "Consume.visible":function (val) {
           if(val && !this.userInfo.userId){
             this.$router.push({path:'/login',query:{ redirect:this.$route.path }});
           }
         }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.zdy-consume-wrap:after
  content: "";
  display: inline-block;
  height: 100%;
  width: 0;
  vertical-align: middle;
.zdy-consume-wrap
  position fixed
  top:0
  left:0
  bottom 0
  right:0
  text-align center
  background rgba(0,0,0,0.5)
  z-index 999
  .zdy-consume-box
    position relative
    display: inline-block
    vertical-align middle
    width :440px
    background-color:#fff
    border-radius :4px
    padding-bottom :25px
    background-position : -15px -20px
    background-repeat: no-repeat
    &.ticket
    &.recommend
      height auto!important
      .zdy-consume-header
          height 20px
    &.letter
      position relative
      padding 0 18px 12px
      width 344px!important
      height 210px
      >.letter-icon
        position absolute
        width 80px
        left 50%
        top -42px
        transform translateX(-50%)
    .comment-box
      /*height 160px*/
      text-align left
      padding 0 20px
      .textarea-wrap
        position relative
        margin-bottom 10px
        .num
          position absolute
          bottom 10px
          right 10px
          line-height 1

      textarea
        width 100%
        height 62px
        font-size 14px
    /*发送私信*/
    .letter-box
      padding-top 40px
      .letter-tit
        line-height 22px
        height 22px
        margin-bottom 8px
        text-align: left
        font-size 14px
        font
          color #3B7ADB
      .textarea-wrap
        position relative
        width 308px
        height 90px
        border 1px solid #979797
        border-radius 5px
        >textarea
          height 100%
          width 100%
          resize none
          border-radius 4px
          padding 10px
          line-height 2em
        .tip
          position absolute
          bottom -20px
          left 0
          height 1.5em
          font-size 12px
          .count
            color #f77583
      .handle-area
        height 28px
        line-height 28px
        margin-top 12px
        >button.send
          border-radius 4px
          border 1px solid #f77583
          color #f77583
          width 60px
          height 28px
    .zdy-consume-header
      height 48px
      line-height :48px
      font-size 16px
      &.com
        padding 0 20px
      .close
        position :absolute
        right :-14px
        top: -16px
        width :40px
        height :40px
        border-radius :50%
        background :#fff
        line-height :40px
        cursor pointer
        font-weight:600
        color :#999
        &.right
          right 10px
          top 5px
          width 34px
          height 34px
          line-height 34px
      .close:hover
        color:#ff8383

    .reward-box
      padding 0 24px
    .user-data
      text-align left
      line-height: 32px
      overflow hidden
      font-size 16px
    .zdy-consume-btn.disable
      opacity 0.8
      cursor not-allowed
    .zdy-consume-btn
      display inline-block
      height :32px
      line-height 32px
      border-radius :21px
      background:#f77583
      font-size :16px
      color:#fff
      cursor pointer
      text-align: center
      &:hover
        color:#fff!important
    .zdy-consume-btn.large
      width 206px
      height :42px
      line-height 42px
    .zdy-consume-btn.middle
      width :120px
    .zdy-consume-btn.small
      width :98px
    .textarea-box
      position relative
      width 100%
      height :60px
      margin 10px 0
      textarea
        width 100%
        height :100%
        padding :5px 10px
        resize: none
      .word
        position absolute
        bottom: 2px
        right :5px
    .radio-box
      margin-top: 15px
      /*margin-bottom: 15px*/
    .el-radio-button:nth-child(3n)
      margin-right :0
    .el-radio-button.is-active
      .el-radio-button__inner
        border :2px solid #f73d51
        background-color :#fff
        color :#333
    .el-radio-button
      width :104px
      height 104px
      margin-right :38px
      margin-bottom 20px
      overflow :hidden
      .el-radio-button__inner
        height :100%
        width :100%
        border-radius :5px
        border :2px solid #efefef
        padding-top :80px
        box-shadow :none
        background:#fbf3f3  url("../../../../static/img/coin-188.png") no-repeat center
        /*background-size:cover*/
    .el-radio-button:nth-child(2) .el-radio-button__inner
      background-image  url("../../../../static/img/coin-288.png")
    .el-radio-button:nth-child(3) .el-radio-button__inner
      background-image  url("../../../../static/img/coin-588.png")
    .el-radio-button:nth-child(4) .el-radio-button__inner
      background-image  url("../../../../static/img/coin-888.png")
    .el-radio-button:nth-child(5) .el-radio-button__inner
      background-image  url("../../../../static/img/coin-1888.png")
    .el-radio-button:nth-child(6) .el-radio-button__inner
      background-image  url("../../../../static/img/coin-8888.png")
  .common-box-wrap
    overflow hidden
    padding 0 15px 0 20px
    .common-box-img
      float left
      width 156px
      height :156px
      background-repeat no-repeat
      background-size contain
      &.ticket
        background-image :url("../../../../static/img/icon-ticket.png")
      &.recommend
        background-image :url("../../../../static/img/icon-recommend.png")
      /*border-bottom:1px solid #f77583*/
      p.info
        padding-left :100px
        padding-right:20px
        font-size 16px
        line-height 40px
    .common-box-main
      overflow hidden
      /*padding:22px 20px 0*/
      padding-left 15px
      line-height 32px
      >div
        padding-left 10px
      input[type='number']
        float left
        display:inline-block
        width : 70px
        text-align: center
        border-radius 4px
        border :1px solid #999
        padding 6px 0
        line-height 1em
        margin-right:10px
        font-size 14px
      .cb-count
        margin 7px 0 10px
        span
          float left
          display :inline-block
          height 1em
          width: 30px
          color :#333
          border :1px solid #999
          border-radius:4px
          line-height :1
          font-size :15px
          padding 6px 0
          margin-right :10px
          cursor pointer
          user-select: none
          box-sizing content-box
          &.all
            font-size 16px
            width:36px

      .cbm-des
        text-align left
        .tip
           font-size 16px
           color #333
        .num
           font-size 14px
           color #F73D51
      .cb-handle
        border-top 1px solid #ff4d51
        padding 10px 20px 0

</style>
