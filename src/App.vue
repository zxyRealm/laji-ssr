<template>
  <div id="app" :style="$route.name==='contentEdit'?soleStyle:null">
    <vue-header v-if="$route.name!=='Error'&& $route.name!=='contentEdit'"></vue-header>
    <router-view  v-wechat-title="$route.meta.title"></router-view>
    <vue-footer v-if="$route.name!=='Error' && $route.name!=='contentEdit'"></vue-footer>
  </div>
</template>
<style lang="stylus">
  @import './assets/css/reset.styl'
</style>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue'
  import footer from './components/footer/footer.vue'
  import { FetchCheckLogin } from './api'
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
        this.$ajax("/person-info",'',json => {
          if(json.returnCode===200){
            this.$updateCount();
            this.$cookie('user_id',json.data.userId);
            this.$store.state.userInfo = json.data;
          }else{
            this.$cookie('user_id','',-1);
            this.$store.state.userInfo = {}
          }
        },'post','json','custom')
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
    }
  }
</script>
