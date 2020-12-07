// pages/hotelDetail/hotelDetail.js
const App = getApp()
import api from '../../request/api.js'
import {
  request
} from '../../request/index.js'
import {
  formatTime2,
  formatTime3,
  getAuth,
  circleImg,
  darwRoundRect,
  textPrewrap
} from '../../utils/util.js'
import {
  openLocation,saveImageToPhotosAlbum
} from '../../utils/wx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailHeadList: ['房型', '酒店设施', '酒店政策', '附近商家推荐'],
    tab: 0,
    hotelId: null,
    //酒店详情
    hotelDetail: null,
    //轮播图
    slideshowList: [],
    defaultDate: [],
    calendarShow: false,
    //酒店设施
    hotelFacilitiesList: [],
    //附近商家推荐
    hotelList: [],
    //房型列表
    bedList: [],
    roomDetailShow: false,
    roomDetail: {},
    shareShow: false,
    noData: false,
    headColor: 'transparent',
    titleColor: '#fff',
    isHotelInvite: '',
    shareFriendsShow: false,
    postImg: null,
    qrImg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //邀请scene太阳玛进入，isHotelInvite判断酒店分享进入
    const {
      isInvite,scene,id,isHotelInvite
    } = options
    
    isInvite||scene ? this.getLocation().then(location => {
      const {
        lat: latitude,
        lng: longitude
      } = location
      this.getInit({
        ...options,
        latitude,
        longitude,
        isHotelInvite:scene||isHotelInvite,
        id:scene?scene:id,
      })
    }) : this.getInit(options)

    scene?this.getTimeInit({...options,id:scene}):this.getTimeInit(options)
  },
  getInit(hotel) {
    const {
      id: hotel_id,
      longitude,
      latitude,
      isHotelInvite
    } = hotel
    //酒店详情
    const hotelDetail = request({
      url: api.hotel.index,
      data: {
        hotel_id,
        longitude,
        latitude
      }
    })
    //酒店设施 酒店轮播图
    const promise = [api.hotel.hotelFacilities].map(url => {
      return request({
        url,
        data: {
          hotel_id
        }
      })
    })
    Promise.all([hotelDetail, ...promise]).then(res => {
      this.setData({
        hotelDetail: res[0].data.info,
        slideshowList: res[0].data.info.slideshow,
        hotelFacilitiesList: res[1].data.list,
        hotelId: hotel_id,
        isHotelInvite
      })
    })
  },
  getTimeInit(hotel) {
    //房型 附近商家推荐
    const {
      id: hotel_id
    } = hotel
    let [starttime, endtime] = App.globalData.defaultDate
    starttime = formatTime2(starttime)
    endtime = formatTime2(endtime)
    const promise2 = [api.hotel.room, api.hotel.near].map(url => {
      return request({
        url,
        data: {
          hotel_id
        },
        header: {
          starttime,
          endtime
        }
      })
    })
    Promise.all(promise2).then(res => {
      const bedList = res[0].data.list.map(item => {
        item.isOpen = false
        const isRequire = item.store_room.find(items => items.is_empty)
        item.isRequire = isRequire ? false : true
        return item
      })
      this.setData({
        bedList,
        hotelList: res[1].data.list,
        defaultDate: App.globalData.defaultDate,
        noData: !bedList.length ? true : false
      })
    })
  },
  // getBindParent(parent_id) {
  //   App.globalData.parent_id = parent_id
  //   this.setData({
  //     parent_id
  //   })
    // request({
    //   url: api.authorization.userBind,
    //   data: {
    //     parent_id
    //   }
    // })
  // },
  //是否收藏/取消收藏
  isCollect() {
    const {
      is_collect,
      id: hotel_id
    } = this.data.hotelDetail
    const url = is_collect ? api.collection.collectionCancel : api.collection.collectionAdd
    request({
      url,
      data: {
        hotel_id
      }
    }).then(res => {
        this.setData({
          hotelDetail: {
            ...this.data.hotelDetail,
            is_collect: !is_collect
          }
        })
    })
  },
  //开启日历
  openCalendar() {
    this.setData({
      calendarShow: true
    })
  },
  //关闭日历()
  closeCalendar() {
    this.setData({
      calendarShow: false
    })
    //相同时间不调用接口
    let [start_time, end_time] = this.data.defaultDate
    let [chooseStart, chooseEnd] = App.globalData.defaultDate
    //如果其中一个不为0 说明日期改变了。
    if ((formatTime3(chooseStart) - formatTime3(start_time)) || (formatTime3(chooseEnd) - formatTime3(end_time))) {

      this.getTimeInit({
        id: this.data.hotelId
      })

    }
  },
  //切换栏
  tabChange(e) {
    let tab = e.currentTarget.dataset.index
    const {
      bedList,
      hotelList
    } = this.data
    const noData = (!bedList.length && tab == 0) || (!hotelList.length && tab == 3)
    this.setData({
      tab,
      noData
    })

  },
  //房型展开/关闭
  openCloseRoom(e) {
    const {
      index
    } = e.currentTarget.dataset
    const {
      bedList,
      hotelDetail
    } = this.data
    bedList[index].isOpen = !bedList[index].isOpen
    App.globalData.bedDetail = {
      ...bedList[index],
      hotelName: hotelDetail.name
    }
    this.setData({
      bedList
    })
  },
  // 房型详情
  roomDetailShow(e) {
    const {
      id: room_id,
      i
    } = e.currentTarget.dataset
    const index = this.data.bedList.findIndex(item => item.id == i)
    const bedDetail = this.data.bedList[index]
    request({
      url: api.hotel.roomFacilities,
      data: {
        room_id
      }
    }).then(res => {
      const list = res.data.list.map(item => {
        item.second = item.second.length && item.second.join(',')
        return item
      })
      this.setData({
        roomDetail: {
          ...bedDetail,
          list
        },
        roomDetailShow: true
      })
    })
  },
  closeHotelDetailShow() {
    this.setData({
      roomDetailShow: false
    })
  },
  //开启地图
  openMap() {
    let {
      latitude,
      longitude,
      address,
      name
    } = this.data.hotelDetail
    latitude = parseFloat(latitude)
    longitude = parseFloat(longitude)
    const mapDetail = {
      latitude,
      longitude,
      address,
      name
    }
    openLocation(mapDetail)
  },


  openOrCancelShare(e) {
    const {
      show: shareShow
    } = e.currentTarget.dataset
    this.setData({
      shareShow
    })
  },
  goDetail(e) {
    const {
      items
    } = e.currentTarget.dataset
    const {
      id,
      is_empty
    } = items
    if (!is_empty) {
      return
    }
    wx.navigateTo({
      url: `/pages/roomReservation/roomReservation?id=${id}`,
    })

  },
  preventTouchMove(){
    return
  },
  onPageScroll: function (e) {
    const {
      scrollTop
    } = e
    if (scrollTop > 50 && this.data.headColor != '#fff') {
      this.setData({
        headColor: '#fff',
        titleColor: '#333333'
      })
    } else if (scrollTop < 50 && this.data.headColor != 'transparent')
      this.setData({
        headColor: 'transparent',
        titleColor: '#fff'
      })
  },
  //获取当前位置
  getLocation() {
    return new Promise((resolve, reject) => {
      getAuth().then(res => {
        const {
          address_component,
          location
        } = res.result
        request({
          url: api.config.cityConversion,
          data: {
            city_name: address_component.city
          }
        }).then(city => {
          const defaultCity = {
            name: address_component.city,
            ...location,
            ...city.data
          }
          App.globalData.defaultCity = defaultCity
          App.getAreaAndRoom()
          resolve(location)
        })
      })
    })

  },
  shareFriendsSquare(e) {
    const {
      show: shareFriendsShow
    } = e.currentTarget.dataset
    if (shareFriendsShow) {
      const {
        slideshowList,
        hotelDetail
      } = this.data
      wx.getImageInfo({
        src: slideshowList[0],
        success: (res) => {
          this.setData({
            postImg: res.path
          })
        }
      })
      wx.getImageInfo({
        src: hotelDetail.qrcode,
        success: (res) => {
          this.setData({
            qrImg: res.path
          })
        }
      })
    }
    this.setData({
      shareFriendsShow,
      shareShow: shareFriendsShow && false
    })

  },
  saveCavans() {
    const {
      postImg,
      qrImg,
      hotelDetail
    } = this.data
    wx.showToast({
      title: '生成图片中...',
      mask: true,
      icon: 'loading'
    })
    var ctx = wx.createCanvasContext('mycanvas');
    var statImg = '/images/hotel_score_star@2x.png'
    //画布大小
    ctx.setFillStyle("#fff")
    ctx.fillRect(0, 0, 375, 505)
    //酒店图片
    ctx.drawImage(postImg, 0, 0, 375, 375);
    //二维码图片
    circleImg(ctx, qrImg, 80, 80, 280, 209)
    //底部背景
    darwRoundRect(0, 304, 375, 200, 4, '#FFF', ctx)
    //酒店名称
    ctx.save()
    ctx.setFontSize(17)
    ctx.setFillStyle('black')
    ctx.fillText(hotelDetail.name, 16, 338)
    //星星
    for (let i = 0; i < hotelDetail.star; i++) {
      const x = i > 0 ? 16 + 10 * i + 3 * i : 16
      ctx.drawImage(statImg, x, 348, 10, 10);
    }
    //酒店英文名
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('#999999')
    textPrewrap(ctx, hotelDetail.name_en, 16, 380, 18, 320, 1)

    //酒店地址
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('black')
    textPrewrap(ctx, `${hotelDetail.city} ${hotelDetail.county} ${hotelDetail.address}`, 16, 420, 18, 320, 1)
    //开店时间
    darwRoundRect(16, 435, 315, 42, 4, '#F8F8F8', ctx)
    //酒店时间
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('black')
    ctx.fillText(`${hotelDetail.open_time}`, 31, 460)
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('#999999')
    ctx.fillText(`年开业`, 67, 460)
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('#999999')
    ctx.fillText(`|`, 130, 460)
    //房间数
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('black')
    ctx.fillText(`${hotelDetail.room_num}`, 155, 460)
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('#999999')
    ctx.fillText(`间房`, 182, 460)
    ctx.save()
    ctx.setFontSize(15)
    ctx.setFillStyle('#999999')
    ctx.fillText(`|`, 230, 460)

    ctx.draw(false, setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: (res) => {
          var filePath = res.tempFilePath;
          saveImageToPhotosAlbum(filePath)
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log('所有', res)
        }
      })
    }, 100))
  },
  openRequire() {
    this.hotelRequire.openRequire()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.hotelRequire = this.selectComponent("#hotelRequire");
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
    // const userId = wx.getStorageSync('userId') ? wx.getStorageSync('userId') : '-1'
    this.setData({
      shareShow: false
    })
    return {
      title: `${this.data.hotelDetail.name}`,
      path: `/pages/hotelDetail/hotelDetail?id=${this.data.hotelId}&isHotelInvite=true&isInvite=true`,
      imageUrl: this.data.slideshowList[0],

    }
  }
})