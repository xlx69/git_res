var app = getApp();

Page({
  data:{
    userinfo:[],
    openid2:'',
    user_id:'',
    state:app.globalData.state
  },  
  onShow:function(){
    var that = this
    that.setData({
      user_id:app.globalData.user_id
    })
       
    wx.request({
      url: app.globalData.url+'showdata',
      method: 'POST',
      data:{
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      
      success (res) {
        console.log('封面展示信息：',res.data.userinfo)
        that.setData({
          userinfo:res.data.userinfo,
          state:res.data.state,
          
        })
        
      }
      
    })
    
  },
  onLoad: function (options) {
    var that = this
    app.denglu().then(res=>{
      console.log('',res)
      that.setData({
        user_id:res
      })
    })
  
  },
  detail(e){
    var index = e.currentTarget.dataset.index
    if(!app.globalData.state){
      wx.showModal({
        title: '请补充信息',
        content: '先登录再补充信息',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../regist/regist',
            })
          } 
        }
      })
    }
    // 权限必须是最高级才能查看详细
    else if(this.data.userinfo[index].user_id == app.globalData.user_id || app.globalData.grade > 1)
    {     
      var index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../detail/detail?username='+this.data.userinfo[index].username + "&user_id=" +this.data.userinfo[index].user_id 
        })
    }
    else
    { 
      wx.showModal({       
        title: '权限提示',
        content: '您的权限过低',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
          console.log('用户点击确定')
          }
        }
      })
    }

  }
})
