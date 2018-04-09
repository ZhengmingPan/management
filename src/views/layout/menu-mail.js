const menu = [{
  name: "index",
  title: "首页",
  path: "/mail/index",
  icon: "home"
}, {
  name: "write",
  title: "写信",
  path: "/mail/write",
  icon: "edit"
}, {
  name: "inbox",
  title: "收件箱",
  path: "/mail/inbox",
  icon: "filing"
},{
  name: "system",
  title: "系统管理",
  icon: "settings",
  children: [{
    name: "protocol",
    title: "邮件协议",
    path: "/mail/protocol"
  },{
    name: "account",
    title: "邮箱账户",
    path: "/mail/account"
  }]
}];
export default menu;
