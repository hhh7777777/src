const http = axios.create({
    baseURL: 'http://localhost:8888',
  });
//获取用户列表
  http.get('/users/list', {
    params: {
      current: 1,    // 当前页
      pagesize: 10,  // 每页大小
      search: ''     // 搜索条件，可以根据需要传递
    }
  })
    .then(response => {
      console.log('获取到的用户数据:', response.data);
      
      // 筛选所需的数据（只存储 username, nickname, password）
      const userList = response.data.list.map(user => ({
        username: user.username,
        nickname: user.nickname,
        password: user.password
      }));
      // 将用户数据存储到 localStorage
      localStorage.setItem('userList', JSON.stringify(userList));
      alert('用户数据已读取到localStorage');
    })
    .catch(error => {
      console.error('请求失败:', error);
    });
  //添加请求拦截器 
  http.interceptors.request.use(function (config) {
    if (localStorage.getItem('token')) {
      config.headers['authorization'] = localStorage.getItem('token');
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  
  // 获取 localStorage 中的值，封装为函数
function getLocalStorageItem(key) {
  return localStorage.getItem(key);
}
//校验登录状态
  async function isLogin() {
    let token = localStorage.getItem('token');
    let id = localStorage.getItem('id');
    if (!token ||!id) return { status: 0, msg: '用户未登录' };
    try {
      let { data: { code, info } } = await http.get('/users/info', { params: { id } });
      // 如果返回的 code 不是 1，表示未登录或验证失败
      if (code!= 1) return { status: 0, msg: '用户未登录' };
      // 返回用户已登录的信息
      return {
        status: 1,
        msg: '用户已登录',
        token,
        id,
        info
      };
    } catch (error) {
      console.error('获取用户信息时发生错误:', error);
  
      // 处理网络错误或其他异常情况
      return { status: 0, msg: '无法验证登录状态，请稍后再试' };
    }
  }