import {
  My
} from 'my-model.js';
import {
  Order
} from '../order/order-model.js';
import {
  Address
} from '../../utils/address.js';

var my = new My();
var address = new Address();
var order = new Order();

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },

  onShow: function () {
    var newOrderFlag = order.hasNewOrder();
    if (newOrderFlag) {
      this.refresh();

    }
  },

  refresh: function () {
    var that = this;
    this.data.orderArr = []; // 订单初始化
    this._getOrders(() => {
      that.data.isLoadAll = false; // 是否加载完全
      that.data.pageIndex = 1;
      order.execSetStorageSync(false) // 更新标志位
    })
  },

  /**
   * 获取用户的地址信息
   */
  _getAddressInfo: function () {
    // 调用address 中的获取用户地址信息
    address.getAddress(addressInfo => {
      // 调用绑定用户信息
      this._binAddressInfo(addressInfo);
    })
  },

  /**
   * 绑定用户信息
   */
  _binAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    })
  },

  _loadData: function () {

    /**
     * 调用获取用户微信信息
     */
    my.getUserInfo(res => {
      this.setData({
        userInfo: res
      })
    });

    /**
     * 调用获取历史订单
     */
    this._getOrders();
  },

  /**
   * 获取历史订单信息
   */
  _getOrders: function (callback) {
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.data;
      if (data.length > 0) {
        // es6合并数组
        this.data.orderArr.push(...data);
        this.setData({
          orderArr: this.data.orderArr
        })
      } else {
        this.data.isLoadAll = true;
      }
      callback && callback(res)
    })
  },

  /**
   * 页面拉到底部
   */
  onReachBottom: function () {
    if (!this.data.isLoadAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  /**
   * 显示订单详情
   */
  showOrderDetailInfo: function (event) {
    var id = order.getDataSet(event, 'id');

    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    })
  },

  rePay: function (event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');
    this._execPay(id, index);
  },

  /**
   * 再次支付
   * @param {int} id 订单id
   * @param {int} index 数据数组中的第几个
   */
  _execPay: function (id, index) {
    var that = this;
    order.execPay(id, statusCode => {
      if (statusCode > 0) {
        var flag = statusCode == 2;
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          })
        }
        // 跳转到支付结果页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        })
      } else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }
    })
  },

  /**
   * 添加地址
   */
  editAddress: function (event) {
    var that = this;
    // 小程序收货地址
    wx.chooseAddress({
      success: res => {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }

        that._bindAddressInfo(addressInfo);

        // 保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败!');
          }
        })
      }
    })
  }
})