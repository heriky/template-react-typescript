import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import { ConfigProvider } from 'antd';
// import 'antd/dist/antd.css'; //已经由cdn引入
import zhCN from 'antd/es/locale/zh_CN'; // antd中文语言包
import 'dayjs/locale/zh-cn'; // dayjs中文语言包

import history from '@commons/history';
import App from './containers';

import '@assets/css/global.less'; // 全局样式
import '@assets/css/antd-reset.less';
import 'highlight.js/styles/atom-one-dark.css';

/**
 * [MobX] You haven't configured observer batching which might result in unexpected behavior in some cases.
 * See more at https://github.com/mobxjs/mobx-react-lite/#observer-batching
 */
// import 'mobx-react-lite/batchingForReactDom';

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Router history={history}>
            <App />
        </Router>
    </ConfigProvider>,
    document.querySelector('#root')
);

if (module.hot) {
    module.hot.accept();
}
