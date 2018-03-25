<template>
  <div id="home" class="content">
    <div class="content-inner">
      <!--首页顶部轮播图-->
      <div class="banner-wrap">
        <div class="banner pr20">
          <template>
            <el-carousel :interval="5000" arrow="hover" class="zdy-cover">
              <template v-if="allData.maxBrandPicList">
                <el-carousel-item v-for="(item,index) in allData.maxBrandPicList" :key="index" >
                  <router-link :to="'/book/'+item.bookId">
                    <img style="height:auto;width:100%" class="br5" :src="item.bookImage" alt="banner推荐位">
                    <div class="zdy-mask">
                      <p class="tl h34">{{item.bookName}}</p>
                    </div>
                  </router-link>
                </el-carousel-item>
              </template>
            </el-carousel>
          </template>
        </div>
        <div class="bw-right">
          <template v-if="allData.minBrandPicList">
            <router-link class="zdy-cover" v-for="item in allData.minBrandPicList" :key="item.bookId" :title="item.bookName" :to="'/book/'+item.bookId">
              <img :src="item.bookImage" :alt="item.bookName">
              <div class="zdy-mask">
                <p>{{item.bookName}}</p>
              </div>
            </router-link>
          </template>
        </div>
      </div>

      <!--网站动态 start-->
      <!--网站公告 start-->
      <div class="tr-title">
        <img src="../../../static/img/icon/web_trends.png" class="fl" alt="">
        <div class="tr-txt circular-wrap" @mouseleave="go" @mouseenter="stop">
          <transition-group name="circular">
            <div class="circular-item" v-for="(item,$index) in allData.gunDongDeng" :key="$index" v-show="current===$index">
              <div class="item-left">
                <router-link :to="'/reader/'+item.userId">{{item.userName}} </router-link>评论了
                <router-link :to="'/book/'+item.bookId">《{{item.bookName}}》</router-link>
              </div>
              <div class="item-right">
                <span class="grey txt-overflow">{{item.commentContext}}</span>
              </div>
            </div>
          </transition-group>

        </div>
      </div>
      <!--网站公告 end -->
      <div class="trends" v-if="allData.activityRecommendedPositionList && allData.activityRecommendedPositionList[0] ">
        <div class="trends-content br5">
          <a  target="_blank" :href="activeHref(0)">
            <img  :src="allData.activityRecommendedPositionList[0].activityImgURL" alt="网站动态公告">
          </a>
        </div>
      </div>
      <!--网站动态 end -->

      <!--热门推荐  start-->
      <div class="hot-book">
        <div class="main-left">
          <div class="heading hotIcon-bg">
            <img src="../../../static/img/icon/hot_book.png" alt="">
            <div class="fl f-title ml10">
              热门推荐
            </div>
          </div>
          <div class="hb-left clear">
            <ul class="book-list clear">
              <template v-if="allData.hotRecommendedList">
                <li v-for="item in allData.hotRecommendedList">
                  <router-link class="cover" :to="'/book/'+item.bookId">
                    <img :src="item.bookImage" :alt="item.bookName">
                  </router-link>
                  <div class="b-Title">
                    <router-link :to="'/book/'+item.bookId" :title="item.bookName" class="txt-overflow">{{item.bookName}}</router-link>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="main-right">
          <!--网站通告  start-->
          <div class="web-event">
            <el-tabs type="card" active-name="first_three" class="home-tabs system">
              <!--<el-tab-pane label="系统" disabled></el-tab-pane>-->
              <el-tab-pane label="公告" name="first_three">
                <div class="event-view">
                  <div v-for="(item ,index) in allData.webannouncementList" class="event-item">
                    <router-link target="_blank" :to="'/news/'+item.id">
                      <span class="item-index fl">{{index+1}}</span>
                      <span class="item-date fr">{{ times |time('special','/')}}</span>
                      <!--顺序不可变  否则影响页面布局-->
                      <span class="item-txt txt-overflow">
                        {{item.title}}
                      </span>
                    </router-link>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="动态" name="second_three">
                <div class="event-view">
                  <template v-for="(item,index) in allData.dynamicList">
                    <div class="event-item">
                      <p v-if="index<6">
                        <span class="item-index fl">{{index+1}}</span>
                        <!--顺序不可变  否则影响页面布局-->
                        <span class="item-txt txt-overflow mr0">
                          <router-link target="_blank" :to="'/reader/'+item.userId">{{item.pseudonym}} </router-link>打赏了
                          <router-link target="_blank" :to="'/book/'+item.bookid">
                            {{item.bookName}}
                          </router-link>
                        </span>
                      </p>
                    </div>
                  </template>
                </div>
              </el-tab-pane>
            </el-tabs>

          </div>
          <!--网站通告 end-->
        </div>
      </div>
      <!--热门推荐 end-->

      <!--新书推荐  begin-->
      <div class="new-book clear">
        <div class="main-left clear">
          <div class="home-left-header">
            <span class="home-left-title home-new-title">新书推荐</span>
            <a href="javascript:;" class="exchange" @click="exchange($event)">换一换</a>
          </div>
          <div class="nb-content clear">
            <ul class="book-list2 clear">
              <li v-for="item in allData.newBook">
                <router-link class="cover" :to="'/book/'+item.bookId">
                  <img :src="item.bookImage" :alt="item.bookName">
                </router-link>
                <div class="b-title">
                  <router-link to="/book/1" class="txt-overflow">
                    {{item.bookName}}
                  </router-link>
                </div>
                <div class="b-info">
                  <span>{{item.clickTotal | number}}</span>
                  <span class="sep">|</span>
                  <span>{{item.classificationName}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="main-right clear">
          <el-tabs type="card" activeName="first_one" class="home-tabs golden">
            <el-tab-pane label="金椒榜" disabled></el-tab-pane>
            <el-tab-pane label="月" name="first_one">
              <ul  class="rank-list">
                <template v-if="allData.jinJiaoTopMonthList" v-for="(item,index) in allData.jinJiaoTopMonthList">
                  <li v-if="index===0">
                    <router-link :to="'/book/'+item.bookId" class="cover">
                      <img :src="item.bookImage" :alt="item.bookName">
                    </router-link>
                    <div class="info">
                      <div class="b-title txt-overflow">
                        <router-link :to="'/book/'+item.bookId">
                          {{item.bookName}}
                        </router-link>
                      </div>
                      <div class="b-writer txt-overflow">
                        {{item.writerName}}
                      </div>
                      <div class="class-name">
                        {{item.classificationName}}
                      </div>
                    </div>
                  </li>
                  <li v-else-if="index>0&&index<10">
                    <div class="order">
                      {{index<9?'0'+ (index+1):index+1}}
                    </div>
                    <div class="txt-overflow">
                      <router-link :to="'/book/'+item.bookId" :alt="item.bookName" :title="item.bookName">
                        【{{item.classificationName}}】 {{item.bookName}}
                      </router-link>
                    </div>
                  </li>
                </template>
                <li class="more"><router-link to="/rank/golden">查看更多　　<i class="el-icon-arrow-right"></i></router-link></li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="总" name="second_one">
              <ul  class="rank-list">
                <template v-if="allData.jinJiaoToptotalList" v-for="(item,index) in allData.jinJiaoToptotalList">
                  <li v-if="index===0">
                    <router-link :to="'/book/'+item.bookId" class="cover">
                      <img :src="item.bookImage" :alt="item.bookName">
                    </router-link>
                    <div class="info">
                      <div class="b-title txt-overflow">
                        <router-link :to="'/book/'+item.bookId">
                          {{item.bookName}}
                        </router-link>
                      </div>
                      <div class="b-writer txt-overflow">
                        {{item.writerName}}
                      </div>
                      <div class="class-name">
                        {{item.classificationName}}
                      </div>
                    </div>
                  </li>
                  <li v-else-if="index>0&&index<10">
                    <div class="order">
                      {{index<9?'0'+ (index+1):index+1}}
                    </div>
                    <div class="txt-overflow">
                      <router-link :to="'/book/'+item.bookId" :alt="item.bookName" :title="item.bookName">
                        【{{item.classificationName}}】 {{item.bookName}}
                      </router-link>
                    </div>
                  </li>
                </template>
                <li class="more"><router-link to="/rank/golden">查看更多　　<i class="el-icon-arrow-right"></i></router-link></li>
              </ul>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
      <!--新书推荐 end-->

      <!--榜单推荐  start-->
      <div class="ranking clear mt5">
        <div class="main-left">
          <div class="home-left-header rank">
            <span class="home-left-title">分类推荐</span>
            <a href="javascript:;" class="exchange" @click="exchange($event)">换一换</a>
          </div>
          <ul class="clear home-rank">
            <li v-for="item in allData.bookBatch" class="classify-item clear">
              <template v-if="allData.bookBatch" v-for="(item2,$index2) in item">
                <div v-if="$index2===0" class="classify-sub-item">
                  <div class="item-subtitle clear">
                    <router-link class="c-tle" :to="'/class_total/'+item2.bookClassificationId+'/0/0/0/0/1/0'">
                      {{item2.recommendName.slice(item2.recommendName.lastIndexOf('-')+1)}}
                    </router-link>
                  </div>
                  <div class="item-main clear">
                    <router-link class="cover" :to="'/book/'+item2.bookId">
                      <img :src="item2.bookImage" :alt="item2.bookName">
                    </router-link>
                    <div class="b-info">
                      <div class="b-title">
                        <router-link :to="'/book/'+item2.bookId" class="txt-overflow">
                          {{item2.bookName}}
                        </router-link>
                        <p class="b-writer">作者：{{item2.writerName}}</p>
                      </div>
                      <p class="book-label">
                        <span v-for="item3 in item2.booklableList" :style="{borderColor:item3.bookColor,color:item3.bookColor}">{{item3.bookLableName}}</span>
                      </p>
                      <p class="book-intro overLine3">
                        {{item2.bookIntroduction}}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </li>
          </ul>
        </div>
        <div class="main-right">
          <el-tabs type="card" activeName="first_four" class="home-tabs mb5">
            <el-tab-pane label="点击榜" name="first_four">
              <ul class="rank-list">
                <template v-if="allData.dianJiBang" v-for="(item,$index) in allData.dianJiBang">
                  <li v-if="$index===0">
                    <router-link :to="'/book/'+item.bookId" class="cover">
                      <img :src="item.bookImage" :alt="item.bookName">
                    </router-link>
                    <div class="info">
                      <div class="b-title txt-overflow">
                        <router-link :to="'/book/'+item.bookId">
                          {{item.bookName}}
                        </router-link>
                      </div>
                      <div class="b-writer txt-overflow">
                        {{item.writerName}}
                      </div>
                      <div class="class-name">
                        {{item.classificationName}}
                      </div>
                    </div>
                  </li>
                  <li v-else-if="$index>0 && $index<10">
                    <div class="order">
                     {{$index<9?'0'+($index+1):($index+1)}}
                    </div>
                    <div class="txt-overflow">
                      <router-link :to="'/book/'+item.bookId" :alt="item.bookName" :title="item.bookName">
                        【{{item.classificationName}}】 {{item.bookName}}
                      </router-link>
                    </div>
                  </li>
                </template>
                <li class="more">
                  <router-link to="/rank/click">查看更多
                  　　<i class="el-icon-arrow-right"></i>
                  </router-link>
                </li>
              </ul>

            </el-tab-pane>
            <el-tab-pane label="畅销榜" name="second_four">
              <ul class="rank-list">
                <template v-if="allData.changXiaototal" v-for="(item,$index) in allData.changXiaototal">
                  <li v-if="$index===0">
                    <router-link :to="'/book/'+item.bookId" class="cover">
                      <img :src="item.bookImage" :alt="item.bookName">
                    </router-link>
                    <div class="info">
                      <div class="b-title txt-overflow">
                        <router-link :to="'/book/'+item.bookId">
                          {{item.bookName}}
                        </router-link>
                      </div>
                      <div class="b-writer txt-overflow">
                        {{item.writerName}}
                      </div>
                      <div class="class-name">
                        {{item.classificationName}}
                      </div>
                    </div>
                  </li>
                  <li v-else-if="$index>0&&$index<10">
                    <div class="order">
                      {{$index<9?'0'+($index+1):($index+1)}}
                    </div>
                    <div class="txt-overflow">
                      <router-link :to="'/book/'+item.bookId" :alt="item.bookName" :title="item.bookName">
                        【{{item.classificationName}}】 {{item.bookName}}
                      </router-link>
                    </div>
                  </li>
                </template>
                <li class="more">
                  <router-link to="/rank/reward">查看更多
                    　　<i class="el-icon-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
      <!--榜单推荐 end-->

      <!--特别推荐位  begin-->
      <div class="trends mt20 mb20" v-if="allData.activityRecommendedPositionList && allData.activityRecommendedPositionList[1] " >
        <div class="trends-content br5">
          <a target="_blank" :href="activeHref(1)">
            <img  :src="allData.activityRecommendedPositionList[1].activityImgURL" alt="网站动态公告">
          </a>
        </div>

      </div>
      <!--特别推荐位 end-->

      <!--最新更新 start-->
      <div class="latest-book clear">
        <div class="main-left">
          <div class="heading latestIcon-bg">
            <img src="../../assets/image/icon/latest_book2.png" alt="">
            <div class="fl f-title ml10">
              最近更新图书
            </div>
            <router-link class="fr more" to="class_total">查看更多 <i class="el-icon-arrow-right"></i></router-link>
          </div>
          <div class="latest-list">
            <table class="book-list-table">
              <tbody>
              <tr>
                <th width="52"><span class="code">序号</span></th>
                <th width="100">小说类别</th>
                <th width="246" class="tl" style="padding-left: 24px">书名/更新章节</th>
                <th width="106">作者</th>
                <th width="100">字数</th>
                <th width="114">更新时间</th>
              </tr>
              <tr v-for="(item,index) in latestChapterList.maxNewChapterVOList" v-if="index<15">
                <td><p class="code">{{index+1}}</p></td>
                <td><p class="type">{{item.classificationName}}</p></td>
                <td>
                  <div class="name">
                    <router-link class="txt-overflow" :to="'/book/'+item.bookId" >{{item.bookName}}</router-link>
                    <p> <span  class="txt-overflow">{{item.lastUpdateChapterName}}</span><i v-if="item.bookCheckStatus==2" class="zdy-icon__vip"></i></p>
                  </div>
                </td>
                <td><p class="words txt-overflow">{{item.writerName}}</p></td>
                <td><p class="author">{{item.bookWorldCount}}</p></td>
                <td><p class="time">{{item.lastUpdateTime | time('sort')}}</p></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="main-right">
            <div class="rank-list-wrap">
              <div class="rank-list-title">
                最新签约
              </div>
              <ul  class="rank-list ah">
                <template v-if="latestChapterList.maxNewSignBook" v-for="(item,index) in latestChapterList.maxNewSignBook">
                  <li v-if="index===0">
                    <router-link :to="'/book/'+item.bookId" class="cover">
                      <img :src="item.bookImage" :alt="item.bookName">
                    </router-link>
                    <div class="info">
                      <div class="b-title txt-overflow">
                        <router-link :to="'/book/'+item.bookId">
                          {{item.bookName}}
                        </router-link>
                      </div>
                      <div class="b-writer txt-overflow">
                        {{item.writerName}}
                      </div>
                      <div class="class-name">
                        {{item.classificationName}}
                      </div>
                    </div>
                  </li>
                  <li v-if="index<10 && index>0">
                    <div class="order">
                      {{index<9?'0'+ (index+1):index+1}}
                    </div>
                    <div class="txt-overflow">
                      <router-link :to="'/book/'+item.bookId" :alt="item.bookName" :title="item.bookName">
                        【{{item.classificationName}}】 {{item.bookName}}
                      </router-link>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <div class="rank-list-wrap">
              <div class="rank-list-title">
                最新入库
              </div>
              <ul  class="rank-list ah">
                <template v-if="latestList.list" v-for="(item,index) in latestList.list">
                  <li v-if="index===0">
                    <router-link :to="'/book/'+item.bookId" class="cover">
                      <img :src="item.bookImage" :alt="item.bookName">
                    </router-link>
                    <div class="info">
                      <div class="b-title txt-overflow">
                        <router-link :to="'/book/'+item.bookId">
                          {{item.bookName}}
                        </router-link>
                      </div>
                      <div class="b-writer txt-overflow">
                        {{item.writerName}}
                      </div>
                      <div class="class-name">
                        {{item.classificationName}}
                      </div>
                    </div>
                  </li>
                  <li v-if="index<10 && index>0">
                    <div class="order">
                      {{index<9?'0'+ (index+1):index+1}}
                    </div>
                    <div class="txt-overflow">
                      <router-link :to="'/book/'+item.bookId" :alt="item.bookName" :title="item.bookName">
                        【{{item.classificationName}}】 {{item.bookName}}
                      </router-link>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
        </div>
      </div>
      <!--最新更新 end-->
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters,mapState } from 'vuex'
export default{
  data: function(){
    return {
      current:0,
      timer:null,
      hotRecommend:[], //首页热门推荐
      autoNotice:[], //滚动网站公告
      times:'',
      updateData:[],
      cState1:false,
      cState2:false,
    }
  },
  methods:{
    exchange(event){
        if(event.target.parentNode.className.indexOf('rank')>-1){
            if(!this.cState1){
                this.cState1 = true;
                this.allData.bookBatch = this.allData.homePageRecommendedByClassFuction.slice(6);
            }else {
                this.cState1 = false;
                this.allData.bookBatch = this.allData.homePageRecommendedByClassFuction.slice(0,6);
            }
        }else {
            if(!this.cState2){
                this.cState2 = true;
                this.allData.newBook = this.allData.newBookRecommendedList.slice(10);
            }else {
                this.cState2 = false;
                this.allData.newBook = this.allData.newBookRecommendedList.slice(0,10);
            }
        }
    },
    go() {
        this.timer = setInterval(() => {
            this.autoPlay()
        },3000)
    },
    stop() {
        clearInterval(this.timer);
        this.timer = null
    },
    autoPlay(){
      this.current++;
      if(this.allData.gunDongDeng && this.current>this.allData.gunDongDeng.length-1){
        this.current = 0;
      }
    },
    activeHref (i) {
      let href = this.allData.activityRecommendedPositionList;
      if(href[i] && !href[i].showHide){
        if(href[i].bookId){
          return '/book/'+href[i].bookId
        }else {
          return href[i].detailsImgAndPageURL
        }
      }
      return false
    }
  },
  title(){
      return '辣鸡小说首页'
  },
  asyncData ({ store }) {
    return store.dispatch('FETCH_INDEX_DATA')
  },
  mounted(){
      this.$nextTick(()=>{
         this.go();
      })
  },
  computed:{
    allData(){
      return this.$store.getters.indexData("total")
    },
    latestChapterList(){
      return this.$store.getters.indexData("latest")
    },
    latestList(){
      return this.$store.getters.indexData("sign")
    }
  }
}
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">


  font-color = #FB5E6F
  btn-color =  #F77583

/*首页网站公告轮播样式  */

.circular-enter-active
  transition: all 1s ease;
  transform: translateY(0)

.circular-leave-active
  transition: all 1s ease;
  transform: translateY(-38px)

.circular-enter
  transform: translateY(38px)

.circular-leave
  transform: translateY(0)

.circular-wrap
  position:relative
  height 38px
  .circular-item
    position absolute
    top 0
    width 350px
    height 38px
    color #333
    .item-left
      float left
    .item-right
      overflow hidden
    .grey
      display inline-block
      width 100%
      text-align left
      vertical-align bottom
      overflow hidden
.classify-item
  float:left
  width 50%
  text-align left
  margin-bottom 18px
  .classify-sub-item
    >p
      font-size 14px
  .item-subtitle
    text-align left
    margin-bottom: 10px
    height 30px
    line-height 28px
    padding 0 5px
    a.c-tle
      display inline-block
      width 90px
      height 30px
      border 1px solid #F77583
      color #F77583
      border-radius 15px
      font-size: 16px
      text-align center

  .item-main
    a.cover:hover
      transform: scale(1.02)
      padding:5px
      box-shadow 0 1px 4px rgba(0,0,0,0.1)
    a.cover
      float left
      padding 5px
      border-radius 7px
      >img
        width 120px
        height 157px
        border-radius 4px
    .b-info
      overflow hidden
      padding:0 10px
      height 167px
      .b-title
        font-size: 14px
        margin-bottom: 10px
        >a
          display inline-block
          width 100%
          height 18px
          line-height 1
        .b-writer
          line-height 20px
          color #999
      .book-label
        height 54px
        word-break break-all
        line-height 0
        >span
          display inline-block
          border 1px solid #d6d6d6
          padding 0 6px
          height 18px
          line-height 16px
          border-radius 10px
          margin-bottom: 12px
          margin-right 10px
          word-break keep-all
          font-size 12px
          &:nth-child(3)
            &+span
              margin-bottom 0

      .book-intro
        /*height 60px*/
        color #999
        font-size 14px
.home-left-header
  line-height 42px
  padding-right 10px
  margin-bottom 8px
  &.rank
    margin-bottom 15px
  .home-left-title
    display inline-block
    height 42px
    line-height 42px
    font-size 20px
    background url('../../assets/image/icon/latest_book.png') no-repeat left 7px
    background-size auto 34px
    padding-left 45px
    margin-left:0
    color: #000
    &.home-new-title
      background url('../../assets/image/icon/new_book.png') no-repeat left 7px
      background-size 34px auto
  .exchange
    float:right
    font-size 14px
#app
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
#home
  .main-left
    padding-right:34px
    .home-tabs
      position relative
      .exchange
        position absolute
        right 15px
        top: 20px
      .el-tabs__item.is-active
        box-shadow none
        border none!important

.home-tabs
  /*padding-top 6px*/
  &.golden
    line-height 50px
    /*padding-top:20px*/
    .el-tabs__header
       margin-bottom 0
    .el-tabs__item:nth-child(3)
      border-left:1px solid #ddd
      border-radius 0
    .el-tabs__item
      height 1em
      line-height 1em
      padding 0 15px
      margin 0
      &.is-active
        border-bottom :0!important
        color #fb5e6f
  .el-tabs__header
    margin-bottom 16px
  .el-tabs__active-bar
    height 2px
  .el-tabs__item:first-child
    margin-left :0
    padding-left:0
  .el-tabs__item
    padding 0 3px
    margin 0 10px
    font-size 17px
    color #333
    &.is-active
      border-bottom 2px solid #fb5e6f!important
      color #fb5e6f
    &.is-disabled
      font-size 18px
      color :#333
   &.tabs1
      .el-tabs__item:first-child
        background url('../../assets/image/icon/new_book.png') no-repeat left 5px
        background-size 34px auto
        padding-left 46px
        margin-left:0
   &.tabs2
      .el-tabs__item:first-child
        background url('../../assets/image/icon/sport_badges.png') no-repeat left 7px
        background-size auto 31px
        padding-left 45px
        margin-left:0
  /*首页顶部轮播图*/
.banner-wrap
    height: 206px;
    margin-top:7px
  .banner
    float: left;
    width:540px;
    height: 205px;
    border-radius: 5px;
    text-align:center;
    background-color: #fff
    .el-carousel
      .el-carousel__indicators
        bottom 26px
      .el-carousel__container
        height :205px

        .el-carousel__item
          display :none
          transition :.5s ease
          a
            position relative
            display inline-block
            height 100%
            overflow hidden
            border-radius 7px
        .el-carousel__item.is-active
          display :block
//    轮播图右侧推荐位样式
  .bw-right
    overflow: hidden;
    height:100%;
    background-color: #fff;
    >a
      display: block;
      float: left;
      height: 95px;
      width: 152px;
      margin-right: 14px;
      border-radius: 5px;
      overflow: hidden;
      .cover
        width: 100%;
        height: 100%;
      &:nth-child(-n+3)
        margin-bottom:16px;
      &:nth-child(3n)
        margin-right: 0;
/*标题背景样式设置 start*/

/*标题背景样式设置 start*/
  /*网站动态*/
.trends
  height: auto;
  overflow: hidden;
  .trends-content
    height 88px
  /*标题区*/
.tr-title
  height: 38px;
  line-height: 38px;
  font-size:12px;
  .tr-icon
    width: 48px;
  .tr-txt
    overflow: hidden;
    height: 38px;
    color: #a9a9a9;
    .tr-class
      color:;
  img
    height :30px
    width:30px
    margin :5px

/*热门推荐*/
.hot-book
  position: relative;
  overflow hidden
  .hb-wraper
    height: 266px;
  .hb-left
    width: 738px;
    height: 100%;
    float: left;

.book-list
  li
    width: 154px;
    float: left;
    margin-right: 30px;
    transition: all 0.2s ease;
    a
      display: inline-block;
      width:100%;
      img
        width:100%;
        height:100%;
        border-radius:4px;
    .cover
      width: 100%;
      height: 205px;
    &:nth-child(2) .b-Title
      border-color: #ffba44
      a
        color: @border-color
    &:nth-child(3)
      .b-Title
        border-color: #ff7462
        a
          color: @border-color
    &:nth-child(4) .b-Title
      border-color:#c081ff
      a
        color: @border-color
    &:nth-child(5n)
      margin-right: 0;

  .b-Title
    width: 100%;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    overflow: hidden;
    margin:18px auto 0;
    border: 1px solid #94cb1e;
    padding 0 10px
    font-size:16px;
    a
      display inline-block
      height 100%
      line-height 38px
      max-height:130px;
      color:#94cb1e;
.book-list2
  li
    width: 128px;
    float: left;
    margin-right: 18px;
    margin-bottom: 20px;
    background: #fff;
    padding: 4px 4px 0;
    text-align: center;
    .b-info
      text-align: center;
      height: 20px;
      line-height: 20px;
      color #999
      span
        display: inline-block;
        text-align: left;
        /*padding-left: 15px;*/
    a
      display: block;
      width:100%;
      background-color: #fff;
    .cover
      img
        width: 100%;
        height: 158px;
        border-radius: 4px;
    .b-title
      width: 100%;
      text-align: center;
      overflow: hidden;
      height: 24px;
      line-height: 26px;
      font-size:14px
    &:hover
      transform: scale(1.02);
      border-radius: 5px;
      box-shadow: 1px 1px 12px 1px rgba(0,0,0,.1);
    &:nth-child(5n)
      margin-right: 0;
    &:nth-child(n+6)
      margin-bottom 0

.web-event
  overflow: hidden;
  font-size: 14px;
  .subNav
    height: 32px;
    line-height: 30px;
    a
      display: inline;
      padding:5px 0;
      margin:0 12px;
  .item-index
    height:22px;
    width:22px;
    text-align: center;
    line-height: 22px;
    border-radius: 3px;
    margin-right 15px
  .event-view
    width: 100%;
    height:269px;

  .event-item
    height: 22px;
    width: 100%;
    line-height: 22px;
    padding-right: 10px;
    overflow: hidden;
    margin-bottom:24px;

    .item-txt
      margin:0 64px 0 24px;
      width:auto;
      overflow: hidden;
    span
      display: block;
      height:22px;
      &:first-child
        background-color: #bdbdbd;
        color: #fff;
    &:last-child
      margin-bottom: 0;
    &:nth-child(-n+3) span:first-child
      background-color btn-color

  /*网站通告 end*/


  /*新书推荐*/
  .new-book{
    /*height: 848px;*/
  }
  /*特别推荐位*/
  .nominate{
    height: 118px;
  }
  /*榜单推荐*/
  .ranking{
    /*height: 816px;*/
  }
  /*最新更新*/
  .latest-book{
    /*height: 800px;*/
  }

  .latest-book .subNav li:last-child{
    float: right;
    width: auto;
  }
.book-list-table
  /*width: 100%;*/
  table-layout:fixed;
  word-break:break-all;
  th
    font-size: 14px;
    text-align: center;
    height: 38px;
    vertical-align: middle;
  td
    color: #000;
    line-height: 1.5em;
    font-size: 14px;
    text-align: center;
    border-bottom: 1px solid #efefef;
    vertical-align: middle;
    .name
      text-align: left;
      padding:10px 10px 10px 24px;
      .txt-overflow
        max-width 180px
      span
        display inline-block
        vertical-align middle
        color: #999;
      .vip
        color: font-color
        font-weight :bold
        padding: 2px 4px
    a
      display:block
    p
      overflow: hidden;
      &.words
        max-width 100px
        padding 0 10px


.rank-list-wrap
  margin-bottom 15px
  .rank-list-title
    font-size 18px
    line-height 50px
</style>

