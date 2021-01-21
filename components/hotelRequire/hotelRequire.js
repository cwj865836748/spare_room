// components/calendar/calendar.js
const App = getApp()
var utils = require('../../utils/util.js')
import api from '../../request/api.js'
import {
  request
} from '../../request/index.js'
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  //判断是酒店列表还是房型详情
  properties: {
    isHotelList: {
      type: Boolean,
      value: true
    },
    roomList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**需求发布 */
    calendarShow: false,
    requireShow: false,
    isEditRequire: false,
    requireBreakFastShow: false,
    requireRemarkShow: false,
    requireBedShow: false,
    breakFastList: [{
      id: 0,
      name: '无早'
    }, {
      id: 1,
      name: '1份早餐'
    }, {
      id: 2,
      name: '2份早餐'
    }],
    bedList: [{
      id: '默认',
      name: '默认'
    }, {
      id: '大床',
      name: '大床'
    }, {
      id: '双床',
      name: '双床'
    }, {
      id: '多床',
      name: '多床'
    }],
    remarkList: [{
      id: '无要求',
      name: '无要求'
    }, {
      id: '吸烟房',
      name: '吸烟房'
    }, {
      id: '无烟房',
      name: '无烟房'
    }, {
      id: '搞派对',
      name: '搞派对'
    }, {
      id: '旅游',
      name: '旅游'
    }, {
      id: '商务出差',
      name: '商务出差'
    }, {
      id: '婚房',
      name: '婚房'
    }],
    loadingShow: false,
    requireCertainShow: false,
    selectListShow: false,
    selectList: [],
    requireForm: {
      hotel_name: '',
      country: '中国',
      province: '',
      city: '',
      room_name: '',
      start_time: '',
      end_time: '',
      room_num: 1,
      breakfast: '', //早餐类型:0=无早,1=1份早餐,2=2份早餐
      remark: '无要求',
      bed_type_cate: '默认'
    },
    isScroll: true,
    roomListShow: false
  },
  attached() {},

  /**
   * 组件的方法列表
   */
  methods: {

    openRequire() {
      let {
        defaultDate,
        defaultCity,
        bedDetail
      } = App.globalData
      const {
        isHotelList
      } = this.properties
      bedDetail = isHotelList ? '' : bedDetail
      const {
        id: cityid,
        name: city
      } = defaultCity
      let [start_time, end_time] = defaultDate
      start_time = utils.formatTime2(start_time)
      end_time = utils.formatTime2(end_time)
      request({
        url: api.config.province,
        header: {
          cityid
        }
      }).then(res => {
        const requireForm = {
          ...this.data.requireForm,
          province: bedDetail ? bedDetail.province : res.data.name,
          city: bedDetail ? bedDetail.city : city,
          start_time,
          end_time,
          hotel_name: bedDetail ? bedDetail.hotelName : '',
          room_name: bedDetail ? bedDetail.room_name : '',
          breakfast: ''
        }
        this.setData({
          requireShow: true,
          requireForm,
          isEditRequire: true
        })
      })
    },
    closeRequire() {
      this.hiddenHotelList()
      this.setData({
        requireShow: false
      })
    },
    //设置需求时间
    setRequireTime(e) {
      const {
        start: start_time,
        end: end_time
      } = e.detail
      this.setData({
        requireForm: {
          ...this.data.requireForm,
          start_time,
          end_time
        }
      })
    },
    //开启日历
    openCalendar() {
      this.setData({
        calendarShow: true
      })
    },
    //关闭日历
    closeCalendar() {
      this.setData({
        calendarShow: false
      })
    },
    //所有框输入选择
    onChange(e) {
      const {
        key
      } = e.currentTarget.dataset
      let value = e.detail
      if (key == 'breakfast' || key == 'remark' || key =='bed_type_cate') {
        value = e.detail.id
      }
      this.setData({
        requireForm: {
          ...this.data.requireForm,
          [key]: value
        },
        requireBreakFastShow: false,
        requireRemarkShow: false,
        requireBedShow: false
      })
    },
    //开启早餐选择
    openBreakFast() {
      this.setData({
        requireBreakFastShow: true
      })
    },
    closeBreakFast() {
      this.setData({
        requireBreakFastShow: false
      })
    },
    //开启备注
    openRemark() {
      this.setData({
        requireRemarkShow: true
      })
    },
    closeRemark() {
      this.setData({
        requireRemarkShow: false
      })
    },
    //开启床型
    openBed() {
      this.setData({
        requireBedShow: true
      })
    },
    closeBed() {
      this.setData({
        requireBedShow: false
      })
    },
    //酒店名称输入
    searchHotel(e) {
      this.setData({
        loadingShow: true,
        selectListShow: true
      })
      this.throttle(this.getHotelList, null, 500, e.detail)
    },
    // 节流
    throttle(fn, context, delay, text) {
      clearTimeout(fn.timeoutId);
      fn.timeoutId = setTimeout(() => {
        fn.call(context, text, this);
      }, delay);
    },
    getHotelList(name, _this) {
      const {
        city: city_name
      } = _this.data.requireForm
      request({
        url: api.demand.search,
        data: {
          name,
          city_name
        }
      }).then(res => {
        _this.setData({
          loadingShow: false,
          selectList: res.data.list
        })
      })
    },
    hiddenHotelList() {
      clearTimeout(this.getHotelList.timeoutId);
      this.setData({
        loadingShow: false,
        selectListShow: false,
        roomListShow: false
      })
    },
    //发布需求
    toRequire() {
      const {
        country,
        province,
        city,
        room_name,
        hotel_name,
        breakfast
      } = this.data.requireForm
      let {
        isNull
      } = utils
      isNull({
          content: country,
          title: '国家'
        }) &&
        isNull({
          content: province,
          title: '省份'
        }) &&
        isNull({
          content: city,
          title: '城市'
        }) &&
        isNull({
          content: hotel_name,
          title: '酒店名称'
        }) &&
        isNull({
          content: room_name,
          title: '房型名称'
        }) &&
        isNull({
          content: String(breakfast).length,
          title: '早餐类型'
        }) &&
        request({
          url: api.demand.demandAdd,
          data: this.data.requireForm
        }).then(res => {
          if (res.code == 200) {
            this.setData({
              requireCertainShow: true
            })
          }
        })
    },
    chooseCityName(e) {
      const {
        name: hotel_name
      } = e.currentTarget.dataset
      this.setData({
        requireForm: {
          ...this.data.requireForm,
          hotel_name
        }
      })
    },
    requireOk() {
      this.setData({
        requireShow: false,
        requireCertainShow: false
      })
    },
    inPutControl(e) {
      const {
        type
      } = e
      this.setData({
        isScroll: type == 'focus' ? false : true
      })
    },
    preventTouchMove() {
      return
    },
    roomNameSearch() {
      if (this.properties.isHotelList) {
        return
      }
      this.setData({
        loadingShow: false,
        selectListShow: false,
        roomListShow: true
      })
    },
    chooseRoomName(e) {
      const {
        name: room_name
      } = e.currentTarget.dataset
      this.setData({
        requireForm: {
          ...this.data.requireForm,
          room_name
        },
        roomListShow: false
      })
    }
  }
})