import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { Suspense } from 'react';
import styles from './App.module.less';

const navItems = [
  {
    label: <Link to="/template/form">表单模板</Link>,
    key: '/template/form',
  },
];

function App() {
  const location = useLocation();

  return (
    <div className={styles.page}>
      <main className={styles.content}>
          <Suspense fallback={<div>页面加载中...</div>}>
            <Outlet />
          </Suspense>
      </main>
      <aside className={styles.sider}>
        <div className={styles.siderTitle}>组件导航</div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={navItems}
          />
      </aside>
    </div>
  );
}

export default App
