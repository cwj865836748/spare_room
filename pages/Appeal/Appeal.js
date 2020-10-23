// pages/Appeal/Appeal.js
import {chooseImage,uploadFile,previewImage, showToast,navigateBack} from "../../utils/wx.js"
import api from '../../request/api.js'
import {request} from '../../request/index.js'
const app= getApp()
import {isNull} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:'',
    content:'',
    img_url:[],
    // count:9,//可上传的图片数目
    isShow:false
  },
  uploadImage(){
    // const {count,img_url} = this.data
    // const uploadCount = count-img_url.length
    chooseImage({count:9}).then(res=>{
      let tempFilePaths =res.tempFilePaths
      wx.showLoading({
        title: "上传图片中",
        mask: true
      });
      let ajaxTimes = 0;
      tempFilePaths.forEach(item=>{
        ajaxTimes++;
        uploadFile({
          filePath: item,
          url: `${app.globalData.baseUrl}${api.upload.upload}`,
          formData: {
            files: item,
          },
          complete: () => {
            ajaxTimes--;
            if (ajaxTimes === 0) {
              wx.hideLoading();
            }
          }
        }).then(res=>{
           this.setData({
            img_url:[res.url,...this.data.img_url]
           })
        })
      })
    })
  },
  delImage(e){
    const {index} =e.currentTarget.dataset
    this.data.img_url.splice(index,1)
    this.setData({
      img_url:[...this.data.img_url]
    })
  },
  previewImg(e){
    const {current} = e.target.dataset
    previewImage({ current,
      urls: this.data.img_url})
  },
  onChange(e){
    this.setData({
      content:e.detail
    })
  },
  submit(){
    const{content,img_url,order_id} = this.data
    isNull({content,title:'申诉理由'})&&
    isNull({content:img_url.length,title:'支付凭证'})&&
    request({url:api.orderDetail.appeal,data:{content,order_id,img_url:img_url.join(',')}}).then(res=>{
      if(res.code==200){
        this.setData({
          isShow:true
        })
        setTimeout(()=>{
          navigateBack(1)
        },1500) 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id:options.id
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

  }
})