// pages/goodFriends/goodFriends.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    is_next:false,
    noData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFriendList()
  },
  getFriendList(){
    request({url:api.moneyLog.friendList,data:{page:this.data.page}}).then(res=>{
      this.setData({
        list:[...res.data.list,...this.data.list],
        is_next:res.data.is_next
      },()=>{
        this.isNoData()
      })
    })
  },
  isNoData(){
    !this.data.list.length&&this.setData({
      noData:true
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
      this.getFriendList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})