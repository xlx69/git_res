var app = getApp();
Page({

  data: {
    state:app.globalData.state,
    user_id:app.globalData.user_id
  },
  // 数据提交
  mysubmit:function(e){
    let that = this
    if(!e.detail.value.username || !e.detail.value.phone || !e.detail.value.email){
      wx.showModal({
        title: '格式错误',
        content: '信息填写不全',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
          } 
        }
      })
    }
    else{
    console.log(e.detail.value)
    wx.request({
      url: app.globalData.url+'register',
      method: 'POST',
      data:{
        username: e.detail.value.username,
        phone: e.detail.value.phone,
        email: e.detail.value.email,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('注册返回的是',res.data),
        app.globalData.user_id = res.data.user_id
        app.globalData.state = res.data.state
    
        if (res.data.status){
          wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
          })
        }
          else{
            wx.showToast({
              title: '提交失败',
              icon: 'error',
              duration: 2000
            })
          }
        }
      })
    }
  },
  back:function(){
    wx.navigateBack({
      url: '../my/my',
    })
  },
})