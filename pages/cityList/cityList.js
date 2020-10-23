// pages/cityList/cityList.js
const App =getApp()
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: [],
    hotCityList:[],
    offsetTop:null,
    indexList: [],
    defaultCity:null
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {navBar,cityData,defaultCity} = App.globalData
    this.setData({
      offsetTop:navBar.navHeight,
      cityList:cityData.cityList,
      indexList:cityData.indexList,
      defaultCity
    })
    this.getHotCity()
  },
  getHotCity(){
    request({url:api.config.hotcity}).then(res=>{
      this.setData({
        hotCityList:res.data.list
      })
    })
  },


 /**选择城市 */
 chooseCity(e) {
  const {city} = e.currentTarget.dataset
  App.globalData.defaultCity=city
  App.getAreaAndRoom().then(res=>{
  //获取上一页信息
   let p=getCurrentPages();
   let pages = p[p.length-2]
   pages.route=='pages/hotelList/hotelList'&& pages.clearAll()
   wx.navigateBack({
     delta:1
   })
  })
 
},
/**选择字母 */
letterSelect(e){
 
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