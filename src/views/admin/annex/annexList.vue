<style scoped>
</style>
<template>
    <div>
      <CustomTable ref="customTable" :url="table.url" :query="table.query" :columns="table.columns"  :defaultSort="table.defaultSort" :placeholder="table.placeholder" :tools="table.tools"></CustomTable>
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
                        text: '上传文件',
                        icon: 'upload',
                        color: 'primary',
                        click: () => { },
                        upload: '/home/api/annex/upload'
                    }],
                    placeholder: '文件名',
                    url: '/home/api/annex/page',
                    query:{},
                    defaultSort: ['createTime', 'desc'],
                    columns: [{
                        type: 'selection',
                        width: 56,
                        align: 'center'
                    }, {
                        type: 'index',
                        width: 56,
                        align: 'center'
                    }, {
                        title: '文件名',
                        key: 'name',
                        sortable: true,
                        ellipsis: true
                    }, {
                    	title: '文件类型',
                        key: 'objectType',
                         width: 120,
                        sortable: true
                    }, {
                        title: '上传时间',
                        width: 160,
                        key: 'createTime',
                        sortable: true
                    }, {
                        title: '操作',
                        key: 'actions',
                        width: 140,
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
                                           window.open('/home/api/annex/download/' + params.row.path);
                                        }
                                    }
                                }, '下载'),
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
                                                content: '确定要删除文件吗？',
                                                onOk: () => {
                                                    var _this  = this;
                                                    this.$http.post('/home/api/annex/remove', {id: params.row.id}, function(result) {
                                                        if(result.success) {
                                                            _this.$Message.success('删除文件成功。');
                                                            console.log(_this.$refs['customTable'])
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
                                                onCancel: () => {
                                                }
                                            });
                                        }
                                    }
                                }, '删除')
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
