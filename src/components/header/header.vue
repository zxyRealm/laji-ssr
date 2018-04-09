<template>
  <div class="web-header-wrap" >
  <vue-headerBar
    v-if="isShow"
  ></vue-headerBar>
  <div class="loginRegister-top"
       v-else-if="$route.name==='Login'
       || $route.name==='Register'
       || $route.name==='modifyPage'
       || $route.name==='findPage'">
    <div class="lr-nav">
      <div class="lr-nav-inner clear">
        <ul class="subNav">
          <li>
            <router-link to="/index">首页</router-link>
          </li>
          <li>
            <router-link to="/class_total">书库</router-link>
          </li>
          <li>
            <router-link to="/welfare">福利</router-link>
          </li>
          <li>
            <router-link to="/author">作者中心</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="lr-main-bg">
    </div>
  </div>
  <div v-else class="wrapper">
    <header>
      <div class="top">
        <div class="ht-inner">
          <ul class="hi-left clear">
            <li class="font0">
              <router-link class="logo-icon-link" to="/">
                <img src="/static/img/web-logo-icon.png" class="logo-icon" alt="辣鸡小说">
              </router-link>
            </li>
            <li>
              <a href="javascript:;" @click="addFavorite">收藏本站</a>
            </li>
            <li>
              <router-link to="/download/app" alt="辣鸡小说" target="_blank">移动端</router-link>
            </li>
          </ul>
          <ul class="hi-right clear ht-right-common">
            <li class="hr-item">
              <template v-if="userInfo.userName!==undefined">
                <div class="user-dropdown-wrap clear">
                  <div class="user-dropdown font0">
                    <router-link to="/user/index" class="img-wrap">
                      <img class="avatar img" :src="userInfo.userHeadPortraitURL" :alt="userInfo.userName">
                    </router-link>
                  </div>
                  <div class="user-dropdown">
                    <router-link to="/user/shelf">
                      书架
                    </router-link>
                  </div>
                  <div class="user-dropdown">
                    <el-badge :value="message.total" class="message-item" style="vertical-align: top;">
                      <span class="pr10">消息</span>
                    </el-badge>
                    <div class="user-dropdown-menu" >
                      <div class="user-dropdown-item-wrap">
                        <router-link class="user-dropdown-item" to="/user/message/notice">
                          <el-badge class="dot-item">通知</el-badge>
                        </router-link>
                        <router-link class="user-dropdown-item" to="/user/message/letter">
                          <el-badge :is-dot="message.userMessageCount>0" class="dot-item">私信</el-badge>
                        </router-link>
                        <router-link class="user-dropdown-item" to="/user/message/comment">
                          <el-badge :is-dot="message.userCommentReplyCount>0" class="dot-item">评论</el-badge>
                        </router-link>

                      </div>
                    </div>
                  </div>
                  <div class="user-dropdown">
                    <a href="javascript:;" @click="$store.dispatch('FETCH_EXIT')">退出</a>
                  </div>
                </div>
              </template>
              <template v-else>
                <router-link to="/login">登录</router-link>
                <span>|</span>
                <router-link to="/register">注册</router-link>
              </template>
            </li>
          </ul>
        </div>
      </div>
      <div class="search">
        <div class="s-box fr">
          <img class="s-icon" src="/static/img/icon/search.png" alt="" @click="search">
          <el-autocomplete
            class="header-input"
            v-model="searchTxt"
            :value-key="'hotWords'"
            @keyup.enter.native="search"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="search"
          ></el-autocomplete>
        </div>
      </div>
    </header>
    <vue-Nav></vue-Nav>
  </div>
  <div v-show="showIt" @click="getBack($event)" class="backTop" :class="{ scrolling:isActive }"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import Nav from '../nav/nav.vue'
import Dheader from './detailHeader.vue'
import { FetchSearchHotWords,aycn } from '../../api'
import { mapState } from 'vuex'
export default({
  data(){
    return {
      top:0,
      showIt:false,
      isActive:false,
      isClick1:false,
      isClick2:false,
      searchTxt:this.$route.params.keywords,
      restaurants:{},
//      hotList:[]
    }
  },
  components:{
    'vue-Nav': Nav,
    'vue-headerBar': Dheader
  },
  methods:{
    addFavorite(){
      let url = window.location;
      try {
        window.external.addFavorite(url, '辣鸡小说');
      }
      catch (e) {
        try {
          window.sidebar.addPanel('辣鸡小说', url, "");
        }
        catch (e) {
          const h = this.$createElement;
          this.$msgbox({
            title: '温馨提示',
            message:h('div',{style:'fontSize:16px'},[
              h('p',{style:'lineHeight:1.6em'}, "抱歉，您所使用的浏览器无法完成此操作。"),
              h('p', "加入收藏失败，请使用Ctrl+D进行添加")
            ]),
            confirmButtonText: '确定'
          });
        }
      }
    },
    querySearch(queryString, cb) {
        let restaurants = this.hotWords;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.hotWords.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    
    search(){
      let txt = this.$trim(this.searchTxt);
      if(txt){
        this.$router.push({path:'/search/'+txt+'/1'});
      }
    },
    handleCommand1(commend){
      if(commend==='center'){
        this.$router.push("/user/index")
      }else if(commend==='wallet'){
          this.$router.push("/user/wallet")
      }else if(commend==='user'){
        this.$router.push("/user/index")
      }else if(commend==='exit'){
          aycn('/person-ClearUserInfo').then(json=>{
            if(json.returnCode===200){
              this.$message("退出成功！");
              this.$cookie('user_id','',-1);
              this.$store.state.userInfo = {};
              this.$router.push({ path:'/index' })
            }
          })
      }
    },
    getBack(){
        let that = this;
        this.isActive = true;
        let timer = setInterval(function () {
          let oTop = document.body.scrollTop || document.documentElement.scrollTop;
          if(oTop>0){
            window.scrollBy(0,-100)
          }else{
            that.isActive = false;
            clearInterval(timer);
          }
        },10);
    }
  },
  mounted(){
    this.$store.dispatch("FETCH_SEARCH_HOT_WORDS");
    this.top =   window.document.scrollTop || document.documentElement.scrollTop;
    window.onscroll = () => {
      return (() => {
        let  height = window.innerHeight || document.body.clientHeight;
        let  toTop = document.body.scrollTop || document.documentElement.scrollTop;
        this.top = toTop;
        if(this.top>height*0.2){
          this.showIt = true
        }else{
          this.showIt = false
        }
      })()
    }
  },

  watch:{
    "$route.params.keywords":function (val) {
      this.searchTxt = val
    }
  },
  computed:{
    isShow:function () {
      let arr = ['Charge','rankChild','detail','User',"Chapter",'welfare','download','search','chapterList'],state = false;
      for(let k=0,len=arr.length;k<len;k++ ){
          if(this.$route.name===arr[k]){
            state = true;
            break;
          }
      }
      return state
    },
    ...mapState({
      userInfo:'userInfo',
      message:'message',
      hotWords:'hotWords'
    })
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.header-wrap
  position absolute
  width 100%
  top 0
  background rgba(255,255,255,0.7)

.el-autocomplete
  &.header-input
    width 100%
    .el-input__inner
      height 30px!important
      border none
    .el-icon-search
      left:0!important
      width 32px
      background: url("/static/img/icon/search.png") no-repeat center center;
      background-size contain
      &:before
        content ''
    .el-icon-empty+.el-input__inner
      padding-left 45px
      padding-right 0
.user-dropdown-wrap
  .user-dropdown
    position relative
    float left
    padding 0 14px
    cursor pointer
    a.active
      box-shadow none
      color inherit
    >a
      .avatar
        display inline-block
        width 100%
        height 30px
        border-radius 50%
        border:1px solid #ddd
        vertical-align middle
    &:hover
      .user-dropdown-menu
        display block
    .user-dropdown-menu
      position absolute
      display none
      top:35px
      left:50%
      transform translateX(-50%)
      z-index 999
      min-width 4em
      background transparent
      transition all 0.3s ease
      padding-top 8px
      .user-dropdown-item-wrap
        overflow hidden
        box-shadow 0 1px 5px #ddd
        background #fff
        border-radius 0 0 4px 4px
      .user-dropdown-item
        float:left
        height 30px
        width 72px
        line-height 30px
        padding 0
        text-align center
        word-break break-all
        font-size: 12px!important
        color #040404
        border-bottom 1px solid #d8d8d8
        &:last-child
          border-bottom none
        >img
          display inline-block
          vertical-align -5px
          margin-right 2px
      .user-dropdown-item
        .el-badge
          vertical-align baseline
        &:hover
          background:#efefef
          color #040404
        &.active
          box-shadow none
          color :#040404


.user-dropdown-item
  background-size:auto 80%
  line-height :30px
  padding-left:32px
.user-dropdown-item:nth-child(2)
  background-size :auto 66%
.user-dropdown-item:last-child
  padding-left :10px
  text-align center
  /*background : url("")*/
.loginRegister-top
  .lr-nav
    height :42px
    line-height 42px
    background :#fff
    .lr-nav-inner
      width :1024px
      margin :0 auto
      .subNav
        float left
        height :100%
        font-size :16px
        li
          display :inline-block
        a
          padding :0 15px
  .lr-main-bg
    width :100%
    height :158px
    background :#fcadb4 url("/static/img/login-register-bg.png") no-repeat center center
    
header
  position: relative;
  height:149px;
  background: url("/static/img/web_top.png") no-repeat center center;
  background-size auto 100%
  .top
    position relative
    width:100%;
    height:42px;
    background-color: rgba(0,0,0,0.12);
    z-index 99
    .ht-inner
      height:42px;
      line-height: 42px;
      color: #fff;
      font-size 15px
      li
        float left
        height 100%
        a
          display inline-block
          color #fff
          &.img-wrap
            width 30px
          &.logo-icon-link
            vertical-align middle
          &.active
            box-shadow none
      .el-badge.message-item .el-button
        color: #fff
      .logo-icon
        height 30px
  .hi-left
    float left
    li
      margin-right 24px
  .hi-right
    float right
    li:last-child
      margin-right: 0
  .hr-qrcode
    img
      width: 36px;
      height: 36px;
      background-color: #fff;
  .search
    position: absolute;
    bottom: 24px;
    width:1024px;
    height: 30px;
    margin-left: -512px;
    left:50%;
    color: rgb(241, 129, 154);
    vertical-align: bottom;
    .el-input
      height 100%
      .el-input__inner
        height 30px
        line-height 30px
  .hr-item
    float: left
    display:inline-block
    margin-right: 10px
  .s-box
    position relative
    border-radius: 5px;
    background-color: rgb(255, 255, 255);
    opacity: 0.9;
    width: 232px;
    height: 100%;
    margin-right:42px;
    .s-icon
      position absolute
      height 30px
      width 30px
      left 4px
      top 0
      z-index 10
      cursor pointer
    button
      height:100%;
      float: left;
      width:49px;
      background: url("/static/img/icon/search.png") no-repeat center center;
    .sb-right
      overflow: hidden;
      height:100%;
    select
      color: rgb(241, 129, 154);
    select,input
      width:100%;
      text-indent:30px;
      height:36px;
      line-height: 36px;
      border-radius: 10px;
.userImg img
  display:inline-block
  vertical-align :middle
  width :32px
  height :32px
  border-radius :50%
  border :1px solid #9d9d9d
  margin-right :10px

  /*返回顶部按钮*/
.backTop
  position fixed
  left :50%
  margin-left :560px
  bottom :60px
  width :40px
  height 60px
  background :url('./image/up1.png') no-repeat left top
  background-size :contain
  cursor pointer
  z-index:999

.backTop:hover
  background-image :url('./image/up.png')
.scrolling
  background-image :url('./image/up.png')

.el-badge
  &.message-item
    .el-button
      background-color transparent
    .el-badge__content
      top 12px
      border none
  &.dot-item
    .el-badge__content
      top 10px
      right -2px
      line-height 16px
</style>
