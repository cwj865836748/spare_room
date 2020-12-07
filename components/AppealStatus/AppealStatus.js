// components/AppealStatus/AppealStatus.js
import api from '../../request/api.js'
import {request} from '../../request/index.js'
import {previewImage} from "../../utils/wx.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order_id:{
      type:Number,
      value:0
    },
    depositMoney:{
      type:Number,
      value:0
    }
  },
  options:{
    addGlobalClass:true
  },

  /**
   * 组件的初始数据
   */
  data: {
    isAppealShow:false,
    appealDetail:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAppealDetail(status){
      const {order_id} = this.properties
      request({url:status=='user'?api.orderDetail.appealDetail:api.orderDetail.appealDetailPlatform,data:{order_id}}).then(res=>{
       
        this.setData({
          appealDetail:res.data.info,
          isAppealShow:true
        })
        let pages = getCurrentPages()
        pages[pages.length-1].setData({
          isAppealShow:true
        })
      })
    },
    closeResult(){
      this.setData({
        isAppealShow:false
      })
      let pages = getCurrentPages()
      pages[pages.length-1].setData({
        isAppealShow:false
      })
    },
    previewImg(e){
      const {current} = e.target.dataset
      previewImage({ current,
        urls: this.data.appealDetail.img_url})
    },
    preventTouchMove(){
      return
    }
  }
})
