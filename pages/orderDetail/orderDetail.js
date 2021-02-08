// pages/order/order.js
import api from '../../request/api.js'
import {
  request
} from '../../request/index.js'
import {
  openLocation
} from '../../utils/wx.js'
import {
  requestPayment,
  showModal,
  showToast
} from '../../utils/wx.js'
let WxParse = require('../../wxParse/wxParse.js');
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '', //跳转时存的id
    orderDetailInfo: {},
    isCancleOrderShow: false,
    isdeleteOrderShow: false,
    timeOut: 0,
    progressList: [],
    progressShow: false,
    depositShow: false,
    depositInfo: null,
    roomDetailShow: false,
    roomDetail: {},
    defaultCity: null,
    isAppealShow: false,
    giftContent: '',
    userInfo:null,
    needKnow:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id,
      defaultCity: App.globalData.defaultCity,
      userInfo:wx.getStorageSync('user')
    })
    this.depositRequset()
  },
  getInit() {
    request({
      url: api.orderDetail.orderDetail,
      data: {
        id: this.data.orderId
      }
    }).then(res => {
      const giftContent = res.data.gift.length ? res.data.gift.map(item => item.gift_content).join('、') : ''
      this.setData({
        orderDetailInfo: res.data,
        giftContent
      })
      const {
        expire_time,
        confirm_time,
        order_status
      } = this.data.orderDetailInfo
      order_status == 0 && this.getSetInterval(expire_time)
      order_status == 1 && this.getSetInterval(confirm_time)
    })
  },
  getSetInterval(time) {
    const newTime = new Date().getTime()
    let timeOut = (time * 1000 - newTime) + 2000
    this.setData({
      timeOut
    })
  },
  cancleOrder(e) {
    const {
      type
    } = e
    const {
      cancel
    } = e.currentTarget.dataset
    //cancel代表取消规则 1 为不可取消
    if (cancel == 1 && this.data.orderDetailInfo.order_status == 2) {
      return wx.showToast({
        title: '该订单不可取消',
        icon: 'none',
      })
    }
    type == "confirm"&&this.data.orderDetailInfo.order_status && wx.navigateTo({
      url: `/pages/cancleOrder/cancleOrder?id=${this.data.orderId}&orderStatus=${this.data.orderDetailInfo.order_status}`
    })
    type=="confirm"&&!this.data.orderDetailInfo.order_status&&request({url:api.orderDetail.cancel,data:{
      order_id:this.data.orderId,
      cancel_reason:'',
      cancel_remark:'',
    }}).then(res=>{
      if(res.code==200){
    
        this.getInit()
      }
    })
    this.setData({
      isCancleOrderShow: type == "tap" ? true : false
    })
  },
  //开启地图
  openMap() {
    let {
      latitude,
      longitude,
      hotel_address: address,
      hotel_name: name
    } = this.data.orderDetailInfo
    latitude = parseFloat(latitude)
    longitude = parseFloat(longitude)
    const mapDetail = {
      latitude,
      longitude,
      address,
      name
    }
    openLocation(mapDetail)
  },
  appealResult(e) {
    const {
      status
    } = e.currentTarget.dataset
    this.selectComponent('#appeal').getAppealDetail(status)
    this.setData({
      'orderDetailInfo.is_read': 0
    })
  },
  deleteOrder(e) {
    const {
      type
    } = e
    type == "confirm" && request({
      url: api.orderDetail.userDelete,
      data: {
        id: this.data.orderId
      }
    }).then(res => {
      if (res.code == 200) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
    this.setData({
      isdeleteOrderShow: type == "tap" ? true : false
    })
  },
  //详情进度
  toProgress() {
    const {
      progressShow,
      orderId: order_id
    } = this.data
    this.setData({
      progressShow: !progressShow
    }) 
    !progressShow && request({
      url: api.orderDetail.progress,
      data: {
        order_id
      }
    }).then(res => {
      this.setData({
        progressList: res.data.list,
      })
    })
  },
  toDepositShow(e) {
    const {
      show: depositShow
    } = e.currentTarget.dataset
    WxParse.wxParse('deposit', 'html', this.data.depositInfo, this, 5)
    this.setData({
      depositShow
    })
  },
  toNeedKnow(e){
    const {
      show: needKnow
    } = e.currentTarget.dataset
    console.log(this.data.orderDetailInfo.customer_should_know)
    WxParse.wxParse('customerShouldKnow', 'html', this.data.orderDetailInfo.customer_should_know, this, 5)
    this.setData({
      needKnow
    })
  },
  depositRequset() {
    request({
      url: api.config.depositRule
    }).then(res => {
      const depositInfo = res.data.info.replace(/&amp;nbsp;/g, ' ')
      this.setData({
        depositInfo
      })
    })
  },
  preventTouchMove() {
    return
  },
  //跳转发票
  goInvoice() {
    let {
      invoice
    } = this.data.orderDetailInfo
    console.log(invoice)
    if (!invoice) {
      return
    }
    const {
      platform_type
    } = invoice
    invoice = JSON.stringify(invoice)
    //is_invoice为平台还是商家开票
    //is_invoice2是否开票
    wx.navigateTo({
      url: `/pages/invoiceMessage/invoiceMessage?is_invoice=${platform_type}&is_invoice2=1&invoice_info=${invoice}&isDisable=1`,
    })
  },
  openHotelDetailShow() {
    request({
      url: api.hotel.roomFacilities,
      data: {
        room_id: this.data.orderDetailInfo.room_id
      }
    }).then(res => {
      const list = res.data.list.map(item => {
        item.second = item.second.length && item.second.join(',')
        return item
      })
      const hotel_img = this.data.orderDetailInfo.room_info.hotel_img.split(',')
      this.setData({
        roomDetail: {
          ...this.data.orderDetailInfo.room_info,
          hotel_img,
          list
        },
        roomDetailShow: true
      })
    })
  },
  closeHotelDetailShow() {
    this.setData({
      roomDetailShow: false
    })
  },
  //下单
  payOrder() {
    request({
      url: api.orderDetail.payOrder,
      data: {
        id: this.data.orderId
      }
    }).then(res => {
      if (res.code == 200) {
        let info = res.data && JSON.parse(res.data.pay.info)
        const temp = {
          timeStamp: String(info.timeStamp),
          nonceStr: info.nonceStr,
          package: info.package,
          signType: info.signType,
          paySign: info.paySign,
          complete: function (e) {
            //支付成功/失败
            e.errMsg == "requestPayment:ok" ?
              setTimeout(() => {
                showToast({
                  title: '付款成功'
                })
              }, 500) :
              showModal({
                title: "提示",
                content: "订单支付失败",
                showCancel: false,
                confirmText: "确认",
              })
          }
        }
        requestPayment(temp).then(res => {
          this.getInit()
        })
      }
    })
  },
  toReminders(e) {
    const {
      id: order_id
    } = this.data.orderDetailInfo
    request({
      url: api.order.urged,
      data: {
        order_id
      }
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          'orderDetailInfo.is_urged':1
        })
        showToast({
          title: '您已催单成功，请耐心等待。'
        })
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
    this.getInit()
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
      title: '这旅满天下，伴君走天涯',
      path: `/pages/index.index`,
    }
  }
})