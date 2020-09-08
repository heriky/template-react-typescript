import React, { CSSProperties, ReactElement } from 'react';
import cls from 'classnames';

import styles from './style.less';
import { shake } from '@utils';

export default function GridLite(props: Props) {
    const {
        columnCount,
        rowCount,
        templateArea,
        gap,
        style,
        className,
        children,
        templateColumns,
        templateRows,
    } = props;

    const _cls = cls(
        {
            [styles.column]: columnCount,
            [styles.row]: rowCount,
            [styles.templateColumns]: templateColumns,
            [styles.templateRows]: templateRows,
            [styles.area]: templateArea,
        },
        [styles.grid],
        className
    );
    const _style = shake({
        ...style,
        '--gap': gap,
        '--columnCount': parseInt(columnCount + ''),
        '--rowCount': parseInt(rowCount + ''),
        '--templateColumns': templateColumns,
        '--templateRows': templateRows,
        '--templateArea': templateArea,
    }) as CSSProperties;

    return (
        <section style={_style} className={_cls}>
            {React.Children.map(children, child => {
                const { 'aria-colspan': colSpan = 1, 'aria-rowspan': rowSpan = 1 } = child.props;
                if (!colSpan && !rowSpan) return child;

                const gridArea = `span ${rowSpan} / span ${colSpan}`;
                return React.cloneElement(child, { style: { ...child.props.style, gridArea } });
            })}
        </section>
    );
}

const defaultProps = {
    templateColumns: '',
    templateRows: '',
    columnCount: 0 as NumStr,
    rowCount: 0 as NumStr,
    templateArea: '',
    gap: 0 as NumStr,
    style: {},
    className: '',
};
GridLite.defaultProps = defaultProps;

type NumStr = string | number;
type Props = {
    templateColumns: string;
    templateRows: string;
    columnCount: NumStr;
    rowCount: NumStr;
    templateArea: string;
    gap: NumStr;
    style: CSSProperties;
    className: string;
    children: ReactElement | ReactElement[];
} & typeof defaultProps;
