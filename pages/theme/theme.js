// pages/theme/theme.js
import {Theme} from 'theme-model.js';

var theme = new Theme();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    name: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取数据
    this.data.id = options.id;
    this.data.name = options.name;

    // 调用自定义基类
    this._loadData();
  },

  /**
   * banner点击事件,最近新品公用,精选主题
   */
  onProductsItemTap: function (event) {
    var id = theme.getDataSet(event, "id");
    wx.navigateTo({
      url: '../product/product?id=' + id,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },

  _loadData: function (event) {
    theme.getProductsData(this.data.id, res => {
      this.setData({
        themeInfo: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 动态设置导航栏
    wx.setNavigationBarTitle({
      title: this.data.name
    })
  }
})