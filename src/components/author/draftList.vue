<template>
    <div class="wrapper">
      <div class="breadcrumb-wrap">
        <div class="fl">当前位置：</div>
        <div>
          <el-breadcrumb  separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/author/writing' }">作者中心</el-breadcrumb-item>
            <el-breadcrumb-item to="/author/writing">创建管理</el-breadcrumb-item>
            <el-breadcrumb-item>草稿箱</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="writing-subNav">
        <ul>
          <li><router-link :to="{name:'ChapterList'}">章节列表</router-link></li>
          <li><router-link :to="{name:'addChapter'}">新增章节</router-link></li>
          <li><router-link :to="{name:'DraftList'}">草稿箱</router-link></li>
          <li class="delete-btn"><span @click="deleteChapter">删除</span></li>
        </ul>
      </div>
      <div class="table-wrapper bsw" >
        <table class="writing-table">
          <tr>
            <td width="40">
              <el-checkbox v-model="selectAll" @change="checkAll"></el-checkbox>
            </td>
            <th width="120" >卷名</th>
            <th width="280">章节名</th>
            <th width="80">字数</th>
            <th>创建时间</th>
            <th width="80">状态</th>
          </tr>
          <template v-for="(item,$index) in draftList">
            <tr :select="item.select" :cid="item.chapterid" @click="selectIt($index)">
              <td><el-checkbox v-model="item.select"></el-checkbox></td>
              <td >
                <p class="name txt-overflow">
                  <a href="javascript:;">{{item.volumeName}}</a>
                </p>
              </td>
              <td class="tl">
                <p class="title txt-overflow">
                  <router-link class="txt-overflow" :to="'/author/writing/editChapter/'+item.id">{{item.chapterTitle}}</router-link>
                </p>
              </td>
              <td>{{item.chapterLength}}</td>
              <td>{{item.createChapterTime | time('middle')}}</td>
              <td>
                <span class="green" v-if="!item.chapterIsvip">免费</span>
                <span class="red" v-else>VIP</span>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        selectAll:false,
        draftList:[]
      }
    },
    methods:{
      checkAll(){
          let self = this;
          if(this.selectAll){
            this.draftList.forEach(function (item) {
              self.$set(item,"select",true)
            })
          }else{
            this.draftList.forEach(function (item) {
              self.$set(item,"select",false)
            })
          }
      },
      getDraftList(page){
        this.$ajax("/chapter-getdrafts",{bookid:this.$route.params.bid,startpage:page},json=>{
            if(json.returnCode===200){
              let allList = [];
              json.data.forEach((item)=>{
                if(item.resultList.length>0){
                  allList = allList.concat(item.resultList)
                }
              });
              this.draftList = allList;
            }
        });
      },
      selectIt(index){
          if(!this.draftList[index].select){
            this.$set(this.draftList[index],'select',true)
          }else{
            this.$set(this.draftList[index],'select',false)
          }
      },
      deleteChapter(){
          let chapList = [];
          if(this.draftList.length>0){
              this.draftList.forEach((item) => {
                if(item.select){
                  chapList.push(item.id)
                }
              });
             if(chapList.length>0){
               this.$alert('', '您确认要删除所选章节？', {
                 confirmButtonText: '是',
                 showCancelButton:true,
                 customClass:'middle confirm-msg-box',
                 cancelButtonText:'否',
                 callback: action => {
                   if(action==='confirm'){
                     this.$ajax("/chapter-deletedrafts",{
                       chapterid:chapList.toString(),
                       bookid:this.draftList[0].bookId
                     },json=>{
                       if(json.returnCode===200){
                         this.getDraftList()
                       }
                     })
                   }
                 }
               });
             }
          }
      }
    },
    mounted(){
      this.getDraftList()
    }
  };
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.writing-subNav
  .delete-btn
    float right
    span
      display inline-block
      width 76px
      height 28px
      text-align center
      line-height 28px
      font-size 14px
      border 1px solid #f77583
      border-radius 16px
      color:#F73D51
      background url("../../assets/image/icon/delete-icon@_01.png") no-repeat 8px center
      padding-left:24px
      cursor pointer

</style>
