'use strict';

const wechat = require('co-wechat');
const WechatApi = require('co-wechat-api');
const OAuth = require('co-wechat-oauth');
const MiniApp = require('./lib/mini_app');
const Payment = require('./lib/wechat_pay/index');

function WechatAll (config) {
    this.config = config
    let appId = ''
    const redis = require("redis")
    if (!config.redis){
        config.redis = {}
    }
    
    const redisClient = redis.createClient(config.redis)
    const getAccessToken = async function () {
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + 'wechat_access_token', function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        return JSON.parse(raw);
    }

    const setAccessToken = async function (token) {
        return await redisClient.set(appId + 'wechat_access_token', JSON.stringify(token));
    }

    const getTicketToken = async function (type) {
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + `wechat_ticket_${type}`, function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        return JSON.parse(raw);
    }

    const setTicketToken = async function (type, token) {
        return await redisClient.set(appId + `wechat_ticket_${type}`, JSON.stringify(token));
    }


    const getOAuthToken = async function (openid) {
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + `wechat_oauth_${openid}`, function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        return JSON.parse(raw);
    }

    const setOAuthToken = async function (openid, token) {
        return await redisClient.set(appId + `wechat_oauth_${openid}`, JSON.stringify(token));
    }
    const setMiniAppAccessToken = async function (appId, token, expiresTime = 7200) {
        return await redisClient.set(appId + `miniapp_token`, JSON.stringify(token), 'EX', expiresTime);
    }
    const getMiniAppAccessToken = async function (appId) {
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + `miniapp_token`, function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        return JSON.parse(raw);
    }
    if (config.miniapp) {
        this.miniapp = new MiniApp(config.miniapp, setMiniAppAccessToken, getMiniAppAccessToken)
    }

    if (config.oauth) {
        appId = config.oauth.appid
        this.oauth = new OAuth(config.oauth.appid, config.oauth.appsecret, getOAuthToken, setOAuthToken);
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
        appId = config.api.appid
        const api = new WechatApi(config.api.appid, config.api.appsecret, getAccessToken, setAccessToken);
        api.registerTicketHandle(getTicketToken, setTicketToken);
        this.api = api
    }

    if (config.payment) {
        this.payment = new Payment(config.payment);
    }

}
module.exports = WechatAll;