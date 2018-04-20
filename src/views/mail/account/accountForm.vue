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
               <FormItem label="协议类型">
                  <Select v-model="formEdit.protocolId" placeholder="选择协议类型" @on-change="changeProtocol">
                      <Option v-for="(option, index) in autoSelect.options" :value="option.id" :key="index">{{option.name}}
                      </Option>
                  </Select>
               </FormItem>
               <FormItem label="用户名" prop="username">
                  <Input type="text" v-model="formEdit.username" :readonly="!isCreate" placeholder="用户名"></Input>
               </FormItem>
               <FormItem label="密码" prop="plainPassword" v-if="isCreate">
                  <Input type="password" v-model="formEdit.plainPassword" placeholder="密码"></Input>
               </FormItem>
               <FormItem label="姓名" prop="name">
                   <Input type="text" v-model="formEdit.name" placeholder="姓名"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="phone">
                    <Input type="text" v-model="formEdit.phone" placeholder="电话"></Input>
                </FormItem>
                <FormItem label="邮箱地址" prop="mail">
                    <Input type="text" v-model="formEdit.mail" placeholder="邮箱"></Input>
                </FormItem>
                <FormItem label="居住地址" prop="address">
                    <Row>
                       <Col span="12">
                         <al-selector v-model="area" data-type="name" level="2"/>
                       </Col>
                       <Col span="12">
                          <Input type="text" style="margin-left:10px;" v-model="formEdit.address" placeholder="详细地址"></Input>
                       </Col>
                    </Row>
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
                    callback(new Error('必须填写用户名'));
                } else {
                    this.$http.get('/home/api/mailAccount/existName', {id: id, username: value, protocolId: this.formEdit.protocolId},
                        function(result){
                            if(result.success && result.data) {
                                callback(new Error('用户名已被使用'));
                            }
                            else {
                                callback();
                            }
                        });
                }
            };
            return {
                area:[],
                autoSelect: {
                    options: []
                },
                loading: false,
                formEdit: {
                    id: '',
                    username: '',
                    name: '',
                    plainPassword: '',
                    mail: '',
                    phone: '',
                    protocolId: '',
                    province: '',
                    city: '',
                    county: '',
                    address: ''
                },
                ruleEdit: {
                    username:[{required: true, message: '必须填写用户名', trigger: 'blur'},
                               {validator: validateUserName, trigger: 'blur'}],
                    plainPassword:[{required: true, message: '必须填写密码', trigger: 'blur'}],
                    name:[{required: true, message: '必须填写姓名', trigger: 'blur'}],
                    protocolId:[{required: true, message: '必须选择协议类型', trigger: 'blur'}],
                    mail:[{required: true,type: 'email', message: '请正确填写邮箱', trigger: 'blur'}]
                },
                isCreate: true
            };
        },
        watch: {
          area(newValue) {
             let area = {
               province: !newValue[0] ? '' : newValue[0],
               city: !newValue[1] ? '' : newValue[1],
               county: !newValue[2] ? '' : newValue[2]
             }
             this.formEdit.province = area.province;
             this.formEdit.city = area.city;
             this.formEdit.county = area.county;
          }
        },
        created () {
            let id = this.$route.query.id;
            this.searchProtocol();
            if(id != null && id != '') {
                this.isCreate = false;
                this.loadData(id)
            }
        },
        methods: {
            loadData(id) {
                var formEdit = this.formEdit;
                let _this = this;
                this.$http.get('/home/api/mailAccount/get', {id: id}, function(result) {
                    if(result.success &&　result.data != null) {
                        let entity = result.data;
                        let area = ['', '', ''];
                        area[0] = entity.province;
                        area[1] = entity.city;
                        area[2] = entity.county;
                        _this.area = area;
                        for(let key in formEdit) {
                            if(key === 'protocolId') {
                                formEdit[key] = entity.protocol.id;
                                continue;
                            }
                            if(entity[key] != null) {
                               formEdit[key] = entity[key] + "";
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
                        this.$http.post('/home/api/mailAccount/save', this.formEdit, function(result) {
                            _this.loading = false;
                            if(result.success) {
                                _this.$Message.success('保存账户成功');
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
            searchProtocol () {
                var _this = this;
                this.$http.get('/home/api/mailProtocol/list',{}, function(result) {
                    if(result.success) {
                        _this.autoSelect.options = result.data;
                        if(_this.isCreate) {
                           _this.formEdit.protocolId = result.data[0].id;
                        }
                    }

                });
            },
            changeProtocol (value) {
                this.formEdit.protocolId = value;
            }
        }
    };
</script>
