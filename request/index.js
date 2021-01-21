import {
  showToast
} from '../utils/wx'
// const app= getApp()
// 后台url
const baseUrl = 'https://api.zhetrip.com';
// 同时发送异步代码的次数
let ajaxTimes = 0;
let statusCode = {
  success: 200,
  fail: 500,
  noLogin: 201, //未登录
  isFreeze: 250 //冻结
}

export const request = (params) => {

  let header = {
    ...params.header
  }
  if (wx.getStorageSync("token")) {
    header["token"] = wx.getStorageSync("token");
  }
  // header["token"] = '1111';
  header['Content-Type'] = header['Content-Type'] ? header['Content-Type'] : "application/x-www-form-urlencoded"
  // if(params.isLoading){
  ajaxTimes++;
  // 显示加载中 效果
  // wx.showLoading({
  //   title: "加载中",
  //   mask: true
  // });
  // }

  return new Promise((resolve, reject) => {
    wx.request({
      method: 'post',
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (res) => {
        if (res.data.code == statusCode.noLogin || res.data.code == statusCode.isFreeze) {
          getApp().globalData.dataCodeList.push(res.data.code)
        } else if (res.data.code == statusCode.fail) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          resolve(res.data);
        }
      },
      fail: (res) => {
        showToast(res.data.msg)
        reject(res.data);
      },
      complete: (res) => {
        // if(params.isLoading){ 
        ajaxTimes--;
        getApp().globalData.isHomeUrl = params.isHomeUrl
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          // wx.hideLoading();
          //冻结跳转首页
          if (getApp().globalData.dataCodeList.includes(statusCode.isFreeze) && !getApp().globalData.isHomeUrl) {
            wx.reLaunch({
              url: '/pages/index/index?isFreeze=true'
            })
          }
          //未登录跳转登录页
          if (getApp().globalData.dataCodeList.includes(statusCode.noLogin)) {
            wx.clearStorageSync();
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
          getApp().globalData.dataCodeList = []
        }
        // }
      }
    });
  })
}