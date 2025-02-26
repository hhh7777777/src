// 表单验证函数
function validateForm(form) {
  let inputs = form.querySelectorAll('input');
  for (let input of inputs) {
    if (!input.value) {
      alert('所有字段都不能为空');
      return false;
    }
  }
  return true;
}

// 注册表单提交
document.addEventListener('DOMContentLoaded', function () {
  let registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (validateForm(registerForm)) {
        // 获取表单输入的数据
        let username = registerForm.querySelector('.username').value;
        let password = registerForm.querySelector('.password').value;
        let nickname = registerForm.querySelector('.nickname').value;
        let confirmPassword = registerForm.querySelector('.confirmPassword').value;
        if (password !== confirmPassword) {
          alert('两次输入的密码不一致');
          return;
        }

        console.log(username, password,nickname);
        // 假设后端返回的结果是 backendResult
        let backendResult = await backendRegister(username, password); // 你需要实现此函数来进行注册

        if (backendResult.success) {
          // 在成功注册后存储用户数据到 localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            id: backendResult.user.id,
            username: backendResult.user.username,
            password: backendResult.password,  // 存储密码
            token: backendResult.user.token
          }));
          //发送注册请求

          alert('注册成功');
        } else {
          alert('注册失败：' + backendResult.message);
        }
      }
    });
  }
});

// 登录表单提交
document.addEventListener('DOMContentLoaded', function () {
  let loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (validateForm(loginForm)) {
        // 获取表单输入的数据
        let username = loginForm.querySelector('.username').value;
        let password = loginForm.querySelector('.password').value;

        // 假设后端返回的结果是 backendResult
        let backendResult = await backendLogin(username, password); // 你需要实现此函数来进行登录

        if (backendResult.success) {
          // 在成功登录后存储用户数据到 localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            id: backendResult.user.id,
            username: backendResult.user.username,
            password: password,  // 存储密码
            token: backendResult.user.token
          }));
          alert('登录成功');
        } else {
          alert('登录失败：' + backendResult.message);
        }
      }
    });
  }
});

// 后端注册函数
async function backendRegister(username, password) {
  try {
    let { data } = await http.post('/users/register', { username, password });
    if (data.code === 1) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: `注册失败，原因：${data.message}` };
    }
  } catch (error) {
    console.error('后端注册出错:', error);
    return { success: false, message: '后端注册出错，请稍后重试' };
  }
}

// 后端登录函数
async function backendLogin(username, password) {
  try {
    let { data } = await http.post('/users/login', { username, password });
    if (data.code === 1) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: `登录失败，原因：${data.message}` };
    }
  } catch (error) {
    console.error('后端登录出错:', error);
    return { success: false, message: '后端登录出错，请稍后重试' };
  }
}
