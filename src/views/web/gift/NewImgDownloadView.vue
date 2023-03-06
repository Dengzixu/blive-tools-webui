<template>
  <a-typography-title>礼物贴图</a-typography-title>

  <a-divider/>

  <a-row justify="center">
    <a-col :span="10">
      <a-input-group compact>
        <a-input v-model:value="roomID"
                 addon-before="房间号"
                 placeholder="输入要拉取贴图的房间号, 0 代表所有拉取所有贴图"
                 style="width: 80%"/>
        <a-button type="primary" @click="handlePullImage" :loading="onLoading">拉取</a-button>
      </a-input-group>
    </a-col>
  </a-row>

  <a-divider/>
  <div style="margin-bottom: 16px;">
    <a-button type="primary" @click="handleDownloadAll(giftList.list)" :disabled="giftList.list.length<=0">
      <DownloadOutlined/>
      下载所有
    </a-button>

    <a-button style="margin-left: 10px;" disabled>
      <SettingOutlined/>
      选项
    </a-button>
  </div>

  <a-table :columns="columns"
           :data-source="giftList.list"
           row-key="id"
           :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectedChange }">
    <template #bodyCell="{text, record, index, column}">

      <template v-if="column.dataIndex === 'img_basic'">
        <a-image :src="text" width="60px"></a-image>
      </template>

      <template v-if="column.dataIndex === 'coin_type'">
        <a-tag color="gold" v-if="text === 'gold'">
          <template #icon>
            <img alt="电池" src="/img/电池.png" style="margin-top: -5px;width: 16px;">
          </template>
          电池
        </a-tag>
        <a-tag color="" v-else-if="text === 'silver'">
          <img alt="银瓜子" src="/img/银瓜子.svg" style="margin-top: -5px;width: 16px;">
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
        <a-button type="primary" size="small" @click="handleTableDownload(record['id'])" style="margin-right: 10px">
          <template #icon>
            <DownloadOutlined/>
          </template>
          下载
        </a-button>

        <a-button type="" size="small" @click="handleRAWInfo(record['id'])">
          <template #icon>
          </template>
          礼物信息 (RAW)
        </a-button>
      </template>


    </template>

  </a-table>


</template>

<script>
import {reactive, ref, toRefs, unref} from "vue";
import {Modal} from "ant-design-vue";
import {DownloadOutlined, SettingOutlined} from '@ant-design/icons-vue'

import axios from "axios";

import JSZip from "jszip";

import BLiveAPIProxy from "@/api/BLiveAPIProxy";
import FileUtils from "@/utils/FileUtils";

export default {
  name: "NewImgDownload",
  components: {
    DownloadOutlined,
    SettingOutlined
  },
  setup() {
    const columns = [
      {
        title: '礼物 ID',
        dataIndex: 'id',
        width: '120px',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.id - b.id,
      }, {
        title: '图片',
        dataIndex: 'img_basic',
        width: "120px"
      }, {
        title: '礼物名称',
        dataIndex: 'name',
      }, {
        title: '类型',
        dataIndex: 'coin_type',
        width: '200px'
      }, {
        title: '价值',
        dataIndex: 'price',
        width: '200px'
      }, {
        title: '操作',
        key: 'operate',
        width: '300px'
      }];

    const onLoading = ref(false);

    const roomID = ref(0);
    let giftList = reactive({
      list: [],
      map_all: new Map(),
    });

    const state = reactive({
      selectedRowKeys: [],
    });

    const handlePullImage = () => {
      // 清空原始列表
      giftList.list = [];
      giftList.map_all = new Map();

      // 设置 onLoading 状态
      onLoading.value = true;

      // 获取礼物列表
      BLiveAPIProxy.giftConfigProxy().then(r => {
        // Response Body
        const responseBody = r.data;

        // 原始礼物列表
        const originalGiftList = responseBody['data']['list'];

        // Gift Map
        const giftMap = new Map();
        originalGiftList.forEach(gift => {
          giftMap.set(gift['id'], gift);
        });

        giftList.map_all = giftMap;

        if (Number(roomID.value) === 0) {
          giftList.list = originalGiftList;
        } else {
          // 过滤房间数据
          // 获取房间礼物列表
          BLiveAPIProxy.giftDataProxy(roomID.value).then(r => {
            const responseBody = r.data;

            let roomGiftIDList = [];

            // 礼物大列表
            const data = responseBody['data'];

            // 获取金瓜子 (电池) 礼物 ['room_gift_list']['gold_list']
            data['room_gift_list']['gold_list'].forEach(i => {
              roomGiftIDList.push(i['gift_id']);
              // 金瓜子礼物可能包含可升级礼物，要对这部分进行处理
              if (i['upgrade_gift']) {
                i['upgrade_gift'].forEach(j => {
                  roomGiftIDList.push(j['gift_id']);
                });
              }
            });

            // 获取银瓜子礼物 ['room_gift_list']['silver_list']
            data['room_gift_list']['silver_list'].forEach(i => {
              roomGiftIDList.push(i['gift_id']);
            });

            // 获取特定标签下的礼物列表 ['tab_list']
            // 先遍历有多少个 tab
            data['tab_list'].forEach(i => {
              // 获取当前标签下礼物列表
              i['list'].forEach(j => {
                roomGiftIDList.push(j['gift_id']);
              });
            });

            // 获取特殊礼物 ['special_show_gift']
            data['special_show_gift'].forEach(i => {
              roomGiftIDList.push(i['gift_id']);
            });

            // 将 ID List 转换成 Gift List
            roomGiftIDList.forEach(id => {
              giftList.list.push(giftMap.get(id));
            });

          });
        }
        // 设置 onLoading 状态
        onLoading.value = false;
      }).catch(e => {
        Modal.error({
          title: '请求失败',
          content: e.response ? e.response : '网络错误',
        });
        // 设置 onLoading 状态
        onLoading.value = false;
      });

    }

    const handleSelectedChange = selectedRowKeys => {
      state.selectedRowKeys = selectedRowKeys;
    };

    const handleTableDownload = giftID => {
      axios({
        url: giftList.map_all.get(giftID)['img_basic'],
        method: "get",
        responseType: 'blob'
      }).then(r => {
        FileUtils.saveBlob(giftList.map_all.get(giftID)['name'] + '.png', r.data).then()
      }).catch(e => {
        Modal.error({
          title: '请求失败',
          content: e.response ? e.response : '网络错误',
        });
      });
      ;

    }

    const handleRAWInfo = giftID => {


      Modal.info({
        title: '礼物信息',
        content: JSON.stringify(giftList.map_all.get(giftID)),
        width: '1000px'
      })
    }

    const handleDownloadAll = (list) => {
      if (list.length === 0) {
        Modal.error({title: '贴图下载失败', content: '请先拉取贴图'});
        return;
      }

      if (list.length > 150) {
        Modal.info({title: '提示', content: '贴图列表较大，下载可能需要等待一段时间',});
      }

      // 创建 ZIP 对象
      const zipFile = new JSZip();

      const promiseList = [];

      // 循环请求
      list.forEach(i => {
        promiseList.push(axios({
          url: i['img_basic'],
          method: "get",
          responseType: 'blob'
        }).then(r => {
          zipFile.file(i['name'] + '.png', r.data);
        }));
      })

      Promise.all(promiseList).then(() => {
        zipFile.generateAsync({type: "blob"}).then(content => {
          FileUtils.saveBlob('贴图.zip', content);
        })
      });
    }

    return {
      columns,
      onLoading,
      roomID,
      giftList,
      handlePullImage,
      handleSelectedChange,
      handleTableDownload,
      handleRAWInfo,
      handleDownloadAll,
      ...toRefs(state)
    }
  },
}
</script>

<style scoped>

</style>