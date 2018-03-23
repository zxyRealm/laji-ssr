<template>
    <div class="user-bookshelf-wrapper user-af-wrapper">
     
      <el-tabs class="user-tab__card bookshelf" v-model="activeTab" type="card">
        <el-tab-pane name="bookshelf" label="我的书架"></el-tab-pane>
        <el-tab-pane name="record" label="最近阅读"></el-tab-pane>
        <el-tab-pane class="handle-tab-pane" disabled>
          <template v-if="shelfList.list && shelfList.list.length>0">
            <div v-if="!handleState" @click="handleState=true" slot="label">
              <img src="../../assets/image/icon/handle-icon.png" alt=""> 作品管理
            </div>
            <template v-else>
              <span slot="label" @click="deleteChecked" class="delete-icon"><i class="el-icon-delete2"></i> 删除</span>
              <span slot="label" @click="handleState=false" class="cancel">取消选择</span>
            </template>
          </template>
        </el-tab-pane>
      </el-tabs>
      <template v-if="shelfList.list">
        <div  class="user-book-list-wrapper">
          <!--<div class="bsw">-->
            <ul class="clear bsw cmt" v-if="shelfList.list">
              <template v-if="shelfList.list.length>0">
                <li v-for="(item,$index) in shelfList.list" class="ubl-item clear" @click="selectIt($index)">
                  <div class="cover-wrap fl">
                    <router-link :to="'/chapter/'+(item.chapterId?item.chapterId:item.nowChapterid)" target="_blank">
                      <img :src="item.bookImage" class="book-cover" :alt="item.bookName">
                      <i v-if="item.newIndex" class="zdy-icon__sign small new">更新</i>
                    </router-link>
                    <i v-if="handleState" class="zdy-icon__checkbox" :class="{checked:item.select}"></i>
                  </div>
                  <div class="item-main">
                    <p class="b-title">
                      <router-link class="txt-overflow v-item" :to="'/book/'+item.bookId">{{item.bookName}}</router-link>
                      <i v-if="item.bookCheckStatus==2" class="zdy-icon__vip"></i>
                    </p>
                    <p class="b-writer">作者:{{item.writerName}}</p>
                    <p class="b-state" :class="{end:item.bookStatus}">{{item.bookStatus?'已完结':'连载中'}}</p>
                    <p v-if="item.chapterId" class="b-lasted txt-overflow">上次阅读:
                      <router-link :to="'/chapter/'+item.chapterId" target="_blank">{{item.chapterName}}</router-link>
                    </p>
                    <p class="b-lasted txt-overflow" v-else>最新章节:{{item.lastUpdateChapterName}}</p>
                    <p class="b-upte">最新更新：{{item.lastUpdateTime|time('long')}}</p>
                  </div>
                  <div class="shade" v-if="handleState"></div>
                </li>
              </template>
              <zdy-hint v-else :type="activeTab=='record'?'rec':'bsh'"></zdy-hint>
              <li v-if="activeTab==='record'" class="sline"></li>
              <el-pagination
                class="pbg"
                v-if="shelfList.list && shelfList.total>shelfList.pageSize"
                @current-change="handleCurrentChange"
                :current-page.sync="shelfList.pageNum"
                :page-size="shelfList.pageSize"
                layout="prev, pager, next, jumper"
                :total="shelfList.total">
              </el-pagination>
            </ul>
           
          <!--</div>-->
          
        </div>
      </template>
      
    </div>
</template>

<script type="text/ecmascript-6">
  import { FetchGetUserData,FetchHandleUserInfo } from '../../api'
    export default{
      data(){
            return{
              shelfList:{},
              handleState:false,
              activeTab:'bookshelf'
            }
        },
      methods:{
        getShelfList(page){
          let type = this.activeTab==='bookshelf'?'shelf':'reLog';
          FetchGetUserData(page,type,this.$cookie('user_id')).then(json=>{
            if(json.returnCode===200){
              this.shelfList = json.data
            }else if(json.returnCode===500){
              this.$set(this.shelfList,'list',[])
            }
          });
        },
        deleteChecked(){
            let Darr = [],type;
            if(this.shelfList.list){
              this.shelfList.list.map((item)=>{
                  if(item.select){
                    Darr.push(item.id)
                  }
              });
              type = this.activeTab === 'bookshelf'?'ds':'dr';
              if(Darr.length>0){
                  FetchHandleUserInfo(Darr.toString(),type).then(json=>{
                    if(json.returnCode===200){
                      this.$message("删除成功");
                      this.getShelfList(this.shelfList.pageNum)
                    }
                  });
              }else {
                  this.$message({ message:'请选取删除书籍',type:'warning'})
              }
              
            }
        },
        selectIt(index){
            if(this.handleState){
                if(!this.shelfList.list[index].select){
                     this.$set(this.shelfList.list[index],"select",true)
                }else {
                  this.shelfList.list[index].select = false
                }
            }
        },
        handleCurrentChange(page){
            this.getShelfList(page)
        }
      },
      mounted(){
         this.getShelfList(1)
      },
      watch:{
        handleState:function (val) {
            if(!val && this.shelfList.list){
                this.shelfList.list.map((item)=>{
                    if(item.select!==undefined){
                      this.$delete(item,"select")
                    }
                })
            }
          },
        activeTab:function () {
          this.handleState = false;
          this.shelfList = {};
          this.getShelfList(1);
        }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.user-bookshelf-wrapper
  .af-tabs-nav
    >a
      margin-right :60px
      padding:0 4px

.user-tab__card.bookshelf
  .el-tabs__nav
    width 100%
  .el-tabs__item
    float: left;
    margin-right 68px
    padding:0 5px!important
  .el-tabs__item:first-child
    margin-left 24px
  .el-tabs__item:last-child
    float right
    margin 0
    font-size 14px
    line-height 46px
    &.is-active
      border-bottom :none!important
      color :#333
    >span
      cursor pointer
    >div
      cursor pointer
    .delete-icon
      display inline-block
      border :1px solid #ff8383
      width 74px
      height 28px
      line-height 26px
      text-align center
      border-radius 15px
      margin-right 50px
      color #ff8383
    img
      display inline-block
      vertical-align -5px
    .cancel
      color #00a1d6
.user-book-list-wrapper
  padding-left :18px
  >ul
    border :1px solid #eef0ef
    padding :10px
    border-radius 4px
    background #fff
    .ubl-item:hover
      background :#f8f8f8
    .ubl-item:nth-child(even)
      margin-left :2%
    .ubl-item
      position relative
      float left
      padding 10px
      /*background :#f8f8f8*/
      border-radius :7px
      width :49%
      margin-bottom 10px
      .shade
        position absolute
        top: 0
        left:0
        z-index 999
        width 100%
        height 100%
    .cover-wrap
      float left
      position relative
      width 108px
      height 145px
      margin-right :10px
      >i
        position absolute
        left:0
        top:0
      .book-cover
        border-radius :7px
        height 100%
    .item-main
      overflow hidden
      font-size: 14px
      >p
        margin-bottom :10px
      >p:last-child
        margin-bottom :0
      .b-title
        height :1.5em
        >a
          display inline-block
          max-width :15em
</style>
