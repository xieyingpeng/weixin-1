import {Base} from 'base.js';
import { Config } from 'config.js';

class Address extends Base {
  constructor () {
    super();
  }

  /**
   * 微信地址管理，地址拼合
   * @params res 微信返回的地址|数据库地址信息
   */
  setAddressInfo (res) {
    var province = res.provinceName || res.province,
      city = res.cityName || res.city,
      country = res.countyName || res.country,
      detail = res.detailInfo || res.detail;

    var totalDetail = city + country + detail;

    // 非直辖市添加省份
    if (!this.isCenterCity(province)) {
      totalDetail = province + totalDetail;
    }

    return totalDetail;
  }

  /**是否是直辖市 */
  isCenterCity(name) {
    var centerCitys = ['北京市','上海市','天津市','重庆市'],
      flag = centerCitys.indexOf(name) >=0;
      return flag;
  }

  /*保存地址*/
  _setUpAddress(res, callback) {
    var formData = {
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName,
      mobile: res.telNumber,
      detail: res.detailInfo
    };
    return formData;
  }

  /**
   * 更新保存地址
   */
  submitAddress (data,callback) {
    data = this._setUpAddress(data);
    var param = {
      url: 'address',
      type: 'post',
      data: data,
      sCallback: function (res) {
        callback && callback(true,res);
      },
      eCallback (res) {
        callback && callback(false, res);
      }
    }
    this.request(param);
  }

  /**
   * 获取我自己都收货地址
   */
  getAddress (callback) {
    var that = this;
    var param = {
      url: 'address',
      sCallback: res => {
        if (res) {
          res.totalDetail = that.setAddressInfo(res);
          callback && callback(res);
        }
      }
    }
    this.request(param);
  }

}

export {Address}