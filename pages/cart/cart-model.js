
import { Base } from '../../utils/base.js'

class Cart extends Base {

  constructor() {
    // 调用基类的构造函数
    super();
    this._storageKeyName = 'cart';
  }

  /**
   * 加入到购物车
   * 如果之前没有这样的商品，则直接添加一条新的记录，数量为counts
   * 如果有，则只将相应数量 + counts
   * @params:
   * item - {obj} 商品对象
   * counts - {int} 商品数目
   */
  add (item,counts) {
    // 获取缓存的数据
    var cartData = this.getCartDataFromLocal();
    // 获取相应的数据
    var isHasInfo = this._isHasThatOne(item.id,cartData);

    // 判断是缓存返回index是否为-1，是则新增数据，否则有添加数据
    if (isHasInfo.index == -1) {
      item.counts = counts;
      item.selectStatus = true; // 设置选中状态
      cartData.push(item);
    } else {
      cartData[isHasInfo.index].counts += counts;
    }
    // 更新缓存
    wx.setStorageSync(this._storageKeyName, cartData)
  }

  /*本地缓存 保存／更新*/
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  };

  /**
   * 获取缓存数据,从缓存中读取购物车信息
   * @params flag true 商品选择的状态
   * @return [obj]
   */
  getCartDataFromLocal (flag) {
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = []
    }

    // 在下单的时候过滤不下单的商品
    if (flag) {
      var newRes = [];
      for (let i=0;i<res.length;i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }

    return res;
  }

  /**
   * 获取缓存数据计算所有购物车商品的数量
   * flag true 考虑商品的选择状态
   */
  getCartTotalCounts (flag) {
    var data = this.getCartDataFromLocal();
    var counts = 0;
    for (let i = 0; i< data.length;i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts += data[i].counts;
        }
      } else {
        counts += data[i].counts;
      }
    }
    return counts;
  }

  /**
   * 判断某个商品是否已经被添加到购物车中并且返回这个商品的数据以及所在数组中的序号
   * @params id 商品id
   * @params arr 缓存数据
   */
  _isHasThatOne (id,arr) {
    var item,result = {index: -1};
    for (let i = 0;i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        };
        break;
      }
    }
    return result;
  }

  /**
   * 私有修改商品数目
   * params:
   * id - {int} 商品id
   * counts - {int} 数目
   */
  _changeCounts(id,counts) {
    var cartData = this.getCartDataFromLocal(),hasInfo = this._isHasThatOne(id,cartData);

    // 判断是否在缓存中存在
    if (hasInfo.index != -1) {
      // 判断是否大于或者等于1个商品的存在
      if (hasInfo.data.counts >= 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData) // 本地缓存更新
  }

  /**
   * 增加商品数目
   */
  addCounts (id) {
    this._changeCounts(id,1);
  }

  /**
   * 购物车减
   */
  cutCounts (id) {
    this._changeCounts(id,-1);
  }

  /**
   * 删除商品
   */
  delete (ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    var cartData = this.getCartDataFromLocal();
    for (let i = 0;i<ids.length;i++) {
      var hasInfo = this._isHasThatOne(ids[i],cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index,1);
      }
    }

    wx.setStorageSync(this._storageKeyName, cartData) // 本地缓存更新
  }

}

export { Cart };