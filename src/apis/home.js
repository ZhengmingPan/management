const homeApis = {
    login: {
       url: '/home/api/account/login', 
       description: '用户登录'
    },
    current: {
       url: '/home/api/account/current',
       params: {
          username: '',
          password: ''
       },
       description: '获取系统当前用户信息',
    }
}

export default homeApis;
