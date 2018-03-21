<template>
    <div class="wrapper login-wrapper clear">
      <div class="lr-top clear">
        <span class="fix-line"></span><span class="lr-title">登录</span><span class="fix-line"></span>
      </div>
      <div class="form-wrapper clear">
        <div class="loginIcon"></div>
        <el-form :model="loginList" :rules="rules" ref="loginRuleForm" class="login-ruleForm">
          <el-form-item prop="userName">
            <el-input type="text" placeholder="请输入手机号或昵称" v-model="loginList.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item  prop="userPassword">
            <el-input type="password" placeholder="请输入密码" @keyup.enter.native="submitForm('loginRuleForm')" v-model="loginList.userPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item  prop="isSave">
            <el-checkbox v-model="loginList.isSave">下次自动登录</el-checkbox>
            <router-link class="fr main-color" :to="$route.query.redirect?'/find_page?redirect='+$route.query.redirect:'/find_page?redirect=/index'">忘记密码</router-link>
          </el-form-item>
          <el-form-item>
            <el-button class="form-submit-btn" type="primary" @click="submitForm('loginRuleForm')">登录</el-button>
            <router-link :to="$route.query.redirect?'/register?redirect='+$route.query.redirect:'/register?redirect=/index'" class="fr"><el-button>注册</el-button></router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { FetchUserLogin } from '../../api'
    export default{
      data() {
        let validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (!/[a-zA-Z\d_]{5,17}/.test(value)) {
              callback(new Error('正确格式为：长度在6-18之间，只能包含字符、数字和下划线。 '));
            }else {
              callback()
            }
          }
        };
        return {
          loginList:{
            userName:"",
            userPassword:'',
            isSave:0,
            terminal:4
          },
          rules: {
            userName: [
              { required: true, message:'请输入账号', trigger: 'blur' }
            ],
            userPassword: [
              { required: true, validator:validatePass, trigger: 'blur' }
            ]
          }
        };
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let subData = JSON.parse(JSON.stringify(this.loginList));
              subData.isSave = subData.isSave?1:0;
              subData.userPassword = this.$md5(subData.userPassword);
              FetchUserLogin(subData).then(res=>{
                  if(res.returnCode===200){
                    this.$store.commit("SET_USER_INFO",res.data);
                    this.$cookie('user_id',res.data.userId);
                    this.$message({message:'登录成功',type:'success',duration:1500});
                    setTimeout(() => {
                      if(this.$route.query.redirect!==undefined){
                        this.$router.push({path:this.$route.query.redirect})
                      }else {
                        this.$router.push({path:'/index'})
                      }
                    },1500)
                  }
              });
            } else {
              return false;
            }
          });
        },
        getCode(){
          this.$message({
            message:'数据不全',
            type: 'warning',
            duration:0
          })
        }
      },
      mounted(){
        this.$enableCookie();
      }
    }

</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.login-wrapper
  width :860px
  margin : 0 auto
  .loginIcon
    float left
    /*border :1px solid #efefef*/
    height :288px
    width: 338px
    border-radius :5px
    background url("images/login-bg@1_01.jpg") no-repeat
  .lr-top
    width :746px
    margin :36px auto 40px
    text-align center
    span
     float left
    .fix-line
      display :inline-block
      width :322px
      background-color :#efefef
      height :2px
      margin :18px 0
    .lr-title
      font-size :24px
      padding : 0 24px
  .login-ruleForm
    float: right
    width :388px
    margin 0 auto
    .el-form-item
      margin-bottom :32px
      .el-form-item__content
        margin-left :0
    .el-form-item:last-child
        a
          box-shadow :none
    input
      height: 48px!important
      padding :3px 28px
    .form-code input
      width :264px
    button
      width :120px!important
      height :48px!important
      border-radius :30px!important
      /*background-color :#f77583*/
    .form-code-btn
      float right
      height :48px
      width :145px
      background:#efefef
      color :#999
    .form-code-btn:hover
      border-color:#c4c4c4;
    .el-radio-group
      width :100%
      .el-col
        text-align :center
      .el-radio-button__inner
        padding:54px 16px 0
        border:none
        background :url('./images/sex-girl.png') no-repeat center top
      .boy .el-radio-button__inner
        background :url('./images/sex-boy.png') no-repeat center top
      .el-form-item__error
        left :50%
        margin-left:-2.5em
</style>
