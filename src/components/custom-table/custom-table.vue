<style type="text/css">
	@import 'custom-table.css';
</style>
<template>
	<div>
	<Row v-if="tools || search">
		<Col span="12" :style="{padding:'10px 10px'}" v-if="tools">
		    <Button style="margin-right:5px" v-for="(item,index) in tools" v-if="!item.upload" :key="index" :type="item.color" @click="item.click"><Icon  v-if="item.icon"  :type="item.icon"></Icon> {{item.text}}</Button>
		    <Upload style="margin-right:5px" v-for="(item,index) in tools" v-if="item.upload" :show-upload-list="false" :action="item.upload" :key="index" :on-progress="uploadProgress" :on-success="uploadSuccess">
            <Button :loading="uploadLoading" v-if="item.icon" :type="item.color" :icon="item.icon">{{item.text ? item.text : '上传文件'}}</Button>
        </Upload>
    </Col>
    <Col span="12" v-if="search"  :style="{padding:'10px 10px'}">
			  <Poptip v-if="highSearch && highSearch.length > 0" style="float:right;display:inline;margin-top:1px;margin-left:5px;" placement="bottom-end" v-model="visiable" trigger="click" width="500" title="筛选条件">
				   <Button type="primary" @click="visiable = true"> 高级搜索 <Icon :type="higharrow"></Icon></Button>
				   <div class="" slot="content">
						  <Form :label-width="80">
								 <FormItem v-for="item in highSearch" :key="item.name" :label="item.title" :prop="item.name">
									   <template v-if="item.type == 'Input'">
										    <Input type="text" v-model="high[item.name]" :placeholder="item.title" clearable></Input>
										 </template>
										 <template v-else-if="item.type == 'Select'">
											   <Select v-model="high[item.name]" :placeholder="item.title" transfer clearable>
													   <Option v-for="opt in item.options" :key="opt.value" :value="opt.value">{{ opt.text }}</Option>
												 </Select>
										 </template>
										 <template v-else-if="item.type == 'DatePicker'">
											   <DatePicker :type="item.picker" v-model="high[item.name]" :format="item.format" :placeholder="item.title" style="width:100%" transfer clearable></DatePicker>
										 </template>
								 </FormItem>
								 <FormItem style="margin-bottom:16px;">
									  <Button type="ghost" @click="visiable = false">取消</Button>
										&nbsp;&nbsp;
									  <Button type="primary" @click="reload">确定</Button>
								 </FormItem>
							</Form>
				   </div>
			  </Poptip>
        <Form inline style="float:right;display:inline;padding:0px 0px;">
            <FormItem prop="searchKey">
                <Input type="text" v-model="searchKey" clearable :placeholder="placeholder"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="loadData"><Icon type="search"></Icon> 查询</Button>
            </FormItem>
        </Form>
    </Col>
 </Row>
 <Table border stripe height="355" @on-sort-change="changeSort" :loading="loading" :columns="initColumns" :data="values" size="small" :style="{margin: '0px 10px'}"></Table>
 <Page :page="page" :styles="{padding: '10px 10px', textAlign: 'right'}" :page-size="pageSize" :page-size-opts="[10, 20, 50, 100]" :current="current" :total="total" show-total show-sizer show-elevator @on-change='changePageNo' @on-page-size-change='changePageSize'></Page>
</div>
</template>

<script>

	const tools = {
	   text: '',
	   icon: '',
	   color: '',
	   click: () => {},
	   upload: ''
	};
	export default {
	    name: 'custom-table',
			model: {

			},
	    props: {
				  highSearch: {
              type: Array,
							default: () => { return []; }
          },
	        tools: {
              type: Array,
							default: () => { return []; }
          },
					search: {
						  type: Boolean,
							default: true
					},
	        url: {
              type: String,
              required: true
          },
	        columns: {
              type: Array,
              required: true
          },
	        placeholder: {
	            type: String,
	            default: '关键字'
	        },
	        query: Object,
	        defaultSort: {
	            type: Array,
	            default: ['id', 'desc']
	        },
					page: {
						  type: Boolean,
							default: true
					}
	    },
	    data () {
	        return {
						  dateformat: 'yyyy-MM-dd HH:mm:ss',
						  higharrow: 'arrow-down-b',
						  visiable: false,
	            uploadLoading: false,
	            searchKey: '',
	            initColumns: [],
                loading: false,
                values: [],
                total: 0,
                current: 1,
                pageSize: 10,
                sort: {
                   name: 'id',
                   dir: 'desc'
                },
								high: {}
	        };
	    },
	    created () {
	        this.sort.name = this.defaultSort[0];
	        this.sort.dir = this.defaultSort[1];
	        let columns = this.columns;
	        for(let i=0;i<columns.length;i++) {
	            columns[i].ellipsis = true;
	        }
	        this.initColumns = columns;
	        this.loadData();
	    },
	    computed: {
	        base() {
	            return {
                    pageNo: this.current,
                    pageSize: this.pageSize,
                    sortBy: this.sort.name,
                    sortDir: this.sort.dir
                };
	        },
	        formQuery() {
	            let base = this.base;
	            base.searchKey = this.searchKey;
              for(let key in this.query) {
                  base[key] = this.query[key];
              }
							let high = this.high;
							for(let key in high) {
								  if(high[key]) {
										 if(high[key] instanceof Date) {
												let year = high[key].getFullYear();
												let month = high[key].getMonth() + 1 > 9 ? (high[key].getMonth() + 1) : ('0' + (high[key].getMonth() + 1));
												let date = high[key].getDate() > 9 ? high[key].getDate() : ('0' + high[key].getDate());
												let hour = high[key].getHours() > 9 ? high[key].getHours() : ('0' + high[key].getHours());
												let minute = high[key].getMinutes() > 9 ? high[key].getMinutes() : ('0' + high[key].getMinutes());
												if(this.dateformat === "yyyy-MM") {
													  base[key] = year + "-" + month;
												}
												else if(this.dateformat === "yyyy-MM-dd") {
													 base[key] = year + "-" + month + "-" + date;
												}
												else if(this.dateformat === "yyyy-MM-dd HH") {
													 base[key] = year + "-" + month + "-" + date + " " + hour;
												}
												else {
													 base[key] = year + "-" + month + "-" + date + " " + hour + ":" + minute;
												}

										 }
										 else {
											  base[key] = high[key] + "";
										 }
									}
									else {
										 base[key] = "";
									}
							}
	            return base;
            }
	    },
	    methods: {
            changePageNo(pageNo) {
                this.current = pageNo;
            },
            changePageSize: function (pageSize) {
                this.pageSize = pageSize;
            },
            changeSort(data) {
                let order = data.order == 'normal' ? this.defaultSort[1] : data.order;
                let key = data.order == 'normal' ? this.defaultSort[0] : data.key;
                this.sort.name = key;
                this.sort.dir = order;
            },
            loadData: function () {
                let vm = this;
                this.loading = true;
                this.$http.get(this.url, this.formQuery, function (result) {
                    vm.loading = false;
                    if (result.success) {
											  if(vm.page) {
													 vm.values = result.data.content;
	                         vm.total = result.data.totalElements;
												}
												else {
													 vm.values = result.data;
													 vm.total = result.data.length;
												}
                    }
                });
            },
            reload() {
								this.visiable = false;
                this.loadData();
            },
            uploadProgress() {
                this.uploadLoading = true;
            },
            uploadSuccess(result) {
                this.uploadLoading = false;
                if(result.success) {
                    this.$Message.success('文件上传成功');
                    this.loadData();
                }
                else {
                    this.$Message.error({
                        content: result.message,
                        duration: 0,
                        closable: true
                    });
                }
            },
						changeDate(value) {
							  let iniformat = 'yyyy-MM-dd HH:mm:ss';
							  let format = iniformat.substring(0, value.length);
								this.dateformat = format;
						}
	    },
	    watch: {
	        base(newValue, oldValue) {
						if(newValue !== oldValue) {
		            this.loadData();
						}
	        },
					visiable(newValue) {
						   this.higharrow = newValue ? 'arrow-up-b' : 'arrow-down-b';
 					}
	    }
    }
</script>
