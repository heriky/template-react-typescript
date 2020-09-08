import React, { useEffect, useState, ComponentProps } from 'react';
import { Menu } from 'antd';

import history from '@commons/history';
import { useLocation } from 'react-router-dom';
import { menuRoutes } from '@routes';
import styles from './style.less';
import cls from 'classnames';

type MenuInfo = Parameters<NonNullable<ComponentProps<typeof Menu>['onClick']>>[0];

export default function SideBar(props: Props) {
    // const [menuCollapsed, setMenuCollapsed] = useState(false);

    const location = useLocation();
    const [activeRoutes, setActiveRoutes] = useState<string[]>([]);

    useEffect(() => {
        setActiveRoutes([location.pathname]);
    }, [location]);

    const handleItemClick: ComponentProps<typeof Menu>['onClick'] = item => {
        history.push(item.key + '');
        setActiveRoutes([item.key + '']);
        props.onClick(item);
    };

    return (
        <div className={cls(styles.sidebar, props.className)}>
            <Menu
                onClick={handleItemClick}
                style={{ height: '100%' }}
                defaultSelectedKeys={['overview']}
                selectedKeys={activeRoutes}
                mode="inline"
                theme="dark"
                inlineCollapsed={false}>
                {menuRoutes.map(item => (
                    <Menu.Item key={item.path} icon={item.icon}>
                        {item.title}
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
}

SideBar.defaultProps = {
    className: '',
    onClick: () => {},
};

type Props = {
    className: string;
    onClick: (item?: MenuInfo) => void;
} & typeof SideBar.defaultProps;
