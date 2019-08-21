class Cache {
    constructor(redis) {
        this.redis = redis
    }
    static async get (key) {
        try {
            const raw = await this.redis.get(key);
            return JSON.parse(raw);
        } catch (e) {
            throw (e);
        }
    }

    static async set (key, value) {
        try {
            await this.redis.set(key, JSON.stringify(value));
        } catch (e) {
            throw (e);
        }
    }

    static async getAccessToken () {
        return await Cache.get('wechat_access_token');
    }

    static async setAccessToken (token) {
        await Cache.set('wechat_access_token', token);
    }

    static async getTicketToken (type) {
        return await Cache.get(`wechat_ticket_${type}`);
    }

    static async setTicketToken (type, token) {
        await Cache.set(`wechat_ticket_${type}`, token);
    }

    static async getOAuthToken (openid) {
        return await Cache.get(`wechat_oauth_${openid}`);
    }

    static async setOAuthToken (openid, token) {
        await Cache.set(`wechat_oauth_${openid}`, token);
    }
}
module.exports = Cache;