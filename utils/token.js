// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头

import {Config} from 'config.js';

class Token {
  constructor () {
    this.verifyUrl = Config.restUrl + 'token/verify';
    this.tokenUrl = Config.restUrl + 'token/user';
  }

  verify () {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    } else {
      this._veirfyFromServer(token);
    }
  }

  /**
   * 请求服务器验证token
   */
  _veirfyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      data: {
        token: token
      },
      success: function (res) {
        var valid = res.data.isValid;
        if (!valid) {
          // 验证令牌不正确重新获取令牌
          that.getTokenFromServer();
        }
      }
    })
  }

  /**
   * 从服务器获取token
   * @params:
   * callBack function
   */
  getTokenFromServer (callBack) {
    var that = this;
    // 登录获取code
    wx.login({
      success: function (res) {
        // 发送请求到后端获取token权限
        wx.request({
          url: that.tokenUrl,
          data: {
            code: res.code
          },
          method: 'POST',
          success: function (res) {

            // 存放在小程序本地缓存
            wx.setStorageSync('token', res.data.token);
            callBack && callBack(res.data.token)
          },
          fail: function (res) {
            console.log(res.data)
          }
        })
      }
    })
  }
}

export {Token}