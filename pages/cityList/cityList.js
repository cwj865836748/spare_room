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
    this.getCity()
  },
  getCity(){
    const {navBar,cityData,defaultCity} = App.globalData
    request({url:api.config.hotcity}).then(res=>{
      this.setData({
        offsetTop:navBar.navHeight,
        cityList:cityData.cityList,
        indexList:cityData.indexList,
        hotCityList:res.data.list,
        defaultCity
      })
    })
  },


 /**选择城市 */
 chooseCity(e) {
  const {city} = e.currentTarget.dataset
  App.globalData.defaultCity=city
  App.getAreaAndRoom().then(res=>{
    
  //上一页要是酒店列表 就重置筛选
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