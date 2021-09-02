var app = getApp();
Page({
  data:{
    userinfo:'',//#存储个人详细信息
    username:'',//这里是被评分人的名字，
    user_id:'',//这个为首页点击的项目
    grade:''  //这个grade直接为登陆者的
  },
  
  onLoad: function (options) {
    var that = this 
    console.log('detail里面的',options.username)
    console.log('detail里面的',options.user_id)
    that.setData({
      username:options.username,
      user_id:options.user_id ,
      grade:app.globalData.grade
      })

      wx.request({
        url: app.globalData.url+'detail',
        method: 'POST',
        data:{
          user_id:this.data.user_id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        
        success (res) {
          console.log('个人详情页展示信息：',res.data.userinfo)
          that.setData({
            userinfo:res.data.userinfo,
            state:res.data.state,
            
          })
          
        }
        
      })
  },

  tiaozhuan(e){
    if(!app.globalData.state){
      wx.showModal({
        title: '请补充信息',
        content: '先登录再补充信息',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
                console.log('用户点击确定')
                wx.navigateTo({
                    url: '../regist/regist',
                 })
               } 
          else {//这里是点击了取消以后
            console.log('用户点击取消')
            return
          }
        }
      })
    }
    else{
      wx.navigateTo({
        url: '../pingfen/pingfen?username='+this.data.username  + "&user_id=" +this.data.user_id 
      })
    }
  }
})