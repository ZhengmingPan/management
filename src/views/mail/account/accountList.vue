<style scoped>
</style>
<template>
    <div>
        <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="ivu-icon ivu-icon-person"></Icon>
                账户管理
            </BreadcrumbItem>
            <BreadcrumbItem>账户列表</BreadcrumbItem>
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
                            this.$router.push({path: '/mail/account/create'})
                        }
                    }],
                    placeholder: '用户名',
                    url: '/home/api/mailAccount/page',
                    query: {
                        protocolId: this.$route.query.protocolId ? this.$route.query.protocolId : ''
                    },
                    defaultSort: ['createTime', 'desc'],
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
                        title: '用户名',
                        key: 'username',
                        sortable: true,
                        width: 120,
                        fixed: 'left'
                    }, {
                        title: '姓名',
                        key: 'name',
                        sortable: true,
                        width: 120
                    }, {
                        title: '协议类型',
                        key: 'protocol',
                        sortable: true,
                        width: 140,
                        render: (h, params) => {
                           return h('span', params.row.protocol.name);
                        }
                    }, {
                        title: '邮箱地址',
                        key: 'mail',
                        sortable: true,
                        width: 180
                    }, {
                        title: '联系电话',
                        key: 'phone',
                        sortable: true,
                        width: 140
                    }, {
                        title: '居住地址',
                        key: 'address',
                        sortable: true,
                        width: 250,
                        render: (h, params) => {
                          return h('span', params.row.province + params.row.city + params.row.county + params.row.address);
                        }
                    }, {
                        title: '更新时间',
                        key: 'updateTime',
                        sortable: true,
                        width: 180
                    }, {
                        title: '操作',
                        key: 'actions',
                        fixed: 'right',
                        width: 240,
                        align: 'center',
                        render: (h, params) => {
                          let data = {};
                          if(params.row.delFlag) {
                              data.type = 'success';
                              data.text = '启用';
                              data.info = '确定启用账户吗？';
                              data.message = '启用账户成功';
                              data.url = '/home/api/mailAccount/start';
                          }else{
                              data.type = 'error';
                              data.text = '停用';
                              data.info = '确定停用账户吗？';
                              data.url = '/home/api/mailAccount/stop';
                              data.message = '停用账户成功';
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
                                            this.$router.push({path: '/mail/account/update', query: {
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
                                            this.$router.push({path: '/mail/account/entryPassword', query:{
                                                id: params.row.id,
                                                username: params.row.username,
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
                                            let vm  = this;
                                            this.$Modal.confirm({
                                                title: '系统提示',
                                                content: data.info,
                                                onOk: () => {
                                                  vm.$http.post(data.url, {id: params.row.id}, function(result) {
                                                      if(result.success) {
                                                          vm.$refs['customTable'].reload();
                                                          vm.$Message.success(data.message);
                                                       }
                                                      else {
                                                          vm.$Message.error({
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
                                h('Button', {
                                    props: {
                                        type: 'gray',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                           this.$router.push({path: '/mail/account/messages', query: {id: params.row.id}});
                                        }
                                    }
                                }, '查看邮件'),
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
