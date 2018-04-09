<template>
  <div class="dHeader-wrap" :class="{theme:def}">
    <div class="dHeader">
      <div class="logo fl font0">
        <router-link to="/">
          <img src="/static/img/web-logo-icon@1_01.png" class="logo-icon" alt="辣鸡小说">
        </router-link>
      </div>
      <div class="d-more">
        <a href="javascript:;" class="logo-link" @click="addFavorite">收藏本站</a>
        <router-link to="/download/app" alt="辣鸡小说" target="_blank" class="logo-link" >移动端</router-link>
      </div>
      <div  class="dh-nav-left fl">
        <ul class="nav-list clear">
          <li>
            <router-link to="/index">首页</router-link>
          </li>
          <li>
            <router-link to="/class_total">书库</router-link>
          </li>
          <li>
            <router-link to="/rank">排行榜</router-link>
          </li>
          <li>
            <router-link to="/welfare">福利</router-link>
          </li>
          <li>
            <router-link to="/author">作者中心 </router-link>
          </li>
        </ul>
      </div>
      <div class="dh-nav-right">
        <ul class="clear ht-right-common fr">
          <li class="search-item">
            <form action="" ref="searchForm" class="search-form clear" :class="{show:show}">
              <button @click.prevent="search"></button>
              <div>
                <input class="search-input" ref="searchInput" v-model="searchTxt" @keyup.enter="search" type="text" placeholder="请输入关键字！">
              </div>
            </form>
          </li>
          <li class="lr-area">
            <template v-if="userInfo.userName!=undefined">
              <div class="user-dropdown-wrap clear">
                <div class="user-dropdown font0" >
                  <router-link to="/user/index" class="avatar-wrap">
                    <img class="avatar" :src="userInfo.userHeadPortraitURL" :alt="userInfo.userName">
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

                  <div class="user-dropdown-menu">
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
              <router-link to="/login">登录</router-link><span>|</span>
              <router-link to="/register">注册</router-link>
            </template>
          </li>
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { aycn } from '../../api'
  import { mapState } from 'vuex'
    export default{
      data(){
          return {
            isClick1:false,
            isClick2:false,
            searchTxt:'',
            show:false
          }
      },
      methods: {
        handleCommand1(commend){
          if(commend==='exit'){ //退出账号
            aycn('/person-ClearUserInfo').then(json=>{
              if(json.returnCode===200){
                this.$message("退出成功！");
                this.$cookie('user_id','',-1);
                this.$store.state.userInfo = {};
                this.$router.push('/index')
              }
            });
          }else if(commend==='center'){ //个人中心
            this.$router.push("/user/index");
          }else if(commend==='wallet'){ // 我的钱包
            this.$router.push("/user/index")
          }else if(commend==='user'){ //我的账号
            this.$router.push("/user/index")
          }
        },
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
        search(){
          let self = this;
          if(!this.$refs.searchInput.style.width){
            this.show = true;
            self.$refs.searchInput.style.width = "120px";
            self.$refs.searchForm.style.border = '1px solid #fb707f'
          }else{
            if(!this.searchTxt){
              this.show = false;
              self.$refs.searchInput.style.width = '';
              self.$refs.searchForm.style.border = 'none'
            }else{
              this.show = true;
              this.$router.push('/search/'+this.searchTxt);
            }
          }
        }
      },
      mounted(){
//        document.addEventListener('click',(e)=>{
//          if(e.target.className.indexOf('user-dropdown-item')>-1){
//            this.isClick1 = false;
//            this.isClick2 = false;
//          }
//        })
      },
      computed:{
        def:function () {
          let arr = ['detail','chapterList'],state=false;
          arr.forEach((item)=>{
            if(this.$route.name===item){
              state = true;
              return;
            }
          });
          return state
        },
        ...mapState([
         'userInfo',
          'message'
        ])
      }
    }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
font-color = #FB5E6F
.dHeader-wrap
  /*background :#fff*/
  z-index :99
  min-width :1024px
  margin :0 auto
  box-shadow 0 2px 6px #efefef
  &.theme
    background #f77583
    color #fff
    a
      color #fff
      &:hover
        color #fff!important

    .user-dropdown-menu
      a
        &:hover
          color #333!important
    .message-item
      >.el-button
        color #fff
        &:hover
          color #fff
    .search-form
      &.show
        button
          background-image :url("/static/img/icon/search.png")!important
      button
        background-image :url("/static/img/icon/w-search.png")!important

.dHeader
  height :42px
  line-height :42px
  font-size :14px
  >div:last-child
    float right
  >div
    float left
  .logo
    margin-right 5px
    a
      display inline-block
      height 100%
      box-shadow: none
    img
      display :inline-block
      vertical-align: middle
      height 30px
      margin-right 15px
  .d-more
    margin-right 40px
    font-size 14px
    .logo-link:first-child
      margin-right 12px
    a
      &.active
        box-shadow none
  li a
    display :inline-block
    &.active
      box-shadow none
    &.avatar-wrap
      width 30px
  .dh-nav-left
    /*width :470px*/
    li
      float: left
      text-align :center
      margin-right :38px
      font-size 14px
    li:last-child
      margin-right:0
  .dh-nav-right
    /*width 436px*/
    height :100%
    .ht-right-common
      height :100%
      .search-item
        width 160px
      >li
        display inline-block
        float :left
        height :100%
      /*a*/
        /*font-size: 14px*/
      .lr-area
        margin :0 5px
        line-height 42px
        span
          display :inline-block
          margin :0 4px
      .search-form
        height:30px
        background :transparent
        margin :6px 0
        line-height :30px
        border-radius :5px
        button
          float: right
          width :38px
          height :28px
          background :url("/static/img/icon/search.png") no-repeat center 0
          background-size:contain
        >div
          overflow hidden
          height :30px
          margin-right :32px
          .search-input
            float:right
            height :100%
            text-indent:12px
            width :0
            transition :width 0.3s ease-in
      .search-form
        &.show
          background :#fff
</style>
