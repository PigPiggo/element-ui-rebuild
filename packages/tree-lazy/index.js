import Tree from './src/tree-lazy.vue';

/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree);
};

export default Tree;
