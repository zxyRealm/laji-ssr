<template>
  <div class="wrapper">
    <div class="lr-top clear">
      <span class="fix-line"></span><span class="lr-title">注册</span><span class="fix-line"></span>
    </div>
    <el-form :model="registerList" :rules="rules2" ref="ruleForm2" class="register-ruleForm">
      <el-form-item prop="pseudonym">
        <el-input type="text" placeholder="昵称" v-model="registerList.pseudonym" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  prop="userPassword">
        <el-input type="password" placeholder="密码" v-model="registerList.userPassword" auto-complete="off"></el-input>
      </el-form-item>
      <!--<el-form-item  prop="checkPass">-->
        <!--<el-input placeholder="确认密码" type="password" v-model="registerList.checkPass" auto-complete="off"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item prop="userPhone">
        <el-input placeholder="+86 手机号" v-model="registerList.userPhone"></el-input>
      </el-form-item>
      <el-form-item  class="form-code" prop="code">
        <el-col :span="14">
          <el-input placeholder="验证码" v-model="registerList.code"></el-input>
        </el-col>
        <el-col :span="10">
          <el-button :disabled="btnTxt!=='点击发送'" ref="getCodeBtn" @click="getCode" class="form-code-btn">{{btnTxt}}</el-button>
        </el-col>

      </el-form-item>
      <el-form-item  class="form-sex" prop="userSex">
        <template>
          <el-radio-group  fill="#fff" :text-color="'#f00'" v-model="registerList.userSex">
            <el-col :span="12">
              <el-radio-button class="girl" label="1">女</el-radio-button>
            </el-col>
            <el-col :span="12">
              <el-radio-button class="boy" label="0" >男</el-radio-button>
            </el-col>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button class="form-submit-btn" type="primary" @click="submitForm('ruleForm2')">注册</el-button>
      </el-form-item>
      <el-form-item>
        <router-link  class="fr" :to="$route.query.redirect?'/login?redirect='+$route.query.redirect:'/login?redirect=/index'">有账号，直接登录 <i class="el-icon-arrow-right"></i></router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import { FetchUserRegister,FetchUserLogin,FetchCheckName } from '../../api'
  export default{
    data() {
      let validateName =(rule,value,callback) => {
          if(!value){
            callback(new Error('昵称不能为空！'));
          }else{
              if(!/^[\u4e00-\u9fa5a-zA-Z0-9]{2,16}$/.test(value)){
                callback(new Error('正确格式为：长度在2-16之间，只能包含数字、字母、汉字。'));
              }else {
                FetchCheckName(value,'name').then(json=>{
                  if(json.returnCode===200){
                    callback()
                  }else {
                    callback(new Error(json.msg));
                  }
                });
              }
          }
      };

      let checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }else {
          if (!this.$regMob(value)){
            callback(new Error('请输入合法的手机号码'));
          } else {
            callback();
          }
        }
      };

      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (!/[a-zA-Z\d_]{6,18}$/.test(value)) {
            callback(new Error('正确格式为：长度在6-18之间，只能包含字符、数字和下划线。'));
          }else {
            callback();
          }

        }
      };

      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerList.userPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        btnTxt:'点击发送',
        registerList:{
          pseudonym:"",
          userPassword:'',
          checkPass:'',
          userSex:'',
          userAge:'',
          userPhone:'',
          code:''
        },
        timer:null,
        limit:60,
        rules2: {
          pseudonym: [
            { validator: validateName, trigger: 'blur' }
          ],
          userPassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
//          checkPass: [
//            { validator: validatePass2, trigger: 'blur' }
//          ],
          userPhone: [
            { validator: checkMobile, trigger: 'blur' }
          ],
          code:[
            { required: true, message: '请输入验证码', trigger:'blur' },
            { min: 4, max: 6, message: '长度在4或6个字符', trigger:'blur' }
          ],
          userSex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              let subData = JSON.parse(JSON.stringify(this.registerList));
              subData.userPassword = this.$md5(subData.userPassword);
            FetchUserRegister(subData).then(json=>{
              if(json.returnCode===200){
                this.$message({message:"注册成功，2秒后自动登录",type:'success',duration:2000});
                FetchUserLogin({
                  userName:this.registerList.userPhone,
                  userPassword:subData.userPassword,
                  isSave:0,
                  terminal:4
                },false).then(json=>{
                  if(json.returnCode===200){
                    this.$store.state.userInfo = json.data;
                    this.$cookie('user_id',json.data.userId);
                    setTimeout(() => {
                      if(this.$route.query.redirect!==undefined && decodeURIComponent(decodeURIComponent(this.$route.query.redirect))!=='/login'){
                        this.$router.push({path:this.$route.query.redirect})
                      }else {
                        this.$router.push({path:'/index'})
                      }
                    },1000)
                  }else {
                    let count = 2;
                    this.$message("自动登录失败，2秒后返回重新登录");
                    let timer = setInterval(()=>{
                      count-= 0.2;
                      if(count<0){
                        clearInterval(timer);
                        let href = this.$route.query.redirect?'/login?redirect='+this.$route.query.redirect:'/login?redirect=/index';
                        this.$router.push(href)
                      }
                    },200);
                  }
                });
//
              }else {
                if(json.msg==='验证码错误'){
                  this.$message.error('验证码错误，请重新获取')
                }
              }
            });
          } else {
            this.$message('请检查所填信息是否正确！');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getCode(){
          if(this.registerList.userPhone===undefined || this.registerList.userPhone===''){
            this.$message("请先填写手机号！")
          }else {
            if((/^1[34578]\d{9}$/.test(this.registerList.userPhone))){
              FetchCheckName({
                userMob:this.registerList.userPhone,
                type:"RegisterPwd"
              },'phone').then(json=>{
                if(json.returnCode===200){
                  this.$message("发送成功");
                  this.btnTxt = '60秒后重新发送';
                  this.timer = setInterval(()=>{
                    this.limit-=1;
                    this.btnTxt = Math.ceil(this.limit) +'秒后重新发送';
                    sessionStorage.setItem('set_time_limit',this.limit);
                    if(this.limit<=0){
                      this.btnTxt = '点击发送';
                      sessionStorage.removeItem('set_time_limit');
                      this.limit = 60;
                      clearInterval(this.timer)
                    }
                  },1000);
                }
              })
            }
          }
      }
    },
    mounted(){
        const limit_time = sessionStorage.getItem('set_time_limit');
        if(limit_time){
            this.limit = limit_time;
            this.btnTxt = limit_time +'秒后重新发送';
            this.timer =  setInterval(()=>{
              this.limit-=1;
              this.btnTxt = Math.ceil(this.limit) +'秒后重新发送';
              sessionStorage.setItem('set_time_limit',this.limit);
              if(this.limit<=0){
                this.btnTxt = '点击发送';
                sessionStorage.removeItem('set_time_limit');
                this.limit = 60;
                clearInterval(this.timer)
              }
            },1000);
        }
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
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
  .register-ruleForm
    width :530px
    margin 0 auto
    .el-form-item
      margin-bottom :32px
    .el-form-item:last-child
      a
        box-shadow :none
        color #666
        span
          color: #f00
    input
      height: 48px!important
      padding :3px 28px
    .form-code input
      width :264px
    button.form-submit-btn
      width :100%
      height :48px
      border-radius :30px
      background-color :#f77583
    .form-code-btn
      float right
      height :48px
      width :145px
      background:#fcadb4
      color :#fff
      border-color: #fcadb4
      &.is-disabled
        background #efefef
        color #999
        border-color #c4c4c4
    .form-code-btn:hover
      border-color:#c4c4c4;
    .el-radio-group
      width :100%
      .el-col
        text-align :center
      .el-radio-button__inner
        padding:54px 20px 0
        border:none!important
        background-repeat no-repeat
        background-position center top
      .girl
        &:hover
        &.is-active
          .el-radio-button__inner
            background-image :url('./images/sex-girl.png')
      .boy
        &:hover
        &.is-active
          .el-radio-button__inner
            background-image :url('./images/sex-boy.png')
      .girl
        .el-radio-button__inner
          background-image :url('./images/sex-girl@1_01.png')
      .boy
        .el-radio-button__inner
          background-image :url('./images/sex-boy@1_01.png')
    .form-sex .el-form-item__error
        left :50%
        margin-left:-2.5em

</style>
