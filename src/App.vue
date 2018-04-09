<template>
  <div id="app" :style="$route.name==='contentEdit'?soleStyle:null">
    <vue-header v-if="$route.name!=='Error'&& $route.name!=='contentEdit'"></vue-header>
    <router-view></router-view>
  </div>
</template>
<style lang="stylus">
  @import './assets/css/reset.styl'
  @import "./assets/css/common.styl"
</style>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue'

  import { FetchFreshenInfo,aycn } from './api'
  import { mapState } from 'vuex'
  export default {
    name: 'app',
    components: {
      'vue-header': header,
      'vue-footer': () => import('./components/footer/footer.vue')
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
      resize(val){
        if(val>1024 && val<1440){
          document.getElementById('app').style.zoom = 0.952
        }else {
          document.getElementById('app').style.zoom = 1
        }
      },
      addFooter(){
        let html = document.createElement('footer');
        html.innerHTML = `<div class="footer-inner">
                              <div class="about">
                                <div class="f-link">
                                  <div class="ft-title">
                                    友情链接
                                  </div>
                                </div>
                                <div class="contact">
                                  <div class="ft-title">
                                    联系我们
                                  </div>
                                  <ul>
                                    <li><span>微 信 号：</span>lajixiaoshuo</li>
                                    <li><span>客服邮箱：</span>2177488142@qq.com</li>
                                    <li><span>工作时间：</span>09:00--18:00</li>
                                  </ul>
                                </div>
                              </div>
                              <div class="copyright">
                                <p>COPYRIGHT©辣鸡小说网 2017-2027，版权所有 杭州樱熊网络科技有限公司 </p>
                                浙ICP备16023962号-2
                              </div>
                          </div>`;
        document.getElementById('app').appendChild(html);
      }
    },
    created(){
      this.$store.dispatch("FETCH_FRESHEN_INFO")
    },
    mounted(){
      this.addFooter();
      this.$store.state.once = true;
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
      };
      this.$router.beforeEach((to,from,next)=>{
        let uid = Number(this.$cookie('user_id'));
        if(to.name==='Login' && uid){
          next({
            path: '/index',
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
              query: { redirect: to.fullPath }
            })
          }
        }else {
          next();
        }
      });
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
    },
    computed:{
        ...mapState([
            'userInfo'
        ])
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

.ft-title
  height: 60px
  line-height: 60px
  font-size: 16px
footer
  width: 100%
  height :400px
  background-color: #F1F9FC
  font-size:12px
  .footer-inner
    /*background-color: aqua*/
    /*height: 350px*/
    .about
      padding: 0 15px
    .about .f-link
      padding-right: 25px
      float: left
      width: 750px
      li
        display :inline-block
        line-height: 30px
        margin-right:16px
    .about .contact
      overflow: hidden
      li
        display :inline-block
        height: 30px
        line-height:30px
        font-size :12px
    .declare
      margin-top :15px
      padding: 0 15px 15px
      border-bottom :1px dashed #666
      border-top:1px dashed #666
      .de-content
        text-indent:2em
    
    .help
      text-align:center
      width :100%
      margin :10px 0
      li
        display :inline-block
      li a
        margin:0 10px
    .copyright
      text-align :center
      img
        display inline-block
        vertical-align middle
        margin-right 5px


</style>
