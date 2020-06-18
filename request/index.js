import {showToast} from '../utils/wx'
// 后台url
 const baseUrl = "https://api.zbztb.cn/api/public/v1";
 
// 同时发送异步代码的次数
let ajaxTimes = 0;

const request = (params) => {

  let header = { ...params.header };
  if(wx.getStorageSync("token")){
    header["token"] = wx.getStorageSync("token");
  }
  header['Content-Type']="application/x-www-form-urlencoded"
  
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (res) => {
        if (res.data.code == 201 ) {
          wx.clearStorageSync();
          showToast(res.data.msg)
          wx.reLaunch({ url: '/pages/authorization/authorization',}) 
              }
        else{
                resolve(result.data);
              }
      },
      fail: (res) => {
        showToast(res.errMsg)
        reject(res);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  })
}