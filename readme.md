# new-wechat-tools

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/new-wechat-tools.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/new-wechat-tools
<!--
Description here.
-->

## Install

```bash
$ npm i new-wechat-tools --save
```

## How

```js
app.wechat.messageMiddleware //co-wechat middleware
app.wechat.api  // co-wechat-api
app.wechat.oauth  // co-wechat-oauth
app.wechat.payment  // co-wechat-payment
```

For more details, please refer to the following links.

[co-wechat] (https://github.com/node-webot/co-wechat)

[co-wechat-api] (https://github.com/node-webot/co-wechat-api)

[co-wechat-oauth] (https://github.com/node-webot/co-wechat-oauth)

Payment method:
```js
  // 获取JS支付参数(自动下单)
  async getPayParams(params) {
    params.trade_type = params.trade_type || 'JSAPI';
    let order = await this.unifiedOrder(params);
    return this.getPayParamsByPrepay(order);
  }

  // 获取JS支付参数(通过预支付会话标志)
  getPayParamsByPrepay(params) {
    let pkg = {
      appId: this.appid,
      timeStamp: '' + (Date.now() / 1000 | 0),
      nonceStr: util.generate(),
      package: 'prepay_id=' + params.prepay_id,
      signType: params.signType || 'MD5'
    };
    pkg.paySign = this._getSign(pkg, pkg.signType);
    pkg.timestamp = pkg.timeStamp;
    return pkg;
  }

  // 获取APP支付参数(自动下单)
  async getAppParams(params) {
    params.trade_type = params.trade_type || 'APP';
    let order = await this.unifiedOrder(params);
    return this.getAppParamsByPrepay(order);
  }

  // 获取APP支付参数(通过预支付会话标志)
  getAppParamsByPrepay(params, signType) {
    let pkg = {
      appid: this.appid,
      partnerid: this.mchid,
      prepayid: params.prepay_id,
      package: 'Sign=WXPay',
      noncestr: util.generate(),
      timestamp: '' + (Date.now() / 1000 | 0)
    };
    pkg.sign = this._getSign(pkg, signType);
    return pkg;
  }
  //人脸支付微信授权
  getWxpayfaceAuthinfo(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      version: 1,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };
    return this._request(pkg, 'getWxpayfaceAuthinfo', false, 'https://payapp.weixin.qq.com');
  }

  facepay(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      spbill_create_ip: params.spbill_create_ip || this.spbill_create_ip
    };
    console.log('facepay parm :', pkg)
    return this._request(pkg, 'facepay');
  }
  // 扫码支付, 生成URL(模式一)
  getNativeUrl(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      time_stamp: '' + (Date.now() / 1000 | 0),
      nonce_str: util.generate()
    };

    let url = 'weixin://wxpay/bizpayurl'
      + '?sign=' + this._getSign(pkg)
      + '&appid=' + pkg.appid
      + '&mch_id=' + pkg.mch_id
      + '&product_id=' + pkg.product_id
      + '&time_stamp=' + pkg.time_stamp
      + '&nonce_str=' + pkg.nonce_str;
    return url;
  }

  // 免密支付
  pappayapply(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      spbill_create_ip: params.spbill_create_ip || this.spbill_create_ip
    };

    return this._request(pkg, 'pappayapply');
  }
  //查询免密协议
  querycontract(params) {
    console.log('params-----', params)
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      spbill_create_ip: params.spbill_create_ip || this.spbill_create_ip
    };

    console.log('pkg-----', pkg)

    return this._request(pkg, 'querycontract');
  }

  // 刷卡支付
  micropay(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      spbill_create_ip: params.spbill_create_ip || this.spbill_create_ip
    };

    return this._request(pkg, 'micropay');
  }

  // 撤销订单
  reverse(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };

    return this._request(pkg, 'reverse', true);
  }

  // 统一下单
  unifiedOrder(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      notify_url: params.notify_url || this.notify_url,
      spbill_create_ip: params.spbill_create_ip || this.spbill_create_ip,
      trade_type: params.trade_type || 'JSAPI'
    };

    return this._request(pkg, 'unifiedorder');
  }

  // 订单查询
  orderQuery(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };

    return this._request(pkg, 'orderquery');
  }

  // 关闭订单
  closeOrder(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };

    return this._request(pkg, 'closeorder');
  }

  // 申请退款
  refund(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      op_user_id: params.op_user_id || this.mchid,
      notify_url: params.notify_url || this.refund_url
    };
    if (!pkg.notify_url) delete pkg.notify_url;

    return this._request(pkg, 'refund', true);
  }

  // 查询退款
  refundQuery(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };

    return this._request(pkg, 'refundquery');
  }
```

## Example & Usage

```js
const path = require('path')
const config = {
    redis: {
        port: 6379,          // Redis port
        host: '127.0.0.1',   // Redis host
        password: '',
        db: 0,
    },
    oauth:{
        appid:'', 
        appsecret:'',
    },
    message:{
        appid: '',
        token: '',
        encodingAESKey: '',
    },
    api:{
        appid:'', 
        appsecret:'',
    },
    payment:{
        appid: 'wx0aebxxx366a324',
        mchid: '1xxx96561',
        partnerKey: '6AA22xxxCB9D01168F',
        spbill_create_ip: '127.0.0.1',
        notify_url: "http://xxx.pay.com/api/callback/wechatNotify",
        pfx: path.resolve("./cert/cert.p12"),
    }
}

const WechatTool = require('new-wechat-tools')
const wechat = new WechatTool(config)

// miniapp
const { body } = await wechat.miniapp.jscode2session('123131')
// oauth
const token = await wechat.oauth.getAccessToken(code)
// api
const user = await wechat.api.getUser(opeid)
// payment
const result = await wechat.payment.orderQuery({ transaction_id:'xxxx'})

```

## Questions & Suggestions

Please open an issue [here](https://github.com/yirenkeji555/new-wechat-tools/issues).

## License

[MIT](LICENSE)
