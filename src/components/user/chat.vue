<template>
    <div class="private-chat-wrap user-af-wrapper">
      <div class="af-tabs-nav user-message-nav">
       
        <router-link to="/user/message/notice">
          <el-badge :value="$store.state.message.userCommentCount" class="tabs-item">
            <el-button size="small">通知</el-button>
          </el-badge>
        </router-link>
        <router-link to="/user/message/letter">
          <el-badge :value="$store.state.message.userMessageCount" class="tabs-item">
            <el-button size="small">私信</el-button>
          </el-badge>
        </router-link>
        <router-link to="/user/message/comment">
          <el-badge :value="$store.state.message.userCommentReplyCount" class="tabs-item">
            <el-button size="small">评论</el-button>
          </el-badge>
        </router-link>
      </div>
      
      <div class="chat-wrap bsw">
        <div class="back">
          <router-link  to="/user/message/letter"> <i class="el-icon-d-arrow-left"></i>返回</router-link>
        </div>
        <div class="send-letter-wrap">
          <div class="send-info">
            回私信给：<span class="name">{{baseInfo.pseudonym}}</span>
          </div>
          <div class="send-textarea">
            <textarea v-model="sendMsg" border="0"></textarea>
            <span class="words-count">{{sendMsg.length}}/100</span>
          </div>
          <div class="send-btn clear">
            <button type="button"  class="lj-btn fr" @click="send">发送</button>
          </div>
        </div>
        <template v-if="chatList.list" v-for="(item,$index) in chatList.list">
          <div class="chat-item clear" :class="{self:item.userId===$store.state.userInfo.userId}">
            <div class="chat-avatar">
              <img :src="item.userId===$store.state.userInfo.userId?$store.state.userInfo.userHeadPortraitURL:baseInfo.userHeadPortraitURL" :alt="item.userName">
            </div>
            <div class="chat-content">
              <div class="user-info clear">
                <span class="name">{{item.userName}}</span>
                <span class="time" >{{item.dateTimes|time}}</span>
              </div>
              <div class="chat-text clear">
                <span class="text">
                  {{item.messageContent}}
                </span>
              </div>
            </div>
          </div>
        </template>
        <el-pagination
          v-if="chatList.list && chatList.total>chatList.pageSize"
           style="float: none"
           @current-change="handleCurrentChange"
           :current-page.sync="chatList.pageNum"
           :page-size="chatList.pageSize"
           layout="prev, pager, next, jumper"
           :total="chatList.total">
        </el-pagination>
        
        <div class="loading-wrap" v-if="loading">
          <div class="loading-item">
            <i class="loading-icon"></i>
            <span class="loading-text">
              提示内容
            </span>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { FetchGetUserData,FetchHandleUserInfo } from '../../api'
    export default{
      data(){
        return{
          loading:false,
          chatList:{},
          baseInfo:{},
          sendMsg:''
        }
      },
      methods:{
        getUserInfo(){
            FetchGetUserData('su',this.$route.params.rid).then(json=>{
              if(json.returnCode===200){
                this.baseInfo = json.data;
                this.getChatList();
              }
            })
        },
        getChatList(){
            FetchGetUserData(this.$route.params.page,'chat',this.$route.params.rid).then(res=>{
              if(res.returnCode===200){
                this.chatList = res.data
              }
            })
        },
        send(){
          let txt = this.$trim(this.sendMsg);
          if(txt.length>0 && txt.length<=100){
             FetchHandleUserInfo({
               messageContent:this.sendMsg,
               userName:this.$store.state.userInfo.pseudonym,
               sendUserId:this.baseInfo.userId,
               sendName:this.baseInfo.pseudonym
             },'sl').then(json=>{
               this.sendMsg = '';
               if(json.returnCode===200){
                 this.$message('发送成功');
                 if(Number(this.$route.params.page)!==1){
                   this.$router.push({params:{page:1}})
                 }else {
                   this.getChatList()
                 }
               }
             })
          }else if(txt.length>100){
            this.$message({message:"您输入的内容超过长度限制！",type:'warning'})
          }else {
            this.$message({message:'请输入内容！',type:'warning'})
          }
        },
        handleCurrentChange(page){
           this.$router.push({params:{page:page}})
        }
      },
      mounted(){
        this.getUserInfo();
        this.getChatList();
      },
      watch:{
        "$route":function () {
          this.getChatList()
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.loading-wrap
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background rgba(0,0,0,0.6)
  z-index 99999
  overflow hidden
  text-align center
  .loading-item
    position absolute
    display inline-block
    top 0
    bottom 0
    text-align center
    margin auto
    width auto
    height 40px
    border-radius 5px
    line-height 40px
    font-size 16px
    padding 0 15px
    color #fff

.send-letter-wrap
  margin-bottom 24px
  .send-info
    height 36px
    font-size 16px
    .name
      color #4A90E2
  .send-textarea
    position relative
    height 92px
    margin-bottom 15px
    border 1px solid #979797
    border-radius 7px
    overflow hidden
    .words-count
      position absolute
      right 5px
      bottom 5px
    >textarea
      height 92px
      width 100%
      font-size 14px
  .send-btn
    .lj-btn
      height 44px
      width 88px
      font-size 16px
.private-chat-wrap
  .owner
  .chat-wrap
    background #fff
    margin-left 20px
    padding 20px 10px
    border-radius 7px
    .back
      font-size 16px
      margin-bottom 15px
      a
        color #4A90E2
        &.active
          box-shadow none
        >i
          font-size 15px
          margin-right 10px
    .chat-item
      margin-bottom 24px
      &.self
        .chat-avatar
          float right
          text-align right
        .chat-content
          .user-info
            .name
              float right
            .time
              float left
          
          .chat-text
            text-align right
            .text
              padding 8px 21px 8px 42px
              background-position 4px 4px
              background-image url("./image/chat-icon-left@x1_01.png")
              text-align left
              
      .chat-avatar
        width 90px
        float left
        >img
          display inline-block
          width 70px
          height 70px
          border-radius 50%
          border 1px solid #979797
      .chat-content
        overflow hidden
        .user-info
          height 24px
          .name
            font-size 16px
            color #0063B5
          .time
            float right
            color #999
        .chat-text
          margin-top 20px
          min-height 34px
          .text
            display inline-block
            max-width calc(100% - 90px)
            padding 8px 42px 8px 21px
            font-size 15px
            background #FFEFBA
            border-radius 20px
            background-repeat no-repeat
            background-position calc(100% - 4px) 4px
            background-image url("./image/chat-icon-right@x1_01.png")
</style>
