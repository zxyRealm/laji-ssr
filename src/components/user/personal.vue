<template>
    <div class="user-personal-wrapper">
      <div class="personal-header">
         个人资料
      </div>
      <el-form label-width="94px" :rules="rules" ref="editForm" :model="userInfo" class="userInfoForm">
        <el-form-item label="昵　　称：" >
          <el-input class="no-border" type="text" v-model="$store.state.userInfo.pseudonym" readonly></el-input>
        </el-form-item>
        <el-form-item label="账　　号：">
          <el-input type="text" class="no-border" readonly v-model="$store.state.userInfo.userName"></el-input>
        </el-form-item>
        <el-form-item  label="性　　别：">
          <el-input class="no-border" type="text" :value="$store.state.userInfo.userSex?'女':'男'" readonly></el-input>
        </el-form-item>
        <el-form-item  label="个性签名：" class="personality" prop="userAutograph">
          <el-input type="textarea" placeholder="介绍一下自己吧！" v-model="userInfo.userAutograph"></el-input>
          <span class="word-length">{{userInfo.userAutograph?userInfo.userAutograph.length:0}}/20</span>
        </el-form-item>
        <el-form-item  label="绑定邮箱：" prop="userEmail">
          <el-col :span="9">
            <el-input type="text" v-show="!showList.one" v-model="userInfo.userEmail"></el-input>
            <p class="disable-edit" v-show="showList.one">
              <span>{{userInfo.userEmail!='0'?userInfo.userEmail:'暂无邮箱'}}</span>
              <i class="icon-edit" @click="showList.one=false"></i>
            </p>
          </el-col>
        </el-form-item>
        <el-form-item  label="绑定手机：" prop="userPhone">
          <el-col :span="9">
            <el-input type="text" class="no-border" readonly v-model="userInfo.userPhone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item  label="修改密码：">
          &nbsp;&nbsp;********* <router-link to="/modify_page" class="icon-edit" ></router-link>
        </el-form-item>
        <el-form-item class="tc">
          <el-button class="primary" @click="editUserInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
  import { aycn } from '../../api'
    export default{
      data(){
          var validateEmail = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入邮箱地址'));
            } else {
              let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
              if (reg.test(value)) {
                callback();
              }else {
                callback(new Error('邮箱格式不正确，请重新输入'))
              }
            }
          };
          var validateMobile = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入手机号'));
            } else {
              let reg = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/;
              if (reg.test(value)) {
                callback();
              }else {
                callback(new Error('手机号格式不正确，请重新输入'))
              }
            }
          };
          var validateAutograph = (rule,value,callback) => {
              if(value && value.length<=20){
                if(this.$regEmoji(value)){
                     callback(new Error("不可包含emoji表情图"))
                }else {
                    callback()
                }
              }else {
                  callback(new Error("长度不可超过20个字符"))
              }
          };
            return{
              userInfo:{
                userPhone:'',
                userEmail:'',
                userAutograph:''
              },
              rules:{
                userPhone:[
                  { validator: validateMobile,trigger: 'blur' }
                ],
                userEmail:[
                  { validator: validateEmail,trigger: 'blur' }
                ],
                userAutograph:[
                  { validator: validateAutograph, trigger: 'change' }
                ]
              },
              showList:{
                one:true,
                two:true
              }
            }
        },
      methods:{
        editUserInfo(){
          this.$refs['editForm'].validate((valid) => {
            if (valid) {
              aycn('/person-updateInfo',this.userInfo).then(json=>{
                if(json.returnCode===200){
                  this.$message("更新成功！");
                  this.$freshen()
                }
              });
            } else {
              return false;
            }
          });
        },
        change(){
          this.showList.two = false
        }
      },
      mounted(){
        this.userInfo = {
          userPhone:this.$store.state.userInfo.userPhone,
          userEmail:this.$store.state.userInfo.userEmail,
          userAutograph:this.$store.state.userInfo.userAutograph
        }
      },
      watch:{
          '$store.state.userInfo':function () {
            this.userInfo = {
              userPhone:this.$store.state.userInfo.userPhone,
              userEmail:this.$store.state.userInfo.userEmail,
              userAutograph:this.$store.state.userInfo.userAutograph
//              userAge:this.$store.state.userInfo.userAge
            }
          }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.user-personal-wrapper
  padding 26px 45px
  background #fff
  min-height 990px
  .disable-edit
    padding 0 10px
    span
      margin-right 10px
  .personal-header
    font-size 20px
  .userInfoForm
    padding-top 30px
    .no-border
      .el-input__inner
        border none
    .el-textarea
      .el-textarea__inner
        resize none
        height 100px
    .el-form-item
      &.tc
        margin-top 190px
        .primary
          width 250px
          height 50px
          color: #ffffff
          text-align center
          border-radius 25px
          background #F77583
          font-size: 18px
      .icon-edit
        display inline-block
        padding 9px 10px
        margin-left 5px
        cursor pointer
        vertical-align middle
        background url("../../assets/image/icon/edit-icon@1_01.png") no-repeat center center
    .personality
      position relative
      .word-length
        position absolute
        right 5px
        bottom -3px
        font-size 14px

</style>
