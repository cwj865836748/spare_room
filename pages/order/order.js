// pages/order/order.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',//跳转时存的id
    orderStatus:'',//跳转支付状态
    orderStatusList:[{name:'全部',id:0},{name:'待支付',id:1},{name:'待确认',id:2},{name:'已确认',id:3},{name:'已完成',id:4},{name:'已取消',id:5}],
    orderList:[],
    query:{
      page:1,
      limit:10,
      type:0
    },
    noData:false,
    total:0,
    isCancleOrderShow:false,
    isdeleteOrderShow:false,
    depositMoney:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getInit(){
    const {query:data,orderList} = this.data
    request({url:api.orderDetail.orderLists,data}).then(res=>{
      this.setData({
        orderList:[...orderList,...res.data.rows],
        total:res.data.total
      })
      this.isNoData()
    })
  },
  isNoData(){
    !this.data.orderList.length&&this.setData({
      noData:true
    })
  },
  tabHead(e){
    const {id:type} = e.currentTarget.dataset
    if(type==this.data.query.type){
      return
    }
    this.setData({
      query:{...this.data.query,type,page:1},
      orderList:[],
      noData:false
    })
    this.getInit()
  },
  cancleOrder(e){
    const {type} = e
    const {id:orderId,status:orderStatus,cancel} = e.currentTarget.dataset
    if(cancel==1&&orderStatus==1){
      return wx.showToast({
        title: '该订单不可取消',
        icon: 'none',
      })
    }
    type=="confirm"&&wx.navigateTo({
      url: '/pages/cancleOrder/cancleOrder?id='+this.data.orderId+'&jumpStatus='+this.data.orderStatus,
    })
    this.setData({
      isCancleOrderShow:type=="tap"?true:false,
      orderId:type=="tap"&&orderId,
      orderStatus:type=="tap"&&orderStatus
    })
  },
  deleteOrder(e){
    const {type} = e
    const {id:orderId} = e.currentTarget.dataset
    type=="confirm"&&request({url:api.orderDetail.userDelete,data:{id:this.data.orderId}}).then(res=>{
      if(res.code==200){
        this.setData({
          query:{...this.data.query,page:1},
          orderList:[],
          noData:false
        })
        this.getInit()
      }
    })
    this.setData({
      isdeleteOrderShow:type=="tap"?true:false,
      orderId:type=="tap"&&orderId
    })
  },
  toSeebackMoney(e){
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`,
    })
  },
  appealResult(e){
    const {status,id:orderId,depositMoney} = e.currentTarget.dataset
    this.setData({
      orderId,depositMoney
    })
    this.selectComponent('#appeal').getAppealDetail(status)
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
    this.setData({
      query:{...this.data.query,page:1},
      orderList:[]
    })
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
    const { total,orderList} =this.data
    if(total>orderList.length){
      this.data.query.page++
      this.getInit()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})