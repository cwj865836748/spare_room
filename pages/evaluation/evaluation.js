// pages/evaluation/evaluation.js
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
    count:4,//可上传的图片数目
    isShow:false,
    service_attitude_score:0,
    room_arrange_score:0
  },
  uploadImage(){
    const {count,img_url} = this.data
    const uploadCount = count-img_url.length
    chooseImage({count:uploadCount}).then(res=>{
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
    const {key} = e.currentTarget.dataset
    this.setData({
      [key]:e.detail
    })
  },
  submit(){
    const{content,img_url,order_id,service_attitude_score,room_arrange_score} = this.data
    isNull({content:service_attitude_score,title:'服务态度分数'})&&isNull({content:room_arrange_score,title:'房间安排效率分数'})&&isNull({content,title:'评价内容'})&&
    isNull({content:img_url.length,title:'支付凭证'})&&
    request({url:api.orderDetail.comment,data:{content,order_id,service_attitude_score,room_arrange_score,img_url:img_url.join(',')}}).then(res=>{
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