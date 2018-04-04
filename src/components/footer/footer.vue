<template>
  <footer>
    <div class="footer-inner">
      <div class="about">
        <div class="f-link">
          <div class="ft-title">
            友情链接
          </div>
          <ul>
            <!--<li v-for="(item,index) in link">-->
              <!--<a :href="item.href" target="_blank">-->
                <!--{{item.name}}-->
              <!--</a>-->
            <!--</li>-->
          </ul>
        </div>
        <div class="contact">
          <div class="ft-title">
            联系我们
          </div>
          <ul>
            <li><span>微 信 号：</span>lajixiaoshuo</li>
            <li><span>客服邮箱：</span>2177488142@qq.com</li>
            <li><span>工作时间：</span>09:00--18:00</li>
          </ul>
        </div>
      </div>
      
      <ul class="help">
        <!--<li><a href="javascript:;">关于辣鸡</a>|</li>-->
        <!--<li><a href="javascript:;">联系我们</a>|</li>-->
        <!--<li><a href="javascript:;">用户须知</a>|</li>-->
        <!--<li><a href="javascript:;">公司招聘</a>|</li>-->
        <!--<li><a href="javascript:;">帮助中心</a></li>-->
      </ul>
      <div class="copyright">
        <p>COPYRIGHT©辣鸡小说网 2017-2027，版权所有 杭州樱熊网络科技有限公司 </p>
        浙ICP备16023962号-2
        <p>
          <!--<a href="javascript:0;">-->
            <!--<img src="/static/img/icon/beian1.png" alt="">浙公网安备-->
          <!--</a>-->
        </p>

      </div>
    </div>
  </footer>
</template>

<script type="text/ecmascript-6">
export default {
    data: function(){
      return {
          link:[
            {'name':'华夏天空','href':'http://www.hxtk.com/'},
            {'name':'幻侠小说网','href':'http://www.huanxia.com'},
            {'name':'小说阅读阁','href':'http://www.yueduge.net/'},
            {'name':'逐浪小说网','href':'http://www.zhulang.com/'},
            {'name':'新小说网','href':'http://www.xxs8.com'},
            {'name':'创世小说','href':'http://chuangshi.qq.com/ '},
            {'name':'3G小说网','href':'http://www.3gsc.com.cn/'},
            {'name':'龙的天空','href':'http://www.lkong.net'},
            {'name':'乐读中文网','href':'http://book.txtbook.com.cn'},
            {'name':'陌上香坊','href':'http://www.msxf.net'},
            {'name':'黑岩阅读网','href':'http://www.heiyan.com'},
            {'name':'360小说网','href':'http://xiaoshuo.360.cn'},
            {'name':'言情小说','href':'http://mm.shuhai.com'},
            {'name':'免费小说大全','href':'http://book.km.com'},
            {'name':'做客文学网','href':'http://www.zuok.com.cn'},
            {'name':'甜阅读文学','href':'http://www.sweetread.net'},
            {'name':'言情书店','href':'http://www.yqsd.cn/'},
            {'name':'时阅文学网','href':'http://www.timeread.com/'},
            {'name':'凌云文学网','href':'http://www.lingyun5.com'},
            {'name':'浩阅读文学网','href':'http://www.haoread.com/ '},
            {'name':'书丛网','href':'http://www.shucong.com/ '},
            {'name':'翠微居','href':'http://www.mixs.cn'},
            {'name':'阅读小说网','href':'http://www.yuedunovel.com '},
            {'name':'汤圆创作','href':'http://www.itangyuan.com/'},
            {'name':'华策文学','href':'http://www.hcsip.com/'}
          ]
      }
    }
}

</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .ft-title
    height: 60px
    line-height: 60px
    font-size: 16px
  footer
    width: 100%
    height :400px
    background-color: #F1F9FC
    font-size:12px
    .footer-inner
      /*background-color: aqua*/
      /*height: 350px*/
      .about
        padding: 0 15px
      .about .f-link
          padding-right: 25px
          float: left
          width: 750px
          li
            display :inline-block
            line-height: 30px
            margin-right:16px
      .about .contact
        overflow: hidden
        li
          display :inline-block
          height: 30px
          line-height:30px
          font-size :12px
      .declare
        margin-top :15px
        padding: 0 15px 15px
        border-bottom :1px dashed #666
        border-top:1px dashed #666
        .de-content
          text-indent:2em

      .help
        text-align:center
        width :100%
        margin :10px 0
        li
          display :inline-block
        li a
          margin:0 10px
      .copyright
        text-align :center
        img
          display inline-block
          vertical-align middle
          margin-right 5px


</style>
