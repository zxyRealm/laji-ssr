<template>
    <div class="container modify-page-wrapper">
      <div class="modify-steps-wrap clear" v-if="$route.name==='modifyPage'">
        <div class="modify-steps-item" :class="{current:activeModule>=1}">
          <span class="steps">1</span>
          <span class="msg">手机号验证</span>
          <span class="line"></span>
        </div>
        <div class="modify-steps-item" :class="{current:activeModule>=2}">
          <span class="steps">2</span>
          <span class="msg">设置密码</span>
          <span class="line"></span>
        </div>
        <div class="modify-steps-item" :class="{current:activeModule>=3}">
          <span class="steps">3</span>
          <span class="msg">改密成功</span>
        </div>
      </div>

      <el-form v-if="activeModule===1" :model="modifyList" :rules="rules1" ref="ruleForm1"  class="modify-ruleForm">
        <el-form-item prop="phoneId">
          <el-input placeholder="输入手机号" :autofocus="true" v-model="modifyList.phoneId"></el-input>
        </el-form-item>
        <el-form-item  class="form-code" prop="code">
          <el-col :span="14">
            <el-input placeholder="验证码" v-model="modifyList.code"></el-input>
          </el-col>
          <el-col :span="10">
            <el-button :disabled="btnTxt!=='点击发送'" ref="getCodeBtn" @click="getCode" class="form-code-btn">{{btnTxt}}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="form-submit-btn" type="primary" @click="nextForm('ruleForm1')">下一步</el-button>
        </el-form-item>
        <el-form-item>
          <router-link  class="fr" to="/login?redirect=/index">返回登录 <i class="el-icon-arrow-right"></i></router-link>
        </el-form-item>
      </el-form>
      <el-form v-if="activeModule>=2" :model="modifyList" :rules="rules2" ref="ruleForm2" class="modify-ruleForm">
        <el-form-item  prop="oldPwd" v-if="$route.name==='modifyPage'">
          <el-input type="password" placeholder="原始密码" v-model="modifyList.oldPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  prop="newPwd">
          <el-input type="password" placeholder="输入新密码" v-model="modifyList.newPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  prop="checkPass">
        <el-input placeholder="再次输入新密码" type="password" v-model="modifyList.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="form-submit-btn" type="primary" @click="submitForm('ruleForm2')">完成</el-button>
        </el-form-item>
        <el-form-item>
          <router-link  class="fr" :to="$route.query.redirect?'/login?redirect='+$route.query.redirect:'/login?redirect=/index'">返回登录 <i class="el-icon-arrow-right"></i></router-link>
        </el-form-item>
      </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data() {
        let checkMobile = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'));
          }else {
            if (!(/^1[34578]\d{9}$/.test(value))){
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
            if (!/^[a-zA-Z0-9_]{5,17}$/.test(value)) {
              callback(new Error('正确格式为：长度在6-18之间，只能包含数字、字母和下划线。 '));
            }else {
              callback();
            }
          }
        };
        let validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.modifyList.newPwd) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          limit:60,
          timer:null,
          btnTxt:'点击发送',
          activeModule:1,
          modifyList:{
            oldPwd:'',
            newPwd:'',
            checkPass:'',
            phoneId:'',
            code:''
          },
          rules1: {
            phoneId: [
              { validator: checkMobile, trigger: 'blur' }
            ],
            code:[
              { required: true, message: '请输入验证码', trigger:'blur' },
              { min: 4, max: 6, message: '长度在4或6个字符', trigger:'blur' }
            ]
          },
          rules2: {
            oldPwd:[
              {require:true,message:'请输入原始密码',trigger:'blur'}
            ],
            newPwd: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ]
          }
        };
      },
      methods: {
        nextForm(formName){
          this.$refs[formName].validate((valid)=>{
              if(valid){
                  this.$ajax("/verification/person-checkedCode",{
                    checkCode:this.modifyList.code,
                    phoneId:this.modifyList.phoneId
                  },json=>{
                      if(json.returnCode===200){
                        this.activeModule = 2
                      }
                  });
              }else {
                  this.$message("请检查信息是否完整！")
              }
          })
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
//              直接修改密码
              let subData = JSON.parse(JSON.stringify(this.modifyList));
              subData.oldPwd = this.$md5(subData.oldPwd);
              subData.newPwd = this.$md5(subData.newPwd);
              subData.checkPass = this.$md5(subData.checkPass);
              if(this.$route.name==='modifyPage'){
                this.$ajax("/person-updatepwd",
                  subData,(json) => {
                    if(json.returnCode===200){
//                        直接修改密码
                      this.$alert('', '修改成功！您可以重新登录了', {
                        confirmButtonText: '是',
                        showCancelButton:true,
                        customClass:'confirm-msg-box',
                        cancelButtonText:'否',
                        callback: action => {
                          this.$exit('default');
                          let href = this.$route.query.redirect?'/login?redirect='+this.$route.query.redirect:'/login?redirect=/index';
                          this.$router.push(href)
                        }
                      });
                    }else {
                      if(json.msg==='验证码错误'){
                        this.$message.error('验证码错误，请重新获取');
                        this.activeModule = 1;
                      }
                    }
                  });
              }else {
//                忘记密码时修改密码
                this.$ajax("/person-pwdRetrieval",
                  subData,(json) => {
                    if(json.returnCode===200){
                      this.activeModule = 3;
//                        直接修改密码
                      this.$alert('', '修改成功！您可以重新登录了', {
                        confirmButtonText: '是',
                        showCancelButton:true,
                        customClass:'confirm-msg-box',
                        cancelButtonText:'否',
                        callback: action => {
                          this.$exit('default');
                          let href = this.$route.query.redirect?'/login?redirect='+this.$route.query.redirect:'/login?redirect=/index';
                          this.$router.push(href)
                        }
                      });
                    }else {
                      if(json.msg==='验证码错误'){
                        this.$message.error('验证码错误，请重新获取')
                      }
                    }
                  });

              }
            } else {
              this.$message({message:"请检查信息是否完整！",type:'warning'});
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        getCode(){
          if(this.modifyList.phoneId){
            if((/^1[34578]\d{9}$/.test(this.modifyList.phoneId))){
              this.$ajax("/verification/sys-getShortMessage",
                {
                  userMob:this.modifyList.phoneId,
                  type:"findPwd"
                },json=> {

                  if(json.returnCode===200){
                    this.btnTxt = '60秒后重新发送';
                    this.timer = setInterval(()=>{
                      this.limit-=1;
                      this.btnTxt = Math.ceil(this.limit) +'秒后重新发送';
                      sessionStorage.setItem('set_time_limit_back',this.limit);
                      if(this.limit<=0){
                        this.btnTxt = '点击发送';
                        sessionStorage.removeItem('set_time_limit_back');
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
        if(this.$route.name==='modifyPage'){
          this.$set(this.rules2,"oldPwd",[{require:true,message:'请输入原始密码',trigger:'blur'}])
        }
        const limit_time = sessionStorage.getItem('set_time_limit_back');
        if(limit_time){
          this.limit = limit_time;
          this.btnTxt = limit_time +'秒后重新发送';
          this.timer = setInterval(()=>{
            this.limit-=1;
            this.btnTxt = Math.ceil(this.limit) +'秒后重新发送';
            sessionStorage.setItem('set_time_limit_back',this.limit);
            if(this.limit<=0){
              this.btnTxt = '点击发送';
              sessionStorage.removeItem('set_time_limit_back');
              this.limit = 60;
              clearInterval(this.timer)
            }
          },1000);
        }

      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.modify-page-wrapper
  padding-top: 72px
  .modify-steps-wrap
    width:528px
    margin:50px auto
    .modify-steps-item
      float:left
      margin-right :10px
      user-select none
      >span
        display inline-block
        vertical-align middle
        &.steps
          width 38px
          height 38px
          line-height 28px
          text-align center
          border :5px solid #d8d8d8
          font-size: 18px
          font-weight 600
          color:#d8d8d8
          background:#fafafa
          border-radius 50%
        &.msg
          margin 0 15px
          font-size: 14px
        &.line
          height:0
          border-top:1px solid #d7d7d7
          width 44px
    .modify-steps-item.current
      >span
        &.steps
          color:#73b3fd
          border-color:#75b3fe
        &.msg
          color:#7bb7ff
    .modify-steps-item:last-child
      margin-right:0
      >span
        &.msg
          margin-right 0
        &.line
          display none
  .modify-ruleForm
    width :530px
    margin 0 auto
    .el-form-item
      margin-bottom :32px
    .el-form-item:last-child
      a
        box-shadow :none
        color #999
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
      background:#f77583
      color :#fff
      border-color transparent
      &.is-disabled
        background #efefef
        border-color #c4c4c4
        color #999
        &:hover
          background #efefef
      &:hover
        background rgba(247,117,131,0.8)
    .el-radio-group
      width :100%
      .el-col
        text-align :center
      .el-radio-button__inner
        padding:54px 20px 0
        border:none!important
        background :url('./images/sex-girl.png') no-repeat center top
      .boy .el-radio-button__inner
        background :url('./images/sex-boy.png') no-repeat center top
    .form-sex .el-form-item__error
      left :50%
      margin-left:-2.5em
</style>
