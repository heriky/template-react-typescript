import { createGroupFactory } from './group';

export { default as Content } from './content';
export { default as Sidebar } from './sidebar';

export const Group = createGroupFactory('Group');
export const HGroup = createGroupFactory('HGroup');
export const VGroup = createGroupFactory('VGroup');
