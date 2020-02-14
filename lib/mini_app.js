/**
 * Created by ference on 2017/4/8.
 */
var utl = require('./utl');
var WXBizDataCrypt = require('./WXBizDataCrypt')

const jscode2sessionUrl = 'https://api.weixin.qq.com/sns/jscode2session';
const accessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
const sendTplUrl = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send';
const sendSubUrl = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send';
/**
 *
 * @param {Object} opts
 * @param {String} opts.appId  appId
 * @param {String} opts.appSecret  appSecret
 * @constructor
 */
function MiniApp (opts, setMiniAppAccessToken, getMiniAppAccessToken) {
    this.appId = opts.appId;
    this.appSecret = opts.appSecret;
    this.setMiniAppAccessToken = setMiniAppAccessToken 
    this.getMiniAppAccessToken = getMiniAppAccessToken 
}

var props = MiniApp.prototype;

props.jscode2session = function (jscode) {
    console.log('jscode2session', this.appId, this.appSecret);
    const params = `appid=${this.appId}&secret=${this.appSecret}&js_code=${jscode}&grant_type=authorization_code`;
    return utl.request({
        method: 'GET',
        url: jscode2sessionUrl + '?' + params
    });
};

props.decryptData = function (encryptedData, iv, sessionKey) {
    var pc = new WXBizDataCrypt(this.appId, sessionKey)
    return pc.decryptData(encryptedData, iv)
};
/**
 * {
        "touser": "o__Sf4n0QY-7kc3-GgBpU1irXN2U",
        "template_id": "c4Gvd0aCQRQCO4iuymNIhppPTU6JvEFpaqaPo8wRDnM",
        "form_id": "ad0f3ef7753e48968158806259ead732",
        "data": {
            "keyword1": {
                "value": "大媚眼术",
                "color": "#173177"
            },
            "keyword2": {
                "value": "2016年8月8日"
            }
        }
    }
 */
props.sendTplMessage = async function (body) {
    let token = await this.getMiniAppAccessToken(this.appId)
    if (!token) {
        var params = `grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`
        var accessData = await utl.request({
            method: 'GET',
            url: accessTokenUrl + '?' + params
        });
        if (accessData.body) {
            const res = JSON.parse(accessData.body)
            if (res.access_token) {
                token = res.access_token
                this.setMiniAppAccessToken(this.appId, res.access_token, res.expires_in)
            }
        }
    }
    if(token) {
        var params = `access_token=${token}`
        var res = await utl.request({
            method: 'POST',
            url: sendTplUrl + '?' + params,
            body: JSON.stringify(body),
            type:'application/json',
            headers: {
                "Content-type": "application/json;charset=UTF-8", 
                "Accept": "application/json", 
                "Cache-Control": "no-cache", 
                "Pragma": "no-cache"
            }
        });
        return JSON.parse(res.body)
    }
    return {
        "errcode": 400,
        "errmsg": "获取access token失败"
    }
}
/**
 * {
  "touser": "OPENID",
  "template_id": "TEMPLATE_ID",
  "page": "index",
  "data": {
      "number01": {
          "value": "339208499"
      },
      "date01": {
          "value": "2015年01月05日"
      },
      "site01": {
          "value": "TIT创意园"
      } ,
      "site02": {
          "value": "广州市新港中路397号"
      }
  }
}
 */
props.sendSubMessage = async function (body) {
    let token = await this.getMiniAppAccessToken(this.appId)
    if (!token) {
        var params = `grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`
        var accessData = await utl.request({
            method: 'GET',
            url: accessTokenUrl + '?' + params
        });
        if (accessData.body) {
            const res = JSON.parse(accessData.body)
            if (res.access_token) {
                token = res.access_token
                this.setMiniAppAccessToken(this.appId, res.access_token, res.expires_in)
            }
        }
    }
    if (token) {
        var params = `access_token=${token}`
        var res = await utl.request({
            method: 'POST',
            url: sendSubUrl + '?' + params,
            body: JSON.stringify(body),
            type: 'application/json',
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            }
        });
        return JSON.parse(res.body)
    }
    return {
        "errcode": 400,
        "errmsg": "获取access token失败"
    }
}
module.exports = MiniApp;
