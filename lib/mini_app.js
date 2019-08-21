/**
 * Created by ference on 2017/4/8.
 */
var utl = require('./utl');
var WXBizDataCrypt = require('./WXBizDataCrypt')

const jscode2sessionUrl = 'https://api.weixin.qq.com/sns/jscode2session';
/**
 *
 * @param {Object} opts
 * @param {String} opts.appId  appId
 * @param {String} opts.appSecret  appSecret
 * @constructor
 */
function MiniApp(opts) {
    this.appId = opts.appId;
    this.appSecret = opts.appSecret;
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

module.exports = MiniApp;
