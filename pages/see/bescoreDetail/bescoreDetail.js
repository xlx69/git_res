var app = getApp();
Page({
  data:{
    userinfo:'',//#存储个人详细信息
    username:'',//这里是被评分人的名字，
    score_id:'',//当前登陆用户的user_id
    bescore_id:'',//被评分人的ID，也就是被点击者
    theme_id:'',//主题的ID号
    grade:''  //这个grade直接为登陆者的，改为describ，暂时没用
  },
  
  onLoad: function (options) {
    var that = this 
    console.log(options)
    console.log('详细里面的username',options.username)
    console.log('详细里面的score_id',options.score_id)
    console.log('详细里面的bescore_id',options.bescore_id)
    console.log('详细里面的theme_id',options.theme_id)
    that.setData({
      username:options.username,
      score_id:options.score_id,
      bescore_id:options.bescore_id,
      theme_id:options.theme_id,
      })
      wx.request({
        url: app.globalData.url+'bescoreDetail',
        method: 'POST',
        data:{
          bescore_id:that.data.bescore_id,
          score_id:that.data.score_id,
          theme_id:that.data.theme_id,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log('detail页页展示信息：',res.data.userinfo)
          that.setData({
            userinfo:res.data.userinfo,
            state:res.data.state,
            
          }) 
        }
      })
      wx.setNavigationBarTitle({
        title:that.data.username
      })
  },
})