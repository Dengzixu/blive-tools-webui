import type { BaseProfiles } from '@/ts/profiles/BaseProfiles'

export interface TimerProfiles extends BaseProfiles {
  websocket_server: string
  image_server: string
  init_time: number
  style: TimerStyleProfile
  gift_list: Array<GiftItem>
}

export interface TimerStyleProfile {
  font_color: string
  out_shadow_color: string
  out_shadow_transparency: number
  inner_shadow_color: string
  inner_shadow_transparency: number
}

export interface GiftItem {
  gift_name: string
  num: number
  op: string
  operate?: string
  op_value: number
  value?: number
  id: number
}

export const getDefaultProfile = (): TimerProfiles => {
  const defaultGiftItem: GiftItem = {
    gift_name: '小花花',
    num: 1,
    op: 'TIME_ADD',
    operate: 'TIME_ADD',
    op_value: 60,
    value: 60,
    id: Date.now()
  }

  const giftItems: Array<GiftItem> = new Array<GiftItem>()
  giftItems.push(defaultGiftItem)

  const defaultTimerStyleProfile: TimerStyleProfile = {
    font_color: '#ffffff',
    out_shadow_color: '#646464',
    out_shadow_transparency: 60,
    inner_shadow_color: '#646464',
    inner_shadow_transparency: 60
  }

  const defaultTimerProfile: TimerProfiles = {
    websocket_server: import.meta.env.VITE_WS_SERVER_URL,
    image_server: import.meta.env.VITE_IMG_SERVER_URL,
    init_time: 7200,
    style: defaultTimerStyleProfile,
    gift_list: giftItems
  }

  return defaultTimerProfile
}
