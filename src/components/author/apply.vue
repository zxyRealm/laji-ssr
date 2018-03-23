<template>
    <div class="wrapper" id="authorApply">
       <div class="handle-btn">
         <button class="author-apply btn">申请作者</button>
       </div>
       <div class="schedule">
         <div class="schedule-inner">
           <ul class="clear">
             <li :class="active>=1?'disable':''" @click="getBack($event,'1')"><span>1</span>基础信息<span class="arrow"></span></li>
             <li :class="active>=2?'disable':''" @click="getBack($event,'2')"><span>2</span>详细信息<span class="arrow"></span></li>
             <li :class="active>=3?'disable':''"><span>3</span>申请成功</li>
           </ul>
         </div>
       </div>
       <div class="apply-form-wrap">
          <el-form v-show="active==1"  :model="applyInfo" :rules="rules" ref="applyForm1" label-width="104px">
            <el-form-item label="笔　　名：" prop="pseudonym">
              <el-col class="line" :span="8">
                <el-input v-model="applyInfo.pseudonym" :disabled="$route.name==='EditBook'"></el-input>
              </el-col>
              <el-col class="line" :span="1">
                <img class="ml10 mt10" src="./images/star2.png" alt="必填">
              </el-col>
              <p class="tip">笔名全站唯一，且只允许修改一次</p>
            </el-form-item>
            <el-form-item label="姓　　名：" prop="realName">
              <el-col class="line" :span="8">
                <el-input v-model="applyInfo.realName=='暂无信息'?'':applyInfo.realName" :disabled="$route.name==='EditBook'"></el-input>
              </el-col>
              <el-col class="line" :span="1">
                <img class="ml10 mt10" src="./images/star2.png" alt="必填">
              </el-col>
              <p class="tip">涉及稿酬结算，务必填写真实姓名</p>
            </el-form-item>
            <el-form-item label="手机号码：" prop="userPhone">
              <el-col class="line" :span="8">
                <el-input v-model="applyInfo.userPhone" readonly placeholder="请输入手机号" :disabled="$route.name==='EditBook'"></el-input>
              </el-col>
              <el-col class="line" :span="1">
                <img class="ml10 mt10" src="./images/star2.png" alt="必填">
              </el-col>
              <!--<p class="tip">涉及稿酬结算，务必填写真实姓名</p>-->
            </el-form-item>
            <el-form-item label="QQ 号码：" prop="userQQ">
              <el-col class="line" :span="8">
                <el-input v-model="applyInfo.userQQ" :disabled="$route.name==='EditBook'"></el-input>
              </el-col>
              <el-col class="line" :span="1">
                <img class="ml10 mt10" src="./images/star2.png" alt="必填">
              </el-col>
            </el-form-item>
            <el-form-item label="微信号码：" prop="userWeChat">
              <el-col class="line" :span="8">
                <el-input v-model="applyInfo.userWeChat" :disabled="$route.name==='EditBook'"></el-input>
              </el-col>
            </el-form-item>

            <el-form-item>
              <button class="submit-btn" @click.prevent="applyNext">下一步</button>
            </el-form-item>
          </el-form>

          <el-form v-show="active>=2" :model="applyInfo" :rules="rules" label-width="104px" ref="applyForm2">

            <el-form-item label="身份证号："  prop="userIdentityCard">
              <el-col class="line" :span="8">
                <el-input v-model="applyInfo.userIdentityCard" placeholder="请输入身份证号" :disabled="$route.name==='EditBook'"></el-input>
              </el-col>
              <el-col class="line" :span="1">
                <img class="ml10 mt10" src="./images/star2.png" alt="必填">
              </el-col>
            </el-form-item>

            <el-form-item label="出生日期：" prop="userBorndate">
              <el-col class="line" :span="8">
                <el-date-picker
                  format="yyyy-MM-dd"
                  v-model="applyInfo.userBorndate"
                  type="date"
                  :picker-options="pickerOptions0"
                  placeholder="选择日期范围">
                </el-date-picker>

              </el-col>
              <el-col class="line" :span="1">
                <img class="ml10 mt10" src="./images/star2.png" alt="必填">
              </el-col>
            </el-form-item>

            <el-form-item label="邮　　箱：" prop="userEmail">
              <el-col class="line" :span="8">
                <el-input v-model="applyInfo.userEmail" :disabled="$route.name==='EditBook'"></el-input>
              </el-col>
              <el-col class="line" :span="1">
                <img class="ml10 mt10" src="./images/star2.png" alt="必填">
              </el-col>
              <p class="tip">请确认邮箱地址可用，方便问题申诉！</p>
            </el-form-item>
            <el-form-item label="选取地址：" prop="userAddress">
              <area-cascader :level="1" type="text"  placeholder="请选取地址" v-model="address"></area-cascader>
              <el-col :span="8" class="mt20">
                <el-input
                  type="textarea"
                  placeholder="请输入详细地址"
                  v-model="detail">
                </el-input>
              </el-col>
              <el-col class="line mt20" :span="1">
                <i class="zdy-icon__star"></i>
              </el-col>
              <p class="tip">请填写真实地址，以免寄送物品无法收取</p>
            </el-form-item>

            <el-form-item label="个性签名：" prop="userAutograph">
              <el-col class="line autograph-warp" :span="8">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="applyInfo.userAutograph">
                </el-input>
                <span class="counts">{{applyInfo.userAutograph.length}}/20</span>
              </el-col>
              <p class="tip">展示自己的个性，让更多的人来关注你吧！</p>
            </el-form-item>
            <el-form-item>
              <button
                class="submit-btn"
                element-loading-text="拼命提交中..."
                v-loading.fullscreen.lock="subLoad"
                @click.prevent="apply">申请
              </button>
            </el-form-item>
          </el-form>
       </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import areaLinkage from 'vue-area-linkage'
//  Vue.use(areaLinkage);
  import { aycn } from '../../api'
  import Common from '../../assets/js/common'
    export default({
      data() {
//          验证身份证号
        let validateID = (rule,value,callback) => {
             if(!value){
                 callback(new Error('请填写身份证号码'));
             }else{
                 if(!Common.IdCodeValid(value).pass){
                     callback(new Error(Common.IdCodeValid(value).msg));
                 }else {
                     callback();
                 }
             }
          };

//        验证作者笔名是否合法
        let validatePseudonym = (rule,value,callback) => {
          if(this.$trim(value)){
            if(/^[\u4e00-\u9fa5A-Za-z\s]{2,20}$/.test(value)){
              callback()
            }else {
              callback(new Error('至少2个字符，只能包含汉字、字母、空格'))
            }
          }else {
            callback(new Error('请填写笔名！'));
          }

        };

//        验证作者真实姓名是否合法
        let validateRealName = (rule,value,callback) => {
          if(this.$trim(value)){
              if(/^[\u4e00-\u9fa5]{2,20}$/.test(value)){
                  callback()
              }else {
                 callback(new Error('至少2个字符，且只包含汉字！'))
              }
          }else {
            callback(new Error('请填写您的真实姓名'));
          }

        };

//        验证邮箱地址
        let validateEmail = (rule,value,callback) => {
            if(!value){
              callback(new Error('请填写邮箱地址'));
            }else {
              if(!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value))){
                callback(new Error('请输入合法的邮箱地址'));
              }else{
                  callback()
              }
            }
          };

//        验证手机号
        let validateMobile = (rule,value,callback) => {
          if(!value){
            callback(new Error('请填写您的手机号'));
          }else {
            if (!(/^1[34578]\d{9}$/.test(value))){
              callback(new Error('请输入合法的手机号码'));
            } else {
              callback();
            }
          }
        };

        let validateQQ = (rule,value,callback) => {
          if(!value){
            callback(new Error('请填写您的QQ号'));
          }else {
            if (!(/[1-9]\d{4,14}/.test(value))){
              callback(new Error('请输入合法的QQ号码'));
            } else {
              callback();
            }
          }
        };
        let validateAutograph = (rule,value,callback) => {
          if(value.length<=20){
            if(this.$regEmoji(value)){
              callback(new Error("不可包含emoji表情图"))
            }else {
              callback()
            }
          }else {
            callback(new Error("长度不可超过20个字符"))
          }
        };

        return {
            address:[],
            detail:'',
            pickerOptions0:{
                disabledDate(time){
                  return time.getTime() > Date.now()
                }
            },
            active:1,
            applyInfo:{
              pseudonym:'',
              realName:'',
              userPhone:'',
              userQQ:'',
              userWeChat:'',
              userIdentityCard:'',
              userBorndate:'',
              userEmail:'',
              userAddress:'',
              userAutograph:''
            },
            rules:{
              pseudonym: [
                { required: true,validator: validatePseudonym,trigger: 'blur' }
              ],
              realName: [
                { required: true,validator: validateRealName, trigger: 'blur' }
              ],
              userPhone: [
                { required: true,validator: validateMobile, trigger: 'blur' }
              ],
              userQQ: [
                { required: true,validator:validateQQ, trigger: 'blur' }
              ],
              userIdentityCard: [
                { required: true, validator: validateID, trigger: 'blur' }
              ],
              userBorndate: [
                { required: true, type:'date', message: '请选择出生日期', trigger: 'blur' }
              ],
              userEmail: [
                { required: true,validator: validateEmail, trigger: 'blur' }
              ],
              userAddress: [
                { required: true, message: '请选取完整地址，并填写街区或门牌号', trigger: 'blur' }
              ],
              userAutograph: [
                {validator: validateAutograph, trigger: 'change' }
              ]
            },
            subLoad:false
          }
      },
      methods:{
        applyNext(){
          this.$refs['applyForm1'].validate((valid) => {
            if (valid) {
              this.active++
            } else {
               this.$message('请完善个人信息！');
              return false;
            }
          })
        },
        getBack(event,index){
          if(event.target.getAttribute("class")==='disable'){
            this.active = index;
          }
        },
        apply(){

          this.subLoad = true;
          this.$refs['applyForm2'].validate((valid) => {
            if (valid) {
              let data = JSON.parse(JSON.stringify(this.applyInfo));
              data.userBorndate = Common.formatTime(data.userBorndate);
              aycn('/person-applicantAuthor',data).then(json=>{
                this.subLoad = false;
                if(json.returnCode===200){
                  this.active++;
                  this.$alert('', '申请成功！您可以去创建新书了', {
                    confirmButtonText: '是',
                    showCancelButton:true,
                    customClass:'confirm-msg-box',
                    cancelButtonText:'否',
                    callback: (action) => {
                      this.$router.push('/author/writing/index');
                      this.$freshen()
                    }
                  });
                }
              });
            } else {
              this.subLoad = false;
              this.$message({message:"请完善个人信息！",type:'warning'});
              return false;
            }
          });
        },
        getInfo(){
            aycn('/person-info').then(json=>{
              if(json.returnCode===200){
                this.applyInfo.pseudonym = json.data.pseudonym;
                this.applyInfo.userPhone = json.data.userPhone;
                this.applyInfo.userAddress = '';
              }else if(json.returnCode===400){
                this.$router.push('/login');
                this.$cookie("user_id",'',-1);
              }
            })
        },

      },
      mounted(){
        this.getInfo();
      },
      watch:{
          address:function () {
            this.detail = '';
          },
          detail:function (val) {
              if(this.$trim(val).length && this.address[2]){
                this.applyInfo.userAddress = this.address[0]+this.address[1]+this.address[2]+this.detail
              }
          }
      }
    })
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
 Bcolor = #f77583
 btn-color = #f77583

.area-select
    .el-select
      margin-left 0!important
      margin-right 10px
      &:nth-child(2)
          width 130px!important
 .schedule
    background:#fcfafb
    height :82px
    padding :14px 0
    border :1px solid #f7e9f0
    border-radius :5px
    font-size :16px
    text-align center
    .el-steps
      .el-step__head
        height :54px
        width :54px
        line-height :54px
        background :#fff
        color :#f00
        border :1px solid #ff8383
        .el-step__icon
          height :100%
          line-height :54px
        .el-step__line.is-horizontal
          top: 25px
          left :54px
    ul
      display :inline-block
    li.disable
      opacity :1
      cursor pointer
    li
      /*display :inline-block*/
      float :left
      height :54px
      color :#fb5e6f
      opacity :0.5
      cursor not-allowed
      span
        display :inline-block
        width :54px
        height :54px
        text-align :center
        line-height :54px
        border-radius :50%
        border:1px solid Bcolor
        margin-right :20px
      .arrow
        width :40px
        height :40px
        margin :7px 20px
        border-radius :0
        border :none
        background :#ffb6be
        line-height :0
        background :url('./images/back-icon1.png') no-repeat left center
        background-size :cover
        float :right
 .apply-form-wrap
    border:1px solid #f7e9f0
    border-radius :5px
    margin:30px 0
    background :#fcfafb
    padding-top :22px
    min-height :700px

.apply-form-wrap
  textarea
    resize none
  .el-form-item
    margin-bottom :30px
    &:last-child
      margin-top: 80px
    .getCode
      float left
      margin :0 15px
      background :btn-color
      width :100px
      height :38px
      color :#fff
      border-radius :5px
    .submit-btn
      display :block
      width :250px
      background :btn-color
      height :50px
      border-radius :25px
      color :#fff
      font-size: 16px
      margin :0 auto
    .el-form-item__content
      line-height :36px
      .tip
        clear: both
        line-height :2
        font-size :12px
      .el-date-editor
        width :100%
    &.is-required
      content :''
  .el-form-item__label:before
    content :''
  .autograph-warp
    position relative
    .counts
        position absolute
        line-height 1
        bottom 5px
        left 216px
        color #666
        font-size 14px
.el-year-table td.current .cell:hover
.el-month-table td.current .cell:hover
  color #fff!important
</style>
