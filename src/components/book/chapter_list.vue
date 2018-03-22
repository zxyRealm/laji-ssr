<template>
    <div class="chapter-list-wrapper">
      <div class="subNavWrap">
        <span class="fl">当前位置：</span>
        <div class="sub-nav">
          <el-breadcrumb  separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/class_total/'+bookInfo.bookClassificationId+'/0/0/0/0/1/0'}" >{{bookInfo.classificationName}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="'/book/'+bookInfo.bookId">{{bookInfo.bookName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="chapter-list-main">
        <div class="book-title">
          <h2 class="title">
            {{bookInfo.bookName}}
          </h2>
          <p class="info">
            <span>作者：
              <router-link :to="'/reader/'+bookInfo.bookWriterId">{{bookInfo.writerName}}</router-link>
            </span>
            <span>更新时间：
              {{bookInfo.lastUpdateTime | time}}
            </span>
          </p>
        </div>
        <div class="chapter-list">
          <template v-if="chapterList" v-for="(item,index) in chapterList">
            <div class="chapter-list-item">
              <div class="volume">
                <span class="title">
                  {{item.volumeName}}&nbsp;&nbsp;&nbsp;共{{item.length}}章
                </span>&nbsp;&nbsp;&nbsp;<span class="counts">{{item.counts}}字</span>
              </div>
              <div class="chapter-item clear" >
                <p class="link-wrap" v-for="(item2,index2) in item.resultList" :key="index2">
                  <router-link class="txt-overflow" :alt="item2.chapterTitle" :title="item2.chapterTitle" :to="'/chapter/'+item2.id" target="_blank">
                  {{item2.chapterTitle}}

                  </router-link>
                  <i v-if="item2.chapterIsvip" class="zdy-icon__vip"></i>
                </p>
              </div>

            </div>
          </template>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import { FetchBookInfo } from '../../api'
    export default{
      data(){
        return {
          bookInfo:{},
        }
      },
      methods:{
          getChapterList(){
              let bid = this.$route.params.bid;
              FetchBookInfo(bid).then(res=>{
                  if(res.returnCode===200){
                      this.bookInfo = res.data;
                      this.$store.dispatch("FETCH_CHAPTER_LIST",{ bid:bid })
                  }
              })
          }
      },
      mounted(){
          this.getChapterList()
      },
      computed:{
         ...mapGetters([
             'chapterList'
         ])
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.chapter-list-wrapper
  width 1024px
  margin 0 auto
  .book-title
    text-align center
    .title
      font-size 20px
      line-height 46px
      font-weight normal

    .info
      line-height 26px
      color #878787
      font-size 14px
      span
        margin-right 24px
        a
          color #3878DE
  .chapter-list
    margin-top 26px
  .el-breadcrumb__item:last-child
    .el-breadcrumb__inner
      cursor pointer!important
      &:hover
        color #f77583
.chapter-list-item
  font-size 16px
  margin-bottom 12px
  .volume
    height 46px
    line-height 46px
    border-bottom 1px solid #373737
    .title
      font-weight bold
    .counts
      color #878787
  .chapter-item
    color #333
    .link-wrap
      float left
      width 33%
      line-height 46px
      padding-right 50px
      border-bottom 1px solid #efefef
      a
        display inline-block
        float left
        max-width 230px
        text-align left
        margin-right 5px
</style>
