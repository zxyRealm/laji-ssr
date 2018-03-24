<template>
    <div class="area-picker">
      <select name="" v-model="dataList" placeholder="请选择省">
        <template v-for="item in dataList.province">
          <option :value="item">{{item}}</option>
        </template>
       
      </select>
      <select name="" v-model="dataList[1]" placeholder="请选择市区">
        <option value=""></option>
      </select>
    
    </div>
</template>

<script type="text/ecmascript-6">
  import areaData from 'china-area-data'
    export default{
      name:'area-picker',
      prop:{
          value:[String,Object],
          default:''
      },
      data(){
          return{
              currValue:this.value,
              dataList:{
                  province:[],
                  area:[]
              }
          }
      },
      methods:{
          initData(){
              this.dataList.provice = areaData[86]
              
          }
      },
      mounted(){
          this.initData()
      }
    }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.area-picker
    select
      float left
      margin-right 10px
      height 40px
      width 140px
      line-height 40px
      border-radius 5px
      border 1px solid #dcdfe6
      &:last-child
          margin-right 0
      option
          height 40px
          line-height 40px
</style>
