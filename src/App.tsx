import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Menu } from 'antd';
import { Suspense } from 'react';

const navItems = [
  {
    label: <Link to="/template/form">表单模板</Link>,
    key: '/template/form',
  },
];

function App() {
  const location = useLocation();

  return (
    <PageContainer
      title="我的模板-李灿"
    >
      <ProCard split="vertical" ghost>
        <ProCard title="" bordered>
          <Suspense fallback={<div>页面加载中...</div>}>
            <Outlet />
          </Suspense>
        </ProCard>
        <ProCard title="组件导航" colSpan="280px" bordered>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={navItems}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}

export default App
