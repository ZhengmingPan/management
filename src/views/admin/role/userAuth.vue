<style scoped>
</style>
<template>
    <div>
        <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="ivu-icon ivu-icon-person"></Icon>
                用户管理
            </BreadcrumbItem>
            <BreadcrumbItem>角色列表</BreadcrumbItem>
            <BreadcrumbItem>用户授权</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '0px 0px', minHeight: '280px', background: '#fff'}">
            <CustomTable ref="customTable" :url="table.url" :query="table.query" :columns="table.columns"  :defaultSort="table.defaultSort" :placeholder="table.placeholder" :tools="table.tools"></CustomTable>
        </Content>
        <Modal v-model="modalEdit" title="选择授权用户" width="500">
            <Form ref="formEdit" :model="formEdit"  :label-width="50">
                <FormItem label="用户" prop="userId">
                    <Select v-model="formEdit.userId"  filterable remote :remote-method="searchUser" :loading="autoSelect.loading">
                        <Option v-for="(option, index) in autoSelect.options" :value="option.id" :key="index">{{option.name}}({{option.loginName}})
                        </Option>
                    </Select>
                 </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" @click="modalEdit = false">取消</Button>
              <Button type="primary" :loading="saveLoading" @click="confirmAuth">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import CustomTable from '@/components/custom-table/custom-table.vue';
    import Button from 'iview';
    export default {
        components: {
            CustomTable
        },
        data() {
            return {
                autoSelect: {
                    loading: false,
                    options: []
                },
                modalEdit: false,
                saveLoading: false,
                formEdit: {
                    userId: '',
                },
                table: {
                    tools: [{
                        text: '返回',
                        icon: 'arrow-return-left',
                        color: 'ghost',
                        click: () => {
                            this.$router.back();
                        }
                    }, {
                        text: '新增',
                        icon: 'plus',
                        color: 'primary',
                        click: () => {
                            this.modalEdit = true;
                            this.formEdit.userId = '';
                        }
                    }],
                    placeholder: '账号、姓名',
                    url: '/home/api/role/pageUsers',
                    query:{id: this.$route.query.id},
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
                        width: 200,
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
                                            let vm  = this;
                                            this.$Modal.confirm({
                                                title: '系统提示',
                                                content: '确定移除用户的授权角色？',
                                                onOk: () => {
                                                    this.$http.post('/home/api/role/removeUser', {
                                                        id: vm.$route.query.id,
                                                        userId: params.row.id
                                                    }, function(result) {
                                                        if(result.success) {
                                                            vm.$refs['customTable'].reload();
                                                            vm.$Message.success("移除用户成功");
                                                        } else {
                                                            vm.$Message.error({
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
                }
            };
        },
        created() {
        },
        methods: {
            confirmAuth() {
                if(this.formEdit.userId == '') {
                    this.$Message.error("请选择授权用户");
                    return false;
                }
                var _this = this;
                this.saveLoading = true;
                this.$http.post("/home/api/role/distributeUser",{id: this.$route.query.id, userId: this.formEdit.userId},  function(result) {
                        _this.saveLoading = false;
                        if(result.success) {
                            _this.modalEdit = false;
                            _this.$Message.success('角色授权成功');
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
