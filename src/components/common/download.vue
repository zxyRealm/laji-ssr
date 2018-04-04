<template>
    <div class="download-wrap">
      <div class="download-title clear">
        <img src="./images/download-icon@1_01.png" class="fl" alt="">
        <div class="des">
          <h2>辣鸡小说</h2>
          <h6>www.lajixs.com</h6>
        </div>
      </div>
      <div class="download-content clear">
        <img class="phone fl" src="./images/phone.png" alt="">
        <div class="content-right">
          <div class="icon-wrap">
            <p>
              <img src="./images/font-icon@1_01.png" alt="">
              <img src="./images/font-icon@1_04.png" alt="">
            </p>
            <p>
              <img src="./images/font-icon@1_03.png" alt="">
              <img src="./images/font-icon@1_02.png" alt="">
            </p>
          </div>
          <div class="main-box clear">
            <div class="qrcode-wrap fl">
              <img class="qrcode" v-show="icon=='android'" src="/static/img/dw-android-icon.png" alt="">
              <img class="qrcode" v-show="icon=='ios'"  src="./images/download-icon@1_01.png" alt="">
              <img class="qrcode" v-show="icon!=='android'&&icon!=='ios'"  src="./images/download-icon@1_01.png" alt="">
            </div>
            <div class="down-icon clear">
              <a class="android" href="/apk/app.apk"  @mouseenter="icon='android'" @mouseleave="icon='default'">Android版</a>
              <a class="ios" href="javascript:alert('暂未上线，尽请期待！');" @mouseenter="icon='ios'" @mouseleave="icon='default'">iPhone版</a>
            </div>
          </div>
        </div>
      </div>
      
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
           return {
               icon:'default'
           }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.download-wrap
  width 1366px
  padding 44px 83px
  margin 0 auto
  height 768px
  background url("images/download-bg@1_01.png") no-repeat center top
  .download-title
    height 126px
    >.des
      float left
      width 210px
      text-align center
      margin-left 30px
      h2
        font-size 44px
        font-weight normal
        line-height 1.8em
      h6
        font-size 26px
        font-weight normal
        line-height 36px
  .download-content
    .phone
      margin 15px 250px 0 156px
    .content-right
      overflow hidden
      height 100%
      .icon-wrap
        p
          height 24px
          margin-bottom 50px
          &:nth-child(2)
            padding-left 110px
          >img
            display inline-block
            margin-right 74px
      .main-box
        overflow hidden
        .qrcode-wrap
          width 217px
          height 217px
          border-radius 10px
          border 1px solid #fff
          padding 7px
          margin-right 58px
          img
            width 100%
            height 100%
        .down-icon
          overflow hidden
          margin-top 64px
          a
            display block
            width 192px
            height 56px
            line-height 56px
            color #F76363
            font-size 20px
            border-radius 4px
            background #fff
            background-position 20px center
            background-repeat no-repeat
            text-align right
            padding-right 20px
            &:hover
              background-color #ddd!important
            &.ios
              background-image url('./images/Iphone-icon@1_01.png')
            &.android
              margin-bottom 34px
              background-image: url('./images/Android-icon@1_01.png')
  
</style>
