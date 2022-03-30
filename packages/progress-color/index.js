import ElProgress from './src/progress-color.vue';

/* istanbul ignore next */
ElProgress.install = function(Vue) {
  Vue.component(ElProgress.name, ElProgress);
};

export default ElProgress;
