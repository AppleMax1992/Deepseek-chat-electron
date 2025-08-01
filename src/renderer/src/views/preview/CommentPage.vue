<template>
    <div>
        <Input v-model="inputValue" type="textarea" :rows="8" placeholder="留下只言片语"/>
        <div class="comment-btn">
            <Button @click="postComment">发送评论</Button>
        </div>
        <div class="comment-body">
            <div class="comment-title">
                <span>全部评论  </span>
                <span class="comment-num">{{ totalItems }}</span>
            </div>
            <div class="comment-item" v-for="item in comments">
                <div class="comment-item-logo">
                    {{ item.src }}
                    <img v-if="!item.src" :src="item.userAvatarId | userAvatar" style="width: 48px;height: 48px;
border-radius: 48px"
                         alt="">
                </div>
                <div class="comment-item-detail">
                    <div class="comment-item-user">
                        {{ item.userName | defaultUserName }}
                    </div>
                    <div class="comment-item-content">
                        {{ item.content }}
                    </div>
                    <div class="comment-item-time">
                        {{ item.createDate | transferTime }}
                    </div>
                </div>
            </div>
            <div class="paginator" v-if="totalItems > pageSize">
                <Page
                    :total="totalItems"
                    :current="currentPage"
                    :page-size="pageSize"
                    @on-change="pageChange"
                    size="small"/>
            </div>
        </div>
    </div>
</template>

<script>

import {parseTime} from "@renderer/utils"
import CommentRequest from "@renderer/api/comment"
import StaticSourceUrl from "@renderer/api/staticSourceUrl"

export default {
    name: "CommentPage",
    data() {
        return {
            inputValue: "",
            num: 22,
            comments: [],
            docId: this.$route.query.docId,
            currentPage: 1,
            totalItems: 0,
            pageSize: 6,
        }
    },

    filters: {
        transferTime(value) {
            const dateBegin = new Date(value);
            const dateEnd = new Date();//获取当前时间
            const dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
            const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
            if (dayDiff > 5) {
                return parseTime(dateBegin, '{y}年{m}月{d}日 {h}:{i}:{s}');
            }
            const leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            const hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
            //计算相差分钟数
            const leave2 = leave1 % (3600 * 1000);    //计算小时数后剩余的毫秒数
            const minutes = Math.floor(leave2 / (60 * 1000));//计算相差分钟数
            //计算相差秒数
            const leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            const seconds = Math.round(leave3 / 1000);
            //(" 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")

            if (dayDiff > 0) {
                return dayDiff + '天前'
            }
            if (hours > 0) {
                return hours + "小时前"
            }
            if (minutes > 0) {
                return minutes + "分钟前"
            }
            if (seconds > 5) {
                return seconds + "秒钟前"
            }
            return "刚刚"
        },
        defaultUserName(value) {
            if (!value) {
                return "不知名的用户"
            } else {
                return value
            }
        },
        userAvatar(value) {
            if (value === "" || value === 'null' || value === null || value === undefined) {
                return require("@/assets/source/user_avater.png");
            } else {
                return StaticSourceUrl.imageUrl(value);
            }
        }

    },
    mounted() {
        this.init()
    },
    methods: {
        /**
         * 查询该篇文章的全部评论信息
         */
        init() {
            if (this.docId === "") {
                return;
            }
            let params = {
                "docId": this.docId,
                "page": this.currentPage - 1,
                "rows": this.pageSize,
            }
            CommentRequest.getListData(params).then(response => {
                if (response.code === 200) {
                    this.comments = response.data.comments;
                    this.totalItems = response.data.totalNum;
                }
            })
        },
        postComment() {
            if (this.inputValue === "" || this.docId === "") {
                return;
            }
            let data = {
                content: this.inputValue,
                docId: this.docId,
            }
            if (localStorage.getItem('token') === "") {
                this.$Message.error('跳转到登录页面，请先登录！');
                this.$router.push({
                    path: '/login',
                    query: {
                        userName: this.userName
                    }
                })
            }
            CommentRequest.postData(data).then(response => {
                if (response.code === 200) {
                    this.init()
                    this.$Notice.info({
                        title: '通知信息',
                        desc: '评论添加成功！'
                    });
                } else {
                    this.$Message.error('出了点问题，稍后再试！');
                }
                this.inputValue = ''

            })
        },
        pageChange(page) {
            this.currentPage = page;
            this.init();
        }
    }
}
</script>

<style scoped>
.comment-body {
    padding: 20px 40px;
    text-align: left;
}

.comment-body .comment-title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC, serif;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
}

.comment-body .comment-title .comment-num {
    font-weight: 400;
    color: #858585;
    line-height: 20px;
}

.comment-body .comment-item {
    border-bottom: 1px solid #EAEAEA;
    padding: 20px 0;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.comment-body .comment-item .comment-item-logo {
    width: 60px;
    line-height: 60px;
    margin: 0 auto;
    display: inline-block;
    text-align: center;
    padding-top: 10px;
}

.comment-body .comment-item .comment-item-detail {
    width: calc(100% - 60px);
    margin: 0 auto;
    display: inline-block;
}

.comment-body .comment-item .comment-item-detail .comment-item-user {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC, serif;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
}

.comment-body .comment-item .comment-item-detail .comment-item-content {
    color: #a5a2a3;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC, serif;
    font-weight: 400;
    line-height: 20px;
    padding-top: 10px;
}

.comment-body .comment-item .comment-item-detail .comment-item-time {
    padding-top: 10px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC, serif;
    font-weight: 400;
    color: #000000;
    line-height: 17px;
}

.comment-btn {
    text-align: right;
    padding: 10px 0;
}

.ivu-btn {
    width: 95px;
    height: 30px;
    background: #FFF7D6;
    box-shadow: 0 0 10px 0 rgba(129, 100, 0, 0.3);
    border-radius: 8px;
    border: 2px solid #000000;

    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC, serif;
    font-weight: 600;
    color: #000000;
    line-height: 20px;
}

.ivu-btn:hover {
    background-color: #fcf3d2;
    color: rgba(129, 100, 0, 0.3);
    border-color: rgba(129, 100, 0, 0.3);
}

.paginator {
    padding: 10px;
}

</style>