App({
  globalData:{
    userInfo: null,
    openid:'',
    user_id:'',//这个userID是登录者的
    state:'',
    grade:'',
    url:"http://8.142.74.201:3355/"
  },
denglu:function(){
  var that = this
  return new Promise((resolve)=>{
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log("code",res.code)
      wx.request({
        url: that.globalData.url, //仅为示例，并非真实的接口地址
        method: 'post',
        data: {
          code: res.code
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:res => {
          that.globalData.openid = res.data.openid
          that.globalData.state = res.data.state
          that.globalData.user_id = res.data.user_id
          that.globalData.grade = res.data.grade
          console.log('登陆者的openid',that.globalData.openid)
          console.log('登陆者注册状态state', that.globalData.state)
          console.log('这是全局变量目前登录人的user_id',that.globalData.user_id)
          console.log('登陆者注册状态grade', that.globalData.grade)
          resolve(res.data.user_id)
          }
        })
      }
    })
  })
 
},
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    // that.denglu()
  },
})
