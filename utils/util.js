
import {getSetting,openSetting,showModal,showToast,getLocation} from './wx.js'
const App =getApp()
var QQMapWX = require('../plugin/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk= new QQMapWX({
  key: App.globalData.qqKey
});
//时间过滤
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//时间过滤
const formatTime2 = time => {
  const date =new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取当前位置
const getAuth = () =>{
  return new Promise((resolve,reject)=>{
    getSetting().then(re=>{
      if (!re.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: 'scope.userLocation',
          success () {
            inLocation().then(result=>{
              return resolve(result)
            })
          },
          fail(){
            showModal({title:'请求授权当前位置',content: '检测到您没打开此小程序的定位权限，是否去设置打开'}).then(res=>{
              if(res.cancel){
                return showToast({title:'拒绝授权'})
              }
                openSetting().then(auth=>{
                  if(!auth.authSetting["scope.userLocation"]){
                    return showToast({title:'授权失败'}) 
                  }
                  showToast({title:'授权成功'})
                  inLocation().then(result=>{
                    return resolve(result)
                  })
                })
            })
          }
        })
      }else {
        inLocation().then(result=>{
          return resolve(result)
        })
      }
    })
  })
  
}
const inLocation= () =>{
  return new Promise((resolve, reject)=> {
  getLocation().then(res=>{
    const latitude = res.latitude
    const longitude = res.longitude
    getCity(latitude, longitude).then(result=>{
     return resolve (result)
    })
  }).catch(error=>{
    console.log(error)
  })
})
}
const getCity= (latitude,longitude) =>{
  return new Promise((resolve, reject)=> {
  qqmapsdk.reverseGeocoder({
    location: {
      latitude,
      longitude
    },
    success: function (res) {
      return resolve(res)
    },
    fail: function (err) {
      showToast({title:'获取城市失败'})
    }
  });
});
}
/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}
const isNull = data =>{
 if(data.content){
    return true
 }
 const topic = data.topic?data.topic:'不能为空'
   showToast({title:`${data.title}${topic}`})
   return false
}
const formatTime3 = date =>{
  return `${formatNumber(new Date(date).getFullYear())}${formatNumber(new Date(date).getMonth() + 1)}${formatNumber(new Date(date).getDate())}`
}
const checkPhone = (value) =>{ 
  return !(/^1[3456789]\d{9}$/.test(value))   
}
const turnImg = (html) =>{
  if(!html){
    return
  }
  return html.replace(/\<img/g, '<img style="max-width:100%;height:auto"')
}
const circleImg=(ctx, img, width , heigth , x ,y )=> {
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2 + x, heigth / 2 + y, width / 2, 0, Math.PI * 2, false);
  ctx.clip();
  ctx.drawImage(img, x, y, width, heigth);
  ctx.restore();
}
 /**
   * 绘制圆角矩形
   * @param {*} x 起始点x坐标
   * @param {*} y 起始点y坐标
   * @param {*} w 矩形宽
   * @param {*} h 矩形高
   * @param {*} r 圆角半径
   * @param {*} ctx 画板上下文
   */
  const darwRoundRect=(x, y, w, h, r,color,ctx)=> {
    ctx.save()
    ctx.beginPath()

    // 左上弧线
    ctx.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI)
    // 左直线
    ctx.moveTo(x, y + r)
    ctx.lineTo(x, y + h - r)
    // 左下弧线
    ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, 1 * Math.PI)
    // 下直线
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x + w - r, y + h)
    // 右下弧线
    ctx.arc(x + w - r, y + h - r, r, 0 * Math.PI, 0.5 * Math.PI)
    // 右直线
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w, y + r)
    // 右上弧线
    ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI)
    // 上直线
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + r, y)

    ctx.setFillStyle(color)
    ctx.fill()
  }
  /**
         * ctx： 画布的上下文环境
         * content： 需要绘制的文本内容
         * drawX： 绘制文本的x坐标
         * drawY： 绘制文本的y坐标
         * lineHeight：文本之间的行高
         * lineMaxWidth：每行文本的最大宽度
         * lineNum：最多绘制的行数
         */
        const textPrewrap=(ctx, content, drawX, drawY, lineHeight, lineMaxWidth, lineNum)=> {
          var drawTxt = ''; // 当前绘制的内容
          var drawLine = 1; // 第几行开始绘制
          var drawIndex = 0; // 当前绘制内容的索引

          // 判断内容是否可以一行绘制完毕
          if (ctx.measureText(content).width <= lineMaxWidth) {
            ctx.fillText(content.substring(drawIndex, i), drawX, drawY);
          } else {
            for (var i = 0; i < content.length; i++) {
              drawTxt += content[i];
              if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
                if (drawLine >= lineNum) {
                  ctx.fillText(content.substring(drawIndex, i) + '..', drawX, drawY);
                  break;
                } else {
                  ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY);
                  drawIndex = i + 1;
                  drawLine += 1;
                  drawY += lineHeight;
                  drawTxt = '';
                }
              } else {
                // 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
                if (i === content.length - 1) {
                  ctx.fillText(content.substring(drawIndex), drawX, drawY);
                }
              }
            }
          }
        }
module.exports = {
  formatTime: formatTime,
  formatTime2:formatTime2,
  getAuth:getAuth,
  wxPromisify: wxPromisify,
  isNull:isNull,
  formatTime3:formatTime3,
  checkPhone:checkPhone,
  turnImg:turnImg,
  circleImg:circleImg,
  darwRoundRect:darwRoundRect,
  textPrewrap:textPrewrap
}
