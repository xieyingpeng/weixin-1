// pages/product.js

import { Product } from 'product-model.js';
import { Cart } from '../cart/cart-model.js';

var product = new Product();
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    countsArray: [1,2,3,4,5,6,7,8,9,10],
    index: 1,
    currentTabsIndex: 0,
    cartTotalCounts: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this._loadData();
  },

  _loadData: function (event) {
    product.getDetailInfo(this.data.id, res => {
      wx.removeSavedFile({
        filePath: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        product: res
      })
    })
  },

  /**
   * picker 选择器，实时数据
   */
  bindPickerChange: function (e) {
    this.setData({
      index: this.data.countsArray[e.detail.value]
    })
  },

  /**
   * 选择购买数量
   */
  onTabsItemTap: function (event) {
    var index = product.getDataSet(event,'index');
    this.setData({
      currentTabsIndex: index
    })
  },

  /**
   * 加入购物车函数
   */
  onAddingToCartTap: function (event) {
    this.addToCart();
    // var counts = this.data.cartTotalCounts + this.data.index;
    this.setData({
      cartTotalCounts: cart.getCartTotalCounts()
    })
  },

  /**
   * 便利数据,添加缓存
   */
  addToCart: function () {
    var tempObj = {};
    var keys = ['id','name','main_img_url','price'];

    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }

    // 调用购物车函数
    cart.add(tempObj, this.data.index);
  },

  /**
   * 点击购物车跳转到购物车页面
   */
  onCartTap: function (event) {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }
})