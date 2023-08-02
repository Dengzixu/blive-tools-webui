export interface GiftFilter {
  all: boolean
  room_id: number
  coin_type: {
    gold: boolean
    silver: boolean
  }
  select_area: Array<any>
}

export interface GiftList {
  original: Array<any>
  filtered: Array<any>
  map_all: Map<number, any>
}

export type TableDataType = {
  id: number
  name: string
  coin_type: string
  price: number
}
