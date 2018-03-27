<template>
    <div class="container charge-wrapper" v-wechat-title="$route.meta.title">

      <div class="breadcrumb-wrap">
        <div class="fl">当前位置：</div>
        <el-breadcrumb  separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>充值中心</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="charge-userinfo-wrapper clear">
        <div class="user-avatar">
          <img :src="$store.state.userInfo.userHeadPortraitURL" :alt="$store.state.userInfo.pseudonym">
          <i v-if="$store.state.userInfo.vipGrade" class="zdy-icon__user_vip"></i>
        </div>
        <div class="user-info v-middle">
          <p>
            <span class="v-item">昵称：{{$store.state.userInfo.pseudonym}}</span>
            <i :class="$store.state.userInfo.userSex?'girl':null" class="zdy-icon__sex v-item"></i>
            <zdy-icon__user_level :grade="$store.state.userInfo.userGrade"></zdy-icon__user_level>
          </p>
          <p>账号：{{$store.state.userInfo.userName}}</p>
          <p>账号余额：{{$store.state.userInfo.userMoney}}</p>
        </div>
      </div>
      <div class="charge-form-wrapper">
        <el-form class="chargeForm" :rules="rule" :model="chargeForm" ref="chargeFormRef">
          <el-form-item prop="type">
            <div class="title">
              支付方式
            </div>
            <div class="radio-group">
              <label for="alipay" :class="{current:chargeForm.type=='alipay'}">
                <input type="radio" name="payWay" value="alipay" id="alipay"  v-model="chargeForm.type">
              </label>
              <label for="weixin" :class="{current:chargeForm.type=='weixin'}">
                <input type="radio" name="payWay" value="weixin" id="weixin" v-model="chargeForm.type" >
              </label>
            </div>
          </el-form-item>

          <el-form-item prop="number">
            <div class="font16">
              选择金额
            </div>
            <el-radio-group v-model="chargeForm.number" class="charge-number">
              <el-radio label="6">600辣椒（6元）</el-radio>
              <el-radio label="12">1200辣椒（12元）</el-radio>
              <el-radio label="30">3000辣椒（30元）<br><font color="red">赠送150辣椒券</font></el-radio>
              <el-radio label="50">5000辣椒（50元）<br><font color="red">赠送300辣椒券</font></el-radio>
              <el-radio label="98">9800辣椒（98元）<br><font color="red">赠送800辣椒券</font></el-radio>
              <el-radio label="198">19800辣椒（198元）<br><font color="red">赠送1800辣椒券</font></el-radio>
            </el-radio-group>
            <p class="warmTip">充值每满20元赠送1金椒</p>
          </el-form-item>
          <el-form-item class="lastOne">
            <button type="button" class="btn sub" @click="submitForm('chargeFormRef')">
              下一步
            </button>
          </el-form-item>
        </el-form>
      </div>
      <div class="charge-shade-wrap" v-if="isWeiXin">
        <div class="charge-shade-content">
          <div class="qrcode-wrap">
            <canvas id="WxpayCanvas" width="260" height="260"></canvas>
            <img src="../../../static/img/wxpay_intro@1_01.png" class="intro-box" alt="">
          </div>

          <p class="charge-tip" v-if="tipInfo"><i class="el-icon-check charge-tip-icon"></i>{{tipInfo}}</p>
          <div class="handle">
            <button @click="payBack">重新支付</button>
            <button class="complete" @click="payBack('suc')">支付成功</button>
          </div>
        </div>
      </div>

      <el-dialog
        title=""
        :close-on-click-modal="false"
        class="pay-confirm-box"
        :visible.sync="dialogVisible"
        width="460px">
        <div class="pay-confirm-main">
          <div class="pc-count">
            充值：{{chargeForm.number}}元
          </div>
          <div class="pc-tip">
            请您在新打开的页面完成支付！
          </div>
          <div class="pc-des">
            支付完成前请不要关闭此窗口，<br>
            支付完成后，请根据结果选择。
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <a class="pay-btn" :href="alipayHref" target="_blank" @click="payTo">去支付</a>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import QRcode from 'qrcode'
import { FetchWebPay } from '../../api'
export default{

    data(){
        return {
            dialogVisible:false,
            chargeForm:{
                type:'alipay',
                number:'30'
            },
            rule:{
                type:[
                  {require:true,message:'请选取支付方式',trigger:'blur'}
                ],
                number:[
                  {require:true,message:'请选取充值金额',trigger:'blur'}
                ]
            },
            isWeiXin:false,
            tipInfo:'',
            alipayHref:''
        }
    },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
            this.$myLoad();
            FetchWebPay(this.chargeForm.type,this.$store.state.userInfo.pseudonym,this.chargeForm.number).then(json=>{
                this.$nextTick(()=>{
                    this.$loading().close();
                    if(json.returnCode===200){
                        if(this.chargeForm.type==='weixin'){
                            this.isWeiXin = true;
                            setTimeout(()=>{
                                let canvas = document.getElementById('WxpayCanvas');
                                QRcode.toCanvas(canvas,json.data.code_url,{
                                    errorCorrectionLevel:'H',
                                    scale:16,
                                    height:300,
                                    width:300
                                },function(err) {
                                    console.log(err)
                                });
                            },200);
                        }else {
                            this.alipayHref = json.data;
                            this.dialogVisible = true;
                        }
                    }
                });
            });
        }
      })
    },
    payBack(type){
       this.isWeiXin = false;
       if(type==='suc'){
           this.$freshen();
           this.$router.push({path:'/user/index'})
       }
    },
    payTo(){
      this.dialogVisible = false;
      this.$confirm('如果支付完成后，刷新页面辣椒无变化请联系网站下客服QQ','支付确认提示', {
          confirmButtonText: '支付完成',
          cancelButtonText: '重新支付',
          closeOnClickModal:false,
          type: 'info'
        }).then(() => {
          this.payBack('suc')
        }).catch(() => {
          this.$freshen()
        });
    }
  },
  watch:{
    'isWeiXin':function () {
      if(this.isWeiXin){
        document.body.style.paddingLeft = '17px';
        document.body.style.overflow = 'hidden';
      }else {
        document.body.style.paddingLeft = null;
        document.body.style.overflow = null;
      }
    }
  }
}

</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

.pay-confirm-box
  .el-dialog
    margin-top -124px
    width 400px!important
    margin-bottom 0
    .el-dialog__body
        padding 10px 20px 20px
        text-align center
      .pc-count
        font-size 20px
        line-height 50px
      .pc-tip
        font-size 17px
    .el-dialog__footer
        border-top 1px solid #ddd
        text-align center
        font-size 20px
        padding 20px 0
        .pay-btn
            padding 5px 55px
            border 1px solid #f77583
            background #f77583
            border-radius 5px
            color #fff
            line-height 40px
            &:hover
              color #fff!important
.charge-wrapper.container
  min-height 1024px
  .alipay-link
    position absolute
    left 99999
  .breadcrumb-wrap
    height: 46px
    line-height: 46px
    font-size 14px
    margin 10px 0
    padding:0 20px
    .el-breadcrumb
      overflow hidden
      height :46px
      line-height :46px
  .charge-userinfo-wrapper
    padding:4px 20px 30px
    border-bottom :1px solid #ddd
    .user-avatar
      position relative
      float left
      width :88px
      height 60px
      >img
        width :60px
        height 60px
        border-radius :50%
        border:1px solid #d4d4d4
    .user-info
      overflow:hidden
      height :60px
      padding:20px
      font-size:18px
      >p
        float :left;
        margin-right :114px
      >p:last-child
        margin-right :0
.charge-form-wrapper
  .chargeForm
    .el-form-item
      padding-left:20px
      .warmTip
        color #5e9ce5
    .el-form-item.lastOne
      text-align center
      padding-left 0
      border-top:1px solid #c6c6c6
      padding-top:34px
      button.default
        width :250px
        height 50px
        line-height 50px
        border-radius 25px
        background-color #f77482
        color :#fff
    .title
      font-size :18px
      line-height :60px
    .radio-group
        input[name=payWay]
          display none
        label
          display inline-block
          width 170px
          height:72px
          border-radius 7px
          box-shadow 0 1px 15px
          &[for=weixin]
            background url('weixin@1_01.png') no-repeat center center
          &[for=alipay]
            margin-right 46px
            background url('alipay@1_01.png') no-repeat center center
          &.current
            border :2px solid #ff8383
    .el-radio-group
      &.charge-number
        .el-radio__label
          font-size 16px
      >.el-radio
        width 25%
        padding :36px 0
        margin-left 0
        .el-radio__label
          position relative
          padding-left 26px
          display inline-block
          >font
            position absolute
            width calc(100% - 26px)
            line-height 2
.charge-shade-wrap
  position fixed
  left 0
  top 0
  width 100%
  height 100%
  background #333
  display table
  z-index 999
  .charge-shade-content
    position absolute
    left 50%
    top 40%
    width 320px
    padding 0 15px
    margin-top -225px
    margin-left -160px
    background #fff
    .handle
      overflow hidden
      padding 15px
      >button
        float left
        padding 10px 30px
        border-radius 5px
        border 1px solid #ccc
        &:hover
          background #ebebeb
        &.complete
          float right
          border-color #f77583
          background #f77583
          color #fff
          &:hover
            background #ed5565
    .qrcode-wrap
      width 100%
      /*height 260px*/

      >canvas
        width calc(100% - 1px)!important
        height 100%!important

     .intro-box
      display block
      height 86px
      margin 0 auto
    .charge-tip
      padding 0 10px
      font-size 16px
      line-height 22px
      color #fff
      margin 5px 0
      text-align center
    .charge-tip-icon
      /*float left*/
      font-size 12px
      width 22px
      height 22px
      line-height 25px
      text-align center
      border-radius 50%
      background #fff
      color #0f0
      margin-right  15px
</style>
