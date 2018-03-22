<template>
    <div class="author-income-wrapper" style="background: #fff">
      <div class="author-tabs">
        <router-link :to="'/author/income/all'">我的收入</router-link>
        <router-link :to="'/author/income/mon'">我的月报</router-link>
        <a href="javascript:0;" class="remuneration" @click="centerDialogVisible=true">申请稿酬</a>
      </div>

      <div class="income-wrap">
        <div class="date-range-wrapper bsw br5">
          选择时间：<el-date-picker
            v-show="$route.name==='allIncome'"
            :picker-options="monthOption1"
            @change="changeDate"
            v-model="allDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>

          <el-date-picker
            v-show="$route.name==='monIncome'"
            :picker-options="monthOption2"
            @change="changeDate"
            v-model="monDate"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选取月份">
          </el-date-picker>
        </div>
        <div class="echarts-wrapper clear bsw">
          <div class="echarts-main">
            <div id="ichart-all" class="my-charts"></div>
          </div>
        </div>
        <template v-if="$route.name==='allIncome'">
          <div class="author-table-wrapper">
            <div class="table-box bsw">
              <el-row class="table">
                <el-col :span="10">收入明细：</el-col>
                <el-col :span="14" class="tr">总收入：{{chartData.total}}</el-col>
              </el-row>
              <!--<table>-->
                <!--<tr>-->
                  <!--<td width="516" colspan="2" class="tl"></td>-->
                  <!--<td width="338px" class="tr" colspan="3"></td>-->
                <!--</tr>-->
              <!--</table>-->
              <el-table
                :data="tableList"
                @expand-change="rowExpand"
                style="width: 100%">
                <el-table-column
                  label="作品"
                  width="220"
                  header-align="center"
                  algin="left"
                  show-overflow-tooltip
                  prop="bookName">
                  <template slot-scope="scope">
                      <router-link :to="'/book/'+scope.row.bookid" :target="'_blank'">
                        {{scope.row.bookName}}
                      </router-link>
                  </template>
                </el-table-column>

                <el-table-column
                  label="订阅"
                  width="140"
                  align="center"
                  prop="subscribe">
                </el-table-column>

                <el-table-column
                  label="打赏"
                  width="140"
                  align="center"
                  prop="areward">
                  <template slot-scope="scope">
                    {{scope.row.areward?scope.row.areward:0}}
                  </template>
                </el-table-column>

                <el-table-column
                  label="小米椒"
                  width="140"
                  align="center"
                  prop="recommend">
                </el-table-column>

                <el-table-column
                  label="订阅人数"
                  align="center"
                  width="140"
                  prop="subscribeCount">
                </el-table-column>

                <el-table-column
                  label="更多"
                  width="83"
                  type="expand">
                  <template slot-scope="props">
                    <el-table
                      v-if="props.row.child"
                      :data="props.row.child.list"
                      :show-header="false"
                      style="width: 100%">
                      <el-table-column
                        width="180"
                        prop="bookChapterName">
                      </el-table-column>

                      <el-table-column
                        width="140"
                        align="center"
                        prop="sumPrice">
                      </el-table-column>
                      <el-table-column
                        width="280"
                        align="left"
                        >
                      </el-table-column>

                      <el-table-column
                        width="140"
                        align="center"
                        prop="sumPersionCount">
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      v-if="props.row.child && props.row.child.total>props.row.child.pageSize"
                      class="pbg"
                      :style="{paddingRight:'35px!important'}"
                      @current-change="handleCurrentChange($event,props.row)"
                      :current-page.sync="props.row.child.pageNum"
                      :page-size="props.row.child.pageSize"
                      layout="prev, pager, next, jumper"
                      :total="props.row.child.total">
                    </el-pagination>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="author-table-wrapper">
            <div class="table-box bsw">
              <el-row>
                <el-col>收入明细：</el-col>
                <el-col>总收入：{{chartData.total}}</el-col>
              </el-row>
              <el-row>
                <el-col>作品</el-col>
                <el-col>订阅</el-col>
                <el-col>打赏</el-col>
                <el-col>小米椒</el-col>
                <el-col>第三方</el-col>
                <el-col>全勤</el-col>
                <!--<tr>-->
                  <!--<td >作品</td>-->
                  <!--<td width="120px">订阅</td>-->
                  <!--<td width="120px">打赏</td>-->
                  <!--<td width="120px">小米椒</td>-->
                  <!--<td width="120px">第三方</td>-->
                  <!--<td width="138px">全勤</td>-->
                <!--</tr>-->
              </el-row>
              <!--<table>-->
                <!--<tr>-->
                  <!--<td width="516" colspan="3" class="tl">收入明细：</td>-->
                  <!--<td width="338px" class="tr" colspan="4">总收入：{{chartData.total}}</td>-->
                <!--</tr>-->
                
              <!--</table>-->
              <table class="content-table">
               
                <tr v-for="item in tableList" :key="item.bookid">
                  <td width="224">
                    <p class="title txt-overflow">
                      <router-link :to="'/book/'+item.bookid" :target="'_blank'">
                        {{item.bookName}}
                      </router-link>
                    </p>
                    <!--<i class="zdy-icon__vip fl"></i>-->
                  </td>
                  <td width="120">{{item.bubscribe}}</td>
                  <td width="120">{{item.pepper?item.pepper:0}}</td>
                  <td width="120">{{item.millet}}</td>
                  <td width="120">{{item.thirdPart}}</td>
                  <td width="130">{{item.checkworkattendance}}</td>
                </tr>
              </table>
            </div>
          </div>
        </template>
      </div>

      <el-dialog
        title=" "
        custom-class="reply-remuneration"
        top="30vh"
        :show-close="false"
        :visible.sync="centerDialogVisible"
        center>
        <div class="msg">
            您的稿酬由我们的小编一对一负责！稿酬的申请及详细情况了解请与您的专人编辑联系吧。添加时请备注您的笔名！<br/>
          <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=3310635242&site=qq&menu=yes">
            <img border="0" style="display: inline-block;margin-top: 15px;" src="http://wpa.qq.com/pa?p=2:3310635242:41" alt="点击这里给我发消息" title="点击这里给我发消息"/>
          </a>
        </div>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import echarts from 'echarts'
  import { FetchNetTime,FetchAuthorIncome,FetchLatestMonth } from '../../api'
    export default{
      data(){
            return {
              monthOption1:{
                disabledDate(time) {
                  return time.getTime() > Date.now();
                }
              },
              monthOption2:{
                disabledDate(time) {
                  return time.getTime() > Date.now();
                }
              },
              centerDialogVisible:false,
              activeTab:'date',
              option:{
                title : {
                  text: '总收入：',
                  x:'left',
                  textStyle:{
                      fontWeight:400
                  }
                },
                tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                  orient: 'vertical',
                  left: '76%',
                  padding:[20,10],
                  itemGap:30,
                  itemWidth:10,
                  itemHeight:10,
                  height:200,
                  textStyle:{
                     padding:[0,35]
                  },
                  data:[]
                },
                color:['#FF96A1','#96D9FF','#A296FF','#FF6DEE','#FFA54E'],
                series : [
                  {
                    type: 'pie',
                    radius : '70%',
                    center: ['260px', '50%'],
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    },
                    data:[]
                  }
                ]
              },
              allDate:'',
              monDate:'',
              tableList:[],
              incomeChart:{},
              chartData:{},
              maxMonth:''
            }
        },
      methods:{
          changeDate(date){
            if(date){
              this.getAllDate(date,1)
            }
          },
          formatStr(val){
            let Str,
            date =()=>{
              let arr = this.allDate.split('/');
              return arr[0]+'-'+parseInt(arr[1])
            };
            if(val){
              Str = JSON.parse(JSON.parse(JSON.stringify(val)))
            }
            return !Str?0:(!Str[date()]?0:Str[date()])
          },
          formData(val){
              let obj = {
                sArr:[],
                lArr:[],
                total:0, //总收入
                count:{
                  sub:0, //订阅
                  rec:0, //推荐
                  reward:0, //打赏
                  other:0, //第三方
                  daily:0 //全勤
                }
              };
              if(this.$route.name==='monIncome'){
                val.forEach((item)=>{
                  obj.count.sub = this.add(obj.count.sub,item.bubscribe);
                  obj.count.rec = this.add(obj.count.rec,item.millet);
                  obj.count.reward = this.add(obj.count.reward,item.pepper);
                  obj.count.other = this.add(obj.count.other,item.thirdPart);
                  obj.count.daily = this.add(obj.count.daily,item.checkworkattendance);
                });
              }else {
                val.forEach((item)=>{
                  obj.count.sub += item.subscribe;
                  obj.count.rec += item.recommend;
                  obj.count.reward += item.areward;
                  obj.count.other += item.diShanFang;
                  obj.count.daily += item.kaoqin;
                });
              }
              let des = this.$route.name==='allIncome'?'辣椒':''
              obj.sArr.splice(0,0,
                {name:'订阅 +' + obj.count.sub + des,value:obj.count.sub},
                {name:'打赏 +' +obj.count.reward + des,value:obj.count.reward},
                {name:'小米椒 +' + obj.count.rec + des,value:obj.count.rec},
                {name:'第三方 +' + obj.count.other,value:obj.count.other},
                {name:'全勤 +' + obj.count.daily,value:obj.count.daily}
              );
              obj.lArr.splice(0,0,
                {name:'订阅 +' + obj.count.sub + des,icon:'diamond'},
                {name:'打赏 +' + obj.count.reward + des,icon:'diamond'},
                {name:'小米椒 +' + obj.count.rec + des,icon:'diamond'},
                {name:'第三方 +' + obj.count.other,icon:'diamond'},
                {name:'全勤 +' + obj.count.daily,icon:'diamond'},
              );
              if(this.$route.name==='allIncome'){
                obj.sArr = obj.sArr.slice(0,3);
                obj.lArr = obj.lArr.slice(0,3);
                obj.total += obj.count.sub + obj.count.rec + obj.count.reward ;
                obj.total = obj.total + '辣椒'
              }else {
                obj.total += obj.count.sub + obj.count.rec + obj.count.reward + obj.count.other + obj.count.daily;
              }
              return obj;
          },
          getNowDate(){
            if(this.$route.name==='allIncome'){
              FetchNetTime().then(json=>{
                if(json.returnCode===200){
                  let date = new Date(json.data.beijing);
                  let year = date.getFullYear();
                  let mon = date.getMonth()>=9?(date.getMonth()+1):'0' + (date.getMonth()+1);
                  let day = date.getDate()>9?date.getDate():'0' + date.getDate();
                  this.allDate = [year+'-'+mon+'-01',year+"-"+mon+"-"+day];
                  this.getAllDate(this.allDate);
                }
              });
            }else if(this.$route.name==='monIncome'){
                FetchLatestMonth().then(time=>{
                  if(time.returnCode===200){
                    this.monthOption2 = {
                      disabledDate(t) {
                        return t.getTime() > new Date(time.data.replace(/-/g,'/'));
                      }
                    };
                    this.monDate = time.data;
                    this.getAllDate(this.monDate);
                  }
                });
            }
  
          },
          getAllDate(date,page){
            page = page | 1;
            let start;
            let type = this.$route.name;
            let data = ()=> {
                if(type==='allIncome'){
                    return {
                      startdate:date[0] +' 00:00:00',
                      enddate:date[1] +' 23:59:59',
                      startpage:page
                    }
                }else if(type==='monIncome'){
                   this.tableList = [];
                   start = date.split('-');
                   return {
                     year:start[0],
                     month:start[1]
                   }
                }
            };
            console.log(type,data());
            FetchAuthorIncome(type,data()).then(json=>{
              if(json.returnCode===200 || !json.data){
                if(type==='allIncome' && json.data){
                  json.data.Alldata.forEach((item,index)=>{
                    item.order = index;
                    if(item.recommend){
                      item.recommend = item.recommend*10
                    }
                  });
                  this.tableList = JSON.parse(JSON.stringify(json.data.Alldata));
                  let val = this.formData(this.tableList);
                  this.chartData = val;
                  this.option.title.text = '总收入: ' + val.total;
                  this.option.series[0].data = val.sArr;
                  this.option.legend.data = val.lArr;
                  this.incomeChart.setOption(this.option);
                }else if(type==='monIncome'){
                  if(json.data){
                    json.data.forEach((item)=>{
                      item.pepper = item.pepper.toFixed(2);
                      item.millet = item.millet.toFixed(2);
                      item.bubscribe = item.bubscribe.toFixed(2);
                      item.thirdPart = item.thirdPart.toFixed(2);
                      item.checkworkattendance = item.checkworkattendance.toFixed(2);
                    });
                  }
                  this.tableList = JSON.parse(JSON.stringify(json.data?json.data:[]));
                  let list = this.formData(this.tableList);
                  this.chartData = list;
                  this.option.title.text = '总收入: ' + list.total;
                  this.option.series[0].data = list.sArr;
                  this.option.legend.data = list.lArr;
                  this.incomeChart.setOption(this.option);
                }
              }
            });
        },
          rowExpand(row,expand){
              if(expand){
                this.getChapterDetail(row,1)
              }
          },
          getChapterDetail(row,page){
              if(this.allDate){
                  FetchAuthorIncome('chapter',{
                    startdate:this.allDate[0]+' 00:00:00',
                    enddate:this.allDate[1]+' 23:59:59',
                    bookid:row.bookid,
                    startpage:!page?1:page
                  }).then(json=>{
                    if(json.returnCode===200){
                      this.$set(this.tableList[row.order],'child',json.data)
                    }
                  })
              }
          },
          handleCurrentChange(page,val){
            this.getChapterDetail(val,page)
          },
//        浮点数相加
          add(a, b) {
          var c, d, e;
          try {
            c = a.toString().split(".")[1].length;
          } catch (f) {
            c = 0;
          }
          try {
            d = b.toString().split(".")[1].length;
          } catch (f) {
            d = 0;
          }
          return e = Math.pow(10, Math.max(c, d)),((this.mul(a, e) + this.mul(b, e)) / e);
        },
//        浮点数相乘
          mul(a, b) {
          var c = 0,
            d = a.toString(),
            e = b.toString();
          try {
            c += d.split(".")[1].length;
          } catch (f) {}
          try {
            c += e.split(".")[1].length;
          } catch (f) {}
          return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        }
      },
      mounted(){
          this.incomeChart = echarts.init(document.getElementById('ichart-all'));
          this.incomeChart.setOption(this.option);
          this.$nextTick(()=>{
            this.getNowDate();
          });
      },
      watch:{
          '$route':function () {
           this.getNowDate()
          }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.el-row
  &.table
      padding 0 20px
      height 62px
      line-height 62px
      font-size 16px
      border-bottom 1px solid #efefef
.income-wrap
  padding 0 10px
.el-input__icon
  position relative!important
.date-range-wrapper
  height 60px
  margin-bottom 14px
  background-color #fff
  line-height 60px
  font-size 16px
  padding:0 20px
  margin-top 20px
  >input.date-range-input
    display inline-block
    width 80%
    height 100%
    font-size 16px
    font-family sans-serif
    color:#666;
  >i
    display inline-block
    font-size 22px
    color #666
    vertical-align middle
    line-height 60px

.echarts-wrapper
  margin 20px 0
  background:#fffafa
  border-radius 4px
  .echarts-main
    padding:20px 30px
    height 288px
    .my-charts
      width 668px
      height 248px
  .echarts-description
    overflow hidden
    height 100%
/*.el-tabs__content  */
.author-table-wrapper
  min-height 380px
  margin-bottom 100px
  >.table-box
    background #fff
    border-radius 7px
    .content-table
      width :96%
      margin 0 auto
      border-radius :4px
      .title
        float left
        display inline-block
        max-width :180px
        line-height 1em
        padding-left:14px
    table
      width 100%
      background #fff
      font-size 14px
      word-break:break-all
      border-radius 7px
      tr
        border-bottom :1px solid #efefef
      td
        height 62px
        padding:0 10px
    table:first-child
      tr>td:first-child
        padding-left 20px
      tr>td:last-child
        padding-right 20px
      .el-table__expanded-cell
        tr>td:last-child
          padding-right 10px
    .content-table
      table-layout fixed
      tr>td:first-child
        padding-left 0
  .el-table__column-resize-proxy
    border none
  .el-table__expanded-cell
    background #fff
    box-shadow none
    padding 0 66px 0 40px!important
    &:hover
        background  #fff!important
  .el-table
    border none
    .el-table__header-wrapper
      th
        background #fff
      thead
        div
          background #fff
          font-weight normal
          line-height 60px
    &::after
      width 0
    &::before
      height 0
.author-tabs
  padding 0 18px
  height 40px
  line-height 40px
  font-size 18px
  >a
    display inline-block
    float left
    height 100%
    margin-right 34px
    color rgb(165, 132, 131)
    &.remuneration
        float right
        color #F73D51
        margin-right 0

.reply-remuneration
    width 400px!important
    .el-dialog__body
      padding-top 20px
      .msg
         font-size 16px
         padding 0 20px
         text-align center
</style>
