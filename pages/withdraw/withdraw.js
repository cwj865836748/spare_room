// pages/withdraw/withdraw.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
import {isNull} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMoney:0,
    withdrawMoney:'',
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allMoney:Number(options.money)
    })
  },
  onChange(e){
    if(!this.data.allMoney){
      this.setData({
        withdrawMoney:''
      })
      return
    }
    if(!Number(e.detail.charAt(0))){
      this.setData({
        withdrawMoney:''
      })
      return
    }
    e.detail>this.data.allMoney&&wx.showToast({
          title: `最高可提现${this.data.allMoney}元！`,
          icon:'none'
        })
  
    this.setData({
      withdrawMoney:e.detail>this.data.allMoney?this.data.allMoney:e.detail
    })
  },
  withdrawAll(){
     this.setData({
      withdrawMoney:this.data.allMoney
     })
  },
  goWithdraw(e){

    isNull({content:this.data.withdrawMoney,title:'提现金额'})&&
    request({url:api.moneyLog.withdrawAdd,data:{money:this.data.withdrawMoney}}).then(res=>{
      if(res.code==200){
        this.setData({
          show:true
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },2000)
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