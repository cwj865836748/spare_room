// pages/roomReservation/roomReservation.js
const App = getApp()
import api from '../../request/api.js'
import {
  request
} from '../../request/index.js'
import {
  formatTime2,
  isNull,
  checkPhone
} from '../../utils/util.js'
import {
  requestPayment,
  showToast
} from '../../utils/wx.js'
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: {}, //路由传参
    defaultDate: [],
    roomBook: {},
    //订房必读
    bookDescriptionShow: false,
    //联系人数量
    personList: [{
      name: ''
    }],
    dateTimePickerShow: false, //时间展示
    //费用明细
    query: {
      store_room_id: '',
      room_number: 1,
      platform_type: '',
      coupon_id: ''
    },
    //下单
    bookQuery: {
      store_room_id: '',
      room_number: 1,
      is_invoice: 0,
      name: '', //入住人员（多个人员用逗号分隔）
      phone: '',
      estimate_time: '12:00',
      equity_id: '', //权益id（多个权益用逗号隔开）
      coupon_id: '',
      remark: '',
      invoice_info: {} //发票信息
    },
    header: {
      starttime: '',
      endtime: ''
    },
    //备注
    remarkCheckboxChoose: ['无要求'],
    remarkCheckboxList: [{
        name: '无要求',
        id: 1
      },
      {
        name: '吸烟房',
        id: 2
      },
      {
        name: '无烟房',
        id: 3
      },
      {
        name: '搞派对',
        id: 4
      },
      {
        name: '旅游',
        id: 5
      },
      {
        name: '商务出差',
        id: 6
      },
      {
        name: '婚房',
        id: 7
      },
      {
        name: '其他',
        id: 8
      }
    ],
    coupleShow: false, //优惠卷展示
    chooseCoupon: true, //切换优惠券
    couponList: [], //优惠券
    coupon_id: '', //选择优惠券
    coupon_name: '',
    couponNoList: [], //可使用or不可使用优惠券
    //费用明细
    feeShow: false,
    feeDetail: {},
    //权益兑换
    equityChoose: [],
    equityList: [],
    equityScore: 0,
    giftContent: '',
    depositShow: false, //押金说明
    depositInfo: null,
    bookStatus: true, //支付切换
    bookStatusShow: false,
    bookStatusShow2: false,
    headColor: 'transparent',
    titleColor: '#fff',
    x: null,
    y: null,
    windowHeight: null,
    equityIsOpen: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      room: options
    })
    this.getInit()
  },
  getInit() {
    const {
      defaultDate,
      windowWidth,
      windowHeight
    } = App.globalData
    let [starttime, endtime] = defaultDate
    starttime = formatTime2(starttime)
    endtime = formatTime2(endtime)
    const header = {
      starttime,
      endtime
    }
    const {
      id: store_room_id
    } = this.data.room
    request({
      url: api.order.reservation,
      data: {
        store_room_id
      },
      header
    }).then(res => {
      //优惠券自动获取
      const coupon_id = res.data.coupon ? res.data.coupon.id : ''
      const coupon_name = res.data.coupon ? res.data.coupon.title : ''
      const giftContent = res.data.gift.length ? res.data.gift.map(item => {
        return item.content
      }) : []
      this.setData({
        defaultDate: App.globalData.defaultDate,
        header,
        bookQuery: {
          ...this.data.bookQuery,
          store_room_id,
          coupon_id
        },
        roomBook: res.data,
        coupon_id,
        coupon_name,
        giftContent: giftContent.join(' '),
        x: windowWidth,
        y: windowHeight - 133,
        windowHeight
      })
      const {
        reservation_description
      } = res.data.info
      reservation_description && WxParse.wxParse('bookDescription', 'html', reservation_description, this, 5)
      this.getFee()
      this.depositRequset()
    })
  },
  //获取费用明细
  getFee() {
    let {
      header,
      bookQuery,
      query
    } = this.data
    let {
      store_room_id,
      room_number,
      coupon_id
    } = bookQuery
    query = {
      ...query,
      store_room_id,
      room_number,
      coupon_id
    }
    request({
      url: api.order.fee,
      data: query,
      header
    }).then(res => {
      this.setData({
        feeDetail: res.data,
      })
      this.getCouple()
    })
  },
  //查看订房必读
  ocBookDescription(e) {
    const {
      show: bookDescriptionShow
    } = e.currentTarget.dataset
    this.setData({
      bookDescriptionShow
    })

  },
  onChange(e) {
    const {
      key
    } = e.currentTarget.dataset
    const {
      bookQuery
    } = this.data
    if ((key == 'coupon_id' && !this.data.chooseCoupon) || (key == 'estimate_time' && e.type == 'cancel')) {
      return
    }
    if (key == 'coupon_id' && this.data.chooseCoupon) {
      this.setData({
        coupon_id: e.detail
      })
      return
    }
    this.setData({
      bookQuery: {
        ...bookQuery,
        [key]: e.detail
      },
    })
    key == 'room_number' && this.getFee()
  },
  overlimit(e){
    e.detail=="plus"&&showToast({
      title:`该价格最多可订${this.data.roomBook.min_room_number}间`
    })
  },
  //入住客人操作
  personOnChange(e) {
    const {
      index
    } = e.currentTarget.dataset
    const personList = this.data.personList
    personList[index].name = e.detail
    this.setData({
      personList
    })
  },
  controllerPerson(e) {
    const {
      index
    } = e.currentTarget.dataset
    const personList = this.data.personList
    !index ? personList.push({
      name: ''
    }) : personList.splice(index, 1)
    this.setData({
      personList
    })
  },
  //选择时间
  dateTimePicker(e) {
    const {
      show: dateTimePickerShow
    } = e.currentTarget.dataset
    this.setData({
      dateTimePickerShow
    })
  },
  //复选框
  checkboxChange(e) {
    const {
      key
    } = e.currentTarget.dataset
    const {
      equity
    } = this.data.roomBook
    let equityScore = 0
    let equityList = []
    if (key == 'equityChoose') {
      e.detail.reduce((pre, next) => {
        let target = pre.find(v => v.id == next)
        if (target) {
          equityScore += parseInt(target.score)
          equityList.push(target)
        }
        return pre
      }, equity)
    }

    this.setData({
      [key]: e.detail,
      equityScore,
      equityList
    })
  },
  //优惠卷接口
  getCouple() {
    const {
      room_rate: money
    } = this.data.feeDetail.detail
    const promise = [api.coupon.index, api.coupon.unuse].map(url => {
      return request({
        url,
        data: {
          money
        }
      })
    })
    Promise.all(promise).then(res => {
      const couponList = this.coupleStatus(res[0].data.list)
      this.setData({
        couponList,
        couponNoList: res[1].data.list
      })
    })
  },
  //优惠卷展示
  toCoupleShow(e) {
    const {
      show: coupleShow,
      ok
    } = e.currentTarget.dataset
    const {
      couponList,
      bookQuery
    } = this.data
    if (!couponList.length) {
      return
    }
    if (ok && !coupleShow) {
      const coupon = couponList.find(item => item.id == this.data.coupon_id)
      const coupon_id = coupon ? coupon.id : ''
      this.setData({
        'query.coupon_id': coupon_id,
        'bookQuery.coupon_id': coupon_id,
        coupleShow,
        coupon_name: coupon ? coupon.title : ''
      })
      this.getFee()
    } else {
      this.setData({
        coupleShow,
        coupon_id: bookQuery.coupon_id
      })
    }
  },

  //切换优惠卷状态
  tabCouple(e) {
    const {
      show: chooseCoupon
    } = e.currentTarget.dataset
    this.setData({
      chooseCoupon
    })
  },
  coupleStatus(list) {
    return list.map(item => {
      item.instructionsShow = false
      return item
    })
  },
  //查看说明
  toShowInstructions(e) {
    const {
      chooseCoupon,
      couponList
    } = this.data
    if (!chooseCoupon) return
    const {
      index
    } = e.currentTarget.dataset
    couponList[index].instructionsShow = !couponList[index].instructionsShow
    this.setData({
      couponList
    })
  },
  //跳转发票
  goInvoice() {
    //is_invoice为平台还是商家开票
    //is_invoice2是否开票
    let {
      address,
      info
    } = this.data.roomBook
    let {
      is_invoice,
      invoice_info
    } = this.data.bookQuery
    address = address ? JSON.stringify(address) : ''
    invoice_info = JSON.stringify(invoice_info)
    wx.navigateTo({
      url: `/pages/invoiceMessage/invoiceMessage?address=${address}&is_invoice=${info.is_invoice}&is_invoice2=${is_invoice}&invoice_info=${invoice_info}`,
    })
  },
  //开启关闭明细
  feeShowOpenClose(e) {
    this.setData({
      feeShow: !this.data.feeShow
    })
  },
  //押金说明
  toDepositShow(e) {
    const {
      show: depositShow
    } = e.currentTarget.dataset
    WxParse.wxParse('deposit', 'html', this.data.depositInfo, this, 5)
    this.setData({
      depositShow
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
  //预订酒店
  isBookHotel(e) {
    const {
      show: bookStatusShow
    } = e.currentTarget.dataset
    const {
      personList,
      bookQuery
    } = this.data
    const name = personList.map(item => {
      return item.name
    })
    if (name.includes('')) {
      return showToast({
        title: '请输入入住客人'
      })
    }

    isNull({
        content: name.join(','),
        title: '入住客人'
      }) &&
      isNull({
        content: bookQuery.phone,
        title: '手机号码'
      }) &&
      isNull({
        content: !checkPhone(bookQuery.phone),
        title: '手机号码',
        topic: '有误'
      }) &&
      this.setData({
        bookStatusShow
      })
  },
  bookCancel(e) {
    const {
      pay
    } = e.currentTarget.dataset
    this.setData({
      bookStatusShow: false,
      bookStatusShow2: pay
    })
  },
  bookConfirm(e) {
    const {
      pay
    } = e.currentTarget.dataset

    if (pay) {
      const {
        personList,
        bookQuery,
        equityChoose,
        remarkCheckboxChoose
      } = this.data
      const name = personList.map(item => {
        return item.name
      }).join(',')
      const equity_id = equityChoose.join(',')
      const remark = remarkCheckboxChoose.join(',') + bookQuery.remark
      this.setData({
        bookQuery: {
          ...bookQuery,
          name,
          equity_id,
          remark
        }
      })
      this.order()
    } else {
      this.setData({
        bookStatusShow: true,
        bookStatusShow2: false
      })
    }
  },
  order() {
    const {
      bookQuery,
      header
    } = this.data
    const {
      invoice_info
    } = bookQuery
    request({
      url: api.order.orderAdd,
      data: {
        ...bookQuery,
        invoice_info: JSON.stringify(invoice_info)
      },
      header
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
            e.errMsg == "requestPayment:ok" &&
              setTimeout(() => {
                showToast({
                  title: '付款成功'
                })
              }, 500)
            // showModal({
            //   title: "提示",
            //   content: "订单支付失败",
            //   showCancel: false,
            //   confirmText: "确认",
            // })
            wx.redirectTo({
              url: `/pages/orderDetail/orderDetail?id=${res.data.order_id}`,
            })
          }
        }
        requestPayment(temp)
      } else {
        showToast({
          title: res.msg
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  preventTouchMove() {
    return
  },
  onPageScroll: function (e) {
    const {
      scrollTop
    } = e
    if (scrollTop > 50 && this.data.headColor != '#fff') {
      this.setData({
        headColor: '#fff',
        titleColor: '#333333'
      })
    } else if (scrollTop < 50 && this.data.headColor != 'transparent')
      this.setData({
        headColor: 'transparent',
        titleColor: '#fff'
      })
  },
  //权益收起展开按钮
  toEquityDo() {
    this.setData({
      equityIsOpen: !equityIsOpen
    })
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