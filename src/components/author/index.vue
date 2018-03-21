<template>
  <div class="author-container-wrapper">
    <div class="container author-container clear">
      <div class="model-left author-left">
        <ul class="al-list">
          <li class="al-ml-item">
            作者中心
          </li>
          <template v-if="$store.state.userInfo.isAuthor==1">
          <li class="al-ml-item">
            <router-link to="/author/writing">创建管理</router-link>
          </li>
          <li class="al-ml-item">
            <router-link to="/author/income">我的收入</router-link>
          </li>
          <li class="al-ml-item">
            <router-link to="/author/message">消息互动</router-link>
          </li>
          <li class="al-ml-item">
            <router-link to="/author/notice">站内公告</router-link>
          </li>
          </template>
        </ul>
      </div>
      <div class="model-right author-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import authorCenter from './addBook.vue'
  export default{
    components:{
      'vue-center': authorCenter
    },
    mounted(){
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  font-color = #FB5E6F
  btn-color =  #F77583

.author-container-wrapper
  margin-top 24px
  /*background #fcfafb*/

  .author-container
    background #fff
  .author-left
    margin-right:20px
    .al-list
      border-radius :4px
      overflow hidden
      li
        display :list-item
      .al-ml-item
        line-height 46px
        color #fff
        font-size 16px
        background-color btn-color
        &:first-child
          text-align center
          font-size 18px
          background-color #f1f1f1
          color #666
          padding-left 0
          height 52px
          line-height 52px
        &:nth-child(2)  a
          background-image url("./images/indite1.png")
        &:nth-child(3)  a
          background-image url("./images/income1.png")
        &:nth-child(4)  a
          background-image url("./images/message1.png")
        &:nth-child(5)  a
          background-image url("./images/notice1.png")
        a
          color #fff
          display block
          padding-left 40px
          background url("./images/income1.png") no-repeat 10px center
          border-bottom 1px solid #f26a79
          &.active
          &:hover
            color font-color
            border-left 2px solid btn-color
            background #fff url("./images/income2.png") no-repeat 10px center
            box-shadow none
        &:nth-child(2)
          a
            &:hover
            &.active
              background-image: url("./images/indite2.png")
        &:nth-child(3)
          a
            &.active
            &:hover
              background-image: url("./images/income2.png")
        &:nth-child(4)
          a
            &.active
            &:hover
              background-image: url("./images/message2.png")
        &:nth-child(5)
          a
            &.active
            &:hover
              background-image: url("./images/notice2.png")


  .author-right
    min-height 500px
    textarea
      font-size 16px!important
    .handle-btn
      margin-bottom :15px
      &.first-created
        height 300px
        width 100%
        line-height 300px
        text-align center
        background url("../../../static/img/first-created@1_01.png") no-repeat center center
        >a
          margin-top 190px
          width 200px
          height 70px
          line-height 70px
          font-size 24px
      .btn
        display:inline-block
        width :90px
        height :36px
        line-height :36px
        border-radius :5px
        color :#fff
        background :btn-color
        text-align: center
        font-size 14px
        &:hover
          color:#fff!important
        img
          display:inline-block
          height :20px
          width :20px
          margin-right :3px
          vertical-align :-6px
    .user-book-list .ar-mb-item
      display:list-item
      background-color #fff5f5
      height :170px
      margin-bottom:30px
      table
        table-layout fixed
        text-align center!important
        height :100%
        tr
          border-bottom:1px solid #d8d8d8
          &:nth-child(2)
            td
              height auto
          &:last-child
            border-bottom none
          th
            font-size 16px!important
          th
          td
            border-right :1px solid #d8d8d8
            height :32px
            font-weight :normal
            font-size 14px
            &:last-child
              border-right :none
        .cover
          width :110px
        .title
          width :158px
        .words
          width:84px
        .latest
          display :inline-block
          width :172px
          padding:0 10px
        .state
          width :90px
        .handle
          width :258px
        .bookCover
          display :inline-block
          width :92px
          height :120px
          border-radius :5px
        .handle-link
          text-align: center
          a
            float left
            display inline-block
            width: 66px
            height: 30px
            border :1px solid #8c8c8c
            line-height :28px
            margin:10px 8px
            border-radius :5px
            background-color :#fff
            user-select none
            cursor pointer
          .active
            border-color: #7ED321
            box-shadow :none
            color:#7ED321
            cursor text
            &:hover
              color #7ED321!important
          .unable
            color :#999
            cursor not-allowed
            &:hover
              color #999!important
        .title-link
          display :inline-block
          max-width :146px

  //  作者中心公共样式
.au-fl-head
  float: left
  width :104px
  text-align :right
  line-height :38px
  padding-right :10px
  font-size :14px
.au-fr-input
  overflow :hidden
  min-height :38px
  line-height :38px
  .mark
    display :inline-block
    margin :0 12px
  input[type='text'],select
    float: left
    height :38px
    border-radius :5px
    border:1px solid #d4d4d4
    background: #fff
    width :260px
    padding :0 12px
  .wd140
    width :140px
  .tip
    margin-top :15px
    color :#666
    line-height:1em
.apply-item:last-child ,.author-fl-item:last-child
  text-align :center
  .submit-btn
    width :250px
    background :btn-color
    height :50px
    border-radius :25px
    color :#fff
    font-size: 16px
  /*面包屑导航公共样式 start*/
.breadcrumb-wrap
    height :52px
    line-height :52px
    font-size :14px
    padding-left :10px
    .el-breadcrumb
      height :52px
      line-height :52px
      font-size :14px
  /*面包屑导航公共样式 end*/

  /*创建管理公共导航部分 start*/
.writing-subNav
  height :46px
  line-height: 46px
  background-color :#fff
  font-size :16px
  padding :0 14px
  border-bottom 1px solid #f0dcdd
  ul
    li
      display: inline-block
      margin : 0 40px
      text-align center
      a
        display inline-block
        padding :0

  /*创建管理公共导航部分 end*/
  form li
    display:list-item
  .author-fl-item
    margin-bottom :30px
    min-height :38px
  .au-fl-head
    float: left
    width :104px
    text-align :right
    line-height :38px
    padding-right :10px
    font-size :14px
  .au-fr-input
    overflow :hidden
    min-height :38px
    line-height :38px
    .mark
      display :inline-block
      margin :12px
    input[type='text'],select
      float: left
      height :38px
      border-radius :5px
      border:1px solid #d4d4d4
      background: #fff
      width :260px
      padding :0 12px
    .wd140
      width :140px
    .tip
      margin-top :15px
      color :#999
      line-height :1em
  .author-fl-item:last-child
    text-align :center
    .submit-btn
      width :250px
      background :btn-color
      height :50px
      border-radius :25px
      color :#fff
      font-size: 16px
  /*创建管理 表格公共样式部分 start*/
.table-wrapper
  width :840px
  margin : 10px auto
  padding :0 15px
  background-color :#fff
  border-radius :5px
  min-height :800px
.writing-table
  table-layout fixed
  width:100%
  .cname
    >.txt-overflow
      display inline-block
      max-width calc(100% - 20px)
    .el-icon-time
      color #ff4d51
      vertical-align middle
  tr
    height :45px
    border-bottom :1px solid #efefef
  tr td:last-child
    border-bottom :none
  tr th,tr td
    text-align :center
    font-size :14px
    line-height :45px
    padding 0 10px
  tr td a
    padding :0 8px
    line-height :1em
    margin :0 auto
  tr:hover td
    /*background-color :#e2f0e4*/
  tr[select='true'] td
    background-color :#e2f0e4
.author-right
  .form-wrapper
    padding-top: 38px
    .el-form-item__label
      text-indent :26px
  .handle-wrap
    margin-top:15px
    button
      border-radius :20px
      border-color $bgColor1
      color $bgColor1
      padding :6px 15px
  /*创建管理 表格公共样式部分 end*/
.author-income-wrapper
  .el-tabs__header
    padding:0 18px
  .el-tabs__content
    padding 0 10px 0 18px
    border-radius 7px
    /*background :#fcfafb*/
    overflow hidden
.income-tabs>.el-tabs__header
  .el-tabs__item
    height 38px
    line-height 38px
    padding 0
    margin-right :34px
    font-size 16px
    &.is-active
      line-height 38px
      border-bottom 2px solid #f00
.author-message-wrap
  .el-tabs
    border :none
    .el-tabs__header
      border :1px solid #e4e4e4
      background :#fff
      box-shadow :0 0 3px rgba(0,0,0,0.3)
      border-bottom :none!important
    .el-tabs__item
      padding:0 40px
      border :none!important
      border-bottom :solid transparent!important
    /*border :none!important*/
    .el-tabs__item.is-active
      border-bottom :2px solid rgb(247,116,130)!important
  .el-input__icon+.el-input__inner
    text-align:center;

.chapter-ruleForm
  .contentBox
    .author-say-wrap
      position relative
      .say-word
        position absolute
        bottom 5px
        right 70px
        font-size 12px
        color #666
        line-height 1em
      .author-say
        width 686px
        border 1px solid #d9bfbf
        border-radius 0 0 7px 7px
        border-top none
        height 90px
        margin 0
        /*margin-top 1px*/
        padding 0
        >textarea
          text-indent 2em
          width 100%
          height 100%
          border-radius 7px
          font-size 16px
          border none
          resize none
          color #666
  .el-form-item__content
    position relative
    .el-textarea.context
      width 686px
      position relative
      border 1px solid rgb(217, 191, 191)
      overflow hidden
      border-radius 7px 7px 0 0
      textarea
        width 686px
        height 602px
        border-bottom-left-radius 0
        border-bottom-right-radius 0
        text-indent 2em
        padding 15px
        border none
    .iframe-wrap
      resize none
      width 686px
      line-height :1.8
      text-indent 2em
      border-color rgb(217, 191, 191)
      font-size 16px
      border-radius 7px 7px 0 0






</style>
