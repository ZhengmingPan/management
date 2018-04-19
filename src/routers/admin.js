import Index from '@/views/index.vue';
import Login from '@/views/login.vue';
import AdminLayout from '@/views/layout/admin.vue';
import AdminIndex from '@/views/admin/index.vue';
import UserList from '@/views/admin/user/userList.vue';
import UserForm from '@/views/admin/user/userForm.vue';
import EntryPassword from '@/views/admin/user/entryPassword.vue';
import RoleList from '@/views/admin/role/roleList.vue';
import UserAuth from '@/views/admin/role/userAuth.vue';
import UserGroupList from '@/views/admin/userGroup/userGroupList.vue';
import LogList from '@/views/admin/log/logList.vue';
import AnnexList from '@/views/admin/annex/annexList.vue';
import ConfigList from '@/views/admin/config/configList.vue';
import ConfigForm from '@/views/admin/config/configForm.vue';

import MailRouters from '@/routers/mail';

const EmptyParent = {
  template: '<transition name="move" mode="out-in"><router-view></router-view></transition>'
};

var routers = [{
    path: '/',
    redirect: '/index',
}, {
    path: '/index',
    meta: {
        title: '欢迎进入数据管理平台'
    },
    component: Index
}, {
    path: '/login',
    meta: {
        title: '登录系统'
    },
    component: Login
}, {
    path: '/admin',
    component: AdminLayout,
    children: [{
        path: 'index',
        meta: {
            menu: 'index',
            title: '主页'
        },
        component: AdminIndex
    },{
        path: 'user',
        component: EmptyParent,
        meta: {
            title: '用户管理'
        }, 
        children:[{
            path: '',
            meta: {
                menu: 'usermanage-user',
                title: '用户列表'
            },
            component: UserList
        }, {
            path: 'entryPassword',
            meta: {
                menu: 'usermanage-user',
                title: '重置密码'
            },
            component: EntryPassword
        }, {
            path: 'update',
            meta: {
                menu: 'usermanage-user',
                title: '编辑用户信息'
            },
            component: UserForm
        }, {
            path: 'create',
            meta: {
                menu: 'usermanage-user',
                title: '编辑用户信息'
            },
            component: UserForm
        }]
    }, {
        path: 'role',
        component: EmptyParent,
        meta: {
            title: '角色管理'
        },
        children: [{
            path: "",
            meta: {
                menu: 'usermanage-role',
                title: '角色列表'
            },
            component: RoleList
        },{
            path: 'userAuth',
            meta: {
                menu: 'usermanage-role',
                title: '用户授权'
            },
            component: UserAuth
        }]
    }, {
        path: 'userGroup',
        meta: {
            menu: 'usermanage-userGroup',
            title: '用户组管理'
        },
        component: UserGroupList
    }, {
        path: 'log',
        meta: {
            menu: 'log',
            title: '系统日志'
        },
        component: LogList
    }, {
        path: 'annex',
        meta: {
            menu: 'annex',
            title: '文件管理'
        },
        component: AnnexList
    }, {
        path: 'config',
        component: EmptyParent,
        meta: {
            title: '配置项管理'
        },
        children: [{
            path: '',
            meta: {
                menu: 'config',
                title: '配置项列表'
            },
            component: ConfigList
        }, {
            path: 'create',
            meta: {
                menu: 'config',
                title: '编辑配置项信息'
            },
            component: ConfigForm
        }, {
            path: 'update',
            meta: {
                menu: 'config',
                title: '编辑配置项信息'
            },
            component: ConfigForm
        }]
    }]
}];


for(let key in MailRouters) {
   routers.push(MailRouters[key]);
}
export default routers;
