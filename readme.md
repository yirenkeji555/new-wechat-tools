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

[co-wechat-payment] (https://github.com/perzy/co-wechat-payment)

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
