import {Config} from 'config.js'
import { Token } from 'token.js'

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  /**
   * 请求封装
   * 当 noRefech 为 true， 不做未授权重做机制
   */
  request (params,noRefetch) {
    var that = this;
    // url内外拼接
    var url = this.baseRequestUrl + params.url;

    if (!params.type) {
      params.type = 'GET'
    }

    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type':'application/json',
        'token': wx.getStorageSync('token')
      },
      success: res => {
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          // 判断函数，存在才调用
          params.sCallback && params.sCallback(res.data);
        } else {
            // AOP
            // 401 无token，重新调用
            if (code == '401') {
              // 避免无限循环，默认false进入，第二次调用时返回ture就不会再次去调用死循环
              if (!noRefetch) {
                that._refetch(params);
              }
            }
          if (noRefetch) {
            params.eCallback && params.eCallback(res.data);
          }
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  }

  /**
   * 调用获取token，重新调用api
   */
  _refetch (params) {
    var token = new Token();
    token.getTokenFromServer(token => {
      this.request(params, true);
    })
  }

  /** 
   * 获取元素上绑定的值
   */
  getDataSet(event,key) {
    return event.currentTarget.dataset[key];
  }
}

export {Base};