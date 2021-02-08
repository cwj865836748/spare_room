 const api = {
  authorization: {
    login:  '/api/index/login',
    getUserPhone: '/api/index/get-user-phone',
    codeLogin:'/api/index/code-login',
    userBind:'/api/user/bind'
  },
   index: {
     //加载轮播图
    advert:'/api/index/advert',
     //加载公告
    notice:'/api/index/notice',
    //公告详情
    noticeDetail:'/api/index/notice-detail',
    hotelList:'/api/index/index',
    hotKeyword:'/api/index/hot-keyword',
    area:'/api/index/area',
    company:'/api/company/index',
    room:'/api/room/index',
    freeze:'/api/user/freeze'
   },
   mine: {
    index:'/api/user/index',
    feedbackAdd:'/api/feedback/add',
    equityLists:'/api/equity/lists',
    scoreLists:'/api/user/score-lists'
   },
   demand: {
    demandLists:'/api/demand/lists',
    demandDetail:'/api/demand/detail',
    demandDel:'/api/demand/del',
    demandAdd:'/api/demand/add',
    search:'/api/hotel/search',
    roomIndex:'/api/room/index'
   },
   collection:{
    collectionLists:'/api/collection/lists',
    collectionDel:'/api/collection/del',
    collectionAdd:'/api/collection/add',
    collectionCancel:'/api/collection/cancel'
   },
   moneyLog:{
    index:'/api/money-log/index',
    detailList:'/api/money-log/detail-list',
    moneyLogLists:'/api/money-log/lists',
    todayLists:'/api/money-log/today-lists',
    commission:'/api/money-log/commission',
    withdraw:'/api/money-log/withdraw',
    withdrawed:'/api/money-log/withdrawed',
    withdrawAdd:'/api/withdraw/add',
    friendList:'/api/money-log/friend'
   },
   coupon:{
     index:'/api/coupon/index',
     unuse:'/api/coupon/unuse'
   },
   upload:{
    upload:'/api/common/upload',
    sendCode:'/api/index/send-code'
   },
   config:{
    vipRule:'/api/config/vip-rule',
    scoreRule:'/api/config/score-rule',
    vips:'/api/config/vips',
    cityList:'/api/config/city',
    hotcity:'/api/config/hotcity',
    cityConversion:'/api/config/city-conversion',
    province:'/api/config/province',
    depositRule:'/api/config/deposit-rule',
    customerService:'/api/config/customer-service',
    customerPrivacy:'/api/config/customer-privacy',
    customerInstructions:'/api/config/customer-instructions',
    earn:'/api/config/earn'
   },
   hotel:{
    index:'/api/hotel/index',
    slideshow:'/api/hotel/slideshow',
    picture:'/api/hotel/picture',
    hotelFacilities:'/api/hotel/hotel-facilities',
    near:'/api/hotel/near',
    room:'/api/hotel/room',
    roomFacilities:'/api/hotel/room-facilities',
    keyWordSearch:'/api/hotel/associate'
   },
   order:{
    reservation:'/api/hotel/reservation',  
    fee:'/api/hotel/fee',  
    orderAdd:'/api/order/add',  
    urged:'/api/order/urged'
   },
   orderDetail:{
     cancel:'/api/order/cancel',
     userCancel:'/api/order/user-cancel',
     appeal:'/api/order/appeal',
     appealDetail:'/api/order/appeal-detail',
     appealDetailPlatform:'/api/order/appeal-platform',
     comment:'/api/order/comment',
     progress:'/api/order/progress',
     orderLists:'/api/order/lists',
     orderDetail:'/api/order/detail',
     userDelete:'/api/order/userDelete',
     payOrder:'/api/order/payOrder'
   }
};
module.exports = api;