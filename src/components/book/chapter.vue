<template>
    <div  class="container-wrap" :style="{backgroundColor:intercalate[setData.theme].bgColor2}">
    <div v-wechat-title="chapterInfo.chapterTitle+'－'+chapterInfo.bookTitle+'－辣鸡小说'" class="chapterWrap clear">
      <div class="subNavWrap clear">
        <div class="fl">当前位置：</div>
        <div class="sub-nav">
          <el-breadcrumb class="chapter-detail"  separator-class="el-icon-arrow-right" :style="{color:intercalate[setData.theme].bgColor2}">
            <el-breadcrumb-item :style="{color:'#747474'}" :to="{ path: '/' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/class_total/'+bookInfo.bookClassificationId+'/0/0/0/0/1/0'}" >{{bookInfo.classificationName}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="'/book/'+bookInfo.bookId">{{chapterInfo.bookTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="chapter-main clear">
        <div class="chapter-read-box noSelect" :style="theme">
          <!--章节内容主体区-->
          <div id="chapterCnt">
            <div class="read-hd">
              <h3 class="chapter-title">
                  {{chapterInfo.chapterTitle}}
              </h3>
              <p :style="{color:setData.theme==3?intercalate[setData.theme].color3:null}">
                <span>书名：
                  <router-link class="txt-overflow title vabt" :to="'/book/'+bookInfo.bookId">{{chapterInfo.bookTitle}}</router-link>
                </span>
                <span>作者：
                  <router-link class="txt-overflow name vabt" :to="'/reader/'+bookInfo.bookWriterId">
                     {{bookInfo.writerName}}
                  </router-link>
                </span>
                <span>字数：{{chapterInfo.chapterLength}}</span>
                <span>更新时间：{{ chapterInfo.createChapterTime | time('long')}}</span>
              </p>
            </div>
            <div class="read-bd" id="ChapterRead" :style="{fontSize:setData.size+'px',fontFamily:setData.family}">
              <rxx-badge v-model="activeNames" :style="{minHeight:!isRead?'400px':'auto'}" accordion>
                <template v-for="(item,$index) in chapterInfo.chapterData">
                  <rxx-badge-item ref="commentItem" @handleClick="getPaComment($index)" :color="setData.theme==3?(item.count>0?intercalate[setData.theme].bgColor4:'#c8c8c8'):null"  :value="item.count" :uuid="item.id" :content="item.content" accordion>
                    <div class="review-list clear">
                      <ul v-if="chapterComment.total" class="review-ul">
                        <li v-for="(item2,$index2) in chapterComment.list" class="review-item clear">
                          <div class="avatar-wrap">
                            <router-link class="avatar" :to="'/reader/'+item2.userId">
                              <img :src="item2.userHeadPortraitURL" :alt="item2.userName">
                            </router-link>
                          </div>
                          <div class="comments-wrap" style="border-top:none" >
                            <div class="info">
                              <p>
                                <span class="nickname">{{item2.pseudonym}}</span>
                                <i class="zdy-icon__sex" :class="{girl:item2.userSex}"></i>
                                <zdy-icon__user_level class="vat" :grade="item2.userGrade"></zdy-icon__user_level>
                              </p>
                              <span class="date fr font12">{{item2.commentDateTime|time('long')}}</span>
                            </div>
                            <div class="context">
                              {{item2.commentContext}}
                            </div>
                            <p class="clear"><i class="zdy-icon__zan"  @click="addThumbs($index2,item2.pid)" :class="{past:item2.isthumbs}" >{{item2.thumbsCount?item2.thumbsCount:0}}</i></p>
                          </div>
                        </li>
                      </ul>
                      <div class="chapter-reply clear">
                        <el-col class="font14" :span="8">
                          <span>共{{chapterComment.total}}条吐槽</span>
                          <span v-if="chapterComment.total>chapterComment.pageSize" class="clear ml10">
                            <i @click="prePage($index)" class="el-icon el-icon-arrow-left" :class="{'disable':chapterComment.pageNum==1}"></i>
                            {{chapterComment.pageNum}}/{{chapterComment.pages}}
                            <i @click="nextPage($index)" class="el-icon el-icon-arrow-right" :class="{'disable':chapterComment.pageNum==chapterComment.pages}"></i>
                          </span>
                        </el-col>
                        <el-col class="tr" :span="16">
                          <div class="form-reply clear">
                            <el-col :span="18">
                              <div class="el-input">
                                <input type="text" @focus="isFocus=true" @blur="isFocus=false" class="el-input__inner" placeholder="吐槽一下吧（50字以内）" @keydown="formatContent" v-model="FormReply.content">
                              </div>
                            </el-col>
                            <el-col :span="6">
                              <div class="el-button br0" @click.prevent="submitForm($index)">发布吐槽</div>
                            </el-col>
                          </div>
                        </el-col>
                      </div>
                    </div>
                  </rxx-badge-item>
                </template>
                <div class="shadow-wrap" :class="' bgColor'+(setData.theme+1)" v-if="!isRead"></div>
              </rxx-badge>
              <div class="read-reward-wrap">
                <a href="javascript:;" @click="myConsume('reward')" :style="{backgroundColor:setData.theme==3?intercalate[setData.theme].bgColor3:null,borderColor:setData.theme==3?intercalate[setData.theme].brColor3:null}">
                  <div>
                    {{bookInfo.rewardCount>999999?'999999+':(!bookInfo.rewardCount?'0':bookInfo.rewardCount)}}
                    <p>打赏</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <!--作者打赏区-->
          <!--<div class="C_cft clear">-->
            <!--章节内容侧边栏区域-->
          <div :style="{top:barStyle.top}" class="read-side-bar-box">
              <div class="read-side-bar read-side-bar-left">
                <!--章节目录-->
                <el-popover
                  ref="popover1"
                  placement="right-start"
                  width="600"
                  popper-class="boxShadow"
                  v-model="visible"
                  trigger="click">
                  <div class="catalog-child">
                    <h3 class="title">目录</h3>
                    <div class="collapse-wrap scrollBar">
                      <template v-if="chapterList.list" >
                        <el-collapse v-model="chapterList.activeNames">
                            <el-collapse-item v-for="(item,$index) in chapterList.list" :key="$index" :name="item.volumeId">
                                <template slot="title">{{item.volumeName}}</template>
                                <div v-for="(item2,$index2) in item.resultList" class="collapse-item-link txt-overflow v-middle">
                                  <router-link :to="'/chapter/'+item2.id" @click='visible=false' class="txt-overflow v-item" target="_blank" >{{item2.chapterTitle}}</router-link>
                                  <i v-if="item2.chapterIsvip" class="zdy-icon__vip"></i>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                      </template>
                    </div>
                  </div>
                </el-popover>
               
                <el-button class="btn clr9" v-popover:popover1  :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <div class="catalog">
                    <i></i><p>目录</p>
                  </div>
                </el-button>
                <!--页面设置-->
                <el-popover
                  ref="popover2"
                  placement="right-start"
                  width="400"
                  trigger="click">
                  <div class="setup-wrap">
                    <!--<h3 class="title">设置</h3>-->
                    <p class="sw-title">主题设置</p>
                    <el-row class="theme">
                        <el-radio-group size="small" v-model="setData.theme">
                          <el-radio-button :label="0" :style="{backgroundColor: intercalate[0].bgColor}">&nbsp;</el-radio-button>
                          <el-radio-button :label="1" :style="{backgroundColor: intercalate[1].bgColor}">&nbsp;</el-radio-button>
                          <el-radio-button :label="2" :style="{backgroundColor: intercalate[2].bgColor}">&nbsp;</el-radio-button>
                          <el-radio-button :label="3" :style="{backgroundColor: intercalate[3].bgColor}">&nbsp;</el-radio-button>
                        </el-radio-group>
                    </el-row>
                    <p class="sw-title">字体大小</p>
                    <el-row class="font-size">
                      <el-input-number :step="2" :min="14" :max="42" size="small" v-model="setData.size"></el-input-number>
                    </el-row>
                    <p class="sw-title">正文字体</p>
                    <el-row class="font-family">
                      <el-radio-group size="small" v-model="setData.family">
                        <el-radio-button label="Microsoft YaHei">微软雅黑</el-radio-button>
                        <el-radio-button label="SimSun">宋体</el-radio-button>
                        <el-radio-button label="KaiTi">楷体</el-radio-button>

                      </el-radio-group>
                    </el-row>
                    <p class="sw-title">自动订阅</p>
                    <el-row class="subscribe">
                      <el-switch
                        @change="getAutoState"
                        v-model="automaticTake"
                        active-color="#13ce66"
                        inative-color="#ff4949">
                      </el-switch>
                    </el-row>
                  </div>
                </el-popover>
               
                <el-button class="btn clr9"  v-popover:popover2  :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <div class="setUp">
                    <i></i><p>设置</p>
                  </div>
                </el-button>
                <!--收藏-->
                <el-button @click="addBookShelf" class="btn clr9" :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <div class="house">
                    <i :class="{saved:bookInfo.collectionStatus}"></i>
                    <p>{{bookInfo.collectionStatus?'已收藏':'收藏'}}</p>
                  </div>
                </el-button>
                <el-button class="btn" :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <a class="clr9" @click="addBookComment">
                    <div class="bComment">
                      <i></i><p>书评</p>
                    </div>
                  </a>
                </el-button>
                <el-button class="btn share-wrapper" :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <a class="clr9">
                    <div class="share" >
                      <i></i><p>分享</p>
                    </div>
                  </a>
                  <div class="bdsharebuttonbox" data-tag="share_1">
                    <a class="bds_tsina" data-cmd="tsina"></a>
                    <a class="bds_qzone" data-cmd="qzone"></a>
                    <a class="bds_sqq" data-cmd="sqq"></a>
                    <a class="bds_weixin" data-cmd="weixin"></a>
                  </div>
                </el-button>
              </div>
              <!--<div class="read-side-bar read-side-bar-right" :style="{backgroundColor:intercalate[setData.theme].bgColor}">-->
              <!--</div>-->
              <div class="read-side-bar read-side-bar-bottom">
                <el-button class="btn clr9" @click="myConsume('reward')" :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <div class="reward">
                    <i></i><p>辣椒</p>
                  </div>
                </el-button>
                <el-button class="btn clr9" @click="myConsume('recommend')" :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <div class="recommend">
                    <i></i><br><span>小米椒</span>
                  </div>
                </el-button>
                <el-button class="btn clr9" @click="myConsume('ticket')" :style="{backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <div class="gTicket">
                    <i></i><p>金椒</p>
                  </div>
                </el-button>
                <el-button @click="getBack" class="btn clr9" :style="{visibility:isShow.state1,backgroundColor:intercalate[setData.theme].bgColor,borderColor:intercalate[setData.theme].brColor}">
                  <div class="bTop">
                    <i class="el-icon"></i>
                  </div>
                </el-button>
              </div>
            </div>
          <!--</div>-->
        </div>
        <div class="author-say" :style="theme">
          {{bookInfo.writerName}} 说：<span v-html="chapterInfo.authorWords?chapterInfo.authorWords:'这个作者很懒，什么都没写 (╯︵╰)'"></span>
        </div>
        <div class="chapter-read-page">
          <span :class="{disable:!chapterList.preCid,night:setData.theme===3}" :style="theme"  @click="skipPage(chapterList.preCid)">上一章</span>
          <span @click="$router.push({path:'/chapter-list/'+bookInfo.bookId})" :style="theme" class="center">目录</span>
          <span :class="{disable:!chapterList.nextCid,night:setData.theme===3}" :style="theme" @click="skipPage(chapterList.nextCid)">下一章</span>
        </div>
      </div>
    </div>

      <el-dialog
        modalClass="buy-modal-wrap"
        :close-on-click-modal="false"
        :lock-scroll="false"
        title="本章为VIP章节，需购买后阅读"
        :visible.sync="dialogFormVisible"
        customClass="buy-dialog-wrap">
          <p class="user-rich">价格：
            {{parseInt(chapterInfo.chapterLength*3/1000)}}
            辣椒，余额{{$store.state.userInfo.userMoney}}辣椒
          </p>
          <el-form :model="buyForm">
            <div class="tc">
              <el-button type="primary" @click="buyVipChapter">订阅本章</el-button>
            </div>
            <div>
              <el-checkbox class="font12" v-model="buyForm.autoState">自动购买下一章，不再提醒</el-checkbox>
            </div>
          </el-form>
        <img src="../../../static/img/buy_vip_icon@1_01.png" class="buy-icon" alt="">
      </el-dialog>

    </div>
</template>
<script type="text/ecmascript-6">
import { FetchReadChapter,FetchAutoSubscribe,FetchAddBookShelf,FetchAddPrattle,FetchGetPrattle,FetchAddRecords,FetchSubscribeChapter,FetchHandleUserInfo } from '../../api'
 import Badge from '../custom/badge.vue'
 import BadgeItem from '../custom/badge-item.vue'
 import { mapState, mapActions,mapGetters } from 'vuex'
 let ERR_OK = 200;
 let ERR_NO = 400;
    export default{
      components:{
        'rxx-badge':Badge,
        'rxx-badge-item':BadgeItem
      },
      data(){
          return {
            buyForm:{
              autoState:true
            },
            dialogFormVisible:false,
            isRead:false,
            visible:false,
            isSave:false,
            isShow:{
              state1:'hidden',
              state2:false
            },
            intercalate:[
              {
                color:'#333',
                bgColor:'#F9F7F3',
                brColor:'#E7DBC3',
                bxShadow:'#D1DDCE',
                bgColor2:'#F4F2EC',
                brColor2:'rgba(228,219,194,.5)',
                bgColor3:'#2E3B62',
                color3:'#999'
              },
              {
                color:'#333',
                bgColor:'#EDF3FB',
                brColor:'#CCD7E6',
                bxShadow:'#D1DDCE',
                bgColor2:'#DFE5EE',
                brColor2:'rgba(228,219,194,.5)',
                bgColor3:'#2E3B62',
                color3:'#999'
              },
              {
                color:'#333',
                bgColor:'#F4F9F3',
                brColor:'#D1DDCE',
                bgColor2:'#E4ECE2',
                bxShadow:'#D1DDCE',
                brColor2:'rgba(228,219,194,.5)',
                bgColor3:'#2E3B62',
                color3:'#999'
              },
              {
                color:'#949494',
                bgColor:'#222B46',
                brColor:'#2B3D71',
                bxShadow:'#020718',
                color2:'#949494',
                bgColor2:'#1A223A',
                color3:'#747474',
                bgColor3:'#2E3B62',
                brColor3:'#2D4999',
                bgColor4:'#3F5495'
              }
            ],
            setData:{
              family:'Microsoft YaHei',
              size:'18',
              theme:0
            },
            activeNames:[],
            barStyle:{
              top:'110px'
            },
            countList:[],
            bookInfo:{},
            chapterInfo:{},
            commentList:{
              page:'1',
              total:'24',
              pageSize:'10',
              list:[
                {
                  userName:'',
                  userId:'',
                  content:'哈哈哈哈'
                }
              ]
            },
            chapterComment:{
                pageNum:1
            },
            FormReply:{
              content:''
            },
            isFocus:false, //输入框是否已经聚焦
            automaticTake:false //自动订阅
          }
      },
      methods:{
//        获取章节信息
        getChapterInfo(id){
          FetchReadChapter({chapterId:id,readType:1}).then(json=>{
            if(json.data && json.returnCode!==1000){
              let desc = json.data.bookInfo.bookName + '是辣鸡小说网作者'+json.data.bookInfo.writerName+'全力打造的一部'+json.data.bookInfo.classificationName+'小说，辣鸡小说第一时间提供'+json.data.bookInfo.bookName+'最新章节，'+json.data.bookInfo.bookName+'全文阅读请上辣鸡小说';
              this.$nextTick(function () {
                window._bd_share_config = {
                  common:{
                    bdText:json.data.bookInfo.bookName+'－'+json.data.chapterInfo.chapterTitle+'－辣鸡小说',
                    bdDesc:desc,
                    bdStyle:0,
                    bdPic:json.data.bookInfo.bookImage,
                    bdMini:2,
                    bdSize:24
                  },
                  share:{}
                };
                const s = document.createElement('script');
                s.type = 'text/javascript';
                s.id = 'baidu__share';
                s.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
                document.body.appendChild(s);
              });
              json.data.bookInfo.rewardCount = json.data.rewardTotalNumber;
              json.data.chapterInfo.authorWords = json.data.chapterInfo.authorWords.replace(/\s*\n+\s*/g,'<br>　　');
              this.bookInfo = json.data.bookInfo;
              this.countList = json.data.countInfos;
              let data = this.formatTxt({content:json.data.chapterInfo.chapterContent,count:this.countList});
              json.data.chapterInfo.chapterData = data;
              this.chapterInfo = json.data.chapterInfo;
              this.addReadRecord();
            }
            if(json.returnCode===500){
              setTimeout(()=>{
                if(this.automaticTake){
//                  this.buyVipChapter('auto')
                }else {
                  this.dialogFormVisible = true;
                  this.isRead = false;
                }
              },500);
            }else {
              this.dialogFormVisible = false;
              this.isRead = true;
            }
          });
        },
        //        格式化章节内容
        formatTxt(txt){
          let reg1 = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/g;
          let reg2 = /<LG>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}<\/?LG ?\/?>/g;
          let newArr = [];
          let data = txt.content;
          let idArr = data.match(reg1);
          let txtArr = data.replace(/(&nbsp;||\s){2,4}/g,'').split(reg2);
          if(!data.split(reg2)){
            txtArr = data.split(reg2).splice(1)
          }
          if(idArr instanceof Array){
            idArr.forEach(function (item,index) {
              let count = 0;
              txt.count.forEach((item2)=>{
                if(item2.pid===item){
                  count = item2.count;
                }
              });
              newArr.push({
                id:item,
                count:count,
                content:txtArr[index]
              })
            });
            return newArr;
          }else {
              this.$message({message:'章节内容错误',type:'error'})
          }
        },

        getChapterList(){
            this.$store.dispatch('FETCH_CHAPTER_LIST',{ bid:this.chapterInfo.bookId,type:'read'})
        },
//        计算上一章和下一章ID
        reckonPreNext(){
          let cid = this.$route.params.cid;
          let Arr = this.chapterList.newList;
          if(Arr){
            Arr.forEach((item,index) => {
              if(Number(item.id)===Number(cid)){
                if(index===0){
                  this.$set(this.chapterList,'preCid',false);
                  this.$set(this.chapterList,'nextCid',Arr.length>1?Arr[index+1].id:false);
                }else if(index<Arr.length-1){
                  this.$set(this.chapterList,'preCid',Arr[index-1].id);
                  this.$set(this.chapterList,'nextCid',Arr[index+1].id);
                }else{
                  this.$set(this.chapterList,'preCid',Arr[index-1].id);
                  this.$set(this.chapterList,'nextCid',false);
                }
              }
            });
          }

        },
        formatContent(){
          if(this.FormReply.content.length>50){
            this.$message("吐槽字数长度不得超过50");
            this.FormReply.content = this.$trim(this.FormReply.content).substr(0,50);
          }
        },
//        发布间贴
        submitForm(index){
            FetchAddPrattle({
              pid:this.chapterInfo.chapterData[index].id,
              commentContext:this.FormReply.content,
              bookId:this.chapterInfo.bookId,
              bookName:this.bookInfo.bookName,
              chapterId:this.chapterInfo.id,
              chapterName:this.chapterInfo.chapterTitle,
              userName:this.$store.state.userInfo.pseudonym
            }).then(json=>{
              if(json.returnCode===ERR_OK){
                this.FormReply.content = '';
                this.chapterInfo.chapterData[index].count++;
                this.getPaComment(index,1);
              }
            })
        },
//        点赞
        addThumbs(index){
          FetchHandleUserInfo(this.chapterComment.list[index].id,'pal').then(json=>{
            if(json.returnCode===ERR_OK){
              if(!this.chapterComment.list[index].isthumbs){
                this.$message({message:"点赞成功",duration:1500});
                this.chapterComment.list[index].isthumbs = 1;
                this.chapterComment.list[index].thumbsCount = this.chapterComment.list[index].thumbsCount+1
              }else {
                this.$message({message:"取消点赞",duration:1500});
                this.chapterComment.list[index].isthumbs = 0;
                this.chapterComment.list[index].thumbsCount = this.chapterComment.list[index].thumbsCount-1
              }
            }
          });
        },
        //  评论翻页
        prePage(index){
          if(this.chapterComment.pageNum<=1){
              this.chapterComment.pageNum = 1
          }else {
            this.chapterComment.pageNum--;
          }
          this.getPaComment(index,this.chapterComment.pageNum)
        },
        nextPage(index){
          if(this.chapterComment.pageNum>=this.chapterComment.pages){
            this.chapterComment.pageNum = this.chapterComment.pages
          }else {
            this.chapterComment.pageNum++;
          }
          this.getPaComment(index,this.chapterComment.pageNum)
        },
//        章节切换
        skipPage(cid,type){
          if(cid){
            this.$router.push("/chapter/"+cid)
          }
          if(!this.chapterList.preCid && type==='pre'){
            this.$message("已经是第一章了！");
            return false;
          }else if(!this.chapterList.nextCid && type==='next'){
            this.$message("已经是最后一章了！");
            return false;
          }

        },

        getBack(){
          let that = this;
          this.isActive = true;
          let timer = setInterval(function () {
              let oTop = document.body.scrollTop ||document.documentElement.scrollTop;
            if(oTop>0){
              window.scrollBy(0,-100)
            }else{
              that.isActive = false;
              clearInterval(timer);
            }
          },10);
        },
//        收藏本书/加入书架
        addBookShelf(){
            FetchAddBookShelf(
              this.chapterInfo.bookId,
              this.$store.state.userInfo.pseudonym,
              this.chapterInfo.bookTitle
            ).then(json=>{
              if(json.returnCode===200){
                this.$message(json.msg);
                this.bookInfo.collectionStatus = this.bookInfo.collectionStatus?0:1;
              }
            });
        },
//        打赏、推荐票、金票
        myConsume:function (type) {
          if(!this.$store.state.userInfo.userId){
            this.$router.push('/login');
            return false
          }
          let val = 0;
          if(type==='reward'){
            val = this.$store.state.userInfo.userMoney
          }else if(type==='recommend'){
            val = this.$store.state.userInfo.userRecommendTicket
          }else if(type==='ticket'){
            val = this.$store.state.userInfo.userGoldenTicket
          }
          this.$consume({
            type:type,
            value:val,
            beforeClose:(action,instance,done) => {
              if(action==='confirm'){
                let typeUrl;
                let data = {
                  message:null,
                  userId:this.$store.state.userInfo.userId,
                  bookid:this.bookInfo.bookId,
                  bookName:this.bookInfo.bookName,
                  authorId:this.bookInfo.bookWriterId
                };
                if(type==='reward'){
//                   垃圾币打赏
                  data.message = instance.formData.content;
                  data.spicyiTicketCount = instance.formData.count;
                  typeUrl = 'user-SpicyiRewardTicket'
                }else if(type==='ticket') {
//                      金票打赏
                  data.goldenTicketCount = instance.formData.count;
                  typeUrl = 'user-RewardGonderTicket'
                }else if(type==='recommend') {
//                      推荐票投送
                  data.recommendTicketCount = instance.formData.count;
                  typeUrl = 'user-RecommendationTicket'
                }
                this.$ajax("/"+typeUrl,data,json => {
                  done();
                  if(json.returnCode===ERR_OK){
                    this.$message({message:json.msg,duration:2000})
                  }else if(json.returnCode===ERR_NO){
                    this.$router.push('/login')
                  }else {
                    this.$message(json.msg)
                  }
                })
              }else {
                done()
              }
            }
          })
        },
//        书籍自动订阅状态设置
        getAutoState(state){
//         初始获取自动订阅状态
          let key = this.$cookie('user_id');
          let loading;
//            更新订阅状态
          if(state!==undefined && key){
            loading = this.$loading({
              lock: true,
              text: '状态更新中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
          }
          if(key){
              FetchAutoSubscribe(this.chapterInfo.bookId,state!==undefined?'update':'search',state?1:0).then(json=>{
                  state!==undefined?this.$nextTick(()=>{loading.close()}):false;
                  if(json.returnCode===ERR_OK){
                    if(state!==undefined){
                      state?this.$message('订阅成功！'):this.$message("取消成功！");
                    }
                    this.automaticTake = Boolean(isNaN(json.data)?json.data.isClose:json.data);
                  }else {
                    this.automaticTake = false;
                    state!==undefined?this.$message(json.msg):true;
                  }
              });
          }else if(!key && state!==undefined){
            this.automaticTake = false;
          }
        },
        getPaComment(index,page){
          this.isFocus = false;
          FetchGetPrattle(this.chapterInfo.chapterData[index].id,page).then(json=>{
            if(json.returnCode===ERR_OK){
              this.chapterComment = json.data
            }
          });
        },
//        添加阅读记录
        addReadRecord(){
          if(this.$store.state.userInfo.userId){
            FetchAddRecords({
              userName:this.$store.state.userInfo.pseudonym,
              bookId:this.chapterInfo.bookId,
              bookName:this.chapterInfo.bookTitle,
              chapterName:this.chapterInfo.chapterTitle,
              chapterId:this.chapterInfo.id
            });
          }
        },
//        章节订阅
        buyVipChapter(type){
          if(this.buyForm.autoState){
            this.getAutoState(true)
          }
          FetchSubscribeChapter({
            userName:this.$store.state.userInfo.pseudonym,
            bookName:this.chapterInfo.bookTitle,
            bookId:this.chapterInfo.bookId,
            bookChapterId:this.chapterInfo.id,
            bookChapterName:this.chapterInfo.chapterTitle
          }).then(json=>{
            this.dialogFormVisible = false;
            if(json.returnCode===200 || json.returnCode===100){
              this.dialogFormVisible = false;
              this.isRead = true;
              this.chapterInfo.chapterData = this.formatTxt({content:json.data.chapterContent,count:this.countList});
              this.getAutoState();
              if(type!=='auto'){
                this.$message("订阅成功！");
              }
              this.$freshen()
            }else if(json.returnCode===300){
              window.open('/charge');
            }
          });
        },
//        发布书评
        addBookComment(){
            let data = {
                title:this.bookInfo.bookName
            };
            this.$consume({
              type:'comment',
              value:data,
              beforeClose:(action,instance,done) => {
                let len = this.$trim(instance.messageContent).length;
                if(action==='confirm'){
                  if(len>0 && len<200){
                    if(this.$regEmoji(instance.messageContent)){return false}
                    this.$ajax("/add-getcomminfo",{
                      bookId:this.bookInfo.bookId,
                      bookName:this.bookInfo.bookName,
                      userName:this.$store.state.userInfo.pseudonym,
                      commentContext:instance.messageContent
                    },json=>{
                      if(json.returnCode===200){
                        this.$message("发送成功！");
                        done()
                      }
                    })
                  }else if(len>200){
                    this.$message({message:'内容长度不可超过200字！',type:'warning'})
                  }else {
                    this.$message({message:'请填写内容！',type:'warning'})
                  }
                }else {
                  done()
                }
              }
            })
        },
//        操作提示
        handleTip() {
          this.$notify({
            title: '提示',
            message: '可通过键盘← →键阅读上下章节',
            duration:5000,
            offset:50
          });
        }
      },
      watch:{
        setData:{
          handler:function(oldVal){
            localStorage.setData =JSON.stringify( oldVal)
          },
          deep:true
        },
        'chapterInfo.bookId':function (val) {
          if(val){
            this.getChapterList();
            this.getAutoState()
          }
        },
        bodyHeight:function (val) {
          this.bodyHeight = val;
        },
        '$route':function () {
          this.dialogFormVisible = false;
          this.getChapterInfo(this.$route.params.cid);
          this.reckonPreNext();
          this.chapterComment ={}
        },
        chapterList:function (val) {
//          console.log(val)
          this.reckonPreNext()
        }
      },
      mounted(){
        if(this.chapterInfo.bookId){
          this.getAutoState();
        }
        this.getChapterInfo(this.$route.params.cid);
        if(localStorage.setData){
          this.setData = JSON.parse(localStorage.setData)
        }
        window.onscroll = () => {
          let top = document.documentElement.scrollTop || document.body.scrollTop;
          let winHeight = document.documentElement.clientHeight;
          if(top>110){
            this.barStyle.top = '0px';
          }else{
            this.barStyle.top = (110-top)+'px'
          }
          if(top>0.3*winHeight){
            this.isShow.state2 = true
          }else {
            this.isShow.state2 =false
          }
          if(top>100){
            this.isShow.state1 = 'visible'
          }else {
            this.isShow.state1 = 'hidden'
          }
        };
        if(this.$route.name==='Chapter'){
          document.onkeydown = e => {
            if(!this.isFocus){
              if(e.keyCode===37){
                this.skipPage(this.chapterList.preCid,'pre')
              }else if(e.keyCode===39){
                this.skipPage(this.chapterList.nextCid,'next')
              }
            }
          };
        }
        this.handleTip()
      },
      computed:{
        theme:function () {
          let base = this.intercalate[this.setData.theme],
          style = {
            backgroundColor:base.bgColor,
            color:base.color,
            borderColor:base.brColor,
            boxShadow:'0 1px 3px '+base.bxShadow
          };
          return style
        },
//        chapterList:function () {
//          return this.$store.state.chapterList?this.$store.state.chapterList:{}
//        },
        ...mapGetters([
            'chapterList'
        ])
      }
    }

</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

.chapter-detail
  .el-breadcrumb__item:last-child
    .el-breadcrumb__inner
      cursor pointer!important
      &:hover
          color #f77583!important

#chapterCnt
  position:relative
  z-index :99
.container-wrap
  .chapterWrap
    min-width :1024px
    margin :0 auto
.subNavWrap
  width :1024px
  margin 0 auto
  overflow hidden
  line-height :64px
  .sub-nav
    overflow hidden
.chapter-main
  overflow hidden
  padding :4px 64px
  margin :0 auto
  width :1024px
  .chapter-read-box
    position: relative;
    padding: 80px 0 0;
    background: #f6f3ec;
    box-shadow: 0 1px 4px #e7dbc3
    border :1px solid #e7dbc3
    border-radius 5px
    .read-hd
      padding :0 26px 8px 54px;
      text-align center
      p
        display: inline-block
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        font-size: 12px;
        color: #969696;
        span
          float left
          display :inline-block
          margin-right :38px
          >a
            color #4A90E2
            display inline-block
          .title
             max-width 246px
          .name
            max-width 68px
          &:last-child
            margin-right 0

      h3.chapter-title
        position: relative;
        height: 42px;
        line-height: 42px;
        font-size: 30px;
        margin-bottom 15px
    .read-bd
      /*margin: 0 50px 140px 83px*/
      font-size :14px
      /*vip章节是遮罩层*/
      p.chapter
        position: relative;
        border-right: 1px solid #e6e6e6;
        padding-right: 30px;
        min-height: 30px;
        line-height: 2.2;
        word-wrap: break-word;
        word-break: break-all;
        i.num
          position: absolute;
          padding :5px
          /*height :auto*/
          /*width :auto*/
          line-height :1em
          display: block;
          background: #d7d7d7;
          border-radius: 50%;
          right: -8px;
          bottom: 3px;
          text-align: center;
          cursor: pointer;
          border: 2px solid #f6f3ec;
          white-space: nowrap;
.author-say
  margin 10px 0
  padding 18px 34px
  font-size 14px
  color #666
  border 1px solid #ddd
  border-radius 5px
.read-reward-wrap
  text-align :center
  margin:45px 0 40px
  a:hover
    color :#333!important
  a
    display :table
    width 96px
    height 96px
    margin 0 auto
    /*padding :20px 20px 13px*/
    border-radius :50%
    font-size :14px
    background-color :#F77583
    border 1px solid #F73D51
    color #fff
    &:hover
      color #fff!important
    >div
      display table-cell
      vertical-align middle
      font-size 18px
      line-height 30px
      >p
        font-size :20px
        line-height 1

.chapter-read-page
  position relative
  text-align center
  margin :30px 0 50px
  z-index:1
  span
    display: inline-block;
    width: 118px;
    height: 38px;
    line-height: 38px;
    background: #fff;
    margin: 0 5px;
    border-radius: 4px;
    cursor :pointer
    font-size :16px
    box-shadow: 0 1px 8px #999;
    border :1px solid transparent
    user-select none
    &.center
      width 80px
    &.disable
      color #999!important
      cursor not-allowed
      &.night
        color #5D626F!important
.read-side-bar-box
  position fixed
  top :110px
  left :50%
  width 1024px
  margin-left :-512px
  height :100%
  z-index :0
  .read-side-bar
    position: absolute;
    width: 60px;
    .share-wrapper
      position relative
      &:hover
        .bdsharebuttonbox
           display block
      .bdsharebuttonbox
        position absolute
        top 60px
        margin-left 15px
        display none
        >a
          display block
          float inherit!important
    .el-button+.el-button
      margin-left :0
    .el-button.btn
      display: block;
      width: 60px;
      height: 60px;
      background: #f6f3ec;
      position: relative;
      text-align: center;
      color: #969696;
      margin-bottom: 3px;
      border-radius :0;
      padding :10px 0
      border-color :#e7dbc3
      transition :.2s all
      /*box-shadow: 0 0 2px #c8c8c8;*/
      a
        &.active
          box-shadow none
        &:hover
          color #999!important
      i
        display: inline-block;
        width: 24px;
        height: 24px;
        background-repeat:no-repeat;
        background-size contain
        background-position center
      .catalog i
       background-image: url(../../assets/image/icon/icon-book-read.png)
      .setUp i
        background-image :url(../../assets/image/icon/set-up.png)
      .house i
        background-image :url(../../assets/image/icon/icon-collect.png)
      .house i.saved
        background-image :url(../../assets/image/icon/icon-collect@_02.png)!important
      .share
          position relative
          &:hover
            .bdsharebuttonbox
              opacity 1
          .bdsharebuttonbox
            &:hover
              opacity 1
            position absolute
            top 0
            left 50px
            height 100%
            width 136px
            padding-left 6px
            opacity 0
            .bds_more
              display block
              width 100%
              height 100%
              margin 0!important
              background transparent!important
          i
            background-image :url(../../assets/image/icon/icon-share.png)
      .bComment i
        background-image :url(../../assets/image/icon/icon-message.png)
      .reward i
        background-image :url(../../assets/image/icon/pepper@x1_1.png)
      .recommend i
        background-image :url(../../assets/image/icon/pepper@x1_2.png)
      .gTicket i
        background-image :url(../../assets/image/icon/pepper@x1_3.png)
      .prePage i
        background-image :url(../../assets/image/icon/icon-arrow-left.png)
      .nextPage i
        background-image :url(../../assets/image/icon/icon-arrow-right.png)
      .bTop i
        background-image :url(../../assets/image/icon/icon-arrow-bottom.png)
  .read-side-bar-left
    top: 0
    left :0
  .read-side-bar-right
    top: 0
    right :0
  .read-side-bar-bottom
    position fixed
    bottom :30%
    right :50%
    margin-right :-512px
.el-popover
  padding :10px 20px
  h3.title
    position: relative;
    height: 46px;
    line-height: 46px;
    font-size: 18px;
  .sw-title
    font-size :18px
    line-height :2
    margin-bottom :5px
  .setup-wrap
    font-size 14px
    .el-row
      line-height :30px
      margin-bottom:10px
      overflow :hidden
    .el-col
      height :100%
    .font-family
      a:last-child
        margin-right:0
      a
        float :left
        border :1px solid #ddd
        padding : 0 10px
        border-radius :3px
        margin-right: 12px
    .el-input-number--small
      width :170px
      padding :0 64px 0 60px
      .el-input-number__decrease,.el-input-number__increase
        width:40px
        border:none
      .el-input-number__decrease
        left:0
      .el-icon-plus:before
        content :'A+'
        color :#333
        font-size :28px
        line-height :0
        vertical-align -5px
      .el-icon-minus:before
        content :'A-'
        font-size :24px
        color :#333
        vertical-align :-4px
      .el-input__inner
        padding :0
        text-align center
        border :1px solid #908f8a
        font-size 18px
    .el-radio-button--small.is-active
      .el-radio-button__inner
        border :2px solid #f00
        color :#333
    .el-radio-button--small
      margin-right: 16px
      border-radius :50%
      .el-radio-button__inner
        background-color :transparent
    .theme .el-radio-button__inner
        height :36px
        width :36px
        border-radius :50%
        padding :8px 9px
        border :none
        box-shadow :none
    .font-family .el-radio-button__inner
        height :30px
        line-height 26px
        padding :0 9px
        border :1px solid #908f8a
        border-radius :3px
        box-shadow :none
  .catalog-child
    height :380px
    .collapse-wrap
      height :320px
      overflow-x:hidden
    .el-collapse
      border :none
      .el-collapse-item__header
        height :48px
        line-height :48px
        border-color:#f6f3ec
        .el-collapse-item__header__arrow
          float right
          margin :17px 0
      .el-collapse-item__wrap
        border :none
      .el-collapse-item__content
        overflow:hidden
        padding-right :0
        padding-left :0
        background-color :#fff
      .collapse-item-link
        float: left
        width :47%
        line-height :42px
        height :42px
        padding-left :15px
        border-bottom :1px solid #f6f3ec
        a
         display :inline-block
         max-width :200px
         box-shadow none
        .icon-cvip
          display inline-block
          height :16px
          margin :13px 0
      .collapse-item-link:nth-child(odd)
         margin-right :6%
li.page-item
  margin :10px 0
.chapter-reply
  height :36px
  line-height :36px
  margin :20px 0
  .page[type='text']
    display :inline-block
    width :20px
    text-align :right
  .el-icon
    cursor :pointer
    color :#666
  .el-icon.disable
    cursor not-allowed
    color #999
.icon-arrow-right:before
  content:">"

.v-modal.buy-modal-wrap
  /*background transparent*/

.el-dialog.buy-dialog-wrap
  position absolute
  width 360px!important
  top 50%!important
  left 50%
  margin 0!important
  transform translate(-50%,-50%)
  border-radius 7px
  .el-dialog__headerbtn
    /*display none*/
  .buy-icon
    position absolute
    left 50%
    top -60px
    transform translateX(-50%)
  .el-dialog__header
    text-align center
    .el-dialog__title
      display inline-block
      color #333
      font-weight normal
      padding-top 24px
  .el-dialog__body
    padding-top 0
    text-align center
    .user-rich
      text-align center
      font-size 12px
      margin-top 10px
    .tc
      margin 15px 0
      button
        width 120px
        height 30px
        line-height 30px
        border-radius 15px
        color #fff
        padding 0!important
    .font12
      .el-checkbox__label
        font-size 12px
</style>
