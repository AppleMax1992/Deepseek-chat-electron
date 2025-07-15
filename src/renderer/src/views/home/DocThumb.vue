<!-- <template>
    <div class="thumb-group" :style="flag|styleByFlag">
        <div class="thumb-com">
            <div class="thumb-pic">
                <img :src="docId | imgSrc" alt="docId" referrerpolicy="no-referrer">
            </div>
            <DocTag :type="title | filterType">
            </DocTag>
        </div>

        <div class="thumb-title" v-if="!flag">
            <span>{{ title }}</span>
        </div>
    </div>
</template>

<script>
import DocTag from "@/home/DocTag";
import StaticSource from "@/api/staticSourceUrl"
// 定义props
defineProps({
  flag: Boolean,
  title: String,
  docId: String,
})

// 样式计算函数，替代 styleByFlag filter
function styleByFlag(flag) {
  if (flag) {
    return {
      padding: 0,
      _isHover: false,
      width: '100px'
    }
  }
  return {}
}

// 文件类型过滤函数，替代 filterType filter
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

// 图片地址计算，替代 imgSrc filter
import { ref } from 'vue'
const props = defineProps(['title', 'flag', 'docId'])
const img = ref('')

const imgSrc = computed(() => {
  if (!props.title) return docPlaceholder
  // 这里假设 props.title 是文件名，如果是图片路径请改为 props.docId 或其他
  return StaticSource.imageUrl(props.title) || docPlaceholder
})

// 组件内用到的docTitle
const docTitle = computed(() => props.title)
</script>

<style lang="scss" scoped>
.thumb-group {
    width: 108px;
    padding: 4px;

    .thumb-com {
        width: 100%;
        height: 140px;
        position: relative;

        .thumb-pic {
            width: 100%;
            height: 140px;
            border-radius: 2px;
            border: 1px solid #AAAAAA;
            position: relative;
            background-color: #ffffff;

            overflow: hidden; //img如果超出这个div会隐藏超出部分
            display: flex; //flex布局
            align-items: center; //让img放在div的中间，居中
            img {
                width: 100%;
            }
        }

        .doc-tag {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }

    .thumb-title {
        width: 100%;
        height: 64px;
        padding: 10px 0 5px 0;
        text-align: left;


        span {
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
    }

    &:hover {
        background-color: #eee;
        cursor: pointer;
        border-radius: 4px;
    }
}
</style> -->