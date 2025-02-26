// 使用 axios 请求获取用户数据并存储到 localStorage
async function fetchUserData() {
  try {
    const response = await axios.get('/users/list', {
      params: {
        current: 1,    // 当前页
        pagesize: 10,  // 每页大小
        search: ''     // 搜索条件
      }
    });

    console.log('获取到的用户数据:', response.data);

    // 筛选出需要的字段（只存储 username, nickname, password）
    const userList = response.data.list.map(user => ({
      token: user.token,
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      password: user.password
    }));
    //与localStorage中存储的数据进行比较
    const storedUserList = localStorage.getItem('userList');
    if (storedUserList) {
      const storedUserListObj = JSON.parse(storedUserList);
      // 比较存储的数据和当前数据
      if (JSON.stringify(storedUserListObj) === JSON.stringify(userList)) {
        console.log('用户数据未更新');
      } else {
        console.log('用户数据已更新');
      }
    }
    // 将用户数据存储到 localStorage
    localStorage.setItem('userList', JSON.stringify(userList));

    //alert('用户数据已成功存储到 localStorage');
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 页面加载时执行
window.onload = function() {
  // 从 localStorage 中读取存储的用户数据
  const storedUserList = localStorage.getItem('usersList');
  
  if (storedUserList) {
    // 如果存储的用户数据存在，解析它
    const userList = JSON.parse(storedUserList);
    console.log('从 localStorage 读取的用户数据:', userList);
  } else {
    console.log('没有找到存储的用户数据');
  }

  // 获取并存储用户数据
  fetchUserData();
};
// 使用 axios 请求后端进行登录
async function backendLogin(username, password) {
  try {
    const { data } = await axios.post('/users/login', { username, password });
    // 打印后端返回的数据到控制台
    console.log('后端返回的数据:', data); // 打印后端返回的整个数据
    if (data.code === 1) {
      // 登录成功，保存 token 和用户信息到 localStorage
      localStorage.setItem('token', data.token); // 保存 token
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        username: data.user.username,
        nickname: data.user.nickname,
        password: password,
        gender: data.user.gender,
        age: data.user.age,
        identity: data.user.identity,
        createTime: data.user.createTime
      }));
      alert('登录成功');
      window.location.href = 'http://localhost:8888'; // 登录成功后跳转到首页或个人中心

      // 登录成功后将 localStorage 中的用户数据通过后端接口存储到数据库
      await syncUserDataWithBackend();
    } else {
      alert('登录失败: ' + data.message);
    }
  } catch (error) {
    console.error('后端登录出错:', error);
    alert('登录出错，请稍后重试');
  }
}

  // 将 localStorage 中的用户数据同步到后端数据库
  async function syncUserDataWithBackend() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      console.log('当前用户信息不存在，无法同步');
      return;
    }

    // 发送更新请求到后端
    const response = await axios.post('/users/update', currentUser);

    if (response.data.code === 1) {
      console.log('用户数据同步成功');
    } else {
      console.log('用户数据同步失败:', response.data.message);
     }
    } catch (error) {
    console.error('同步用户数据到后端出错:', error);
    }
  }

// 页面加载时执行
window.onload = function () {
  const errBox = document.querySelector('.error');
  const form = document.querySelector('form');
  const nameInp = document.querySelector('.username');
  const pwdInp = document.querySelector('.password');

  // 提交登录表单
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = nameInp.value;
    const password = pwdInp.value;

    // 验证用户名和密码是否为空
    if (!username || !password) {
      alert('请输入用户名和密码');
      return;
    }

    // 禁用提交按钮防止重复提交
    let submitButton = form.querySelector('button');
    submitButton.disabled = true;

    // 调用后端登录函数
    await backendLogin(username, password);

    // 提交后重新启用按钮
    submitButton.disabled = false;
  });
};