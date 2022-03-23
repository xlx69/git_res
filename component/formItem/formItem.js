var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    arry:{
      type:Array,
      value:[]
    },
    title: {
      type: String,
      value: ""
    },
    value: {
      type: String,
      value: ""
    },
    name: {
      type: String,
      value: ""
    },
    require: {
      type: String,
      value: "true"
    },
    input: {
      type: String,
      value: "true"
    },
    ifsearch:{
      type: String,
      value: "false"
    },
    justy:{ // 是否左右对齐
      type: String,
      value: "true"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arry:[],
    lsit2:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _serach(e){
      console.log('输入的内容',e.detail.value)
      let that = this
      wx.request({
        url: app.globalData.url+'search2',
        method: 'POST',
        data:{
          username:e.detail.value
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        
        success (res) {
          console.log('返回名称列表信息：',res.data.userinfolist)
          var list = []
          for(var i = 0; i < res.data.userinfolist.length; i++){
            list.push(res.data.userinfolist[i])
          }
          that.setData({
            arry: list
          })
        }
      })
    },
    _click(e) { // 搜索选中
      let index = e.currentTarget.dataset.index
      let arry = this.data.arry[index]
      let that = this
      console.log('点击1的是',arry)
      
      this.setData({
        arry: []
      })
      let myEventDetail = {arry} // detail对象，提供给事件监听函数
      this.triggerEvent('click',myEventDetail);
    },
  }
})
