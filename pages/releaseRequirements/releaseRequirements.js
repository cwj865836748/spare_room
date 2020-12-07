// pages/releaseRequirements/releaseRequirements.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requireList:[],
    page:1,
    is_next:false,
    noData:false,
    delDemandOne:{},
    delShow:false,
    demandOneDetailShow:false,
    demandOneDetail:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemandList()
  },
  //获取需求列表
  getDemandList(){
    request({url:api.demand.demandLists,data:{page:this.data.page}}).then(res=>{
      this.setData({
        requireList:[...res.data.list,...this.data.requireList],
        is_next:res.data.is_next
      },()=>{
        this.isNoData()
      })
    })
  },
  delDemandOne(e){
    this.setData({
      delDemandOne:e.currentTarget.dataset,
      delShow:true
    })
  },
  delDemandClose(){
    this.setData({
      delShow:false
    })
  },
  delConfirm(){
    const {id:demand_id,index}=this.data.delDemandOne
    request({url:api.demand.demandDel,data:{demand_id}}).then(res=>{
      if(res.code==200){
        this.data.requireList.splice(index,1)
        this.setData({
          requireList:this.data.requireList
        },()=>{
          this.isNoData()
        })
        
      }
    })
  },
  openDemandOneDetail(e){
    const {id:demand_id}=e.currentTarget.dataset
    request({url:api.demand.demandDetail,data:{demand_id}}).then(res=>{
       this.setData({
        demandOneDetail:res.data.info,
        demandOneDetailShow:true
       })
    })
  },
  closeDemandOneDetail(){
    this.setData({
      demandOneDetailShow:false
     })
  },
  isNoData(){
      !this.data.requireList.length&&this.setData({
        noData:true
      })
  },
  goHotelDetail(e){
    const {item} = e.currentTarget.dataset
    const today = new Date(new Date().toLocaleDateString()).getTime() 
    const start_time=item.start_time*1000>=today?item.start_time*1000:today
    const end_time=item.start_time*1000>=today?item.end_time*1000:today+86400000
    App.globalData.defaultDate=[start_time,end_time]
    wx.navigateTo({
      url: `/pages/hotelDetail/hotelDetail?id=${item.hotel_id}&isInvite=true`,
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
      this.getDemandList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})