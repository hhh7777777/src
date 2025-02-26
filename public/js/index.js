const http = axios.create({
  baseURL: 'http://localhost:8888',
});
let pEles = document.querySelectorAll('p');
let fn = async () => {
  let { status, info, id } = await isLogin();
  if (status!= 1) {
    pEles[0].classList.add('active');
    pEles[1].classList.remove('active');
    return;
  }
  pEles[0].classList.remove('active');
  pEles[1].classList.add('active');
  pEles[1].firstElementChild.textContent = info.nickname;
  pEles[1].addEventListener('click', async ({ target }) => {
    if (target.className == 'self') {
      window.location.href = './self.html';
    }
    if (target.className == 'logout') {
      if (confirm('确定要退出登录？')) {
        // 清除本地存储中的所有相关信息
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('currentUser');
        try {
          // 发送后端退出登录请求
          await http.get('/users/logout', { params: { id } });
          alert('退出登录成功');
        } catch (error) {
          console.error('后端退出登录出错:', error);
          // 即使后端出错，也确保前端界面更新为未登录状态
          alert('退出登录成功');
        } finally {
          pEles[0].classList.add('active');
          pEles[1].classList.remove('active');
          // 刷新页面，确保所有状态更新
          window.location.reload();
        }
      }
    }
  });
};
fn();