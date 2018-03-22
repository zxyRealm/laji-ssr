
<template>
    <div class="wrapper">
      <!--<img src="/static/img/web_top.png" width="600" height="400" v-crop:start="cropStart"/>-->
      <el-form :model="bookInfo" :rules="rules" ref="ruleForm" label-width="104px" class="indite-form">
        <el-form-item label="作品名称：" prop="bookName">
          <el-col class="line" :span="8">
            <el-input v-model="bookInfo.bookName" :disabled="$route.name==='EditBook'"></el-input>
          </el-col>
          <el-col class="line" :span="12">
            <i class="zdy-icon__star"></i>
            20字以内，不可有特殊符号
          </el-col>
        </el-form-item>
        <el-form-item label="封面：" prop="bookImage">
          <el-col class="line" :span="4">
            <div class="avatar-wrap addBook">
              <div class="book-cover-uploader">
                <img :src="bookInfo.bookImage" alt="">
                <label @click="updateCover">上传封面</label>
              </div>
            </div>
          </el-col>
          <el-col class="line" :span="12">
            <div class="tip">
              <p>1.上传书籍封面图片只能是 JPG、PNG 格式!</p>
              <p>2.上传书籍封面图片大小不能超过 1M</p>
            </div>
          </el-col>
        </el-form-item>

        <el-form-item label="作品分类：" prop="bookClassificationId">
          <el-col class="line" :span="5">
            <el-select  v-model="bookInfo.bookClassificationId" :disabled="$route.name==='EditBook'" placeholder="请选择活动区域">
              <template v-for="(item,$index) in classList">
                <el-option :selected="bookInfo.bookClassificationId===item.id" :value="String(item.id)" :label="'－'+item.classificationName+'－'" ></el-option>
              </template>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">
            <i class="zdy-icon__star"></i>
          </el-col>
        </el-form-item>

        <el-form-item label="作品标签：" class="label-form-item" prop="bookLabId">
          <el-col class="line" :span="11">
            <el-select
              :disabled="$route.name==='EditBook'"
              v-model.array="bookInfo.bookLabId"
              multiple style="width:100%"
              popper-class="label-list-dropdown"
              placeholder="请选取2～5个标签">
              <el-option
                v-for="item in bookLabelList"
                :style="'color:'+item.bookColor+';borderColor:'+item.bookColor"
                :key="item.id"
                :label="item.bookLableName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">
            <i class="zdy-icon__star"></i>
          </el-col>
        </el-form-item>
        <el-form-item label="发布状态：" prop="bookAuthorization">
          <el-col class="line" :span="6">
            <el-radio class="radio" type="number" :disabled="$route.name==='EditBook'" v-model="bookInfo.bookAuthorization" :label="0">网站首发</el-radio>
            <el-radio class="radio" type="number" :disabled="$route.name==='EditBook'" v-model="bookInfo.bookAuthorization" :label="3">授权发布</el-radio>
          </el-col>
          <el-col class="line" :span="1">
            <i class="zdy-icon__star"></i>
          </el-col>
        </el-form-item>
        <el-form-item label="连载状态：" v-if="$route.name==='EditBook'" prop="bookStatus">
          <el-col class="line" :span="6">
            <el-radio class="radio" type="number" v-model="bookInfo.bookStatus" :label="0">连载中</el-radio>
            <el-radio class="radio" type="number" v-model="bookInfo.bookStatus" :label="1">已完结</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="作品简介：" prop="bookIntroduction">
          <el-col class="line" :span="20">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入内容"
              v-model="bookInfo.bookIntroduction">
            </el-input>
            <p class="tip">请不要超过400字 <span class="fr">{{words}}/400</span></p>
          </el-col>
          <el-col class="line" :span="1">
            <i class="zdy-icon__star"></i>
          </el-col>
        </el-form-item>
        <el-form-item class="mt20"></el-form-item>
        <el-form-item labelWidth="0px" >
          <el-button
            class="edit-book-btn"
            type="primary"
            :disabled="active"
            @click.prevent="addNewBook('ruleForm')">确认提交</el-button>
        </el-form-item>
      </el-form>

      <pic-cropper
        ref="bookCoverUpdate"
        action="/sys-BookCoverAvatarimgUpload"
        :visible.sync="dialogTableVisible"
        :sync="true"
        @syncUrl="setCover"
        @close="closeIt"
        :maxWidth="600"
        :data="{ bookid:bookId }"
        url="/static/img/defaultcoverimg.jpg"
        :aspectRatio="3/4">
      </pic-cropper>
    </div>
</template>

<script type="text/ecmascript-6">
  import Cropper from '../common/img_upload.vue'
  import { FetchGetBookInfo,FetchAuthorHandleBook,FetchCheckName } from '../../api'
  export default{
    components:{
       'pic-cropper':Cropper
    },
    data(){
      let checkName = (rule, value, callback) => {
        let txt = this.$trim(value);
        if (txt.length<1) {
          return callback(new Error('作品名称不能为空'));
        }else{
//            添加新书时校验书籍名称是否存在
          if(this.$route.name==='addBook'){
            let reg = /^[a-zA-Z0-9\u4e00-\u9fa5:：]{1,20}$/;
            if(!reg.test(txt)){callback(new Error("书籍名称只能包含中文、数字、字母和冒号"));return false;}
            FetchCheckName({ bookName:this.bookInfo.bookName },'book').then(json=>{
              if(json.returnCode!==200){
                callback(new Error('作品名称已存在，请重新填写'))
              }else{
                callback()
              }
            })
          }else {
            callback()
          }
        }
      };
      let bookLabId = (rule, value, callback) => {
        if (value.length<1) {
          return callback(new Error('请选择作品标签'));
        }else{
          if( value.length>5 || value.length<2){
            callback(new Error('请选2~5个标签！'))
          }else{
            callback()
          }
        }
      };
      let bookIntro = (rule, value, callback) => {
        if(!value){
          callback(new Error("请填写作品简介"))
        }else {
          if(this.$regEmoji(value)){
            callback(new Error("不可包含emoji表情图"))
          }else {
            if(value.length>400){
              callback(new Error('总长度不可超过400个字符'))
            }else {
              callback()
            }
          }
        }
      };
      return {
        bookId:'',
        fullscreenLoading:false,
        dialogTableVisible:false,
        userInfo:{},
        active:false,
        Label:[],
        bookLabelList:[],
        classList:[],
        bookInfo:{
          writerName:this.$store.state.userInfo.pseudonym,
          bookName:'',
          bookStatus:0,
          bookIntroduction:'',
          bookLabId:[],
          bookClassificationId:'',
          bookAuthorization:null,
          bookImage:'http://bookcovers.oss-cn-hangzhou.aliyuncs.com/BookCover/defaultcoverimg.jpg'
        },
        rules: {
          bookName: [
            { required: true,validator: checkName, trigger: 'blur' },
            { min: 1,max:20, message: '长度最少为 2 个字符', trigger: 'blur' }
          ],
          bookClassificationId: [
            { required: true,type:'string', message: '请选择作品分类', trigger: 'change' }
          ],
          bookLabId: [
            { required: true, type:'array',validator:bookLabId, trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          bookIntroduction: [
            { required: true, validator:bookIntro , trigger: 'change' },
          ],
          bookAuthorization: [
            { required: true,type:'number', message: '请选择发布状态', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      addNewBook:function (formName) {
        this.$myLoad();
        this.$refs[formName].validate((valid) => {
          if(valid){
            let formData = JSON.parse(JSON.stringify(this.bookInfo));
            let type = this.$route.name === 'addBook'?'ab':'eb';
            delete formData.bookImage;
            delete formData.bookWriterId;
            formData.bookLabId = formData.bookLabId.toString();
            formData.bookName = this.$trim(formData.bookName);
            formData.writerName = this.$store.state.userInfo.pseudonym;
//            添加/修改书籍
              FetchAuthorHandleBook(formData,type).then(json=>{
                if(json.returnCode===200){
                  if(type==='ab'){
                    this.bookId = json.data;
                    this.$nextTick(()=>{
                      this.$refs.bookCoverUpdate.submitImageFile((res)=>{
                        this.$nextTick(()=>{
                          this.$loading().close()
                        });
                        if(res.returnCode===200){
                          this.$alert('书籍创建成功', '', {
                            confirmButtonText: '确  定',
                            customClass:'issue-alert',
                            lockScroll:false,
                            type:'success',
                            callback: action => {
                              if(action==='confirm'){
                                this.$router.push("/author/writing/addChapter/"+json.data);
                              }else {
                                this.$router.push("/author/writing/index")
                              }
                            }
                          });
                        }
                      });
                    })
                  }else {
                    this.$refs.bookCoverUpdate.submitImageFile((res)=>{
                      this.$nextTick(()=>{
                        this.$loading().close()
                      })
                      if(res.returnCode===200){
                        this.getLabel();
                        this.$message('编辑成功');
                      }
                    });
                  }
                }else {
                  this.$nextTick(()=>{
                    this.$loading().close()
                  })
                }
              });

          }else{
            this.$nextTick(()=>{
              this.$loading().close()
            });
            this.$message({message:"请检查输入信息是否完整！",type:'warning'});
          }
        });
      },
      getLabel() {
        FetchGetBookInfo('','label').then(json=>{
          const labelList = json.data.booklablesList;
          this.classList = json.data.classificationList;
          this.bookLabelList = labelList;
          if(this.$route.name==='EditBook'){
            FetchGetBookInfo(this.$route.params.bid,'book').then(json2=>{
              if(json2.returnCode===200){
                let arr = [];
                json2.data.bookLabId.split(",").map((item) => {
                  arr.push(parseInt(item))
                });
                json2.data.bookLabId = arr;
                this.bookInfo.bookLabId = json2.data.bookLabId;
                this.bookInfo.bookName = json2.data.bookName;
                this.bookInfo.bookImage = json2.data.bookImage;
                this.bookInfo.bookClassificationId = json2.data.bookClassificationId;
                this.bookInfo.bookAuthorization = json2.data.bookAuthorization;
                this.bookInfo.bookId = json2.data.bookId;
                this.bookInfo.bookIntroduction = json2.data.bookIntroduction;
              }
            })
          }
        });
//        this.$ajax('/book-EditBookEcho','',
//        json => {
//
//          if(this.$route.name==='EditBook'){
//            this.$ajax("/book-showBookInfo",{
//              bookid:this.$route.params.bid
//            },json2 => {
//
//            });
//          }
//        },'get');
      },

      setCover(url){
          this.bookInfo.bookImage = url
      },
      updateCover(e){
        this.dialogTableVisible = true
      },
      closeIt(){
         this.dialogTableVisible = false
      }
    },
    mounted(){
      this.$route.params.bid?this.bookId=this.$route.params.bid:'';
      this.getLabel();
    },
    computed:{
      "words"(){
        this.bookInfo.bookIntroduction = this.bookInfo.bookIntroduction.replace(/\n+/g,'\n\n');
        return this.$trim(this.bookInfo.bookIntroduction).length
      }
    },
    watch:{
      "$store.state.userInfo":function () {
        this.bookInfo.bookWriterId = this.$store.state.userInfo.userId;
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.el-form-item__content p.tip
  font-size :12px
  line-height :1
  margin-top :12px
.el-select .el-tag
  line-height 22px!important
  .el-tag__close
    &.el-icon-close
      height 20px
      width 20px
      line-height 20px!important
.el-select-dropdown
  &.label-list-dropdown
    .el-select-dropdown__list
      width 356px
      overflow :hidden
      padding:10px 12px
      li.el-select-dropdown__item
        float left
        width :50px
        margin :5px 8px
        height :24px
        padding :0
        text-align center
        border-radius :12px
        font-size :12px
        line-height 22px!important
        border:1px solid
        span
          line-height 22px!important
        &.selected
          background-color :#efefef!important
          border :none
          line-height :24px!important
          color :#333!important
          font-weight 500
          &::after
            content :''
.label-form-item .el-tag--primary
  background-color: #efefef;
  border-color: #d4d4d4;
  color: #333;
  .el-icon-close
    top:1px
.el-button.edit-book-btn
  display :block
  margin :0 auto
  width: 320px
  height :50px
  border-radius :25px
.indite-form
  background #fcfafb
  min-height :800px
  padding:50px 0
  border-radius :5px
  .author-fl-item
    display :list-item
    margin-bottom :26px
  .author-fl-item textarea
    border:1px solid #d4d4d4
    border-radius :5px
    padding :10px
    height :146px
    width :608px
    clear :left
    text-indent 0
  .au-fl-head
    float: left
    width :104px
    text-align :right
    line-height :38px
    padding-right :10px
    font-size :14px
  .au-fr-input
    overflow hidden
    label
      float: left
      margin-right :20px
      input
        display :inline-block
        vertical-align :-2px
    .tip
      margin-top: 15px;
      color: #666;
      line-height: 1em;
    .bookLabelBox
      float:left
      width: 360px
      .labelValue
        height: 38px
        border-radius: 5px
        border: 1px solid #d4d4d4
        background: #fff
        user-modify read-write
        -webkit-line-break: after-white-space
        white-space :nowrap
        line-height :36px
        width: 360px
        padding: 0 12px
        outline:none
        overflow :hidden
        .label-item
          display inline-block
          width :auto
          height :24px
          line-height:22px
          border 1px solid #d4d4d4
          background :#efefef
          border-radius :3px
          overflow :hidden
          text-align:center
          margin :6px 5px
          /*span:hover*/
          /*opacity :0.5*/
          span
            float right
            width :18px
            height :100%
            background :url("./images/add.png") no-repeat center center
            background-size :contain
            cursor :pointer
            opacity :0.6
          .label-context
            overflow hidden
            height :100%
            padding-left:6px
      &:empty::before
        content :attr(placehoder)
    .labelList
      overflow:hidden
      text-align :center
      padding :8px 14px
      border : 1px solid #efefef
      margin-top :15px
      border-radius :5px
      background :#fff
      ul
        width :100%
      .label-list-item
        display inline-block
        float left
        width :50px
        height :24px
        padding :0 6px
        line-height :24px
        border :1px solid #fb82b8
        border-radius: 14px
        margin :5px 8px
        cursor :pointer
      .label-selected
        border:none
        background :#f3f2f3
        color :#666!important
        cursor not-allowed
.avatar-wrap.addBook
  float :left
  position :relative
  width :100px
  height :126px
  overflow hidden
  border-radius :5px
  .book-cover-uploader
    position:relative
    width:100%
    height: 100%
    line-height 0
    >img
      width:100%
      height: 100%
    label
      position absolute
      display block
      bottom:0
      left 0
      height :30px
      width:100%
      line-height 28px
      background :rgba(0,0,0,0.4)
      color :#fff
      font-size: 12px
      cursor: pointer
      text-align center


.explain
  overflow :hidden
  padding-left:50px
.author-right .guide
  height :53px
  line-height :52px
</style>
