<template>
    <div>
      <div class="rank-content clear">
        <div class="sidebar">
          <ul class="sideNav">
            <li class="sb-item">辣鸡小说榜</li>
            <li class="sb-item">
              <router-link class="activeBar" to="/rank/golden">金椒榜</router-link>
            </li>
            <li class="sb-item">
              <router-link to="/rank/rec">小米椒</router-link>
            </li>
            <li class="sb-item">
              <router-link to="/rank/click">点击榜</router-link>
            </li>
            <li class="sb-item">
              <router-link to="/rank/latest">新书榜</router-link>
            </li>
            <li class="sb-item">
              <router-link to="/rank/sell">畅销榜</router-link>
            </li>
            <li class="sb-item">
              <router-link to="/rank/debate">吐槽榜</router-link>
            </li>
            <li class="sb-item">
              <router-link to="/rank/update">更新榜</router-link>
            </li>
            <li class="sb-item">
              <router-link to="/rank/reward">打赏榜</router-link>
            </li>
          </ul>
        </div>
        <div class="rank-main clear">
          <router-view ></router-view>
        </div>
      </div>
      
    </div>
</template>

<script type="text/ecmascript-6">
  import dHeader from '../header/detailHeader.vue'
  import Pages from '../pages/page.vue'
    export default{
     
      components:{
        'vue-page': Pages
      },
      data() {
        return {
          page: 1,
          pageSize: 10,
          total: 132,
          maxPage: 5
        }
      },
      methods: {
        pageHandler: function (page) {
          this.page = page
        }
      },
    }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  font-color = #FB5E6F
  .rank-content
    background :#ffccd1
    .sidebar
      width:212px
      float :left
      height :auto
      .sb-item
        display :list-item
        height :60px
        line-height: 60px
        text-align :center
        font-size :18px
      .sb-item:first-child
        height :86px
        line-height :86px
      .sb-item a
        display:block
        width:100%
        height :100%
      .sb-item a.active
        background :rgba(255,255,255,0.3)
        z-index: 999
        box-shadow :none
        color:#424242
        border-left :3px solid #FB5E6F
      .sb-item a:hover
        background :rgba(255,255,255,0.3)
        box-shadow :none
        color:#424242
    
</style>
