var app = getApp();
var value = '';
var hostList=[];
Page({
  data:{
    userinfo:'',//#存储个人详细信息
    username:'',//这里是被评分人的名字，
    userName:'',//存放返回搜索名字的列表
    resultList:[],//存放最后搜索返回的结果
    score_id:'',//当前登陆用户的user_id
    bescore_id:'',//被评分人的ID，也就是被点击者
    theme_id:'',//主题的ID号
    grade:''  //这个grade直接为登陆者的，改为describ，暂时没用
  },
  
  onLoad: function (options) {
    var that = this
    console.log(options)
    console.log('detail里面的username',options.username)
    console.log('detail里面的user_id',options.bescore_id)
    console.log('detail里面的theme_id',options.theme_id)
    that.setData({
      username:options.username,
      bescore_id:options.bescore_id,
      theme_id:options.theme_id,
      })

      wx.request({
        url: app.globalData.url+'detail',
        method: 'POST',
        data:{
          bescore_id:that.data.bescore_id,
          theme_id:that.data.theme_id,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log('detail页页展示信息：',res.data.userinfo)
          that.data.userinfo=res.data.userinfo
          for(var i of that.data.userinfo){
            if (i.anonymous == "True"){
              i.username = '匿名'
            }
          }
          that.setData({
            userinfo:that.data.userinfo,
          }) 
          that.setData({
            username:that.data.username
          })
          console.log(i.username)
        }
      })

      wx.setNavigationBarTitle({
        title:that.data.username
      })
    },
        
 detail(e){
  var index = e.currentTarget.dataset.index
      // 权限必须是最高级才能查看详细   
      if(app.globalData.grade == '管理员' || app.globalData.grade == '教师')//设置查看权限
      {     
        var index = e.currentTarget.dataset.index
        wx.navigateTo({
          url:'../bescoreDetail/bescoreDetail?username='+this.data.userinfo[index].username + "&score_id=" + this.data.userinfo[index].score_id + "&theme_id=" + this.data.userinfo[index].theme_id + "&bescore_id=" + this.data.bescore_id})
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