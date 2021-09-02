var app = getApp();
Page({
  data: {
    username:'',//这里是被评分人的名字，
    user_id:'',// 这里是被评分人的 最终要改为user_id
    score_id:app.globalData.user_id,// 这里是评分人的
    score:'',
  },
  
  onLoad: function (options) {
    console.log(options.username)
    console.log(options.user_id)
    this.setData({
      username:options.username,
      user_id:options.user_id ,
      })

  },
  mysubmit:function(e){
    let that = this
    const score1 = e.detail.value.score
    console.log(score1)
    that.setData({
      score:score1
    })
    if(!e.detail.value.score){
      //如果输入的分数为空，显然不合法
      wx.showModal({
        title: '错误提示',
        content: '请按正确格式评分',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
          }
        }
      })
    }
    if(0 > score1 || score1 > 100){
      wx.showModal({
        title: '错误提示',
        content: '请按正确格式评分',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
          }
        }
      })
    }
    else{
        wx.request({
          url: app.globalData.url+'score',
          method: 'POST',
          data:{
            username:that.data.username,
            score:that.data.score,
            user_id:that.data.user_id,
            score_id:app.globalData.user_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            console.log('后端返回的状态是',res.data.state)
            if(res.data.state){
              wx.showToast({
                title: '评分完成',
                icon: 'success',
                duration: 2000
              })
            }
            else{
              wx.showToast({
                title: '请返回补全信息',
                icon: 'error',
                duration: 2000
              })
            }
          }
        })  
    }
  }
})