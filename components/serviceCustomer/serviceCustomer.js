// components/serviceCustomer/serviceCustomer.js
import {getSystemInfo} from "../../utils/wx.js"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
   x:{
     type:Number,
     value:0
   },
   y:{
    type:Number,
    value:0
  }
  },
  
  /**
   * 组件的初始数据
   */
 
  data: {
    x: 0,
    y: 0,
    windowWidth:null,
    windowHeight:null
  },
  attached(){
    getSystemInfo().then(res=>{
      const {windowWidth,windowHeight} =res
      const x = windowWidth-15
      const y = windowHeight-133
      this.setData({
        windowWidth,windowHeight,x,y
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
   
  }
})
