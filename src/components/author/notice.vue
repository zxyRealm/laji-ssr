<template>

    <div class="web-affiche-wrapper ">

      <div class="breadcrumb-wrap user">
        <div class="fl">当前位置：</div>
        <el-breadcrumb  separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/author/writing' }">作者中心</el-breadcrumb-item>
          <el-breadcrumb-item>站内公告</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="author-nav">
        <router-link to="/author/notice">
          公告
        </router-link>
      </div>
      <div class="web-affiche clear bsw">
        <template v-if="noticeList.list">
          <zdy-hint v-if="!noticeList.list.length"></zdy-hint>
          <div class="affiche-item clear" v-else v-for="(item,index) in noticeList.list">
            <router-link :to="'/news/'+item.id">
              <img class="nt-img" :src="item.minimg" :alt="item.title">
              <p class="des">
                <span class="tle">
                  {{item.title}}
                </span>
                <span class="time fr">{{item.releaseDate| time('middle')}}</span>
              </p>
            </router-link>
          </div>
        </template>
      </div>
      <el-pagination
         v-if="noticeList.total && noticeList.total>noticeList.pageSize"
         class="pbg"
         @current-change="handleCurrentChange"
         :current-page.sync="noticeList.pageNum"
         :page-size="noticeList.pageSize"
         layout="prev, pager, next, jumper"
         :total="noticeList.total">
      </el-pagination>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
          return{
            noticeList:{}
          }
        },
      methods:{
        getNoticeList(page){
          this.$ajax("/sys-getNotice",{
            page:page,
            menuId:2
          },json=>{
            if(json.returnCode){
              this.noticeList = json.data
            }
          },'get')
        },
        handleCurrentChange(page){
           this.getNoticeList(page)
        }
      },
      mounted(){
        this.getNoticeList(1)
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.web-affiche
    margin 20px
    border-radius 5px
    padding 15px 15px 20px
    /*公告列表*/
    .affiche-item
      width 50%
      float left
      padding:26px 45px 5px
      border-bottom 1px solid #efefef
      a
        display block
      .nt-img
        width 318px
        height 94px
      .des
          height 30px
          line-height 30px
          .tle
            font-size 14px
          .time
              color #666
      /*公告页导航  */
.author-nav
    height 46px
    line-height 42px
    border-bottom 1px solid #f0dcdd
    font-size 20px
    margin-left 20px
    padding 5px 0

    a
      margin 0 25px
      &.active
        color #FB5E6F

</style>
