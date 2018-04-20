import AdminLayout from '@/views/layout/admin.vue';
import MailIndex from '@/views/mail/index.vue';
import ProtocolList from '@/views/mail/protocol/protocolList.vue';
import ProtocolForm from '@/views/mail/protocol/protocolForm.vue';
import AccountList from '@/views/mail/account/accountList.vue';
import AccountForm from '@/views/mail/account/accountForm.vue';
import EntryPassword from '@/views/mail/account/entryPassword.vue';
import WriteForm from '@/views/mail/write/writeForm.vue';
import MessageList from '@/views/mail/message/messageList.vue';
import MessageDetail from '@/views/mail/message/messageDetail.vue';


const EmptyParent = {
    template: '<transition name="move" mode="out-in"><router-view></router-view></transition>'
};

const routers = [{
    path: '/mail',
    component: AdminLayout,
    children: [{
        path: 'index',
        meta: {
            menu: 'index',
            title: '主页'
        },
        component: MailIndex
    }, {
        path: 'write',
        meta: {
            menu: 'write',
            title: '写信'
        },
        component: WriteForm
    }, {
        path: 'inbox',
        meta: {
            menu: 'inbox',
            title: '收件箱'
        },
        component: MessageList
    }, {
        path: 'protocol',
        component: EmptyParent,
        meta: {
          menu: 'protocol',
          title: '协议管理'
        },
        children: [{
            path: '',
            meta: {
                menu: 'system-protocol',
                title: '协议列表'
            },
            component: ProtocolList
        }, {
            path: 'create',
            meta: {
                menu: 'system-protocol',
                title: '编辑协议信息'
            },
            component: ProtocolForm
        }, {
            path: 'update',
            meta: {
                menu: 'system-protocol',
                title: '编辑协议信息'
            },
            component: ProtocolForm
        }]
    }, {
        path: 'account',
        component: EmptyParent,
        meta: {
          menu: 'account',
          title: '账户管理'
        },
        children: [{
            path: '',
            meta: {
                menu: 'system-account',
                title: '账户列表'
            },
            component: AccountList
        }, {
            path: 'messages',
            component: EmptyParent,
            children: [{
                path: '',
                meta: {
                    menu: 'system-account',
                    title: '收件箱'
                },
                component: MessageList,
            }, {
                path: 'detail',
                meta: {
                    menu: 'system-account',
                    title: '邮件详情'
                },
                component: MessageDetail,
            }]
        }, {
            path: 'entryPassword',
            meta: {
                menu: 'system-account',
                title: '重置密码'
            },
            component: EntryPassword
        }, {
            path: 'update',
            meta: {
                menu: 'system-account',
                title: '编辑账户信息'
            },
            component: AccountForm
        }, {
            path: 'create',
            meta: {
                menu: 'system-account',
                title: '编辑账户信息'
            },
            component: AccountForm
        }]
    }]
}];

export default routers;
