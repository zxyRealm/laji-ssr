<template>
    <span class="zdy-icon__user_level" :style="{backgroundColor:bgColor}">
      LV{{grade?grade:0}}
    </span>
</template>

<script type="text/ecmascript-6">
    export default{
      name:'zdy-icon__user_level',
      props:{
        grade:{
          type:[String,Number],
          default:0
        }
      },
      computed: {
          bgColor:function () {
              let color;
            switch (Number(this.grade)){
              case 0:
                color = '#ddd';
                break;
              case 1:
                color = '#ddd';
                break;
              case 2:
                color = '#74f3fe';
                break;
              case 3:
                color = '#f1ad6e';
                break;
              case 4:
                color = '#f1ad6e';
                break;
              case 5:
                color = '#f1ad6e';
                break;
              case 6:
                color = '#f1ad6e';
                break;
              case 7:
                color = '#f1ad6e';
                break;
              case 8:
                color = '#f1ad6e';
                break;
              case 9:
                color = '#f1ad6e';
                break;
              case 10:
                color = '#f1ad6e';
                break;
              default:
                color = '#f1ad6e'
            }
            return color
          }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.zdy-icon__user_level
  display:inline-block
  padding 0 4px
  border-radius :3px
  background-color:#ddd
  color :#fff
  font-size :12px
  line-height 18px
  height 18px
  zoom: 0.83
  &.middle
    height 22px
    line-height 22px
    padding:0 6px
</style>
