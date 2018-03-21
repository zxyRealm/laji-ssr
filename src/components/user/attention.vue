<template>
    <div class="user-af-wrapper">
      <div class="af-tabs-nav">
        <router-link to="/user/attention">我的关注</router-link>
        <router-link to="/user/fans">我的粉丝</router-link>
      </div>
      <!--关注列表-->
      <ul v-if="attentionList.list" class="user-af-list">
        <template v-if="attentionList.list.length>0" >
          <li v-for="(item,$index) in attentionList.list" class="clear af-list-item">
            <div class="af-item-avatar">
              <router-link :to="'/reader/'+item.followId">
                <img :src="item.userHeadPortraitURL" :alt="item.userName">
                <i class="zdy-icon__user_vip"></i>
              </router-link>
            </div>
            <div class="af-item-main">
              <div class="af-handle fr">
              <span class="v-middle zdy-attention__wrap" @click="!item.isfollow?$addAttention($index,'ate'):$cancelAttention($index,'ate')">
                <i :class="{cancel:!item.isfollow}" class="zdy-icon__attention v-item"></i>关注
              </span>
              </div>
              <div class="af-item-content">
                <p class="user-info">
                  <span class="v-item">{{item.followUserName}}</span>
                  <i class="v-item zdy-icon__sex" :class="item.userSex?'girl':null" ></i>
                  <zdy-icon__user_level :grade="item.userGrade"></zdy-icon__user_level>
                </p>
                <div class="item-context">
                  {{item.userAutograph}}
                </div>
              </div>
    
            </div>
          </li>
        </template>
        <zdy-hint v-else type="atn"></zdy-hint>
      </ul>
      <el-pagination
        class="pbg"
        v-if="attentionList.list && attentionList.total>attentionList.pageSize"
        @current-change="handleCurrentChange"
        :current-page.sync="attentionList.pageNum"
        :page-size="attentionList.pageSize"
        layout="prev, pager, next, jumper"
        :total="attentionList.total">
      </el-pagination>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
          return {
            attentionList:{}
          }
        },
      methods:{
        handleCurrentChange(page){
          this.getAttentionList(page)
        },
        getAttentionList(page){
          this.$ajax("/fans-Follow", {
            startpage: page
          },json => {
            if (json.returnCode === 200) {
              json.data.list.map((item) => {
                item.isfollow = true
              });
              this.attentionList = json.data
            }
          },'get')
        }
      },
      mounted(){
        this.getAttentionList(1)
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
