<template>
    <div class="search-doc">
        <div class="doc-title-group">
          
            <div class="doc-pic" style="text-align: center;">
                <img :src="imgSrc(thumbId)" alt="thumb">
            </div>
            <div class="title-group">
                <div class="doc-title-info" @click="getDocView()" v-html="title">
                </div>
                <div class="description">
                    <div class="description-item">
                        {{ timeIn }}
                    </div>
                    <div class="description-item">
                        {{ userName }}
                    </div>
                    <div class="description-item" v-show="categoryIn">
                        {{ categoryIn }}
                    </div>
                    <Tag color="blue" v-for="item in tagsIn">{{item}}</Tag>
                </div>
            </div>
        </div>
        <div class="doc-abstract">
            <p v-html="description"></p>
        </div>
    </div>
</template>

<script setup>
import {parseTime} from "@renderer/utils"
import { Tag } from "@arco-design/web-vue";
import StaticSourceUrl from "@renderer/api/staticSourceUrl"
import {defineProps,computed,ref } from 'vue'
import router from '@renderer/router';
// 静态资源引入
import docImg from '@renderer/assets/source/doc.png'

// 显式获取 props
const props = defineProps({
  id: { type: String, required: true },
  thumbId: { type: String, required: true ,default: ''},
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Number, required: true, default: 1704422520232 },
  userName: { type: String, required: true, default: 'admin' },
  category: { type: Object, required: false, default: () => ({}) },
  tags: { type: Array, required: false, default: () => [] },
  collectNum: { type: Number, required: false, default: 0 },
  commentNum: { type: Number, required: false, default: 0 }
})

// 解构使用
const {
  id, thumbId, title, description, time,
  userName, category, tags
} = props

function getDocView() {
  router.push({
    path: '/preview',
    query: {
      docId: id
    }
  })
}

// computed: 分类显示
const categoryIn = computed(() => {
  if (!category || !category.name) return null
  return category.name.length > 6 ? category.name.substring(0, 6) + '...' : category.name
})

// computed: 标签显示
const tagsIn = computed(() => {
  if (!tags || tags.length === 0) return []
  return tags.map(tag => {
    const name = tag.name || ''
    return name.length > 8 ? name.substring(0, 8) + '...' : name
  })
})

// computed: 时间显示
const timeIn = computed(() => {
  const ts = typeof time === 'number' ? time : Number(time)
  return parseTime(new Date(ts), '{y}年{m}月{d}日 {h}:{i}:{s}')
})

// 替代 filter
function imgSrc(value) {
  if (!value) return docImg
  return StaticSourceUrl.imageUrl(value)
}

</script>

<style scoped>

::v-deep .em-title {
  color: #5c86aa;
}

.search-doc {
  padding: 12px 12px;
  border-bottom: 1px solid #e8eaec;
}

.search-doc:hover {
  background-color: rgba(245, 245, 245, 1); /* 100 改为 1 */
  cursor: pointer;
}

.doc-title-group {
  height: 48px;
  margin-bottom: 16px;
  display: block;
}

.doc-pic {
  height: 48px;
  width: 48px;
  float: left;
  line-height: 48px;
  margin: auto;
}

.doc-pic img {
  width: 36px;
  max-height: 48px;
  border: 1px solid #dcdee2;
  border-radius: 2px;
}

.title-group {
  height: 48px;
  float: left;
  width: calc(100% - 60px);
}

.doc-title-info {
  height: 22px;
  color: rgba(208, 164, 1, 1);
  font-size: 16px;
  font-weight: 700;
}

.doc-title-info:hover {
  text-decoration: underline;
  color: rgba(208, 164, 1, 1);
}

.description {
  height: 26px;
  line-height: 26px;
  display: block;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  float: left;
}

.description-item {
  width: 200px;
  line-height: 24px;
  padding-top: 2px;
  float: left;
}

ul {
  margin: 16px 0 0;
}

li {
  padding: 0 20px;
}

/* 等效于 >>> em 深度选择器 */
:deep(.doc-abstract) em {
  background-color: yellow;
}


</style>