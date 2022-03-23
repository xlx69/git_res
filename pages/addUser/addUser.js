var app=getApp()
Page({
  /**
   * 组件的属性列表
   */
  properties: {},


  /**
   * 组件的初始数据
   */
  data: {
    usertype:'',
    showModal:true,
    checkboxItems: [
    ],
    choice:[],
    //数字选择1
    array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    value:'',//权重
    type:'',
    choseQuestionBank: "请选择评分权重 >",
    key:'',
  
  },
  //提交弹框

  modalcnt: function () {
    var that=this
    var weight=this.data.value
    if(this.data.showModal){//showModal存在则是评委
      if(weight){
        wx.showModal({
          title: '温馨提示',
          content: '请确定评分用户',
          success: function (res) {
            if (res.confirm) {
              var value={
                'weight':that.data.value,
                'users':that.data.choice
              }
              
              wx.setStorageSync(that.data.key, value)
              wx.navigateBack({
                delta: 1  // 返回上一级页面。
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else{
        wx.showToast({
          icon:"error",
          title: '请选择评分权重',
        })
      }
    }
    else{//评分用户
      wx.showModal({
        title: '温馨提示',
        content: '请确定评分用户',
        success: function (res) {
          if (res.confirm) {
             var value={
              'users':that.data.choice
            }
            
            wx.setStorageSync(that.data.key, value)
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  
  },


  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems,
    values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].user_id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems,
      choice: e.detail.value
    });
  },


  // 数字选择器1
  bindPickerChange: function (e) {
    var that = this
    var index=e.detail.value
    console.log('picker发送选择改变，携带值为',this.data.array[index] )
    this.setData({
      value: this.data.array[index],
      choseQuestionBank: '权重：'+that.data.array[e.detail.value]
    })
  },
  onShow(options){
    
  },
  onLoad: function (options) {
    var key=options.usertype+options.value

    var storage=wx.getStorageSync(key)
    if(storage){var checkUsers=storage.users}
    
    if(options.type){
      this.setData({showModal:false})
    }
    else{
      if(storage.weight)
      {
        var weight=storage.weight
        this.setData({
          choseQuestionBank: '权重：'+weight,
          value:weight
      })
      }
     
    }
    var that=this
    wx.request({
      url: app.globalData.url+'getBeScoreUser',
      method: 'post',
      data:{
        'usertpye':options.value
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        var checkboxItems=res.data.users
        if(storage){
          if(checkUsers){
            for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
              checkboxItems[i].checked = false;
              for (var j = 0, lenJ = checkUsers.length; j < lenJ; ++j) {
                if (checkboxItems[i].user_id == checkUsers[j]) {
                  checkboxItems[i].checked = true;
                  break;
                }
              }
            }
            that.setData({checkboxItems:checkboxItems})
          }
        }
        
        else{
          that.setData({checkboxItems:checkboxItems})
        }
       
        console.log(res)
      }
    })
    this.setData({usertype:options.value})
    this.data.key=options.usertype+options.value
    
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})