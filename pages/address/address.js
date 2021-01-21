// pages/address/address.js
var utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
   address:{
    consignee:'',//收件人,
    phone:'',//手机号,
    province:'',//省份,
    city:'',//城市
    county:'',//地区
    detail:'',//详细地址,
   },
   addressChooseShow:false,
   isDisable:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    let prevpage = pages[pages.length - 2]
    let data = prevpage.data
    const {consignee,phone,province,city,county,detail} =data.invoice_info
    const { isDisable } = prevpage.data
    this.setData({
      address:{consignee,phone,province,city,county,detail},
      isDisable
    })
  },
  onChange(e) {
    const {key} = e.currentTarget.dataset
    let detail = e.detail
    this.setData({ 
      address:{...this.data.address,[key]:detail} 
    });
  },
  addressChoose(){
    if(this.data.isDisable){
      return
    }
    this.setData({
      addressChooseShow:true
    })
  },
  saveAddress(){
    let {isNull} = utils
   const {
      consignee,
      phone,
      province,
      city,
      county,
      detail
     } =this.data.address
    let pages = getCurrentPages()
    let prevpage = pages[pages.length - 2]
    if(
    !isNull({content:consignee,title:'收件人'})||
    !isNull({content:phone,title:'手机号码'})||
    !isNull({content:province,title:'省份'})||
    !isNull({content:city,title:'城市'})||
    !isNull({content:county,title:'区域'})||
    !isNull({content:detail,title:'详细地址'})){return}
    prevpage.setData({
      invoice_info:{...prevpage.data.invoice_info,...this.data.address}
    })
    wx.navigateBack({
      delta:1
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