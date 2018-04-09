<style scoped>
</style>
<template>
    <div>
        <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="settings"></Icon>
                协议管理
            </BreadcrumbItem>
            <BreadcrumbItem>协议列表</BreadcrumbItem>
        </Breadcrumb>
        <Content :style="{padding: '0px 0px', minHeight: '280px', background: '#fff'}">
            <CustomTable ref="customTable" :url="table.url" :query="table.query" :columns="table.columns"  :defaultSort="table.defaultSort" :placeholder="table.placeholder" :tools="table.tools"></CustomTable>
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
                        click: () => { this.$router.push({path: '/mail/protocol/create'}); }
                    }],
                    placeholder: '名称',
                    url: '/home/api/mailProtocol/page',
                    query:{},
                    defaultSort: ['id', 'desc'],
                    columns: [{
                        type: 'selection',
                        width: 56,
                        align: 'center',
                        fixed: 'left',
                    }, {
                        type: 'index',
                        width: 56,
                        fixed: 'left',
                        align: 'center'
                    }, {
                        title: '名称',
                        key: 'name',
                        fixed: 'left',
                        width: 140,
                        sortable: true
                    },{
                        title: '邮箱后缀',
                        width: 140,
                        key: 'suffix',
                        sortable: true
                    }, {
                        title: 'SMTP协议',
                        key: 'smtp',
                        width: 140,
                        sortable: true
                    }, {
                        title: 'POP3协议',
                        key: 'pop3',
                        width: 140,
                        sortable: true
                    }, {
                        title: 'IMAP协议',
                        key: 'imap',
                        width: 140,
                        sortable: true
                    }, {
                        title: '官网链接',
                        key: 'link',
                        width: 300,
                        sortable: true
                    }, {
                        title: '描述',
                        key: 'description',
                        width: 400,
                        sortable: true
                    }, {
                        title: '操作',
                        key: 'actions',
                        width: 180,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                          let data = {};
                          if(params.row.delFlag) {
                              data.type = 'success';
                              data.text = '启用';
                              data.info = '确定启用邮件协议吗？';
                              data.message = '启用协议成功';
                              data.url = '/home/api/mailProtocol/start';
                          }else{
                              data.type = 'error';
                              data.text = '停用';
                              data.info = '确定停用邮件协议吗？';
                              data.url = '/home/api/mailProtocol/stop';
                              data.message = '停用协议成功';
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
                                            this.$router.push({path: '/mail/protocol/update', query: {id: params.row.id}});
                                       }
                                   }
                               }, '编辑'),h('Button', {
                                  props: {
                                      type: 'info',
                                      size: 'small'
                                  },
                                  style: {
                                      marginRight: '5px'
                                  },
                                  on: {
                                      click: () => {
                                           this.$router.push({path: '/mail/account', query: {protocolId: params.row.id}});
                                      }
                                  }
                              }, '查看账户'),
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
                                }, data.text)
                            ]);
                        }
                    }]
                }
            };
        },
        created() {
        },
        methods: {
        }
    };
</script>
