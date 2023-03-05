import axios from "axios";

export default {
    giftConfigProxy() {
        return axios({
            url: "http://localhost:25501/proxy/https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig",
            method: "get",
            params: {
                "platform": "pc"
            }
        });
    },
    giftDataProxy(roomID = 0) {
        return axios({
            url: "http://localhost:25501/proxy/https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftData",
            method: "get",
            params: {
                "platform": "pc",
                "room_id": roomID
            }
        });
    }
}