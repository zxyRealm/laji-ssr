<template>
    <div class="menuList clear">
      <div class="menu-item ml-class clear">
        <div class="ml-title">
          作品分类：
        </div>
        <div class="ml-scope">
          <router-link class="click" :to="{name:'totalChild',params:{op1:'0',op2:$route.params.op2,op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">全部</router-link>
        </div>
        <div class="cml-item">
          <template v-for="item in bookClassName">
            <router-link :to="{name:'totalChild',params:{op1:item.id,op2:$route.params.op2,op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}" @click.native="getBookList">{{item.classificationName}}</router-link>
          </template>
        </div>

      </div>
      <div class="menu-item ml-words clear">
        <div class="ml-title">
          作品字数：
        </div>
        <div class="ml-scope">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:'0',op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">不限</router-link>
        </div>
        <div class="cml-item">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:'1',op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">30万以下</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:'2',op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">30-50万</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:'3',op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">50-100万</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:'4',op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">100-200万</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:'5',op3:$route.params.op3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">200万以上</router-link>
        </div>
      </div>
      <div class="menu-item ml-state clear">
        <div class="ml-title">
          作品更新：
        </div>
        <div class="ml-scope">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:0,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">不限</router-link>
        </div>
        <div class="cml-item">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:1,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">本日</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:2,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">三日</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">七日</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:4,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">半月内</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:5,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">一月内</router-link>
        </div>
      </div>
      <div class="menu-item ml-update clear">
        <div class="ml-title">
          作品状态：
        </div>
        <div class="ml-scope">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:$route.params.op3,op4:'0',op5:$route.params.op5,page:$route.params.page}}">不限</router-link>
        </div>
        <div class="cml-item">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:$route.params.op3,op4:'1',op5:$route.params.op5,page:$route.params.page}}">连载中</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:$route.params.op3,op4:'2',op5:$route.params.op5,page:$route.params.page}}">已完结</router-link>
          <!--<router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:$route.params.op3,op4:'3',op5:$route.params.op5,page:$route.params.page}}">已出版</router-link>-->

        </div>
      </div>

      <div class="menu-item ml-vip clear">
        <div class="ml-title">
          其他选项：
        </div>
        <div class="ml-scope">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:$route.params.op3,op4:$route.params.op4,op5:'0',page:$route.params.page}}">全部</router-link>
        </div>
        <div class="cml-item">
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:$route.params.op3,op4:$route.params.op4,op5:'2',page:$route.params.page}}">免费作品</router-link>
          <router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:$route.params.op3,op4:$route.params.op4,op5:'3',page:$route.params.page}}">VIP作品</router-link>
          <!--<router-link :to="{name:'totalChild',params:{op1:$route.params.op1,op2:$route.params.op2,op3:3,op4:$route.params.op4,op5:$route.params.op5,page:$route.params.page}}">已出版</router-link>-->
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
    export default{
      data() {
        return {
            classList:[]
        }
      },
      methods: {
        getBookList(){
        },
        getBookClass() {
          this.$ajax('/ranking-classification','',(json) => {
            if(json.returnCode===200){
              this.classList = json.data;
            }
          },'get')
        }
      },
      created(){

      },
      mounted(){
        this.$store.dispatch("FETCH_BOOK_CLASS_NAME")
//        this.getBookClass()
      },
      computed:{
        ...mapGetters([
            'bookClassName'
        ])
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  font-color = #FB5E6F
  btn-color =  #f77583
.menuList
  padding :24px 10px
  background: #f6f6f6
  margin-top 14px
  .menu-item .ml-title,.menu-item .ml-scope
    float left
  .menu-item .cml-item
    overflow hidden
  .menu-item:last-child
    margin-bottom:0
  .menu-item
    line-height :40px
    font-size :14px
    margin-bottom :18px
    a.active
      background :btn-color
      color :#fff
      box-shadow :none
    a.active:hover
      color:#fff!important
    .ml-title
      width:104px
    .ml-scope
      width :82px
      a
        display:inline-block
        padding :0 10px
        border-radius :15px
        line-height :28px
      a.active:hover
        color:#fff!important
    .cml-item a:nth-child(7)
      margin-right :0
    .cml-item
      a
        display :inline-block
        line-height :28px
        padding :0 8px
        border-radius :15px
        margin-right:40px

</style>
