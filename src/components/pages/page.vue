<template>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {}
    Vue.component('zpagenav', {
      template: '<div class="zpagenav">' +
      '<ul class="page-ul">' +
      '<li :key="index" v-for="(item,index) in pageList" :class ="item.class" @click.stop="setPage(item)" v-html="item.html">' +
      '</li>' +
      '</ul>' +
      '<ul class="jump-ul">' +
      '<li class="mr10">共{{total}}条</li>' +
      '<li>跳转至 <input class="jumpPage" type="number" min="1" :max="pageNum" > 页</li>' +
      '</ul>' +
      '</div>',
      props: {
        prevHtml: String,
        nextHtml: String,
        page: Number,
        total: Number,
        pageSize: Number,
        maxPage: Number
      },
      data(){
          return {
            pageNum:Number
          }
      },
      computed: {
        pageList: function () {
          let _this = this, pageList = [];
          this.pageNum = Math.ceil(_this.total/_this.pageSize);
          let pageCount = Math.ceil(_this.total / _this.pageSize);
          let page = _this.page;
          let prevHtml = _this.prevHtml ? _this.prevHtml : '上一页';
          let nextHtml = _this.nextHtml ? _this.nextHtml : '下一页';
          let maxPage = _this.maxPage ? _this.maxPage : 9;
          let hasPrev = page > 1;
          let hasNext = page < pageCount;
          //上一页
          pageList.push({
            class: hasPrev ? '' : 'disabled',
            page: hasPrev ? page - 1 : page,
            html: prevHtml
          });
          //首页
          pageList.push({
            class: page == 1 ? 'active' : '',
            page: 1,
            html: 1
          });
      
          let p0 = Math.floor(maxPage / 2);
          let p1 = 1 + 2 + p0;//首页+省略至少2个页码+中间页面数的一半
      
          let start, end;
          if (page >= p1) {
            start = page - p0;
            //前置省略号
            pageList.push({
              class: 'dot',
              page: page,
              html: '...'
            });
          } else {
            start = 2;
          }
      
          let p2 = page + p0;
          if (p2 < pageCount) {
            end = p2;
          } else {
            end = pageCount - 1;
          }
      
      
          //页码列表
          for (let i = start; i <= end; i++) {
            pageList.push({
              class: page == i ? 'active' : '',
              page: i,
              html: i
            });
          }
          
          if (end < pageCount - 1) {
            //后置省略号
            pageList.push({
              class: 'dot',
              page: page,
              html: '...'
            });
          }
          
          //尾页
          if (pageCount > 1) {
            pageList.push({
              class: page == pageCount ? 'active' : '',
              page: pageCount,
              html: pageCount
            });
          }
      
          //下一页
          pageList.push({
            class: hasNext ? '' : 'disabled',
            page: hasNext ? page + 1 : page,
            html: nextHtml
          });
          return pageList;
        }
      },
      methods: {
        setPage: function (item) {
          if (item.class == '') {
            this.$emit('pagehandler', item.page);
          }
        }
      }
    });
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  font-color = #FB5E6F
  btn-color =  #F77583
  normalBtn = #979797
  borderline = #979797
.zpagenav
  -webkit-user-select: none;
  font-family: arial
  color: #48576a
  font-size:14px
  height auto
  background-color #fff
  padding :20px 0
  li
    display:inline-block
  .page-ul
    display: inline-block;
    padding: 0;
    height :30px
    li
      padding: 0 4px
      background: #fff
      font-size: 12px
      min-width: 30px
      height: 30px
      line-height: 30px
      cursor: pointer
      box-sizing: border-box
      text-align: center
      margin:0 5px
      border:1px solid borderline
      border-radius :5px
    li:hover
      color: font-color;
    li.active
      border-color: btn-color;
      background-color: btn-color;
      color: #fff;
      cursor: default;
      text-decoration:none
    li.active:hover
      color: #fff;
    li.disabled
      cursor: not-allowed;
    li.dot
      cursor: default;
      border :none
  .jump-ul
    float: right
    padding :2px 0
    /*margin-top :13px*/
    color: #99a2aa
    font-size: 12px
    margin-right:18px;
    .jumpPage
      display inherit
      box-sizing :content-box
      margin: 0 5px
      padding: 0 10px
      height: 24px
      font-size: 12px
      box-shadow: none
      width: 24px
      border-radius: 4px
      border: 1px solid #ddd
      outline: none
      text-align: center
    button
      background: #efefef
      border:1px solid #ddd
      padding :4px 6px
      margin:4px 20px 0
      border-radius :5px
      color :#666
  
</style>
