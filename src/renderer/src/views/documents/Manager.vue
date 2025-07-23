
<template>
    <h1>文档管理</h1>
    <!-- {{ users.data }} -->
    <!-- <router-link to="/users/add" class="btn btn-sm btn-success mb-2">Add User</router-link> -->
     <div class="main-container">
        <div class="upload-title">
            <span>上传文档</span>
        </div>
        <div class="upload-panel" @click="uploadDialogShow">
            <div style="padding: 30px 0;">
                <div style="padding: 5px; line-height: 45px;">
                    <img :src="folderSrc" width="68px" height="68px" alt="upload-pic"/>
                </div>
                <p>支持Word/Excel/PPT/PDF，不超过100M</p>
            </div>
            <input type="file" ref="fileToUpload" id="fileToUpload" style="display: none"
                    @change="changeFile">
        </div>
        <div class="file-title" v-if="filename">
            <span>{{ filename }}</span>
        </div>
        <div class="progress-wrapper" v-if="processFlag">
            <div class="pro" :style="uploadProcess | processStyle"></div>
        </div>

        <div class="upload-button" style="width: 180px; height: 45px; border: 2px solid #000;
            background: #FFF7D6;
            box-shadow: 0 0 10px 0 rgba(129,100,0,0.3);
            border-radius: 8px;
            display: flex;
            justify-content: center;
            "
                @click="uploadFile"
        >
            <div style="padding: 5px; line-height: 45px;">
                <img :src="buttonSrc" width="24px" height="28px" alt="pic"/>
            </div>
            <span
                style="line-height: 45px; color: #000; font-size: 16px; font-weight: 600;"
            >点我上传文档</span>
        </div>
    </div>
    <table class="table table-striped" style="text-align: center;">
        <thead >
            <tr>

                <th style="width: 30%">文件名</th>
                <th style="width: 30%">上传时间</th>
                <th style="width: 30%">操作</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="data">
                <!-- 12个一组 -->
                <tr v-for="item in docList" :key="item.id">
                    <td>{{ item.name }}</td>
                    <!-- <td>{{ item.permissionEnum }}</td> -->
                    <td>{{ formatTimestamp(item.uploadDate) }}</td>
                    <td style="white-space: nowrap">
                        <button @click="getDocView(item.id)" class="btn btn-sm btn-primary mr-1" :disabled="item.isDeleting">
                            <span v-if="item.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>详情</span>
                        </button>
                        <button @click="removeDoc(item.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="item.isDeleting">
                            <span >删除</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="data.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="data.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{users.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
    <a-pagination
    :current="pageNum"
    :page-size="pageSize"
    :total="total"
    show-total
    show-size-changer
    @change="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
    />
</template>  

<script setup>
import { Message } from '@arco-design/web-vue';
import {BackendUrl} from '@renderer/api/request'
import CategoryRequest from "@renderer/api/category"
import DocumentRequest from "@renderer/api/document"
import { computed, reactive, ref, onMounted } from 'vue';
import router from '@renderer/router';
import buttonSrc from '@renderer/assets/source/upload.png'
import folderSrc from '@renderer/assets/source/folder.png'
import StatsRequest from "@renderer/api/stats";

const data = ref([])
const currentPage = ref(1)
const totalItems = ref(0)
const type = ref('ALL')  // 假设你的 type 是响应式的 ref
const currentType = computed(() => {
  return ['ALL', 'CATEGORY', 'TAG'].includes(type.value) ? type.value : 'ALL'
})

const handlePageChange = (newPage) => {
  pageNum.value = newPage
  getRecentDocList()
}

const handlePageSizeChange = (newSize) => {
  pageSize.value = newSize
  pageNum.value = 1
  getRecentDocList()
}
// total: 100,
// pageNum: 1,
// pageSize: 60,

const pageNum = ref(1)
const pageSize = ref(60)
const total = ref(100)
const loadedPages = ref([])
const cateId = ref('')
const tagId = ref('')
const keyword = ref('')
const requestType = ref('')  // 'collect' | 'upload' | ''
const docList = ref([])

const spinShow = ref(false)
const init = () => {
    getRecentDocList()
}


function formatTimestamp(cellValue) {
  if (!cellValue) return ''
  const date = new Date(cellValue)
  const pad = n => (n < 10 ? '0' + n : n)

  const Y = date.getFullYear()
  const M = pad(date.getMonth() + 1)
  const D = pad(date.getDate())
  const h = pad(date.getHours())
  const m = pad(date.getMinutes())
  const s = pad(date.getSeconds())

  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

onMounted(() => {
  init()
})



const getRecentDocList = async () => {
    if (pageNum.value > total.value / pageSize.value) return
    if (loadedPages.value.includes(pageNum.value)) return

    const param = {
    cateId: cateId.value,
    tagId: tagId.value,
    keyword: keyword.value,
    page: pageNum.value,
    rows: pageSize.value
    }

    loadedPages.value.push(pageNum.value)

    const handleSuccess = (res) => {
    if (res.code === 200) {
        const result = res.data
        result.data.forEach(item => docList.value.push(item))
        pageNum.value = result.pageNum + 1
        pageNum.value++  // 重复 ++ 原样保留
        total.value = result.total
        pageSize.value = result.pageSize
    }
    spinShow.value = false
    }

    const handleError = (err) => {
        Message.error('出错：' + (err || '请稍后重试'))
        spinShow.value = false
    }

    spinShow.value = true

    try {
    if (requestType.value === 'collect') {
        const res = await CategoryRequest.getMyCollectList(param)
        handleSuccess(res)
    } else if (requestType.value === 'upload') {
        const res = await CategoryRequest.getMyUploadList(param)
        handleSuccess(res)
    } else {
        const res = await CategoryRequest.getDocList(param)
        handleSuccess(res)
    }
    } catch (err) {
    handleError(err)
    }
}

// 删除记录
function removeDoc(id) {
    if (id == null) {
        return
    }
    let params = {
        id: id
    }
    DocumentRequest.deleteData(params).then(response => {
        if (response.code === 200) {
            Message?.success("删除文档成功！")
            init()
        }
    }).catch(() => {
        Message?.error("删除文档出错！")
    })
    
}

function getDocView(id) {
  console.log("我被点击了")
  router.push({
    path: '/preview',
    query: {
      docId: id
    }
  })
}
// refs
const fileToUpload = ref(null)

// 状态
const placeholder = ref('输入一些内容')
const filename = ref('')
const uploadProcess = ref(0.00)
const processFlag = ref(false)
const uploadParam = ref({})
const categoryOption = ref([])  // 分类列表，待开发
const value1 = ref(null)
const count = ref([0])

// 上传进度样式
const processStyle = computed(() => {
  return {
    width: (uploadProcess.value * 100) + '%'
  }
})

// 打开上传文件选择框
function uploadDialogShow() {
  fileToUpload.value?.dispatchEvent(new MouseEvent('click'))
}

// 选择文件
function changeFile() {
  const inputFile = fileToUpload.value?.files[0]
  if (!inputFile) return

  const name = inputFile.name
  uploadParam.fileId = name
  uploadParam.file = inputFile
  filename.value = name
  processFlag.value = true
  uploadProcess.value = 0
}

// 上传文件
async function uploadFile() {
  if (!uploadParam.file || !uploadParam.fileId) return

  const formData = new FormData()
  formData.append('fileName', uploadParam.fileId)
  formData.append('file', uploadParam.file)

  const config = {
    onUploadProgress: (progressEvent) => {
      const loaded = progressEvent.event?.loaded ?? progressEvent.loaded
      const total = progressEvent.event?.total ?? progressEvent.total
      uploadProcess.value = Number(((loaded / total) * 0.9).toFixed(2))
    }
  }

  processFlag.value = true

  try {
    const res = await DocumentRequest.docUpload(formData, config)
    if (res.code === 200) {
      uploadProcess.value = 1
      Message.success('成功！')
      // 上传之后重新加载列表   
      init()
    } else {
      Message.error('上传出错：' + res.message)
      uploadProcess.value = 0.00
    }

    setTimeout(() => {
      processFlag.value = false
      filename.value = ''
    }, 1000)
  } catch (err) {
    Message.error('上传出错！')
    processFlag.value = false
    uploadProcess.value = 0.0
  }
  uploadParam.value = {}
}
// 切换分类
function switchCategory() {
  Message.info('待开发')
}
</script>


  
<style lang="less" scoped>

.main-container {
    padding: 30px;

    .upload-title {
        width: 96px;
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC, serif;
        font-weight: 500;
        color: #000000;
        line-height: 33px;

        margin-bottom: 30px;
    }

    .upload-panel {
        width: 100%;
        height: 190px;
        background: #FFFFFF;
        border-radius: 8px;
        border: 2px solid #000000;
        padding: 4px 0;
        position: relative;
        overflow: hidden;
        display: inline-block;
        text-align: center;

        &:hover {
            cursor: pointer;
            border: 2px dashed #000000;
        }

    }

    .file-title {
        width: 100%;
        min-height: 21px;
        font-size: 14px;

        &:hover {
            cursor: pointer;
            background-color: #FFFAE4;
        }

    }

    .progress-wrapper {
        width: 100%;
        height: 20px;
        background-color: #eeeeee;
        // position: absolute;

        .pro {
            width: 100%;
            height: 100%;
            background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
            background-color: #00B83F;
            background-size: 40px 40px;
            animation: progressbar 2s linear infinite;
        }

        @keyframes progressbar {
            0% {
                background-position: 40px 0
            }
            100% {
                background-position: 0 0
            }
        }
    }

    .cate-dropdown {
        text-align: center;
        width: 100%;
        height: 45px;
        background: #FFFFFF;
        border-radius: 8px;
        border: 1px solid #000000;

        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC, serif;
        font-weight: 500;
        color: #000000;
        line-height: 45px;
    }

    .search-input-top {

        width: 100%;
        height: 45px;
        background: #FFFFFF;
        border-radius: 8px;
        border: 1px solid #000000;
        padding: 8px;

        display: flex;
        justify-content: flex-start;
        align-content: center;

        input {
            height: 43px;
            width: 100%;
            text-decoration: none;
            outline: none;
            border: none;
        }
    }

    .description-area {
        :deep(.ivu-input) {
            border: 1px solid #000000;
        }
    }

    .star-tag {
        padding-right: 10px;
        text-align: right;
        color: red;
    }
}

:deep(.ivu-upload-drag) {
    border: none;
}

.upload-button {
    &:hover {
        cursor: pointer;
        padding: 1px 0 0 1px;
    }
}


</style>