<template>
    <div class="web-news-wrap" v-wechat-title="currentTitle+'－辣鸡小说网'">
      <div class="ql-title">{{newsContent.title}}</div>
      <div class="ql-container  ql-snow">
        <img v-if="newsContent.maximg" :src="newsContent.maximg" alt="">
        <div class="ql-editor" v-else v-html="newsContent.content"></div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import 'quill/dist/quill.snow.css'
  import { aycn } from '../../api'
  export default{
      data(){
        return{
          newsContent:{}
        }
      },
      methods:{
        getNewsContent(){
          aycn("/sysgetNoticeById",{
            noticeid:this.$route.params.id
          }).then(json=>{
            if(json.returnCode===200){
              this.newsContent = json.data
            }
          })
        }
      },
      mounted(){
        this.getNewsContent()
      },
      computed:{
        currentTitle:function () {
          return this.newsContent.title?'网站公告':this.newsContent.title
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.web-news-wrap
  width 1024px
  margin 0 auto
  .ql-container
    margin-bottom 30px
    img
      margin 15px auto
      max-width 100%
  .ql-title
    font-size 22px
    text-align center
    line-height 40px
    color: #f77583;
    font-weight: bold;
    margin 20px 0
</style>
