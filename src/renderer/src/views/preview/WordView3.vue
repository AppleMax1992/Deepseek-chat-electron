<template>
    <div class="home1">
        <div v-show="view_flag" style="padding: 400px; color: #ffcc4f;">
            <div class="demo-spin-icon-load" >
                <Icon type="md-refresh" style="font-size: 48px;"/>
            </div>
            <div style='font-size:16px' >加载中...</div>
        </div>
       <!-- 不支持预览doc，只能预览docx哦 -->
        <div ref="file"></div>
    </div>
</template>

<script>
import axios from 'axios'
// import docx from 'docx-preview'

// 如果 docx-preview 版本比较新需要 es6 导出
import { renderAsync } from 'docx-preview'

// window.JSZip = require('jszip')

import StatisticSourceUrl from '@renderer/api/staticSourceUrl'

export default {
    name: "WordView3.vue",
    data() {
        return {
            result: null,
            view_flag: true
        }
    },
    mounted(){
        let docId = this.$route.query.docId;
        let wordURL = StatisticSourceUrl.docPreviewUrl(docId)
        axios({
            method: 'get',
            responseType: 'blob',
            // 设置响应文件格式
            data: {},
            url: wordURL,
        }).then(res => {
            // 渲染到页面预览
            renderAsync(res.data, this.$refs.file)
            this.view_flag = false
        })
    },
    methods: {
    }
}
</script>

<style scoped>

.home1 {
    margin-top: -10px;
}
/* 旋转效果 */
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50% { transform: rotate(180deg);}
    to { transform: rotate(360deg);}
}
/* 遮罩 */
/* 假如内容过长，一屏放不下，滚动条下拉覆盖不全 */
.ivu-spin-fix {
    position: absolute;
    top:0;
    left: 0;
    z-index: 8;
    width: 100%;
    height:100%;
    background-color: hsla(0,0%,100%,.8);
}
</style>

