<template>
  <div class="wrapper">
    <div class="breadcrumb-wrap">
      <div class="fl">当前位置：</div>
      <div>
        <el-breadcrumb  separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/author/writing' }">作者中心</el-breadcrumb-item>
          <el-breadcrumb-item to="/author/writing">创建管理</el-breadcrumb-item>
          <el-breadcrumb-item>卷列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="writing-subNav">
      <ul>
        <li><router-link :to="{name:'ChapterList',params:{bid:$route.params.bid}}">章节列表</router-link></li>
        <li><router-link :to="{name:'addChapter',params:{bid:$route.params.bid}}">新增章节</router-link></li>
        <li><router-link :to="{name:'DraftList',params:{bid:$route.params.bid}}">草稿箱</router-link></li>
        <li><router-link :to="{name:'volumeList',params:{bid:$route.params.bid}}">卷列表</router-link></li>
      </ul>
    </div>
    <div class="table-wrapper bsw" >

      <el-table
        ref="multipleTable"
        :data="volumeList"
        style="width: 100%">

        <el-table-column
          align="center"
          prop="id"
          label="ID"
          width="50">
        </el-table-column>


        <el-table-column
          prop="bookName"
          :show-overflow-tooltip="true"
          label="书名"
          width="200">
        </el-table-column>
        <el-table-column
          prop="volumeName"
          :show-overflow-tooltip="true"
          label="分卷名">
        </el-table-column>

        <el-table-column
          prop="volumeOrder"
          align="center"
          label="序列号"
          width="100">
        </el-table-column>

        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleVolume('edit', scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteVolume(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="alertDialog"
      :title="dialogType=='add'?'新建分卷':'编辑分卷'"
      :visible.sync="centerDialogVisible"
      top="45vh"
      width="30%"
      center>
      <el-form :model="subData" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="volumeName">
          <el-input type="text" v-model="subData.volumeName" placeholder="请输入分卷名"></el-input>
        </el-form-item>
        <el-form-item prop="volumeOrder">
          <el-input type="text" :disabled="dialogType=='add'" v-model.number="subData.volumeOrder" placeholder="请输卷序列"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import draggable from 'vuedraggable'
  export default {
    components:{
      draggable
    },
    data() {
      return {
        volumeList:[],
        newDrag:true,
        cloneList:[],
        centerDialogVisible:false,
        dialogType:'add',
        subData:{},
        rules:{

        }
      }
    },
    methods:{
      getChapterList(){
        this.$ajax("/books-authorChapterList/"+this.$route.params.bid+'/2','',json => {
          if(json.returnCode===200){
            let arr = [];
            json.data.forEach((item)=>{
              if(item.resultList.length>0){
                arr = arr.concat(item.resultList)
              }
            });
            this.volumeList = arr;
          }
        },'get');
      },
//      编辑、新增分卷
      handleVolume(){

      },
//      删除分卷
      deleteVolume(){

      },
//      提交信息
      submitForm(){

      }
    },
    mounted(){
      this.getChapterList()
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
