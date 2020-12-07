/**
 * 调用接口获取登录凭证（code）
 */
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
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
 * 获取权限
 * @param {*} scope 
 * 需要获取权限的 scope
 * scope.userInfo	wx.getUserInfo	用户信息
 * scope.userLocation	wx.getLocation, wx.chooseLocation	地理位置
 * scope.userLocationBackground	wx.startLocationUpdateBackground	后台定位
 * scope.address	wx.chooseAddress	通讯地址（已取消授权，可以直接调用对应接口）
 * scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头（已取消授权，可以直接调用对应接口）
 * scope.invoice	wx.chooseInvoice	获取发票（已取消授权，可以直接调用对应接口）
 * scope.werun	wx.getWeRunData	微信运动步数
 * scope.record	wx.startRecord	录音功能
 * scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
 * scope.camera	camera 组件	摄像头
授权有效期
 */
export const authorize = (scope) => {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope,
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
 * 获取系统信息(wx.getSystemInfoSync() 为同步版本)
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
 * 调起客户端小程序设置界面
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
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
 * 获取用户的当前设置的权限
 */
export const getSetting = () => {
  return new Promise((resolve, reject) => {
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
 * 显示消息提示框
 * @param {*} Object
 * title：标题
 * content：内容
 */
export const showModal = (Object) => {
  //title,content.....
  return new Promise((resolve, reject) => {
    wx.showModal({
      ...Object,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}


/**
 * 显示消息提示框
 * @param {*} Object
 * title：提示的内容
 * icon：图标
 * duration：	提示的延迟时间
 * mask：是否显示透明蒙层，防止触摸穿透
 */
export const showToast = (Object) => {
  //title,icon,duration,image
  return new Promise((resolve, reject) => {
    wx.showToast({
      icon: 'none',
      duration: 2000,
      ...Object,

      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/**
 * 获取当前的地理位置
 * @param {*} type 
 * type：wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
 */
export const getLocation = (type = 'wgs84') => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/**
 * 打开地图选择位置。
 * @param {*} location
 * latitude，longitude
 */
export const chooseAddress = (location) => {
  return new Promise((resolve, reject) => {
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
 * 打开地图
 * @param {*} location 
 * latitude：经度
 * longitude：纬度
 * scale：缩放比例
 * name：位置名
 * address：地址的详细说明
 */
export const openLocation = (location) => {
  //latitude,longitude,scale,name,address
  return new Promise((resolve, reject) => {
    wx.openLocation({
      ...location,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}



/**
 * 支付
 * @param {*} pay 
 * timeStamp：时间戳
 * nonceStr：随机字符串
 * package：统一下单接口返回的 prepay_id 参数值
 * signType：签名算法
 * paySign：签名，具体见微信支付文档
 */
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
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
 * 
 * @param {*} url 
 *  url:跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
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
 * 
 * @param {*} url 
 * url:保留当前页面，跳转到应用内的某个页面
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
 * 返回上一页面
 * @param {*} delta 
 * delta:返回的页面数
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
 * 动态设置当前页面的标题
 * @param {*} title
 * title:页面标题
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
 * 获取用户信息。
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
/**
 * 页面滚动到目标位置
 * @param {*} object 
 * scrollTop:滚动到页面的目标位置，单位 px
 * duration:滚动动画的时长，单位 ms
 * selector:选择器
 */
export const pageScrollTo = (object) => {
  return new Promise((resolve, reject) => {
    wx.pageScrollTo({
      scrollTop: 0,
      ...object,
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
 * 下载资源
 * url:下载资源的 url
 * header:请求头
 * filePath：指定文件下载后存储的路径 (本地路径)
 */
export const downloadFile = (object) => {
  //url,header,timeout，filePath
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      timeout: 5000,
      ...object,
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
 * 上传图片
 * @param {*} object 
 * url:接口地址
 * name:文件对应的 key
 * filePath：要上传文件资源的路径 (本地路径)
 * formData: {
            files: *** 文件路径
             }
 */
export const uploadFile = (object) => {
  //url,header,timeout，filePath，formData
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      timeout: 5000,
      name: 'files',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      ...object,
      success: (result) => {
        resolve(JSON.parse(result.data).data);
      },
      fail: (err) => {
        showToast({
          title: '图片上传失败',
        })
      }
    });
  })
}
/**
 * 预览图片
 * @param {*} object 
 * urls（Array）：需要预览的图片链接列表
 * current： urls 的第一张
 */
export const previewImage = (object) => {
  //urls,current
  return new Promise((resolve, reject) => {
    wx.previewImage({
      ...object,
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
 * 选择图片
 * @param {*} object 
 * count 最多可以选择的图片张数
 */
export const chooseImage = (object) => {
  
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: object.count, // 默认
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      ...object,
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
 * 保存图片
 * @param {*} filePath 
 * filePath：图片路径
 */
export const saveImageToPhotosAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({ 
      filePath,
      success: () => {
        showToast({
          title: "保存成功",
          icon: "success",
        })
      },
      fail: (err) => {
        getSetting().then(setting => {
          if (!setting.authSetting['scope.writePhotosAlbum']) {
            const scope='scope.writePhotosAlbum'
            return authorize(scope)
          } else {
            saveImageToPhotosAlbum(filePath)
          }
        }).then(()=>{
          saveImageToPhotosAlbum(filePath)
        }).catch(()=>{
          showModal({
            title: '请求访问本地相册',
            content: '检测到您没打开此小程序的相册权限，是否去设置打开'
          }).then(confirm => {
            if (confirm.cancel) {
              return showToast({
                title: '拒绝授权'
              })
            }
             return openSetting()
          }).then(res => {
            if (!res.authSetting["scope.writePhotosAlbum"]) {
              return showToast({
                title: '授权失败'
              })
            }
            saveImageToPhotosAlbum(filePath)
          })
        })
      }
    })
  })
}
/**
 * 获取图片信息
 * @param {*} filePath 
 * src:图片路径
 */
export const getImageInfo=(src)=>{
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}