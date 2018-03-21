<template>
    <div class="zdy-hint-wrap" :class="classMap">
      <p class="tip-msg">{{tip}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      name:'zdy-hint',
      props:{
        type:{
          type:[String],
          default:''
        },
        size:{
          type:[String,Number],
          default:'auto'
        }
      },
      data(){
        return{
          imgSrc:'./images/no-bookshelf-bg@x1_01.png'
        }
      },
      computed:{
        name:function () {
          let msg;
//          用户收藏书架
          if(this.type==='bsh'){
            msg = 'bookshelf'
          }
//          作者书籍列表
          else if(this.type==='bli'){
            msg = 'book-list'
          }
          else if(this.type==='fans'||this.type==='atn'){
            msg = 'fans'
          }
          else {
            msg = 'book-list'
          }
          return msg
        },
        classMap:function () {
          if(this.size===0){
            return this.type + ' noBg'
          }else {
            return this.type
          }
        },
        tip:function () {
          let msg;
          if(this.type==='bsh'){
            msg = '暂无收藏，赶紧添加喜欢的书籍 (0^◇^0)'
          }
          else if(this.type==='fans'){
            msg = '暂无粉丝'
          }
          else if(this.type==='atn'){
            msg = '暂无关注'
          }
          else if(this.type==='bli'){
            msg = '这个作者很懒，还没有写书哦！'
          }
          else if(this.type==='book-not'){
            msg = '您找的书籍不存在，换个链接试试！'
          }
          else if(this.type==='reader-not'){
            msg = '您找的用户不存在，换个链接试试！'
          }
          else if(this.type==='rec'){
            msg = '最近没有阅读书籍，赶快去逛逛吧！'
          }
          else if(this.type==='search'){
            msg = '没有找到你要查找的结果哦！'
          }
          else {
            msg = '暂无数据'
          }
          return msg
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.zdy-hint-wrap
  position relative
  height 340px
  background-position center top
  background-repeat no-repeat
  background-image url('images/no-data-bg@x1_01.png')
  &.rec
    height 360px
    background-image url('images/no-bookshelf-bg@x1_01.png')
  &.atn
  &.fans
    height 220px
    background-position center 0
    background-image url('images/no-fans-bg@x1_01.png')
 
  &.nothing
    background-position center 40px
    height 400px
    margin-bottom 30px
  &.noBg
    height 50px
    background-image none
  &.bsh
  &.bli
    height 370px
    background-image url('images/no-book-list-bg@x1_01.png')
    background-position center 20px
    margin-bottom 20px
    &.noBg
      height 350px
      background-image url('images/no-book-list-bg@x1_01.png')
      background-position center 0
      margin-bottom 0
  >img
    margin 10px auto 0
  .tip-msg
    position absolute
    bottom 0
    left 0
    width 100%
    font-size 16px
    text-align center
    color #666
    line-height 50px
</style>
