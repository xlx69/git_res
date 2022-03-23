var app = getApp();
var value = '';
var hostList = [];

Page({
  data: {
    inputShowed: false,
    themeList: [], //储存所有的主题
    themeList0: [], //储存还没截至的主题
    themeList1: [], //储存已经截至的主题
    themeList_1: [], //储存还没开始的主题
    themeList2: [], //备份所有的主题
    resultList: [],
    openid2: '',
    user_id: '',
    inputVal: "",
    state: app.globalData.state, //反应是否注册
    selectitem: [],
    endTime: "00:00:00", //结束时间
    timeIntervalSingle: '',
  },

  //时间显示小于10的格式化函数
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //倒计时
  singleCountDown: function () {
    var that = this;
    var time = 0;
    var time_1 = 0;
    var themeList = this.data.themeList
    var themeDate = []
    var themeDate2 = []
    var themeDate3 = []
    var len = themeList.length
    var resultDate = []
    var currentTime = new Date().getTime(); //当前时间时间戳
    for (var i = 0; i < len; i++) {
      // var endTime = (themeList[i].endTime + ' 00:00:00')
      var endTime = (themeList[i].endTime)
      var startTime = (themeList[i].startTime)
      endTime = new Date(endTime.replace(/-/g, "/")).getTime(); //结束时间时间戳
      startTime = new Date(startTime.replace(/-/g, "/")).getTime(); //开始时间时间戳
      time = (endTime - currentTime) / 1000;
      time_1 = (startTime - currentTime) / 1000;
      // 如果活动未结束
      if (time_1 > 0) {
        themeDate3.push(themeList[i]) //未开始的主题
        var day_1 = parseInt(time_1 / (60 * 60 * 24));
        var hou_1 = parseInt(time_1 / (60 * 60) - (day_1 * 24));
        var min_1 = parseInt(time_1 % (60 * 60 * 24) % 3600 / 60);
        themeList[i].day_1 = that.timeFormat(day_1)
        themeList[i].hou_1 = that.timeFormat(hou_1)
        themeList[i].min_1 = that.timeFormat(min_1)
        this.setData({
          day_1: themeList[i].day_1,
          hou_1: themeList[i].hou_1,
          min_1: themeList[i].min_1,
        })
        // console.log('评分开始时间',day_1,hou_1,min_1)
      } else if (time > 0 && time_1 < 0) {
        var day = parseInt(time / (60 * 60 * 24));
        var hou = parseInt(time / (60 * 60) - (day * 24));
        var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        // var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        themeList[i].day = that.timeFormat(day)
        themeList[i].hou = that.timeFormat(hou)
        themeList[i].min = that.timeFormat(min)
        themeDate.push(themeList[i]) //未过期的主题
      } else { //活动已结束
        themeList[i].day = "00"
        themeList[i].hou = "00"
        themeList[i].min = "00"
        themeDate2.push(themeList[i]) //已过期的主题
      }
    }
    resultDate = themeDate.concat(themeDate2, themeDate3) //将两个数组合并
    var timeIntervalSingle = setTimeout(that.singleCountDown, 60000);
    that.setData({
      themeList: resultDate,
      themeList2: resultDate,
      themeList0: themeDate,
      themeList1: themeDate2,
      themeList_1: themeDate3,
    })
  },
  onShow: function () {
    var that = this
    that.setData({
      user_id: app.globalData.user_id
    })
    wx.request({
      url: app.globalData.url + 'showdata',
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('封面展示主题信息：', res.data.themeList)
        that.data.themeList = res.data.themeList
        that.singleCountDown(); //页面加载时就启动定时器
      }
    })
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      search: this.search.bind(this),
    })
    app.denglu().then(res => {
      console.log('', res)
      that.setData({
        user_id: res
      })
    })
    this.setData({
      slideButtons: [{
        text: '查看',
      }, {
        type: 'warn',
        text: '评分',
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
            themeList: that.data.themeList2,
            inputVal: ''
          })
          that.singleCountDown()
          return hideInput.apply(sbar, p)

        }
      }
    })
  },
  //正在评分的主题
  slideButtonTap(e) {
    var index = e.currentTarget.dataset.index
    if (e.detail.index == 0) {
      console.log('点击的是查看')
      wx.navigateTo({
        url: '../see/see1/see1?scoreTheme=' + this.data.themeList[index].scoreTheme + "&theme_id=" + this.data.themeList[index].theme_id
      })
    } else {
      console.log('点击的是评分')
      wx.navigateTo({
        url: '../scoreuserlist/scoreuserlist?scoreTheme=' + this.data.themeList[index].scoreTheme + "&theme_id=" + this.data.themeList[index].theme_id
      })
    }
  },

  //还没开始的主题
  slideButtonTap2(e) {
    var that= this
    var index = e.currentTarget.dataset.index
    for (var i of that.data.themeList_1){
      console.log(i)
    if (e.detail.index == 0) {
      console.log('点击的是查看')
      wx.navigateTo({
        url: '../see/see1/see1?scoreTheme=' + this.data.themeList[index].scoreTheme + "&theme_id=" + this.data.themeList[index].theme_id
      })
    } else {
      console.log('点击的是评分')
      wx.showToast({
        title:'离开始还剩' + i.day_1 + '天' + i.hou_1 + '时' + i.min_1 + '分',
        icon: 'none',
        duration: 2500
      })
    }
  }
  },

  //已经过期的主题
  slideButtonTap3(e) {
    var index = e.currentTarget.dataset.index
    if (e.detail.index == 0) {
      console.log('点击的是查看')
      wx.navigateTo({
        url: '../see/see1/see1?scoreTheme=' + this.data.themeList[index].scoreTheme + "&theme_id=" + this.data.themeList[index].theme_id
      })
    } else {
      console.log('点击的是评分')
      wx.showToast({
        title: '该评分已截止！',
        icon: 'none',
        duration: 1500
      })
    }
  },
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
  //点击触发事件
  selectResult: function (e) {
    var that = this
    console.log('select result', e.detail.item.text, e.detail.item, that.data.themeList)
    //做个连表查询，直接返回名字和分数
    this.selectComponent("#searchbar").clearInput(e) //需要在wxml的mp-searchbar id="searchbar" 加这个ID
    that.setData({
      inputVal: e.detail.item.text,
    })
    for (var i of that.data.themeList0) {
      if (i.scoreTheme == that.data.inputVal) {
        console.log(i)
        that.setData({
          themeList0: [i],
          themeList1: '',
          themeList_1: '',
        })
      } else {
        for (var t of that.data.themeList1) {
          if (t.scoreTheme == that.data.inputVal) {
            console.log(t)
            that.setData({
              themeList0: '',
              themeList_1: '',
              themeList1: [t],
            })
          } else {
            for (var j of that.data.themeList_1) {
              if (j.scoreTheme == that.data.inputVal) {
                console.log(j)
                that.setData({
                  themeList0: '',
                  themeList1: '',
                  themeList_1: [j],
                })
              }
            }
          }
        }
      }
    }
  },

})