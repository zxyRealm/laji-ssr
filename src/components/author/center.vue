<template>
    <div class="wrapper" style="background: #fff;padding-bottom:50px">
      <template v-if="showIt">
        <div class="handle-btn first-created" v-if="dataList.length<1" >
          <router-link to="/author/writing/indite" class="add-book btn">
            创作新书
          </router-link>
        </div>
        <div class="handle-btn" v-else>
          <router-link to="/author/writing/indite" class="add-book btn">
            <img v-if="dataList.length>0" src="../../assets/image/icon/add@1_01.png" alt="">创作新书
          </router-link>
        </div>
      </template>
      <div class="user-book-list">
        <ul v-if="dataList && dataList.length>0">
          <li v-for="(item,$index) in dataList" class="ar-mb-item">
            <table>
              <tr>
                <th><p class="cover">封面</p></th>
                <th><p class="title">书名</p></th>
                <th><p class="words">总字数</p></th>
                <th><p class="latest">最近更新</p></th>
                <th><p class="state">状态</p></th>
                <th><p class="handle">作品管理</p></th>
              </tr>
              <tr>
                <td>
                  <div :class="{'book-cover-wrap':!item.bookCheckStatus}">
                    <img class="bookCover" :src="item.bookImage" alt="">
                    <span class="b-st" v-if="!item.bookCheckStatus">未审核</span>
                  </div>
                </td>
                <td>
                  <router-link
                    class="title-link txt-overflow"
                    target="_blank"
                    :to="'/book/'+item.bookId">
                    {{item.bookName}}
                  </router-link>
                </td>
                <td>{{item.bookWorldCount}}</td>
                <td>
                  <a v-if="!item.lastUpdateChapterId">暂无章节</a>
                  <router-link
                    class="txt-overflow latest" v-else
                    :to="'/chapter/'+item.lastUpdateChapterId"
                    target="_blank">
                    {{item.lastUpdateChapterName}}
                  </router-link>
                  <p>{{item.lastUpdateTime | time('long')}}</p>
                </td>
                <td><span>连载中</span></td>
                <td>
                  <p class="handle-link">
                    <router-link :to="'/author/writing/addChapter/'+item.bookId">发布章节</router-link>
                    <router-link :to="'/author/writing/editBook/'+item.bookId">修改信息</router-link>
                    <a :class="item.bookCheckStatus!=0?'active':null" @click="item.bookCheckStatus==0?upDateStatus('check',$index):null">
                      {{ item.bookCheckStatus | check }}
                    </a>
                    <a :class="item.bookCheckStatus==2?'active':null" @click="item.bookCheckStatus !==2?upDateStatus('vip',$index):null">
                      {{item.bookCheckStatus | check('vip')}}
                    </a>
                    
                    <a :class="(item.bookAuthorization==1||item.bookAuthorization==2)?'active':null" @click="item.bookAuthorization==0 || item.bookAuthorization==3?upDateStatus('sign',$index):null">
                      {{ item.bookAuthorization | sign }}
                    </a>
                  </p>
                </td>
              </tr>
            </table>
          </li>
        </ul>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
      data() {
          return {
            dataList:[],
            showIt:false
          }
      },
      methods:{
        getBookList(){
          this.$ajax("/book-AuthorAllBookInfo",{ authorId:this.$cookie('user_id')},json => {
            this.showIt = true;
            if(json.returnCode===200){
              this.dataList = json.data;
            }
          },'post','json',true)
        },
        upDateStatus(type,index){
          let val = this.dataList[index];
          let apply = () => {
            let tip = '';
            if(type==="vip"){
              if(val.bookCheckStatus===0){
                tip = '审核通过的书才可上架，请先通过审核！'
              }else {
                tip = '请主动联系网站客服，申请上架!'
              }
            }else if(type==='check'){
              tip = '请先发布两章正文，作品会在2个工作日之内审核通过，您也可以联系客服（打开微信搜索“辣鸡小说”）要求人工审核'
            }else if(type==='sign'){
              if(val.bookCheckStatus===0){
                tip =  '审核通过的书才可申请签约，请先通过审核！'
              }else {
                tip = '请主动联系网站客服，申请签约！'
              }
              
            }
            this.$confirm(tip, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
          };
          apply()
          
        }
      },
      mounted() {
        this.getBookList()
      },
      filters:{
        check:function (val,type) {
          let txt = '';
          if(type==='vip'){
            if(val===2){
              txt = '已上架'
            }else if(val===4){
              txt = '上架中'
            }else{
              txt = '申请上架'
            }
          }else {
            if(val===0){
              txt = '申请审核'
            }else if(val===3){
              txt = '审核中'
            }else{
              txt = '已审核'
            }
          }
          return txt
        },
        sign:function (val) {
          let msg = '';
          if(val===1||val===2){
            msg = '已签约'
          }else if(val===4){
            msg = '签约中'
          }else{
            msg = '申请签约'
          }
          return msg
        }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
