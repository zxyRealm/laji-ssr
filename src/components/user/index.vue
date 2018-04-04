<template>
    <div class="container-wrapper userCenter">
      <div class="wrapper container" v-wechat-title="currentHash+'－辣鸡小说网'" >
        <div class="user-wrapper clear">
          <div class="mw-fl-content">
            <div class="mw-top-info">
              <img class="avatar" @click="uploadAvatar" :src="$store.state.userInfo.userHeadPortraitURL" :alt="$store.state.userInfo.pseudonym">
              <div class="person-info">
                <p class="username">{{$store.state.userInfo.pseudonym}}
                  <i class="zdy-icon__sex" :class="{girl:$store.state.userInfo.userSex}"></i>
                </p>
                <div class="level">
                  <span>lv{{$store.state.userInfo.userGrade}}</span>
                  <el-progress class="level-progress" :show-text="false" :stroke-width="8" :percentage="percent"></el-progress>
                </div>
                <div class="person-intro">
                  {{$store.state.userInfo.userAutograph?$store.state.userInfo.userAutograph:'还没有签名哦！'}}
                </div>
              </div>
            </div>
            <div class="el-menu-vertical">
              <router-link class="el-menu-item" to="/user/index">首页</router-link>
              <router-link class="el-menu-item" to="/user/shelf">我的书架</router-link>
              <router-link class="el-menu-item" to="/user/wallet">我的钱包</router-link>
              <router-link class="el-menu-item" to="/user/comment"> 我的书评 / 吐槽</router-link>
              <router-link class="el-menu-item" to="/user/message">
                消息
              </router-link>
              <router-link class="el-menu-item" to="/user/attention">我的关注</router-link>
              <router-link class="el-menu-item" to="/user/fans">我的粉丝</router-link>
              <router-link class="el-menu-item" to="/user/personal">我的资料</router-link>
            </div>
          </div>

          <div class="mw-fr-content clear" :class="$route.name=='userPersonal'?'no-bgColor':null">
            <router-view></router-view>
          </div>
        </div>
        <!--url 属性必需设置为本地路径 如果引用的图片资源域名不同将无法剪裁上传-->
        <cropper
          v-if="ready"
          ref="avatarUpdate"
          action="https://www.lajixs.com/api/sys-UserAvatarimgUpload"
          :visible.sync="dialogTableVisible"
          @close="closeIt"
          :maxWidth="400"
          url="/static/img/defaultavatarimg.jpg"
          :aspectRatio="1/1">
        </cropper>
        <my-consume></my-consume>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      components:{
        cropper:()=>import("../common/img_upload.vue")
      },
      data(){
        return{
          imageUrl:'',
          dialogTableVisible:false,
          ready:false
        }
      },
      methods: {
        uploadAvatar(){
          this.ready = true;
          this.dialogTableVisible = true;
        },
        closeIt(){
            this.dialogTableVisible = false;
        },
        upPic(url){
           this.$store.state.userInfo.userHeadPortraitURL = url
        },
        updateAvatar(){
          this.$refs.avatarUpdate.submitImageFile()
        },
//        校验文件格式
        handleOpen(key,filelist) {
          const isJPG = key.raw.type === 'image/jpeg';
          const isLt2M = key.size / 1024 / 1024 < 2;
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            return isJPG
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            return isLt2M
          }
          this.imageUrl = key.url;
        },
        //        上传成功回调
        fileSuccess(res) {
            this.$nextTick(()=>{
              this.$loading().close()
            })
            this.dialogTableVisible=false;
            if(res.returnCode===200){
               this.$message('上传成功');
               this.$freshen()
            }else {
              this.$message(res.msg)
            }
        },
//        上传错误回调
        fileError(err) {
            this.$nextTick(()=>{
              this.$loading().close()
            })
            this.dialogTableVisible =false;
            this.$message(err);
        },
//        上传文件
        submitUpload() {
          this.$myLoad()
//          单一图片上传，重新选取图片后，确保上传文件表中只保留最后选择的文件
          this.$refs.avatarUpload.uploadFiles = this.$refs.avatarUpload.uploadFiles.slice(-1);
          this.$refs.avatarUpload.submit();
        },
//        文件上传前格式校验
        beforeAvatarUpload(file){
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        showMyAvatar(){
          this.imageUrl = this.$store.state.userInfo.userHeadPortraitURL
        }
      },
      computed:{
        currentHash:function () {
            if(this.$route.name==='userIndex'){
                return '个人中心'
            }else if(this.$route.name==='userShelf'){
                return '我的书架'
            }else if(this.$route.name==='walletCharge'|| this.$route.name==='walletConsume'||this.$route.name==='walletPepper'||this.$route.name==='walletReward'||this.$route.name==='walletAnnuum'){
                return '我的钱包'
            }else if(this.$route.name==='userCharge'){
              return '充值中心'
            }else if(this.$route.name==='commentBook'){
              return '我的书评'
            }else if(this.$route.name==='commentChapter'){
              return '我的吐槽'
            }else if(this.$route.name==='userComment'||this.$route.name==='userNotice'||this.$route.name==='userLetter'){
                return '我的消息'
            }else if(this.$route.name==='userAttention'){
                return '我的关注'
            }else if(this.$route.name==='userFans'){
                return '我的粉丝'
            }else if(this.$route.name==='userPersonal'){
                return '个人资料'
            }else if(this.$route.name==='userChat'){
              return '私信'
            }
          },
        percent:function(){
          let per = 0;
          let val = this.$store.state.userInfo;
          if(val.userId && val.integration){
              if(val.integration<val.topSource){
                  per = (val.integration/val.topSource)*100;
              }else {
                  if(val.downSource-val.topSource){
                      per = ((val.integration-val.topSource)/(val.downSource-val.topSource))*100;
                      return per;
                  }else {
                      per = 100
                  }
              }
          }
          return per
        },
        avatar:function () {
            let url = this.$store.state.userInfo.userHeadPortraitURL;
            if(url){
              url =url.split("?")[0]
            }else {
              url  = ''
            }
          return url
        }
      },
      mounted(){
          this.ready = true
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../assets/css/user.styl"
.signNotify
  left 50%
  top 25%!important
  transform translateX(-50%)
</style>
