var app = getApp();
var value = '';
var hostList= [];
Page({
  data: {
      scoreTheme:'',//存放主题名字
      theme_id:'',//存放主题的ID
      inputShowed: false,
      inputVal: '',//搜索框的输入格式
      themeinfo:'',//存放主题信息
      themeinfo2:'',//备份主题信息
      userName:'',//存放返回搜索名字的列表
      resultList:[],//存放最后搜索返回的结果
      selectitem:'',//存放点击搜索内容
      selectItem:[],//？
      scoreList:'',//储存所有评委id
      // bescoreList:'',//储存所有被评分人id
      gradstate:'', //判断该用户是否为评委
      checkList:''
  },


  onLoad: function (options) {
    var that = this
    let t = this, sbar = this.selectComponent("#searchbar"),
    { hideInput } = sbar
    Object.defineProperties(sbar.__proto__, {
      hideInput:{
        configurable: true,
        enumerable: true,
        writable: true,
        value(...p){
          this.triggerEvent('cancel', {})
          that.setData({
          inputVal:'',
          themeinfo:that.data.themeinfo2
          })
          return hideInput.apply(sbar, p)
        }
      }
    })
    console.log('detail里面的',options.scoreTheme)//username最后要换成scoreTheme
    this.setData({
        search: this.search.bind(this),
        scoreTheme: options.scoreTheme,//传进来的是scoreTheme
        theme_id:options.theme_id 
    })
    //显示所有人的得分
    wx.request({
      url: app.globalData.url+'showdata4',
      method: 'POST',
      data:{
        theme_id:that.data.theme_id,
        scoreList:that.data.scoreList,
        // bescoreList:that.data.bescoreList
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('查看页展示信息：',res.data.themeinfo)
        that.setData({
          themeinfo:res.data.themeinfo,
          themeinfo2:res.data.themeinfo,
          scoreList:res.data.scoreList, 
          check_btn: res.data.check_btn, 
          // bescoreList:res.data.bescoreList,
        })
      } 
    })

    wx.setNavigationBarTitle({
      title:that.data.scoreTheme
    })
  },
  search: function (value) {
    const that = this;
    var searchList = [];
    var result = new Object();//创建一个对象。
    result.text = '';
    result.value = 0;
      return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('输入的是',value)
            wx.request({
              url: app.globalData.url+'search2',
              method: 'POST',
              data:{
                username:value,
                theme_id:that.data.theme_id
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success (res) {
                console.log('搜索内容页展示信息：',res.data.userinfolist)
                that.setData({
                  userName:res.data.userinfolist    
                })
                for (var i of that.data.userName){
                  if(i.search(value)!= -1){
                    searchList.push(i);
                  }
                }
                console.log('search',searchList)
                var n = 1
                that.setData({
                  resultList:[]
                })
                for (i of searchList){
                  result.text = i;
                  result.value = n;
                  n = n+1;
                  that.data.resultList.push(result);
                  result = {};
                }
                console.log('resultList',that.data.resultList)
                console.log('传过来的列表是',that.data.userName)
                resolve(that.data.resultList)
              },

            })
          }, 500)
      })
  },
//点击触发事件
  selectResult: function (e) {
    var that =this
      console.log('select result', e.detail.item.text)
      //做个连表查询，直接返回名字和分数
     this.selectComponent("#searchbar").clearInput(e)//需要在wxml的mp-searchbar id="searchbar" 加这个ID
     that.setData({
      inputVal:e.detail.item.text,
    })
    for(var i of that.data.themeinfo){
      if (i.username == e.detail.item.text){
        that.setData({
          themeinfo:[i]
        })
        break;
      }
      else{
        that.setData({
          selectItem:'查无此人'
        })
      }
    }
  },
  detail(e){
    var index = e.currentTarget.dataset.index
    var scoreList = this.data.scoreList
    console.log(app.globalData.grade)
    for (var i of scoreList){
  
      if (i.score_id == app.globalData.user_id){
        console.log(i)
        this.setData({
          gradstate: true
        })
        break
      }
    }
    if(!app.globalData.state){
      wx.showModal({
        title: '请补充信息',
        content: '先登录再补充信息',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../../regist/regist',
            })
          } 
        }
      })
    }
    // 权限必须是最高级才能查看详细   
    else if(app.globalData.grade == '管理员' || app.globalData.grade == '教师' || app.globalData.user_id == this.data.themeinfo[index].user_id ||  this.data.gradstate == true)//设置查看权限
    {     
      var index = e.currentTarget.dataset.index
      wx.navigateTo({
        url:'../detail/detail?username='+this.data.themeinfo[index].username + "&bescore_id=" + this.data.themeinfo[index].user_id + "&theme_id=" + this.data.themeinfo[index].theme_id })
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
  },
});