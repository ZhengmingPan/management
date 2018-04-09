<style scoped>
</style>
<template>
    <div>
        <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="ivu-icon ivu-icon-person"></Icon>
                用户管理
            </BreadcrumbItem>
            <BreadcrumbItem>用户列表</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '0px 0px', minHeight: '280px', background: '#fff'}">
            <CustomTable :highSearch="table.highSearch" ref="customTable" :url="table.url" :query="table.query" :columns="table.columns"  :defaultSort="table.defaultSort" :placeholder="table.placeholder" :tools="table.tools"></CustomTable>
        </Content>
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
                table: {
                    tools: [{
                        text: '新增',
                        icon: 'plus',
                        color: 'primary',
                        click: () => {
                            this.$router.push({path: '/admin/user/create'})
                        }
                    }],
                    placeholder: '账号、姓名',
                    url: '/home/api/user/page',
                    query:{},
                    highSearch: [{
                        title: '账号',
                        name: 'loginName',
                        type: 'Input'
                    }, {
                        title: '姓名',
                        name: 'name',
                        type: 'Input'
                    }, {
                        title: '电话',
                        name: 'mobile',
                        type: 'Input'
                    }, {
                        title: '状态',
                        name: 'status',
                        type: 'Select',
                        options: [{
                            value: 'I',
                            text: '未激活'
                        }, {
                            value: 'A',
                            text: '正常'
                        }, {
                            value: 'T',
                            text: '已停用'
                        }]
                    }, {
                        title: '注册开始时间',
                        name: 'startDate',
                        type: 'DatePicker',
                        format: 'yyyy-MM-dd HH:mm',
                        picker: 'datetime'
                    }, {
                        title: '注册结束时间',
                        name: 'endDate',
                        type: 'DatePicker',
                        format: 'yyyy-MM-dd HH:mm',
                        picker: 'datetime'
                    }],
                    defaultSort: ['id', 'desc'],
                    columns: [{
                        type: 'selection',
                        width: 56,
                        align: 'center',
                        fixed: 'left'
                    }, {
                        type: 'index',
                        width: 56,
                        align: 'center',
                        fixed: 'left'
                    }, {
                        title: '账号',
                        key: 'loginName',
                        sortable: true,
                        width: 120,
                        fixed: 'left'
                    }, {
                        title: '姓名',
                        key: 'name',
                        sortable: true,
                        width: 120
                    }, {
                        title: '性别',
                        key: 'sex',
                        sortable: true,
                        width: 80,
                        render: function(h, params) {
                            let sex = params.row.sex;
                            let data = {};
                            if(sex == 1) {
                                data.color = 'blue';
                                data.text = '男';
                            } else if(sex == 2) {
                                data.color = 'green';
                                data.text = '女';
                            } else {
                                data.color = 'gray';
                                data.text = '保密';
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        color: data.color,
                                    }
                                }, data.text)
                            ]);
                        }
                    }, {
                        title: '生日',
                        key: 'birthday',
                        sortable: true,
                        width: 120,
                        render: (h, params) => {
                            if(params.row.birthday != '' && params.row.birthday != null) {
                                return h('div', params.row.birthday.substring(0, 10));
                            }
                            return '';
                        }
                    }, {
                        title: '电话',
                        key: 'mobile',
                        sortable: true,
                        width: 150
                    }, {
                        title: '邮箱',
                        key: 'email',
                        sortable: true,
                        width: 180
                    }, {
                        title: '注册时间',
                        key: 'registerTime',
                        sortable: true,
                        width: 180
                    }, {
                        title: '状态',
                        key: 'mobile',
                        sortable: true,
                        fixed: 'right',
                        width: 80,
                        align: 'center',
                        render: function(h, params) {
                            let data = {};
                            if(params.row.status == 'I') {
                                data.color = 'yellow';
                                data.text = '未激活';
                            } else if(params.row.status == 'A') {
                                data.color = 'green';
                                data.text = '正常';
                            } else {
                                data.color = 'red';
                                data.text = '已停用';
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        color: data.color,
                                    }
                                }, data.text)
                            ]);
                        }
                    }, {
                        title: '操作',
                        key: 'actions',
                        fixed: 'right',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            let data = {};
                            if(params.row.status == 'I') {
                                data.type = 'ghost';
                                data.text = '激活';
                            } else if(params.row.status == 'A') {
                                data.type = 'error';
                                data.text = '停用';
                            } else {
                                data.type = 'success';
                                data.text = '启用';
                            }
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
                                            this.$router.push({path: '/admin/user/update', query: {
                                                id: params.row.id
                                            }});
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/admin/user/entryPassword', query:{
                                                id: params.row.id,
                                                loginName: params.row.loginName,
                                                name: params.row.name
                                            }});
                                        }
                                    }
                                }, '重置密码'),
                                h('Button', {
                                    props: {
                                        type: data.type,
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            var url = '';
                                            if(params.row.status != 'A') {
                                                url = '/home/api/user/start'
                                            } else {
                                                url = '/home/api/user/stop'
                                            }
                                            this.$Modal.confirm({
                                                title: '系统提示',
                                                content: '确定'+ (params.row.status != 'A' ? '启用' : '停用') + '该用户吗？',
                                                onOk: () => {
                                                    var _this  = this;
                                                    this.$http.post(url, {id: params.row.id}, function(result) {
                                                        if(result.success) {
                                                            _this.$refs['customTable'].reload();
                                                            _this.$Message.success(params.row.status != 'A' ? '启用用户成功' : '停用用户成功');
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
                                                onCancel: () => {
                                                }
                                            });
                                        }
                                    }
                                }, data.text),
                            ]);
                        }
                    }]
                }
            }
        },
        created() {
        },
        methods: {
        }
    };
</script>
