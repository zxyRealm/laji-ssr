<template>
    <div class="reader-rs-wrapper">
      <div class="reader-rs-header">
        <router-link :to="'/book_review/'+$route.params.uid">书评</router-link>
        <router-link :to="'/spit_slot/'+$route.params.uid">吐槽</router-link>
      </div>
      <div class="reader-rs-main cmt">
        <zxy-comment ref="userComment" :value="userCommentList" :isHandle="false" @handleClick="handleCommentData"></zxy-comment>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import Comment from '../comment/zxy-comment.vue'
  import { FetchGetUserData,FetchReplyBookComment } from '../../api'
    export default{
      components:{
        "zxy-comment":Comment
      },
      data(){
          return {
              userCommentList:{}
          }
      },
      methods:{
        //        获取评论信息列表
        getUserComment(page){
          FetchGetUserData(page,'reCom',this.$route.params.uid).then(json=>{
            if(json.returnCode===200){
              this.userCommentList = json.data
            }
          })
        },
        handleCommentData(index,type){
          if(type==='reply'){
            if(!this.$store.state.userInfo.userId){this.$router.push("/login");return false}
            this.userCommentList.allCommentList.forEach((item,index0)=>{
               if(index===index0){
                 if(this.userCommentList.allCommentList[index0].state){
                   this.$set(this.userCommentList.allCommentList[index0],'state',false)
                 }else {
                   this.$set(this.userCommentList.allCommentList[index0],'state',true)
                 }
               }else {
                 this.$set(this.userCommentList.allCommentList[index0],'state',false)
               }
            });
          }else if(type==='page1'){
            this.$router.push({params:{page:index}});
            this.getUserComment(this.$route.params.page)
          }else if(type==='Reply'){
            if(this.$trim(index.content).length<100 && this.$trim(index.content).length>0){
              FetchReplyBookComment({
                bookid:this.userCommentList.allCommentList[index.index].bookId,
                replyCommentsContent:index.content,
                commentId:this.userCommentList.allCommentList[index.index].id,
                puserId:this.userCommentList.allCommentList[index.index].userId
              }).then(json=>{
                if(json.returnCode===200){
                  this.$message("评论成功！");
                  this.$refs.userComment.replyData.replyContent = '';
                  this.getUserComment(this.$route.params.page)
                }
              });
            }

          }
        },
        //        显示回复弹窗
        showReply(index){
          this.privateForm.sendName = this.letterList.list[index].userName;
          this.privateForm.sendUserId = this.letterList.list[index].userId;
          this.dialogFormVisible = true;
        },
      },
      mounted(){
        this.getUserComment(this.$route.params.page)
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
</style>
