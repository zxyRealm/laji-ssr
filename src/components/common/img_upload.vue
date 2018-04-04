<template>
    <div class="picture-cropper-mode" v-if="visible">
      <div class="picture-cropper-wrap">
        <div class="pc-inner-header">
          <span class="pc-header-title">{{title}}</span>
          <i class="el-icon-close" @click="cancel"></i>
        </div>
        <div class="pc-wrap-inner clear">
          <div class="wrap-container">
            <div class="pic-wrapper">
              <img
                ref="pre-picture"
                :src="img_url"
                id="pre-picture"
                alt="">
            </div>
          </div>
          <div class="pc-wrap-inner-right" :style="{ width:(width+20) + 'px' }">
            <div id="preview-pane" :style="{ height:width/aspectRatio + 'px',width:width + 'px' }">
              <div class="preview-container" :style="{ height:width/aspectRatio + 'px',width:width + 'px' }">
                <img :src="img_url" class="jcrop-preview" alt="Preview" />
              </div>
            </div>
            <div class="tip-msg">
              <p>
                <span class="red">提示：</span>请勿使用360兼容模式以及ie10以下版本，可能导致无法使用剪裁上传功能
              </p>
            </div>
          </div>

        </div>
        <div class="pc-handle-wrap">

          <form id="picture-form" action="" enctype="multipart/form-data">
            <label for="inputImage" class="btn-check-file">
              <input class="btn-file" name="file" @change="changeImg" type="file" id="inputImage">
              <span>选取图片</span>
            </label>
          </form>
          <!--<button class="el-button el-button&#45;&#45;primary" @click="setCanvas(canvasOption)">剪切</button>-->
          <button class="el-button el-button--primary" @click="subForm">{{sync?'确定':'上传'}}</button>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery';
  import '../../assets/js/jquery.Jcrop.min'
  import '../../assets/css/jquery.Jcrop.min.css'
  export default{
    name:'cropper',
    props:{
      action:{
          default:''
      },
      aspectRatio:{
          default: 1/1
      },
      width:{
          default:200
      },
      url:{
          default:''
      },
      maxSize:{
          default:2
      },
      acceptType:{
          default:'jpeg,jpg,png'
      },
      data:{

      },
      sync:{
          default:false
      },
      maxWidth:{
        default:600
      },
      title:{
          default:'图片上传'
      },
      visible: {
        default: false
      }
    },
    data(){
      return {
        img_url:this.url,
        jcrop_api:'',
        boundx:'',
        boundy:'',
        widget:[0,0],
        $preview:undefined,
        $pcnt:undefined,
        $pimg:undefined,
        canvasOption:{},
        icon_url:'',
        pre_width:0,
        zoom:1,
        ready:false
      }
    },
    methods:{
      testMaxSize(file){
          let self = this;
          let image = new Image();
          if(file.files && file.files[0]){
           let fileData = file.files[0];
           let size = fileData.size;   //注意，这里读到的是字节数
           let reader = new FileReader();
           reader.onload = function (e) {
             let data = e.target.result;
             //加载图片获取图片真实宽度和高度

             image.src= data;
             image.onload = function(){
                 self.boundy = image.height;
                 self.boundx = image.width;
                 if(image.width>5000||image.height>5000){
                    $("#inputImage").val('');
                    self.$message({message:"图片尺寸太大，请重新选择！",type:"warning"});
                    return false
                 }
                 if(!size){
                    self.$message({message:'请选取图片',type:'warning'})
                 } else if(self.maxSize<size/(1024*1024)) {
                   self.$message({message:"所选图片不可超过"+self.maxSize+'M',type:'warning'});
                   $("#inputImage").val('');
                 } else if(self.acceptType.indexOf(file.files[0].type.split('/')[1].toLowerCase())<0){
                   self.$message({message:'只能上传'+self.acceptType+'格式图片',type:'warning'});
                   $("#inputImage").val('');
                 } else {
                     self.jcrop_api.setImage(data,function () {
                         self.widget = this.getWidgetSize();
                          this.setSelect([0,0,300,300]);
                         $("#pre-picture").parent().css({
                           position:'absolute',
                           width: self.widget[0]+'px',
                           marginLeft:'-' + self.widget[0]/2+'px',
                           marginTop:'-' + self.widget[1]/2+'px'
                         });
                     });
                     self.img_url = data;
                     self.resetCrop();
                 }
             };
             image.onerror = function(e){
                self.$message({message:'非法图片格式，请重新选择',type:'error'});
                $("#inputImage").val('');
                return false
             }

           };
           reader.readAsDataURL(fileData);
         }else{
            this.isIE()
         }
      },
      subForm(){
        if(this.setCanvas(this.canvasOption)){
            this.syncUrl(this.icon_url);
            if(this.sync){
              this.cancel();
              return false;
            }else {
              this.submitImageFile()
            }
        }else {
           this.$message({message:'无法剪裁，请更换浏览器重新尝试！',type:'warning'})
        }
      },
      submitImageFile(callback){
//          console.log(this.canvasOption);
          if(this.icon_url!=='error'){
            if(this.icon_url===''){
                return callback({returnCode:200})
            }
            var formData = new FormData();   //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数
            //convertBase64UrlToBlob函数是将base64编码转换为Blob
            //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同
            var blob = this.dataURLtoBlob(this.icon_url);
            formData.append('file',blob,'avatar-image.png');
            for(let k in this.data){
                formData.append(k,this.data[k])
            }
            if(!this.sync){
              this.$myLoad('正在上传中...')
            }
            //ajax 提交form
            $.ajax({
              url : this.action,
              type : "POST",
              data : formData,
              dataType:"text",
              xhrFields: {withCredentials: true},
              crossDomain: true,
              processData : false,         // 告诉jQuery不要去处理发送的数据
              contentType : false,        // 告诉jQuery不要去设置Content-Type请求头
              success:(data)=>{
                if(!this.sync){
                  this.cancel();
                  this.$nextTick(()=>{
                    this.$loading().close()
                  })
                  this.$message(JSON.parse(data).msg);
                  this.$freshen();
                }else {
                  callback(JSON.parse(data));
                }
              },
              error:()=>{
                this.$nextTick(()=>{
                  this.$loading().close()
                })
              },
              xhr:function(){            //在jquery函数中直接使用ajax的XMLHttpRequest对象
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt){
                  if (evt.lengthComputable) {
                  }
                }, false);
                return xhr;
              }

            });
          }else {
              this.$message({message:'无法获取剪切数据，请重新尝试！',type:'warning'})
          }
      },
      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr], {type:mime,filename:'image.png'});
        return blob;
      },
      resetCrop(){
        let self = this;
        this.$preview = $('#preview-pane');
        this.$pimg = $('#preview-pane .preview-container img');
        $('#pre-picture').Jcrop({
          bgFade: true,
//        allowSelect:false,
          boxHeight:400,
          boxWidth:400,
          onChange: this.updatePreview,
          onSelect: this.updatePreview,
          aspectRatio: this.aspectRatio
        }, function() {
          self.jcrop_api = this;
          // Use the API to get the real image size
          var bounds = this.getBounds();
          self.widget = this.getWidgetSize();
          self.boundx = bounds[0];
          self.boundy = bounds[1];
          this.setSelect([0,0,300,200]);
          $("#pre-picture").parent().css({
            position:'absolute',
            width: self.widget[0]+'px',
            marginLeft:'-' + self.widget[0]/2+'px',
            marginTop:'-' + self.widget[1]/2+'px'
          });
          // Store the API in the jcrop_api variable

        });
      },
      setCanvas(op){
        let image_target = $('#preview-pane .preview-container img')[0];
//        获取原图尺寸大小，计算当前图形缩放比例
        let _img = document.createElement('img'),z=1;
        _img.src = image_target.src;
//        _img.setAttribute('crossOrigin', 'anonymous');
        let crop_canvas = document.createElement('canvas');
        this.zoom = _img.width/this.boundx;
        if(op.w*this.zoom>this.maxWidth){
          z = this.maxWidth/(op.w*this.zoom)
        }
        crop_canvas.width = op.w*this.zoom*z;
        crop_canvas.height = op.h*this.zoom*z;
        try {
          crop_canvas.getContext('2d').drawImage(
            image_target,
            op.x*this.zoom,
            op.y*this.zoom,
            op.w*this.zoom,
            op.h*this.zoom,
            0,
            0,
            op.w*this.zoom*z,
            op.h*this.zoom*z
          );
          this.icon_url = crop_canvas.toDataURL();
        }catch (err){
          return this.icon_url = 'error'
        }
        return this.icon_url;
      },
      changeImg(e){
        this.testMaxSize(e.target);
      },
      updatePreview(c) {
        if (parseInt(c.w) > 0) {
          var rx = this.width / c.w;
          var ry = (this.width/this.aspectRatio) / c.h;
          this.canvasOption = c;
          this.$pimg.css({
            width: Math.round(rx * this.boundx) + 'px',
            height: Math.round(ry * this.boundy) + 'px',
            marginLeft: '-' + Math.round(rx * c.x) + 'px',
            marginTop: '-' + Math.round(ry * c.y) + 'px'
          });

        }
      },
      isIE() {
        /*... ie9下用iframe上传*/
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
//      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        if (isIE) {
          let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
          let fIEVersion = parseFloat(RegExp["$1"]);
          if (fIEVersion !== 10) {
            this.$message({message: '您的计算机当前ie版本过低，无法使用图片上传，请您更换浏览器重新尝试！', type: 'warning'});
            return false;
          }
        }
      },

      cancel(){
        this.$emit('close',true)
      },
      syncUrl(url){
         this.$emit('syncUrl',url)
      }
    },
    watch:{
      visible:function (val) {
        if(val){
            this.$nextTick(()=>{
              this.resetCrop()
            })
        }
      }
    },
  }

</script>
<style lang="stylus" rel="stylesheet/stylus">
.picture-cropper-mode
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 1990
  background rgba(0,0,0,0.6)
  text-align center
  &:after
    content ''
    height 100%
    width 0
    display inline-block
    vertical-align middle
.picture-cropper-wrap
  display inline-block
  vertical-align middle
  background #fff
  padding 20px 30px
  text-align left
  .pc-inner-header
    line-height 20px
    .pc-header-title
      font-size 18px
    .el-icon-close
      float right
      cursor pointer
      &:hover
        color #ff4d51
  .btn-check-file
    display inline-block
    line-height 1
    padding 12px 15px
    border-radius 5px
    background #00ffff
    cursor pointer
    font-size 16px
    color #fff
    border 1px solid #00ffff
    margin-right 15px
    :hover
      border-color #00f1f1
      background #00f1f1
  input[type='file']
    display inline-block
    height 1px
    width 1px
    overflow hidden
    margin-top -1px
  #picture-form
    display inline-block
.pc-handle-wrap
    height 40px
    line-height 40px
    padding 30px 0 15px
    border-top 1px solid #ddd
    box-sizing content-box
    text-align right

.docs-preview
    .img-preview
        overflow hidden
.pc-wrap-inner
  padding 30px 0
  overflow hidden
  .pc-wrap-inner-right
    overflow hidden
    padding-left 20px
    box-sizing content-box
    .tip-msg
      margin 15px 0
      font-size 14px
      .red
        color #ff4d51
.wrap-container
  position relative
  float left
  width 400px
  height 400px
  line-height 400px
  background #ddd
  text-align center
  .pic-wrapper
    /*position absolute*/
    top 50%
    left 50%
    display block
    vertical-align middle
    max-width 100%
    max-height 400px
    overflow hidden
    margin 0 auto

  #pre-picture
    max-height 400px!important
    max-width 100%!important
    height auto!important
    width auto!important

 #preview-pane {
    display: block;
    /*position: absolute;*/
    z-index: 2000;
    top: 10px;
    right: -280px;
    padding: 6px;
    border: 1px rgba(0,0,0,.4) solid;
    background-color: white;
    border-radius: 6px;
    box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.2);
    box-sizing content-box
}

/* The Javascript code will set the aspect ratio of the crop
   area based on the size of the thumbnail preview,
   specified here */
#preview-pane .preview-container {
  overflow: hidden;
}

</style>
