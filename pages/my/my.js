const app = getApp()
Page({  
  data: {
    userInfo:'',
    score:'',
    prade:'',
    user_id:''
  },
  onLoad(){
    let user = wx.getStorageSync('user')
    this.setData({
      userInfo: user
    })
  },
  login() {  //这是最简单的写法
    wx.getUserProfile({
      desc: '用于识别用户身份',
      success :res => {
        let user = res.userInfo
        wx.setStorageSync('user', user)//存缓存
        console.log('授权成功',res.userInfo)
        console.log('用户名',res.userInfo.nickName)
        this.setData({
          userInfo: user//这个是微信小程序内置的，与后端无关
        })
      },
      fail:res =>{
        console.log('授权失败',res)
      }
    })
  },
  //退出登录
  loginOut(){
    this.setData({
      userInfo:''
    })
    wx.setStorageSync('user', null)//清缓存
  },
  score(){
    wx.request({
      url: app.globalData.url+'get_score',
      method: 'POST',
      data:{
        user_id:app.globalData.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('返回的是',res.data.score)
        let score = res.data.score
        wx.showModal({
          title: '我的分数为',
          content: score+'分',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
            } else {//这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  grade(){
    wx.request({
      url: app.globalData.url+'get_grade',
      method: 'POST',
      data:{
        user_id:app.globalData.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('返回的是',res.data.grade)
        let grade = res.data.grade
        wx.showModal({
          title: '我的等级',
          content: grade+'级',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {//这里是点击了确定以后
              console.log('用户点击确定')
            }
             else {//这里是点击了取消以后
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  }
})