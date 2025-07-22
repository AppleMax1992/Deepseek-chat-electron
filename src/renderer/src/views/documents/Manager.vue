
<template>
    <h1>文档管理</h1>
    <!-- {{ users.data }} -->
    <!-- <router-link to="/users/add" class="btn btn-sm btn-success mb-2">Add User</router-link> -->
     <div class="main-container">
        <div class="upload-title">
            <span>上传文档</span>
        </div>
        <Row>
            <Col span="1" class="star-tag">
                <span>*</span>
            </Col>
            <Col span="12" style="text-align: left">
                <div class="upload-panel" @click="uploadDialogShow">
                    <div style="padding: 30px 0;">
                        <div style="padding: 5px; line-height: 45px;">
                            <img :src="buttonSrc" width="68px" height="68px" alt="upload-pic"/>
                        </div>
                        <p>支持Word/Excel/PPT/PDF，不超过100M</p>
                    </div>
                    <input type="file" ref="fileToUpload" id="fileToUpload" style="display: none"
                           @change="changeFile">
                </div>
            </Col>
        </Row>
        <Row v-show="true">
            <Col span="1" class="star-tag">
            </Col>
            <Col span="20" style="text-align: left">
                <div class="file-title">
                    <span>{{ filename }}</span>
                </div>
                <div class="progress-wrapper" v-if="processFlag">
                    <div class="pro" :style="uploadProcess | processToStr"></div>
                </div>
            </Col>
        </Row>
        <Row style="margin-top: 30px;">
            <Col>
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
            </Col>
        </Row>
    </div>
    <table class="table table-striped">
        <thead>
            <tr>

                <th style="width: 30%">文件名</th>
                <th style="width: 30%">操作</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="data">
                <!-- 12个一组 -->
                <tr v-for="item in data.docList" :key="item.id">
                    <td>{{ item.name }}</td>
                    <!-- <td>{{ item.permissionEnum }}</td> -->
                    <!-- <td>{{ item.createDate }}</td> -->
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
    <a-pagination :total="200" show-total/>
</template>  

<script setup>
import { Message } from '@arco-design/web-vue';
import {BackendUrl} from '@renderer/api/request'
import DocumentRequest from '@renderer/api/document';
import { computed, reactive, ref, onMounted } from 'vue';
import router from '@renderer/router';
import buttonSrc from '@renderer/assets/source/upload.png'
import StatsRequest from "@renderer/api/stats";

const data = ref([])

const init = () => {
    StatsRequest.getRecentDoc().then(response => {
        if (response.code === 200) {
            data.value = response.data[0]
        }
        }).catch(() => {
            Message?.error("查询最近文档出错！")
        })
}

onMounted(() => {
  init()
})


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
  uploadParam = {}
}
// 切换分类
function switchCategory() {
  Message.info('待开发')
}
</script>


  
<style scoped>

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
        width: 300px;
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
        height: 3px;
        background-color: #eeeeee;
        position: absolute;

        .pro {
            width: 40%;
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
        ::v-deep .ivu-input {
            border: 1px solid #000000;
        }
    }

    .star-tag {
        padding-right: 10px;
        text-align: right;
        color: red;
    }
}

::v-deep .ivu-upload-drag {
    border: none;
}

.upload-button {
    &:hover {
        cursor: pointer;
        padding: 1px 0 0 1px;
    }
}


</style>