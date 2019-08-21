/**
 * Created by ference on 2017/4/8.
 */

var request = require('request');

var utl = module.exports = {};


/**
 * 发送请求 https://github.com/request/request
 * @param {Object} opts 请求参数
 * @param {String} opts.url 请求地址
 * @param {String} opts.method  GET|POST|PUT...
 * @param {String} [opts.type] text/xml | application/json | application/x-www-form-urlencoded ...
 * @param {Object} [opts.headers] {}
 * @param {Object} [opts.qs] query参数
 * @param {Buffer|String|ReadStream} [opts.body] 请求体
 * @param {Object} [opts.form] form表单
 * @returns {Promise.<Object>} resolve({response, body})
 */
utl.request = function(opts){
    return new Promise(function(resolve, reject){
        request(opts, function(err, res, body){
            if(err){
                reject(err);
                return;
            }
            var ret = {response:res, body:body};
            ret.ok = function() {
                return res.statusCode === 200;
            };
            ret.json = function () {
                if(res.body) return JSON.parse(res.body);
                return null;
            };
            resolve(ret);
        });
    });
};
