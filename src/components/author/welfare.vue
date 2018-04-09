<template>
    <div class="welfare-wrapper clear" >

      <div :style="{ height:height+'px' }">
        <div class="welfare-bg"></div>
        <div class="bg-color" :style="{ height:bgHeight+'px' }"></div>
        <div ref="welfare" class="welfare-main"  v-if="authorWelfare">
          <div v-for="(item,$index) in authorWelfare" :key="$index" class="welfare-item" :id="'welfare-item'+$index" ref="welfareItem">
            <div class="welfare-title" >
              <h2 class="h-title fl">{{ $index+1 }}</h2>
              <p >{{ item.title }}</p>
            </div>
            <div class="welfare-content">
              <div v-html="item.values"></div>
              <div v-html="item.content"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="side-bar">
        <template v-if="authorWelfare.length" v-for="(item,$index) in authorWelfare">
          <a :href="'#welfare-item'+$index" class="side-bar-item" :class="{ active:activeIndex==$index }">
            {{$index!==0?item.title:'最高两千元全勤奖励'}}
          </a>
        </template>
        <img src="../../assets/image/icon/creation-icon.png" alt="" class="bar-icon">
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
    export default{
      data(){
          return {
              height:1024, //窗体可视区域高度
              activeIndex:0,
              title:[
                  '更新全勤',
                  '爽文全勤',
                  '黄金级作品全勤',
                  '白银级作品全勤',
                  '金椒全勤奖',
                  '百分百上架奖励',
                  '键盘补贴'
              ],
              position:[],
              top:0, //当前滚动高度
              clientHeight:0,
              bgHeight:1000
          }
      },
      title(){
          return '作者福利—辣鸡小说'
      },
      asyncData({ store }){
          return store.dispatch("FETCH_AUTHOR_WELFARE")
      },
      mounted(){
        if(!this.once){
          this.$store.dispatch("FETCH_AUTHOR_WELFARE");
        }
        this.$nextTick(()=>{
          this.bgHeight = this.$refs.welfare.clientHeight-900;
          this.height = this.$refs.welfare.clientHeight;
          this.clientHeight = document.documentElement.clientHeight;
          window.addEventListener('scroll', () => {
            this.top = document.documentElement.scrollTop ||  document.body.scrollTop ;
            let item = this.$refs.welfareItem;
            if(item){
              for(let k=0,len=item.length;k<len;k++){
                let top = item[k].getBoundingClientRect().top;
                if(top<0 && k===item.length-1){
                    this.activeIndex = item.length-1;
                    break;
                }else if(top>0 && top<this.clientHeight){
                    this.activeIndex = k;
                    break;
                }
              }
            }else {
                this.activeIndex = 0
            }
          })
        })
      },
      computed:{
          ...mapState([
              'authorWelfare',
              'once'
          ]),
      },
      watch:{
        authorWelfare:{
          handler:function () {
              this.$nextTick(()=>{
                this.height = this.$refs.welfare.clientHeight;
                this.bgHeight = this.$refs.welfare.clientHeight-900
              });
          },
          deep:true
        }
      }
    }
</script>
<style lang="stylus" scoped type="text/stylus" rel="stylesheet/stylus">

.welfare-wrapper
  position relative
  max-width:1440px
  min-width 1024px
  margin :0 auto
  height:100%
  .side-bar
    position fixed
    bottom 20%
    right 50%
    margin-right -696px
    width 155px
    padding 15px 0
    background #fff
    color #c76d08
    border-radius 7px
    text-align center
    font-size 16px
    user-select none
    .bar-icon
      position absolute
      top -54px
      left 50%
      transform translateX(-50%)
    .side-bar-item
      display block
      height 36px
      line-height 36px
      cursor pointer
    .side-bar-item:hover
      background:#fff0ac
      color:#ff6f00
    .side-bar-item.active
      box-shadow none
      background:#fff0ac
      color:#ff6f00
  .welfare-bg
    height 900px
    background url('/static/img/welfare-bg@_1.png') no-repeat center top
    background-size auto 100%
    margin 0 auto
  .bg-color
    background:linear-gradient(60deg,#FFFAF1,#FAC857);
    height calc(100% - 900px)
    background-color #FAC857
  .welfare-main
    position absolute
    left 50%;
    top:0
    transform translateX(-50%)
    width 1024px
    height auto
    padding-top 387px
    z-index 99
    .welfare-item
      margin-bottom 30px
      font-size 16px
      .welfare-title
        height :71px
        background :url(/static/img/welfare-title-bg.png) no-repeat -1px top
        background-size:101% auto
        text-align center
        h2.h-title
          width :138px
          line-height 66px
          font-size 32px
          color #ffb827
          font-weight 600
        p
          overflow hidden
          height 66px
          line-height 78px
          font-size 20px
          padding-right 68px
      .welfare-content
        line-height 2
        background :#fff
        padding :20px 30px 42px
        border-bottom-left-radius :35px
        border-bottom-right-radius :35px

</style>
