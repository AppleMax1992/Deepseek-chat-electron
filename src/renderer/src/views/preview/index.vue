<template>
    <div>
        <div class="main-container">
            <div class="title-info">
                <div class="doc-trim" style="text-align: center">
                    <img :src="imgSrc(thumbId)" alt="thumb"
                         style="width: 36px;max-height: 48px;border: 1px solid #dcdee2; border-radius: 2px">
                </div>
                <div class="doc-info">
                    <div class="doc-info-title">
                        {{ title }}
                    </div>
                    <div class="doc-info-tag">
                        <Tag :color="item.color" v-for="item in tags" :index="item.index"
                        ><span @click="searchTag(item.name)">{{ item.name }}</span></Tag>
                    </div>
                    <div class="doc-info-detail">
                        <Icon type="md-person"/>
                        {{ userName }} |
                        <Icon type="md-time"/>
                        {{ createTime }} |
                        <Icon type="md-thumbs-up"/>
                        {{ likeCount }} |
                        <Icon type="md-heart"/>
                        {{ collectCount }}
                    </div>

                </div>
            </div>
            <div class="doc-preview">
                    <video-view v-if="suffix === 'mp4'"></video-view>
                    <component :is="component"
                              v-if="component && suffix !== 'mp4'"
                              :previewId="previewId"
                              :thumbId="thumbId"
                    />
                    <div class="preview-button" v-if="suffix==='pdf'">
                        <Button type="primary" @click="preview">全屏预览</Button>
                    </div>
            </div>

            <div class="my-container">
                <div class="doc-operation-body">
                    <doc-operation :likeStatus="likeStatus" :collectStatus="collectStatus"
                                   @addLike="addLike"
                    />
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import DocRequest from "@renderer/api/document"
import {parseTime} from "@renderer/utils/index"

import DocOperation from "./docOperation.vue"
// import VideoView from "./VideoView.vue";
import StaticSourceUrl from "@renderer/api/staticSourceUrl"
import {ref,onMounted, defineAsyncComponent} from "vue"
import { useRoute, useRouter } from "vue-router"
import docImg from '@renderer/assets/source/doc.png'
// 状态定义
const title = ref("")
const userName = ref("")
const docId = ref("")
const tags = ref([])
const createTime = ref(new Date())
const thumbId = ref("")
const component = ref(null)
const tagColor = ['orange', 'gold', 'lime', 'cyan', 'blue', 'geekblue', 'magenta']

const collectCount = ref(0)
const collectStatus = ref(0)
const previewId = ref(null)
const suffix = ref("")

// 路由对象
const route = useRoute()
const router = useRouter()

// 替代 filter
function imgSrc(value) {
  if (!value) return docImg
  return StaticSourceUrl.imageUrl(value)
}

// 标签渲染
const renderTags = (tagList) => {
  tagList.forEach((item, index) => {
    item.index = index
    item.color = tagColor[Math.floor(Math.random() * tagColor.length)]
  })
  return tagList
}

// 初始化文档信息
const init = async () => {
  docId.value = route.query.docId
  const params = { docId: docId.value }

  const response = await DocRequest.getData(params)
  if (response.code === 200) {
    const data = response.data
    title.value = data.title
    userName.value = data.userName
    thumbId.value = data.thumbId
    createTime.value = parseTime(new Date(data.createTime), '{y}年{m}月{d}日 {h}:{i}:{s}')
    tags.value = renderTags(data.tagVOList || [])
    previewId.value = data.previewFileId

    const fileSuffix = data.title.split('.').pop()
    suffix.value = fileSuffix

    switch (fileSuffix) {
      case 'pdf':
        component.value = defineAsyncComponent(() => import('./index2.vue'))
        break
      case 'png':
      case 'jpg':
      case 'jpeg':
        component.value = defineAsyncComponent(() => import('./PngView.vue'))
        break
      case 'html':
      case 'txt':
        component.value = defineAsyncComponent(() => import('./HtmlView.vue'))
        break
      case 'docx':
      case 'doc':
        component.value = defineAsyncComponent(() => import('./WordView3.vue'))
        break
      case 'pptx':
        component.value = defineAsyncComponent(() => import('./PptxView2.vue'))
        break
      case 'xlsx':
        component.value = defineAsyncComponent(() => import('./excel2.vue'))
        break
      case 'md':
        component.value = defineAsyncComponent(() => import('./mdView.vue'))
        break
      case 'mp4':
        // 你可以按需添加视频组件
        break
      default:
        component.value = defineAsyncComponent(() => import('./ErrorView.vue'))
    }
  }
}


// 搜索标签
const searchTag = (value) => {
  if (value !== "") {
    router.push({ path: '/searchResult', query: { keyWord: value } })
  }
}

// 预览跳转
const preview = () => {
    router.push({ path: '/newPreview', query: { docId: docId.value } })
}




// 初始化调用
onMounted(() => {
  init()
})
</script>

<style scoped>
.nav {
    background-color: #f4d057;
    width: 100%;
    height: 50px;
}

.main-container {
    width: 1200px;
    padding: 25px;
    margin: auto;
    box-sizing: content-box;
}

.main-container .title-info {
    height: 185px;
    width: 1200px;
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
    padding: 36px;
    display: block;
}

.main-container .title-info .doc-trim {
    float: left;
    width: 40px;
    height: 40px;
    line-height: 40px;
    display: block;
}

.main-container .title-info .doc-info {
    display: block;
    width: calc(100% - 40px);
    float: left;
    padding: 0 10px;
    text-align: left;
}

.main-container .title-info .doc-info .doc-info-title {
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 33px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.main-container .title-info .doc-info .doc-info-tag {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: flex-start;
    padding-top: 8px;
}

.main-container .title-info .doc-info .doc-info-tag .ivu-tag:hover {
    cursor: pointer;
}

.main-container .title-info .doc-info .doc-info-detail {
    height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 20px;
}

.main-container .doc-preview {
    margin: 20px 0;
    overflow-y: auto;
    height: calc(100vh - 80px);
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
    overflow: auto;
    overscroll-behavior: contain;
    -ms-scroll-chaining: contain;
    position: relative;
}

.main-container .doc-preview .preview-button {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.5);
    line-height: 60px;
    text-align: right;
    padding-right: 20px;
}

.main-container .my-container {
    background-color: #fffeff;
}

.main-container .my-container .doc-operation-body {
    height: 200px;
    text-align: center;
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
}

.main-container .my-container .doc-comment {
    margin: 20px 0;
    min-height: 120px;
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
    padding: 36px 40px;
}

</style>