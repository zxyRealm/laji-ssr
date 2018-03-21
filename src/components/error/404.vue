<template>
    <div class="system_error">
      <!--<img src="./404.png" alt="error" class="error-icon">-->
      <p class="config-tip">
        您所找的页面或信息不存在，您可以点<a href="/">这里</a>返回首页
        <br><a href="javascript:window.history.go(-2);">返回上一页</a>
      </p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.system_error
  position relative
  width 100%
  min-height 1224px
  background url(./404.png) no-repeat center top
  .error-icon
    position absolute
    top 0
    left 50%
    margin-left -500px
  .config-tip
    position absolute
    top 630px
    text-align: center
    width 100%
    font-size 16px
    a
      color #ff8383
</style>
