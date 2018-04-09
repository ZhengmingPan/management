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
                <Icon type="ivu-icon ivu-icon-person"></Icon>
                用户管理
            </BreadcrumbItem>
            <BreadcrumbItem>用户组</BreadcrumbItem> 
        </Breadcrumb>
        <Content :style="{minHeight: '450px', background: '#fff'}">
            <Row :style="{minHeight: '450px'}">
                <Col span="6" :style="{minHeight: '450px'}">
                   <Card :style="{minHeight: '450px', overflow: 'auto'}" dis-hover> 
                        <p slot="title"><Icon type="funnel"></Icon> 用户组结构</p> 
                        <a href="#" slot="extra" @click.prevent="showEditModal('create')">
                            <Icon type="plus"></Icon> 新增
                        </a>   
                        <a href="#" slot="extra" @click.prevent="refreshTree">
                            <Icon type="refresh"></Icon> 刷新
                        </a>
                        <Tree ref="groupTree" :data="tree.data"  :load-data="loadChildren" @on-select-change="selectGroup"></Tree>
                   </Card>
                </Col>
                <Col span="18">
                  <CustomTable ref="customTable" :url="table.url" :query="table.query" :columns="table.columns"  :defaultSort="table.defaultSort" :placeholder="table.placeholder" :tools="table.tools"></CustomTable>
                </Col> 
            </Row>
        </Content>
        <Modal v-model="modalEdit" title="编辑用户组信息" width="500">
            <Form ref="formEdit" :model="formEdit"  :rules="ruleEdit" :label-width="50">
                <FormItem label="代码" prop="code"> 
                    <Input type="text" v-model="formEdit.code" placeholder="代码"></Input>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="formEdit.name" placeholder="名称"></Input>
                </FormItem>
                <FormItem label="类型" prop="type">
                    <Select v-model="formEdit.type" placeholder="选择类型">
                        <Option value="0">公司</Option>
                        <Option value="1">部门</Option>
                        <Option value="2">小组</Option>
                        <Option value="3">其他</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="remark">
                     <Input v-model="formEdit.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" @click="modalEdit = false">取消</Button>
              <Button type="primary" :loading="saveLoading" @click="saveRole('formEdit')">保存</Button>
            </div>
        </Modal>
        <Modal v-model="modalEdit2" title="选择授权用户" width="500">
            <Form ref="formEdit2" :model="formEdit2"  :label-width="50">
                <FormItem label="用户" prop="userId"> 
                    <Select v-model="formEdit2.userId"  filterable remote :remote-method="searchUser" :loading="autoSelect.loading">
                        <Option v-for="(option, index) in autoSelect.options" :value="option.id" :key="index">{{option.name}}({{option.loginName}})
                        </Option>
                    </Select>
                 </FormItem> 
            </Form>
            <div slot="footer">
              <Button type="text" @click="modalEdit2 = false">取消</Button>
              <Button type="primary" :loading="saveLoading" @click="confirmAuth">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>

    import CustomTable from '@/components/custom-table/custom-table.vue';

    export default {
        components: {
            CustomTable
        }, 
        data() {  
           const validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必须填写代码'));
                } else { 
                    this.$http.get('/home/api/userGroup/existCode', {id: this.formEdit.id, code: value},
                        function(result){
                            if(result.success && result.data) {
                                callback(new Error('代码已被使用')); 
                            } 
                            else { 
                                callback();
                            }
                        });
                }
            }; 
            return {
                tree: {
                    data: []
                }, 
                modalEdit2: false, 
                formEdit2: {
                    userId: '',
                },
                modalEdit: false,
                formEdit: {
                    id: '',
                    code: '',
                    name: '',
                    type: '',
                    parentId: '',
                    remark: ''
                },
                ruleEdit: {
                    code: [{required: true, message: '必须填写代码', trigger: 'blur'},{validator: validateCode, trigger: 'blur'}],
                    name: [{required: true, message: '必须填写名称', trigger: 'blur'}],
                    type: [{required: true, message: '必须选择类型', trigger: 'blur'}]
                },
                saveLoading: false, 
                table: {  
                    tools: [{
                        text: '编辑信息',
                        icon: '',
                        color: 'primary',
                        click: () => {this.showEditModal('update');}
                    }, {
                        text: '分配用户',
                        icon: '',
                        color: 'primary',
                        click: () => {this.distribute();}
                    }],
                    placeholder: '账号、姓名',
                    url: '/home/api/userGroup/pageUsers',
                    query:{id: ''},
                    defaultSort: ['id', 'asc'],
                    columns: [{
                        type: 'selection',
                        width: 56,
                        align: 'center'
                    }, {
                        type: 'index',
                        width: 56,
                        align: 'center'
                    }, {
                        title: '账号',
                        key: 'loginName',
                        sortable: true
                    }, {
                        title: '姓名',
                        key: 'name',
                        sortable: true
                    }, {
                        title: '电话',
                        key: 'mobile',
                        sortable: true
                    }, {
                        title: '邮箱',
                        key: 'email', 
                        sortable: true
                    }, {
                        title: '操作',
                        key: 'actions', 
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => { 
                                            this.$Modal.confirm({ 
                                                title: '系统提示',
                                                content: '确定移除用户的授权角色？',
                                                onOk: () => { 
                                                    var _this  = this;
                                                    this.$http.post('/home/api/userGroup/removeUser', {
                                                        id: _this.table.query.id,
                                                        userId: params.row.id
                                                    }, function(result) {  
                                                        if(result.success) { 
                                                            _this.$refs['customTable'].reload(); 
                                                            _this.$Message.success("移除用户成功"); 
                                                        } else {  
                                                            _this.$Message.error({  
                                                                content: result.message,   
                                                                duration: 0,  
                                                                closable: true 
                                                            });    
                                                        } 
                                                    });  
                                                },  
                                                onCancel: () => {}  
                                            });
                                        }
                                    }
                                }, '移除')
                            ]);
                        }
                    }]
                },
                autoSelect: {
                    loading: false,
                    options: []
                }
            };
        },
        created() {  
            this.initTree();  
        },
        methods: {  
            refreshTree() { 
                this.initTree();
            },
            initTree() {
                let _this = this; 
                this.$http.get('/home/api/userGroup/getByParentId', {parentId: ''}, function(result) {
                    if(result.success) { 
                        _this.tree.data = [];
                        if(result.data.length > 0) { 
                            for(let i=0; i<result.data.length; i++) {
                                let child = {
                                    group: result.data[i],
                                    title: result.data[i].name + '(代码:' + result.data[i].code + ')', 
                                    children: []
                                }; 
                                if(result.data[i].isParent) {
                                    child.loading = false
                                }
                                _this.tree.data.push(child); 
                            }                      
                        } 
                    }
                });
            },
            selectGroup(item) {  
                let selectedNode = item[0];
                let group = selectedNode.group;
                this.table.query.id = group.id;
                this.$refs['customTable'].reload();
            },
            loadChildren (item, callback) {   
                this.$http.get('/home/api/userGroup/getByParentId', {parentId: item.group.id}, function(result) {
                    if(result.success) {  
                        if(result.data.length > 0) { 
                            let childs = [];
                            for(let i=0; i<result.data.length; i++) {
                                let child = {
                                    group: result.data[i],
                                    title: result.data[i].name + '(代码:' + result.data[i].code + ')',
                                    children: []
                                }; 
                                if(result.data[i].isParent) {
                                    child.loading = false;
                                }
                                childs.push(child);
                            }
                            callback(childs);
                        } 
                    }
                });
            },
            showEditModal(action) { 
                this.$refs['formEdit'].resetFields();
                let selectedNode = this.$refs['groupTree'].getSelectedNodes()[0]; 
                if(action == 'create') {
                    if(selectedNode != null && selectedNode != undefined) { 
                        let group = selectedNode.group; 
                        this.formEdit.parentId = group.id; 
                    }  
                    else {
                        this.formEdit.parentId = '';
                    }
                    this.modalEdit = true;
                }
                else {
                    if(selectedNode != null && selectedNode != undefined) {
                        for(let key in this.formEdit) {
                            if(selectedNode.group[key] != null) {
                                this.formEdit[key] = selectedNode.group[key] + "";
                            }
                            else {
                                this.formEdit[key] = "";
                            } 
                        } 
                        this.modalEdit = true;
                    }
                    else {
                        this.$Message.warning('请先选择用户组');
                    }
                    
                }
            },
            saveRole(name) { 
                let _this = this;
                this.$refs[name].validate((valid) => {
                    if(!valid) {  
                        return false;
                    }   
                    this.saveLoading = true; 
                    this.$http.post('/home/api/userGroup/save', this.formEdit, function(result) {
                         _this.saveLoading = false; 
                        if(result.success) {
                            _this.$Message.success('保存用户组成功');
                            _this.modalEdit = false;  
                            _this.initTree();
                        }
                    });
                });
            }, 
            distribute () {
                let selectedNode = this.$refs['groupTree'].getSelectedNodes()[0]; 
                if(selectedNode == null || selectedNode == undefined) {
                    this.$Message.warning("请先选择用户组");
                    return false;
                }
                this.modalEdit2 = true;
                this.formEdit2.userId = '';
            },
            confirmAuth() { 
                if(this.formEdit2.userId == '') {
                    this.$Message.error("请选择用户");
                    return false;
                }
                var _this = this;
                this.saveLoading = true;
                this.$http.post("/home/api/userGroup/distributeUser",{id: this.table.query.id, userId: this.formEdit2.userId},  function(result) { 
                        _this.saveLoading = false;
                        if(result.success) {
                            _this.modalEdit2 = false; 
                            _this.$Message.success('用户组分配成功'); 
                            _this.$refs['customTable'].reload();
                        }
                        else {
                            _this.$Message.error({ 
                                content: result.message, 
                                duration: 0,
                                closable: true
                            }); 
                        }
                    });
            },  
            searchUser (query) {
                if (query !== '') {
                    this.autoSelect.loading = true; 
                    var _this = this;
                    this.$http.get('/home/api/user/search',{
                        pageNo: 1,
                        pageSize: 25,
                        sortBy: "id",
                        sortDir: "asc",
                        searchKey: query, 
                    }, function(result) {
                        _this.autoSelect.loading = false 
                        if(result.success) {
                            _this.autoSelect.options = result.data.content;
                        }
                    })
                } else {
                    this.autoSelect.options = [];
                }
            }
        }
    };
</script>