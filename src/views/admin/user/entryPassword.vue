<style scoped>
.ivu-form-inline {
    text-align: right;
    padding: 10px 10px;
}

.ivu-form-inline .ivu-form-item {
    margin: 0px 0px !important;
}
</style>
<template>
    <div>
            <Form ref="formEdit" :model="formEdit" :rules="ruleEdit" :label-width="80">
                <FormItem label="姓名" prop="name">
                    <Input type="text" readonly v-model="formEdit.name"></Input>
                </FormItem>
                <FormItem label="账号" prop="loginName">
                    <Input type="text" readonly v-model="formEdit.loginName"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" placeholder="请输入新密码" v-model="formEdit.password"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="plainPassword">
                    <Input type="password" placeholder="请再次输入新密码" v-model="formEdit.plainPassword"></Input>
                </FormItem>
                <FormItem>
                    <Button type="ghost" @click="back()" style="margin-left: 16px">返回</Button>
                    &nbsp;&nbsp;
                    <Button type="primary" :loading="loading" @click="handleSubmit('formEdit')">保存</Button>
                </FormItem>
            </Form> 
    </div>
</template>
<script>
    export default {
        data() {
            let formEdit = this.$route.query;
            formEdit.password = '';
            formEdit.plainPassword = '';

            const validatePlainPassword = (rule, value, callback) => {
                if (value !== this.formEdit.password) {
                    callback(new Error('两次输入的密码必须一致'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                formEdit: formEdit,
                ruleEdit: {
                    password: [{required: true, message: '必须填写新密码', trigger: 'blur'}],
                    plainPassword: [{required: true, message: '必须再次填写新密码', trigger: 'blur'},
                                    {validator: validatePlainPassword, trigger: 'blur'}]
                }
            };
        },
        methods: {
            handleSubmit (name) {
                var _this = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.loading = true;
                        this.$http.post('/home/api/user/entryPassword', this.formEdit, function(result) {
                            _this.loading = false;
                            if(result.success) {
                                _this.$Message.success('重置密码成功');
                                _this.$router.back();
                            }
                            else {
                                this.$Message.error({
                                    content: result.message,
                                    duration: 0,
                                    closable: true
                                });
                            }
                        });
                    }
                });
            },
            back() {
                this.$router.back();
            }
        }
    };
</script>
