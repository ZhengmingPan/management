 <style scoped>
.layout-logo{
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav{
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-con{
  height: 100%;
  width: 100%;
}
   .menu-item span{
       display: inline-block;
       overflow: hidden;
       width: 80px;
       text-overflow: ellipsis;
       white-space: nowrap;
       vertical-align: bottom;
       transition: width .2s ease .2s;
   }
   .menu-item i{
       transform: translateX(0px);
       transition: font-size .2s ease, transform .2s ease;
       vertical-align: middle;
       font-size: 16px;
   }
   .collapsed-menu span{
       width: 0px;
       transition: width .2s ease;
   }
   .collapsed-menu i{
       transform: translateX(5px);
       transition: font-size .2s ease .2s, transform .2s ease .2s;
       vertical-align: middle;
       font-size: 22px;
   }
</style>
<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider :style="{background: '#495060'}"  collapsible :collapsed-width="73" v-model="isCollapsed">
        <Menu ref="leftMenu" theme="dark" width="auto" @on-select="menuSelect" :active-name="activeName" accordion :open-names="openNames" :class="menuitemClasses">
          <template v-for="item in menuItems">
            <template v-if="item.children">
              <Submenu :name="item.name + '-'" v-if="!isCollapsed">
                <template slot="title">
                  <Icon :type="item.icon" v-if="item.icon"></Icon><span>{{item.title}}</span>
                </template>
                <template v-for="child in item.children">
                  <MenuItem :name="item.name + '-' + child.name"><span>{{child.title}}</span></MenuItem>
                </template>
              </Submenu>
              <Dropdown style="width:100%" placement="right-start" @on-click="menuSelect" v-if="isCollapsed" transfer>
                <MenuItem :name="item.name + '-'"><Icon :type="item.icon" v-if="item.icon"></Icon></MenuItem>
                <DropdownMenu style="width: 200px" slot="list">
                  <template v-for="child in item.children">
                    <DropdownItem :name="item.name + '-' + child.name">{{child.title}}</DropdownItem>
                  </template>
                </DropdownMenu>
              </Dropdown>
            </template>
            <template v-else>
              <MenuItem v-if="!isCollapsed" :name="item.name"><Icon :type="item.icon" v-if="item.icon"></Icon> <span>{{item.title}}</span></MenuItem>
              <Dropdown style="width:100%" placement="right-start" @on-click="menuSelect" v-if="isCollapsed" transfer>
                <MenuItem :name="item.name"><Icon :type="item.icon" v-if="item.icon"></Icon></MenuItem>
                <DropdownMenu style="width: 200px" slot="list">
                    <DropdownItem :name="item.name">{{item.title}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </template>
          </template>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', height: '59px', padding: '0 20px'}">
          <Menu :active-name="topActiveName" mode="horizontal" @on-select="topMenuTo">

              <Breadcrumb style="float:left;">
                 <BreadcrumbItem  v-for="item in breakcrumbItems" :key="item.name">
                   {{item.title}}
                 </BreadcrumbItem>
              </Breadcrumb>
            <!--
            <Breadcrumb style="float:left;">
               <BreadcrumbItem>
                 <Icon type="home"></Icon>
                 用户管理
               </BreadcrumbItem>
               <BreadcrumbItem>
                用户列表
               </BreadcrumbItem>
            </Breadcrumb>
            -->
             <div class="layout-nav">
              <Submenu>
                <template slot="title">
                    <Icon type="ionic"></Icon> 切换系统
                </template>
                <MenuItem name="AdminMenu">
                  <Icon type="person"></Icon> Admin系统
                </MenuItem>
                <MenuItem name="MailMenu">
                  <Icon type="email"></Icon> 邮箱系统
                </MenuItem>
              </Submenu>
              <Submenu>
                <template slot="title">
                  <Avatar :src="avatar" size="small"></Avatar>  欢迎您，{{username}}
                </template>
                <MenuItem name="logout">
                  <Icon type="ivu-icon ivu-icon-log-out"></Icon> 注销
                </MenuItem>
              </Submenu>
            </div>
          </Menu>
        </Header>
        <Content :style="{padding: '20px 20px'}">
          <transition name="move" mode="out-in"><router-view></router-view></transition>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>

    import AdminMenu from './menu-admin.js';
    import MailMenu from './menu-mail.js';

    import SockJs from 'sockjs-client';
    var Stomp = require('stompjs');

    export default {
        data() {
           return {
              breakcrumbItems: [],
              openNames: [''],
              activeName: '',
              topActiveName: '',
              isCollapsed: false,
              username: '',
              avatar: this.$Img.avatar,
              menuItems: AdminMenu,
              stompClient: null
           };
        },
        computed: {
           menuitemClasses: function () {
               return [
                   'menu-item',
                   this.isCollapsed ? 'collapsed-menu' : ''
               ]
           }
        },
        updated() {
          this.refresh();
        },
        created() {
          this.loadBreakCrumb();
          this.refresh();
          var vm = this;
          this.stompClient = Stomp.over(new SockJs('http://localhost:9000/home/homeWs'));
          this.stompClient.connect({}, (frame) => {
            console.log("Connected: " + frame);
            vm.stompClient.subscribe('/topic/getResponse', (response) => {
              console.log("Result:  " + response.body)
            });
          });
        },
        methods: {
           refresh() {
            if(this.$route.path.indexOf('/admin/') >= 0) {
                this.menuItems = AdminMenu;
                this.topActiveName = 'AdminMenu';
            } else if(this.$route.path.indexOf('/mail/') >= 0) {
                this.menuItems = MailMenu;
                this.topActiveName = 'MailMenu'
            }
            this.$nextTick(() => {
               this.$refs.leftMenu.updateOpened();
               this.$refs.leftMenu.updateActiveName();
            });
            let currentPage = this.$route.meta.menu;
            let openName = '';
            if(currentPage) {
                if(currentPage.indexOf('-') >= 0) {
                    openName = currentPage.substring(0, currentPage.indexOf("-") + 1);
                }
            }
            this.openNames[0] = openName;
            this.username = this.$cookie.get('username');
            this.activeName = this.isCollapsed && openName.indexOf('-') >= 0 ?　openName : currentPage;
            this.$Message.destroy();
            let currentId = this.$cookie.get('token');
            if(currentId != '') {
              let vm = this;
              this.$http.get(this.$api.home.current.url,{}, (result) => {
                if(result.success) {
                  if(result.data == null) {
                    vm.$cookie.clear('token');
                    vm.$cookie.clear('username');
                    vm.$router.replace("/login");
                  }
                  vm.username = result.data.name;
                  vm.avatar = this.avatar;
                  if(result.data.avatar != '' && result.data.avatar != null) {
                    vm.avatar = '/home/api/annex/download/' + result.data.avatar;
                  }
                }
              });
            }
           },
           loadBreakCrumb() {
               let matcheds = this.$route.matched;
               console.log(matcheds);
               let breakcrumbs = [];
               for(let index=0;index < matcheds.length; index++) {
                 if(matcheds[index].meta && matcheds[index].meta.title) {
                   breakcrumbs.push({
                     title: matcheds[index].meta.title,
                     path: matcheds[index].path,
                     name: matcheds[index].meta.menu + index
                   })
                 }
               }
              this.breakcrumbItems = breakcrumbs;
              console.log(this.breakcrumbItems);
           },
           menuSelect(name) {
             if(name) {
               if(name.indexOf("-") == name.length - 1) {
                 return false;
               }
               let openName = '';
               if(name.indexOf("-") < name.length - 1) {
                  openName = name.substring(0, name.indexOf("-") + 1);
                  name = name.substring(name.indexOf("-") + 1);
               }
               if(this.menuItems === AdminMenu ) {
                 this.$router.push({path: "/admin/" + name});
                 this.loadBreakCrumb();
               }
               else  if(this.menuItems === MailMenu ){
                 this.$router.push({path: "/mail/" + name});
                 this.loadBreakCrumb();
               }

             }
           },
           topMenuTo(name){
            this.stompClient.send("/welcome",{});
            var vm = this;
            if(name == 'logout') {
              this.$http.post('/home/api/account/logout',{} , (result, headers) => {
                if(result.success) {
                  vm.$cookie.set('token', '');
                  vm.$cookie.set('username', '');
                  vm.$router.replace("/login");
                } else {
                  vm.$Message.error(result.message);
                }
              })
            } else if(name == 'AdminMenu') {
                this.$router.push({path: '/admin/index'});
                this.loadBreakCrumb();
            } else if(name == 'MailMenu') {
                this.$router.push({path: '/mail/index'});
                this.loadBreakCrumb();
            }
           }
        }
    }
</script>
