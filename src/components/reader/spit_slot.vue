<template>
    <div class="reader-rs-wrapper">
      <div class="reader-rs-header">
        <router-link :to="'/book_review/'+$route.params.uid">书评</router-link>
        <router-link :to="'/spit_slot/'+$route.params.uid">吐槽</router-link>
      </div>
      <div class="reader-rs-main cmt">
        <zxy-comment :value="spitList" :isHandle="false" @handleClick="handleComment"></zxy-comment>
      </div>
    </div>

</template>

<script type="text/ecmascript-6">
  import Comment from '../comment/zxy-comment.vue'
    export default{
      components:{
        'zxy-comment':Comment
      },
      data(){
        return {
          spitList:{}
        }
      },
      methods:{
        getSpitList(){
          this.$ajax("/pcomm-getParagraphcommentuid/"+this.$route.params.uid+'/'+this.$route.params.page,'',json=>{
            if(json.returnCode===200){
               this.spitList = json.data
            }
          },'get')
        },
        handleComment(index,type){
            if(type==='page1'){
                this.$router.push({params:{page:index}})
            }else if(type==='zan'){
              this.$ajax("/paragraphcomment-GiveThumbs",{
                paragraphcommentid:this.spitList.list[index].id
              },json => {
                if(json.returnCode===200){
                  this.$message(this.spitList.list[index].isthumbs?'取消成功':'点赞成功');
                  this.getSpitList(this.spitList.pageNum)
                }
              })
            }
        }
      },
      mounted(){
        this.getSpitList()
      },
      watch:{
          "$route":function () {
            this.getSpitList()
          }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
