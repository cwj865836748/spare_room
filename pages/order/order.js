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
    depositMoney:0,
    triggered: false,
    userInfo:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit()
  },
  getInit(){
    const {query:data,orderList} = this.data
    request({url:api.orderDetail.orderLists,data}).then(res=>{
      this.setData({
        orderList:[...orderList,...res.data.rows],
        total:res.data.total,
        userInfo:wx.getStorageSync('user')
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
    //cancel代表取消规则 1 为不可取消
    const {id:orderId,status:orderStatus,cancel} = e.currentTarget.dataset
    if(cancel==1&&orderStatus==2){
      return wx.showToast({
        title: '该订单不可取消',
        icon: 'none',
      })
    }
    type=="confirm"&&this.data.orderStatus&&wx.navigateTo({
      url: `/pages/cancleOrder/cancleOrder?id=${this.data.orderId}&orderStatus=${this.data.orderStatus}`,
    })
    type=="confirm"&&!this.data.orderStatus&&request({url:api.orderDetail.cancel,data:{
      order_id:this.data.orderId,
      cancel_reason:'',
      cancel_remark:'',
    }}).then(res=>{
      if(res.code==200){
        this.setData({
          query:{...this.data.query,page:1},
          orderList:[]
        })
        this.getInit()
      }
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
    const index = this.data.orderList.findIndex(item=>item.id==this.data.orderId)
    type=="confirm"&&request({url:api.orderDetail.userDelete,data:{id:this.data.orderId}}).then(res=>{
      if(res.code==200){
        this.data.orderList.splice(index,1)
        this.setData({
          orderList:[...this.data.orderList]
        })
        wx.showToast({
          title: '删除成功！',
          icon:'none'
        })
      }
    })
    this.setData({
      isdeleteOrderShow:type=="tap"?true:false,
      orderId:type=="tap"&&orderId
    })
  },
  appealResult(e){
    const {status,id:orderId,depositMoney,index} = e.currentTarget.dataset
    this.setData({
      orderId,depositMoney,
      [`orderList[${index}].is_read`]:0
    })
    this.selectComponent('#appeal').getAppealDetail(status)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._freshing = false
  },

  onPulling(e) {
    setTimeout(()=>{
      this.setData({
        triggered: true,
      })
    },3000)
 
  },
  onRefresh(e) {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
        query:{...this.data.query,page:1},
        orderList:[]
      })
      this.getInit()
      this._freshing = false
    }, 3000)
  },
  toReminders(e){
    const {id:order_id,index} = e.currentTarget.dataset
   request({url:api.order.urged,data:{order_id}}).then(res=>{
      if(res.code==200){
        this.setData({
          [`orderList[${index}].is_urged`]:1
        })
        wx.showToast({
          title: '您已催单成功，请耐心等待。',
          icon: 'none',
        })
      }
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
    return {
      title: '这旅满天下，伴君走天涯',
      path: `/pages/index/index`,
    }
  }
})