// pages/collect/collect.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
import {showToast} from '../../utils/wx.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList:[],
    page:1,
    is_next:false,
    noData:false,
    isManage:false,
    isCheckedAll:false,
    collectCheckList:[],
    delCollectShow:false,
    defaultCity:null
  },
  getManage(){
    this.setData({
      isManage:!this.data.isManage,
      isCheckedAll:false,
      collectCheckList:[]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      defaultCity:App.globalData.defaultCity
    })
     this.getCollectList()
  },
  getCollectList(){
    request({url:api.collection.collectionLists,data:{page:this.data.page}}).then(res=>{
      this.setData({
        collectList:[...res.data.list,...this.data.collectList],
        is_next:res.data.is_next
      },()=>{
        this.isNoData()
      })
    })
  },
  isNoData(){
    !this.data.collectList.length&&this.setData({
      noData:true
    })
},
//复选框操作
onChange(e){
   const {key} =e.currentTarget.dataset
  if(key=='collectCheckList'){
    this.setData({
      collectCheckList:e.detail,
      isCheckedAll:e.detail.length==this.data.collectList.length
    })
  }else {
    const isCheckedAll=this.data.isCheckedAll
    const collectCheckList = !isCheckedAll? this.data.collectList.map(item=>{
      return item.id.toString()
    }):[]
    this.setData({
      collectCheckList,
      isCheckedAll:!isCheckedAll
    })
  } 
},
delCollect(){
  if(!this.data.collectCheckList.length){
    return showToast({title:'请选择要删除的酒店!'})
  }
  this.setData({
    delCollectShow:true
  })
},
delCollectOK(){
  const {collectCheckList,collectList}=this.data
request({url:api.collection.collectionDel,data:{collect_id:collectCheckList.join(',')}}).then(res=>{
  if(res.code==200){
    collectCheckList.forEach(item=>{
      const index =collectList.findIndex(items=>items.id==item)
      collectList.splice(index,1)
    })
    this.setData({
      collectList,
      delCollectShow:false
    },()=>{
      this.isNoData()
      this.getManage()
    })
   
  }
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
if(this.data.is_next){
      this.data.page++
      this.getCollectList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})