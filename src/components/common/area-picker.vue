<template>
    <div class="area-picker" :style="{ width:width+'px'}">
      <div class="select-wrap">
        <el-select class="area-select" v-model="address.province" placeholder="请选择省">
          <el-option
            v-for="(item,key) in province"
            :key="key"
            :label="item"
            :value="key">
          </el-option>
        </el-select>
        <el-select class="area-select"  v-model="address.cities" placeholder="请选择市区">
          <el-option
            v-for="(item,key) in cities"
            :key="key"
            :label="item"
            :value="key">
          </el-option>
        </el-select>
      </div>
      <div class="detail-wrap mt20">
        <el-input
          type="textarea"
          placeholder="请输入详细地址"
          v-model="detail">
        </el-input>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import areaData from 'china-area-data'
    export default{
      name:'area-picker',
      props:{
          value:{
              type:[String,Object],
              default:''
          },
          width:{
              type:[String,Number],
              default:'260',
              required:false
          }
      },
      data(){
          return{
              currValue:this.value,
              dataList:{
                  province:[],
                  area:[]
              },
              address:{
                  province:'',
                  cities:''
              },
              detail:''
              
          }
      },
      methods:{
          initData(){
              this.dataList.province = areaData[86]
          }
      },
      mounted(){
          this.initData();
      },
      watch:{
          "address.province":function () {
            this.address.cities = '';
            this.$emit('input','')
          },
          "address.cities":function (val) {
              if(val && this.detail) {
                this.currValue = this.province[this.address.province] + this.cities[val] + this.detail;
              }else {
                 this.currValue = ''
              }
             this.$emit('input', this.currValue);
          },
          detail:function (val) {
             if(val && this.address.cities && this.address.province){
               this.currValue = this.province[this.address.province] + this.cities[this.address.cities] + this.detail;
             }else {
                 this.currValue = ''
             }
             this.$emit('input', this.currValue);
          }
      },
      computed:{
         province:function () {
           return areaData[86]
         },
         cities:function () {
           return this.address.province?areaData[this.address.province]:''
         }
      }
    }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.area-picker
    overflow hidden
    .area-select
        width 124px
        margin-right 10px
        &::-ms-expand
            display none
        &:last-child
           margin-right 0
        .area-option
          bottom 1px solid #ddd
</style>
