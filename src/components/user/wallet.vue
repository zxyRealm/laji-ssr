<template>
    <div class="wrapper pl18">
        <div class="wallet-wrapper bsw">
          <div class="my-rich">
            <div class="mr-top-wrap">
              <span>账号：{{$store.state.userInfo.userName}}</span>
              <router-link target="_blank" to="/charge" >充值</router-link>
            </div>
            <div class="rich-detail">
              <span class="rd-item">辣椒 {{$store.state.userInfo.userMoney}}</span>
              <span class="rd-item">金椒 {{$store.state.userInfo.userGoldenTicket}}</span>
              <span class="rd-item">小米椒 {{$store.state.userInfo.userRecommendTicket}}</span>
              <span class="rd-item">辣椒券 {{$store.state.userInfo.userReadTicket}}</span>
            </div>
          </div>
          <div class="consume-wrapper">
            <div class="wallet-nav">
              <span class="sub-title">交易记录</span>
              <router-link to="/user/wallet/charge">充值记录</router-link>
              <router-link to="/user/wallet/consume">订阅记录</router-link>
              <router-link to="/user/wallet/pepper">金椒记录</router-link>
              <router-link to="/user/wallet/reward">打赏记录</router-link>
              <router-link to="/user/wallet/annuum">小米椒记录</router-link>
            </div>
            <!--充值记录-->
            <div v-show="$route.name==='walletCharge'" class="table-wrap">
              <template v-if="recordList && recordList.list">
                <table v-if="recordList.list.length>0" class="record-table">
                  <thead>
                    <tr>
                      <th width="160">时间</th>
                      <th>充值途径</th>
                      <th>金额</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <template v-for="(item,index) in recordList.list">
                    <tr >
                      <td>{{item.dateTimes | time('long')}}</td>
                      <td>{{item.rechargeType | type}}</td>
                      <td>{{item.money}}</td>
                      <td>{{item.isOK?'成功':'失败'}}</td>
                    </tr>
                  </template>
                </table>
                <zdy-hint v-else></zdy-hint>
              </template>
            </div>
            <!--订阅记录-->
            <div v-show="$route.name==='walletConsume'" class="table-wrap">
              <template v-if="recordList && recordList.list">
                <el-table
                  v-if="recordList.list.length"
                  class="record-table"
                  :data="recordList.list"
                  style="width: 100%">
                  <el-table-column
                    label="时间"
                    align="left"
                    width="180">
                    <template slot-scope="scope">
                      {{scope.row.subscriptionDateTime|time('long')}}
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="bookChapterName"
                    label="章节名"
                    align="left"
                    show-overflow-tooltip
                    width="220">
                  </el-table-column>

                  <el-table-column
                    prop="bookName"
                    align="left"
                    show-overflow-tooltip
                    label="作品名称">
                    <template slot-scope="scope">
                      <router-link :to="'/book/'+scope.row.bookId">{{scope.row.bookName}}</router-link>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="subscriptionPrice"
                    label="辣椒"
                    align="center"
                    width="100">
                  </el-table-column>
                </el-table>
                <zdy-hint v-else></zdy-hint>
              </template>
            </div>
            <!--打赏记录-->
            <div v-show="$route.name==='walletReward'" class="table-wrap">
              <template v-if="recordList && recordList.list">
                <table v-if="recordList.list.length>0"  class="record-table">
                  <thead>
                    <tr>
                      <th width="160">时间</th>
                      <th width="250">作品名称</th>
                      <th width="160">数量</th>
                    </tr>
                  </thead>

                  <template v-for="(item,index) in recordList.list">
                    <tr >
                      <td>{{item.giveDateTime | time('long')}}</td>
                      <td>
                        <router-link class="txt-overflow" :to="'/book/'+ item.bookId" target="_blank" :title="item.bookName">
                          {{item.bookName}}
                        </router-link>
                      </td>
                      <td>{{item.spicyiTicketCount}}</td>
                    </tr>
                  </template>
                </table>
                <zdy-hint v-else></zdy-hint>
              </template>
            </div>

            <!--小米椒记录--> <!--金椒记录-->
            <div v-show="$route.name==='walletAnnuum' || $route.name === 'walletPepper'" class="table-wrap">
              <template v-if="recordList && recordList.list">
                <table v-if="recordList.list.length>0"  class="record-table">
                  <thead>
                    <tr>
                      <th width="160">投喂时间</th>
                      <th width="250">作品名称</th>
                      <th width="160">投喂数量</th>
                      <th>状态</th>
                    </tr>
                  </thead>

                  <template v-for="(item,index) in recordList.list">
                    <tr >
                      <td>{{ item.giveDateTime | time('long')}}</td>
                      <td>
                        <router-link class="txt-overflow" :to="'/book/'+ item.bookId" target="_blank" :title="item.bookName">
                          {{item.bookName}}
                        </router-link>
                      </td>
                      <td>{{!item.recommendTicketCount?item.goldenTicketCount:item.recommendTicketCount}}</td>
                      <td>成功</td>
                    </tr>
                  </template>
                </table>
                <zdy-hint v-else></zdy-hint>
              </template>
            </div>
            <zdy-hint v-if="recordList==null"></zdy-hint>
            <el-pagination
              class="pbg"
              v-if="recordList && recordList.list && recordList.total>recordList.pageSize"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="recordList.pageSize"
              layout="prev, pager, next, jumper"
              :total="recordList.total">
            </el-pagination>
          </div>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
  import { FetchMineWallet } from '../../api'
    export default{
      data() {
        return {
          activeName: 'charge',
          recordList:{}
        };
      },
      methods: {
        handleCurrentChange(page){
          this.$router.push({ params:{ page: page }})
        },
        getRecordList(){
            let type = this.$route.name.replace('wallet','');
            FetchMineWallet(type,this.page,this.$cookie('user_id')).then(json=>{
              if(json.returnCode===200 || !json.data){
                this.recordList = json.data;
              }
            });
        }
      },
      mounted(){
        this.getRecordList()
      },
      watch:{
        "$route":function (val,oldVal) {
          if(val.name!==oldVal.name){
              this.$router.push({params:{page:1}})
          }
          this.getRecordList()
        }
      },
      computed:{
        page:{
          get: function () {
            return parseInt(this.$route.params.page);
          },
          set: function () {
              return parseInt(this.$route.params.page);
          }
        }
      },
      filters:{
        type:function (val) {
          let methods;
          if(val===110){
              methods = '支付宝'
          }else if(val===111){
              methods = '微信支付'
          }else if(val===112){
              methods = 'IOS支付'
          }else {
              methods = '其他'
          }
          return methods
        },
        type2:function (val,unit) {
          let txt;
          if(val===1){
            txt = unit!=='des'?'赠送':'金椒'
          }else if(val===2){
           txt = unit!=='des'?'打赏':'辣椒'
          }else if(val===3){
            txt = unit!=='des'?'订阅':'辣椒'
          }else if(val===4){
            txt = unit!=='des'?'赠送':'小米椒'
          }
          return txt
        }
      }
    }

</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.wallet-wrapper
  background: #ffffff
  border-radius :5px
  overflow hidden
  .table-wrap
    padding 0 10px
    .el-table
      &::after
        width 0
      th
        text-align center
  /*导航栏*/
  .wallet-nav
    height 42px
    line-height 42px
    font-size 16px
    padding 0 16px
    >span
      font-size 18px
      margin-right 16px
    >a
      padding 0 16px
      &.active
        box-shadow none
  .my-rich
    padding : 0 16px 24px
    border-bottom :1px solid #efefef
    margin-bottom :20px
    .mr-top-wrap
      height :45px
      line-height :45px
      font-size :20px
      margin:12px 0 30px
      a
        float: right
        width :74px
        text-align center
        border-radius :5px
        color:#fff
        background :#f77583
        font-size 18px
        &:hover
          color #fff!important
    .rich-detail
      font-size 18px
      .rd-item
        padding:10px 0 10px 45px
        /*font-size:14px*/
        background :url("../../assets/image/icon/pepper@x1_1.png") no-repeat left center
        margin-right :50px
        &:nth-child(2)
          background-image :url("../../assets/image/icon/pepper@x1_3.png")
        &:nth-child(3)
          background-image :url("../../assets/image/icon/pepper@x1_2.png")
        &:last-child
          background-image :url("../../../static/img/icon/reading-ticket@2_01.png")
          margin-right 0
  .consume-wrapper
    .el-tabs__header
      padding :0 16px
    .record-table
      width :760px
      margin:0 auto
      border-collapse:separate
      border :none
      border-radius :10px
      margin-top:16px
      margin-bottom 20px
      text-align center
      tr
        height: 53px
        th,td
          border-bottom:1px solid #efefef!important
          font-weight normal
          font-size 14px
          background #fff
          .cell
            background #fff
            padding 0 12px!important
          >a
            display inline-block
            max-width 200px

      tr:last-child
        th,td
          border:none
</style>
