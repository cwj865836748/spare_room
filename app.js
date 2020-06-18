//app.js
import {getSystemInfo} from './utils/wx.js'

App({
  globalData: {
    qqKey:'ZBRBZ-E4WC2-HA3UF-CMQPB-QKR6E-5OFVJ'
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //获取导航栏数据
    this.getNavBar()
  },
   /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },
  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },
    /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  getNavBar(){
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();//获取胶囊按钮信息
    getSystemInfo().then(res=>{
    let statusBarHeight = res.statusBarHeight//状态栏高度
    let navHeight=0
    //机型适配 如果获取不到胶囊按钮信息手动赋值
    if(menuButtonObject){
      let navTop = menuButtonObject.top//胶囊按钮与最顶部的距离
       navHeight = statusBarHeight + menuButtonObject.height + (navTop - statusBarHeight)*2 //导航高度
    }else{
      navHeight=(res.system.indexOf('iOS') > -1?44:48)+statusBarHeight
    }
    let navBar={
      navHeight,
      statusBarHeight
    }
    this.globalData.navBar= navBar
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(navBar)
    }
  }).catch(err=>{
    console.log(err)
  })
  }
  
})