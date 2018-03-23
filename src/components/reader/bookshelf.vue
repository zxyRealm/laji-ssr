<template>
  <div class="user-bookshelf-wrapper">
    <el-tabs class="user-tab__card bookshelf" v-model="activeTab" type="card">
      <el-tab-pane name="bookshelf" :label="identity?'TA的小说':'TA的书架'"></el-tab-pane>
      <el-tab-pane name="record" label="最近阅读"></el-tab-pane>
      <el-tab-pane class="handle-tab-pane" disabled>
      </el-tab-pane>
    </el-tabs>
    <div class="user-book-list-wrapper pl18">
      <ul v-if="ready" class="clear bsw cmt">
        <template v-if="dataList.length" >
          <li v-for="(item,$index) in dataList" class="ubl-item clear">
            <div class="cover-wrap fl">
              <router-link :to="'/book/'+item.bookId">
                <img :src="item.bookImage" class="book-cover" :alt="item.bookName">
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
                <router-link :to="'/chapter/'+item.chapterId" target="_blank" :title="item.chapterName">{{item.chapterName}}</router-link>
              </p>
              <p class="b-lasted txt-overflow" v-else>最新章节:{{item.lastUpdateChapterName}}</p>
              <p class="b-upte">最新更新：{{item.lastUpdateTime|time('long')}}</p>
            </div>
            <div class="shade" v-if="handleState"></div>
          </li>
        </template>
        <zdy-hint v-else :type="tabType"></zdy-hint>
      </ul>
      <el-pagination
        class="pbg"
        v-if="dataList.list && dataList.total>dataList.pageSize"
        @current-change="handleCurrentChange"
        :current-page.sync="dataList.pageNum"
        :page-size="dataList.pageSize"
        layout="prev, pager, next, jumper"
        :total="dataList.total">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { FetchGetUserData,FetchAuthorBookList } from '../../api'
  export default{
    props:['identity'],
    data(){
      return{
        shelfList:{},
        handleState:false,
        activeTab:'bookshelf',
        ready:false
      }
    },
    methods:{
      getShelfList(page){
        this.ready = false;
        let id = this.$route.params.uid;
        let type = this.activeTab === 'bookshelf'?'shelf':'reLog';
        this.shelfList = {};
        if(this.identity!==undefined){
          if(this.identity && this.activeTab==='bookshelf'){
//          作者书籍
            FetchAuthorBookList(id).then(json=>{
              this.ready = true;
              if(json.returnCode===200){
                this.shelfList = json.data
              }else if(json.returnCode===500){
                this.shelfList = []
              }
            });
          }else {
              FetchGetUserData(page,type,id).then(json=>{
                this.ready = true;
                if(json.returnCode===200){
                  this.ready = true;
                  this.shelfList = json.data
                }else if(json.returnCode===500){
                  this.shelfList = []
                }
              });
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
        this.getShelfList(1);
      },
      identity:function () {
        this.getShelfList(1)
      }
    },
    computed:{
      dataList:function () {
        return this.shelfList.list instanceof Array?this.shelfList.list:this.shelfList
      },
      tabType:function () {
        if(this.activeTab==='bookshelf'){
          if(this.identity){
            return 'bli'
          }else {
            return 'bsh'
          }
        }else {
          return 'rec'
        }
      }
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .user-tab__card.bookshelf
    .el-tabs__nav
      width 100%
    .el-tabs__item
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
    margin-bottom 50px
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
          border-radius :4px
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
