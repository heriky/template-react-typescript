import { assertIsDefined } from './types';

/**
 * 以下情况都会被剪枝
 * 对象的情况：{ c: null, d: undefined, e: [null, undefined] }
 * 数组的情况: [], [null, undefined, { a: null, b: undefined }]
 * @param v
 */
export function shake(v: unknown): unknown {
    if (Object.prototype.toString.call(v) === '[object Object]') {
        return Object.entries(v as Record<string, unknown>).reduce((acc, [key, value]) => {
            const shakedValue = shake(value);
            return shakedValue === undefined ||
                shakedValue === null ||
                (typeof shakedValue === 'string' && shakedValue.trim() === '')
                ? acc
                : { ...acc, [key]: shakedValue };
        }, {});
    }
    if (Array.isArray(v)) {
        return v.filter(item => !isEmpty(shake(item)));
    }
    if (typeof v === 'string') {
        return v.trim();
    }
    return v;
}

export function isEmpty(v: unknown): boolean {
    return (
        v === undefined ||
        v === null ||
        (typeof v === 'string' && v.trim() === '') ||
        (Object.prototype.toString.apply(v) === '[object Object]' && JSON.stringify(v) === '{}') ||
        (Array.isArray(v) && v.every(item => isEmpty(item)))
    );
}

export function isEquals(a: unknown, b: unknown) {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function randomId(len: number) {
    const genUnit = () => Math.random().toString(36).substr(2);

    const randomUnit = genUnit();
    if (len <= 0) return randomUnit;
    else if (len <= 11) return randomUnit.substr(0, len);
    else {
        let rs = '';
        while (rs.length < len) {
            rs += genUnit();
        }
        return rs.substr(0, len);
    }
}

export function formatMoney(price: string | undefined) {
    if (isEmpty(price)) return '--';
    assertIsDefined(price);

    // eslint-disable-next-line
    //@ts-ignore
    const money = price.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'CNY',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
    });
    return money.replace('CN', ''); // 除去CN
}

export function formatNum(num: number, precision = 0) {
    if (isEmpty(num)) return '--';
    return (num.toFixed(precision) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
