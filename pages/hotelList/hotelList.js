// pages/hotelList/hotelList.js
const App=getApp()
var utils = require('../../utils/util.js')
import api from '../../request/api.js'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortList:['推荐排序','价格/星级','位置距离','综合筛选'],
    sortNumber:-1,//当前选择哪个框//0：推荐排序，1：价格/星级，2：位置距离，3：综合筛选
    //推荐排序
    sortDetailList:[{type:0,name:'推荐排序'},{type:1,name:'低价优先'},{type:2,name:'高价优先'},{type:3,name:'距离优先'}],
    // 价格/星级
    silderValue:[0,1000],
    silderPriceList:[{type:0,price:'500以上'},{type:1,price:'500-800'},{type:2,price:'800-1000'},{type:3,price:'1000以上'}],
    silderPriceChoose:-1,
    starList:[{id:5,name:'五星/豪华型'},{id:4,name:'四星/高档型'},{id:3,name:'三星/舒适型'}],
    starChooseList:[],
    isSilderPrice:-1,//判断是否是滑块值
   // 位置距离
    chooseDistan:1,//选择内部 1：直线距离 2：行政区 // 1.集团 2.房型 3.优惠促销
    meterList:[{id:1,name:'500m'},{id:2,name:'0.5km-1km'},{id:3,name:'1km-5km'},{id:4,name:'5km-10km'},{id:5,name:'10km-50km'}],
    meterChooseOne:-1,
    //行政区
    areaList:[],
    areaChooseOne:-1,
    /**综合筛选*/
     //集团
    groupList:[],
    groupChooseList:[],
     //房型
    roomList:[],
    roomChooseOne:-1,
     //早餐
    breakfastList:[{id:1,name:'无早'},{id:2,name:'单份早餐'},{id:3,name:'双份早餐'},{id:4,name:'免费早餐'}],
    breakfastChooseOne:-1,
     //优惠促销
    //  ,{id:2,name:'可开发票'}
    promotionList:[{id:1,name:'可闲分兑换'},{id:3,name:'礼包'},{id:4,name:'连住优惠'}],
    promotionChooseList:[],

    hotelList:[],
    calendarShow:false,
    requireShow:false,
    requireCertainShow:true,
    defaultDate:[],
    defaultCity:{},
    query:{
      order_sort:0,//0=推荐排序,1=低价优先,2=高价优先,3=距离优先
      min_price:0,
      max_price:0,//最大价格(当无最大价格时传0或不传)
      star:'',//星级:3=三星级,4=四星级，5=五星级 （多个选项用逗号分隔）
      distance:'',//1=500m,2=0.5km-1km,3=1km-5km,4=5km-10km,5=10km-50km
      name:"",
      area:'',
      company:'',
      room:'',
      breakfast:'',
      is_score:0,
      is_invoice:0,
      is_gift:0,
      is_continuous:0,
      page:1,
      latitude:'',
      longitude:''
    },
    header:{
      starttime:'',
      endtime:'',
      cityid:''
    },
    is_next:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGlobalData()
    this.getHotelList()
    this.getGroup()
  },
  getGlobalData(){
    const {areaList,roomList,defaultCity,defaultDate,defaultKeyWords:name} =App.globalData
    const {lat:latitude,lng:longitude,id:cityid} = defaultCity
    let [starttime,endtime] =defaultDate
    starttime=utils.formatTime2(starttime)
    endtime=utils.formatTime2(endtime)
    this.setData({
      areaList,roomList,defaultDate,defaultCity,
      header:{...this.data.header,cityid,starttime,endtime},
      query:{...this.data.query,latitude,longitude,name},
      sortNumber:-1
    })
  },
  getGroup(){
   request({url:api.index.company}).then(res=>{
     this.setData({
      groupList:res.data.list
     })
   })
  },
  /**清空所有选项---选择城市返回 */
  clearAll(){
   this.setData({
    sortList:['推荐排序','价格/星级','位置距离','综合筛选'],
    sortNumber:-1,//当前选择哪个框//0：推荐排序，1：价格/星级，2：位置距离，3：综合筛选
    // 价格/星级
    silderValue:[0,1000],
    silderPriceChoose:-1,
    starChooseList:[],
    isSilderPrice:-1,//判断是否是滑块值
   // 位置距离
    chooseDistan:1,//选择内部 1：直线距离 2：行政区 // 1.集团 2.房型 3.优惠促销
    meterChooseOne:-1,
    //行政区
    areaChooseOne:-1,
    /**综合筛选*/
     //集团
    groupChooseList:[],
     //房型
    roomChooseOne:-1,
     //早餐
    breakfastChooseOne:-1,
     //优惠促销
    promotionChooseList:[],
    hotelList:[],
    calendarShow:false,
    query:{
      order_sort:0,//0=推荐排序,1=低价优先,2=高价优先,3=距离优先
      min_price:0,
      max_price:0,//最大价格(当无最大价格时传0或不传)
      star:'',//星级:3=三星级,4=四星级，5=五星级 （多个选项用逗号分隔）
      distance:'',//1=500m,2=0.5km-1km,3=1km-5km,4=5km-10km,5=10km-50km
      name:"",
      area:'',
      company:'',
      room:'',
      breakfast:'',
      is_score:0,
      is_invoice:0,
      is_gift:0,
      is_continuous:0,
      page:1,
      latitude:'',
      longitude:''
    },
    header:{
      starttime:'',
      endtime:'',
      cityid:''
    },
    is_next:false
  }) 
    this.getGlobalData()
    this.getHotelList()
  },
  /**关键字返回 */
  keyWordSeach(){
    const {defaultKeyWords} =App.globalData
    this.setData({
      query:{...this.data.query,name:defaultKeyWords},
      page:1,
      hotelList:[]
    })
    this.getHotelList()
  },
  //清除关键字
  clearKeyWord(){
    App.globalData.defaultKeyWords=''
    this.setData({
      query:{...this.data.query,name:''},
      page:1,
      hotelList:[]
    })
    this.getHotelList()
  },
  /**获取酒店列表 */
  getHotelList(){
    const {header,query:data,hotelList} = this.data
    request({url:api.index.hotelList,data,header}).then(res=>{
      this.setData({
        hotelList:[...res.data.list,...hotelList],
        is_next:res.data.is_next
      })
    })
  },
  //下拉框切换状态
  showSort(e){
    let {index} = e.currentTarget.dataset
    const {query,isSilderPrice} = this.data
   
    let { is_score,
      is_invoice,
      is_gift,
      is_continuous,min_price,max_price} =query
      //价格
      let silderValue=[]
      if(isSilderPrice==-1){
        max_price=max_price?max_price:1000
        silderValue=[min_price,max_price]
      }else {
        silderValue=[0,1000]
      }
      //综合筛选-优惠促销
      const promotionChooseList=[]
      is_score&&promotionChooseList.push(1)
      is_invoice&&promotionChooseList.push(2)
      is_gift&&promotionChooseList.push(3)
      is_continuous&&promotionChooseList.push(4)
    this.setData({
      sortNumber:index==this.data.sortNumber?-1:index,
      chooseDistan:1,
      starChooseList:query.star.length?query.star.split(',').map(Number):[],
      meterChooseOne:query.distance?query.distance:-1,
      areaChooseOne:query.area?query.area:-1,
      groupChooseList:query.company.length?query.company.split(',').map(Number):[],
      roomChooseOne:query.room?query.room:-1,
      breakfastChooseOne:query.breakfast?query.breakfast:-1,
      silderPriceChoose:isSilderPrice,
      promotionChooseList,silderValue,
    })
  },
  //推荐排序操作
  sortOne(e){
    const {type:order_sort,name} = e.currentTarget.dataset
    const sortList =this.data.sortList
    sortList[0] = name
    this.setData({
      query:{...this.data.query,order_sort,page:1},
      sortList,
      sortNumber:-1,
      hotelList:[]
    })
    this.getHotelList()
  },
/**价格/星级 */
  //双向slider
  sliderChange(e){
     const {value:silderValue} =e.detail
     const [min_price,max_price]=silderValue
    
     max_price-min_price!=0&&this.setData({
      silderValue,
      silderPriceChoose:-1
     })
   }, 
   //选择价格
   priceChoose(e){
     const {type} = e.currentTarget.dataset
     this.setData({
      silderPriceChoose:this.data.silderPriceChoose==type?-1:type,
      silderValue:[0,1000]
     })
   },
   //选择星级、集团、优惠促销
   multipleChoose(e){
    const {id,key} = e.currentTarget.dataset
    const list =this.data[key]
    const index = list.findIndex(v=>v==id)
    index==-1?list.push(id):list.splice(index,1)
    this.setData({
      [key]:list
    })
   },
   /**位置距离-直线距离-行政区/综合筛选 集团 */
   chooseHotelOne(e){
    const {id,key} = e.currentTarget.dataset
    this.setData({
      [key]:this.data[key]==id?-1:id
    })
   },

   //完成
   goSearchHotel(e){
     const {type} = e.currentTarget.dataset
     const {silderPriceChoose,starChooseList,silderValue,meterChooseOne,areaChooseOne,groupChooseList,roomChooseOne,breakfastChooseOne,promotionChooseList,query}=this.data
     //价格/星级
     if(type==1){
      let [min_price,max_price] = silderValue
      let isSilderPrice = -1
      if(silderPriceChoose==-1){
        //如果右滑块没有滑动 默认是min_price以上
         if(max_price==1000){
           max_price=0
         } 
      }else {
        switch (silderPriceChoose){
          case 0:
            min_price=500
            max_price=0
            break;
          case 1:
            min_price=500
            max_price=800
            break;
          case 2:
              min_price=800
              max_price=1000
              break;
          case 3:
              min_price=1000
              max_price=0
              break;
        }
        isSilderPrice=silderPriceChoose
      }
       const star = starChooseList.join(',')
       this.setData({
         query:{...query,min_price,max_price,star},
         isSilderPrice
       })
     }
     //位置距离
     else if(type==2){
       const distance=meterChooseOne!=-1?meterChooseOne:''
       const area=areaChooseOne!=-1?areaChooseOne:''
       this.setData({
        query:{...query,distance,area}
      })
     }
     //综合筛选
     else {
        const room =roomChooseOne!=-1?roomChooseOne:''
        const breakfast =breakfastChooseOne!=-1?breakfastChooseOne:''
        const company = groupChooseList.join(',')
        const is_score = promotionChooseList.includes(1)?1:0
        const is_invoice = promotionChooseList.includes(2)?1:0
        const is_gift = promotionChooseList.includes(3)?1:0
        const is_continuous = promotionChooseList.includes(4)?1:0
        this.setData({
          query:{...query,room,breakfast,company,is_score,is_invoice,is_gift,is_continuous}
        })
     }
     this.setData({
      sortNumber:-1,
      query:{...this.data.query,page:1},
      hotelList:[]
     })
     this.getHotelList()
   },
   //重置
   resetSearchHotel(e){
    const {type} = e.currentTarget.dataset
    if(type==1){
      this.setData({
        silderValue:[0,1000],
        silderPriceChoose:-1,
        starChooseList:[]
      })
    }else if(type==2){
      this.setData({
        meterChooseOne:-1,
        areaChooseOne:-1
      })
    }else {
      this.setData({
        roomChooseOne:-1,
        breakfastChooseOne:-1,
        groupChooseList:[],
        promotionChooseList:[]
      })
    }
   },
   
  distanChange(e){
    this.setData({
      chooseDistan:e.currentTarget.dataset.choose
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
    //相同时间不调用接口
   let {starttime,endtime} =this.data.header
   let {defaultDate} = App.globalData
   let [chooseStart,chooseEnd] =defaultDate
   starttime=starttime.replace(/-/g,"")
   endtime=endtime.replace(/-/g,"")
   if((utils.formatTime3(chooseStart)-starttime)||(utils.formatTime3(chooseEnd)-endtime)){
     this.setData({
       query:{...this.data.query,page:1},
       hotelList:[]
     })
    this.getGlobalData()
    this.getHotelList()
   }
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
      this.getHotelList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})