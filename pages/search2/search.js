var app = getApp();
Page({
  data:{
    name:'',/*这个name应该从本地直接拿取，而不是后端返回，在else后设置为e.detail这样就可以避免message里面需要放username （已改完）*/
    score:'',
    bename:'',//这里可能到时候返回的是一个数组
    user_id:'',//这个user_id 不是 评分人的，是搜索被评分人的，最后设置名字的字段为不可重复的
    grade:app.globalData.grade  //到时候这里要改为 变量    记得记得  登陆者的grade
  },

  //输入框的值改变就会触发的事件
  //防抖，延时发送请求
  TimeId:-1,
  handleInput(e){
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
          }
        }
      })
    }
    else{
    let that = this
    //1获取输入框的值
    const {value}=e.detail;
    //检测合法性
    if(!value.trim()){
      //通过表示值不合法
      return;
    } 
    //发送请求获取数据
    clearTimeout(this.TimeId);
    /* 这里是防抖的一部分*/
    this.TimeId=setTimeout(() => {
      // this.qsearch(value);
      console.log('我是',value)
      that.setData({
        name:value
      })
          wx.request({
            url: app.globalData.url+'search',
            method: 'POST',
            data:{
              value:value,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              console.log('搜索返回返回的是',res.data)
              that.setData({
                score:res.data.score,
                user_id:res.data.user_id,//这里接收的是被评分人的user_id
                bename:res.data.bename,//还未做查询，无结果返回
              })  
              // 这里应该还要加一个功能，如果查无此人要有提示。
            }
          })
    },1500);
    }
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
        url: '../pingfen/pingfen?username='+this.data.name  + "&user_id=" +this.data.user_id 
      })
    }
  },
  onShow:function(){
    var that = this
    that.setData({
      grade:app.globalData.grade
    })
  },
})