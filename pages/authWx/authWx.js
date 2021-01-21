// pages/authWx/authWx.js
import {
  login,
} from '../../utils/wx.js'
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindGetUserInfo(e) {
    const {
      errMsg,
      encryptedData,
      iv
    } = e.detail
    if (errMsg !== 'getUserInfo:ok') {
      return false
    }
    wx.showLoading({
      title: "正在获取",
      mask: true
    });
    request({
      url: api.authorization.login,
      data: {
        code: this.data.wxCode,
        encrypted_data: encryptedData,
        iv
      }
    }).then(result => {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })
    })
  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    login().then(res => {
      this.setData({
        wxCode: res.code
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '"这旅"-高端酒店，低价预定。',
      path: `/pages/index/index`,
    }
  }
})