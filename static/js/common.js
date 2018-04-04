/**
 * Created by Administrator on 2017/11/3.
 */

var NV = {};
var UA = navigator.userAgent.toLowerCase();
try
{
  NV.name=!-[1,]?'ie':
    (UA.indexOf("firefox")>0)?'firefox':
    (UA.indexOf("chrome")>0)?'chrome':
    window.opera?'opera':
    window.openDatabase?'safari':
    'unkonw';
}catch(e){}
try
{
  NV.version=(NV.name=='ie')?UA.match(/msie ([\d.]+)/)[1]:
    (NV.name=='firefox')?UA.match(/firefox\/([\d.]+)/)[1]:
    (NV.name=='chrome')?UA.match(/chrome\/([\d.]+)/)[1]:
    (NV.name=='opera')?UA.match(/opera.([\d.]+)/)[1]:
    (NV.name=='safari')?UA.match(/version\/([\d.]+)/)[1]:
    '0';
}catch(e){}

try
{
  NV.shell=(UA.indexOf('360ee')>-1)?'360':
    (UA.indexOf('360se')>-1)?'360':
    (UA.indexOf('se')>-1)?'sougou':
    (UA.indexOf('aoyou')>-1)?'遨游浏览器':
    (UA.indexOf('theworld')>-1)?'世界之窗浏览器':
    (UA.indexOf('worldchrome')>-1)?'世界之窗极速浏览器':
    (UA.indexOf('greenbrowser')>-1)?'绿色浏览器':
    (UA.indexOf('qqbrowser')>-1)?'QQ浏览器':
    (UA.indexOf('baidu')>-1)?'百度浏览器':
    '未知或无壳';
}catch(e){}


// alert('浏览器UA='+UA+
//   '\n\n浏览器名称='+NV.name+
//   '\n\n浏览器版本='+parseInt(NV.version)+
//   '\n\n浏览器外壳='+NV.shell);


if(NV.name==='ie'&&parseInt(NV.version)<9){
  versionUnavailable();
}

function closeIt() {
  var wrap = document.getElementsByClassName('version-not-available')[0];

  wrap.parentNode.removeChild(wrap);
}

function handle() {
  // console.log("点击了他");
}
function  versionUnavailable() {
  var fileref = document.createElement("link");
  fileref.rel="stylesheet";
  fileref.type="text/css";
  fileref.href='/static/css/error.css';
  fileref.media="screen";
  var headobj = document.getElementsByTagName('head')[0];
  headobj.appendChild(fileref);
  var html = "";
  html += '<div class="version-not-available" id="img_v">'
       +     '<div class="version-not-tip" id="inner">'
       // +        '<span class="close" id="tip-close" onclick="closeIt()"><img src="../../static/img/close-icon.png" alt=""></span>'
       +        '<div class="version-tip-content" id="content">'
       +            '<div class="content-text">'
       +            '<p>当前浏览器版本过低，存在安全风险，请升级浏览器</p>'
       +            '<a href="https://www.google.cn/intl/zh-CN/chrome/browser/desktop/" target="_blank">Chorme</a>'
       +            '<a href="http://www.uc.cn/ucbrowser/download/" target="_blank" class="last">UC浏览器</a>'
       +            '</div>'
       +        '</div>'
       +      '</div>';
  html += '</div>';
  document.write(html);
}

