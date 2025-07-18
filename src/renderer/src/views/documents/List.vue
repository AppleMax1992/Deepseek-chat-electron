<template>
    <div class="homepage">
        <div class="top-group" style="text-align: center; ">
            <img :src="imgSrc" width="100%" height="100%" alt=""/>
            <!-- 会影响导航 -->
            <SearchGroup></SearchGroup>
            <div class="user-zone" v-if="!ad && !tokenExpired">
                <span>{{ type | userType }}</span>
            </div>
        </div>
        <div style="height: 30px;width: 100%;" v-if="!ad && !tokenExpired">

        </div>
        <div class="bottom-group">
            <div class="left-panel">
                <div class="top-container">
                    <div class="panel-title left-pane-title" style="cursor: pointer" @click="routeTo">
                        <span>全部文档</span>
                    </div>
                    <div
                        :class=" item.clicked ? 'tag-info' : 'tag-info-unchecked' "
                        v-for="item in data"
                        @click="changeToCurrentTag(item.name, item.tagId)"
                    >
                        <span>{{ item.name }}</span>
                    </div>
                </div>
                <div class="doc-thumb-1">
                    <DocThumb class="doc-thumb"
                              :flag="false"
                              :title="doc.name"
                              :docId="doc.thumbId"
                              v-for="doc in currentData.slice(0, 6)" :key="doc.id"
                              @click.native="getDocView(doc.id)"
                    ></DocThumb>
                </div>
                <div class="doc-thumb-1 second-group">
                    <DocThumb class="doc-thumb"
                              :flag="false"
                              :title="doc.name"
                              :docId="doc.thumbId"
                              v-for="doc in currentData.slice(6, 12)" :key="doc.id"
                              @click.native="getDocView(doc.id)"
                    ></DocThumb>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DocTag from './DocTag.vue';
import DocThumb from './DocThumb.vue'
import SearchGroup from './SearchGroup.vue'

import StaticSourceUrl from "@renderer/api/staticSourceUrl"
import StatsRequest from "@renderer/api/stats";

import router from '@renderer/router';



// 静态资源引入
import bannerImg from '@renderer/assets/source/banner.png'
import defaultAvatarImg from '@renderer/assets/source/user_avater.png'
import heartImg from '@renderer/assets/source/heart.png'
import folderImg from '@renderer/assets/source/folder.png'
import uploadImg from '@renderer/assets/source/upload.png'

// 响应式状态
const imgSrc = ref(bannerImg)
const defaultAvatar = ref(defaultAvatarImg)
const img1 = ref(heartImg)
const img2 = ref(folderImg)
const img3 = ref(uploadImg)


const data = ref([])
const currentData = ref([])
const tokenExpired = ref(false)

// const username = ref(localStorage.getItem('username'))
const type = ref(localStorage.getItem('type'))

onMounted(() => {
  init()
})

function routeTo() {
  router.push('/doc')
}

function init() {
  StatsRequest.getRecentDoc().then(response => {
    if (response.code === 200) {
      data.value = response.data
      changeToCurrentTag(data.value[0].name, data.value[0].tagId)
    }
  }).catch(() => {
    window.$message?.error("查询最近文档出错！")
  })
}

function changeToCurrentTag(name, tagId) {
  currentData.value = []
  data.value.forEach(item => {
    if (item.name === name && item.tagId === tagId) {
      item.clicked = true
      currentData.value = item.docList
    } else {
      item.clicked = false
    }
  })
}

function getDocView(id) {
  router.push({
    path: '/preview',
    query: {
      docId: id
    }
  })
}

function logout() {
  localStorage.clear()
  router.push({ name: 'Login' })
}

function toMyCollection() {
  router.push("/userPage/userCollection")
}

function toMyUpload() {
  router.push("/userPage/userUpload")
}

function toUploadPage() {
  router.push("/userPage/docUpload")
}
</script>

<style scoped>

.homepage {
    width: 100%;
    padding-bottom: 20px;
}

.homepage .top-group {
    height: 140px;
    width: 100%;
    padding-bottom: 40px;
    z-index: -1;
}

.homepage .top-group .user-zone {
    position: absolute;
    right: 40px;
    top: 20px;
    display: flex;
    justify-content: flex-start;
    padding: 5px 5px 0 5px;
    color: #2c3e50;
}

.homepage .top-group .user-zone span {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC, serif;
    font-weight: 400;
    padding-right: 10px;
}

.homepage .top-group .user-zone .user-tag {
    border-radius: 36px;
    box-sizing: content-box;
}

.homepage .top-group .user-zone .user-tag img {
    border-radius: 38px;
    height: 36px;
    width: 36px;
    box-shadow: 0 0 4px #bbbbbb;
}

.homepage .top-group .user-zone:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
}

.homepage .top-group .button-group {
    height: 120px;
    position: absolute;
    top: 225px;
    width: 1200px;
    left: calc(50% - 600px);
}

.homepage .bottom-group {
    margin: auto;
    width: 1200px;
    height: 619px;
    box-shadow: 0 0 5px 0 rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fff;
}

.homepage .bottom-group .left-panel {
    height: 100%;
    width: 900px;
    float: left;
    padding: 0;
}

.homepage .bottom-group .right-panel {
    height: 100%;
    width: 300px;
    float: left;
    padding: 0 24px 0 40px;
}

.homepage .bottom-group .top-container {
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.homepage .bottom-group .top-container .panel-title span {
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC, serif;
    font-weight: 600;
    color: #464646;
    line-height: 28px;
}

.homepage .bottom-group .top-container .left-pane-title {
    margin-left: 24px;
}

.homepage .bottom-group .top-container .tag-info {
    height: 30px;
    background: #FACF36;
    border-radius: 15px;
    border: 1px solid #000000;
    padding: 0 10px;
    margin-left: 20px;
    line-height: 32px;
    color: #000000;
}

.homepage .bottom-group .top-container .tag-info span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC, serif;
    font-weight: 400;
    line-height: 20px;
}

.homepage .bottom-group .top-container .tag-info:hover {
    cursor: pointer;
    background: #FFFAE4;
}

.homepage .bottom-group .top-container .tag-info-unchecked {
    height: 30px;
    border-radius: 15px;
    border: 1px solid #AAAAAA;
    padding: 0 10px;
    margin-left: 20px;
    line-height: 32px;
    color: #AAAAAA;
}

.homepage .bottom-group .top-container .tag-info-unchecked:hover {
    cursor: pointer;
    background: #FACF36;
    border: 1px solid #000000;
    color: #000000;
}

.homepage .bottom-group .top-container .tag-info-unchecked span {
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC, serif;
    font-weight: 400;
    line-height: 20px;
}

.homepage .bottom-group .doc-thumb-1 {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    overflow: hidden;
    padding-left: 20px;
}

.homepage .bottom-group .doc-thumb-1 .doc-thumb {
    margin-right: 38px;
}

.homepage .bottom-group .second-group {
    margin-top: 40px;
}


</style>