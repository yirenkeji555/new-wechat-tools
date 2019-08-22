'use strict';

const wechat = require('co-wechat');
const WechatApi = require('co-wechat-api');
const OAuth = require('co-wechat-oauth');
const Payment = require('co-wechat-payment');
const MiniApp = require('./lib/mini_app');

function WechatAll (config) {
    this.config = config
    let appId = ''
    const redis = require("redis")
    if (!config.redis){
        config.redis = {}
    }
    const redisClient = redis.createClient(config.redis)
    redisClient.set('hello_redis','excel')
    const getAccessToken = async function () {
        const raw = await redisClient.get(appId + 'wechat_access_token');
        return JSON.parse(raw);
    }

    const setAccessToken = async function (token) {
        return await redisClient.set(appId + 'wechat_access_token', JSON.stringify(token));
    }

    const getTicketToken = async function (type) {
        const raw = await redisClient.get(appId + `wechat_ticket_${type}`);
        return JSON.parse(raw);
    }

    const setTicketToken = async function (type, token) {
        return await redisClient.set(appId + `wechat_ticket_${type}`, JSON.stringify(token));
    }


    const getOAuthToken = async function (openid) {
        const raw = await redisClient.get(appId + `wechat_oauth_${openid}`);
        return JSON.parse(raw);
    }

    const setOAuthToken = async function (openid, token) {
        return await redisClient.set(appId + `wechat_oauth_${openid}`, JSON.stringify(token));
    }

    if (config.miniapp) {
        this.miniapp = new MiniApp(config.miniapp)
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
        this.payment = new Payment(Object.assign({}, {
            appId: config.payment.appid,
        }, config.payment));
    }

}
module.exports = WechatAll;