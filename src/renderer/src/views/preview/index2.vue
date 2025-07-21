<template>
    <div class="home_wrap">
        <div style="height: calc(100% - 20px);position: relative">
            <img :src=" imgSrc(thumbId)" alt="thumb"
                 style="max-width: 100%;height: calc(100%);border: 1px solid #dcdee2; border-radius: 2px"
                 @mouseenter="enter" @mouseleave="leave"
            >
        </div>
    </div>
</template>

<script setup>
import StaticSourceUrl from '@renderer/api/staticSourceUrl'
import Nav_2 from '@renderer/components/Nav_2.vue';

let PDFJS = import('pdfjs-dist');
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { parseTime } from '@renderer/utils'  // 假设 parseTime 是你定义的时间格式化函数
import DocRequest from '@renderer/api/document'

// 路由
const route = useRoute()
const router = useRouter()

// refs (响应式变量)
const title = ref("")
const userName = ref("")
const docId = ref("")
const tags = ref([])
const createTime = ref(new Date())
const thumbId = ref("")
const component = ref(null)
const tagColor = ['orange', 'gold', 'lime', 'cyan', 'blue', 'geekblue', 'magenta']

const collectCount = ref(0)
const likeCount = ref(0)
const likeStatus = ref(0)
const collectStatus = ref(0)
const previewId = ref(null)

const suffix = ref("")

// 图片地址过滤器替代
const imgSrc = (value) => {
  if (!value) {
    return new URL('@renderer/assets/source/doc.png', import.meta.url).href
  } else {
    return StaticSourceUrl.imageUrl(value)
  }
}


// 初始化函数
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
    tags.value = renderTags(data.tagVOList)
    previewId.value = data.previewFileId

    const fileSuffix = data.title.split('.').pop()
    suffix.value = fileSuffix

    switch (fileSuffix) {
      case 'pdf':
        component.value = (await import('@renderer/views/preview/index2.vue')).default
        break
      case 'png':
      case 'jpg':
      case 'jpeg':
        component.value = (await import('@renderer/views/preview/PngView.vue')).default
        break
      case 'html':
      case 'txt':
        component.value = (await import('@renderer/views/preview/HtmlView.vue')).default
        break
      case 'doc':
      case 'docx':
        component.value = (await import('@renderer/views/preview/WordView3.vue')).default
        break
      case 'pptx':
        component.value = (await import('@renderer/views/preview/PptxView2.vue')).default
        break
      case 'xlsx':
        component.value = (await import('@renderer/views/preview/excel2.vue')).default
        break
      case 'md':
        component.value = (await import('@renderer/views/preview/mdView.vue')).default
        break
      case 'mp4':
        // component.value = (await import('@/views/preview/VideoView.vue')).default
        break
      default:
        component.value = (await import('@renderer/views/preview/ErrorView.vue')).default
        break
    }
  }
}

// 渲染标签颜色
const renderTags = (tagList) => {
  return tagList.map((item, index) => ({
    ...item,
    index,
    color: tagColor[Math.floor(Math.random() * tagColor.length)]
  }))
}

// 获取点赞信息
const getLikeInfo = async () => {
  try {
    const res = await DocRequest.getLikeInfo({ entityId: docId.value })
    if (res.code === 200) {
      const result = res.data
      collectCount.value = result.collectCount || 0
      likeCount.value = result.likeCount || 0
      likeStatus.value = result.likeStatus || 0
      collectStatus.value = result.collectStatus || 0
    } else {
      window.$message?.info("error")
    }
  } catch (e) {
    window.$message?.info("error")
  }
}

// 点赞/收藏
const addLike = async (entityType) => {
  if (![1, 2].includes(entityType)) return

  try {
    const res = await DocRequest.addLike({ params: { entityType, entityId: docId.value } })
    if (res.code === 200) {
      const result = res.data
      if (entityType === 1) {
        likeCount.value = result.likeCount || 0
        likeStatus.value = result.likeStatus || 0
        likeStatus.value === 0
          ? window.$message?.info("取消点赞！")
          : window.$message?.success("点赞成功！")
      } else {
        collectCount.value = result.likeCount || 0
        collectStatus.value = result.likeStatus || 0
        collectStatus.value === 0
          ? window.$message?.info("取消收藏！")
          : window.$message?.success("收藏成功！")
      }
    } else {
      window.$message?.info("error")
    }
  } catch (e) {
    window.$message?.info("error")
  }
}

// 搜索标签
const searchTag = (value) => {
  if (value !== "") {
    router.push({ path: '/searchResult', query: { keyWord: value } })
  }
}

// 预览页面跳转
const preview = () => {
  const routeData = router.resolve({ path: '/newPreview', query: { docId: docId.value } })
  window.open(routeData.href, '_blank')
}

// 生命周期钩子
onMounted(() => {
    console.log("=========hhhhhhhhhhhhhhhhhhhhh========")
    init()
    getLikeInfo()
})


</script>
<style scoped>
.home_wrap {
    width: 1200px;
    height: 100%;

    background-color: #757575;
    padding-top: 80px;
    text-align: center;

    .pdf_down {
        position: fixed;
        display: flex;
        z-index: 20;
        right: 26px;
        bottom: 7%;

        .pdf_set_left {
            width: 30px;
            height: 40px;
            color: #408FFF;
            font-size: 11px;
            padding-top: 25px;
            text-align: center;
            margin-right: 5px;
            cursor: pointer;
        }

        .pdf_set_middle {
            width: 30px;
            height: 40px;
            color: #408FFF;
            font-size: 11px;
            padding-top: 25px;
            text-align: center;
            margin-right: 5px;
            cursor: pointer;
        }
    }
}

/* 旋转效果 */
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
    from {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(180deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 遮罩 */
/* 假如内容过长，一屏放不下，滚动条下拉覆盖不全 */
.ivu-spin-fix {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, .8);
}
</style>