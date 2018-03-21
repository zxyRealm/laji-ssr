<template>
    <div class="carousel-rec-wrap" ref="carousel">
      <div v-if="clickBtn" @click="clickLeft" class="arrow-icon arrow-left"><i class="el-icon-arrow-left"></i></div>
      <div v-if="clickBtn" @click="clickRight" class="arrow-icon arrow-right"><i class="el-icon-arrow-right"></i></div>
      <div class="carousel-rec-scroll clear" :style="{width:width+'px',transform:'translateX('+translateX+'px)'}">
        <div class="carousel-rec-item" v-for="(item,index) in imgArray" :style="{marginRight:steps+'px',width:itemWidth+'px'}">
          <router-link :to="'/book/'+item.bookId" target="_blank">
            <img :src="item.bookImage" alt="">
          </router-link>
          <p class="tit txt-overflow"><router-link :to="'/book/'+item.bookId" target="_blank" :title="item.bookName">{{item.bookName}}</router-link></p>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        props:{
          imgArray:{
            type:Array,
            default:[]
          },
          count:{
            type:Number,
            default:5
          },
          clickBtn:{
            type:Boolean,
            default:true
          },
          steps:{
            type:Number,
            default:25
          }
        },
      data(){
        return{
          itemWidth:100,
          width:null,
          showBtn:true,
          translateX:0,
          wrapWidth:0,
        }
      },
      methods:{
        clickLeft(){
          if(this.translateX<0){
              if(Math.abs(this.translateX)>=this.wrapWidth){
                  this.translateX +=(this.wrapWidth+this.steps)
              }else {
                  this.translateX = 0
              }
          }
        },
        clickRight(){
          if((this.width-this.wrapWidth+this.translateX)>this.wrapWidth){
            this.translateX += -this.wrapWidth-this.steps
          }else {
            this.translateX = -(this.width-this.wrapWidth-this.steps)
          }
        }
      },
      mounted(){
        this.width = this.imgArray.length
        this.wrapWidth = this.$refs.carousel.clientWidth;
//        定义轮播图中子元素宽度
        this.itemWidth = Math.floor((this.wrapWidth-((this.count-1)*this.steps))/this.count);
//       滚动区宽度
        this.width = (this.itemWidth+this.steps)*this.imgArray.length;
      },
      watch:{
        imgArray:function () {
          this.wrapWidth = this.$refs.carousel.clientWidth;
//        定义轮播图中子元素宽度
          this.itemWidth = Math.floor((this.wrapWidth-((this.count-1)*this.steps))/this.count);
//       滚动区宽度
          this.width = (this.itemWidth+this.steps)*this.imgArray.length;
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.carousel-rec-wrap
  position relative
  width :100%
  height 100%
  min-height 180px
  overflow hidden
  user-select none
  &:hover
    .arrow-icon
      display block
  .arrow-icon
    position:absolute
    display none
    top:calc(50% - 18px)
    width: 30px
    height 60px
    background-color rgba(0,0,0,0.4)
    text-align center
    line-height 60px
    border-radius 4px
    color:#fff
    font-size: 16px
    transform translateY(-50%)
    cursor pointer
    z-index 99
  .arrow-left
    left:0
  .arrow-right
    right 0
  .carousel-rec-scroll
    height 100%
    transition:all 0.3s
    .carousel-rec-item
      float left
      height 100%
      p.tit
        text-align center
        line-height 36px
        font-size 14px
        padding:0 10px
      .active
        color #333
      >a
        display inline-block
        height 170px
        width:100%
        >img
          width 100%
          height 100%
          border-radius 4px
</style>
