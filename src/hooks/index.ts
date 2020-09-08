import { useState, useEffect, useRef } from 'react';
import echarts, { EChartOption, ECharts } from 'echarts';
import { FilterItem } from '@constants';

export function useFilter(
    activeKey: string,
    filters: FilterItem[],
    onChange: (key: string, item?: FilterItem, index?: number) => void
) {
    const [actived, setActived] = useState(() => {
        return activeKey ?? filters[0].value;
    });

    const handler = (key: string, item?: FilterItem, index?: number) => {
        setActived(key);
        onChange(key, item, index);
    };

    useEffect(() => {
        setActived(activeKey);
    }, [activeKey]);

    return [actived, handler] as const;
}

export function useChart<T = unknown>(option: EChartOption<T>) {
    const domRef = useRef<HTMLDivElement>(null!);
    const instanceRef = useRef<ECharts | null>(null);

    useEffect(() => {
        instanceRef.current =
            echarts.getInstanceByDom(domRef.current) ?? echarts.init(domRef.current);
        instanceRef.current.setOption(option);
    }, [option]);

    useEffect(() => {
        const resize = () => instanceRef.current?.resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            instanceRef.current?.dispose();
            instanceRef.current = null;
        };
    }, []);

    return domRef;
}
