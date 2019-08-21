'use strict';

const wechat = require('co-wechat');
const WechatApi = require('co-wechat-api');
const OAuth = require('co-wechat-oauth');
const Payment = require('co-wechat-payment');
const MiniApp = require('./lib/mini_app');
const redis = require("redis")
const Cache = require('./lib/cache')


function WechatAll (config) {
    this.config = config
    const client = redis.createClient(this.config.redis)
    const cache = new Cache(client);
    if (config.miniapp) {
        this.miniapp = new MiniApp(config.miniapp)
    }

    if (config.oauth) {
        this.oauth = new OAuth(config.oauth.appid, config.oauth.appsecret, cache.getOAuthToken, cache.setOAuthToken);
    }
    if (config.message) {
        const msgWechat = wechat({
            appid: config.message.appid,
            token: config.message.token,
            encodingAESKey: config.message.encodingAESKey,
        })
        this.message = msgWechat.middleware.bind(msgWechat);
    }
    if (config.api) {
        const api = new WechatApi(config.appid, config.appsecret, cache.getAccessToken, cache.setAccessToken);
        api.registerTicketHandle(cache.getTicketToken, cache.setTicketToken);
        this.api = api
    }

    if (config.payment) {
        this.payment = new Payment(Object.assign({}, {
            appId: config.payment.appid,
        }, config.payment));
    }

}
module.exports = WechatAll;