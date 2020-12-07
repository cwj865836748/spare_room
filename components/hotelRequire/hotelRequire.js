// components/calendar/calendar.js
const App=getApp()
var utils = require('../../utils/util.js')
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Component({
  /**
   * 组件的属性列表
   */
  options:{
    addGlobalClass:true
  },
  properties: {
    isHotelList:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
     /**需求发布 */
     calendarShow:false,
     requireShow:false,
     isEditRequire:false,
     requireBreakFastShow:false,
     breakFastList:[{id:0,name:'无早'},{id:1,name:'单份早餐'},{id:2,name:'双份早餐'},{id:3,name:'免费早餐'}],
     loadingShow:false,
     requireCertainShow:false,
     selectListShow:false,
     selectList:[],
     requireForm:{
       hotel_name:'',
       country:'中国',
       province:'',
       city:'',
       room_name:'',
       start_time:'',
       end_time:'',
       room_num:1,
       breakfast:'',//早餐类型:0=无早,1=单份早餐,2=双份早餐,3=免费早餐
       remark:''
     },
     isScroll:true
  },
  attached(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
  
  openRequire(){
    let {defaultDate,defaultCity,bedDetail} =App.globalData
    const {isHotelList} = this.properties
    console.log(isHotelList)
    bedDetail=isHotelList?'':bedDetail
    const {id:cityid,name:city} = defaultCity
    let [start_time,end_time] =defaultDate
    start_time=utils.formatTime2(start_time)
    end_time=utils.formatTime2(end_time)
    request({url:api.config.province,header:{cityid}}).then(res=>{
      const requireForm={
        ...this.data.requireForm,
        province:res.data.name,
        city,
        start_time,
        end_time,
        hotel_name:bedDetail?bedDetail.hotelName:'',
        room_name:bedDetail?bedDetail.room_name:'',
        breakfast:''
      }
      this.setData({
        requireShow:true,
        requireForm,
        isEditRequire:true
      })
    })
  },
  closeRequire(){
    this.setData({
      requireShow:false
    })
  },
  //设置需求时间
  setRequireTime(e){
    const {start:start_time,end:end_time} = e.detail
    this.setData({
      requireForm:{...this.data.requireForm,start_time,end_time}
    })
  },
    //开启日历
    openCalendar(){
      this.setData({
        calendarShow:true
      })
    },
    //关闭日历
    closeCalendar(){
      this.setData({
        calendarShow:false
      })
    },
    //所有框输入选择
    onChange(e){
       const {key} = e.currentTarget.dataset
       this.setData({
          requireForm:{...this.data.requireForm,[key]:[key]!='breakfast'?e.detail:e.detail.id},
          requireBreakFastShow:false
       })
    },
    //开启早餐选择
    openBreakFast(){
      this.setData({
        requireBreakFastShow:true
      })
    },
    closeBreakFast(){
      this.setData({
        requireBreakFastShow:false
      })
    },
    //酒店名称输入
    searchHotel(e){
      this.setData({
        loadingShow:true,
        selectListShow:true
      })
      this.throttle(this.getHotelList, null, 500, e.detail)   
    },
    // 节流
  throttle(fn, context, delay, text) {
    clearTimeout(fn.timeoutId);
    fn.timeoutId = setTimeout( ()=> {
      fn.call(context, text,this);
    }, delay);
  },
    getHotelList (name,_this){
      const {city:city_name} = _this.data.requireForm
      request({url:api.demand.search,data:{name,city_name}}).then(res=>{
        _this.setData({
          loadingShow:false,
          selectList:res.data.list
        })
      })
    },
    hiddenHotelList(){
      clearTimeout(this.getHotelList.timeoutId);
      this.setData({
        loadingShow:false,
        selectListShow:false
      })
    },
    //发布需求
    toRequire(){
      const{country,province,city,room_name,hotel_name,breakfast} = this.data.requireForm
      let {isNull} = utils
    isNull({content:country,title:'国家'})&&
    isNull({content:province,title:'省份'})&&
    isNull({content:city,title:'城市'})&&
    isNull({content:hotel_name,title:'酒店名称'})&&
    isNull({content:room_name,title:'房型名称'})&&
    isNull({content:String(breakfast).length,title:'早餐类型'})&&
    request({url:api.demand.demandAdd,data:this.data.requireForm}).then(res=>{
      if(res.code==200){
        this.setData({
          requireCertainShow:true
        })
      }
    })
    },
    chooseCityName(e){
      const {name:hotel_name} =e.currentTarget.dataset
      this.setData({
        requireForm:{...this.data.requireForm,hotel_name},
        loadingShow:false,
        selectListShow:false
      })
    },
    requireOk(){
      this.setData({
        requireShow:false,
        requireCertainShow:false
      })
    },
    inPutControl(e){
       const {type} = e
       this.setData({
        isScroll:type=='focus'?false:true
       })
    },
    preventTouchMove(){
      return
    }
  }
})
