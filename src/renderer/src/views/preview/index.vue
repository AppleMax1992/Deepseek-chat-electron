<template>
    <div>
        <div class="nav">
            <Nav></Nav>
        </div>
        <div class="main-container">
            <div class="title-info">
                <div class="doc-trim" style="text-align: center">
                    <img :src=" thumbId | imgSrc " alt="thumb"
                         style="width: 36px;max-height: 48px;border: 1px solid #dcdee2; border-radius: 2px">
                </div>
                <div class="doc-info">
                    <div class="doc-info-title">
                        {{ title }}
                    </div>
                    <div class="doc-info-tag">
                        <Tag :color="item.color" v-for="item in tags" :index="item.index"
                        ><span @click="searchTag(item.name)">{{ item.name }}</span></Tag>
                    </div>
                    <div class="doc-info-detail">
                        <Icon type="md-person"/>
                        {{ userName }} |
                        <Icon type="md-time"/>
                        {{ createTime }} |
                        <Icon type="md-thumbs-up"/>
                        {{ likeCount }} |
                        <Icon type="md-heart"/>
                        {{ collectCount }}
                    </div>

                </div>
            </div>
            <div class="doc-preview">
                <video-view v-if="suffix === 'mp4'"></video-view>
                <component :is="component"
                           v-if="component && suffix !== 'mp4'"
                           :previewId="previewId"
                           :thumbId="thumbId"
                />
                <div class="preview-button" v-if="suffix==='pdf'">
                    <Button type="primary" @click="preview">全屏预览</Button>
                </div>
            </div>
            <div class="my-container">
                <div class="doc-operation-body">
                    <doc-operation :likeStatus="likeStatus" :collectStatus="collectStatus"
                                   @addLike="addLike"
                    />
                </div>
                <div class="doc-comment">
                    <comment-page/>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
import Nav from "@renderer/components/Nav_2.vue"
import DocRequest from "@renderer/api/document"
import {parseTime} from "@renderer/utils/index"

import DocOperation from "./docOperation.vue"
import CommentPage from "./CommentPage.vue"
// import VideoView from "./VideoView.vue";
import StaticSourceUrl from "@renderer/api/staticSourceUrl"

export default {
    data() {
        return {
            title: "",
            userName: "",
            docId: "",
            tags: [],
            createTime: new Date(),
            thumbId: "",
            component: null,
            tagColor: ['orange', 'gold', 'lime', 'cyan', 'blue', 'geekblue', 'magenta'],

            collectCount: 0,
            likeCount: 0,
            likeStatus: 0,
            collectStatus: 0,
            previewId: null,

            suffix: "",
        }
    },
    components: {
        // VideoView,
        Nav, DocOperation, CommentPage
    },
    mounted() {

    },
    filters: {
        imgSrc(value) {
            if (value === "" || value == null) {
                return require('@/assets/source/doc.png');
            } else {
                return StaticSourceUrl.imageUrl(value);
            }
        }
    },
    created() {
        this.init()
        this.getLikeInfo();
    },
    methods: {
        init() {
            this.docId = this.$route.query.docId;
            var params = {
                docId: this.docId
            }
            DocRequest.getData(params).then(response => {
                if (response.code === 200) {
                    this.title = response.data.title;
                    this.userName = response.data.userName;
                    this.thumbId = response.data.thumbId;
                    var docTime = response.data.createTime;
                    this.createTime = parseTime(new Date(docTime), '{y}年{m}月{d}日 {h}:{i}:{s}');

                    let tagList = response.data['tagVOList'];
                    this.tags = this.renderTags(tagList);

                    let title = response.data.title

                    this.previewId = response.data.previewFileId

                    let suffix = title.split(".")[title.split('.').length - 1];
                    this.suffix = suffix;
                    switch (suffix) {
                        case 'pdf':
                            this.component = () => import('./index2.vue')
                            break
                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                            this.component = () => import('./PngView.vue')
                            break
                        case 'html':
                        case 'txt':
                            this.component = () => import('./HtmlView.vue')
                            break
                        case 'docx':
                        case 'doc':
                            this.component = () => import('./WordView3.vue')
                            break
                        case 'pptx':
                            // this.component = () => import('@/views/preview/PPTxView')
                            this.component = () => import('./PptxView2.vue')
                            break
                        case 'xlsx':
                            this.component = () => import('./excel2.vue')
                            break
                        case 'md':
                            this.component = () => import('./mdView.vue')
                            break
                        case 'mp4':
                            // this.component = () => import('@/views/preview/VideoView')
                            // this.component = ({
                            //     // 需要加载的组件 (应该是一个 `Promise` 对象)
                            //     component: import('@/views/preview/VideoView'),
                            //     // // 异步组件加载时使用的组件
                            //     // loading: LoadingComponent,
                            //     // // 加载失败时使用的组件
                            //     // error: ErrorComponent,
                            //     // 展示加载时组件的延时时间。默认值是 200 (毫秒)
                            //     delay: 200,
                            //     // 如果提供了超时时间且组件加载也超时了，
                            //     // 则使用加载失败时使用的组件。默认值是：`Infinity`
                            //     timeout: 3000
                            // })
                            break
                        default:
                            this.component = () => import('./ErrorView.vue')
                            break
                    }
                }
            })
        },

        renderTags(tags) {
            tags.forEach((item, index) => {
                item['index'] = index;
                item['color'] = this.tagColor[parseInt(Math.random() * this.tagColor.length)];
            })
            return tags;
        },

        async getLikeInfo() {
            let param = {
                entityId: this.docId
            }
            await DocRequest.getLikeInfo(param).then(res => {
                if (res.code === 200) {
                    let result = res.data;
                    this.collectCount = result.collectCount || 0;
                    this.likeCount = result.likeCount || 0;
                    this.likeStatus = result.likeStatus || 0;
                    this.collectStatus = result.collectStatus || 0
                } else {
                    this.$Message.info("error")
                }
            }).catch(err => {
                this.$Message.info("error")
            })
        },
        async addLike(entityType) {
            if (entityType !== 1 && entityType !== 2) {
                return
            }

            let params = {
                entityType: entityType,
                entityId: this.docId
            }
            await DocRequest.addLike({params}).then(res => {
                if (res.code == 200) {
                    let result = res.data;
                    if (entityType === 1) {
                        this.likeCount = result.likeCount || 0;
                        this.likeStatus = result.likeStatus || 0;
                        if (this.likeStatus === 0) {
                            this.$Message.info("取消点赞！")
                        } else {
                            this.$Message.success("点赞成功！")
                        }
                    } else {
                        this.collectCount = result.likeCount || 0;
                        this.collectStatus = result.likeStatus || 0;
                        if (this.collectStatus === 0) {
                            this.$Message.info("取消收藏！")
                        } else {
                            this.$Message.success("收藏成功！")
                        }
                    }
                } else {
                    this.$Message.info("error")
                }
            }).catch(err => {
                this.$Message.info("error")
            })
        },
        searchTag(value) {
            if (value !== "") {
                this.$router.push({
                    path: '/searchResult',
                    query: {
                        keyWord: value
                    }
                })
            }
        },
        preview() {
            // this.$router.push({
            //     path: '/newPreview',
            //     query: {
            //         docId: this.docId
            //     }
            // })

            let text= this.$router.resolve({
                path: '/newPreview',
                query: {
                docId: this.docId
            }})

            // 打开一个新的页面
            window.open(text.href, '_blank');

        }

    }

}
</script>

<style scoped>
.nav {
    background-color: #f4d057;
    width: 100%;
    height: 50px;
}

.main-container {
    width: 1200px;
    padding: 25px;
    margin: auto;
    box-sizing: content-box;
}

.main-container .title-info {
    height: 185px;
    width: 1200px;
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
    padding: 36px;
    display: block;
}

.main-container .title-info .doc-trim {
    float: left;
    width: 40px;
    height: 40px;
    line-height: 40px;
    display: block;
}

.main-container .title-info .doc-info {
    display: block;
    width: calc(100% - 40px);
    float: left;
    padding: 0 10px;
    text-align: left;
}

.main-container .title-info .doc-info .doc-info-title {
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 33px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.main-container .title-info .doc-info .doc-info-tag {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: flex-start;
    padding-top: 8px;
}

.main-container .title-info .doc-info .doc-info-tag .ivu-tag:hover {
    cursor: pointer;
}

.main-container .title-info .doc-info .doc-info-detail {
    height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 20px;
}

.main-container .doc-preview {
    margin: 20px 0;
    overflow-y: auto;
    height: calc(100vh - 80px);
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
    overflow: auto;
    overscroll-behavior: contain;
    -ms-scroll-chaining: contain;
    position: relative;
}

.main-container .doc-preview .preview-button {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.5);
    line-height: 60px;
    text-align: right;
    padding-right: 20px;
}

.main-container .my-container {
    background-color: #fffeff;
}

.main-container .my-container .doc-operation-body {
    height: 200px;
    text-align: center;
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
}

.main-container .my-container .doc-comment {
    margin: 20px 0;
    min-height: 120px;
    box-shadow: 0px 0px 5px 0px rgba(64, 64, 64, 0.3);
    border-radius: 8px;
    background-color: #fffeff;
    padding: 36px 40px;
}

</style>