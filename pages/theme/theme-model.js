// home-model
import { Base } from '../../utils/base.js'

class Theme extends Base {

  constructor() {
    // 调用基类的构造函数
    super();
  }

  // 获取主题下的商品列表详情
  // 对应主题的id
  getProductsData(id,callback) {
    var param = {
      url: 'theme/' + id,
      sCallback: data => {
        callback && callback(data);
      }
    }
    // 调用封装的request 调用api请求函数
    this.request(param);
  }
}

export { Theme };