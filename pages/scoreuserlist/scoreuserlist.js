var app = getApp();
Page({
  data: {
    scoreTheme:'',
    theme_id:'',
    userList:'',
  },
  onShow:function(){
    var that = this
    wx.request({
      url: app.globalData.url+'bescoreList',
      method: 'POST',
      data:{
        theme_id:that.data.theme_id,
        score_id:app.globalData.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('被评分人展示：',res.data.bescoreList)
        that.setData({
          userList:res.data.bescoreList
        })
        console.log('检查存储的数据',that.data.userList)
      }  
    })
    setTimeout(function(){
      if (!that.data.userList) {
          that.showModal()
      }
    }, 500);
  },
  onLoad: function (options){
    var that = this
    this.setData({
        scoreTheme: options.scoreTheme,//更改导航栏为coreTheme
        theme_id:options.theme_id,//记录对应的主题ID用来去后端查询
    })
    wx.setNavigationBarTitle({
      title:that.data.scoreTheme
    })
  },
  toScore :function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    console.log('点击的是第几个',index+1,'名字为',this.data.userList[index].username,'bescore_id为',this.data.userList[index].bescore_id)
    wx.navigateTo({
      url: '../score/score1/score1?scoreTheme='+this.data.scoreTheme + "&theme_id=" +this.data.theme_id + "&username=" +this.data.userList[index].username + "&bescore_id=" +this.data.userList[index].bescore_id
      })
  },
  showModal:function(e) {
    wx.showModal({
      title: '评分错误',
      content: '您不是本主题评委！',
      showCancel: false,
      success: function (res) {
      if (res.confirm) { //这里是点击了确定以后
        console.log('用户点击确定')
        wx.navigateBack({
          url: '../index/index'
        })
        }
      }
    })
  }
})