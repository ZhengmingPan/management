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
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="formEdit.name" placeholder="名称"></Input>
                </FormItem>
                <FormItem label="键" prop="code">
                    <Input type="text" :readonly="!isCreate" v-model="formEdit.code" placeholder="键"></Input>
                </FormItem>
                <FormItem label="值" prop="value">
                    <Input :style="isCreate ? 'width:calc(100% - 150px);margin-right:20px;' : ''" type="text" :readonly="formEdit.editable == 1 ? false : true" v-model="formEdit.value" placeholder="值"></Input>
                    <span v-if="isCreate">是否可修改</span>
                    <Switch v-model="formEdit.editable" v-if="isCreate" true-value="1" false-value="0" size="default">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </Switch>
                </FormItem>
                <FormItem label="类型" prop="type">
                    <Select v-model="formEdit.type" clearable placeholder="选择类型">
                       <Option value="0">Input输入框</Option>
                       <Option value="1">Textarea文本框</Option>
                       <Option value="2">Radio单选框</Option>
                       <Option value="3">Checkbox多选框</Option>
                       <Option value="4">Select单选框</Option>
                       <Option value="5">Select多选框</Option>
                    </Select>
                </FormItem>
                <FormItem label="参数" prop="params">
                     <Input v-model="formEdit.params" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="参数"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                     <Input v-model="formEdit.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
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
            const validatorCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必须填写键'));
                } else {
                    this.$http.get('/home/api/config/existCode', {id: id, code: value},
                        function(result){
                            if(result.success && result.data) {
                                callback(new Error('键已被使用'));
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
                	code: '',
                	value: '',
                	name: '',
                	type: '',
                	params: '',
                	editable: '1',
                	remark: ''
                },
                ruleEdit: {
                    code:[{required: true, message: '必须填写键', trigger: 'blur'},
                               {validator: validatorCode, trigger: 'blur'}],
                    name:[{required: true, message: '必须填写名称', trigger: 'blur'}],
                    value:[{required: true, message: '必须填写值', trigger: 'blur'}]
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
                this.$http.get('/home/api/config/get', {id: id}, function(result) {
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
                        this.$http.post('/home/api/config/save', this.formEdit, function(result) {
                            _this.loading = false;
                            if(result.success) {
                                _this.$Message.success('保存配置信息成功');
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
