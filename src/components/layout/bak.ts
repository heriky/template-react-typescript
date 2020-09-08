import { createGroupFactory } from './group';

export { default as Content } from './content';
export { default as Sidebar } from './sidebar';

export const Group = createGroupFactory('Group');
export const HGroup = createGroupFactory('HGroup');
export const VGroup = createGroupFactory('VGroup');

/** 这是一个很诡异的文件，Overview模块引入index.ts会报错，引入这个就不报错 */
