const app = getApp();
Page({

  data: {
    state: app.globalData.state,
    user_id: app.globalData.user_id,
    userTypeList: ['本科生','研究生','教师','管理员'],
    userTypeIndex: 0,
    selectUsertype:'本科生',//默认都是本科生，不更改就不会触发更改此数据
    passwordState:false
  },
  // 数据提交
  mysubmit: function (e) {
    let that = this
    if (!e.detail.value.username || !e.detail.value.phone || !e.detail.value.email) {
      wx.showModal({
        title: '格式错误',
        content: '信息填写不全',
        showCancel: false,
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            console.log('用户点击确定')
          }
        }
      })
    } 
    else {
      console.log('传到后端的数据',e.detail.value,that.data.selectUsertype)
      
      wx.request({
        url: app.globalData.url + 'register',
        method: 'POST',
        data: {
          username: e.detail.value.username,
          phone: e.detail.value.phone,
          email: e.detail.value.email,
          openid: app.globalData.openid,
          user_type: that.data.selectUsertype,
          password:e.detail.value.password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log('注册返回的是', res.data)
          if (res.data.state) 
          {
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 500
                })   
              app.globalData.user_id = res.data.user_id    //立刻刷新身份动态
              console.log('user_id注册后的值',app.globalData.user_id)
              setTimeout(function(){
                that.back()
              }, 500);
          } 
          else {
            wx.showToast({
              title: '提交失败',
              icon: 'error',
              duration: 1000
            })
          }
        }
      })
    }
  },
  back: function () {
    wx.navigateBack({
      url: '../my/my',  
    })
  },
//更改用户类型
  changeuserType(e){
    var that = this
    console.log('选择用户类型',e.detail.value,this.data.userTypeList[e.detail.value])
    this.setData({ 
      userTypeIndex: e.detail.value,
      selectUsertype: this.data.userTypeList[e.detail.value],
    });
    app.globalData.grade = this.data.userTypeList[e.detail.value]   //解决登录后不能识别身份的bug
    if (e.detail.value,this.data.userTypeList[e.detail.value] == '管理员'){
      that.setData({
        passwordState:true
      })
    }
    else{
      that.setData({
        passwordState:false
      })
    }
  },
})