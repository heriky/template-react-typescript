import { LabelFilters } from '@constants';
import { observable } from 'mobx';

class AppStore {
    @observable
    currentFilter = LabelFilters[0];
}

export default new AppStore();
