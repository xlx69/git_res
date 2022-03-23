// pages/release/release.js
const util = require('../../utils/util');
var app = getApp()
Page({
  data: {
    date1: '请选择时间',//开始时间
    date2: '请选择时间',//结束时间
    title: '',//存放主题名字
    slideButtons: [],
    inputValue: '',
    inputValue2: '',
    userModel: '',
    rules: [],//存放评分细则
    rules2:[],
    rulesWeight:['1',],//评分细则权重
    userType: [],
    bescoreType: [],
    checkboxItems: [],//存放评委类型
    showbescoreModel: '',
    checkboxItems2: [],//存放评分对象类型
    array: ['1', '2','3', '4', '5'],
    value:'',//权重,
    StorageBeScore:[],//评分对象缓存key
    StorageScore:[],//评委缓存key
    date:'currentDate',
    currentDate:util.getNowDate(new Date()),//获取当前时间
    disabled:false,//设置是否能点击 false可以 true不能点击
    startDate: '2001-01-01 00:00',
    endDate: '2099-01-01 00:00',
    check_btn:false, //判断是否选择按等级评分
    check_num:''
  },
  // 日期筛选
  bindDateChange: function(e) {
    this.setData({
      currentDate: e.detail.value,
    })
    console.log(this.data.currentDate)
  },
  
  onPickerChange: function (e) {
    this.setData({
      date1: e.detail.dateString,
    })
    console.log('开始时间',this.data.date1,'结束时间',this.data.date2)
  },

  onPickerChange2: function (e) {
    this.setData({
      date2: e.detail.dateString,
    })
    console.log('开始时间',this.data.date,'结束时间',this.data.date2)
  },
  
    // 评分细则权重选择器 
    bindPickerChange: function (e) {
      console.log(e)
      var index=e.detail.value                       
      console.log('picker发送选择改变，携带值为',this.data.array[index] )
      this.setData({
        value: this.data.array[index],
      })
    },
    // 评A人数选择器 
    bindPickerChange_A: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value,
        check_num: e.detail.value-1+2
      })
      this.data.check_num=e.detail.value-1+2
      console.log('picker选择的值',this.data.check_num)
    },
  //设置主题
  setTitle(e) {
    this.data.title = e.detail.value
  },
  confirm2() {
    this.setData({
      showbescoreModel: false,
      bescoreType: this.data.bescoreType
    })
  },
  cancle2() {
    this.setData({
      showbescoreModel: false
    })
  },
  //评分用户跳转
  navigat(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    wx.navigateTo({
      url: '../addUser/addUser?value=' + this.data.userType[index] + '&usertype=judge',
    })
  },
  navigat2(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../addUser/addUser?value=' + this.data.bescoreType[index] + '&type=1&usertype=bescore',
    })
  },
  /**相关协议 法律文件 */
  bindAgreeChange:function(e) {
    //  console.log(e.detail.value)
      this.setData({
        isAgree:e.detail.value.length,
      })
      if (e.detail.value.length==1){
       this.setData({
         btn_disabled:false,
       })
     }else{
        //onsole.log(e.detail.value.length)
       this.setData({
         btn_disabled:true
       })
     }
    },
  //选择按等级评分
    checkboxChange3(e){
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)
      this.data.check_btn=!this.data.check_btn
      this.setData({
        check_btn:this.data.check_btn
      })
      console.log(this.data.check_btn)
      if(this.data.check_btn==false){
        this.data.check_num=''
      }
    },

  //评分对象弹窗调用
  checkboxChange2(e) {
    console.log('checkbox2发生change事件，携带value值为：', e.detail.value);
    var checkboxItems2 = this.data.checkboxItems2,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems2.length; i < lenI; ++i) {
      checkboxItems2[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems2[i].value == values[j]) {
          checkboxItems2[i].checked = true;
          break;
        }
      }
    }   
    this.data.bescoreType = e.detail.value
    this.setData({
      checkboxItems2: checkboxItems2,
    });
  },

  //评委弹窗的复选框
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value,this.data.checkboxItems);
    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
      //这么做的意义是给checkboxItems加上描述对象。
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.data.userType = e.detail.value
    this.setData({
      checkboxItems: checkboxItems,
    });
  },

  //删除评分细则
  slideButtonTap(e) {
    console.log(e.detail)
    var index = e.currentTarget.dataset.index
    this.data.rulesWeight.splice(index, 1);
      this.data.rules.splice(index, 1);
      this.setData({
        rules: this.data.rules,
        rulesWeight:this.data.rulesWeight
      })

  },
  //添加评委，获取类型
  adduser() {
    var that = this
    console.log('执行')
    wx.request({
      url: app.globalData.url + 'getUsertype',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          checkboxItems: res.data.list
        })
        if(that.data.userType.length!=0){
          for (var i = 0, lenI = that.data.checkboxItems.length; i < lenI; ++i) {
            that.data.checkboxItems[i].checked = false;
            for (var j = 0, lenJ = that.data.userType.length; j < lenJ; ++j) {
              if (that.data.checkboxItems[i].value == that.data.userType[j]) {
                that.data.checkboxItems[i].checked = true;
                break;
              }
            }
          }
          that.setData({
            checkboxItems: that.data.checkboxItems
          })
        }
        else{
     
          that.setData({
            checkboxItems: res.data.list
          })
          
        }
        console.log(res)
      }
    })
    this.setData({
      userModel: true
    })
  },
  //添加评分对象，获取类型
  addbescore() {
    var that = this
    wx.request({
      url: app.globalData.url + 'getUsertype',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          checkboxItems2: res.data.list
        })
        if(that.data.bescoreType.length!=0){
          for (var i = 0, lenI = that.data.checkboxItems2.length; i < lenI; ++i) {
            that.data.checkboxItems2[i].checked = false;
            for (var j = 0, lenJ = that.data.bescoreType.length; j < lenJ; ++j) {
              if (that.data.checkboxItems2[i].value == that.data.bescoreType[j]) {
                that.data.checkboxItems2[i].checked = true;
                break;
              }
            }
          }
          that.setData({
            checkboxItems2: that.data.checkboxItems2
          })
        }
        else{
          that.setData({
            checkboxItems2: res.data.list
          })
        } 
        console.log(res)
      }
    })
    this.setData({
      showbescoreModel: true
    })
  },
  submit: function () {
    if(app.globalData.grade == '管理员')
    {
      var that = this
      var bescoreType = this.data.bescoreType //评委全局缓存key
      var userType = this.data.userType //评分对象缓存key
      var scoreId = [] //评委id集合
      var bescoreId = [] //评分对象ID集合
      var length_Be = bescoreType.length
      var length = userType.length
      for (var i = 0; i < length_Be; i++) {
        var storageValue_be = wx.getStorageSync('bescore'+bescoreType[i])['users']
        console.log(storageValue_be)
        for (var j = 0; j < storageValue_be.length; j++) {
          bescoreId.push(storageValue_be[j])
        }
      }
      for (var j = 0; j < length; j++) {
        console.log('------------------')
        var storageValue = wx.getStorageSync('judge'+userType[j])
        console.log(userType[j])
        scoreId.push(storageValue)
      }
      console.log("被评分人id集合：" + bescoreId)
      if(that.data.date1=='请选择时间'||that.data.date2=='请选择时间'){
        wx.showToast({
          icon:"error",
          title: '请完善评分时间',
        })
      }
      else if(!that.data.title){
        wx.showToast({
          icon:"error",
          title: '请完善评分主题',
        })
      }
      else if(that.data.rules.length==0){
        wx.showToast({
          icon:"error",
          title: '请添加评分细则',
        })
      }
      else if(scoreId.length==0){
        wx.showToast({
          icon:"error",
          title: '请添加评委',
        })
      }
      else if(bescoreId.length==0){
        wx.showToast({
          icon:"error",
          title: '请添加评分对象',
        })
      }
      else if(that.data.check_btn==true&&that.data.check_num.length==0){
        wx.showToast({
          icon:"error",
          title: '请完善评级人数',
        })
      }
      else{
        wx.showModal({
          title: '温馨提示',
          content: '是否确定创建该项目',
          success: function (res) {
            if (res.confirm) {
              wx.request({
                url: app.globalData.url + 'creatvote',
                method: 'post',
                data: {
                  'releaseUserId':app.globalData.user_id,
                  'bescoreId': bescoreId,
                  'scoreId': scoreId,
                  'rules': that.data.rules,
                  'startDate': that.data.date1,
                  'endDate': that.data.date2,
                  'title': that.data.title,
                  'rulesWeight':that.data.rulesWeight,
                  'check_btn':that.data.check_btn,
                  'check_num':that.data.check_num,
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  that.data.check_btn=false
                  wx.showToast({
                    icon: "success",
                    title: '发布成功',
                  })
                  wx.removeStorageSync('bescore本科生')
                  wx.removeStorageSync('bescore管理员')
                  wx.removeStorageSync('bescore研究生')
                  wx.removeStorageSync('bescore教师')
                  wx.removeStorageSync('judge本科生')
                  wx.removeStorageSync('judge管理员')
                  wx.removeStorageSync('judge研究生')
                  wx.removeStorageSync('judge教师')
                  wx.removeStorageSync('rules')
                  wx.removeStorageSync('userType')
                  wx.removeStorageSync('bescoreType')
                  app.globalData.StorageScore=[]
                  app.globalData.storageValue_be=[]
                  that.setData({
                    date1: '请选择时间',
                    date2: '请选择时间',
                    title: '',
                    rules: [],
                    userType: [],
                    bescoreType: [],
                    check_num:'',
                    check_btn:false
                  })
                }
              })
    
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      }
    else{
        wx.showToast({
          icon: "error",
          title: '您不是管理员',
        })
      }
  },
  onLoad: function (options) {
    var that = this
    var rules
    var rule = wx.getStorageSync('rules')
    var len,item = []
    if(!rule){
      console.log('不做操作')
      rules = []
    }
    else{
      console.log('读取导入的模板')
      rules = wx.getStorageSync('rules')
      len = rules.length
      for (var i=0;i < len;i++){
        item.push("1")
      }
    }
    console.log('缓存内容',rules)
    var userType = wx.getStorageSync('userType')
    var bescoreType = wx.getStorageSync('bescoreType')
    console.log('导入模板页发来的',rules,len,item,userType,bescoreType)
    this.setData({
      rules:rules,
      rulesWeight:item,
      userType:userType,
      bescoreType:bescoreType,
      slideButtons: [{
        text: '删除',
        src: '/icon/delete.png', // icon的路径
      }]
    });
  },

  // 导入模板
  // Import_template(e){
  //   wx.navigateTo({
  //     url:'../template/template'
  //   })
  // },
  //显示模块对话框
  addRule: function () {
    this.setData({
      showModal: true
    })
  },
  //隐藏模块对话框
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  // 评分细则输入框内容改变事件
  inputChangename: function (e) {
    this.data.inputValue = e.detail.value
  },
    // 对话框取消按钮点击事件
    onCancelname: function () {
      this.hideModal();
    }, 
  //  评分对话框确认按钮点击事件
  onConfirmname: function () {
    var that = this
    var value = this.data.inputValue
    if(!value){
      wx.showToast({
        icon:"none",
        title: '评分细则不可为空',
      })
    }
    else{
      var rules = that.data.rules
      rules.push(value)
      this.data.rulesWeight.push(1)
      console.log(rules)
      this.setData({
        rules: rules,
        inputValue: value,
        rulesWeight: this.data.rulesWeight,
        showModal: false//功能和hidemodal相同了
      })
    }
  },
  cancle() {
    this.setData({
      userModel: false
    })
  },
  confirm() {
    this.setData({
      userModel: false,
      userType: this.data.userType
    })
  },
  onUnload: function () {
    console.log('退出页面')
    wx.removeStorageSync('rules')
    wx.removeStorageSync('userType')
    wx.removeStorageSync('bescoreType')
  }
})