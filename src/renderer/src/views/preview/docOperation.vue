<template>
    <div class="operation-container">
        <div class="item" :class="(item.index === '1' && likeStatus === 1)
        || (item.index === '2' && collectStatus===1) ? 'pushed' : '' "
             v-for="item in data" @click="operate(item)">
            <div class="item-logo">
                <img :src="item.src" :alt="item.src">
            </div>
            <div class="operation-title">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script setup>
import StaticSource from "@renderer/api/staticSourceUrl"
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// // 获取当前路由信息
const route = useRoute()
// console.log("==============sssssssss==========",route)
const docId = route.query.docId

// 操作项数据
const data = ref([
  {
    name: "立马下载",
    src: new URL("@renderer/assets/source/download.png", import.meta.url).href,
    index: "3"
  }
])

// 点击操作
function operate(item) {
  if (item.index === "3") {
    window.open(StaticSource.docPreviewUrl(docId), "_blank")
  }
}
</script>

<style scoped>
.operation-container {
    width: 50%;
    min-width: 400px;
    display: flex;
    justify-content: space-between;
    margin: auto;
    height: 200px;
}

.item {
    width: 120px;
    height: 120px;
    border-radius: 120px;
    margin: auto;
    position: relative;

    background: #FACF36;
    border: 2px solid #000000;
}

.item:hover {
    background-color: #f1db77;
    cursor: pointer;
    border: 2px #2d2c2b solid;
}

.pushed {
    background-color: #f1db77;
}

.operation-title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC, serif;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
}

.item-logo {
    height: 80px;
    line-height: 80px;
    width: 120px;
}

.item-logo img {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
}

img {
    /*width: 48px;*/
    /*height: 48px;*/
}
</style>