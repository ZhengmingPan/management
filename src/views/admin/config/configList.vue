<style scoped> 
</style>
<template>
    <div>
        <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>
                <Icon type="settings"></Icon>
                配置管理
            </BreadcrumbItem>
            <BreadcrumbItem>配置项列表</BreadcrumbItem>
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
                        click: () => { this.$router.push({path: '/admin/config/create'}); }
                    }],
                    placeholder: '名称、键',
                    url: '/home/api/config/page',
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
                        width: 120,
                        sortable: true
                    },{
                        title: '键', 
                        width: 120,
                        key: 'code',
                        fixed: 'left',
                        sortable: true
                    }, {
                        title: '值',
                        key: 'value',
                        width: 120,
                        sortable: true
                    }, {
                        title: '类型',
                        key: 'typeName',
                        width: 150, 
                        sortable: true
                    }, {
                        title: '参数',
                        key: 'params',  
                        width: 400,
                        sortable: true
                    }, {
                        title: '备注',
                        key: 'remark',  
                        width: 400,
                        sortable: true
                    }, {
                        title: '值是否可修改',
                        key: 'editable', 
                        width: 140,
                        fixed: 'right',
                        sortable: true,
                        render: (h, params) => {
                            let editable = params.row.editable;
                            let type = editable ? 'checkmark-circled' : 'close-circled';
                            let color = editable ? 'green' : 'red';
                            return h('Icon', {
                                props: {
                                    type: type,
                                    color: color,
                                    size: '18'
                                }
                            });
                        }
                    }, {
                        title: '操作',
                        key: 'actions', 
                        width: 150,
                        fixed: 'right',
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
                                             this.$router.push({path: '/admin/config/update', query: {id: params.row.id}});
                                        }
                                    }
                                }, '编辑'),
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
                                                content: '确定要删除配置项吗？',
                                                onOk: () => { 
                                                    var _this  = this;
                                                    this.$http.post('/home/api/config/delete', {id: params.row.id}, function(result) {  
                                                        if(result.success) {
                                                            _this.$refs['customTable'].reload();
                                                            _this.$Message.success('删除配置项成功。');
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