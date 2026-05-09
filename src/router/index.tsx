import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom'
import { FormTemplate } from './components';
import App from '../App';

const routes: RouteObject[] = [
  {
    path: '',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <div style={{ padding: 24 }}>
            <h2>欢迎来到我的模板</h2>
            <p>点击导航项即可加载对应组件页面。</p>
          </div>
        ),
      },
      {
        path: 'template',
        children: [
          {
            path: 'form',
            element: <FormTemplate />
          },
        ]
      }
    ]
  }
]

export const router = createBrowserRouter(routes)
