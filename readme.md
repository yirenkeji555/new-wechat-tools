# new-wechat-tools

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/new-wechat-tools.svg?style=flat-square
[npm-url]: https://npmjs.org/package/new-wechat-tools
[travis-image]: https://img.shields.io/travis/eggjs/new-wechat-tools.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/new-wechat-tools
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/new-wechat-tools.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/new-wechat-tools?branch=master
[david-image]: https://img.shields.io/david/eggjs/new-wechat-tools.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/new-wechat-tools
[snyk-image]: https://snyk.io/test/npm/new-wechat-tools/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/new-wechat-tools
[download-image]: https://img.shields.io/npm/dm/new-wechat-tools.svg?style=flat-square
[download-url]: https://npmjs.org/package/new-wechat-tools

<!--
Description here.
-->

## Install

```bash
$ npm i new-wechat-tools --save
```

## Usage

```js
exports.wechatAll = {
  appid: '',
  appsecret: '',
  token: '',
  encodingAESKey: '',
  payment: {
    partnerKey: '',
    mchId: '',
    notifyUrl: '',
    pfx: '',
  },
  modules: {
    message: true,  // enable or disable co-wechat
    api: true,  // enable or disable co-wechat-api
    oauth: true,  // enable or disable co-wechat-oauth
    payment: true,  // enable or disable co-wechat-payment
  },
;
```

see [config/config.default.js](config/config.default.js) for more details.

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

[co-wechat-payment] (https://github.com/perzy/co-wechat-payment)

## Example

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
        appid: '',
        partnerKey: '6Axxx9D01168F',
        mchId: '15xxx561',
        notifyUrl: "http://a.com/api/callback/wechatNotify",
        pfx: path.resolve("./cert/1xxx01.p12"),
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
const user = await wechat.payment.unifiedOrder({
	body: 'js H5支付',
	out_trade_no: '20160701'+Math.random().toString().substr(2, 10),
	total_fee: 1, // 1分钱
	spbill_create_ip: '10.10.10.10',
	notify_url: 'http://xx.xx.xx/wxpay/notify/',
	trade_type: 'JSAPI',
	product_id: '1234567890'
})

```

## Questions & Suggestions

Please open an issue [here](https://github.com/yirenkeji555/new-wechat-tools/issues).

## License

[MIT](LICENSE)
