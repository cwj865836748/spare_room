// components/calendar/calendar.js
const App=getApp()
var utils = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    calendarShow: {
      type: Boolean,  
      value: false
    },
    isEditRequire: {
      type: Boolean,  
      value: false
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultDate:[],
     formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      const nowMonth = new Date().getMonth() + 1
      const nowDate = new Date().getDate()
      if (day.type === 'start') {
        day.bottomInfo = '入住';
      } else if (day.type === 'end') {
        day.bottomInfo = '离店';
      }
      if(month==nowMonth&&date==nowDate){
        day.text = '今天'
      }
      return day;
    },
  },
  attached(){
   
    
  },
  observers:{
     'calendarShow'(value){
      value&&this.setData({
        defaultDate:App.globalData.defaultDate
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.triggerEvent("closeCalendar")
    },
    onConfirm(event) {
      let [start, end] = event.detail;
      start=new Date(start).getTime()
      end=new Date(end).getTime()
      //如果是发布需求可以选择日期
      if(this.properties.isEditRequire){
        start=utils.formatTime2(start)
        end=utils.formatTime2(end)
        this.triggerEvent('setRequireTime',{start,end})
      }else {
        //正常选择日期改变全局变量
        App.globalData.defaultDate=[start,end]
        this.setData({
          defaultDate:[start,end]
        })
      }
      this.onClose()
    },
    preventTouchMove(){
      return
    }
  }
})
