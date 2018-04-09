<style scoped>
</style>
<template>
    <div>
        <Breadcrumb v-if="!inbox" :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="ivu-icon ivu-icon-person"></Icon>
                账户管理
            </BreadcrumbItem>
            <BreadcrumbItem>邮件列表</BreadcrumbItem> 
        </Breadcrumb>
        <Breadcrumb v-if="inbox" :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="filing"></Icon>
                收件箱
            </BreadcrumbItem> 
        </Breadcrumb>
        <Content :style="{padding: '0px 0px', minHeight: '280px', background: '#fff'}">
            <CustomTable :highSearch="table.highSearch" ref="customTable" :url="table.url" :query="table.query" :columns="table.columns"  :defaultSort="table.defaultSort" :placeholder="table.placeholder" :tools="table.tools"></CustomTable>
            <Modal v-model="modalEdit" title="导入" width="500">
                <Form :label-width="50">
                    <FormItem label="密码" prop="plainPassword">
                        <Input type="password" v-model="plainPassword" placeholder="密码"></Input>
                    </FormItem>　
                </Form>
                <div slot="footer">
                  <Button type="text" @click="modalEdit = false">取消</Button>
                  <Button type="primary" :loading="saveLoading" @click="confirmImport">保存</Button>
                </div>
            </Modal> 
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
            let tools = [];
            if(this.$route.query.id) {
              tools.push({
                  text: '返回',
                  icon: 'arrow-return-left',
                  color: 'ghost',
                  click: () => {
                      this.$router.back();
                  }
              });
            }
            tools.push({
                text: '导入',
                icon: 'archive',
                color: 'primary',
                click: () => {
                  this.modalEdit = true;
                }
            });
            return { 
                inbox: !this.$route.query.id,
                modalEdit:false,
                plainPassword: '',
                saveLoading: false,
                table: {
                    tools: tools,
                    placeholder: '标题、内容',
                    url: '/home/api/mailMessage/page',
                    query: {
                      accountId: this.$route.query.id
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
                       title: '标题',
                       key: 'subject',
                       sortable: true,
                       width: 300,
                       fixed: 'left'
                    }, {
                        title: '发件',
                        key: 'from',
                        sortable: true,
                        width: 250,
                    }, {
                        title: '发送时间',
                        key: 'sendTime',
                        sortable: true,
                        width: 160
                    }, {
                        title: '抄送',
                        key: 'cc',
                        sortable: true,
                        width: 250
                    }, {
                        title: '密送',
                        key: 'bcc',
                        sortable: true,
                        width: 250
                    }, {
                        title: '导入时间',
                        key: 'createTime',
                        sortable: true,
                        width: 180
                    },{
                        title: '大小',
                        key: 'size',
                        sortable: true,
                        width: 100,
                    },{
                        title: '操作',
                        key: 'actions',
                        fixed: 'right',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
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
                                            this.$router.push({path: '/mail/account/messages/detail', query: {id: params.row.id}})
                                        }
                                    }
                                }, '查看'),
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
                                              content: "确定删除邮件吗？",
                                              onOk: () => {
                                                vm.$http.post('/home/api/mailMessage/delete', {id: params.row.id}, function(result) {
                                                    if(result.success) {
                                                        vm.$refs['customTable'].reload();
                                                        vm.$Message.success("删除邮件成功");
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
                                }, '删除'),

                            ]);
                        }
                    }]
                }
            }
        },
        created() {
        },
        methods: {
          confirmImport() {
            let vm = this;
            let plainPassword = this.plainPassword;
            if(plainPassword == '') {
              vm.$Message.error({
                  content: '必须填写密码',
                  duration: 0,
                  closable: true
              });
              return;
            }
            this.saveLoading = true;
            let accountId = this.$route.query.id ? this.$route.query.id : '';
            this.$http.post('/home/api/mailMessage/importMessages', {
              accountId: accountId,
              plainPassword: plainPassword
            }, function(result) {
              vm.saveLoading = false;
              if(result.success) {
                  vm.modalEdit = false;
                  vm.$Message.success("导入邮件成功");
                  vm.$refs['customTable'].reload();
              }
              else {
                  vm.$Message.error({
                      content: result.message,
                      duration: 0,
                      closable: true
                  });
              }
            });
          }
        }
    };
</script>
