<style scoped> 
</style>
<template>
    <div>
        <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="person"></Icon>
                用户管理
            </BreadcrumbItem>
            <BreadcrumbItem>角色列表</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '0px 0px', minHeight: '280px', background: '#fff'}"> 
            <CustomTable ref="customTable" :url="table.url" :query="table.query" :columns="table.columns"  :defaultSort="table.defaultSort" :placeholder="table.placeholder" :tools="table.tools"></CustomTable>
        </Content>
        <Modal v-model="modalEdit" title="编辑角色信息" width="500">
            <Form ref="formEdit" :model="formEdit"  :rules="ruleEdit" :label-width="50">
                <FormItem label="代码" prop="code"> 
                    <Input type="text" v-model="formEdit.code" :readonly="readonly" placeholder="代码"></Input>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input type="text" v-model="formEdit.name" placeholder="名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" @click="modalEdit = false">取消</Button>
              <Button type="primary" :loading="saveLoading" @click="saveRole('formEdit')">保存</Button>
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
            return {  
                readonly: false,
                saveLoading: false,
                modalEdit: false,
                formEdit: { 
                    id: '',
                    code: '',
                    name: ''
                },
                ruleEdit: {
                    code: [{required: true, message: '必须填写代码', trigger: 'blur'}],
                    name: [{required: true, message: '必须填写名称', trigger: 'blur'}]
                },
                table: { 
                    tools: [{
                        text: '新增',
                        icon: 'plus',
                        color: 'primary',
                        click: () => { 
                            this.readonly = false;
                            this.edit({
                                id: '',
                                code: '',
                                name: ''
                            })
                        }
                    }],
                    placeholder: '代码、名称',
                    url: '/home/api/role/page',
                    query:{},
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
                        title: '代码',
                        key: 'code',
                        sortable: true
                    }, {
                        title: '名称',
                        key: 'name',
                        sortable: true
                    }, {
                        title: '操作',
                        key: 'actions', 
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.readonly = true;
                                            this.edit(params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => { 
                                            this.$router.push({path: '/admin/role/userAuth', query: {id: params.row.id}})
                                        }
                                    }
                                }, '用户授权')
                            ]);
                        }
                    }] 
                } 
            };
        },
        created() { 
        },
        methods: { 
            edit(item) {  
                this.$refs['formEdit'].resetFields();
                for(let key in this.formEdit) {
                    this.formEdit[key] = item[key];
                }
                this.modalEdit = true;   
            },
            saveRole(name) { 
                var _this = this;
                this.$refs[name].validate((valid) => {
                    if(!valid) {  
                        return false;
                    }   
                    this.saveLoading = true;
                    this.$http.post('/home/api/role/save', this.formEdit, function(result) { 
                        _this.saveLoading = false; 
                        if(result.success) {  
                            _this.modalEdit = false; 
                            _this.$Message.success('保存角色信息成功'); 
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
                });
            }
        }
    };
</script>