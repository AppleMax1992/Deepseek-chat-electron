<template>
    <div class="maintainer">
        <iframe :src="pdfSrc" frameborder="0" height='100%' scrolling='no' width='100%'></iframe>
<!--        <div class="header">-->
<!--            <div class="close-button">-->
<!--                <Icon type="close-round"></Icon>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@renderer/router';
import StatisticSource from "@renderer/api/staticSourceUrl"
const route = useRoute()
const docId = route.query.docId
const pdfSrc = ref('')

const getPdfUrl = () => {
  const pdfJs = '/pdfjs-3.7.107-dist/web/viewer.html?'
//   const viewerBase = `${window.location.origin}/pdfjs-3.7.107-dist/web/viewer.html`

  const url = encodeURIComponent(StatisticSource.docPreviewUrl(docId))
  pdfSrc.value = pdfJs  + "file=" + url // pdfJs + "file=" +
  console.log("pdfSrc.value",pdfSrc.value)
//   window.location.href=pdfJs
}

onMounted(() => {
  getPdfUrl()
})
</script>

<style scoped>
.maintainer {
    width: 100%;
    height: 100vh;

    padding: 0;
    margin: 0;

    .header {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 80px;
        text-align: center;
        .close-button {
            background-color: #eeeeee;
            opacity: 0.1;
            border-radius: 80px;
            width: 80px;
            height: 80px;
            margin: auto;
            &:hover {
                cursor: pointer;
            }
        }
    }
}
</style>