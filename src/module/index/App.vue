<template>
  <div id="app" :style="$route.name==='contentEdit'?soleStyle:null">
    <vue-header v-if="$route.name!=='Error'&& $route.name!=='contentEdit'"></vue-header>
    <router-view  v-wechat-title="$route.meta.title"></router-view>
    <vue-footer v-if="$route.name!=='Error' && $route.name!=='contentEdit'"></vue-footer>
  </div>
</template>
<script type="text/ecmascript-6">
  import header from '../../components/header/header'
  import footer from '../../components/footer/footer'
  import store from '../../store/store'
  import '../../assets/css/reset.styl'
  import '../../assets/css/theme.styl'
  export default {
    name: 'app',
    store,
    components: {
      'vue-header': header,
      'vue-footer': footer
    },
    data(){
      return {
        soleStyle:{
          minHeight:'600px'
        }
      }
    },
    methods:{
      getUserInfo(index){
        if(Number(this.$cookie('user_id'))){
          this.$ajax("/person-info",json => {
            if(json.returnCode===200){
              this.$store.state.userInfo = json.data
            }else{
              this.$cookie('user_id','',-1);
              this.$store.state.userInfo = {}
            }
          });
          this.$updateCount()
        }
      }
    },
    mounted(){
      this.getUserInfo()
    }
  }
</script>
