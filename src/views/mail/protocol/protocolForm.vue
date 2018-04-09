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
        <Breadcrumb :style="{margin: '24px 0'}">
           <BreadcrumbItem>
                <Icon type="settings"></Icon>
                协议管理
            </BreadcrumbItem>
            <BreadcrumbItem>协议列表</BreadcrumbItem>
            <BreadcrumbItem>编辑协议信息</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <Form ref="formEdit" :model="formEdit" :rules="ruleEdit" :label-width="80">
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="formEdit.name" placeholder="名称"></Input>
                </FormItem>
                <FormItem label="邮箱后缀" prop="suffix">
                    <Input type="text" v-model="formEdit.suffix" placeholder="邮箱后缀"></Input>
                </FormItem>
                <FormItem label="SMTP协议" prop="smtp">
                    <Input type="text" v-model="formEdit.smtp" placeholder="SMTP协议"></Input>
                </FormItem>
                <FormItem label="POP3协议" prop="pop3">
                    <Input type="text" v-model="formEdit.pop3" placeholder="POP3协议"></Input>
                </FormItem>
                <FormItem label="IMAP协议" prop="imap">
                    <Input type="text" v-model="formEdit.imap" placeholder="IMAP协议"></Input>
                </FormItem>
                <FormItem label="官网链接" prop="link">
                    <Input type="text" v-model="formEdit.link" placeholder="官网链接"></Input>
                </FormItem>
                <FormItem label="描述" prop="description">
                     <Input v-model="formEdit.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="描述"></Input>
                </FormItem>
                <FormItem>
                    <Button type="ghost" @click="back()" style="margin-left: 16px">返回</Button>
                    &nbsp;&nbsp;
                    <Button type="primary" :loading="loading" @click="handleSubmit('formEdit')">保存</Button>
                </FormItem>
            </Form>
        </Content>
    </div>
</template>
<script>
    export default {
        data() {
            var id = this.$route.query.id;
            const validatorName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必须填写名称'));
                } else {
                    this.$http.get('/home/api/mailProtocol/existName', {id: id, name: value},
                        function(result){
                            if(result.success && result.data) {
                                callback(new Error('名称已被使用'));
                            }
                            else {
                                callback();
                            }
                        });
                }
            };
            return {
                loading: false,
                isCreate: true,
                formEdit: {
                	id: '',
                	name: '',
                	description: '',
                	link: '',
                  suffix: '',
                	smtp: '',
                	pop3: '',
                	imap: ''
                },
                ruleEdit: {
                    name:[{required: true, message: '必须填写名称', trigger: 'blur'},
                               {validator: validatorName, trigger: 'blur'}],
                    link:[{required: false, type: 'url', message: '必须填写网站链接地址', trigger: 'blur'}],
                    suffix:[{required: true, message: '必须填写邮箱后缀', trigger: 'blur'}],
                    smtp:[{required: true, message: '必须填写SMTP协议', trigger: 'blur'}],
                    pop3:[{required: true, message: '必须填写POP3协议', trigger: 'blur'}],
                    imap:[{required: true, message: '必须填写IMAP协议', trigger: 'blur'}]
                }
            };
        },
        created () {
            let id = this.$route.query.id;
            if(id != null && id != '') {
                this.isCreate = false;
                this.loadData(id)
            }
        },
        methods: {
        	loadData(id) {
                var formEdit = this.formEdit;
                let _this = this;
                this.$http.get('/home/api/mailProtocol/get', {id: id}, function(result) {
                    if(result.success &&　result.data != null) {
                        let entity = result.data;
                        for(let key in formEdit) {
                            if(entity[key] != null) {
                            	if(typeof entity[key] == 'boolean') {
                            		formEdit[key] = entity[key] ? '1' : '0';
                            	}
                            	else{
                                   formEdit[key] = entity[key] + "";
                            	}
                            }
                            else {
                                formEdit[key] = "";
                            }
                        }
                    }
                });
            },
            handleSubmit (name) {
                var _this = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.loading = true;
                        this.$http.post('/home/api/mailProtocol/save', this.formEdit, function(result) {
                            _this.loading = false;
                            if(result.success) {
                                _this.$Message.success('保存协议信息成功');
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
