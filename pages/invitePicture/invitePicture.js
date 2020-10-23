// pages/invitePicture/invitePicture.js
const App = getApp()
import {circleImg} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode:null,
    discount:null,
    windowWidth:null,
    windowHeight:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const {qrcode,discount}=options
     const {windowWidth,windowHeight} = App.globalData
     this.setData({
      qrcode,discount,
      windowWidth,
      windowHeight
     })  
  },
  keepCavans(){
    return new Promise((resolve,reject)=>{
      const {qrcode,discount, windowWidth} = this.data
      wx.showToast({
        title: '生成图片中...',
        mask: true,
        icon: 'loading'
      })
      wx.getImageInfo({
        src: qrcode,
        success:  (res)=> {
          var ctx = wx.createCanvasContext('mycanvas');
          var inviteBg = '/images/invite_bg@2x.png'
          var avatar = '/images/mine/default_avatar@2x.png'
          //画布大小
          ctx.setFillStyle("#fff")
          ctx.fillRect(0, 0, 375, 724)
          //酒店图片
          ctx.drawImage(inviteBg, 0, 0, 375, 724);
          //头像
          circleImg(ctx,avatar,50,50,50,97)
          //折扣
          ctx.save()
          ctx.setFontSize(14)
          ctx.setFillStyle('#7A21A8')
          ctx.fillText(`全场${discount}折`, 272, 232 - 0.5);
          ctx.fillText(`全场${discount}折`, 272 - 0.5, 232);
          ctx.fillText(`全场${discount}折`, 272, 232);
          //二维码
          ctx.save()
          ctx.drawImage(res.path, 113, 370, 146, 146);
        
          ctx.draw(false,setTimeout( ()=> {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              success: (res)=> {
                var tempFilePath = res.tempFilePath;
                resolve(tempFilePath)
              },
              fail: function (res) {
                console.log(res);
                reject(res)
              }
            })
          }, 100))
        }
      })
    })
   
    
  },
  keepPic(){
    this.keepCavans().then(filePath=>{
      wx.saveImageToPhotosAlbum({ //下载图片
        filePath,
        success : function () {
          setTimeout(()=>{
            wx.showToast({
              title : "保存成功",
              icon: "success",
            })
          },500)
        }
      })
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
    this.keepCavans().then(imageUrl=>{
    const userId =wx.getStorageSync('userId')?wx.getStorageSync('userId'):'-1'
    return {
      title:`闲房`,
      path:`/pages/index/index?parentId=${userId}`,
      imageUrl
    }
  })
}
  
})