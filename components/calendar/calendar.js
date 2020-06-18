// components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    calendarShow: {
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
      if (day.type === 'start') {
        day.bottomInfo = '入住';
      } else if (day.type === 'end') {
        day.bottomInfo = '离店';
      }
      return day;
    },
  },
  attached(){
  },

  /**
   * 组件的方法列表
   */
  methods: {
   
    onClose() {
      this.triggerEvent("closeCalendar")
      this.setData({
        defaultDate:this.data.defaultDate
      })
    },
    formatDate(date) {
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}`;
    },
    onConfirm(event) {
      const [start, end] = event.detail;
      const date= `${this.formatDate(start)} - ${this.formatDate(end)}`
      this.onClose()
      this.setData({
        defaultDate:['2020.6.10','2020.6.20']
      })
    },
  }
})
