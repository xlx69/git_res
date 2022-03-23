const app = getApp();
Page({
  data: {
    userInfo: '',
    score: '',
    prade: '',
    user_id: '',
    access_token: '',
    grade: app.globalData.grade,
    openid:app.globalData.openid
  },
  onShow() {
    var grade = wx.getStorageSync('grade')
    this.setData({
      grade: grade
    })
    console.log('测试输出', this.data.grade)
  },
  onLoad() {
    let user = wx.getStorageSync('user')
    this.setData({
      userInfo: user,
    })
    console.log('openId的值：',app.globalData.openid)
    this.getAccess_token();
  },
// 获取订阅
getAccess_token(){
  const that = this;
  const appid = "wxf14a4c610f2a8141" // 这里填写你的appid
  const secret = "dbef4fdf11e4156be92b468e7179c45d" // 这里填写你的secret
  
  wx.request({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`, 
    header: {
      'content-type': 'application/json' 
    },
    success(res) {
      that.setData({
        access_token: res.data.access_token
      })
    },
    fail(error){
      console.log(error)
    }
  })
},

  login() {  //这是最简单的写法
    var that = this
    wx.getUserProfile({
      desc: '用于识别用户身份',
      success: res => {
        let user = res.userInfo
        wx.setStorageSync('user', user)//存缓存
        console.log('授权成功', res.userInfo)
        if (app.globalData.user_id != 0) {
          this.setData({
            userInfo: user
          })
        }
        console.log('app.globalData.openid', app.globalData.openid)
        wx.request({
          url: app.globalData.url + 'isRgist',
          method: 'POST',
          data: {
            user_id: app.globalData.user_id,
            open_id: app.globalData.openid
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            console.log('返回的是', res.data.state)
            let state = res.data.state
            if (state) {
              wx.showToast({
                title: '授权登陆成功',
                icon: 'success',
                duration: 1000
              })
            }
            else {
              wx.showModal({
                title: '注册提示',
                content: '您还未注册，是否注册',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../regist/regist'
                    })
                  }
                  else {
                    that.loginOut()
                  }
                }
              })
            }
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '授权登陆失败',
          icon: 'error',
          duration: 1000
        })
        console.log('授权失败', res)
      }
    })
  },
  //退出登录
  loginOut() {
    this.setData({
      userInfo: ''
    })
    wx.removeStorageSync('user')
    wx.removeStorageSync('grade')
  },
  updateInfomation() {
    wx.navigateTo({
      url: '../regist/regist',
    })
  },
  release() {
    wx.navigateTo({
      url: '../release/release'
    })
  },
  myRelease() {
    wx.navigateTo({
      url: '../myRelease/myRelease'
    })
  },
  template() {
    wx.navigateTo({
      url: '../template/template',
    })
  },
   // 点击现实是否订阅消息
  Subscribe() {
    const that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['Q1f8JVdWF6akTaqInKLnin74IGv-62d2syXKNMDhpzA'],
      success(res) {
          if(res.errMsg === 'requestSubscribeMessage:ok'){
              that.sendMessage();
          }
      },
      fail(error) {
        console.log(error)
      }
    })
  },
 // 发送消息
 sendMessage(){
  const access_token = this.data.access_token;
  // const openId = "xxxxxxxxxxxxxxxxxxxxxxx" // 这里填写你的 用户openId

  wx.request({
    url: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`, //仅为示例，并非真实的接口地址
    data: {
      "touser": app.globalData.openid,
      "template_id": "Q1f8JVdWF6akTaqInKLnin74IGv-62d2syXKNMDhpzA",
      "data": {
        "thing1": {
            "value": 'title'
        },
        "date2": {
            "value": "2020/03/12"

        },
        "time3": {
            "value": "2020/03/16"

        }
    }
    },
    method: 'post',
    header: { 'Content-Type': 'application/json' },
    success(res) {
      console.log("res",res)
    },
    fail(error){
      console.log("error",error)
    }
  })
}

})