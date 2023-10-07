import axios from 'axios'

export default {
  giftConfigProxy() {
    return axios({
      url: '/https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig',
      baseURL: import.meta.env.VITE_PROXY_URL,
      method: 'get',
      params: {
        platform: 'pc'
      }
    })
  },
  giftDataProxy(roomID = 0, areaID = 0, areaParentID = 0) {
    let params
    if (areaID && areaID > 0) {
      params = {
        platform: 'pc',
        room_id: roomID,
        area_id: areaID,
        area_parent_id: areaParentID
      }
    } else {
      params = {
        platform: 'pc',
        room_id: roomID
      }
    }
    return axios({
      url: '/https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftData',
      baseURL: import.meta.env.VITE_PROXY_URL,
      method: 'get',
      params: params
    })
  },
  getWebAreaListProxy() {
    return axios({
      url: '/https://api.live.bilibili.com/xlive/web-interface/v1/index/getWebAreaList',
      baseURL: import.meta.env.VITE_PROXY_URL,
      method: 'get',
      params: {
        source_id: '1'
      }
    })
  }
}
