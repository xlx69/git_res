App({
  globalData:{
    userInfo: null,
    openid:'',//opened用来标识别用户
    user_id:'',//这个userID是登录者的,和openid一样，如果没有注册就不会有user_id。
    state:'',//标示是否注册
    grade:'',//这个最后改为用户类型，用来判断权限。
    search:[],//用来接收返回的搜索的列表
    // url:"http://127.0.0.1:5000/",
    url:"https://www.fosugd.com/wechat/",
    StorageBeScore:[],
    StorageScore:[]
  },
//调用登陆的端口，进入页面后在首页调用这个方法，且设置好函数执行的顺序。
denglu:function(){
  var that = this
  return new Promise((resolve)=>{
    //先拿到code，再去后台换取openID
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log("code",res.code)
      wx.request({
        url: that.globalData.url, //将网址全局化，方便后面更改服务器
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
          that.globalData.grade = res.data.user_type
          wx.setStorageSync('grade', res.data.user_type)
          console.log('登陆者的openid',that.globalData.openid)
          console.log('登陆者注册状态state', that.globalData.state)
          console.log('这是全局变量目前登录人的user_id',that.globalData.user_id)
          console.log('登陆者身份识别grade', that.globalData.grade)
          }
        })
      }
    })
  })
},//这个函数可能没用，后期检查能不能删除。
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
})
