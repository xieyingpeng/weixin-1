// pages/home/home.js

// 引入
import {
  Home
} from 'home-model.js';
// 实例化 home-model 的home类
var home = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this._loadData();
  },

  /**
   * 私有化的加载业务处理
   */
  _loadData: function () {
    var id = 1;
    // 调用 home 获取banner
    home.getBannerData(id, res => {
      // 数据绑定
      this.setData({
        'bannerArr': res
      })
    });

    // 获取商品专栏
    home.getThemeData(res => {
      this.setData({
        'themeArr': res
      })
    });

    // 获取精品主题
    home.getProductsData(res => {
      this.setData({
        productsArr: res
      })
    });
  },

  /**
   * banner点击事件,最近新品公用
   */
  onProductsItemTap: function (event) {
    var id = home.getDataSet(event,"id");
    wx.navigateTo({
      url: '../product/product?id=' + id,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  /**
   * 精选专题点击事件
   */
  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, "id");
    var name = home.getDataSet(event, "name");
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name,
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   this._loadData();
  // }
})