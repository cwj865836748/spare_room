// pages/myScore/myScore.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreThing:[],
    myScore:0,
    isShow:false,
    ruleInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      myScore:options.score
    })
    this.getEquityLists()
    this.scoreRule()
  },
  preventTouchMove(){
    return
  },
  //这旅说明
  scoreRule(){
    request({url:api.config.scoreRule}).then(res=>{
      const ruleInfo = res.data.info.replace(/&amp;nbsp;/g, ' ')
      this.setData({
        ruleInfo
      })
    })
  },
  //权益列表
  getEquityLists(){
    request({url:api.mine.equityLists}).then(res=>{
       this.setData({
        scoreThing:res.data
       })
    })
  },
  openOrCloseShow(e){
    const {show:isShow}=e.currentTarget.dataset
    WxParse.wxParse('rules','html',this.data.ruleInfo,this,5)
    this.setData({
      isShow
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