
/**
 * promise 形式  login
 */
export const login=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 * promise 形式  getSystemInfo设备信息
 */
export const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/**
 * promise 形式  openSetting获取授权配置
 */
export const openSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 * promise 形式  getSetting获取授权信息
 */
export const getSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 *  promise 形式  showModal
 * @param {object} param0 参数
 */
export const showModal=({title,content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: title,
      content: content,
      success :(res) =>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}


/**
 *  promise 形式  showToast
 * @param {object} param0 参数
 */
export const showToast=(Object)=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      icon: 'none',
      duration:2000,
      ...Object,
    
      success :(res) =>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
/**
 *  promise 形式  getLocation获取经纬度
 * @param {object} param0 参数
 */
export const getLocation=(type='wgs84')=>{
  return new Promise((resolve,reject)=>{
    wx.getLocation({
      type,
      success :(res) =>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
/**
 * promise 形式  chooseAddress
 */
export const chooseAddress=(location)=>{
  //latitude,longitude
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      ...location,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 *  promise 形式  openLocation打开地图
 * @param {object} param0 参数
 */
export const openLocation=(location)=>{
  //latitude,longitude,scale,name,address
  return new Promise((resolve,reject)=>{
    wx.openLocation({
         ...location,
      success :(res) =>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}



/**
 * promise 形式的 小程序的微信支付
 * @param {object} pay 支付所必要的参数
 */
export const requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
   wx.requestPayment({
      ...pay,
     success: (result) => {
      resolve(result)
     },
     fail: (err) => {
       reject(err);
     }
   });
     
  })
}
/**
 * promise 形式  switchTab 跳转至tabbar页面
 */
export const switchTab = (url) => {
  return new Promise((resolve, reject) => {
    wx.switchTab({
      url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 * promise 形式  navigateTo 跳转页面
 */
export const navigateTo = (url) => {
  return new Promise((resolve, reject) => {
    wx.navigateTo({
      url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 * promise 形式  navigateBack 返回
 */
export const navigateBack = (delta) => {
  return new Promise((resolve, reject) => {
    wx.navigateBack({
      delta,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/**
 * promise 形式  动态设置当前导航栏标题
 */
export const setNavigationBarTitle = (title) => {
  return new Promise((resolve, reject) => {
    wx.setNavigationBarTitle({
      title,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
/**
 * promise 形式  getUserInfo
 */
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
