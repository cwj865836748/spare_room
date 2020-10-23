// components/cityPicker/cityPicker.js
const App =getApp()
import api from '../../request/api.js'
import {request} from '../../request/index.js' 
var QQMapWX = require('../../plugin/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk= new QQMapWX({
  key: App.globalData.qqKey
});
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addressChooseShow:{
      type:Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    columns:[],
    addressChooseShow:false
  },
  attached(){
    this.getInit()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInit(){
      this.getAll().then(province=>{
        this.getCityIdSearch(province[0].id).then(city=>{
          this.getCityIdSearch(city[0].id).then(country=>{
            let columns =[{
              values:province
           },{
             values:city,
             defaultIndex:0
          },{
           values:country,
           defaultIndex:0
        }]
          this.setData({
           columns
          })
          })
        })
      })
    },
    getAll(){
      return new Promise((resolve,reject)=>{
        qqmapsdk.getCityList({
          success: function(res) {//成功后的回调
            resolve(res.result[0])
          },
          fail: function(error) {
            reject(error)
          }
        });
      })
    },
    getCityIdSearch(id){
      return new Promise((resolve,reject)=>{

      qqmapsdk.getDistrictByCityId({
        // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
        id, 
        success: function(res) {//成功后的回调
          resolve(res.result[0])
        },
        fail: function(error) {
          reject(error);
        },
      });
    })
    },
    onChange(e){
      const{picker,index,value} = e.detail
      if(index==0){
     this.getCityIdSearch(value[0].id).then(city=>{
      this.getCityIdSearch(city[0].id).then(country=>{
        picker.setColumnValues(1,city)
        picker.setColumnValues(2,country)
      })
     }) 
    }else if(index==1) {
      this.getCityIdSearch(value[1].id).then(country=>{
        picker.setColumnValues(2,country)
       })
    }
    },
    confirm(e){
      const {value} = e.detail
      let pages = getCurrentPages()
      let prevpage = pages[pages.length - 1]
      const province=value[0].fullname//省份,
      const city=value[1].fullname//城市
      const county=value[2].fullname//地区
      prevpage.setData({
        address:{...prevpage.data.address,province,city,county}
      })
      this.cancel()
    },
    cancel(){
       this.setData({
        addressChooseShow
        :false
       })
    }
  }
})
