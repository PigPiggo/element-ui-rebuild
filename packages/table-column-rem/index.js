import ElTableColumnRem from '../table-rem/src/table-column';

/* istanbul ignore next */
ElTableColumnRem.install = function(Vue) {
  Vue.component(ElTableColumnRem.name, ElTableColumnRem);
};

export default ElTableColumnRem;
