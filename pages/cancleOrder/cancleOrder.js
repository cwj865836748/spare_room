// pages/cancleOrder/cancleOrder.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
import {isNull} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{
      order_id:'',
      cancel_reason:'',
      cancel_remark:'',
    },
    reasonShow: false,
    cancelShow:false,
    actions: [
      {
        name: '不要想要了',
      },
      {
        name: '商家长时间未接单',
      },
      {
        name: '房间选错/数量不足',
      },
    ],
    jumpStatus:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
      query:{...this.data.query,order_id:options.id},
      jumpStatus:options.jumpStatus
     })
  },
  onSelect(e){
    this.setData({
      query:{...this.data.query,cancel_reason:e.detail.name},
      reasonShow:false
    })
  },
  onChange(e){
    this.setData({
      query:{...this.data.query,cancel_remark:e.detail}
    })
  },
  cancelReason(e){
    const {show:reasonShow} = e.currentTarget.dataset
    this.setData({
      reasonShow
    })
  },
  closeOrder(){
    const{cancel_reason} = this.data.query
    const url = Number(this.data.jumpStatus)?api.orderDetail.userCancel:api.orderDetail.cancel
    isNull({content:cancel_reason,title:'取消原因'})&&
    request({url,data:this.data.query}).then(res=>{
      if(res.code==200){
        this.setData({
          cancelShow:true
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1500)
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

  }
})