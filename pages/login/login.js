// pages/login/login.js
import {login,showToast} from '../../utils/wx.js'
import {isNull,checkPhone} from '../../utils/util.js'
import api from '../../request/api.js'
import {request} from '../../request/index.js'
const App=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isCheck:true,
    phoneShow:false,
    wxCode:'',
    phone:'',
    phone_code:'',
    codeNum:60,
    codeName:"获取验证码",
    setTime:null,
    phoneDisabled:false,
    codeDisabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  
  //已阅读勾选
  toCheck(e){
  const {check:isCheck} =e.currentTarget.dataset
   this.setData({
    isCheck
   })
  },
  //开启框
  openPhoneLogin(){
    this.setData({
      phoneShow:true
    })
  },
  //关闭框
  closePhoneLogin(){
    this.setData({
      phoneShow:false
    })
    if(this.data.setTime){
      clearInterval(this.data.setTime)
      this.setData({
        setTime:null,
        codeNum:60,
       codeName:"获取验证码" 
      })
    }
  },
  onChange(e){
    console.log(e)
    const {key} = e.currentTarget.dataset
    this.setData({
      [key]:e.detail
    })
  },
   //手机号一键登录
  getPhoneNumber(e){
    console.log(App.globalData.parent_id)
    if(!this.data.isCheck){
      return showToast({title:'请勾选同意下方的用户协议，即可登录哦！'})
    }
    const {
      errMsg,
      encryptedData,
      iv
    } = e.detail
    if(errMsg!=='getPhoneNumber:ok'){
      return false
    }
    wx.showLoading({
      title: "正在获取",
      mask: true
    });
      request({
        url: api.authorization.getUserPhone,
        data: {
          code:this.data.wxCode,
          encrypted_data:encryptedData,
          iv,
          parent_id:App.globalData.parent_id
        }
      }).then(result => {
        wx.hideLoading();
        if (result.code == 200) {
          wx.setStorageSync('token', result.data.token);
          wx.setStorageSync('userId', result.data.id);
          this.pageRush()
          wx.navigateBack({
            delta: 1
          })
        } else {
          showToast({title: result.msg})
        }
      })
  },
  //获取验证码
  getCode(){
    if(this.data.setTime){
      return
    }
    if(!isNull({content:!checkPhone(this.data.phone),title:'手机号码格式',topic:'有误'})){
      return
    }
    request({url:api.upload.sendCode,data:{mobile:this.data.phone}})
    let setTime = setInterval(()=>{
      this.setData({
        codeName: this.data.codeNum + 's后重发',
        codeNum: this.data.codeNum-1,
        setTime
      });
      if (this.data.codeNum < 0) {
        clearInterval(this.data.setTime)
        this.setData({
          codeName: '重新获取验证码',
          codeNum: 60,
          setTime:null
        });
      }
    },1000)
  },
  //短信登录
  codeLogin(){
    console.log(App.globalData.parent_id)
    const {phone,phone_code,wxCode:code} =this.data
    const {parent_id}= App.globalData
    isNull({content:!checkPhone(phone),title:'手机号码格式',topic:'有误'})&&request({url:api.authorization.codeLogin,data:{phone,phone_code,code,parent_id}}).then(result=>{
      if (result.code == 200) {
        wx.setStorageSync('token', result.data.token);
        wx.setStorageSync('userId', result.data.id);
        this.pageRush()
        wx.navigateBack({
          delta: 1
        })
      } else {
        showToast({title: result.msg})
      }
    })
  },
  //登录刷新
  pageRush(){
    let p=getCurrentPages();
    let pages = p[p.length-2]
    pages.route=='pages/roomReservation/roomReservation'&& pages.getInit()
  },
  keyFocus(e){
  this.setData({
    reasonHeight: e.detail.height || 0
  })
  },
  inputFocus(e){
    const {name} = e.currentTarget.dataset
    this.setData({
      phoneDisabled:name=='phone'?false:true,
      codeDisabled: name=='phone'?true:false
    })
  },
  inputBlur(e){
    this.setData({
      phoneDisabled:false,
      codeDisabled: false
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
   login().then(res=>{
     this.setData({
       wxCode:res.code
     })
     
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