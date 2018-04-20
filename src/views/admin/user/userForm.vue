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
                <Row>
                    <Col span="12">
                        <FormItem label="账号" prop="loginName">
                            <Input type="text" v-model="formEdit.loginName" :readonly="!isCreate" placeholder="账号"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="plainPassword" v-if="isCreate">
                            <Input type="password" v-model="formEdit.plainPassword" placeholder="密码"></Input>
                        </FormItem>
                        <FormItem label="姓名" prop="name">
                            <Input type="text" v-model="formEdit.name" placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem label="性别" prop="sex">
                            <RadioGroup  style="width:100%;" v-model="formEdit.sex">
                                <Radio label="0">保密</Radio>
                                <Radio label="1">男</Radio>
                                <Radio label="2">女</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="生日" prop="birthday">
                            <DatePicker style="width:100%;" type="date" placeholder="生日" format="yyyy-MM-dd" @on-change="changeDate" :value="formEdit.birthday"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12" style="padding-left:80px;">
                        <Card style="width:180px; text-align:center;padding:0px 0px;">
                            <img :src="upload.defaultAvatar[0].url" style="width:100%;height:130px;" />
                            <Upload :show-upload-list="false" :default-file-list="upload.defaultAvatar" :action="upload.action" :data="upload.data" :name="upload.name" :on-success="uploadSuccess" :format="upload.format" :on-format-error="uploadFormatError"style="width:100%;">
                                <Button type="info" icon="ios-cloud-upload-outline" long>上传头像</Button>
                            </Upload>
                        </Card>
                    </Col>
                </Row>
                <FormItem label="电话" prop="mobile">
                    <Input type="text" v-model="formEdit.mobile" placeholder="电话"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input type="text" v-model="formEdit.email" placeholder="邮箱"></Input>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <Select v-model="formEdit.status" placeholder="状态">
                       <Option value="I">未激活</Option>
                       <Option value="A">正常</Option>
                       <Option value="E">已过期</Option>
                       <Option value="L">已锁定</Option>
                       <Option value="T">已终止</Option>
                    </Select>
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
            var id = this.$route.query.id;
            const validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必须填写账号'));
                } else {
                    this.$http.get('/home/api/user/existLoginName', {id: id, loginName: value},
                        function(result){
                            if(result.success && result.data) {
                                callback(new Error('账号已被使用'));
                            }
                            else {
                                callback();
                            }
                        });
                }
            };
            return {
                downloadUrl: '/home/api/annex/download/',
                upload:{
                    action: '/home/api/user/saveAvatar',
                    data: {
                        id: ''
                    },
                    name: 'avatar',
                    format: ['jpg','jpeg','png'],
                    defaultAvatar: [{
                        'name': '',
                        'url': this.$Img.avatar
                    }]
                },
                loading: false,
                formEdit: {
                    id: '',
                    loginName: '',
                    name: '',
                    plainPassword: '',
                    email: '',
                    mobile: '',
                    sex: '0',
                    birthday:'',
                    status: 'A',
                    avatar: ''
                },
                ruleEdit: {
                    loginName:[{required: true, message: '必须填写账号', trigger: 'blur'},
                               {validator: validateUserName, trigger: 'blur'}],
                    plainPassword:[{required: true, message: '必须填写密码', trigger: 'blur'}],
                    name:[{required: true, message: '必须填写姓名', trigger: 'blur'}],
                    sex:[{required: true, message: '必须选择性别', trigger: 'blur'}],
                    status:[{required: true, message: '必须选择状态', trigger: 'blur'}],
                    mobile:[{required: true, message: '必须填写电话', trigger: 'blur'}],
                    email:[{type: 'email', message: '请正确填写邮箱', trigger: 'blur'}]
                },
                isCreate: true
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
            changeDate(value) {
                 this.formEdit.birthday = value + " 00:00:00";
            },
            loadData(id) {
                var formEdit = this.formEdit;
                let _this = this;
                this.$http.get('/home/api/user/get', {id: id}, function(result) {
                    if(result.success &&　result.data != null) {
                        let entity = result.data;
                        for(let key in formEdit) {
                            if(entity[key] != null) {
                                formEdit[key] = entity[key] + "";
                            }
                            else {
                                formEdit[key] = "";
                            }
                        }
                        _this.upload.data.id = entity.id;
                        if(entity.avatar != '' && entity.avatar != null) {
                            _this.upload.defaultAvatar[0].url = _this.downloadUrl + entity.avatar
                        }
                    }
                });
            },
            handleSubmit (name) {
                var _this = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.loading = true;
                        this.$http.post('/home/api/user/save', this.formEdit, function(result) {
                            _this.loading = false;
                            if(result.success) {
                                _this.$Message.success('保存用户成功');
                                _this.$router.back();
                            }
                            else {
                                _this.$Message.error({
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
            },
            uploadSuccess (res, file) {
                if(res.success) {
                    let filepath = res.data;
                    let current = this.upload.defaultAvatar[0];
                    current.url = this.downloadUrl + filepath;
                    this.formEdit.avatar = filepath;
                }
                else {
                    this.$Message.error(res.message);
                }
            },
            uploadFormatError (file) {
                this.$Message.warning("必须上传图片格式为png, jpg, jpeg的文件");
            }
        }
    };
</script>
