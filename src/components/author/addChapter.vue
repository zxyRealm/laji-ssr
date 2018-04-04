<template>
    <div class="wrapper">
      <div class="breadcrumb-wrap">
        <div class="fl">当前位置：</div>
        <div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/author/writing">作者中心</el-breadcrumb-item>
            <el-breadcrumb-item to="/author/writing">创建管理</el-breadcrumb-item>
              <el-breadcrumb-item>
                <template v-if="$route.name=='addChapter'">
                  新增章节
                </template>
                <template v-else="">
                  编辑章节
                </template>
              </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="writing-subNav">
        <ul>
            <li><router-link :to="{name:'ChapterList'}">章节列表</router-link></li>
            <li><router-link :to="{name:'addChapter'}">新增章节</router-link></li>
            <li><router-link :to="{name:'DraftList'}">草稿箱</router-link></li>
        </ul>
      </div>

      <div class="form-wrapper">
        <el-form :model="ruleForm" :rules="rules" ref="ChapterForm" :label-width="labelWidth" labelPosition="left" class="chapter-ruleForm">
          <el-form-item label="书籍名称" prop="bookTitle">
            <el-input style="width: 260px" readonly v-model="ruleForm.bookTitle"></el-input>
          </el-form-item>
          <el-form-item label="分卷名称" prop="volumeId">
            <el-select style="width: 260px;" v-model="ruleForm.volumeId" placeholder="请选择分卷">
              <template>
                <el-option
                  v-for="item in volumeList"
                  :key="item.id"
                  :label="item.volumeName"
                  :value="item.id">
                </el-option>
                <el-option @click.native="dialogFormVisible = true" label="" value="">+新增分卷</el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="章节名称" prop="chapterTitle">
            <el-input style="width: 260px" v-model="ruleForm.chapterTitle"></el-input>
          </el-form-item>
          <el-form-item label="章节内容" class="contentBox" prop="chapterContent">
            <el-input class="context" type="textarea" :rows="15" style="width:686px"  v-model="ruleForm.chapterContent"></el-input>
            <el-form-item prop="authorWords">
              <div class="author-say-wrap">
                <el-input class="author-say" type="textarea" v-model="ruleForm.authorWords" placeholder="作者的话（不可超过100字）"></el-input>
              <span class="say-word">{{ruleForm.authorWords?ruleForm.authorWords.length:0}}/100</span>
              </div>
            </el-form-item>
            <span class="words">共 {{length}} 字</span>
          </el-form-item>

          <el-form-item :label-width="labelWidth" label="发布时间" style="margin-top:50px" prop="releaseTime">
            <el-col :span="12">
                <el-date-picker type="datetime" :disabled="!isAutoPublish" placeholder="选择时间" v-model="ruleForm.releaseTime"></el-date-picker>
              <el-checkbox  class="ml20" label="定时发布" @change="ruleForm.releaseTime=isAutoPublish?ruleForm.releaseTime:''" v-model="isAutoPublish"></el-checkbox>
            </el-col>
            <el-col :span="12">
              <!--<el-checkbox v-model="ruleForm.whetherPublic">加入草稿箱</el-checkbox>-->
            </el-col>
          </el-form-item>
          <el-form-item :label-width="labelWidth" label="是否VIP" prop="chapterIsvip">
            <el-radio class="radio" v-model="ruleForm.chapterIsvip" :label="0">普通</el-radio>
            <el-radio class="radio" v-if="isVip===2" v-model="ruleForm.chapterIsvip" :label="1">VIP</el-radio>
          </el-form-item>
          <el-form-item :label-width="labelWidth" style="width: 820px" class="tc">
            <el-button
              class="fl"
              type="primary"
              @click="submitForm('create')">
              立即创建
            </el-button>
            <el-button
              class="fr save-draft"
              @click="submitForm('draft')">
              保存草稿
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-dialog width="420px" @open="volumeForm.volumeName=''" top="35%" title="新增分卷" :visible.sync="dialogFormVisible">
        <el-form @submit.native.prevent :model="volumeForm" :rules="rule" ref="volumeForm" label-position="left">
          <el-form-item label="分卷名称" prop="volumeName" :label-width="'80px'">
            <el-input v-model="volumeForm.volumeName" auto-complete="off" placeholder="最多20个字符"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewVolume('volumeForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
import { FetchGetBookInfo,FetchAuthorHandleBook ,FetchNetTime,FetchCheckName } from '../../api'
  export default {
    data() {
      let validateContent = (rule,value,callback) =>{
         if(this.ruleForm.chapterLength){
             this.ruleForm.chapterContent = this.ruleForm.chapterContent.replace(/^\s*\n+\s*/,'').replace(/\s*\n+\s*/g,'\n\n　　');
             if(this.ruleForm.chapterLength>20000){
                 this.isPending = false;
                 this.$message({message:'总长度不可超过20000个字符',type:'warning'});
             }else {
                 if(this.$regEmoji(value)){
                    this.$message({ message:'不可包含emoji表情图',type:'warning' })
                 }else {
                    callback()
                 }
             }
         }else {
             callback(new Error(' '));
         }
      };
      let validateVolume = (rule,value,callback) => {
          value = this.$trim(value);
          if(!value||value.length<1){
            this.volumeForm.volumeName = '';
            callback(new Error("卷名不能为空"))
          }else {
            if(value.length>20){
              callback(new Error("总长度不可超过20个字符"))
            }else {
                FetchCheckName({
                  volumeName:value,
                  bookid:this.ruleForm.bookId
                },'volume').then(json=>{
                  if (json.returnCode===200) {
                    callback()
                  } else {
                    callback(new Error(json.msg))
                  }
                })
            }
          }
       };
      let validateCheckCn = (rule,value,callback) => {
          value = this.$trim(value);
          if(!value||this.$trim(value).length<1){
              this.ruleForm.chapterTitle = '';
              callback(new Error('请输入章节名称'))
          }else{
            if(value.length>20){
                callback(new Error('章节名长度不可超过20字符'));
                return false
            }
            FetchCheckName({
              chapterName:value,
              bookId:this.$route.params.bid
            },'chapter').then(json=>{
              if(json.returnCode===200){
                callback()
              }else{
                callback(new Error('章节名重复，请重新填写！'))
              }
            })
          }
      };
      let validateAuthorSay = (rule,value,callback) =>{
        if(value){
          if(this.$regEmoji(value)){
            callback(new Error("不可包含emoji表情图"))
          }else if(value.length>100) {
            callback(new Error('总字数不可超过100字符'))
          }else {
              callback()
          }
        }else {
          callback(new Error("请添加作者的话"));
        }
      };
      return {
        isPending:false, //避免网络不良时造成重复提交
        dialogSize:'tiny',
        volumeList:[],
        isAutoPublish:false,
        labelWidth:'136px',
        dialogFormVisible:false,
        isVip:0,
        volumeForm:{
          volumeName:''
        },
        ruleForm: {
          bookTitle: '',
          chapterTitle:'',
          volumeId: null,
          releaseTime: '',
          chapterContent: '',
          whetherPublic:0,
          chapterLength:0,
          chapterIsvip:0,
          authorWords:''
        },
        rule:{
          volumeName: [
            { required: true,validator:validateVolume , trigger: 'blur' }
          ]
        },
        rules: {
          chapterTitle: [
            { required: true,validator:validateCheckCn , trigger: 'blur' }
          ],
          volumeId: [
            { required: true,type:'number', message: '请选择分卷', trigger: 'change' }
          ],
          bookTitle: [
            { required: true, message: '请输入书籍名称', trigger: 'blur' }
          ],
          chapterContent: [
            { required: true,validator:validateContent,trigger:'blur' }
          ],
          authorWords: [
            { required: true,validator:validateAuthorSay ,trigger:'change' }
          ]
        }
      };
    },
    methods: {
//        添加新章节
      submitForm(type) {
        this.$myLoad(type==='create'?'拼命创建中...':'拼命保存中...')
        this.$refs['ChapterForm'].validate((valid) => {
          if (valid) {
             if(type==='draft'){
                this.ruleForm.whetherPublic = 1;
                this.createChapter()
             }else if(this.ruleForm.chapterIsvip){
               this.$nextTick(()=>{
                 this.$loading().close()
               });
               this.$alert('确认设置为收费章节？', '', {
                 confirmButtonText: '确  定',
                 customClass:'issue-alert',
                 lockScroll:false,
                 type:'success',
                 callback: action => {
                   if(action==='confirm'){
                     this.isPending = true;
                     this.createChapter()
                   }
                 }
               });
             }else {
                this.createChapter()
             }
          } else {
            this.$nextTick(()=>{
              this.$loading().close()
            });
            this.$message({message:"请完善必填信息！",type:'warning'});
            return false;
          }
        });
      },
      createChapter(){
          //          首先获取网络时间
          let cloneData = JSON.parse(JSON.stringify(this.ruleForm));
              cloneData.chapterContent = this.$trim(cloneData.chapterContent).replace(/\n+\s+/g,'<H><LG>')+"<H><LG>";
          FetchNetTime().then(time=>{
               if(time.returnCode===200){
                   if(cloneData.releaseTime){
                     cloneData.releaseTime = this.$formTime(cloneData.releaseTime,"long")
                   }else {
                     cloneData.releaseTime = this.$formTime(time.data.beijing,'long')
                   }
                   FetchAuthorHandleBook(cloneData,'ac').then(json=>{
                       this.$nextTick(()=>{
                         this.$loading().close()
                       });
                       if(json.returnCode===200){
                         this.$alert(cloneData.whetherPublic===1?"保存草稿成功":'发布成功', '', {
                           confirmButtonText: '确  定',
                           customClass:'issue-alert',
                           lockScroll:false,
                           type:'success',
                           callback: action => {
                             if(cloneData.whetherPublic===1){
                               this.$router.push({name:'DraftList'})
                             }else {
                               this.$router.push({name:'ChapterList'})
                             }
                           }
                         });

                       }else {
                         this.$message({message:json.msg,type:'error'})
                       }
                   });
               }else {
                   this.$nextTick(()=>{
                     this.$loading().close()
                   })
               }
          });


      },
//      新增分卷
      addNewVolume(formName){
        this.$refs[formName].validate((valid) => {
           if(valid){
               FetchAuthorHandleBook({
                 volumeName:this.volumeForm.volumeName,
                 bookName:this.ruleForm.bookTitle,
                 bookid:this.$route.params.bid
               },'av').then(json=>{
                 if (json.returnCode === 200) {
                   this.dialogFormVisible = false;
                   this.$message("添加成功");
                   this.getChapterInfo()
                 }
               })
           }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
//      章节信息回显
      getChapterInfo(){
        FetchGetBookInfo(this.$route.params.bid,'book').then(json=>{
          if(json.returnCode===200){
            this.ruleForm.bookTitle = json.data.bookName;
            this.ruleForm.bookId = json.data.bookId;
            this.isVip = json.data.bookCheckStatus;
            this.ruleForm.chapterIsvip = this.isVip===2?1:0;
            FetchGetBookInfo(this.$route.params.bid,'volume').then(json2=>{
              if(json2.returnCode===200 && json2.data.length){
                this.volumeList = json2.data.reverse();
                this.ruleForm.volumeId = this.volumeList[0].id
              }
            });
          }
        });
      },
    },
    watch:{
      "ruleForm.chapterContent":function (val) {
        if(this.$regEmoji(val)){
          this.$message({message:"不可包含emoji表情图",type:'warning'})
        }
        this.ruleForm.chapterContent = val.replace(/^\s*\n+\s*/,'').replace(/\s*\n+\s*/g,'\n\n　　');
      },
      "ruleForm.authorWords":function (val) {
        if (this.$trim(val).length > 100) {
          val = val.substr(0,100);
        }
        this.ruleForm.authorWords = val.replace(/^\s*\n+\s*/,'').replace(/\s*\n+\s*/g,'\n\n　　');
      }
    },
    computed:{
        'length':function () {
          let  sLen = 0;
          let str = this.ruleForm.chapterContent;
          try{
            //先将回车换行符做特殊处理
            str = str.replace(/(\r\n+|\s+| )+/g,"龘");
            //处理英文字符数字，连续字母、数字、英文符号视为一个单词
//            str = str.replace(/[\x00-\xff]/g,"m");
            //合并字符m，连续字母、数字、英文符号视为一个单词
//            str = str.replace(/m+/g,"*");
            //去掉回车换行符
            str = str.replace(/龘+/g,"");
            //返回字数
            sLen += str.length;
          }catch(e){

          }
          this.ruleForm.chapterLength = sLen;
          if(sLen>20000){
            this.$message({message:"字数长度不可超过20000！",type:'error'})
          }
          return sLen
        }
    },
    mounted(){
      let windowWidth = document.body.clientWidth;
      if(windowWidth<1020){
        this.dialogSize = 'small'
      }else{
        this.dialogSize = 'tiny'
      }
      this.getChapterInfo();
        window.onresize = () => {
            let width = document.body.clientWidth;
            if(width<1020){
                this.dialogSize = 'small'
            }else {
                this.dialogSize = 'tiny'
            }
        }
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

.el-dialog__body
  .el-form-item
    margin-bottom 0

.chapter-ruleForm
  .el-form-item
    &:last-child
      .el-form-item__content
        margin-left :136px
        button
          width :250px
          height :54px
          border-radius :40px
        .save-draft
          color:rgb(255,156,35)
          border:1px solid rgb(255,156,35)
    span.words
      position absolute
      right 20px
      bottom:-24px
      margin-right: 50px
      font-size 14px
      line-height 1
</style>
