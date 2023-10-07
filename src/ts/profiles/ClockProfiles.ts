import type { BaseProfiles } from '@/ts/profiles/BaseProfiles'

export interface ClockProfiles extends BaseProfiles {
  text: any
  style: any
}

export const getDefaultProfile = (): ClockProfiles => {
  const defaultProfile: ClockProfiles = {
    text: {
      1: '星期一',
      2: '星期二',
      3: '星期三',
      4: '星期四',
      5: '星期五',
      6: '星期六',
      0: '星期日'
    },
    style: {
      shadow_color: '#ff9b7f',
      font_color: '#ffffff'
    }
  }

  return defaultProfile
}
