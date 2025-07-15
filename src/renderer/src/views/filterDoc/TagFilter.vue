<template>
    <div class="tag-panel">
        <div class="tag-title">文件类型</div>
        <div class="tag-list">
            <div class="tag-item"
                 v-for="tagName in tagNames"
                 @click="selected(tagName)"
                 :class="{activeTag: activeTagName === tagName}"
            >
                {{ tagName.name }}
            </div>
        </div>
    </div>

</template>

<script setup>

import CategoryRequest from "@renderer/api/category";
const emit = defineEmits(['changeTag'])

const tagNames = ref([])
const activeTagName = ref({ id: 'ALL', name: '全部' })
const categoryType = 'TAG'
const loading = ref(false)

function selected(tag) {
  activeTagName.value = tag
  let id = tag.id
  if (id === 'ALL') {
    id = ''
  }
  emit('changeTag', id)
}

async function getAllItems() {
  loading.value = true
  const params = {
    type: categoryType
  }

  try {
    const response = await CategoryRequest.getListData(params)
    loading.value = false

    if (response.code !== 200) return

    const list = [
      { id: 'ALL', name: '不限', createDate: '', updateDate: '' }
    ]

    response.data.forEach(item => {
      const name = item.name.length > 8 ? item.name.slice(0, 8) + '...' : item.name
      list.push({ ...item, name })
    })

    tagNames.value = list

  } catch (error) {
    loading.value = false
    console.error('获取标签失败:', error)
  }
}

onMounted(() => {
  getAllItems()
})
</script>

<style scoped lang="scss">
.tag-panel {
    margin: 30px 0 22px 0;
    display: flex;
    justify-content: left;

    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC, serif;
    font-weight: 600;
    color: #464646;
    line-height: 22px;

    .tag-title {
        width: 64px;
        height: 22px;
        margin-right: 40px;
        white-space: nowrap; /*规定段落中的文本不进行换行 */

    }

    .tag-list {
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
        max-height: 120px;
        overflow-y: auto;

        .tag-item {
            padding-right: 20px;
            cursor: pointer;
            font-size: 14px;

            &:hover {
                color: #F2A500;
            }
        }

        .activeTag {
            color: #F2A500;
        }

    }
}

</style>