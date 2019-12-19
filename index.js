'use strict';

const wechat = require('co-wechat');
const WechatApi = require('co-wechat-api');
const OAuth = require('co-wechat-oauth');
const MiniApp = require('./lib/mini_app');
const Payment = require('./lib/wechat_pay/index');

function WechatAll (config) {
    let appId = ''
    let redisConfig = config.redis
    if (!redisConfig) {
        redisConfig = {}
    }
    
    const getAccessToken = async function () {
        const redis = require("redis")
        const redisClient = redis.createClient(redisConfig)
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + 'wechat_access_token', function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        redisClient.quit()
        return JSON.parse(raw);
    }

    const setAccessToken = async function (token) {
        const redis = require("redis")
        const redisClient = redis.createClient(redisConfig)
        let rs = await redisClient.set(appId + 'wechat_access_token', JSON.stringify(token));
        redisClient.quit()
        return rs
    }

    const getTicketToken = async function (type) {
        const redis = require("redis")
        const redisClient = redis.createClient(redisConfig)
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + `wechat_ticket_${type}`, function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        redisClient.quit()
        return JSON.parse(raw);
    }

    const setTicketToken = async function (type, token) {
        const redis = require("redis")
        const redisClient = redis.createClient(redisConfig)
        const rs =  await redisClient.set(appId + `wechat_ticket_${type}`, JSON.stringify(token));
        redisClient.quit()
        return rs
    }


    const getOAuthToken = async function (openid) {
        const redis = require("redis")
        const redisClient = redis.createClient(redisConfig)
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + `wechat_oauth_${openid}`, function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        redisClient.quit()
        return JSON.parse(raw);
    }

    const setOAuthToken = async function (openid, token) {
        const redis = require("redis")
        const redisClient = redis.createClient(redisConfig)
        const rs = await redisClient.set(appId + `wechat_oauth_${openid}`, JSON.stringify(token));
        redisClient.quit()
        return rs
    }
    const setMiniAppAccessToken = async function (appId, token, expiresTime = 7200) {
        const redis = require("redis")
        console.log('createClient')
        const redisClient = redis.createClient(redisConfig) 
        console.log('createClient in ', redisClient)
        const rs = await redisClient.set(appId + `miniapp_token`, JSON.stringify(token), 'EX', expiresTime);
        redisClient.quit()
        console.log('createClient quit ', redisClient)
        return rs
    }
    const getMiniAppAccessToken = async function (appId) {
        const redis = require("redis")
        const redisClient = redis.createClient(redisConfig) 
        const raw = await new Promise(function (resolve, reject) {
            redisClient.get(appId + `miniapp_token`, function (err, value) {
                if (err) throw err;
                resolve(value);
            })
        });
        redisClient.quit()
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