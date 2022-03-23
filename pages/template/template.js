// 导入模板页面设置模板,应该是向发布页面注入数据。
var app = getApp()
Page({
  data: {
    checkTeam:["---请选择团队---"],
    checkTeam2:["---请选择团队---"],//编辑组中的选择器，存储所有队伍名
    selectIndex:0,//导入模块的组选择器的指示选择的是第几个
    selectTeam:'',//存储 选择 组 选择器选择的内容
    selectTeam2:'',//存储 修改 组 选择器选择的内容
    selectIndex2:0,////导入模块的模板选择器的指示选择的是第几个
    selectIndex3:0,//编辑模板中的选择器，指数
    selectIndex4:0,//编辑组中的选择器指数
    selectIterm:['---请选择模板---'],
    selectIterm2:['---请选择模板---'],//模板编辑区的选择
    items:[],//存储了模板的内容，用来导入之后跳转到，发布页面。
    items2:[],//用于存储修改模板选择器选择之后模板对应的内容。
    items3:[],//用于存储修改 组 选择器选择之后模板对应的内容。
    bescores:[],
    list:[],//动态添加输入框，做已有内容的input 框做增加删除可以不需要借助一个列表做辅助，直接利用自身列表长度
    list2:[],//编辑组的动态添加输入框
    inputTemplate:[],//添加模板输入
    inputTemplate2:[],//存储输入添加组员
    master:'',//储存选择团队的组长名字
    master2:'',//存储 修改团队的组长名字
    input_master:'',//存储新建的团队的组长名字
    input_team_name:'',//储存修改组员模块组名
    userType: [],//记录组长的类型 如--研究生，转发到release页面
    bescoreType: [],//记录组员的类型 如--研究生，转发到release页面
    tipe1:false,
    tipe2:false,
    tipe3:false,
    tipe4:false,
  },
  onLoad(){
    var that =this 
    that.setData({
      checkTeam:["---请选择团队---"],
      selectIndex:0,
      selectTeam:'',
      selectIndex2:0,
      selectIndex3:0,
      selectIndex4:0,
      selectIterm:['---请选择模板---'],
      selectIterm2:['---请选择模板---'],
      items:[],
      items2:[],
      bescores:[],
      list:[],
      list2:[],
      items3:[],
      inputTemplate:[],
      inputTemplate2:[],
      master:'',
      master2:'',
      input_master:'',
      input_team_name:'',
      userType: [],
      bescoreTpye: [],
      tipe1:false,
      tipe2:false,
      tipe3:false,
      tipe4:false,
    })
    wx.request({
      url: app.globalData.url+'teamName',
      method: 'post',
      data:{},//只单存发一个请求获取后端以后的额所有分组,和已有模板
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data.teamNames,res.data.template_id)
        for (var teamName of res.data.teamNames){
          console.log(teamName)
          that.setData({
            checkTeam:that.data.checkTeam.concat(teamName),
            checkTeam2:that.data.checkTeam.concat(teamName)
            })
        }
        console.log('检查组名',that.data.checkTeam)
        for (var template =1; template<= res.data.template_id.length; template++){
          var name
          name = "模板"+template
          that.setData({
            selectIterm:that.data.selectIterm.concat(name),
            selectIterm2:that.data.selectIterm.concat(name)
            }) 
        }
        console.log('检查模板名',that.data.selectIterm)
      }
    })
  },
  changeuserTeam :function (res) {
    var that = this
    var index = res.detail.value
    var selectTeam = that.data.checkTeam[index]
    var bescores = {},master = {}
    wx.removeStorageSync('bescore本科生')
    wx.removeStorageSync('bescore管理员')
    wx.removeStorageSync('bescore研究生')
    wx.removeStorageSync('bescore教师')
    wx.removeStorageSync('judge本科生')
    wx.removeStorageSync('judge管理员')
    wx.removeStorageSync('judge研究生')
    wx.removeStorageSync('judge教师')
    wx.removeStorageSync('userType')
    wx.removeStorageSync('bescoreType')
    console.log('选择的团队是',selectTeam)
    that.setData({
      selectIndex:index,
      selectTeam:selectTeam
    })
    wx.request({
      url: app.globalData.url+'teamUsers',
      method: 'post',
      data:{
        selectTeam:selectTeam  //发送的是队伍名字
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data,res.data.master.teamMast)
        that.setData({
          bescores:res.data.bescores,
          master:res.data.master,
          userType:that.data.userType.concat(res.data.master.user_type)
        })
        master={
          weight:'1',
          users:[res.data.master.teamMast]
          }
        bescores=res.data.bescores
        wx.setStorageSync('judge'+res.data.master.user_type,master)
        var users1 =[] ,users2=[],users3=[],users4=[]
        var tip1=false
        var tip2=false
        var tip3=false
        var tip4=false
        for(var bescore of bescores){
          console.log('查看bescores的内容',bescore)
          if (bescore.user_type == '本科生') {
            users1.push(bescore.user_id)
            tip1 = true
          }
          else if (bescore.user_type == '研究生') {
            users2.push(bescore.user_id)
            tip2 = true
          }
          else if (bescore.user_type == '管理员') {
            users3.push(bescore.user_id)
            tip3 = true
          }
          else if (bescore.user_type == '教师') {
            users4.push(bescore.user_id)
            tip4 = true
          }
        }
        console.log('类型状态',tip1,tip2,tip3,tip4)
        var bescore_type =[]
        if (tip1){
          bescore_type.push('本科生')
        }
        if(tip2) {
          bescore_type.push('研究生')
        }
        if(tip3) {
          bescore_type.push('管理员')
        }
        if (tip4) {
          bescore_type.push('教师')
        }
        console.log("bescore_typt",bescore_type)
        that.setData({
        bescoreType:bescore_type
        })
        if (users1.length != 0) 
        {
          var bescore_id = {
            users:users1
          }
          console.log('缓存被评分人为本科生',bescore_id)
          wx.setStorageSync('bescore本科生',bescore_id)
        }
       if(users2.length != 0) 
        {
          var bescore_id = {
            users:users2
          }
          console.log('缓存被评分人为研究生',bescore_id)
          wx.setStorageSync('bescore研究生',bescore_id)
        }
        if(users3.length != 0) 
        {
          var bescore_id = {
            users:users3
          }
          console.log('缓存被评分人为管理员',bescore_id)
          wx.setStorageSync('bescore管理员',bescore_id)
        }
        if(users4.length != 0) 
        {
          var bescore_id = {
            users:users4
          }
          console.log('缓存被评分人为教师',bescore_id)
          wx.setStorageSync('bescore教师',bescore_id)
        }
      }
    })
  },
  changeuserTeam2:function (res){
    var that = this
    var index = res.detail.value
    var selectTeam2 = that.data.checkTeam[index]
    console.log('选择的团队是',selectTeam2)
    that.setData({
      selectIndex4:index,
      selectTeam2:selectTeam2,
      items3:[]
    })
    wx.request({
      url: app.globalData.url+'teamUsers',
      method: 'post',
      data:{
        selectTeam:selectTeam2  //发送的是队伍名字
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data,res.data.master.teamMast)
        for(var i of res.data.bescores){
          that.setData({
            items3:that.data.items3.concat(i.username)
          })  
        }
        that.setData({
          master2:res.data.master.username
        })
      }
    })
  },

  changeTemplate :function(res) {
    var that = this
    var index = res.detail.value
    var selectIterm = that.data.selectIterm
    var selectTeplate = selectIterm[index]
    console.log('选择的模板',selectTeplate)
    console.log('选择项是',selectIterm)
    for ( var Template of selectIterm){
      if (selectTeplate == Template ) {
        console.log('if中选择的是',selectTeplate,index)
        wx.request({
          url: app.globalData.url+'template',
          method: 'post',
          data:{
            template_id:index  //发送的是模板标识
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res){
            console.log(res.data.quotas)
            that.setData({
              items:res.data.quotas
            })
          }
        })
        that.setData({
          selectIndex2:index
        })
        break
      }
    }
  },
  changeTemplate2:function (res) {
    var that = this
    var index = res.detail.value
    var selectIterm = that.data.selectIterm2
    var selectTeplate2 = selectIterm[index]
    console.log('选择的模板',selectTeplate2)
    console.log('选择项是',selectIterm)
    for ( var Template of selectIterm){
      if (selectTeplate2 == Template ) {
        console.log('if中选择的是',selectTeplate2,index)
        wx.request({
          url: app.globalData.url+'template',
          method: 'post',
          data:{
            template_id:index  //发送的是模板标识
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res){
            console.log(res.data.quotas)
            that.setData({
              items2:res.data.quotas,
            })
          }
        })
        that.setData({
          selectIndex3:index
        })
        break
      }
    }
  },
  add_template () {
    var that = this
    console.log('添加模板')
    this.setData({
      tipe1:true, 
    })
  },
  set_template(){
    console.log('修改模板')
    this.setData({
      tipe2:true, 
    })
  },
  add_team(){
    console.log('添加团队')
    this.setData({
      tipe3:true, 
    })
  },
  set_team(){
    console.log('修改组员')
    this.setData({
      tipe4:true, 
    })
  },
  add_list1(){
    var that = this
    var list = that.data.list[that.data.list.length-1]
    list += 1
    this.setData({
      list:that.data.list.concat(list)
    })
    console.log('list',that.data.list)
  },
  //修改模板中的添加
  add_list2(){
    var that = this
    var item = ""
    if (that.data.items2.length == 0 ) {
      console.log("请选择修改的模板")
      wx.showToast({
        title: '请选择修改的模板',
        icon:'error',
        duration:1000
      })
    }
    else{
      that.setData({
        items2:this.data.items2.concat(item)
      })
    }
  },
  add_list3(){
    var that = this
    var list = that.data.list2[that.data.list2.length-1]
    list += 1
    this.setData({
      list2:that.data.list2.concat(list)
    })
    console.log('list2',that.data.list2)
  },
  add_list4(){
    var that = this
    var item = ""
    if (that.data.items3.length == 0 ) {
      console.log("请选择修改的模板")
      wx.showToast({
        title: '请选择修改的组',
        icon:'error',
        duration:1000
      })
    }
    else{
      that.setData({
        items3:this.data.items3.concat(item)
      })
    }
  },
  del_list1(){
    var that = this
    var list = this.data.list
    var inputTemplate = that.data.inputTemplate
    list.splice(list.length-1,1)
    inputTemplate.splice(inputTemplate.length-1,1)
    this.setData({
      list:that.data.list,
      inputTemplate:that.data.inputTemplate
    })
    console.log(that.data.list,that.data.inputTemplate)
  },
  del_list2(){
    var that = this
    var items = that.data.items2
    if (that.data.items2.length == 0 ) {
      console.log("请选择修改的模板")
      wx.showToast({
        title: '请选择修改的模板',
        icon:'error',
        duration:1000
      })
    }
    else{
      items.splice(items.length-1,1)
      this.setData({
        items2:that.data.items2
      }) 
    }
    console.log(that.data.items2)
  },
  del_list3(){
    var that = this
    var list = this.data.list2
    var inputTemplate = that.data.inputTemplate2
    list.splice(list.length-1,1)
    inputTemplate.splice(inputTemplate.length-1,1)
    this.setData({
      list2:that.data.list2,
      inputTemplate2:that.data.inputTemplate2
    })
    console.log(that.data.list2,that.data.inputTemplate2)
  },
  del_list4(){
    var that = this
    var items = that.data.items3
    if (that.data.items3.length == 0 ) {
      wx.showToast({
        title: '请选择修改的组',
        icon:'error',
        duration:1000
      })
    }
    else{
      items.splice(items.length-1,1)
      this.setData({
        items3:that.data.items3
      }) 
    }
    console.log(that.data.items3)
  },
  input_itme(res){
    var that = this
    var inputTemplate = that.data.inputTemplate
    if (res.detail.value == '') {
      console.log('没有输入')
      wx.showModal({
        title: '输入提示',
        content: '您还未输入，请输入内容',
        showCancel:false,
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            list:[1,],
            inputTemplate:[] //用这个来存输入的内容
            })
          }
        }
      })
    }
    else{
    that.setData({
        inputTemplate:inputTemplate.concat(res.detail.value)
      })
    }
    console.log('inputTemplate',that.data.inputTemplate)
  },
  submit(){
    var that = this 
    if (that.data.inputTemplate.length == 0 ) {
      wx.showModal({
        title: '输入提示',
        content: '您还未输入，请输入内容',
        showCancel:false,
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
              list:[1,],
              inputTemplate:[]
            })
          }
        }
      })
    }
    else {
      console.log('提交数据到后端',)
      wx.request({
        url: app.globalData.url+'addTemplate',
        method: 'post',
        data:{
          inputTemplat:that.data.inputTemplate,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
            console.log('添加模板模块---返回数据--->',res.data.state)
            if (res.data.state) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 500
              })
              setTimeout(function () {
                that.onLoad()
              },1000)
            }
          }   
      })
    }
  },
  input_itme2 :function (res){
    var that =this
    console.log(res.target.dataset.id,res.detail.value)
    var index = res.target.dataset.id  //修改的是iterms2中的对应内容
    var items = that.data.items2,value = res.detail.value
    for (var item in items){
      if (item == index) {
        items[index] = value
      }
    }
    console.log(items) //这里是弱赋值，没有从新拷贝一份数据，而是将存储地址分享给items 所有动一个另外一个改变了；还有就是使用setdata会立马更新页面显示，不使用setdata的话页面显示效果不会立刻出现
    console.log(that.data.items2)
  },
  submit2(){
    var that = this
    console.log(that.data.items2,that.data.selectIndex3) //selectIndex3 模板序号
    wx.showModal({
      title: '提示',
      content: '确认提交模板',
      success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.request({
          url: app.globalData.url+'changeTemplate',
          method: 'post',
          data:{
            inputTemplat:that.data.items2,
            template_id:that.data.selectIndex3
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res){
              console.log('添加模板模块---返回数据--->',res.data.state)
              if (res.data.state) {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 500
                })
                setTimeout(function () {
                  that.onLoad()
                },2000)
              }
            }   
        })
        }
      else{
        console.log('用户点击取消')
        }
      }
    })
  },
  submit3(){
    var that = this
    wx.showModal({
      title: '警告',
      content: '请确认删除该模板',
      success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.request({
          url: app.globalData.url+'delTemplate',
          method: 'post',
          data:{
            del:true,
            template_id:that.data.selectIndex3
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res){
              console.log('删除模板模块---返回数据--->',res.data.state)
              if (res.data.state) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 500
                })
                setTimeout(function () {
                  that.onLoad()
                },2000)
              }
            }   
          })
        }
      else{
        console.log('用户点击取消')
        }
      }
    })
  },
  input_itme3 :function (res) {
    var that = this
    console.log('输入的组长为',res.detail.value,res)
    that.setData({
      input_master:res.detail.value,
    })
  },
  input_itme4 :function (res) {
    var that = this
    var inputTemplate = that.data.inputTemplate2
    if (res.detail.value == '') {
      console.log('没有输入')
      wx.showModal({
        title: '输入提示',
        content: '您还未输入，请输入内容',
        showCancel:false,
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            list2:[1,],
            inputTemplate2:[] //用这个来存输入的内容
            })
          }
        }
      })
    }
    else{
    that.setData({
        inputTemplate2:inputTemplate.concat(res.detail.value)
      })
    }
    console.log('inputTemplate2',that.data.inputTemplate2)
  },
  input_itme5:function (res){
    var that = this 
    console.log('更改的组员名为',res.detail.value,res)
    var index = res.target.dataset.id  //修改的是iterms3中的对应内容
    var items = that.data.items3,value = res.detail.value
    for (var item in items){
      if (item == index) {
        items[index] = value
      }
    }
    console.log(that.data.items3)
  },
  input_itme6:function (res){
    this.setData({
      master2:res.detail.value
    })
    console.log('更改的组长名为',this.data.master2)
  },
  input_itme7:function (res){
    this.setData({
      input_team_name:res.detail.value
    })
    console.log('添加的组名为',this.data.input_team_name)
  },
  submit4(){
    var that = this 
    if (that.data.inputTemplate2.length == 0 || that.data.input_team_name == '') {
      wx.showModal({
        title: '提示',
        content: '您还未输入，请输入内容',
        showCancel:false,
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
              list2:[1,],
              inputTemplate2:[]
            })
          }
        }
      })
    }
    else {
      console.log('提交数据到后端',)
      wx.request({
        url: app.globalData.url+'addTeam',
        method: 'post',
        data:{
          teamName:that.data.input_team_name,
          master:that.data.input_master,
          teamer:that.data.inputTemplate2,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res){
            console.log('添加团队模块---返回数据--->',res.data.state)
            if (res.data.state) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 500
              })
              setTimeout(function () {
                that.onLoad()
              },1000)
            }
          }   
      })
    }
  },
  submit5(){
    var that = this
    var index = that.data.selectIndex4
    console.log(that.data.items3)
    if ( that.data.selectIndex4 != 0){
      wx.showModal({
        title: '提示',
        content: '确认提交',
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url+'changeTeam',
            method: 'post',
            data:{
              bescores:that.data.items3,
              mast:that.data.master2,
              teamName:that.data.checkTeam2[index]
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res){
                console.log('添加模板模块---返回数据--->',res.data.state)
                if (res.data.state) {
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 500
                  })
                  setTimeout(function () {
                    that.onLoad()
                  },2000)
                }
              }   
          })
          }
        else{
          console.log('用户点击取消')
          }
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您还未选择团队',
        showCancel:false,
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          }
        }
      })
    }
  },
  submit6(){
    var that = this
    var index = that.data.selectIndex4
    console.log('删除该团队')
    //只需要将队名传过去，将队列的数据删除即可，后面添加组会被覆盖。
    if (index != 0) {
      wx.showModal({
        title: '警告',
        content: '请确认删除该组',
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url+'delTeam',
            method: 'post',
            data:{
              teamName:that.data.checkTeam2[index]
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res){
                console.log('删除模板模块---返回数据--->',res.data.state)
                if (res.data.state) {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 500
                  })
                  setTimeout(function () {
                    that.onLoad()
                  },2000)
                }
              }   
            })
          }
        else{
          console.log('用户点击取消')
          }
        }
      }) 
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您还未选择团队',
        showCancel:false,
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          }
        }
      })
    }
  },
  submit7(){
    var that = this 
    if ((that.data.selectIndex != 0) && (that.data.selectIndex2!=0) ){
      wx.showModal({
        title: '提示',
        content: '确认使用该模板',
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定',that.data.bescoreType,that.data.userType)
          console.log('that.data.items',that.data.items)
          wx.navigateTo({
            url: '../release/release'
          })
          wx.setStorageSync('rules',that.data.items)
          wx.setStorageSync('bescoreType', that.data.bescoreType)
          wx.setStorageSync('userType', that.data.userType) 
          }
        else{
          console.log('用户点击取消')
          }
        }
      })
    }
    else{
      console.log('用户点击取消')
      wx.showModal({
        title: '提示',
        content: '请选择团队和模板',
        showCancel:false,
        success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          }
        }
      })
    }
  }
})
//没有解决的bug,不能同时为多个分组，考虑到如果临时发布一个评分没有必要特备分一个组。
//按组评分应该是经常评的对象，如果临时发布一个 直接去发布页发布即可。但是这里的思想和设计的逻辑就有冲突了，
//既然可以添加组，却不能同时为多个组,看以后有必要加表吗。或者说怎么加这个表