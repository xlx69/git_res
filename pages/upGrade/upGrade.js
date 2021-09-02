var app = getApp();
Page({
  data:{
    mast_root:'',
    up_grade:'',
  },
  up_grade:function(e){
    console.log(e.detail.value)
    const mast_root = e.detail.value.mast
    const up_grade = e.detail.value.grade
    wx.request({
      url: app.globalData.url+'up_grade',
      method: 'POST',
      data:{
        user_id:app.globalData.user_id,
        mast_root:mast_root,
        up_grade:up_grade
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