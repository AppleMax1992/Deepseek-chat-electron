<template>
    <div class="operation-container">
        <div class="item" :class="(item.index === '1' && likeStatus === 1)
        || (item.index === '2' && collectStatus===1) ? 'pushed' : '' "
             v-for="item in data" @click="operate(item)">
            <div class="item-logo">
                <img :src="item.src" :alt="item.src">
            </div>
            <div class="operation-title">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script>
import StaticSource from "@renderer/api/staticSourceUrl"

export default {
    name: "docOperation",
    data() {
        return {
            data: [
                {
                    name: "竖个大拇指",
                    src: require("@renderer/assets/source/like.png"),
                    index: "1"
                },
                {
                    name: "马上收藏",
                    src: require("@renderer/assets/source/heart.png"),
                    index: "2"
                },
                {
                    name: "立马下载",
                    src: require("@renderer/assets/source/download.png"),
                    index: "3"
                },
            ],
            docId: this.$route.query.docId,
        }
    },
    props: {
        likeStatus: Number,
        collectStatus: Number
    },
    mounted() {

    },
    methods: {
        operate(item) {
            if (item.index === "3") {
                window.open(StaticSource.docPreviewUrl(this.docId), "_blank");
            } else if (item.index === "1" || item.index === "2") {
                this.$emit("addLike", Number(item.index))
            }
        }
    }
}
</script>

<style scoped>
.operation-container {
    width: 50%;
    min-width: 400px;
    display: flex;
    justify-content: space-between;
    margin: auto;
    height: 200px;
}

.item {
    width: 120px;
    height: 120px;
    border-radius: 120px;
    margin: auto;
    position: relative;

    background: #FACF36;
    border: 2px solid #000000;
}

.item:hover {
    background-color: #f1db77;
    cursor: pointer;
    border: 2px #2d2c2b solid;
}

.pushed {
    background-color: #f1db77;
}

.operation-title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC, serif;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
}

.item-logo {
    height: 80px;
    line-height: 80px;
    width: 120px;
}

.item-logo img {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
}

img {
    /*width: 48px;*/
    /*height: 48px;*/
}
</style>