const menu = [{
  name: "index",
  title: "首页",
  path: "/admin/index",
  icon: "home"
},{
  name: "usermanage",
  title: "用户管理",
  icon: "person",
  children: [{
    name: "user",
    title: "用户",
    path: "/admin/user"
  },{
    name: "role",
    title: "角色",
    path: "/admin/role"
  },{
    name: "userGroup",
    title: "用户组",
    path: "/admin/userGroup"
   }]
},{
  name: 'config',
  title: '配置项管理',
  path: '/admin/config',
  icon: "settings"
},{
  name: 'annex',
  title: '文件管理',
  path: '/admin/annex',
  icon: "filing"
},{
  name: 'log',
  title: '系统日志',
  path: '/admin/log',
  icon: "document-text"
}];
export default menu;
