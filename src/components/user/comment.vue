<template>
    <div class="user-comment-wrapper user-af-wrapper" >
      <div class="af-tabs-nav">
        <router-link to="/user/comment/book/1">书评</router-link>
        <router-link to="/user/comment/chapter">吐槽</router-link>
      </div>
      <div class="use-comment-main">
        <template v-if="$route.name==='commentBook'">
          <zxy-comment :value="commentBook" :label-width="30" :isHandle="false" @handleClick="handleComment"></zxy-comment>
        </template>
        <template v-if="$route.name==='commentChapter'">
          <zxy-comment :value="commentChapter" :label-width="30" :isHandle="false" @handleClick="handleComment"></zxy-comment>
        </template>
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
        return{
          commentBook:{},
          commentChapter:{}
        }
      },
      methods:{
//          获取我的书评列表
         getCommentBook(page){
             this.$ajax('/comm-commInfoByUserId',{
               userid:this.$cookie('user_id'),
               startPage:page
             },json=>{
                 if(json.returnCode===200){
                     this.commentBook = json.data
                 }
             })
         },
//        获取我的吐槽列表
        getCommentChapter(page){
           this.$ajax('/pcomm-getParagraphcommentuid/'+this.$cookie('user_id')+'/'+page,'',json=>{
             if(json.returnCode===200){
                 this.commentChapter = json.data
             }
           },'get')
        },
        handleComment(index,type){
            if(this.$route.name==='commentBook'){
             if(type==='delete'){
//               书评、回复删除
                let url,data;
                if(this.commentBook.list[index].commentType){
                  url = '/comm-deletereplyInfo';
                  data = {
                    commentid:this.commentBook.list[index].id
                  }
                }else {
                  url =  '/comm-delcomminfo';
                  data = {
                    id:this.commentBook.list[index].id,
                    type:0
                  }
                }
               this.$alert('', '确定删除吗？(⋟﹏⋞)', {
                 confirmButtonText: '是',
                 showCancelButton:true,
                 customClass:'small confirm-msg-box',
                 cancelButtonText:'否',
                 callback: action => {
                   if(action==='confirm'){
                     this.$ajax(url,data,json=>{
                       if(json.returnCode===200){
                         this.$message('删除成功');
                         this.getCommentBook(this.$route.params.page)
                       }
                     });
                   }
                 }
               });
              }else if(type==='page1'){
                  this.$router.push({params:{page:index}});
              }else if(type==='zan'){
               this.$ajax("/comm-GiveThumbs",{
                 commentId:this.commentBook.list[index].id
               },json => {
                 if(json.returnCode===200){
                   this.$message(this.commentBook.list[index].isthumbs?'取消成功':'点赞成功');
                   this.getCommentBook(this.commentBook.pageNum)
                 }
               })
             }
            }else if(this.$route.name==='commentChapter'){
               if(type==='delete'){
  //               吐槽删除
                 this.$alert('', '确定删除吗？(⋟﹏⋞)', {
                   confirmButtonText: '是',
                   showCancelButton:true,
                   customClass:'small confirm-msg-box',
                   cancelButtonText:'否',
                   callback: action => {
                     if(action==='confirm'){
                       this.$ajax('/pcomm-delParagraphcomment',{id:this.commentChapter.list[index].id},json=>{
                         if(json.returnCode===200){
                           this.$message('删除成功');
                           this.getCommentChapter(this.commentChapter.pageNum)
                         }
                       });
                     }
                   }
                 });
                 
               }else if(type==='page1'){
                 this.getCommentChapter(index)
               }else if(type==='zan'){
                 this.$ajax("/paragraphcomment-GiveThumbs",{
                   paragraphcommentid:this.commentChapter.list[index].id
                 },json => {
                   if(json.returnCode===200){
                      this.$message(this.commentChapter.list[index].isthumbs?'取消成功':'点赞成功');
                      this.getCommentChapter(this.commentChapter.pageNum)
                   }
                 })
               }
            }
        }
      },
      mounted(){
          if(this.$route.name==='commentBook'){
              this.getCommentBook(1)
          }else if(this.$route.name==='commentChapter'){
              this.getCommentChapter(1)
          }
      },
      watch:{
          $route:function (val) {
            if(val.name==='commentBook'){
              this.getCommentBook(this.$route.params.page)
            }else if(val.name==='commentChapter'){
              this.getCommentChapter(1)
            }
          }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
