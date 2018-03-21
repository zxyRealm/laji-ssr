<template>
  <div class="container-wrapper userCenter">
    <div class="wrapper container" v-wechat-title="currentHash+'－辣鸡小说'">
      <template v-if="readerInfo">
        <div class="user-wrapper clear">
          <div class="mw-fl-content">
            <div class="mw-top-info">
              <img class="avatar" :src="readerInfo.userHeadPortraitURL" :alt="readerInfo.pseudonym">
              <div class="person-info">
                <p class="username">{{readerInfo.pseudonym}}
                  <i class="zdy-icon__sex" :class="readerInfo.userSex?'girl':null"></i>
                </p>
                <div class="level">
                  <span>lv{{readerInfo.userGrade}}</span>
                  <el-progress class="level-progress" :show-text="false" :stroke-width="8" :percentage="percent"></el-progress>
                </div>
                <div class="person-intro">
                  {{readerInfo.userAutograph?readerInfo.userAutograph:'ta很懒，没有签名哦！'}}
                </div>
              </div>
              <div class="handle-area">
                <a v-if="readerInfo.isfollow" class="addAttention private" href="javascript:;" @click="$cancelAttention(-1)">已关注</a>
                <a v-else class="addAttention" href="javascript:;" @click="$addAttention(-1)">关注</a>
                <a class="private" href="javascript:;" @click="$send('letter',{sendName:readerInfo.pseudonym,sendUserId:readerInfo.userId})">私信</a>
              </div>
            </div>
      
            <div class="el-menu-vertical">
              <router-link class="el-menu-item" :to="'/reader/'+$route.params.uid">首页</router-link>
              <router-link class="el-menu-item" :to="'/bookshelf/'+$route.params.uid">{{readerInfo.isAuthor?'TA的小说':'TA的书架'}}</router-link>
              <router-link class="el-menu-item" :to="'/book_review/'+$route.params.uid">TA的书评</router-link>
              <router-link class="el-menu-item" :to="'/spit_slot/'+$route.params.uid">TA的吐槽</router-link>
              <router-link class="el-menu-item" :to="'/attention/'+$route.params.uid">TA的关注</router-link>
              <router-link class="el-menu-item" :to="'/fans/'+$route.params.uid">TA的粉丝</router-link>
            </div>
          </div>
          <div class="mw-fr-content clear">
            <router-view :identity="readerInfo.isAuthor"></router-view>
          </div>
        </div>
      </template>
      <zdy-hint type="reader-not" v-else></zdy-hint>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  
  export default{
    data(){
        return{
          readerInfo:{}
        }
    },
    methods: {
      getReaderInfo(){
        this.$ajax("/person-SimplifyUserInfo",{
          puserid:this.$route.params.uid
        },json=>{
          if(json.returnCode===200){
            this.readerInfo = json.data
          }
        })
      }
    },
    mounted(){
      this.getReaderInfo()
    },
    computed:{
      currentHash:function () {
        if(this.readerInfo){
          let name = this.readerInfo.pseudonym;
          if(this.$route.name==='Reader'){
            return name + '的个人中心'
          }else if(this.$route.name==='bookShelf'){
            return name + '的书架'
          }else if(this.$route.name==='bookReview'){
            return name + '的书评'
          }else if(this.$route.name==='spitSlot'){
            return name + '的吐槽'
          }else if(this.$route.name==='Attention'){
            return name + '的关注'
          }else if(this.$route.name==='Fans'){
            return name + '的粉丝'
          }
        }else {
           return '用户不存在'
        }
      },
      percent:function(){
        let per = 0;
        let val = this.readerInfo;
        if(val.userId && val.integration){
            if(val.integration<val.topSource){
                per = (val.integration/val.topSource)*100
            }else {
                if(val.downSource-val.topSource){
                    per =((val.integration-val.topSource)/(val.downSource-val.topSource))*100;
                }else {
                    per = 100
                }
            }
        }
        return per
      }
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import '../../assets/css/user.styl'
.mw-fr-content
  padding-top:8px
  
//  用户书评吐槽样式表
.reader-rs-wrapper
  .reader-rs-header
    height 42px;
    line-height 42px
    background-color #fff
    font-size 18px
    border-bottom :1px solid #f0dcdd
    >a
      padding :0 4px
      margin-left: 50px

  /*用户中心首页*/
.reader-common-center
  .el-tabs__content
    background :#fff

/*书评吐槽公用样式  */
.reader-rs-main
  background #fff
  padding-left :78px

</style>
