import { AssertionError } from 'assert';

export function assert(condition: unknown, msg?: string): asserts condition {
    if (!condition) {
        throw new AssertionError({ message: msg });
    }
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    if (val === undefined || val === null) {
        throw new AssertionError({ message: `Except 'val' to be defined, but received ${val}` });
    }
}
