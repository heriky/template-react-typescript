import React, { useLayoutEffect, useState, ReactNode, CSSProperties } from 'react';
import cls from 'classnames';

import styles from './style.less';
import { useLocation } from 'react-router-dom';
import { HGroup } from '..';
import LabelFilter from '@components/label-filter';
import { menuRoutes } from '@routes';
import DropdownFilter from '@components/dropdown-filter';
import { FilterItem } from '@constants';

const Content = (props: Props) => {
    const { children, className: _, onChange, ...rest } = props;
    const [header, setHeader] = useState<{ title?: string; icon?: ReactNode } | undefined>();
    const location = useLocation();

    useLayoutEffect(() => {
        // 菜单带来的头部信息
        const menuHeader = menuRoutes.find(item => item.path === location.pathname);
        // 自定义的头部信息
        const extraHeader = {
            title: (location.state as any)?.title,
            icon: '',
        };
        setHeader(menuHeader ?? extraHeader);
    }, [location.pathname, location.state]);

    return (
        <section className={cls(styles.content, _)} {...rest}>
            {header?.title && (
                <HGroup hAlign="space-between" style={{ marginBottom: 10 }}>
                    <h2 style={{ fontSize: '18rem' }}>
                        {header.icon}
                        &nbsp;&nbsp;{header.title}
                    </h2>
                    <LabelFilter
                        className={styles.normalFilter}
                        onChange={(item, index) => onChange(item, index)}
                    />
                    <DropdownFilter className={styles.mobileFilter} />
                </HGroup>
            )}

            {props.children}
        </section>
    );
};

const defaultProps = {
    style: {} as CSSProperties,
    className: '',
    onChange: (() => {}) as (item: FilterItem, index: number) => void,
};

Content.defaultProps = defaultProps;

type Props = {
    style: CSSProperties;
    className: string;
    children: ReactNode;
    onChange: (item: FilterItem, index: number) => void;
} & typeof defaultProps;

export default Content;
