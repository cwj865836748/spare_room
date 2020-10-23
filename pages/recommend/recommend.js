// pages/recommend/recommend.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
  // "level": "等级0--普通用户 1--青铜 2--白银 3--黄金 4--白金 5--钻石"
    swiperIndex:0,
    recommendRecordList:[],
    shareShow:false,
    moreShow:false,
    userMemberInfo:{},
    swiperList:[
      {id:1,imageUrl:"/images/recommend/domestic_consumer_bg@2x.png"},
      {id:2,imageUrl:"/images/recommend/bronze_member_bg@2x.png"},
      {id:3,imageUrl:"/images/recommend/silver_members_bg@2x.png"},
      {id:4,imageUrl:"/images/recommend/gold_members_bg@2x.png"},
      {id:5,imageUrl:"/images/recommend/platinum_member_bg@2x.png"},
      {id:6,imageUrl:"/images/recommend/diamond_member_bg@2x.png"}    
   ],
   isShowHead:true,
   shareFriendsShow:false
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindchange(e) {
    this.setData({ swiperIndex: e.detail.current})
  },
  bindtransition(e){
    this.setData({
      isShowHead:false
    })
  },
  bindanimationfinish(e){
  
    this.setData({
      isShowHead:true
    })
  },
  openOrCancelShare(e){
    const {show:shareShow} = e.currentTarget.dataset
    shareShow?wx.hideTabBar():wx.showTabBar()
    this.setData({
      shareShow
    })
  },
  showDoMore(){
    this.setData({
      moreShow:true
    })
  },
  closeDoMore(){
    this.setData({
      moreShow:false
    })
  },
  jumpGoodFriends(e){
    const {index} = e.currentTarget.dataset
    index==this.data.userMemberInfo.info.level&&wx.navigateTo({
      url: '/pages/goodFriends/goodFriends',
    })
  },
  getInit(){
    const promiseAll = [api.moneyLog.index,api.config.vips,api.moneyLog.detailList].map(item=>{
      return request({url:item})
    })
    Promise.all(promiseAll).then(res=>{ 
      const swiperList = res[1].data.list.reduce((pre,next)=>{
        let target=pre.find(v=>v.id == next.id)
        if(target){
          Object.assign(target,next)
        }
        return pre
      },this.data.swiperList)
      const swiperIndex = this.memberStatus(res[0].data.vip?res[0].data.vip.remark:'普通用户')
      
      this.setData({
        userMemberInfo:res[0].data,
        swiperList:[...swiperList],
        recommendRecordList:res[2].data.list,
        swiperIndex
      })
    })
  },
  memberStatus(name){
     switch(name){
       case '普通用户':
         return 0
         case '青铜会员':
          return 1
          case '白银会员':
            return 2
            case '黄金会员':
              return 3
              case '白金会员':
                return 4
                case '钻石会员':
                  return 5
     }
  },
  shareFriendsSquare(e){
    const {show:shareFriendsShow}=e.currentTarget.dataset
    this.setData({
     shareFriendsShow,
     shareShow:shareFriendsShow&&false
    })
    shareFriendsShow&&wx.showTabBar()
 },
  onLoad: function (options) {
    
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
    this.getInit()
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
    const userId =wx.getStorageSync('userId')?wx.getStorageSync('userId'):'-1'
    　this.setData({
      shareShow:false
    })
    wx.showTabBar()
    return {
      title:'闲房',
      path:`/pages/index/index?parentId=${userId}`,
      imageUrl:''
    }
  }
})