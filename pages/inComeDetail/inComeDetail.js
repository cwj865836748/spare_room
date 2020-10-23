// pages/inComeDetail/inComeDetail.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inComeTabIndex:0,
    recommendRecordList:[],
    moneyInfo:{},
    page:1,
    is_next:false,
    noData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },
  tabInCome(e){
    const {index:inComeTabIndex} = e.currentTarget.dataset
    this.setData({
      inComeTabIndex,
      page:1,
      recommendRecordList:[],
      noData:false
    })
    this.getMoneyLogLists()

  },
  //收益明细四个值
  getCommission(){
    request({url:api.moneyLog.commission}).then(res=>{
      this.setData({
        moneyInfo:res.data.info
      })
    })
  },
  //收益、提现列表
  getMoneyLogLists(){
    const {inComeTabIndex,page} =this.data
    const url = inComeTabIndex==0?api.moneyLog.moneyLogLists:(inComeTabIndex==1?api.moneyLog.withdraw:api.moneyLog.withdrawed)
    request({url,data:{page}}).then(res=>{
      this.setData({
        recommendRecordList:[...res.data.list,...this.data.recommendRecordList],
        is_next:res.data.is_next
      },()=>{
        this.isNoData()
      })
    })
  },
  isNoData(){
    !this.data.recommendRecordList.length&&this.setData({
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
    this.getCommission()
    this.getMoneyLogLists()
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
      this.getMoneyLogLists()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})