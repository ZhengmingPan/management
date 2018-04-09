<style scoped>
    .index {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
    }

    .index h1 {
        height: 150px;
    }

    .index h1 img {
        height: 100%;
    }

    .index h2 {
        color: #666;
        margin-bottom: 200px;
    }

    .index h2 p {
        margin: 0 0 50px;
    }

    .index .ivu-row-flex {
        height: 100%;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
            <h1>
                <img :src="logoSrc">
            </h1>
            <h2>
                <p>欢迎进入数据管理平台!</p>
                <Button type="ghost" @click="handleStart"><i class="fa fa-home"></i> 进入系统</Button>
            </h2>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
               logoSrc: this.$Img.logo
            }
        },
        methods: {
            handleStart() {
                this.$router.push({path: '/login'});
            }
        }
    };
</script>
