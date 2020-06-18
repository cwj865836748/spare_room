// pages/cityList/cityList.js
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: [
      {
        firstLetter: "A",
        list: [
          { code: "AB01", name: "A1客户" },
          { code: "AB02", name: "A2客户" },
          { code: "AB03", name: "A3客户" },
        ],
      },
      {
        firstLetter: "B",
        list: [
          { code: "BB01", name: "B1客户" },
          { code: "BB02", name: "B2客户" },
          { code: "BB03", name: "B3客户" },
          { code: "BB04", name: "B4客户" },
        ],
      },
      {
        firstLetter: "C",
        list: [
          { code: "CB01", name: "C1客户" },
          { code: "CB02", name: "C2客户" },
          { code: "CB03", name: "C3客户" },
          { code: "CB04", name: "C4客户" },
          { code: "CB05", name: "C5客户" },
          { code: "CB01", name: "C1客户" },
          { code: "CB02", name: "C2客户" },
          { code: "CB03", name: "C3客户" },
          { code: "CB04", name: "C4客户" },
          { code: "CB05", name: "C5客户" },
        ],
      },
      {
        firstLetter: "D",
        list: [
          { code: "DB01", name: "D1客户" },
          { code: "DB02", name: "D2客户" },
          { code: "DB03", name: "D3客户" },
          { code: "DB04", name: "D4客户" },
          { code: "DB05", name: "D5客户" },
          { code: "DB06", name: "D6客户" },
          { code: "DB01", name: "D1客户" },
          { code: "DB02", name: "D2客户" },
          { code: "DB03", name: "D3客户" },
          { code: "DB04", name: "D4客户" },
          { code: "DB05", name: "D5客户" },
          { code: "DB06", name: "D6客户" },
          { code: "DB06", name: "D6客户" },
          { code: "DB01", name: "D1客户" },
          { code: "DB02", name: "D2客户" },
          { code: "DB03", name: "D3客户" },
          { code: "DB04", name: "D4客户" },
          { code: "DB05", name: "D5客户" },
          { code: "DB06", name: "D6客户" },
        ],
      },
    ],
    offsetTop:null,
    popupShow:false,
    showLetter:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getCurrentPages)
    this.setData({
      offsetTop:App.globalData.navBar.navHeight
    })
  },


 /**选择城市 */
 chooseCity(e) {
  console.log(123)
},
/**选择字母 */
letterSelect(e){
  this.setData({
    popupShow:true,
    showLetter:e.detail
  })
  setTimeout(()=>{
    this.setData({
      popupShow:false
    })
  },500)
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