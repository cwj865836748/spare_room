// pages/hotelIntroduction/hotelIntroduction.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
import {turnImg} from '../../utils/util.js'
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelDetail:{},
    hotelFacilitiesList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit(options)
  },
  getInit(hotel){
    const {id:hotel_id,longitude,latitude} = hotel
    //酒店详情
    const hotelDl = request({url:api.hotel.index,data:{hotel_id,longitude,latitude}})
     //酒店设施 酒店轮播图
    const promise = [api.hotel.hotelFacilities].map(url=>{
      return request({url,data:{hotel_id}})
    })
    Promise.all([hotelDl,...promise]).then(res=>{
      let {policy,content} = res[0].data.info
      policy=turnImg(policy)
      content=turnImg(content)
      const hotelDetail ={...res[0].data.info,policy,content}
      const {reservation_description} = res[0].data.info
      reservation_description&&WxParse.wxParse('bookDescription','html',reservation_description,this,5)
        this.setData({
          hotelDetail,
          hotelFacilitiesList:res[1].data.list
        })
    })
  },
  toPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.hotelDetail.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
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