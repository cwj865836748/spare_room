// pages/memberIntroduction/memberIntroduction.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
let WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit()
  },
  getInit(){
     request({url:api.config.vipRule}).then(res=>{
       const info = res.data.info.replace(/&amp;nbsp;/g, ' ')
      WxParse.wxParse('rules','html',info,this,5)
     })
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