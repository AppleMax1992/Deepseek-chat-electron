<template>
    <div class="homepage">
        <div class="top-group" style="text-align: center; ">
            <img :src="imgSrc" width="100%" height="100%" alt=""/>
            <SearchGroup ref="searchInput"  @on-search="getListData"></SearchGroup>
            <div class="user-zone" v-if="!ad && !tokenExpired">
                <span>{{ type | userType }}</span>
            </div>

        </div>
        <div style="height: 30px;width: 100%;" v-if="!ad && !tokenExpired">

        </div>
        <div class="doc-group" ref="docGroup" style="">
            <SearchItem v-for="item in data.slice((currentPage-1)*pageSize, (currentPage)*pageSize)"
                        :id="item.id"
                        :thumbId="item.thumbId ?? ''"
                        :title="item.title"
                        :description="item.description"
                        :time="item.createTime"
                        :user-name="item.userName"
                        :category="item.categoryVO"
                        :tags="item.tagVOList"
                        :collect-num="item.collectNum"
                        :comment-num="item.commentNum"
            >{{ item.thumbId }}</SearchItem>
            <div class="page-container" v-show="data.length > 0 ">
                <Page
                    :model-value="currentPage"
                    :total="totalItems"
                    :page-size="pageSize"
                    @on-change="pageChange"
                />
            </div>
            <div style="padding: 30px 10px; color: #555" v-show="data.length < 1">
                <span v-if="!loading">暂无内容，试试其他呢～</span>
                <span v-else>拼命查找中，请等待...</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Nav from "@renderer/components/Nav_2.vue";
import SearchItem from "@renderer/views/searchResult/SearchItem.vue";
import DocItem from "@renderer/views/searchResult/DocItem.vue";
import Footer from "@renderer/components/MyFooter.vue";

import DocumentRequest from "@renderer/api/document"
import SearchInput from "./SearchInput.vue"
import SearchGroup from '@renderer/views/documents/SearchGroup.vue'
import UserCard from '@renderer/views/home/UserCard.vue'
import StaticSourceUrl from "@renderer/api/staticSourceUrl"
import UserRequest from '@renderer/api/user'
import {ref,computed,onMounted, nextTick} from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const route = useRoute()

const data = ref([])
const currentPage = ref(1)
const totalItems = ref(4)
const pageSize = ref(6)
const loading = ref(true)
const currentData = ref([])
const tokenExpired = ref(false)

const keyword = route.query.keyWord;

const searchResult = ref(null)
const docGroup = ref(null)

const ad = computed(() => {
  let item = localStorage.getItem('token')
  return item === null || item === undefined || item === ''
})

const userAvatar = computed(() => {
  let value = localStorage.getItem('avatar')
  if (!value || value === 'null') {
    return defaultAvatar
  }
  return StaticSourceUrl.imageUrl(value)
})

onMounted(() => {
  getListData(keyword)
})

function pageChange(page) {
  currentPage.value = page
}

function info(found) {
  window.$Notice?.info?.({
    title: '通知信息',
    desc: found ? '' : '没有找到相关文档，试一试其他关键字'
  })
}

function gotoAdminPage() {
  if (localStorage.getItem('type') === 'ADMIN') {
    router.push('/admin/allDocuments')
  } else {
    window.$Message?.warning('请使用管理员账号登录！')
  }
}


async function checkLogin() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await UserRequest.checkUserLogin()
    if (res.code !== 200) {
      window.$Message?.error('token 已过期')
      localStorage.clear()
      tokenExpired.value = true
    }
  } catch {
    window.$Message?.error('token 已过期')
    localStorage.clear()
    tokenExpired.value = true
  }
}

function getListData(keyword) {
  loading.value = true
  if (!keyword) return
  const params = {
    categoryId: '',
    filterWord: keyword,
    page: currentPage.value - 1,
    rows: pageSize.value,
    tagId: '',
    type: 'FILTER',
    userId: localStorage.getItem('id')
  }
  data.value = []
  DocumentRequest.getListData(params).then(res => {
    loading.value = false
    
    if (res.code === 200) {
      totalItems.value = res.data.totalNum
      data.value = res.data.documents.map(doc => ({
        ...doc,
        title: doc.title.replace(keyword, `<span class='em-title'>${keyword}</span>`)
      }))
    } else {
      data.value = []
    }

    if (!data.value || data.value.length === 0) {
      info(false)
    }

    if (searchResult.value) {
      searchResult.value.style.height = '1060px'
      if (totalItems.value > 1) {
        nextTick(() => {
          if (docGroup.value) {
            searchResult.value.style.height = 300 + docGroup.value.clientHeight + 'px'
          }
        })
      }
    }
  })
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

.homepage .doc-group {
  width: 1200px;
  position: absolute;
  margin: auto;
  color: rgba(16, 16, 16, 1);
  text-align: left;
  min-height: 815px;
  background: #ffffff;
  box-shadow: 0 0 5px 0 rgba(64, 64, 64, 0.3);
  border-radius: 8px;
  top: 209px;
  left: calc(50% - 600px);
  padding: 20px;
  display: inline-block;
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