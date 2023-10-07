<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Modal } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { DownloadOutlined, SettingOutlined, RedoOutlined } from '@ant-design/icons-vue'

import BLiveAPIProxy from '@/api/BLiveAPIProxy'
import type { GiftFilter, GiftList, TableDataType } from '@/utils/GiftImgDownload'

// 表格列
const columns: TableColumnType<TableDataType>[] = [
  {
    title: '礼物 ID',
    dataIndex: 'id',
    width: '120px',
    defaultSortOrder: 'ascend',
    sorter: (a: TableDataType, b: TableDataType) => a.id - b.id
  },
  {
    title: '图片',
    dataIndex: 'img_basic',
    width: '120px'
  },
  {
    title: '礼物名称',
    dataIndex: 'name'
  },
  {
    title: '类型',
    dataIndex: 'coin_type',
    width: '200px'
  },
  {
    title: '价值',
    dataIndex: 'price',
    width: '200px'
  },
  {
    title: '操作',
    key: 'operate',
    width: '300px'
  }
]

// 过滤器
const filter = reactive<GiftFilter>({
  all: true,
  room_id: 0,
  coin_type: {
    gold: true,
    silver: true
  },
  select_area: []
})

// 礼物列表
const giftList = reactive<GiftList>({
  original: [],
  filtered: [],
  map_all: new Map()
})

// 分区列表
const areaList = ref([])

// 加载状态
const onLoading = ref<boolean>(false)

// 直播间 ID
const roomID = ref<number>(0)

onMounted(() => {
  loadGiftData()
})

/**
 * 加载礼物数据
 */
const loadGiftData = () => {
  onLoading.value = true

  // 发起网络请求
  BLiveAPIProxy.giftConfigProxy()
    .then((r: any) => {
      // Response Body
      const responseBody = r.data

      // 原始礼物列表
      giftList.original = responseBody['data']['list']

      // 生成 Gift Map
      giftList.original.forEach((gift) => {
        giftList.map_all.set(gift['id'], gift)
      })

      // 设置 filtered list， 默认是没有任何过滤条件
      giftList.filtered = giftList.original

      // 设置 onLoading 状态
      onLoading.value = false
    })
    .catch((e: any) => {
      Modal.error({
        title: '礼物列表加载失败',
        content: e.response ? e.response : '网络错误'
      })

      // 设置 onLoading 状态
      onLoading.value = false
    })

  // 加载分区数据
  BLiveAPIProxy.getWebAreaListProxy()
    .then((r: any) => {
      // Response Body
      const responseBody = r.data

      areaList.value = responseBody['data']['data']
    })
    .catch((e: any) => {
      Modal.error({
        title: '分区列表加载失败',
        content: e.response ? e.response : '网络错误'
      })
    })
}

/**
 * 应用过滤器
 */
const handleFilter = () => {
  giftList.filtered = giftList.original

  // 这部分处理 room 过滤器
  if (!filter.all) {
    BLiveAPIProxy.giftDataProxy(
      roomID.value,
      Number(filter.select_area[1]),
      Number(filter.select_area[0])
    ).then((r: any) => {
      // Response Body
      const responseBody = r.data
      // 礼物大列表
      const data = responseBody['data']
      // 房间礼物 ID 列表
      let roomGiftIDList: any = []

      // 获取金瓜子 (电池) 礼物 ['room_gift_list']['gold_list']
      data['room_gift_list']['gold_list'].forEach((goldGift: any) => {
        roomGiftIDList.push(goldGift['gift_id'])
        // 金瓜子礼物可能包含可升级礼物，要对这部分进行处理
        if (goldGift['upgrade_gift']) {
          goldGift['upgrade_gift'].forEach((j: any) => {
            roomGiftIDList.push(j['gift_id'])
          })
        }
      })

      // 获取银瓜子礼物 ['room_gift_list']['silver_list']
      data['room_gift_list']['silver_list'].forEach((silverGift: any) => {
        roomGiftIDList.push(silverGift['gift_id'])
      })

      // 获取特定标签下的礼物列表 ['tab_list']
      // 先遍历有多少个 tab
      data['tab_list'].forEach((tabGift: any) => {
        // 获取当前标签下礼物列表
        tabGift['list'].forEach((j: any) => {
          roomGiftIDList.push(j['gift_id'])
        })
      })

      // 获取特殊礼物 ['special_show_gift']
      data['special_show_gift'].forEach((specialGift: any) => {
        roomGiftIDList.push(specialGift['gift_id'])
      })

      // 应用过滤器
      giftList.filtered = giftList.filtered.filter((item) => roomGiftIDList.includes(item['id']))
    })
  }

  // 这部分处理 coin_type
  // 如果都选中了，还过滤啥？
  if (!(filter.coin_type.gold && filter.coin_type.silver)) {
    if (filter.coin_type.gold) {
      giftList.filtered = giftList.filtered.filter((item) => String(item['coin_type']) === 'gold')
    } else if (filter.coin_type.silver) {
      giftList.filtered = giftList.filtered.filter((item) => String(item['coin_type']) === 'silver')
    }
  }
}

/**
 * 处理表单中下载按钮事件
 */
const handleTableDownload = (giftID: number) => {
  axios({
    url: giftList.map_all.get(giftID)['img_basic'],
    method: 'get',
    responseType: 'blob'
  })
    .then((r) => {
      saveAs(r.data, giftList.map_all.get(giftID)['name'] + '.png')
    })
    .catch((e) => {
      Modal.error({
        title: '请求失败',
        content: e.response ? e.response : '网络错误'
      })
    })
}

/**
 * 处理显示礼物信息
 * @param giftID
 */
const handleRAWInfo = (giftID: number) => {
  Modal.info({
    title: '礼物信息',
    content: JSON.stringify(giftList.map_all.get(giftID)),
    width: '1000px'
  })
}

/**
 * 下载所有礼物贴图
 * @param list
 * @param imageType
 */
const handleDownloadAll = (list: any, imageType = 'png') => {
  if (list.length === 0) {
    Modal.error({ title: '贴图下载失败', content: '请先拉取贴图' })
    return
  }

  if (list.length > 150) {
    Modal.info({ title: '提示', content: '贴图列表较大，下载可能需要等待一段时间' })
  }

  // 创建 ZIP 对象
  const zipFile = new JSZip()

  const promiseList: any = []

  list.forEach((i: any) => {
    // 下载URL与文件名
    let imageDownloadURL,
      imageSaveName = ''

    switch (imageType) {
      case 'gif': {
        imageDownloadURL = i['gif'].replaceAll('i0.hdslb.com', 's1.hdslb.com')
        imageSaveName = i['name'] + '.gif'
        break
      }
      case 'png': {
        imageDownloadURL = i['img_basic']
        imageSaveName = i['name'] + '.png'
      }
    }

    promiseList.push(
      axios({
        url: imageDownloadURL,
        method: 'get',
        responseType: 'blob'
      }).then((r) => {
        zipFile.file(imageSaveName, r.data)
      })
    )
  })

  Promise.all(promiseList).then(() => {
    zipFile.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `贴图-${imageType}.zip`)
    })
  })
}
</script>

<template>
  <a-typography-title :level="3">礼物贴图拉取</a-typography-title>

  <a-divider />

  <a-row justify="center">
    <a-col :span="10">
      <a-form :wrapper-col="{ span: 20 }" :label-col="{ span: 2 }">
        <a-form-item label="直播间">
          <a-radio-group v-model:value="filter.all">
            <a-radio :value="true">所有直播间</a-radio>
            <a-radio :value="false">
              指定直播间 ID
              <a-input
                v-model:value="roomID"
                style="width: 50%; margin-left: 10px"
                :disabled="filter.all"
              />
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="分区">
          <a-cascader
            v-model:value="filter.select_area"
            :field-names="{ label: 'name', value: 'id', children: 'list' }"
            :options="areaList"
            :disabled="filter.all"
            :allowClear="true"
          />
        </a-form-item>

        <a-form-item label="类型">
          <a-checkbox v-model:checked="filter.coin_type.gold">电池</a-checkbox>
          <a-checkbox v-model:checked="filter.coin_type.silver">银瓜子</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 20, offset: 2 }">
          <a-button type="primary" @click="handleFilter">应用筛选</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>

  <a-divider />
  <div style="margin-bottom: 16px">
    <a-button @click="loadGiftData">
      <RedoOutlined />
      刷新数据
    </a-button>

    <a-button
      type="primary"
      @click="handleDownloadAll(giftList.filtered)"
      style="margin-left: 10px"
      :disabled="giftList.filtered.length <= 0"
    >
      <DownloadOutlined />
      下载所有
    </a-button>

    <a-button
      type="primary"
      @click="handleDownloadAll(giftList.filtered, 'gif')"
      style="margin-left: 10px"
      :disabled="giftList.filtered.length <= 0"
    >
      <DownloadOutlined />
      下载所有 (GIF)
    </a-button>

    <a-button style="margin-left: 10px" disabled>
      <SettingOutlined />
      选项
    </a-button>
  </div>

  <a-table :columns="columns" :data-source="giftList.filtered" row-key="id" :loading="onLoading">
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'img_basic'">
        <a-image :src="text" width="60px"></a-image>
      </template>

      <template v-if="column.dataIndex === 'coin_type'">
        <a-tag color="gold" v-if="text === 'gold'">
          <template #icon>
            <img alt="电池" src="/img/电池.png" style="margin-top: -5px; width: 16px" />
          </template>
          电池
        </a-tag>
        <a-tag color="" v-else-if="text === 'silver'">
          <img alt="银瓜子" src="/img/银瓜子.svg" style="margin-top: -5px; width: 16px" />
          银瓜子
        </a-tag>
      </template>

      <template v-if="column.dataIndex === 'price'">
        <template v-if="record['coin_type'] === 'gold'">
          {{ text / 1000 + ' 元' }} / {{ text / 100 + ' 电池' }}
        </template>
        <template v-if="record['coin_type'] === 'silver'">
          {{ text + ' 银瓜子' }}
        </template>
      </template>

      <template v-if="column.key === 'operate'">
        <a-button
          type="primary"
          size="small"
          @click="handleTableDownload(record['id'])"
          style="margin-right: 10px"
        >
          <template #icon>
            <DownloadOutlined />
          </template>
          下载 (PNG)
        </a-button>

        <a-button size="small" @click="handleRAWInfo(record['id'])">
          <template #icon></template>
          礼物信息 (RAW)
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<style scoped></style>
