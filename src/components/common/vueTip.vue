<template>
  <!--<transition name="message-fade">-->
    <div class="message" v-show="show">
      <span class="icon"><img :src="typeImg" class="zx-tip__icon"></span>
      <p>{{message}}</p>
    </div>
  <!--</transition>-->
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'v-tip',
    mounted(){
      this.StartTime();
    },
    data(){
      return {
        message: '消息提示',
        show: false,
        timer: null,
        type:'info'
      }
    },
    computed:{
      typeImg:function () {
        return '../asset/'+this.type+'.svg'
      }
    },
    methods:{
      StartTime(){
        this.show = true;
        if(this.timer){
          clearTimeOut(this.timer)
        }else{
          this.timer = setTimeout(()=>{
            this.show = false
          }, 3000);
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>
