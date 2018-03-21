<template>
    <div class="user-message-wrapper user-af-wrapper">

      <div class="breadcrumb-wrap user">
        <div class="fl">当前位置：</div>
        <el-breadcrumb  separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/user/index' }">个人中心</el-breadcrumb-item>
          <el-breadcrumb-item>我的消息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="af-tabs-nav user-message-nav">
        <router-link to="/user/message/notice">
          <el-badge :value="$store.state.message.userCommentCount" class="tabs-item">
            通知
            <!--<el-button >通知</el-button>-->
          </el-badge>
        </router-link>
        <router-link to="/user/message/letter">
          <el-badge :value="$store.state.message.userMessageCount" class="tabs-item">
            私信
          </el-badge>
        </router-link>
        <router-link to="/user/message/comment">
          <el-badge :value="$store.state.message.userCommentReplyCount" class="tabs-item">
            评论
          </el-badge>
        </router-link>
      </div>

      <zxy-comment v-if="$route.name==='userComment'" :labelWidth="20" :value="userCommentList" :isHandle="false" @handleClick="handleDataBook"></zxy-comment>
      <div v-if="$route.name==='userNotice' && noticeList.list"  class="notify-wrapper">
        <template v-if="noticeList.list.length">
          <div class="notify-item" v-for="(item,$index) in noticeList.list">
            <div class="notify-item-header">
              <span class="fr">{{item.dateTimes | time}}</span>
              <div class="title">
                  {{item.title}}
              </div>
            </div>
            <div class="notc-wrap">
              <div class="notify-content" :class="{auto:item.auto}" v-html="formatTxt(item.messageContent)">
              </div>
              <a href="javascript:0;" @click="showDetail($index)" class="more">{{item.auto?'全部收起':'查看详情'}}</a>
            </div>

          </div>
        </template>
        <zdy-hint v-else></zdy-hint>
      </div>
      <ul v-if="$route.name==='userLetter' && letterList.list" class="user-af-list">
        <template v-if="letterList.list.length">
          <li v-for="(item,$index) in letterList.list" class="af-list-item clear" @click="handleClick($event,$index)">
            <div class="af-item-avatar">
              <router-link target="_blank" :to="'/reader/'+item.userId" class="reader">
                <el-badge :value="item.counts>99?'99+':item.counts" >
                  <img :src="item.userHeadPortraitURL" :alt="item.userName">
                  <i v-if="item.vipGrade" class="zdy-icon__user_vip"></i>
                </el-badge>
              </router-link>
            </div>
            <div class="af-item-main">
              <div class="af-item-content">
                <p class="user-info">
                  <span class="v-item">{{item.userName}}</span>
                  <i class="v-item zdy-icon__sex" :class="item.userSex?'girl':null" ></i>
                  <zdy-icon__user_level :grade="item.userGrade"></zdy-icon__user_level>
                  <span class="fr clr9">{{item.dateTimes|time}}</span>
                </p>
                <div class="item-context">
                  {{item.messageContent}}
                </div>
                <p class="more-handle">
                  <span class="b-btn color reply">回复</span> |
                  <span class="b-btn color chat">查看对话</span> |
                  <span class="b-btn complain">举报</span> |
                  <span class="b-btn delete">删除</span>
                </p>
              </div>
            </div>
          </li>
        </template>
        <zdy-hint v-else ></zdy-hint>
      </ul>
      <zdy-hint v-if="$route.name==='userLetter' && letterList.list===null"></zdy-hint>
      <el-dialog top="45%" :custom-class="'reply-letter-wrapper'" :show-close="false" width="400px" @open="privateForm.messageContent=''" :visible.sync="dialogFormVisible">
        <p class="title mb5 mt5">{{privateForm.sendName}}:</p>
        <el-form :rules="rules" :model="privateForm" ref="privateForm">
          <el-form-item prop="messageContent">
            <el-input v-model="privateForm.messageContent" style="height: 72px" type="textarea" :auto-complete="'off'"></el-input>
          </el-form-item>
          <div class="mt10 mb10 clear">
            <el-button class="fr" type="primary" @click="replyLetter('privateForm')">发  送</el-button>
          </div>
        </el-form>
        <img src="../../../static/img/personal-letter@_01.png" class="personal-letter-bg" alt="">
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import Comment from '../comment/zxy-comment.vue'
    export default{
      components:{
          "zxy-comment":Comment
      },
      data(){
          return {
            letterList:{},
            userCommentList:{},
            noticeList:{},
            dialogFormVisible:false,
            activeTabs:'comment',
            privateForm:{
              messageContent:''
            },
            rules:{
              messageContent:[
                  { required:true,message: '请输入内容', trigger: 'blur' },
                  { min:1, max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }
              ]
            }
          }
        },
      methods:{
//       评论信息操作
        handleDataBook(val,type){
          if(this.$route.name==='userComment'){
            if(type==='page1'){
                this.getUserComment(val)
            }
          }else if(this.$route.name==='userNotice'){

          }else if(this.$route.name==='userLetter'){
            if(type==='page1'){

            }
          }
        },
//        获取评论信息列表
        getUserComment(page){
          this.$ajax("/comm-coverReplyInfo",{
            startPage:page,
            userid:this.$cookie('user_id')
          },json=>{
            if(json.returnCode===200){
              this.userCommentList = json.data;
              this.$updateCount()
            }
          })
        },
//        获取私信列表
        getLetterList(page){
          this.$ajax("/person-message",{
            startpage:page
          },json=>{
            if(json.returnCode===200){
              this.letterList = json.data;
              this.$updateCount()
            }
          },'get')
        },
//        显示回复弹窗
        showReply(index){
            this.privateForm.sendName = this.letterList.list[index].userName;
            this.privateForm.sendUserId = this.letterList.list[index].userId;
            this.dialogFormVisible = true;
        },
        reply(index){
          let data = this.letterList.list[index];
          this.$send('letter',{sendName:data.userName,sendUserId:data.userId})
        },
//        私信列表
        handleClick(event,index){
          let current = event.target.className,
              obj = this.letterList.list[index];
//          回复私信
          if(current.indexOf('reply')>-1){
            this.reply(index)
//           举报用户
          }else if(current.indexOf('complain')>-1){
            this.complain()
//            删除私聊
          }else if(current.indexOf('delete')>-1){
            this.deleteLetter(index)
          }else if(current.indexOf('reader')>-1){
            this.$router.push({path:'/reader/'+obj.sendUserId})
          }else if(current.indexOf('chat')>-1){
              this.$router.push({path:'/user/message/letter/'+obj.userId});
//              sessionStorage.setItem('send_info',JSON.stringify({avatar:obj.userHeadPortraitURL,sendName:obj.userName,sendId:obj.userId}))
          }
        },

//        通知列表
        getNoticeList(page){
          this.$ajax("/sys-getsystemmsg",{startpage:page},json=>{
            if(json.returnCode===200){
              this.noticeList = json.data
            }
          })
        },
//        举报用户
        complain(){
          this.$message("举报成功！")
        },
//        回复私信
        replyLetter(formName){
          this.$refs[formName].validate((valid) => {
            if(this.$trim(this.privateForm.messageContent).length<1){this.privateForm.messageContent = ''}
            if (valid) {
              this.privateForm.userName = this.$store.state.userInfo.pseudonym;
              this.$ajax("/person-sendmessage",this.privateForm,json=>{
                  if(json.returnCode===200){
                    this.$message("发送成功！");
                    this.dialogFormVisible = false
                  }
              })
            } else {
              this.$message({message:'请填写发送内容！',type:'warning'});
              return false;
            }
          });
        },
//        删除私信
        deleteLetter(index){
            let value = this.letterList.list[index];
            this.$ajax("/person-updatemessage",{
              userid:value.userId,
              senduserid:value.userId,
              messageid:value.id,
              messageType:2
            },json=>{
              if(json.returnCode===200){
                  this.$message("删除成功");
                  this.getLetterList(this.letterList.pageNum)
              }
            })
        },
        formatTxt(txt){
          return txt.replace(/\s*\n+\s*/g, '<br><br>　　')
        },
        showDetail(index){
            if(this.noticeList.list[index].auto){
              this.$set(this.noticeList.list[index],'auto',false);
            }else {
              this.$set(this.noticeList.list[index],'auto',true);
            }
        }

      },
      mounted(){
        if(this.$route.name==='userComment'){
          this.getUserComment(1);
        }else if(this.$route.name==='userNotice'){
          this.getNoticeList(1)
        }else if(this.$route.name==='userLetter'){
          this.getLetterList(1);
        }
      },
      watch:{
          '$route':function (val) {
            if(val.name==='userComment'){
              this.getUserComment(1)
            }else if(val.name==='userNotice'){
              this.getNoticeList(1)
            }else if(val.name==='userLetter'){
              this.getLetterList(1)
            }
          }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.notify-wrapper
  padding-left 20px
  .notify-item
    padding 30px 20px
    border :1px solid #efefef
    background-color #fff
    font-size 14px
    margin-bottom 12px
    box-shadow 0 3px 4px #edefef
    .notify-item-header
      .title
        font-weight 600
      >span
        color #999
        font-family sans-serif
    .notify-content
      margin-top 18px
      color #666
      text-indent 2em
      line-height 24px
      height 72px
      overflow hidden
      &.auto
          height auto
    .notc-wrap
      position relative
      .more
        position absolute
        bottom -20px
        right  0
        color #fb5e6f
        font-size 14px
        top auto
</style>
