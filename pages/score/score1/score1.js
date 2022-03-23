//打分页
var app = getApp();
Page({
  data: {
    sum: "",
    fmark: "",
    gscore: "",
    scoreTheme: '', //由首页点击传入
    username: '', //评分者姓名，用于页面导航栏
    theme_id: '', //主题ID
    bescore_id: '', //被评分人的id
    score_id: app.globalData.user_id, //评分人的id
    scoreItem: [], // 存储的是分数信息
    scoreTest: [],
    remark: '', //存储评论内容
    check: false,
    check_num: '', //存储能够评为A的人数
    check_btn: "", //用于判断是否为按等级评分
  },
  // 综合评分
  bandleChange(e) {
    // 1 获取单选框中的值

    let gscore = e.detail.value;
    // 2 把值赋值给 data 中的数据
    this.setData({

      gscore: gscore
    })
    console.log(this.data.gscore);
    this.scalculation()
  },
  onLoad: function (options) {
    var that = this
    console.log(' 评分页里面的', options.scoreTheme) //username最后要换成scoreTheme
    this.setData({
      scoreTheme: options.scoreTheme, //这里后面传进来的应该是scoreTheme
      theme_id: options.theme_id,
      bescore_id: options.bescore_id,
      username: options.username,
    })
    //这里请求评分细则进行评分
    wx.request({
      url: app.globalData.url + 'score2',
      method: 'POST',
      data: {
        theme_id: that.data.theme_id,
        score_id: app.globalData.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('评分项展示：', res.data.scoreItem)
        var scoreItem = []
        var data = res.data.scoreItem
        var length = res.data.scoreItem.length
        for (var i = 0; i < length; i++) {
          var item = {
            score_id: app.globalData.user_id,
            bescore_id: that.data.bescore_id,
            theme_id: that.data.theme_id,
            quota_id: data[i].quota_id, //每项的id
            quota: data[i].quota, //每项id对应的主题名称
            weight: data[i].weight, //每项的权重
            score: 0
          }
          scoreItem.push(item)
        }
        that.setData({
          scoreItem: scoreItem,
          check_num: res.data.check_num,
          check_btn: res.data.check_btn.check_btn,
        })
        if (that.data.check_btn == 'False'){
          that.setData({
            check_num: '0',
          })
        }else{
          that.setData({
            check_num: that.data.check_num.check_num,
          })
        }
        console.log('修改之后的scoreItem', that.data.scoreItem)
        console.log('剩余评A人数为', that.data.check_num)
      }
    })
    wx.setNavigationBarTitle({
      title: that.data.username
    })
  },
  //平分函数
  scoreItem: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var scoreItem = []
    var data = that.data.scoreItem
    var length = that.data.scoreItem.length
    var score = e.detail.value
    console.log('滑块打分为：', e.detail.value)
    console.log('移动的是第', index + 1, '个滑块')
    console.log('每个滑块对应的信息', that.data.scoreItem[index])
    console.log('scoreItem的信息', that.data.scoreItem)
    for (var t = 0; t < length; t++) {
      if (t == index) {
        var items = {
          score_id: app.globalData.user_id,
          bescore_id: that.data.bescore_id,
          theme_id: that.data.theme_id,
          quota_id: data[index].quota_id,
          quota: data[index].quota,
          weight: data[index].weight,
          score: score
        }
        scoreItem.push(items)
      } else {
        var item = {
          score_id: app.globalData.user_id,
          bescore_id: that.data.bescore_id,
          theme_id: that.data.theme_id,
          quota_id: data[t].quota_id,
          quota: data[t].quota,
          weight: data[t].weight,
          score: data[t].score,
        }
        scoreItem.push(item)
      }
    }
    that.setData({
      scoreItem: scoreItem
    })
    console.log('总的数据表：', that.data.scoreItem)
    this.scalculation()
  },
  //可能需要修改路由
  back: function () {
    setTimeout(() => {
      wx.navigateBack({
        url: '../../scoreuserlist',
      })
    }, 1000)
  },
  bindTextAreaBlur: function (e) {
    var that = this
    this.setData({
      remark: e.detail.value
    })
    console.log('评论的内容：', that.data.remark)
  },
  checkboxChange: function (e) {
    var that = this
    console.log('checkbox发生change事件', e.detail.value.length)
    if (e.detail.value.length != 0) {
      that.setData({
        check: true
      })
    } else {
      that.setData({
        check: false
      })
    }
    console.log(this.data.check)
  },
  //提交分数
  Submit(e) { //提交将数据返回后端
    var that = this
    wx.showModal({
      content: '是否提交评分',
      title: '提交确认',
      success: function (res) {
        console.log('点击的是', res)
        console.log('查看存储的user_id', app.globalData.user_id)
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + 'score',
            method: 'POST',
            data: {
              scoreItem: that.data.scoreItem,
              remark: that.data.remark,
              check: that.data.check,
              check_num: that.data.check_num,
              gscore: that.data.gscore
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log('评分项展示：', res.data.scoreItem)
              var scoreItem = []
              var data = res.data.scoreItem
              var length = res.data.scoreItem.length
              for (var i = 0; i < length; i++) {
                var item = {
                  theme: data[i].quota,
                  score: 0
                }
                scoreItem.push(item)
              }
              console.log('修改之后的scoreItem', that.data.scoreItem)
            }
          })
          that.back()
          console.log('提交成功')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      },
    })
  },
  // 不符合的提示
  Tips() {
    wx.showModal({
      // title: '提示',
      content: '总评分与综合评分不符！',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')

        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },
  // 人数上限提示
  Tips2() {
    wx.showModal({
      // title: '提示',
      content: '评为A等级的人数已上限！',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')

        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },
  // 处理总评分数据
  scalculation() {
    var that = this
    that.setData({
      fmark: 0
    })

    var fmark = this.data.fmark
    var length = this.data.scoreItem.length
    var sum = 0
    for (var t = 0; t < length; t++) {

      sum = sum + this.data.scoreItem[t].score
      fmark = fmark + this.data.scoreItem[t].weight
    }
    that.setData({
      fmark: fmark,
      sum: sum
    })
  },
  // 做判断
  scoreSubmit() {
    var that = this
    var check_num = that.data.check_num
    var sum = Number(this.data.sum)
    var fmark = Number(this.data.fmark)
    if (that.data.check_btn == 'True'){
      if (check_num == "0" && this.data.gscore == "A"){
        this.Tips2()
      }else{
    if (this.data.gscore == "A") {
      if ((sum / (fmark * 5)) >= 0.85) {
        this.Submit()
      } else {
        this.Tips()
      }
    } else if (this.data.gscore == "B") {
      if ((sum / (fmark * 5)) >= 0.7 && (sum / (fmark * 5)) < 0.85) {
        this.Submit()
      } else {
        this.Tips()
      }
    } else if (this.data.gscore == "C") {
      if ((sum / (fmark * 5)) >= 0.5 && (sum / (fmark * 5)) < 0.7) {
        this.Submit()
      } else {
        this.Tips()
      }
    } else {
      if ((sum / (fmark * 5)) < 0.5) {
        this.Submit()
      } else {
        this.Tips()
      }
    }
  }
  }else{
    this.Submit()
  }
  },

  hint(){
    wx.showModal({
      title: '提示',
      content: 'A等级：85%~100%\r\nB等级：70%~85%\r\nC等级：50%~70%\r\n等级D：0~50%',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})