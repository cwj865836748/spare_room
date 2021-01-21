// pages/myScore/myScore.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreList:50,
    myScore:0,
    page:1,
    is_next:false,
    noData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      myScore:options.score
    })
    this.getScoreLists()
  },

  //积分记录
  getScoreLists(){
    request({url:api.mine.scoreLists,data:{page:this.data.page}}).then(res=>{
       this.setData({
        scoreList:[...res.data.list,...this.data.scoreList],
        is_next:res.data.is_next
       },()=>{
        !this.data.scoreList.length&& this.setData({
          noData:true
          })
       })
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
    if(this.data.is_next){
      this.data.page++
      this.getScoreLists()
    }
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