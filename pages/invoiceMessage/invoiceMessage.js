// pages/invoiceMessage/invoiceMessage.js
import {isNull} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_invoice: 0,//是否开票
    invoice_info:{
     invoice_type:1,//发票类型:1=普通(电子),2=普通(纸质),3=专票(纸质)
     platform_type:1,//开票类型:1=平台开票,2=商家开票,
     title:'',//抬头,
     identity_type:1,//身份类型:1=公司,2=个人,
     name:'',//公司名称/个人名称,
     duty_paragraph:'',//税号,
     is_Indicate:0,//是否注明酒店名称和入离时间:0=否,1=是,
     remark:'',//发票说明,
     consignee:'',//收件人,
     phone:'',//手机号,
     province:'',//省份,
     city:'',//城市
     county:'',//地区
     detail:'',//详细地址,
     email:'',//邮箱号,
     company_address:'',//公司注册地址,
     company_phone:'',//公司电话,
     open_bank:'',//开户银行,
     card_number:''//银行账号,
    },
    isDisable:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //is_invoice为平台还是商家开票
    //is_invoice2是否开票
    //isDisable是否来自订单详情判断禁用
    let {address,is_invoice,is_invoice2,invoice_info,isDisable} = options
    address = address?JSON.parse(address):{}
    if(Object.keys(address).length){
      delete address.id
      delete address.user_id
      delete address.create_time
    }
    invoice_info=JSON.parse(invoice_info)
    let platform_type =parseInt(is_invoice)?2:1
    this.setData({
      invoice_info:{...this.data.invoice_info,platform_type,...address,...invoice_info},
      is_invoice:parseInt(is_invoice2),
      isDisable:isDisable==1?true:false
    })
  },
  //是否需要开票
  onChange(e) {
    const {key} = e.currentTarget.dataset
    let detail = e.detail
 
    if(key=='is_invoice'){
      detail =detail?1:0 
      this.invoiceStatus(detail)
    }
    this.setData({ 
      [key]: detail 
    });
  },
  onChange2(e){
    const {key,value,disabled} = e.currentTarget.dataset
    if(this.data.isDisable||disabled){
      return
    }
    this.setData({ 
      invoice_info:{...this.data.invoice_info,[key]:value}
    });
  },
  onChange3(e) {
    const {key} = e.currentTarget.dataset
    let detail = e.detail
    if(key=='is_Indicate'){
      detail =detail?1:0
    }
    this.setData({ 
      invoice_info:{...this.data.invoice_info,[key]:detail} 
    });
  },
  //修改明细
  invoiceStatus(detail){
    let pages = getCurrentPages()
    let prevpage = pages[pages.length - 2]
    let {bookQuery,query}= prevpage.data
    if(!detail&&bookQuery.is_invoice){
      prevpage.setData({
        query:{
          ...query,platform_type:''
        },
        bookQuery:{...bookQuery,is_invoice:0}
      })
      prevpage.getFee()
    }
  },
  isOk(){
    let pages = getCurrentPages()
    let prevpage = pages[pages.length - 2]
    const {is_invoice,invoice_info}=this.data
    const {name, duty_paragraph,email,
    invoice_type,
    platform_type,
    consignee,
    identity_type,
    company_address,
    company_phone,
    open_bank,
    card_number} =invoice_info
    //平台-普电-企业
    if(invoice_type==1&&identity_type==1){
      if(!isNull({content:name,title:'企业名称'})||
      !isNull({content:duty_paragraph,title:'企业税号'})||
      !isNull({content:email,title:'邮箱号'})){
        return
      }
    }
    //平台-普电-个人
    else if(invoice_type==1&&identity_type==2){
      if(!isNull({content:name,title:'个人名称'})||
      !isNull({content:email,title:'邮箱号'})){
        return
      }
    }
    //平台or商家-普纸-企业
    else if(invoice_type==2&&identity_type==1){
      if(!isNull({content:name,title:'企业名称'})||
      !isNull({content:duty_paragraph,title:'企业税号'})||!isNull({content:consignee,title:'请填写收货地址信息'})){
        return
      }
    }
      //平台or商家-普纸-个人
    else if(invoice_type==2&&identity_type==2){
        if(!isNull({content:name,title:'个人名称'})||!isNull({content:consignee,title:'请填写收货地址信息'})){
          return
        }
    }
     //平台-专纸-企业
     else if(invoice_type==3&&identity_type==1){
      if(!isNull({content:name,title:'企业名称'})||
      !isNull({content:duty_paragraph,title:'企业税号'})||!isNull({content:company_address,title:'注册地址'})||!isNull({content:company_phone,title:'公司电话'})||!isNull({content:open_bank,title:'开户银行'})||!isNull({content:card_number,title:'银行账户'})||!isNull({content:consignee,title:'请填写收货地址信息'})){
        return
      }
    }  
    prevpage.setData({
      bookQuery:{...prevpage.data.bookQuery,invoice_info,is_invoice},
      query:{
        ...prevpage.data.query,platform_type
      }
    })
    prevpage.getFee()
    wx.navigateBack({
      delta:1
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