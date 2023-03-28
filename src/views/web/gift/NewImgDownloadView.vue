<template>
    <a-typography-title :level="3">礼物贴图拉取</a-typography-title>

    <a-divider/>

    <a-row justify="center">
        <a-col :span="10">
            <a-form :wrapper-col="{ span: 20}" :label-col="{ span: 2 }">

                <a-form-item label="直播间">
                    <a-radio-group v-model:value="filter.all">
                        <a-radio :value="true">所有直播间</a-radio>
                        <a-radio :value="false">
                            指定直播间 ID
                            <a-input v-model:value="roomID" style="width: 50%; margin-left: 10px"
                                     :disabled="filter.all"/>
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="分区">
                    <a-cascader v-model:value="filter.selectArea"
                                :field-names="{label: 'name', value: 'id', children:'list'}"
                                :options="areaList"
                                :disabled="filter.all"
                                :allowClear="true"/>
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

    <a-divider/>
    <div style="margin-bottom: 16px;">
        <a-button @click="loadGiftData">
            <RedoOutlined/>
            刷新数据
        </a-button>

        <a-button type="primary" @click="handleDownloadAll(giftList.list)" style="margin-left: 10px;"
                  :disabled="giftList.filtered.length<=0">
            <DownloadOutlined/>
            下载所有
        </a-button>

        <a-button style="margin-left: 10px;" disabled>
            <SettingOutlined/>
            选项
        </a-button>
    </div>

    <a-table :columns="columns"
             :data-source="giftList.filtered"
             row-key="id"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectedChange }"
             :loading="onLoading">
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
                <a-button type="primary" size="small" @click="handleTableDownload(record['id'])"
                          style="margin-right: 10px">
                    <template #icon>
                        <DownloadOutlined/>
                    </template>
                    下载
                </a-button>

                <a-button size="small" @click="handleRAWInfo(record['id'])">
                    <template #icon>
                    </template>
                    礼物信息 (RAW)
                </a-button>
            </template>


        </template>

    </a-table>


</template>

<script>
import {reactive, ref, toRefs, onBeforeMount} from "vue";
import {Modal} from "ant-design-vue";
import {DownloadOutlined, SettingOutlined, RedoOutlined} from '@ant-design/icons-vue'

import axios from "axios";
import JSZip from "jszip";

import BLiveAPIProxy from "@/api/BLiveAPIProxy";
import FileUtils from "@/utils/FileUtils";

export default {
    name: "NewImgDownload",
    components: {
        DownloadOutlined,
        SettingOutlined,
        RedoOutlined
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

        const filter = reactive({
            all: true,
            roomID: 0,
            coin_type: {
                gold: true,
                silver: true
            },
            selectArea: [],
        })

        const giftList = reactive({
            original: [],
            filtered: [],
            list: [],
            map_all: new Map(),
        });

        const state = reactive({
            selectedRowKeys: [],
        });

        const areaList = ref([]);

        const onLoading = ref(false);

        const progressPercent = ref(0);

        const roomID = ref(0);

        onBeforeMount(() => {
            loadGiftData();
        });

        const loadGiftData = () => {
            onLoading.value = true;

            // 加载礼物数据
            BLiveAPIProxy.giftConfigProxy(progressPercent).then(r => {
                // Response Body
                const responseBody = r.data;

                // 原始礼物列表
                giftList.original = responseBody['data']['list'];

                const tempCorner_mark_list = [];

                giftList.original.forEach(gift => {
                    // 生成 tempCorner_mark_list

                    if (gift['corner_mark'] !== '' && !tempCorner_mark_list.includes(gift['corner_mark'])) {
                        tempCorner_mark_list.push(gift['corner_mark'])
                    }

                    // 生成 Gift Map
                    giftList.map_all.set(gift['id'], gift);
                });

                // 设置 filtered list， 默认是没有任何过滤条件
                giftList.filtered = giftList.original;

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

            // 加载分区数据
            BLiveAPIProxy.getWebAreaListProxy().then(r => {
                // Response Body
                const responseBody = r.data;

                areaList.value = responseBody['data']['data']

                console.log(responseBody['data']['data']);

            }).catch(e => {
                Modal.error({
                    title: '请求失败',
                    content: e.response ? e.response : '网络错误',
                });
            })
        }

        /**
         * 应用过滤器
         */
        const handleFilter = () => {
            giftList.filtered = giftList.original;

            // 这部分处理 room 过滤器
            if (!filter.all) {
                BLiveAPIProxy.giftDataProxy(Number(roomID.value), Number(filter.selectArea[1]), Number(filter.selectArea[0])).then(r => {
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

                    // 应用过滤器
                    giftList.filtered = giftList.filtered.filter(item => roomGiftIDList.includes(item['id']));

                })
            }

            // 这部分处理 coin_type
            // 如果都选中了，还过滤啥？
            if (!(filter.coin_type.gold && filter.coin_type.silver)) {
                if (filter.coin_type.gold) {
                    giftList.filtered = giftList.filtered.filter(item => String(item['coin_type']) === 'gold');
                } else if (filter.coin_type.silver) {
                    giftList.filtered = giftList.filtered.filter(item => String(item['coin_type']) === 'silver');
                }
            }
        }

        /**
         * 处理表单选中项
         */
        const handleSelectedChange = selectedRowKeys => {
            state.selectedRowKeys = selectedRowKeys;
        };

        /**
         * 处理表单中下载按钮事件
         */
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
        }

        /**
         * 处理显示礼物信息
         * @param giftID
         */
        const handleRAWInfo = giftID => {
            Modal.info({
                title: '礼物信息',
                content: JSON.stringify(giftList.map_all.get(giftID)),
                width: '1000px'
            });
        }

        /**
         * 下载所有礼物贴图
         * @param list
         */
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
                });
            });
        }

        return {
            columns,
            filter,
            giftList,
            areaList,
            onLoading,
            progressPercent,
            roomID,
            handleFilter,
            loadGiftData,
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