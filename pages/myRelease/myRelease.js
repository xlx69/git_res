var app = getApp();
var value = '';
var hostList = [];


Page({
  data: {
    inputShowed: false,//搜索默认的数据格式
    themeList2: [], //放做我的发布主题数据的备份  
    themeList: [],//存放我的发布主题数据
    resultList: [],
    openid2: '',
    user_id: '',
    inputVal: "",
    state: app.globalData.state, //反应是否注册
    selectitem: [],
    endTime: "00:00:00", //结束时间
    timeIntervalSingle: '',
  },
  onShow: function () {
    var that = this
    that.setData({
      user_id: app.globalData.user_id
    })
    wx.request({
      url: app.globalData.url + 'myRelease',
      method: 'POST',
      data: {
        'user_id': app.globalData.user_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('封面展示主题信息：', res.data.themeList)
        that.setData({
          themeList:res.data.themeList,
          themeList2:res.data.themeList
        }) 
      }
    })
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      search: this.search.bind(this),
    })
    this.setData({
      slideButtons: [{
        type: 'warn',
        text: '删除',
        extClass: 'test',
      }],
    });
    let t = this,
      sbar = this.selectComponent("#searchbar"),
      {
        hideInput
      } = sbar
    // 重写
    Object.defineProperties(sbar.__proto__, {
      hideInput: {
        configurable: true,
        enumerable: true,
        writable: true,
        value(...p) {
          this.triggerEvent('cancel', {})
          that.setData({
            inputVal: ''
          })
          that.onShow()
          return hideInput.apply(sbar, p)
        }
      }
    })
  },
  //删除事件
  del: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var theme_id = that.data.themeList[index].theme_id
    console.log('删除主题的id:',that.data.themeList[index].theme_id)
    wx.request({
        url: app.globalData.url + 'delete',
        method: 'POST',
        data: {
          'user_id': app.globalData.user_id,
          'theme_id': theme_id,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          that.setData({
            themeList:res.data.themeList,
            inputVal:''
          })
        }
      })
  },

//搜索功能
  search: function (value) {
    const that = this;
    var searchList = [];
    var result = new Object(); //创建一个对象。
    result.text = '';
    result.value = 0;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('输入的是', value)
        wx.request({
          url: app.globalData.url + 'search3',
          method: 'POST',
          data: {
            scoreTheme: value
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log('搜索内容页展示信息：', res.data.themeInfolist)
            for (var i of res.data.themeInfolist) {
              searchList.push(i);
            }
            var n = 1
            that.setData({
              resultList: []
            })
            for (i of searchList) {
              result.text = i.scoreTheme;
              result.value = n;
              n = n + 1;
              that.data.resultList.push(result);
              result = {};
            }
            console.log('resultList', that.data.resultList)
            resolve(that.data.resultList)
          },
        })
      }, 500)
    })
  },

  //点击搜索返回，触发搜索事件
  selectResult: function (e) {
    var that = this
    console.log('select result', e.detail.item.text, e.detail.item, that.data.themeList)
    //做个连表查询，直接返回名字和分数
    this.selectComponent("#searchbar").clearInput(e) //需要在wxml的mp-searchbar id="searchbar" 加这个ID
    that.setData({
      inputVal: e.detail.item.text,
    })
    for (var i of that.data.themeList) {
      if (i.scoreTheme == that.data.inputVal) {
        console.log(i)
        that.setData({
          themeList: [i],
        })
        console.log('循环之后的',that.data.themeList)
      } 
    }
  },
})