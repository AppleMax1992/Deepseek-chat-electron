<template>
    <div class="thumb-group" :style="flag|styleByFlag">
        <div class="thumb-com">
            <div class="thumb-pic">
                <img :src="imgSrc(props.docId)" alt="docId" referrerpolicy="no-referrer">
            </div>
            <DocTag :type="filterType(title)">
            </DocTag>
        </div>

        <div class="thumb-title" v-if="!flag">
            <span>{{ title }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import DocTag from "./DocTag.vue";
import StaticSource from "@renderer/api/staticSourceUrl"
// 静态资源引入
import docImg from '@renderer/assets/source/doc.png'

// 定义props
const props = defineProps({
  flag: Boolean,
  title: String,
  docId: String,
})

// 替代 styleByFlag filter，返回样式对象
function styleByFlag(flag) {
  if (flag) {
    return {
      padding: 0,
      _isHover: false, // 这个属性 Vue 样式不会识别，可根据需求处理
      width: '100px',
    }
  }
  return {}
}

// 替代 filterType filter，获取文件类型标识
function filterType(title) {
  if (!title) {
    return 'others'
  }
  const arr = title.split('.')
  const suffix = arr[arr.length - 1].toLowerCase()
  switch (suffix) {
    case 'pdf': return 'pdf'
    case 'doc':
    case 'docx': return 'word'
    case 'pptx': return 'ppt'
    case 'xlsx': return 'excel'
    default: return suffix.slice(0, 1)
  }
}

// 替代 imgSrc filter，计算图片地址

function imgSrc(value) {
  if (!value) return docImg
  return StaticSource.imageUrl(value) || docImg
}

const docTitle = computed(() => props.title)
</script>

<style scoped>
.thumb-group {
    width: 108px;
    padding: 4px;
}

.thumb-group .thumb-com {
    width: 100%;
    height: 140px;
    position: relative;
}

.thumb-group .thumb-com .thumb-pic {
    width: 100%;
    height: 140px;
    border-radius: 2px;
    border: 1px solid #AAAAAA;
    position: relative;
    background-color: #ffffff;

    overflow: hidden; /* img 如果超出这个 div 会隐藏超出部分 */
    display: flex; /* flex 布局 */
    align-items: center; /* 让 img 放在 div 的中间，居中 */
}

.thumb-group .thumb-com .thumb-pic img {
    width: 100%;
}

.thumb-group .thumb-com .doc-tag {
    position: absolute;
    bottom: 0;
    right: 0;
}

.thumb-group .thumb-title {
    width: 100%;
    height: 64px;
    padding: 10px 0 5px 0;
    text-align: left;
}

.thumb-group .thumb-title span {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC, serif;
    font-weight: 400;
    color: #000000;
    line-height: 17px;

    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

/* hover 效果 */
.thumb-group:hover {
    background-color: #eee;
    cursor: pointer;
    border-radius: 4px;
}

</style>