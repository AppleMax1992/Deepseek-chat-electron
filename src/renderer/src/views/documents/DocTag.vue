<template>
    <div class="doc-tag"
         :style="{borderColor: tag.color, fill: tag.color, color: tag.color, fillOpacity: 0.1}">
        <span
            :style="{ fontSize: tag.size }">
            {{ tag.name }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
// 定义 props
const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const docTypeMap = {
    word: {
        color: "#367CFA",
        name: "W"
    },
    excel: {
        color: "#00913F",
        name: "X"
    },
    ppt: {
        color: "#A34030",
        name: "P"
    },
    pdf: {
        color: "#E40000",
        name: "PDF",
        size: '12px'
    },
    pic: {
        color: "#71cd4a",
        name: "PIC",
        size: '12px'
    },
    others: {
        color: "#AAAAAA",
        name: "A"
    }

}
// 计算属性 tag（根据 props.type 决定标签信息）
const tag = computed(() => {
  const type = props.type
  if (docTypeMap.hasOwnProperty(type)) {
    return docTypeMap[type]
  } else {
    const result = { ...docTypeMap.others }
    if (type) {
      result.name = type.toUpperCase()
    }
    return result
  }
})
</script>

<style scoped>
.doc-tag {
    width: 24px;
    height: 24px;
    border: 1px solid;
    border-radius: 2px;
    text-align: center;
    background-color: #ffffff;
}

.doc-tag span {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC, serif;
    font-weight: 600;
    line-height: 22px;
}

</style>