<template>
    <div class="wrapper">
      <div class="breadcrumb-wrap">
        <div class="fl">当前位置：</div>
        <div>
          <el-breadcrumb  separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/author/writing' }">作者中心</el-breadcrumb-item>
            <el-breadcrumb-item to="/author/writing">创建管理</el-breadcrumb-item>
            <el-breadcrumb-item>章节列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="writing-subNav">
        <ul>
          <li><router-link :to="{name:'ChapterList',params:{bid:$route.params.bid}}">章节列表</router-link></li>
          <li><router-link :to="{name:'addChapter',params:{bid:$route.params.bid}}">新增章节</router-link></li>
          <li><router-link :to="{name:'DraftList',params:{bid:$route.params.bid}}">草稿箱</router-link></li>
        </ul>
      </div>
      <div class="table-wrapper bsw" >
        <table class="writing-table">
          <thead>
            <tr>
              <th width="126" >卷名</th>
              <th width="320">章节名</th>
              <th width="100">字数</th>
              <th>发布时间</th>
              <th width="80">状态</th>
            </tr>
            <tr v-if="!ChapterList">
              <td>暂无章节</td>
            </tr>
          </thead>
          <draggable v-model="ChapterList" :options="{draggable:'.drag-item'}" element="tbody" :move="dragMove" @start="dragStart" @update="dragEnd">
            <tr v-if="ChapterList" v-for="(item,$index) in ChapterList" class="drag-item" :key="$index">
              <td class="tl" >
                <p class="nclass txt-overflow">
                  <router-link
                    :to="'/author/writing/volume/'+item.bookId"
                    :title="item.volumeName">
                    {{item.volumeName}}
                  </router-link>
                </p>
              </td>
              <td class="tl">
                <p class="cname">
                  <router-link
                    class="txt-overflow"
                    :title="item.chapterTitle"
                    :to="'/author/writing/editChapter/'+item.id">
                    {{item.chapterTitle}}
                  </router-link>
                  <i v-show="curTime<item.releaseTime" class="el-icon-time"></i>
                </p>
              </td>
              <td>{{item.chapterLength}}</td>
              <td>{{item.releaseTime|time("long")}}</td>
              <td>
                <span class="green" v-if="!item.chapterIsvip">免费</span>
                <span class="red" v-else>VIP</span>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
 import draggable from 'vuedraggable'
 import { FetchNetTime,FetchAuthorChapterList,FetchAuthorHandleBook } from '../../api'
 import { mapGetters } from 'vuex'
  export default {
    components:{
      draggable
    },
    data() {
      return {
        newDrag:true,
        cloneList:[],
        curTime:'',
        autoTime:null
      }
    },
    methods:{
      getChapterList(){
          FetchNetTime().then(time=>{
              if(time.returnCode===200){
                  this.curTime = time.data.beijing;
                  clearInterval(this.autoTime);
                  this.autoTime = setInterval(()=>{
                    this.curTime+=1000
                  },1000)
              }
          });
          this.$store.dispatch('FETCH_AUTHOR_CHAPTER_LIST',this.$route.params.bid);
//          FetchAuthorChapterList(this.$route.params.bid)/
      },
      dragMove(evt){
        let val = evt.draggedContext;
        if(this.cloneList[val.index].volumeId!==this.cloneList[val.futureIndex].volumeId){
          if(this.newDrag){
            this.$message({message:'不同分卷不可调整顺序！',type:'warning'});
            this.newDrag = false;
          }
        }
        return this.cloneList[val.index].volumeId===this.cloneList[val.futureIndex].volumeId;
      },
      dragStart(evt){
        this.newDrag = true;
        this.cloneList = JSON.parse(JSON.stringify(this.ChapterList));
        if(this.ChapterList[evt.oldIndex].whetherPublic){
          this.$message({ message:'草稿箱内容不可调序',type:'warning' });
          return false
        }
      },
      dragEnd(evt){
        let old = this.cloneList[evt.oldIndex];
        let New = this.cloneList[evt.newIndex];
        this.$myLoad('正在调整中...');
        FetchAuthorHandleBook({
          startNum:old.chapterOrder,
          endNum:New.chapterOrder,
          bookid:old.bookId,
          volumeid:old.volumeId,
          startChapterid:old.id
        },'cc').then(res=>{
          this.$nextTick(()=>{
            this.$loading().close()
          });
          if(res.returnCode===200){
            this.getChapterList();
            this.$message({ message:'调整成功',type:'success' })
          }
        });
        return false
      }
    },
    filters:{
      isTime:function (val) {
          let state = false;
          if(Number(val)){
             if(val>this.curTime){
                 state = true
             }else {
                 state = false
             }
          }
          return state
      }
    },
    mounted(){
        this.getChapterList();
    },
    computed:{
      ...mapGetters({
        ChapterList:'authorChapterList'
      })
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
