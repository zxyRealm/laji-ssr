<template>
  <div id="app" :style="$route.name==='contentEdit'?soleStyle:null">
    <vue-header v-if="$route.name!=='Error'&& $route.name!=='contentEdit'"></vue-header>
    <router-view  v-wechat-title="$route.meta.title"></router-view>
    <vue-footer v-if="$route.name!=='Error' && $route.name!=='contentEdit'"></vue-footer>
  </div>
</template>
<style lang="stylus">
  @import './assets/css/reset.styl'
  @import "./assets/css/common.styl"
</style>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue'
  import footer from './components/footer/footer.vue'
  import { FetchFreshenInfo,aycn } from './api'
  export default {
    name: 'app',
    components: {
      'vue-header': header,
      'vue-footer': footer
    },
    data(){
      return {
        soleStyle:{
          minHeight:'600px'
        },
        screenWidth:1024
      }
    },
    methods:{
      getUserInfo(){
        FetchFreshenInfo().then(json=>{
          if(json.returnCode===200){
            this.$updateCount();
            this.$cookie('user_id',json.data.userId);
            this.$store.state.userInfo = json.data;
          }else{
            this.$cookie('user_id','',-1);
            this.$store.state.userInfo = {}
          }
        });
      },
      resize(val){
        if(val>1024 && val<1440){
          document.getElementById('app').style.zoom = 0.952
        }else {
          document.getElementById('app').style.zoom = 1
        }
      }
    },
    created(){
        this.$store.dispatch("FETCH_FRESHEN_INFO")
    },
    mounted(){
      this.screenWidth= document.body.clientWidth;
      const width = document.body.clientWidth;
      this.resize(width);
      window.onresize = () => {
        let width = document.body.clientWidth;
        if (!this.timer) {
          this.resize(width);
          this.timer = true;
          setTimeout(()=> {
            this.timer = false
          }, 600)
        }
      }
      this.$router.beforeEach((to,from,next)=>{
        let uid = Number(this.$cookie('user_id'));
        if(to.name==='Login' && uid){
          next({
            path: '/',
          });
          return false
        }
        if(uid && Number(to.params.uid)===uid){
          if(to.name==='Reader'){
            next({
              path:'/user/index'
            })
          }else if(to.name==='bookShelf'){
            next({
              path:'/user/shelf'
            })
          }else if(to.name==='bookReview'){
            next({
              path:'/user/comment/book/1'
            })
          }else if(to.name==='spitSlot'){
            next({
              path:'/user/comment/chapter'
            })
          }else if(to.name==='Attention'){
            next({
              path:'/user/attention'
            })
          }else if(to.name==='Fans'){
            next({
              path:'/user/fans'
            })
          }
        }
        // 判断该路由是否需要登录权限
        if (to.meta.requireAuth) {
          if(uid){
            aycn('/person-checkLoginState','post',false).then(res=>{
              if(res.returnCode===200){
                if(to.path.indexOf('/author')>-1){
                  if(res.data===1 && to.name!=='authorApply'){
                    next({
                      path:"/author/apply"
                    })
                  }else {
                    if(res.data===2 &&!from.name&&to.name==='authorApply'){
                      next({
                        path:'/author/writing/index'
                      })
                    }else {
                      next()
                    }
                  }
                }else {
                  next()
                }
              }else{
                this.$store.state.userInfo = {};
                next({
                  path: '/login',
                  query: {redirect: to.fullPath}
                })
              }
            })
          }else {
            this.$store.state.userInfo = {};
            next({
              path: '/login',
              query: {redirect: to.fullPath}
            })
          }
        }else if(to.fullPath==='/login'){
          next({
            path: '/login',
            query: {redirect: from.fullPath}
          })
        }else {
          next();
        }
      })
    },
    watch:{
        $route:function (val) {
          if(typeof window!=='undefined'){
            setTimeout(()=>{
              var _hmt = _hmt || [];
              (function() {
                //每次执行前，先移除上次插入的代码
                document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?ae2f46c8c11aad77feae3035de5c127e";
                hm.id = "baidu_tj";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            },0);
          }
        }
    }
  }
</script>
