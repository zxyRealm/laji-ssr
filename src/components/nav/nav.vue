<template>
  <nav>
    <div class="nav-inner">
      <div class="nav-left fl">
        <div class="nav-item">
          <router-link to="/index">首页</router-link>
        </div>
        <div class="nav-item">
          <router-link to="/class_total">书库</router-link>
        </div>
        <div class="nav-item">
          <router-link to="/welfare">福利</router-link>
        </div>
        <div class="nav-item">
          <router-link to="/author">作者中心</router-link>
        </div>

      </div>
      <div class="nav-right fr">
        <div class="nav-item">
          <router-link target="_blank" :to="{path:'/charge'}">
            <span>充值中心</span>
          </router-link>
        </div>
        <div class="nav-item">
          <router-link to="/rank/golden">
            <span>排行榜</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
<script type="text/ecmascript-6">
  import { mapState } from 'vuex'
  export default{
      computed:{
        ...mapState([
            'userInfo'
        ])
      }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">


nav
  height:44px;
  border-bottom 1px solid #d8d8d8
  .nav-inner
    height:44px;
    font-size:18px;
    line-height:44px;
    overflow: hidden;
    .nav-item
      float: left;
      width: auto;
      height:100%;
      line-height: 44px;
      margin-right:46px;
      word-break: keep-all;
    .nav-left
      width 692px
    .nav-right
      overflow:hidden;
      width:auto;
      .nav-item
        margin-right: 20px
        &:nth-child(1)
          a
            background url('../../assets/image/icon/charge_icon.png') no-repeat left center
        &:nth-child(2)
          a
            background url('../../assets/image/icon/brank_icon.png') no-repeat left center
        a
          display: block;
          height 100%
          line-height 44px
          padding-left 40px
        &:last-child
          margin-right 0
        &.active
          a
            color:rgb(251, 94, 111);
            &:hover
              color rgb(251, 94, 111)


</style>
