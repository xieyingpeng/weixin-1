// pages/cart/cart.js
import { Cart } from 'cart-model.js';

var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 用户离开页面时
   */
  onHide: function () {
    // 封装的缓存更新
    cart.execSetStorageSync(this.data.cartData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartData = cart.getCartDataFromLocal();
    // var countsInfo = cart.getCartTotalCounts(true);
    var cal = this._calcTotalAccountAndCounts(cartData);
    this.setData({
      selectedCounts: cal.selectedCounts,
      cartData: cartData,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account
    });
  },

  /**
   * 计算订单总金额
   */
  _calcTotalAccountAndCounts: function (data) {
    var len = data.length,
    // 所需要计算的总价格，但是要注意排除掉非选择的商品
    account = 0,
    // 购买商品的总个数
    selectedCounts = 0,
    // 购买商品种类的总数
    selectedTypeCounts = 0;

    let multiple = 100;

    for (let i=0;i<len;i++) {
      if (data[i].selectStatus) {
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }

    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },
               
  // 按钮选择绑定
  toggleSelect: function (event) {
    var id = cart.getDataSet(event,'id');
    var status = cart.getDataSet(event, 'status');

    var index = this._getProductIndexById(id);

    // 选择状态赋值
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  // 重新计算
  _resetCartData: function () {
    /**重新计算总金额和商品总数 */
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    this.setData({
      selectedCounts: newData.selectedCounts,
      cartData: this.data.cartData,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account
    });

  },

  // 全选按钮选择绑定
  toggleSelectAll: function (event) {
    var status = cart.getDataSet(event,'status') == 'true';
    var data = this.data.cartData,len = data.length;

    for(let i=0;i<len;i++) {
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },

  // 通过id判断在缓存数组中的第几个数
  _getProductIndexById (id) {
    var data = this.data.cartData,len = data.length;
    for(let i=0;i<len;i++) {
      if(data[i].id == id) {
        return i;
      }
    }
  },

  // 减号绑定
  changeCounts: function (event) {
    var id = cart.getDataSet(event,'id'),
      type = cart.getDataSet(event,'type'),
      index = this._getProductIndexById(id),
      counts = 1;
    if (type == 'add') {
      cart.addCounts(id);
    } else {
      counts = -1;
      cart.cutCounts(id);
    }

    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  /**
   * 清空此商品
   */
  delete: function (event) {
    var id = cart.getDataSet(event, 'id'),
      index = this._getProductIndexById(id);
    
    this.data.cartData.splice(index,1); // 删除某一项商品
    this._resetCartData();
    cart.delete(id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 动态设置导航栏
    wx.setNavigationBarTitle({
      title: "购物车"
    })
  },

  /**
   * 下单绑定
   */
  submitOrder: function (event) {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart'
    })
  }
})