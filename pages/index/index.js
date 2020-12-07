const App=getApp()
var utils = require('../../utils/util.js')
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],//轮播图
    notice:'',//走马灯宣传
    calendarShow:false,
    defaultCity:{},
    defaultDate:[],
    defaultKeyWords:'',
    iconList:[
      {icon:'../../images/home_low_price@2x.png',name:'全网低价'},
      {icon:'../../images/home_star_treatment@2x.png',name:'五星待遇'},
      {icon:'../../images/home_housing@2x.png',name:'房源保障'},
      {icon:'../../images/home_professional_services@2x.png',name:'专业服务'}
    ]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {parentId,scene} = options
    const parent_id = parentId||scene
    parent_id&&this.getBindParent(parent_id)
     this.getLocation()
  },
  //加载轮播图和公告
  getInit(){
     const getPromise=[api.index.advert,api.index.notice].map(item=>{
       return request({url:item})
     })
     Promise.all(getPromise).then(res=>{
       const notice=res[1].data.list.map(item=>{
         return item.content
       })
       this.setData({
        swiperList:res[0].data.list,
        notice:notice.join(',').replace(/,/g, " ")  
       })
     })
  },

  //开启日历
  openCalendar(){
    this.setData({
      calendarShow:true
    })
  },
  //关闭日历
  closeCalendar(){
    this.setData({
      calendarShow:false
    })
    this.getStatus()
  },
  //获取当前位置
  getLocation(){
    const {defaultCity} = App.globalData
    utils.getAuth().then(res=>{
      const {address_component,location} = res.result
      //避免相同位置多次点击触发
      if(location.lat==defaultCity.lat&&location.lng==defaultCity.lng){
        return
      }
      request({url:api.config.cityConversion,data:{city_name:address_component.city}}).then(city=>{
        const defaultCity={
          name:address_component.city,
          ...location,
          ...city.data
        }
        App.globalData.defaultCity=defaultCity
        App.getAreaAndRoom()
        this.getStatus()
       })
      }) 
  },

  //更新状态
  getStatus(){
    const {defaultDate,defaultCity,defaultKeyWords} = App.globalData
    this.setData({
      defaultDate,defaultCity,defaultKeyWords
    })
  },
  cleanSearch(){
    App.globalData.defaultKeyWords=''
    this.setData({
      defaultKeyWords:''
    })
  },
  jumpTab(e){
    const {url} = e.currentTarget.dataset
     wx.navigateTo({
       url:`${url}&isInvite=true`
     })
  },
  getBindParent(parent_id){
    App.globalData.parent_id=parent_id
    if(!wx.getStorageSync("token")){
      return
    }
    request({url:api.authorization.userBind,data:{parent_id}}).then(res=>{
      res.data&&wx.showModal({
        title: '尊敬的客户您好',
        content: '恭喜您获得好友赠送的黄金会员！',
        showCancel: false,//是否显示取消按钮
        confirmText:"好的",//默认是“确定”
     })
    })
 },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getStatus()
    this.getInit()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})