// home-model
import {Base} from '../../utils/base.js'

class Home extends Base {

  constructor () {
    // 调用基类的构造函数
    super();
  }

  /**
   * 获取banner 轮播图
   */
  getBannerData (id,callback) {
    var params = {
      url: 'banner/' + id,
      sCallback: res => {
        callback && callback(res.items);
      }
    }
    // 调用封装的request 调用api请求函数
    this.request(params);
  }

  /**
   * 获取商品专栏
   */
  getThemeData (callback) {
    var param = {
      url: 'theme?ids=1,2,3',
      sCallback: data => {
        callback && callback(data);
      }
    }
    // 调用封装的request 调用api请求函数
    this.request(param);
  }

  // 获取精品主题
  getProductsData(callback) {
    var param = {
      url: 'product/recent',
      sCallback: data => {
        callback && callback(data);
      }
    }
    // 调用封装的request 调用api请求函数
    this.request(param);
  }
}

export {Home};