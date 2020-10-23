// pages/hotelSearch/hotelSearch.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historySearchList:[],
    hotKeyWordList:[],
    hotKeyWordListIsLong:false,
    isHotKeyWordListIsLong:false,
    policyList:[],
    policyListIsLong:false,
    isPolicyListIsLong:false,
    groupList:[],
    groupListIsLong:false,
    isGroupListIsLong:false,
    defaultKeyWords:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit()
    //获取历史记录
    const {historySearchList,areaList:policyList} =App.globalData
    this.setData({
      historySearchList,policyList
    })
    
  },
  getInit(){
    const promiseAll=[api.index.hotKeyword,api.index.company].map(url=>{
      return request({url})
    })
    Promise.all(promiseAll).then(res=>{
      this.setData({
        hotKeyWordList:res[0].data.list,
        groupList:res[1].data.list
      },()=>{
        Promise.all([this.getDomHeight('#hot'),this.getDomHeight('#policy'),this.getDomHeight('#group')]).then(response=>{
            const [hot,policy,group] = response
            this.setData({
              isHotKeyWordListIsLong:hot[0].height>107,
              isPolicyListIsLong:policy[0].height>107,
              isGroupListIsLong:group[0].height>107
           
            })
        })
      })
     
    })
  },
  //获取元素高度
  getDomHeight(dom){
    return new Promise((resolve,reject)=>{
      let query = wx.createSelectorQuery()
      query.select(dom).boundingClientRect()
      query.exec((res)=>{
        resolve(res)
      })
    })
  },
  //选择城市
  chooseCity(e){
    const {name} = e.currentTarget.dataset
    App.globalData.defaultKeyWords=name
    this.pushHistory(name)
  //获取上一页信息
   let p=getCurrentPages();
   let pages = p[p.length-2]
   pages.route=='pages/hotelList/hotelList'&& pages.keyWordSeach()
    wx.navigateBack({
      delta:1
    })
  },
  pushHistory(name){
    let {historySearchList:list} =App.globalData
    list.unshift(name)
    let historySearchList =[...new Set(list)]
    historySearchList.length>8&&historySearchList.splice(historySearchList.length-1,1)
    App.globalData.historySearchList=historySearchList
  },
  //清空
  clearHistory(){
    this.setData({
      historySearchList:[]
    })
    App.globalData.historySearchList=[]
  },
  //展开
  openAll(e){
    const {key} = e.currentTarget.dataset
    this.setData({
      [key]:!this.data[key]
    })
  },
  onChange(e){
    this.setData({
      defaultKeyWords:e.detail
    })
  },
  confirm(e){
    if(!e.detail){
      return
    }
    App.globalData.defaultKeyWords=e.detail
    this.pushHistory(e.detail)
    wx.navigateTo({
      url: '/pages/hotelList/hotelList',
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
    const {historySearchList} =App.globalData
    this.setData({
      historySearchList
    })
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