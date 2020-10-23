// pages/hotelPicture/hotelPicture.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
import {previewImage} from '../../utils/wx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headTitleList:[{type:0,name:"全部"},{type:1,name:"外观"},{type:2,name:"房间"},{type:3,name:"餐饮"},{type:4,name:"休闲"},{type:5,name:"商务"},{type:6,name:"公告区域"},{type:7,name:"周边"},{type:8,name:"其他"}],
    titleIndex:0,
    picList:[],
    initList:[],
    noData:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit(options.id)
  },
  getInit(hotel_id){
    request({url:api.hotel.picture,data:{hotel_id}}).then(res=>{
         this.setData({
          initList:res.data.list,
          noData:!res.data.list.length?true:false
         })
        
     })
  },
  chooseTitle(e){
    const {type} = e.currentTarget.dataset
    const picList =this.data.initList.find(item=>item.type==type)
     this.setData({
      titleIndex:type,
      picList:picList?picList.img_url:[],
      noData:false
     })
     !this.data.picList.length&&type&&this.setData({
      noData:true
    })
  },
  
  previewImage(e){
    const {img} =e.currentTarget.dataset
    const {picList,titleIndex} =this.data
    previewImage({
      　　　　current: titleIndex?img:img[0],
      　　　　urls: titleIndex?picList:img
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

  }
})