<template>
    <div class="wrapper">
      <div class="tabNav">
        <ul class="clear">
          <template v-if="$route.params.type!=='latest'">
          <li v-if="$route.params.type!=='golden'">
            <router-link :to="{name:'rankChild',params:{type:$route.params.type,time:'week'}}">周榜</router-link>
          </li>
          <li><router-link :to="{name:'rankChild',params:{type:$route.params.type,time:'month'}}">月榜</router-link></li>
          </template>
          <li><router-link :to="{name:'rankChild',params:{type:$route.params.type,time:'all'}}">总榜</router-link></li>
        </ul>
      </div>
      <ul v-if="dataList.list" class="main-rank-list">
          <template v-if="dataList.list.length>0">
            <li v-for="(item,index) in dataList.list" class="clear rc-item">
              <div class="code clear">
                <img v-if="$route.params.page==1 && index<3" :src="'../../../static/img/icon/rank-icon@1_0'+(index+1)+'.png'" class="rank-top"/>
                <span v-else>{{(($route.params.page-1)*dataList.pageSize)+(index+1)}}</span>
              </div>
              <router-link :to="'/book/'+item.bookId">
                <img class="bookCover" :src="item.bookImage" :alt="item.bookName">
                <!--<span  class="sign-icon">签约</span>-->
                <i v-if="item.bookAuthorization==2||item.bookAuthorization==3" class="zdy-icon__sign small">签约</i>
              </router-link>
              <div class="rc-bookInfo">
                <div class="info-top">
                  <div class="handle">
                    <button @click="addBookShelf(item.bookId,item.bookName,index)"> {{item.collectionStatus?'已收藏':'收藏'}}</button>
                    <p class="ticket">
                    <span v-if="$route.params.type==='golden'">
                      {{item.tempTicketSum}}金椒
                    </span>
                      <span v-else-if="$route.params.type==='rec'">
                      {{item.tempTicketSum}}小米椒
                    </span>
                      <span v-else-if="$route.params.type==='click'">
                      {{item.tempTicketSum | number}}点击
                    </span>
                      <span v-else-if="$route.params.type==='reward'">
                      {{item.tempTicketSum}}辣椒
                    </span>
                      <span v-else-if="$route.params.type==='debate'">
                      {{item.tempTicketSum | number}}条
                    </span>
                    </p>
                  </div>
                  <div class="bl-top">
                    <div class="b-title">
                      <p >
                        <router-link class="title txt-overflow" :title="item.bookName" :to="'/book/'+item.bookId">{{item.bookName}}</router-link>
                        <i v-if="item.bookCheckStatus==2" class="zdy-icon__vip big"></i>
                        <span class="state b-state" :class="{end:item.bookStatus}">{{!item.bookStatus?"连载中":"已完结"}}</span>
                      </p>
                    </div>
                    <p class="b-writer">
                      <router-link :to="'/reader/'+item.bookWriterId">{{item.writerName}}</router-link>  {{!item.bookWorldCount?0:item.bookWorldCount}} 字
                    </p>
                    <p class="latestInfo">最近更新：{{item.lastUpdateTime | time}}/{{item.lastUpdateChapterName}}</p>
                  </div>
                </div>
                <div class="rc-bookIntro overLine2">
                  {{item.bookIntroduction}}
                </div>
              </div>
            </li>
          </template>
          <zdy-hint v-else></zdy-hint>
      </ul>
      <el-pagination
        class="pbg"
        v-if="dataList.list && dataList.total>dataList.pageSize"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="dataList.pageSize"
        layout="prev, pager, next, jumper"
        :total="dataList.total">
      </el-pagination>
    </div>
</template>

<script type="text/ecmascript-6">
  import { FetchAddBookShelf,FetchGetBookInfo } from '../../api'
    export default{
      props:{
        userInfo:Object
      },
      data(){
          return {
              dataList:{}
          }
      },
      methods:{
        handleCurrentChange(val){
          this.$router.push({params:{page:val}})
        },
        getRank(){
              let self = this,type;
          switch (this.$route.params.type){
            case "golden":
              type = 1;
              break;
            case "rec":
               type = 2;
              break;
            case "click":
              type = 3;
              break;
            case "latest":
              type = 4;
              break;
            case "sell":
              type = 5;
              break;
            case "debate":
              type = 6;
              break;
            case "update":
              type = 7;
              break;
            case "reward":
              type = 8;
              break;
          }
          FetchGetBookInfo({
            type:type,
            page:this.$route.params.page
          },'rank').then(json=>{
            if(json.returnCode===200){
              if(self.$route.params.type==='latest'){
                self.dataList = json.data.newBookRankingList
              }else {
                if(self.$route.params.time==='week'){
                  self.dataList = json.data.week
                }else if(self.$route.params.time==='month'){
                  self.dataList = json.data.month
                }else{
                  self.dataList = json.data.total
                }
              }
            }
          });
        },
        addBookShelf(bid,name,index){
            FetchAddBookShelf(bid,this.$store.state.userInfo.pseudonym,name).then(json=>{
              if(json.returnCode===200){
                this.$message(json.msg);
                this.dataList.list[index].collectionStatus = this.dataList.list[index].collectionStatus?0:1;
              }
            });
        }

      },
      mounted(){
          this.getRank()
      },
      watch:{
          "$route":{
            handler(val,oldVal){
              if(Number(val.params.page)===Number(oldVal.params.page) && Number(oldVal.params.page)!==1){
                this.$router.push({params:{page:1}});
              }else {
                this.getRank()
              }
            },
            deep:true
          }
      },
      computed:{
          page:function () {
            return Number(this.$route.params.page)
          }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .rank-main
    overflow:hidden
    margin-right: 15px
    .tabNav
      height: 60px
      line-height :60px
      text-align: center
      background :#fff
      border-radius :5px
      margin :10px 0
      font-size:18px
      padding:0 77px
      li
        width :124px
        float: left
        margin-right:56px
      li a
        display :block
        position: relative
      li .active
        color : font-color!important
        box-shadow :none
      li .active:before
        content:''
        position: absolute
        width: 0
        height: 0
        border-width: 12px
        border-style: solid
        border-color:#ffccd1 transparent transparent #ffccd1
        bottom: -13px
        left: 50%
        margin-left:-12px
        transform :rotate(45deg)
        border-top-left-radius :8px
      li:last-child
        margin-right:0
.rank-content .main-rank-list
  width 100%
  border-radius 5px
  overflow hidden
  min-height 600px
  background #fff
  padding-bottom: 20px
  .rc-item
    >a
      position relative
      float left
      transition .2s
      height 100%
      overflow hidden
    .rank-top
      margin 0 auto
    .sign-icon
      position absolute
      display inline-block
      text-align center
      width 32px
      height 20px
      line-height 20px
      top 0
      right 0
      border-bottom-left-radius 10px
      border-top-right-radius 7px
      background #75D5F8
      font-size 12px
      color #fff
  .rc-item:hover
    box-shadow: 0 3px 3px #e5e9ef;
  .rc-item
    height: 190px
    border-bottom:1px solid #efefef
    padding:30px 0 18px
    .code
      float left
      width :78px
      height 100%
      line-height :142px
      text-align:center
      font-size :18px
      color :#666
      font-weight :bold
    .bookCover
      float: left
      width :108px
      height :100%
      border-radius :7px
      /*margin-top:6px*/
    .rc-bookInfo
      overflow :hidden
      height :142px
      padding:0 26px
      position: relative
      .info-top
        height :90px
        .bl-top
          overflow hidden
          .b-writer,.latestInfo
            line-height:28px
            font-size: 14px
            color :#666
          .b-title
            font-size: 17px
            .title
              max-width 160px
              vertical-align middle
            .state
              font-size 14px
              color #2BF6C7
              margin-left 20px
          .b-writer
            color #999
            >a
              margin-right 26px
              color #666
            span
              font-size:13px
              font-weight :normal
              color: #64f8d6

        .handle
          float :right
          width :92px
          text-align :center
          margin-top:2px
          button
            height : 28px
            border-radius :24px
            background :#f77583
            color: #fff
            width :70px
            line-height: 28px
            font-size :14px
          .ticket
            font-size :16px
            color :#f77583
            margin-top :10px
      .rc-bookIntro
        vertical-align :bottom
        font-size: 14px
        line-height :1.8em
        width :100%
        height :54px
        word-break break-all
</style>
