import axios from "axios";

export default {
    giftConfigProxy() {
        return axios({
            url: "/proxy/https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig",
            baseURL: import.meta.env.VITE_PROXY_URL,
            method: "get",
            params: {
                "platform": "pc"
            }
        });
    },
    giftDataProxy(roomID = 0) {
        return axios({
            url: "/proxy/https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftData",
            baseURL: import.meta.env.VITE_PROXY_URL,
            method: "get",
            params: {
                "platform": "pc",
                "room_id": roomID
            }
        });
    }
}