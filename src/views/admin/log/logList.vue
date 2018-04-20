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
            <Form ref="formQuery" :model="formQuery" inline>
                <FormItem prop="">
                    <DatePicker clearable type="datetimerange" format="yyyy-MM-dd HH:mm" @on-change="changeDateRange"  placeholder="操作时间范围" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem prop="searchKey">
                    <Input type="text" v-model="formQuery.searchKey" placeholder="描述、路径"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleQuery('formQuery')"><Icon type="search"></Icon> 查询</Button>
                </FormItem>
            </Form>
            <Table border stripe height="355" @on-sort-change="changeSort" :loading="table.loading" :columns="table.columns" :data="table.values" size="small"
                   :style="{margin: '0px 10px'}"></Table>
            <Page :styles="{padding: '10px 10px', textAlign: 'right'}" :page-size="page.pageSize"
                  :page-size-opts="page.pageSizeOpts" :current="page.current" :total="page.total" show-total show-sizer
                  show-elevator @on-change='changePageNo' @on-page-size-change='changePageSize'></Page>
     
    </div>
</template>
<script>
    export default {
        data() {
            return {
                formQuery: {
                    searchKey: '',
                    startTime: '',
                    endTime: ''
                },
                table: {
                    loading: false,
                    columns: [{
                        type: 'selection',
                        width: 56,
                        align: 'center',
                        fixed: 'left',
                    }, {
                        type: 'index',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },{
                        title: '操作时间',
                        fixed: 'left',
                        width: 150,
                        key: 'logTime',
                        ellipsis: true,
                        sortable: true
                    }, {
                        title: '操作人',
                        key: 'username',
                        fixed: 'left',
                        width: 100,
                        ellipsis: true,
                        sortable: true
                    }, {
                        title: '描述',
                        key: 'description',
                        width: 240,
                        ellipsis: true,
                        sortable: true
                    }, {
                        title: '路径',
                        key: 'url',
                        width: 400,
                        ellipsis: true,
                        sortable: true
                    }, {
                        title: '类型',
                        key: 'method',
                        width: 80,
                        sortable: true
                    }, {
                        title: '响应时间(ms)',
                        key: 'spendTime',
                        width: 140,
                        sortable: true
                    }, {
                        title: 'IP地址',
                        key: 'ip',
                        width: 120,
                        ellipsis: true,
                        sortable: true
                    }, {
                        title: '操作',
                        key: 'actions',
                        width: 80,
                        fixed: 'right',
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
                                                content: '确定要删除日志吗？',
                                                onOk: () => {
                                                    var _this  = this;
                                                    this.$http.post('/home/api/log/delete', {id: params.row.id}, function(result) {
                                                        if(result.success) {
                                                            _this.loadData();
                                                            _this.$Message.success('删除日志成功。');
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
                                }, '删除')
                            ]);
                        }
                    }],
                    values: []
                },
                page: {
                    total: 0,
                    pageSize: 10,
                    current: 1,
                    pageSizeOpts: [10, 20, 50, 100],
                    sortBy: 'logTime',
                    sortDir: 'desc'
                }
            };
        },
        created() {
            this.loadData();
        },
        methods: {
            changeDateRange(value) {
                this.formQuery.startTime = '';
                this.formQuery.endTime = '';
                if(value[0] != null && value[0] != undefined) {
                    this.formQuery.startTime = value[0];
                }
                if(value[1] != null && value[1] != undefined) {
                    this.formQuery.endTime = value[1];
                }
            },
            handleQuery() {
                this.loadData();
            },
            changePageNo(pageNo) {
                this.page.current = pageNo;
                this.loadData();
            },
            changePageSize: function (pageSize) {
                this.page.pageSize = pageSize;
                this.loadData();
            },
            changeSort(data) {
                let order = data.order == 'normal' ? 'desc' : data.order;
                let key = data.order == 'normal' ? 'id' : data.key;
                this.page.sortBy = key;
                this.page.sortDir = order;
                this.loadData();
            },
            loadData: function () {
                var _this = this;
                this.table.loading = true;
                this.$http.get('/home/api/log/page', {
                    pageNo: this.page.current,
                    pageSize: this.page.pageSize,
                    sortBy: this.page.sortBy,
                    sortDir: this.page.sortDir,
                    searchKey: this.formQuery.searchKey,
                    startTime: this.formQuery.startTime,
                    endTime: this.formQuery.endTime
                }, function (result) {
                    _this.table.loading = false;
                    if (result.success) {
                        _this.table.values = result.data.content;
                        _this.page.total = result.data.totalElements;
                    }
                });
            }
        }
    };
</script>
