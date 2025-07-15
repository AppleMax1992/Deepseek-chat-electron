<template>
    <div class="search-result" ref="searchResult">
        <div class="top-group">
            <img :src="imgSrc" width="100%" height="100%" alt=""/>
            <SearchGroup ref="searchInput" @on-search="getListData"></SearchGroup>
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
        <Footer></Footer>
    </div>
</template>

<script setup>
import Nav from "@renderer/components/Nav_2.vue";
import SearchItem from "@renderer/views/searchResult/SearchItem.vue";
import DocItem from "@renderer/views/searchResult/DocItem.vue";
import Footer from "@renderer/components/MyFooter.vue";

import DocumentRequest from "@renderer/api/document"
import SearchInput from "./SearchInput.vue"
import SearchGroup from '@renderer/views/home/SearchGroup.vue'
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
  getListData()
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

function getListData() {
  loading.value = true
  let keyword = route.query.keyWord
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
.nav {
  background-color: #ffcc4f;
  width: 100%;
  height: 50px;
}

.search-result {
  width: 100%;
  background-color: #f7f7f7;
  height: 100%;
}

.search-result .top-group {
  height: 340px;
  width: 100%;
  padding-bottom: 40px;
  z-index: -1;
  text-align: center;
  position: relative;
}

.search-result .top-group .user-zone {
  position: absolute;
  right: 40px;
  top: 20px;
  display: flex;
  justify-content: flex-start;
  padding: 5px 5px 0 5px;
}

.search-result .top-group .user-zone span {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC, serif;
  font-weight: 400;
  color: #000000;
  padding-right: 10px;
}

.search-result .top-group .user-zone .user-tag {
  border-radius: 60px;
  box-sizing: content-box;
}

.search-result .top-group .user-zone .user-tag img {
  border-radius: 38px;
  height: 36px;
  width: 36px;
  box-shadow: 0 0 4px #bbbbbb;
}

.search-result .top-group .user-zone:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
}

.search-result .top-group .button-group {
  height: 120px;
  position: absolute;
  top: 225px;
  width: 1200px;
  left: calc(50% - 600px);
}

.search-result .doc-group {
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

.page-container {
  text-align: left;
  padding: 25px;
}



</style>