// pages/cityList/cityList.js
const App = getApp()
import api from '../../request/api.js'
import {
  request
} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: [],
    hotCityList: [],
    offsetTop: null,
    indexList: [],
    defaultCity: null,
    loadingShow: false,
    selectListShow: false,
    selectList:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCity()
  },
  getCity() {
    const {
      navBar,
      cityData,
      defaultCity
    } = App.globalData
    request({
      url: api.config.hotcity
    }).then(res => {
      this.setData({
        offsetTop: navBar.navHeight,
        cityList: cityData.cityList,
        indexList: cityData.indexList,
        hotCityList: res.data.list,
        defaultCity
      })
    })
  },


  /**选择城市 */
  chooseCity(e) {
    const {
      city
    } = e.currentTarget.dataset
    App.globalData.defaultCity = city
    App.getAreaAndRoom().then(res => {

      //上一页要是酒店列表 就重置筛选
      wx.navigateBack({
        delta: 1
      })
      let p = getCurrentPages();
      let pages = p[p.length - 2]
      pages.route == 'pages/hotelList/hotelList' && pages.clearAll()
    })

  },
    //城市搜索
    searchCity(e) {
      this.setData({
        loadingShow: true,
        selectListShow: true
      })
      this.throttle(this.getCityList, null, 500, e.detail)
    },
    // 节流
    throttle(fn, context, delay, text) {
      clearTimeout(fn.timeoutId);
      fn.timeoutId = setTimeout(() => {
        fn.call(context, text, this);
      }, delay);
    },
    getCityList(name, _this) {
      request({
        url: api.config.cityList,
        data: {
          name
        }
      }).then(res => {
        _this.setData({
          loadingShow: false,
          selectList: res.data.list
        })
      })
    },
    hiddenSelect(){
      clearTimeout(this.getCityList.timeoutId);
      this.setData({
        loadingShow: false,
        selectListShow: false
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