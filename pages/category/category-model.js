
import { Base } from '../../utils/base.js'

class Category extends Base {

  constructor() {
    // 调用基类的构造函数
    super();
  }

  // 获取所有分类分类
  getCategoryType(callback) {
    var param = {
      url: 'category/all',
      sCallback: data => {
        callback && callback(data);
      }
    }
    // 调用封装的request 调用api请求函数
    this.request(param);
  }

  // 获取某种分类的详细商品
  getProductsByCategory(id,callback) {
    var param = {
      url: 'product/by_category?id=' + id,
      sCallback: data => {
        callback && callback(data);
      }
    }
    // 调用封装的request 调用api请求函数
    this.request(param);
  }

}

export { Category };