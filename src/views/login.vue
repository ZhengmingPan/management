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
        height: 70px;
    }

    .index .ivu-row-flex {
        height: 70%;
    }

    .logo {
        width: 60px;
        height: 60px;
    }

    .card-login {
        width: 100%;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
            <h1>
                <img class="logo" :src="logoSrc">
                欢迎登陆数据管理平台
            </h1>
            </Col>
            <Col span="8">
            <Card class="card-login">
                <p slot="title">
                    <Icon type="ivu-icon ivu-icon-leaf"></Icon>
                    登陆
                </p>
                <a href="javascript:void(0)" slot="extra"></a>
                <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" :label-width="100">
                    <FormItem label="账号" prop="username">
                        <Input type="text" placeholder="请输入账号" v-model="formLogin.username"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input type="password" placeholder="请输入密码" v-model="formLogin.password"></Input>
                    </FormItem>
                    <FormItem>
                        <Button :loading="loading" type="primary" @click="handleSubmit('formLogin')">
                             登 陆  <Icon type="ivu-icon ivu-icon-log-in"></Icon>
                        </Button>
                    </FormItem>
                </Form>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            const validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else {
                    if (this.formLogin.password !== '') {
                        this.$refs.formLogin.validateField('password');
                    }
                    callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return {
                logoSrc: this.$Img.logo,
                loading: false,
                formLogin: {
                    username: '',
                    password: ''
                },
                ruleLogin: {
                    username: [{
                        validator: validateUserName, trigger: 'blur'
                    }],
                    password: [{
                        validator: validatePassword, trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            handleSubmit(name) {
                let vm = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        vm.loading = true;
                        vm.$http.post(vm.$api.home.login.url, vm.formLogin, (result, headers) => {
                            vm.loading = false;
                            if (result.success) {
                                vm.$cookie.set('token', headers.token);
                                vm.$cookie.set('username', result.data.name);
                                vm.$router.push({path: '/admin/index'});
                            }
                            else {
                                vm.$Message.error({
                                    content: result.message,
                                    duration: 0,
                                    closable: true
                                });
                            }
                        });
                    }
                });
            }
        }
    };
</script>
