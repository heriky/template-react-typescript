import React, { CSSProperties, ComponentType, ReactNode } from 'react';
import cls from 'classnames';

import styles from './style.less';

export function createGroupFactory(type: 'HGroup' | 'VGroup' | 'Group') {
    const isVGroup = type === 'VGroup';

    function GroupBase(props: GroupProps) {
        const {
            hAlign,
            vAlign,
            gap: rawGap,
            flex,
            style,
            className,
            whole,
            children,
            as,
            ...rest
        } = props;

        const gap = parseInt(rawGap.toString());

        const _style = {
            ...style,
            [isVGroup ? 'alignItems' : 'justifyContent']: hAlign,
            [isVGroup ? 'justifyContent' : 'alignItems']: vAlign,
            '--gap': gap,
        };
        if (whole) {
            _style[isVGroup ? 'height' : 'width'] = '100%';
        }
        flex && (_style.flex = flex);

        const _cls = cls(styles[type], className);
        const Compo = as;

        return (
            <Compo className={_cls} style={_style} {...rest}>
                {children}
            </Compo>
        );
    }

    GroupBase.defaultProps = defaultProps;
    return GroupBase;
}

const defaultProps = {
    hAlign: 'center',
    vAlign: 'center',
    flex: '',
    gap: 0 as string | number,
    style: {},
    className: '',
    as: 'div',
    whole: false,
};

type AlignType =
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-evenly'
    | 'space-around';

type GroupProps = {
    hAlign: AlignType;
    vAlign: AlignType;
    flex: string;
    gap: string | number;
    style: CSSProperties;
    className: string;
    as: keyof JSX.IntrinsicElements | ComponentType;
    whole: boolean;
    children: ReactNode;
} & typeof defaultProps;
