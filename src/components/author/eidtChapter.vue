<template>
  <div class="wrapper">
    <div class="breadcrumb-wrap">
      <div class="fl">当前位置：</div>
      <div>
        <el-breadcrumb  separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/author">作者中心</el-breadcrumb-item>
          <el-breadcrumb-item to="/author/writing">创建管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑章节</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="writing-subNav">
      <ul>
        <li><router-link :to="{name:'editChapter'}">编辑章节</router-link></li>
        <li><router-link :to="'/author/writing/chapterList/'+ruleForm.bookId">章节列表</router-link></li>
        <li><router-link :to="'/author/writing/addChapter/'+ruleForm.bookId">新增章节</router-link></li>
        <li><router-link :to="'/author/writing/draft/'+ruleForm.bookId">草稿箱</router-link></li>
      </ul>
    </div>

    <div class="form-wrapper">
      <el-form :model="ruleForm" :rules="rules" ref="editChapterForm" :label-width="labelWidth" labelPosition="left" class="chapter-ruleForm">
        <el-form-item label="书籍名称" prop="bookTitle">
          <el-input style="width: 260px" readonly v-model="ruleForm.bookTitle"></el-input>
        </el-form-item>
        <el-form-item label="分卷名称" prop="volumeId">
          <el-select style="width: 260px;" v-model="ruleForm.volumeId" placeholder="请选择分卷" @change="changeVolume">
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
          <el-input v-show="ruleForm.whetherPublic==1" type="textarea" class="context" v-model="ruleForm.chapterContent"></el-input>
          <div v-show="ruleForm.whetherPublic!=1" class="iframe-wrap">
            <div id="content_edit_sole" unselectable="on" @keydown.native="preventCopy" v-if="reLoad" :contenteditable="true" @input="editChange" >
              <template v-for="(item,$index) in initial">
                <p :uuid="item.uuid">
                 {{item.content}}
                </p>
              </template>
            </div>
          </div>
          <el-form-item prop="authorWords">
            <div class="author-say-wrap">
              <el-input class="author-say" type="textarea" v-model="ruleForm.authorWords" placeholder="作者的话（不超过100字）"></el-input>
              <span class="say-word">{{ruleForm.authorWords?ruleForm.authorWords.length:0}}/100</span>
            </div>
          </el-form-item>
          <span class="words">共 {{length}} 字</span>
        </el-form-item>

        <el-form-item :label-width="labelWidth" label="发布时间" style="margin-top:50px" prop="releaseTime">
          <el-col :span="8">
            <el-date-picker
              type="datetime"
              :disabled="isChange"
              placeholder="选择时间"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              v-model="ruleForm.releaseTime">
            </el-date-picker>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="ruleForm.whetherPublic" :label-width="'0px'" prop="issue">
              <el-checkbox v-model="ruleForm.issue">立即发布</el-checkbox>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="是否VIP">
          <el-radio class="radio" v-if="!ruleForm.chapterIsvip">普通</el-radio>
          <el-radio class="radio" v-else >VIP</el-radio>
        </el-form-item>

        <el-form-item :label-width="labelWidth" style="width: 820px" class="tc">
          <el-button
            type="primary"
            @click="submitForm('create')">
            确认提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog width="420px" @open="volumeForm.volumeName=''" top="35%" title="新增分卷" :visible.sync="dialogFormVisible">
      <el-form @submit.native.prevent :model="volumeForm" :rules="rule" ref="volumeForm" label-position="left">
        <el-form-item label="分卷名称" prop="volumeName" :label-width="'80px'">
          <el-input v-model="volumeForm.volumeName" auto-complete="off"></el-input>
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
  import { FetchCheckName,FetchGetBookInfo,FetchAuthorHandleBook,FetchNetTime } from '../../api'
  export default {
    data() {
      let validateContent = (rule,value,callback) =>{
        if(this.ruleForm.chapterLength){
          if(this.ruleForm.chapterLength>20000){
            this.isLoading = false;
            this.$message({message:'总长度不可超过20000个字符',type:'warning'});
          }else {
            if(this.$regEmoji(value)){
              this.$message({ message:'不可包含emoji表情图',type:'warning' })
            }else {
              callback()
            }
          }
        }else {
          callback(new Error(" "));
        }
      };
      let validateAuthorSay = (rule,value,callback) =>{
        if(value){
          if(this.$regEmoji(value)){
            callback(new Error("不可包含emoji表情图"))
          }else {
            callback()
          }
        }else {
          callback(new Error("请添加作者的话"));
        }
      };
      let validateVolume = (rule,value,callback) => {
          if(!value||this.$trim(value).length<1){
              this.volumeForm.volumeName = '';
              callback(new Error("卷名不能为空"))
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
              });
          }
      };
      let validateCheckCn = (rule,value,callback) => {
        value = this.$trim(value);
        if(!value||this.$trim(value).length<1){
          this.ruleForm.chapterTitle = '';
          callback(new Error('请输入章节名称'))
        }else{
          if(this.$trim(value)===this.oldChapterName){
            callback()
          }else {
            if(value.length>20){
                callback(new Error('章节名长度不可超过20字符'));
                return false
            }
            FetchCheckName({
                chapterName:value,
                bookId:this.ruleForm.bookId
            },'chapter').then(json=>{
                if(json.returnCode===200){
                  callback()
                }else{
                  this.$message('章节名重复，请重新填写！');
                  callback(new Error('章节名重复，请重新填写！'));
                }
            });
          }
        }
      };
      return {
        isLoading:false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        reLoad:true,
        iframeShow:'hidden',
        dialogSize:'tiny',
        original:{}, //原始数据
        volumeList:[], //书籍卷列表
        isAutoPublish:false,
        labelWidth:'136px',
        dialogFormVisible:false,
        editContent:'',
        initial:[],
        cidList:[], //章节段ID列表
        volumeForm:{
          volumeName:''
        },
        oldChapterName:'',
        ruleForm: {  //章节信息
          bookTitle: '',
          chapterTitle:'',
          volumeId: null,
          releaseTime: null,
          chapterContent: '',
          whetherPublic:0,
          chapterLength:0,
          chapterIsvip:0,
          authorWords:'',
          issue:false,
          update:false
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
            { required: true, validator: validateContent, trigger: 'change' }
          ],
          releaseTime: [
            { required: true, type:'date', message: '请选取时间', trigger: 'blur' }
          ],
          authorWords: [
            { required: true,validator:validateAuthorSay ,trigger: 'change' }
          ]
        }
      };
    },
    methods: {
//        添加新章节
      submitForm(type) {
        this.$myLoad();
        this.$refs['editChapterForm'].validate((valid) => {
          if (valid) {
            if(type==='draft'){
              this.ruleForm.whetherPublic = 1
            }
            this.editChapter()
          } else {
            this.$nextTick(()=>{
              this.$loading().close()
            })
//            this.isLoading = false;
            this.$message({message:'请完善信息后提交！',type:'warning',duration:0});
            return false;
          }
        });
      },
      editChapter(){
//          首先获取网络时间
        if(this.ruleForm.chapterLength>20000){
          this.$nextTick(()=>{
            this.$loading().close()
          });
//          this.isLoading = false;
          this.$confirm('文章内容超出字数长度限制，请保证字数长度在20000以内！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          return false;
        }
        let cloneData = JSON.parse(JSON.stringify(this.ruleForm));
        let release = () =>{
          FetchAuthorHandleBook(cloneData,'ec').then(json=>{
            this.$nextTick(()=>{
              this.$loading().close()
            });
            if(json.returnCode===200){
              this.$alert(!cloneData.whetherPublic?"编辑成功":(cloneData.whetherPublic===1?'保存草稿成功':'草稿发布成功'), '', {
                confirmButtonText: '确  定',
                customClass:'issue-alert',
                lockScroll:false,
                type:'success',
                callback: action => {
                  window.scrollTo(0,0);
                  this.getChapterInfo()
                }
              });
            }
          });
        };

        if(this.ruleForm.whetherPublic===1){
//        发布草稿
          cloneData.chapterContent = this.$trim(cloneData.chapterContent).replace(/\n+\s+/g,'<H><LG>')+"<H><LG>";
          cloneData.whetherPublic = cloneData.issue?2:1;
        }else {
//        非草稿
          let nodeList = document.getElementById('content_edit_sole').childNodes;
          cloneData.chapterContent = '';
          for(let i=0,len=nodeList.length;i<len;i++){
            if(this.$trim(nodeList[i].innerText).length>0){
              cloneData.chapterContent += this.$trim(nodeList[i].innerText)+nodeList[i].getAttribute('uuid')
            }
          }
        }
        cloneData.releaseTime = this.$formTime(cloneData.releaseTime,"long");
        release()
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
                if(json.returnCode === 200) {
                  this.dialogFormVisible = false;
                  this.$message("添加成功");
                  this.getChapterInfo()
                }
              });
          }else {
            this.$message({message:'请填写卷名！',type:'warning'})
          }
        });
      },
//      章节信息回显
      getChapterInfo()
      {
        let reg1 = /<LG>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}<\/?LG ?\/?>/;
        let reg2 = /<LG>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}<\/?LG ?\/?>/g;
        FetchNetTime().then(time=>{
           if(time.returnCode===200){
             let count = 0;
             setInterval(()=>{
               count++;
               this.$set(this.original,'nowTime',time.data.beijing+count*1000);
             },1000);
             FetchGetBookInfo(this.$route.params.cid,'chapter').then(json=>{
               this.update = false;
               if(json.returnCode===200){
                 this.reLoad = false;
                 this.original = JSON.parse(JSON.stringify(json.data));
                 this.initial = [];
                 delete json.data.createChapterTime;
                 json.data.releaseTime =  new Date(json.data.releaseTime);
                 this.oldChapterName = json.data.chapterTitle;
                 if(json.data.whetherPublic===1){
                   json.data.chapterContent = json.data.chapterContent.replace(/<H><LG>/g,'\n\n  ');
                 }else {
                   let idList = json.data.chapterContent.match(reg2);
                   let txtList = json.data.chapterContent.split(reg1);
                   json.data.chapterContent = json.data.chapterContent.replace(reg2,'\n');
                   idList.forEach((item,index)=>{
                     this.initial.push({
                       uuid:item,
                       content:this.$trim(txtList[index])
                     })
                   });
                 }
                 this.ruleForm = json.data;
                 this.getVolume();
                 setTimeout(()=>{
                   this.reLoad = true;
                 },100)
               }
             })
           }
        });
      },
      //      获取分卷列表
      getVolume(){
        FetchGetBookInfo(this.ruleForm.bookId,'volume').then(json=>{
          if(json.returnCode===200){
            if(json.data < 1){
                FetchGetBookInfo(this.$route.params.bid,'book').then(json2=>{
                    if(json2.returnCode===200){
                      this.ruleForm.bookTitle = json2.data.bookName;
                      this.ruleForm.bookId = json2.data.bookId;
                    }
                });
            }else {
              this.volumeList = json.data;
              this.ruleForm.bookTitle = json.data[0].bookName;
              this.ruleForm.bookId = json.data[0].bookid;
            }
            this.update = true
          }
        });
      },
      editChange(e){
        let parents = document.getElementById('content_edit_sole');
        let pList = parents.childNodes;
        this.ruleForm.chapterContent = this.$trim(parents.innerText).replace(/(&nbsp;)/g,'');
        if(pList.length>0){
          for(let i=0,len=pList.length;i<len;i++){
//            重置样式,防止粘贴复制带来过来的内联样式
            pList[i].style = null;
            pList[i].innerText = this.$trim(pList[i].innerText)
            if(this.$trim(pList[i].innerText).length){
                if(!pList[i].getAttribute("uuid")){
                    pList[i].setAttribute("uuid","<X><XG>")
                }else {
                    if(i>0 && pList[i].getAttribute("uuid").length > 7 && pList[(i-1)].getAttribute('uuid')===pList[i].getAttribute("uuid")){
                      pList[i].setAttribute("uuid","<X><XG>")
                    }
                }
              if(pList[i].childNodes.length>1){
                pList[i].innerHTML = this.$trim(pList[i].innerText).replace(/(&nbsp;)/g,'');
              }
            }else {
                pList[i].setAttribute('uuid','<X><XG>');
            }
          }
        }
        if(e.target.innerHTML.length<1){
//        保证父元素中至少存在一个p标签，以此确保换行后新增的标签为p
          let p = document.createElement('p');
          p.innerHTML='<br>';
          p.style = null;
          parents.insertBefore(p,parents.childNodes[0])
        }
      },
      changeVolume(val){
        if(this.volumeList.length && val && this.update){
          this.$confirm('确认调整本章分卷?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              FetchAuthorHandleBook({
                chapterid:this.ruleForm.id,
                volumeid:val,
                bookid:this.ruleForm.bookId,
              },'cv').then(json=>{
                if(json.returnCode===200){
                  this.$message({
                    type: 'success',
                    message: '调整成功!'
                  });
                }
              });
          }).catch(() => {
            this.$message({message: '已取消调整'});
            this.getChapterInfo()
          });
        }
      },
      preventCopy(e){
        if(e.keyCode===17 && e.keyCode===72){
          e.returnValue = false;
          return false
        }
      }
    },
    mounted (){
      let windowWidth = document.body.clientWidth;
      if(windowWidth<1024){
        this.dialogSize = 'small'
      }else{
        this.dialogSize = 'tiny'
      }
      this.getChapterInfo();
    },
    watch:{
      "ruleForm.chapterContent":function (val) {
        if(this.ruleForm.whetherPublic===1){
          this.ruleForm.chapterContent = val.replace(/^\s*\n+\s*/,'').replace(/\s*\n+\s*/g,'\n\n　　');
        }
      },
      "ruleForm.authorWords":function (val) {
        if (this.$trim(val).length > 100) {
          val = val.substr(0,100);
        }
        this.ruleForm.authorWords = val.replace(/^\s*\n+\s*/, '').replace(/\s*\n+\s*/g, '\n\n　　');
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
//          str = str.replace(/[\x00-\xff]/g,"m");
          //合并字符m，连续字母、数字、英文符号视为一个单词
//          str = str.replace(/m+/g,"*");
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
      },
      'isChange':function () {
        let state = false;
        if(this.original && !this.original.whetherPublic){
            if(this.original.releaseTime && this.original.releaseTime > this.original.nowTime){
                state = false
            }else {
                state = true
            }
        }
        return state
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
  .el-form-item__content
    position relative
    .el-textarea
      position relative
      textarea
        resize none
        line-height :1.8
        padding :15px
        text-indent 2em
    span.words
      position absolute
      right 20px
      bottom:-24px
      margin-right: 50px
      font-size 14px
      line-height 1
.iframe-wrap
  position relative
  width 686px
  height 602px
  border 1px solid #ddd
  overflow hidden
  #content_edit_sole
    width 100%
    height 100%
    outline none
    padding 15px
    user-select none
    /*-webkit-user-modify: read-write-plaintext-only*/
    overflow auto
    >p
      text-indent 2em
      padding-bottom 1em
      font-size 16px
      user-select none
</style>
