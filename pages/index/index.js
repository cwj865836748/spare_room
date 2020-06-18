
const App=getApp()
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarShow:false,
    low: 0,
    heigh: 100,
  },

  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     utils.getAuth().then(re=>{
       console.log(re)
     })
   
  },
  openCalendar(){
    this.setData({
      calendarShow:true
    })
  },
  closeCalendar(){
    this.setData({
      calendarShow:false
    })
  },
  
  lowValueChangeAction: function (e) {
    this.setData({
      low: e.detail.lowValue
    })
  },

  heighValueChangeAction: function (e) {
    this.setData({
      heigh: e.detail.heighValue
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})