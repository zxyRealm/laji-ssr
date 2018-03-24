<template>
    <div class="author-message-wrap" style="background-color: #fff">
      <div class="author-message-nav bsw">
        <router-link :to="{name:'messageBcom'}">书评</router-link>
        <router-link :to="{name:'messageCcom'}">吐槽</router-link>
        <router-link :to="{name:'messageHarvest'}">收获辣椒</router-link>
      </div>
      <div class="author-message-main">
        <template v-if="$route.name==='messageBcom'">
          <div class="colation">
            <el-select class="book_title" v-model="currentBid" placeholder="请选择书籍">
              <el-option
                v-for="item in bookList"
                :key="item.bookId"
                :label="item.bookName"
                :value="item.bookId">
              </el-option>
            </el-select>
          </div>
          <zxy-comment :value="commentList" @handleClick="handleDataBook"></zxy-comment>
        </template>
        <template v-if="$route.name==='messageCcom'">
          <div class="colation">
            <el-select class="book_title" v-model="currentBid" placeholder="请选择书籍">
              <el-option
                v-for="item in bookList"
                :key="item.bookId"
                :label="item.bookName"
                :value="item.bookId">
              </el-option>
            </el-select>

            <el-select v-model="filterData.cid" popper-class="chapter-select" placeholder="请选择章节">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item,$index) in chapterList"
                :key="$index"
                :label="item.chapterTitle"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <zxy-comment :value="chapterCommentList" @handleClick="handleDataChapter"></zxy-comment>
        </template>
        <template v-if="$route.name==='messageHarvest'">
          <zxy-comment :value="harvestList" @handleClick="handleDataHarvest"></zxy-comment>
        </template>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  let ERR_OK = 200;
  let ERR_NO = 400;
  import Comment from '../comment/zxy-comment.vue'
 import { aycn,FetchHandleUserInfo,FetchAuthorChapterList,FetchAuthorBookList,FetchBookCommentList,FetchBookCommentReply,FetchGetPrattle,FetchAuthorGainLog } from '../../api'
    export default{
      data(){
          return {
            filterData:{
              type:'',
              cid:''
            },
            value:'',
            bookList:[],
            page:1,
            commentList:{},
            chapterCommentList:{},
            currentBid:null,
            currentCid:1,
            activeTab:'bCom',
            chapterList:[],
            harvestList:{}
          }
      },
      components:{
        "zxy-comment": Comment
      },
      methods:{
        getBookList(){
            FetchAuthorBookList(this.$cookie("user_id")).then(json=>{
              if(json.returnCode===ERR_OK){
                this.bookList = json.data.reverse();
                if(this.bookList.length){
                  for(let k=0,len=this.bookList.length;k<len;k++){
                    if(this.bookList[k].bookCheckStatus){
                      this.currentBid = this.bookList[k].bookId;
                      break;
                    }
                  }
                  if(this.$route.name==='messageBcom'){
                    this.getBookComment()
                  }else if(this.$route.name==='messageCcom'){
                    this.getChapterComment(1,'book')
                  }else if(this.$route.name==='messageHarvest'){
                    this.harvest(1)
                  }
                }
              }
            })
        },
        handleDataBook(index,type){
             if(type==='delete1'){
               this.$alert('', '确定删除吗？(⋟﹏⋞)', {
                 confirmButtonText: '是',
                 showCancelButton:true,
                 customClass:'small confirm-msg-box',
                 cancelButtonText:'否',
                 callback: action => {
                   if(action==='confirm'){
                     FetchHandleUserInfo(index,'dc').then(json=>{
                       if(json.returnCode===ERR_OK){
                         this.$message('删除成功');
                         this.getBookComment(this.page)
                       }
                     });
                   }
                 }
               });

             }else if(type==='delete2'){
                 FetchHandleUserInfo(index,'dcr').then(json=>{
                   if(json.returnCode===ERR_OK){
                     this.$message('删除成功');
                     this.getBookComment(this.page)
                   }
                 });
             }
             else if(type==='upTop'){
               index.state = !index.state?1:0;
               aycn("/comm-isTop/"+index.id+"/"+index.bid+"/"+index.state,'get').then(json=>{
                 if(json.returnCode===ERR_OK){
                   if(index.state){
                     this.$message("置顶成功")
                   }else {
                     this.$message("取消成功")
                   }
                   this.getBookComment(this.page);
                 }
               })
             }else if(type==='zan'){
               //        评论点赞
               FetchHandleUserInfo(this.commentList.list[index].id,'bal').then(json=>{
                 if(json.returnCode===ERR_OK){
                   if(!this.commentList.list[index].isthumbs){
                     this.$message({message:"点赞成功",duration:1500});
                   }else {
                     this.$message({message:"取消点赞",duration:1500});
                   }
                   this.getBookComment(this.page)
                 }
               });

             }else if(type==='reply'){
               if(!this.commentList.list[index].state){
                   this.commentList.list.map((item) => {
                     this.$set(item,"state",false)
                   });
                   this.$set(this.commentList.list[index],"state",true)
               }else {
                   this.commentList.list[index].state = false
               }
             }else if(type==='page1'){
                this.getBookComment(index);
             }else if(type==="page2"){
               this.getReply(index.id,index.page,index.index)
             }else if(type==='Reply'){
             }
          },
        getBookComment(page,type){
          type = !type?'default':type;
          page = page | 1;
          this.page = page;
          if(this.currentBid){
            FetchBookCommentList(this.currentBid,page).then(json=>{
              if(json.returnCode===ERR_OK){
                this.commentList = json.data;
                this.commentList.list.map((item, index) => {
                  if(item.replyCommentInfoCount){
                    this.getReply(item.id,1,index)
                  }
                });
              }
            })
          }
        },
        getReply(cmid,page,index){
          FetchBookCommentReply(cmid,page).then(json=>{
            if(json.returnCode===ERR_OK){
              this.$set(this.commentList.list[index],"dataList",json.data)
            }
          });
        },
        getChapterComment(page){
          let id,type;
            if(this.filterData.cid){
              type = 'chapter';
              id = this.filterData.cid
            }else{
                type = 'book';
              id = this.currentBid;
              if(id){
                this.getChapterList()
              }
            }
            if(id){
              FetchGetPrattle(id,page,type).then(json=>{
                this.chapterCommentList ={};
                if(json.returnCode===200){
                  this.chapterCommentList = json.data
                }
              });
            }

        },
        handleDataChapter(index,type){
//          段评分页
          if(type==='page1'){
              this.getChapterComment(index,'cid')
          }else if(type==='delete1'){
//              删除间贴 多个id用逗号分隔
            this.$alert('', '确定删除吗？(⋟﹏⋞)', {
              confirmButtonText: '是',
              showCancelButton:true,
              customClass:'small confirm-msg-box',
              cancelButtonText:'否',
              callback: action => {
                if(action==='confirm'){
                    FetchHandleUserInfo(index,'dg').then(json=>{
                      if(json.returnCode===200){
                        this.$message("删除成功！");
                        this.getChapterComment(this.chapterCommentList.pageNum,'cid')
                      }
                    });
                }
              }
            });

          }else if(type==='zan'){
              FetchHandleUserInfo(this.chapterCommentList.list[index].id,'pal').then(json=>{
                if(json.returnCode===200){
                  this.$message(this.chapterCommentList.list[index].isthumbs?'取消成功':'点赞成功');
                  this.getChapterComment(this.chapterCommentList.pageNum)
                }
              });

          }
        },
        getChapterList(){
          FetchAuthorChapterList(this.currentBid).then(json=>{
            let newArr = [];
            if(json.returnCode===200){
              let data = json.data;
              data.map(function (item) {
                if(item.resultList.length>0){
                  newArr = newArr.concat(item.resultList);
                }
              });
            }
            this.chapterList = newArr
          });
        },
        harvest(page){
            FetchAuthorGainLog(page).then(json=>{
              if(json.returnCode===200){
                this.harvestList = json.data
              }
            })
        },
        handleDataHarvest(index,type){
            let val = this.harvestList.list[index];
            this.$store.dispatch('init',{type:'letter',title:val.pseudonym,sid:val.userId,aid:val.id});
        }
      },
      mounted(){
        this.getBookList()
      },
      watch:{
        "$route":function (val) {
          if(val.name==='messageBcom'){
            this.getBookComment();
          }else if(val.name==='messageCcom'){
            this.filterData.cid = '';
            this.getChapterComment(1,'book')
          }else if(val.name==='messageHarvest'){
            this.harvest(1)
          }
        },
        currentBid:function (newVal,old) {
          if(newVal && old){
            if(this.$route.name==='messageBcom'){
              this.getBookComment(1,'book');
            }else if(this.$route.name==='messageCcom'){
              this.filterData.cid = '';
              this.getChapterComment(1,'book')
            }
          }
        },
        "filterData.cid":function (val) {
            this.getChapterComment(1,'chapter')
        }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
 .author-message-wrap
   .author-message-nav
     border:1px solid #e4e4e4
     border-bottom none
     box-shadow: 0 1px 3px #ddd
     background #fff
     margin-bottom 15px
     >a
       display inline-block
       line-height:42px
       height 42px
       padding: 0 40px
       font-size: 18px
       text-align center
   .author-message-main
      background #fff
      margin-top 15px
   .el-input__icon+.el-input__inner
     text-align:center;
   .classType
     width 100px
   .book_title
     margin-right: 50px
 .chapter-select
   .el-select-dropdown__item
    /*text-align center*/
    padding-right: 35px
</style>
