<template>
    <div class="search-group">
        <div class="search-zone">
            <div class="logo" @click="$router.push('/')"
                style="cursor: pointer">
                <img :src="logoSrc" width="100%" height="100%" alt=""/>
            </div>
            <div class="search-input">
                <div class="search-input-top">
                    <div class="search-selection" @click="routeTo">
                        <span>全部</span>
                    </div>
                    <input :placeholder="placeholder" v-model="searchValue"
                          @focus="userInputFlag = true"
                          @blur="whenInputBlur"
                          @keyup.enter="clickToSearch(searchValue)"
                          @input="changeItem"
                          ref="input"
                    ></input>
                    <div class="search-button"
                        style="width: 100px; line-height: 45px; display: flex; align-content: center; flex-wrap: wrap; justify-content: center;"
                        @click="clickToSearch(searchValue)"
                    >
                        <img :src="searchSrc" width="16px" height="16px" alt="" style="display: inline-block;"/>
                    </div>
                </div>
                <div class="search-input-bottom" v-show="hotSearch.length">
                    <span class="title" style="font-size: 500;">推荐搜索：</span>
                    <span class="search-tag" style="margin-left: 20px;"
                          v-for="item in hotSearch"
                          @click="clickToSearch(item)"
                    >{{ item }}</span>
                </div>
                <div class="user-search-result" v-show="userInputFlag && userSearch.length > 0">
                    <div class="user-search-item" v-for="item in userSearch"
                        @mousedown="preventBlur($event)">
                        <p @click="clickToUserSearch(item)">{{ item }}</p>
                        <div class="user-search-remove" @click="removeUserSearch(item)">删除</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import StatsRequest from "@renderer/api/stats";
import router from '@renderer/router';
import logoSrc from '@renderer/assets/svg/newLogo.svg'
import searchSrc from '@renderer/assets/svg/search.svg'
import { ref, onMounted } from 'vue'
// 响应式变量
const placeholder = ref('请输入您想要查找的文档')
const hotSearch = ref([])
const searchValue = ref('')
const originUserSearch = ref([])
const userSearch = ref([])
const userInputFlag = ref(false)
const emit = defineEmits(['on-search'])
// 生命周期钩子
onMounted(() => {
  init()
  // 如果需要在挂载后聚焦 input，可以使用如下方式：
  // nextTick(() => {
  //   inputRef.value?.focus()
  // })
})

// 初始化函数
const init = async () => {
  try {
    const response = await StatsRequest.getSearchHistory()
    if (response.code === 200) {
      hotSearch.value = response.data.hotSearch
      originUserSearch.value = response.data.userSearch
      userSearch.value = originUserSearch.value.slice(0, 10)
    }
  } catch (err) {
    // 假设你有全局消息组件处理
    console.error('出错：', err)
  }
}

// 路由跳转
const routeTo = () => {
  router.push('/doc')
}

// 用户点击搜索项跳转
const clickToSearch = (value) => {
  if (value !== '') {
    router.replace({
      path: '/searchResult',
      query: {
        keyWord: value
      }
    })
    // 向父组件发出搜索事件
    emit('on-search', true)
  } else {
    routeTo()
  }
}

// 用户输入变化筛选建议项
const changeItem = () => {
  if (!searchValue.value) {
    userSearch.value = originUserSearch.value.slice(0, 10)
  } else {
    userSearch.value = originUserSearch.value
      .filter(el => el.toLowerCase().includes(searchValue.value.toLowerCase()))
      .slice(0, 10)
  }
}

// 处理失焦（延迟隐藏）
const whenInputBlur = () => {
  setTimeout(() => {
    userInputFlag.value = false
  }, 100)
}

// 阻止 blur 时默认行为
const preventBlur = (e) => {
  if (e && e.preventDefault) {
    e.preventDefault()
  }
}

// 点击用户搜索项填入搜索框
const clickToUserSearch = (item) => {
  searchValue.value = item
}

// 删除某项用户搜索历史
const removeUserSearch = (item) => {
  const i = userSearch.value.indexOf(item)
  if (i > -1) {
    userSearch.value.splice(i, 1)
  }

  const j = originUserSearch.value.indexOf(item)
  if (j > -1) {
    originUserSearch.value.splice(j, 1)
    removeSearchHistory(item)
  }
}

// 发送删除历史请求
const removeSearchHistory = async (searchWord) => {
  const param = {
    userId: localStorage.getItem('id'),
    searchWord: searchWord
  }

  if (!param.userId || !param.searchWord) return

  try {
    await StatsRequest.removeSearchHistory(param)
  } catch (err) {
    console.error('删除历史失败：', err)
  }
}
</script>

<style  scoped>
.search-group {
    width: 100%;
    height: 140px;
    position: absolute;
    left: 0;
    top: 100px;
}

.search-group .search-zone {
    width: 745px;
    margin: auto;
    display: flex;
    justify-content: flex-start;
}

.search-group .search-zone .logo {
    width: 300px;
    height: 45px;
    margin-right: 18px;
}

.search-group .search-zone .search-input {
    position: relative;
}

.search-group .search-zone .search-input .search-input-top {
    width: 560px;
    height: 45px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #000;
    display: flex;
    justify-content: flex-start;
    align-content: center;
}

.search-group .search-zone .search-input .search-input-top .search-selection {
    width: 140px;
    border-right: 1px solid #aaa;
    margin-right: 5px;
    height: 43px;
    line-height: 45px;
    display: inline-block;
    vertical-align: middle;
}

.search-group .search-zone .search-input .search-input-top .search-selection:hover {
    cursor: pointer;
    color: #8d7b25;
}

.search-group .search-zone .search-input .search-input-top .search-selection span {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC, serif;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
}

.search-group .search-zone .search-input .search-input-top .search-selection span:hover {
    color: #8d7b25;
}

.search-group .search-zone .search-input .search-input-top input {
    height: 43px;
    width: 400px;
    text-decoration: none;
    outline: none;
    border: none;
}

.search-group .search-zone .search-input .search-input-top .search-button:hover {
    cursor: pointer;
    background-color: #fceac8;
    border-radius: 0 8px 8px 0;
}

.search-group .search-zone .search-input .search-input-bottom {
    margin-top: 20px;
    padding-left: 5px;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
}

.search-group .search-zone .search-input .search-input-bottom .title {
    font-family: PingFangSC-Medium, PingFang SC, serif;
    font-weight: 500;
    color: #464646;
    line-height: 20px;
}

.search-group .search-zone .search-input .search-input-bottom .search-tag:hover {
    cursor: pointer;
}

.search-group .search-zone .search-input .user-search-result {
    position: absolute;
    background-color: rgba(246, 246, 246, 0.8);
    width: 440px;
    border-radius: 12px;
    left: 120px;
    top: 50px;
    padding: 8px 0px;
    text-align: left;
    z-index: 100;
}

.search-group .search-zone .search-input .user-search-result .user-search-item {
    line-height: 24px;
    font-size: 14px;
    padding: 2px 8px;
    position: relative;
}

.search-group .search-zone .search-input .user-search-result .user-search-item p {
    overflow: hidden;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    width: calc(100% - 20px);
}

.search-group .search-zone .search-input .user-search-result .user-search-item:hover {
    background-color: #fff;
    cursor: pointer;
}

.search-group .search-zone .search-input .user-search-result .user-search-item .user-search-remove {
    position: absolute;
    right: 0px;
    top: 0px;
    line-height: 28px;
    font-size: 12px;
    color: #0067eb;
    padding: 0px 8px;
}

</style>