
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
      latitude: latitude,
      longitude: longitude
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

module.exports = {
  formatTime: formatTime,
  getAuth:getAuth,
  wxPromisify: wxPromisify
}
