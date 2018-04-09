<template>
  <div class="rxx-badge-item">
    <div class="rxx-badge-content">
      {{content}}
      <div class="rxx-badge__key" :style="{backgroundColor:color?color:(value>0?'#f77482':null)}" :class="{'null':isNull}" @click="handleKeyClick(uuid)">{{value>0?(value>99?'99':value):''}}</div>
    </div>
    <div class="rxx-badge-child-wrap" v-if="active">
      <div class="rxx-badge-child">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data(){
      return {
      }
    },
    props:{
      value:{
        type:[Number,String,Object],
        default(val) {
          return val;
        }
      },
      uuid:{
        type:[String,Number],
        default() {
          return '';
        }
      },
      content:{
        type:String,
        default() {
          return '';
        }
      },
      color:{
        type:String,
        default(){
            return '#f77482';
        }
      },
      name: {
        type: [String, Number],
        default() {
          return this._uid;
        }
      }
    },
    methods:{
      dispatch(componentName, eventName, params) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.componentName;
    
        while (parent && (!name || name !== componentName)) {
          parent = parent.$parent;
          if (parent) {
            name = parent.$options.componentName;
          }
        }
        if (parent) {
          parent.$emit.apply(parent, [eventName].concat(params));
        }
      },
      handleKeyClick(val) {
        this.$emit('handleClick',val);
        this.dispatch('RxxBadge', 'item-click', this);
      }
    },
    computed:{
      active:function () {
        return this.$parent.activeNames.indexOf(this.name) > -1;
      },
      isNull:function () {
        return !this.value || !(parseInt(this.value)>0)
      }
    },
    watch: {
    
    }
  }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.rxx-badge
  position relative
  .shadow-wrap
    position absolute
    top -170px
    left 0
    height calc(100% + 210px)
    width calc(100% - 52px)
    background linear-gradient(top, transparent 10%, rgb(249, 247, 243),rgb(249, 247, 243))
    &.bgColor1
      background linear-gradient(top, transparent 10%, rgb(249, 247, 243),rgb(249, 247, 243))
    &.bgColor2
      background linear-gradient(top, transparent 10%, rgb(237, 243, 251),rgb(237, 243, 251))
    &.bgColor3
      background linear-gradient(top, transparent 10%, rgb(244, 249, 243),rgb(244, 249, 243))
    &.bgColor4
      background linear-gradient(top, transparent 10%, rgb(34, 43, 70),rgb(34, 43, 70))
  .rxx-badge-item:first-child .rxx-badge-content
    padding-top:0
  .rxx-badge-content
    position relative
    border-right:2px solid #efefef
    margin :0 26px 0 54px
    padding-right :26px
    padding-top :15px
    min-height: 30px;
    line-height: 2.2;
    word-wrap: break-word;
    word-break: break-all;
    text-indent :2em
    .rxx-badge__key
      position absolute
      bottom :0
      right :0
      width :28px
      height :28px
      padding :5px
      text-align :center
      background :#c8c8c8
      margin-right :-14px
      border-radius :50%
      font-size :12px
      line-height :1.6
      color:#fff
      cursor :pointer
      text-indent:0
    .rxx-badge__key.null
      margin-right :-6px
      height :0
      width :0
  .rxx-badge-child-wrap
    padding-top:16px
    width :894px
    background:url("/static/img/read-reply-bg.png") no-repeat right -10px
    background-size :100%
    .rxx-badge-child
      position relative
      box-shadow :0 -4px 4px -3px #D0D3C1 inset
      padding :0 90px 0 83px
      overflow hidden
      background #FEFFFA
  .rxx-badge-child:after
      content:''
      position: absolute
      width: 0
      height: 0
      border-width: 10px
      border-style: solid
      border-color:#fff transparent transparent #fff
      top: -10px
      right :41px
      margin-left:-12px
      transform :rotate(45deg)
</style>
