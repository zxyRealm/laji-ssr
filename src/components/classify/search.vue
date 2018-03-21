<template>
    <div class="container search-page-wrapper">
      <div class="search-header clear">
        <div class="clear">
          <el-autocomplete
            class="search-input fl"
            v-model="searchTxt"
            :value-key="'hotWords'"
            @keyup.enter.native="search"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="search"
          ></el-autocomplete>
          <button @click="search" class="search-btn fl">搜索</button>
        </div>
        <div class="search-result">
          搜索 <font color="#ff8383">{{$route.params.keywords}}</font>：共有
          <font color="#ff8383">{{searchList.total?searchList.total:0}}</font>
          条结果
        </div>
      </div>
      <div v-if="searchList.list" class="search-list-wrapper">
        <template v-if="searchList.list.length>0">
          <div  class="search-list-item" v-for="(item,$index) in searchList.list" >
            <div class="search-item-cover">
              <router-link :to="'/book/'+item.bookId">
                <img :src="item.bookImage" :alt="item.bookName">
                <i v-if="item.bookAuthorization===2||item.bookAuthorization===3" class="zdy-icon__sign">签约</i>
              </router-link>
            </div>
            <div class="search-main">
              <div class="book-info">
                <router-link :to="'/book/'+item.bookId">
                  <p class="title" v-html="item.bookName"></p>
                </router-link>
                <div class="more-info clear">
                  <p class="detail" style="width: 206px">
                    <span class="tit">作者：</span><router-link :to="'/reader/'+item.bookWriterId" class="txt txt-overflow vab" v-html="item.writerName"></router-link>
                  </p>
                  <p class="detail" style="width: 132px">
                    <span class="tit">类别：</span><span class="txt txt-overflow vab">{{item.classificationName}}</span>
                  </p>
                  <p class="detail" style="width: 132px">
                    <span class="tit">状态：</span><span class="txt txt-overflow vab b-state" :class="{end:item.bookStatus}">{{item.bookStatus?'已完结':'连载中'}}</span>
                  </p>
                  <p class="detail" style="width: 132px">
                    <span class="tit">字数：</span><span class="txt txt-overflow vab">{{item.bookWorldCount}}</span>
                  </p>
                  <p class="detail" style="width: 250px">
                    <span class="tit">更新时间：</span><span class="txt txt-overflow vab">{{item.lastUpdateTime|time('long')}}</span>
                  </p>
                </div>
              </div>
              <div class="book-intro overLine2">
                <span class="tit">简介：</span>{{item.bookIntroduction}}
              </div>
              <div class="user-handle">
                <a href="javascript:;" @click="addBookshelf($index)" class="btn">{{item.collectionStatus?'已收藏':'收藏'}}</a>
                <router-link :to="'/book/'+item.bookId" class="btn">阅读</router-link>
              </div>
            </div>
          </div>
        </template>
        <zdy-hint v-else type="search"></zdy-hint>
        <el-pagination
          class="pdg"
          v-if="searchList.total>searchList.pageSize"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="searchList.pageSize"
          layout="prev, pager, next, jumper"
          :total="searchList.total">
        </el-pagination>
      </div>

    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data(){
          return {
            searchTxt:this.$route.params.keywords,
            searchList:{},
            hotList:[]
          }
      },
      methods:{
        handleCurrentChange(page){
            this.$router.push({params:{page:page}});
        },
        search(){
          let txt = this.$trim(this.searchTxt);
          if(txt){
            this.$router.push({path:'/search/'+txt+'/1'});
          }
        },
        querySearch(queryString, cb) {
          let restaurants = this.hotList;
          let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
        },
        createFilter(queryString) {
          return (restaurant) => {
            return (restaurant.hotWords.indexOf(queryString.toLowerCase()) === 0);
          };
        },
        getData(){
            this.$ajax('/stacks-search',{
              keyWord:this.$route.params.keywords,
              startupPage:this.$route.params.page,
              isHotWorld:1
            },json=>{
                this.searchList = {};
                if(json.returnCode===200){
                    let val = this.$route.params.keywords.replace(/\[/g,'\\[').replace(/\]/g,'\\]');
                    let reg = new RegExp(val,'g');
                    json.data.list.forEach((item)=>{
                      item.bookName = item.bookName.replace(reg,'<font style="color: #ff8383;font-weight: 600">'+this.$route.params.keywords+'</font>');
                      item.writerName = item.writerName.replace(reg,'<font style="color: #ff8383;font-weight: 600">'+this.$route.params.keywords+'</font>');
                    });
                  this.searchList = json.data
                }
            })
        },
        loadAll(){
          this.$ajax("/sys-hotwords",'',json=>{
            if(json.returnCode===200){
              this.hotList = json.data
            }
          },'get');
        },
        //        加入书架
        addBookshelf(index){
          if(this.$store.state.userInfo.userId){
            let val = this.searchList.list[index];
            this.$ajax("/bookshelf-adduserbookshelf",{
              bookId:val.bookId,
              userName:this.$store.state.userInfo.pseudonym,
              bookName:val.bookName
            },json=>{
              if(json.returnCode===200){
                this.searchList.list[index].collectionStatus = (this.searchList.list[index].collectionStatus?0:1);
                this.$message(json.msg)
              }
            })
          }else {
            this.$router.push('/login')
          }
        }
      },
      mounted(){
        this.loadAll();
        this.getData()
      },
      watch:{
          $route:function (val,oldVal) {
            if(val.params.keywords!==oldVal.params.keywords){
                this.searchTxt = val.params.keywords
                this.$router.push({path:'/search/'+this.$trim(val.params.keywords)+'/1'})
            }
            this.getData()
          }
      },
      computed:{
        page:function () {
          return parseInt(this.$route.params.page)
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.search-page-wrapper
  .search-header
    padding:40px 10px 5px
    line-height 44px
    font-size: 16px
    .el-autocomplete
      &.search-input
        width:400px
        height 44px
        .el-input
          vertical-align top
        .el-input__inner
          height 44px
          line-height 44px
          padding-right:0!important
          border-radius 0
          border-bottom-left-radius 7px
          border-top-left-radius 7px
          border-color:#8c8c8c
    .search-btn
      display inline-block
      width 80px
      line-height 44px
      margin-left 16px
      background #f77482
      color #fff
      border-bottom-right-radius 7px
      border-top-right-radius 7px

    .search-result
      margin-top: 28px
      line-height 22px
      font-size 14px
  .search-list-wrapper
    .search-list-item
      position relative
      height 194px
      padding:15px 10px
      border 1px solid transparent
      border-bottom 1px solid #efefef
      &:last-child
        border-bottom none
      &:hover
        background #f6f6f6
        border 1px solid #c8c8c8
      .search-item-cover
        position relative
        float:left
        width 124px
        height 162px
        border-radius 8px
        overflow hidden
        a
          display inline-block
          height 100%
          >img
            width 100%
            height 100%
      .search-main
        overflow hidden
        height 162px
        padding-left: 24px
      span.tit
        color #999
      .book-info
        overflow hidden
        .title
          font-size 16px
        .more-info
          margin 44px 0 34px
          line-height 1em
          font-size: 16px
          >.detail
            float left
      .book-intro
        height 3em
        font-size 16px
      .user-handle
        position absolute
        top:15px
        right :15px
        font-size 16px
        >a
          display inline-block
          width 74px
          height 28px
          text-align center
          line-height 28px
          box-shadow none
          margin-left 32px
          border-radius 15px
          background #ff8383
          color #fff
        >a:hover
          color :#fff!important
</style>
