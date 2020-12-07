// pages/recommend/recommend.js

import {
  saveImageToPhotosAlbum
} from '../../utils/wx.js'
import api from '../../request/api.js'
import {
  request
} from '../../request/index.js'
import {
  circleImg
} from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // "level": "等级0--普通用户 1--青铜 2--白银 3--黄金 4--白金 5--钻石"
    swiperIndex: 0,
    recommendRecordList: [],
    shareShow: false,
    moreShow: false,
    userMemberInfo: {},
    swiperList: [{
        id: 1,
        imageUrl: "/images/recommend/domestic_consumer_bg@2x.png"
      },
      {
        id: 2,
        imageUrl: "/images/recommend/bronze_member_bg@2x.png"
      },
      {
        id: 3,
        imageUrl: "/images/recommend/silver_members_bg@2x.png"
      },
      {
        id: 4,
        imageUrl: "/images/recommend/gold_members_bg@2x.png"
      },
      {
        id: 5,
        imageUrl: "/images/recommend/platinum_member_bg@2x.png"
      },
      {
        id: 6,
        imageUrl: "/images/recommend/diamond_member_bg@2x.png"
      }
    ],
    isShowHead: true,
    shareFriendsShow: false,
    whereHaiBao: 1, //判断海报是哪个地方的0 是详情 1 是推荐
    imageUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  bindtransition(e) {
    this.setData({
      isShowHead: false
    })
  },
  bindanimationfinish(e) {

    this.setData({
      isShowHead: true
    })
  },
  openOrCancelShare(e) {
    const {
      show: shareShow
    } = e.currentTarget.dataset
    shareShow ? wx.hideTabBar() : wx.showTabBar()
    this.setData({
      shareShow
    })
  },
  showDoMore() {
    this.setData({
      moreShow: true
    })
  },
  closeDoMore() {
    this.setData({
      moreShow: false
    })
  },

  getInit() {
    const promiseAll = [api.moneyLog.index, api.config.vips, api.moneyLog.detailList].map(item => {
      return request({
        url: item
      })
    })
    Promise.all(promiseAll).then(res => {
      const swiperList = res[1].data.list.reduce((pre, next) => {
        let target = pre.find(v => v.id == next.id)
        if (target) {
          Object.assign(target, next)
        }
        return pre
      }, this.data.swiperList)
      const swiperIndex = this.memberStatus(res[0].data.vip ? res[0].data.vip.remark : '普通用户')

      this.setData({
        userMemberInfo: res[0].data,
        swiperList: [...swiperList],
        recommendRecordList: res[2].data.list,
        swiperIndex
      }, () => {
        this.getSharePic()
      })
    })

  },
  memberStatus(name) {
    switch (name) {
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
  shareFriendsSquare(e) {
    const {
      show: shareFriendsShow
    } = e.currentTarget.dataset
    this.setData({
      shareFriendsShow,
      shareShow: shareFriendsShow && false
    })
    shareFriendsShow && wx.showTabBar()
  },
  bindgetuserinfo(e) {
    let {
      errMsg,
      rawData
    } = e.detail
    if (errMsg == 'getUserInfo:ok') {
      const src = JSON.parse(rawData).avatarUrl
      wx.getImageInfo({
        src,
        success: (res) => {
          this.saveCavansToRecommend(res.path)
        }
      })

    }
  },
  saveCavansToRecommend(avatarUrl) {
    console.log(this.data.userMemberInfo)
    const {
      swiperList,
      userMemberInfo
    } = this.data
    wx.showToast({
      title: '生成图片中...',
      mask: true,
      icon: 'loading'
    })
    wx.getImageInfo({
      src: userMemberInfo.info.qrcode,
      success: (re) => {
        var ctx = wx.createCanvasContext('mycanvas');
        var inviteBg = '/images/send_square.png'
        var avatar = avatarUrl
        //画布大小
        ctx.setFillStyle("#fff")
        ctx.fillRect(0, 0, 375, 496)
        //酒店图片
        ctx.drawImage(inviteBg, 0, 0, 375, 496);
        //头像
        circleImg(ctx, avatar, 50, 50, 50, 62)
        //折扣
        ctx.save()
        ctx.setFontSize(14)
        ctx.setFillStyle('#7A21A8')
        ctx.fillText(`全场${swiperList[3].discount}折`, 272, 180 - 0.5);
        ctx.fillText(`全场${swiperList[3].discount}折`, 272 - 0.5, 180);
        ctx.fillText(`全场${swiperList[3].discount}折`, 272, 180);
        //标题
        ctx.save()
        ctx.setFillStyle("#fff")
        ctx.fillRect(40, 236, 295, 32)
        ctx.save()
        ctx.setFontSize(19)
        ctx.setFillStyle('#e9ac29')
        ctx.fillText(`全网低价全场${swiperList[3].discount}折,快来收藏`, 75, 260 - 0.5);
        ctx.fillText(`全网低价全场${swiperList[3].discount}折,快来收藏`, 75 - 0.5, 260);
        ctx.fillText(`全网低价全场${swiperList[3].discount}折,快来收藏`, 75, 260);
        //二维码
        ctx.save()
        ctx.drawImage(re.path, 113, 328, 146, 146);

        ctx.draw(false, setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: (res) => {
              var filePath = res.tempFilePath;
              saveImageToPhotosAlbum(filePath)
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }, 100))
      }
    })
  },
  getSharePic() {

    const {
      swiperList
    } = this.data
    var ctx = wx.createCanvasContext('mycanvass');
    var inviteBg = '/images/send_friends.png'
    //画布大小
    ctx.setFillStyle("#fff")
    ctx.fillRect(0, 0, 632, 506)
    //酒店图片
    ctx.drawImage(inviteBg, 0, 0, 632, 506);
    //折扣
    ctx.save()
    ctx.setFontSize(23)
    ctx.setFillStyle('#7A21A8')
    ctx.fillText(`全场${swiperList[3].discount}折`, 476, 100 - 0.5);
    ctx.fillText(`全场${swiperList[3].discount}折`, 476 - 0.5, 100);
    ctx.fillText(`全场${swiperList[3].discount}折`, 476,100);

    ctx.draw(false, setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvass',
        success: (res) => {
          this.setData({
            imageUrl: res.tempFilePath
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }, 1000))

  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    const userId = wx.getStorageSync('userId') ? wx.getStorageSync('userId') : '-1'
    this.setData({
      shareShow: false
    })
    wx.showTabBar()
    return {
      title: '嘿！朋友，送您一张订房金卡，快领取。',
      path: `/pages/index/index?parentId=${userId}`,
      imageUrl: this.data.imageUrl
    }
  }

})