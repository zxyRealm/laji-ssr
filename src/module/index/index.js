// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import '../../assets/js/common'
import Vue from 'vue'
import App from './App.vue'
import router from '../../router/index'
// import Zepto from 'zepto'
import Consume from '../../components/custom/custom'
import Echarts from 'echarts'
import myIcon from '../../components/custom/icon.vue'
import md5 from 'MD5'
import 'layui-laydate/src/theme/default/laydate.css'
Vue.component(myIcon.name,myIcon);
Vue.use(require('vue-wechat-title'));
// Vue.use(require('../../assets/js/fun'));
Vue.prototype.$md5 = md5;
// Vue.prototype.$http = Zepto;
import {
  Pagination, Dialog, Autocomplete, Dropdown, DropdownMenu, DropdownItem,
  Menu, Submenu, MenuItem, MenuItemGroup,
  Input, InputNumber, Radio, RadioGroup, RadioButton,
  Checkbox,CheckboxGroup, Switch, Select, Option,
  OptionGroup, Button, ButtonGroup,
  Table, TableColumn, DatePicker, TimeSelect, TimePicker, Popover,
  Tooltip, Breadcrumb, BreadcrumbItem, Form, FormItem, Tabs, TabPane,
  Tag, Tree, Alert, Slider, Icon, Row, Col, Upload,
  Progress, Spinner, Badge, Card, Rate,
  Steps, Step, Carousel, Scrollbar,
  CarouselItem, Collapse, CollapseItem, Cascader, ColorPicker,
  Loading, MessageBox, Message, Notification
} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(Loading,MessageBox,Message,
  Breadcrumb,
  BreadcrumbItem,
  Steps,Step,
  Tabs,TabPane,
  Menu,MenuItem,
  Form,FormItem,
  Input,InputNumber,
  Radio,RadioGroup,RadioButton,
  Checkbox,CheckboxGroup,
  Select,Progress,
  Option,OptionGroup,
  Button,ButtonGroup,
  DatePicker,TimeSelect,TimePicker,
  Col,Switch,Row,
  Dropdown,DropdownMenu,DropdownItem,
  Carousel,CarouselItem,
  Pagination,Badge,
  Popover,Collapse,CollapseItem,Dialog,Autocomplete);
Vue.prototype.$echarts = Echarts;
Vue.prototype.$loading = Loading;
Vue.prototype.$message = Message;
Vue.prototype.$consume = Consume; //打赏、小米椒、金椒
Vue.prototype.$comfirm = MessageBox;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$confirm  = MessageBox.confirm;
Vue.config.productionTip = false;
Vue.component(Breadcrumb.name,Breadcrumb);
Vue.component(BreadcrumbItem.name,BreadcrumbItem);
Vue.component(Steps.name,Steps);
Vue.component(Step.name,Step);
Vue.component(Tabs.name,Tabs);
Vue.component(TabPane.name,TabPane);

Vue.component(Menu.name,Menu);
Vue.component(Submenu.name,Submenu);
Vue.component(MenuItem.name,MenuItem);
Vue.component(MenuItemGroup.name,MenuItemGroup);

Vue.component(Form.name,Form);
Vue.component(FormItem.name,FormItem);

Vue.component(Input.name,Input);
Vue.component(InputNumber.name,InputNumber);

Vue.component(Radio.name,Radio);
Vue.component(RadioGroup.name,RadioGroup);
Vue.component(RadioButton.name,RadioButton);

Vue.component(Progress.name,Progress);
Vue.component(Select.name,Select);
Vue.component(Option.name,Option);
Vue.component(OptionGroup.name,OptionGroup);

Vue.component(Button.name,Button);
Vue.component(ButtonGroup.name,ButtonGroup);

Vue.component(Radio.name,Radio);
Vue.component(RadioGroup.name,RadioGroup);
Vue.component(RadioButton.name,RadioButton);

Vue.component(Checkbox.name,Checkbox);
Vue.component(CheckboxGroup.name,CheckboxGroup);

Vue.component(DatePicker.name,DatePicker);
Vue.component(TimeSelect.name,TimeSelect);
Vue.component(TimePicker.name,TimePicker);
Vue.component(Col.name,Col);
Vue.component(Row.name,Row);
Vue.component(Switch.name,Switch);

Vue.component(Dropdown.name,Dropdown);
Vue.component(DropdownMenu.name,DropdownMenu);
Vue.component(DropdownItem.name,DropdownItem);

Vue.component(Carousel.name,Carousel);
Vue.component(CarouselItem.name,CarouselItem);

Vue.component(Pagination.name,Pagination);
Vue.component(Badge.name,Badge);

Vue.component(Popover.name,Popover);
Vue.component(Collapse.name,Collapse);
Vue.component(CollapseItem.name,CollapseItem);
Vue.component(Dialog.name,Dialog);
Vue.component(Upload.name,Upload);
Vue.component(Autocomplete.name,Autocomplete);
/* eslint-disable no-new */
// 数字过滤器
Vue.filter('number',function (value) {
  let rxxNum = parseInt(value);
  if(rxxNum>1000 && rxxNum<10000){
    rxxNum= (rxxNum/1000).toFixed(1) + ' k';
  }else if(rxxNum>=10000){
    rxxNum = (rxxNum/10000).toFixed(1) +'万';
  }
  return rxxNum
});
// 时间格式化过滤器
Vue.filter('time',function (value,type,separator) {
  let T,Time;
  if(separator===undefined){
    separator = '-'
  }
  if(value===undefined || value===''){
    T = new  Date()
  }else {
    T = new Date(value)
  }
  let year = T.getFullYear();
  let years = String(year).slice(2);
  let mon  = T.getMonth()+1<10?'0'+(T.getMonth()+1):T.getMonth()+1;
  let date = T.getDate()<10?'0' + T.getDate():T.getDate();
  let hour = T.getHours()<10?'0' + T.getHours():T.getHours();
  let min  = T.getMinutes()<10?'0'+T.getMinutes():T.getMinutes();
  let sec  = T.getSeconds()<10?'0'+T.getSeconds():T.getSeconds();

  if(type==='long'){
    Time = year + separator + mon + separator + date + ' ' + hour + ':' + min +':' + sec
  }
  if(type==='middle'){
    Time = year + separator + mon + separator + date + ' ' + hour + ':' + min
  }
  if(type==='special'){
    Time = years + separator + mon + separator + date + ' ' + hour + ':' + min
  }
  if(type==='sort'||type===undefined){
    Time = year + separator + mon + separator + date
  }

  return Time
});

Vue.filter('times',function (value) {
});

// 文本内容字数统计
Vue.filter("words",function (value){
  let sLen = 0;
  let str = value;
  try{
    //先将回车换行符做特殊处理
    str = str.replace(/(\r\n+|\s+| )+/g,"龘");
    //处理英文字符数字，连续字母、数字、英文符号视为一个单词
    str = str.replace(/[\x00-\xff]/g,"m");
    //合并字符m，连续字母、数字、英文符号视为一个单词
    str = str.replace(/m+/g,"*");
    //去掉回车换行符
    str = str.replace(/龘+/g,"");
    //返回字数
    sLen += str.length;
  }catch (e){
    console.log(e)
  }
  return sLen;
});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components:{App}
}).$mount("#app");
