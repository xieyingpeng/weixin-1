// pages/category/category.js

import { Category } from 'category-model.js';

var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryTypeArr: null,
    currentMenuIndex: 0,
    loadedData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData: function () {
    
    /**
     * 获取所有分类
     */
    category.getCategoryType(res => {
      this.setData({
        categoryTypeArr: res
      })

      /**
       * 获取某种分类详细商品
       */
      // 一定在回调里再进行获取分类详情的方法调用
      category.getProductsByCategory(res[0].id, data => {
        var dataObj = {
          procucts: data,
          topImgUrl: res[0].img.url,
          title: res[0].name
        }
        this.setData({
          categoryProducts: dataObj
        })
        this.data.loadedData[0] = dataObj;
      })
    })
  },

  /**
   * 判断当前分类下的商品数据是否已经被加载
   */
  isLoadedData: function (index) {
    if (this.data.loadedData[index]) {
      return true;
    }
    return false;
  },

  /**
   * 动态获取某分类详情
   */
  changeCategory: function (e) {
    var index = category.getDataSet(e, 'index'), id = category.getDataSet(e, 'id');

    this.setData({
      currentMenuIndex: index
    })

    if (!this.isLoadedData(index)) {
      category.getProductsByCategory(id, data => {
        var dataObj = {
          procucts: data,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        }
        this.setData({
          categoryProducts: dataObj
        })

        this.data.loadedData[index] = dataObj;
      })
    } else {
      this.setData({
        categoryProducts: this.data.loadedData[index]
      })
    }
  },

  /**
   * 跳转到商品详情
   */
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event,'id');

    wx.navigateTo({
      url: '../product/product?id=' +id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 动态设置导航栏
    wx.setNavigationBarTitle({
      title: "分类"
    })
  }
})