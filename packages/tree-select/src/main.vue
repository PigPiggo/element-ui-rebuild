<template>
  <div
    class="el-select"
    v-clickoutside="() => toggleDropDownVisible(false)"
    :class="[{ 'is-disabled': disabled }]"
  >
    <el-input
      ref="reference"
      :disabled="disabled"
      @focus="toggleDropDownVisible(true)"
      v-model="inputValue"
    >
      <template slot="suffix">
        <i
          key="arrow-down"
          :class="[
            'el-input__icon',
            'el-icon-arrow-down',
            visible && 'is-reverse',
          ]"
          @click.stop="toggleDropDownVisible()"
        ></i> </template
    ></el-input>
    <transition name="el-zoom-in-top" @after-leave="doDestroy">
      <el-tree-select-menu
        ref="popper"
        :append-to-body="popperAppendToBody"
        v-show="visible"
      >
        <div
          class="wrap"
          :style="{
            width: wrapWidth,
          }"
        >
          <el-input size="small" @input="search" v-model="keywords">
            <template slot="suffix">
              <i
                key="clear"
                class="el-input__icon el-icon-circle-close"
                @click.stop="handleClear"
              ></i>
            </template>
          </el-input>
          <el-scrollbar
            tag="ul"
            wrap-class="el-tree-select-dropdown__wrap"
            view-class="el-tree-select-dropdown__list"
            ref="scrollbar"
            :class="{
              'is-empty': !treeData.length,
            }"
          >
            <el-tree
              ref="tree"
              :highlight-current="highlightCurrent"
              :data="treeData"
              :emptyText="emptyText"
              :renderAfterExpand="renderAfterExpand"
              :expandOnClickNode="expandOnClickNode"
              :checkDescendants="checkDescendants"
              :autoExpandParent="autoExpandParent"
              :showCheckbox="showCheckbox"
              :draggable="draggable"
              :props="props"
              :lazy="false"
              :nodeKey="nodeKey"
              :checkStrictly="checkStrictly"
              :defaultExpandAll="defaultExpandAll"
              :checkOnClickNode="checkOnClickNode"
              :defaultCheckedKeys="defaultCheckedKeys"
              :defaultExpandedKeys="defaultExpandedKeys"
              :currentNodeKey="currentNodeKey"
              :renderContent="renderContent"
              :allowDrag="allowDrag"
              :allowDrop="allowDrop"
              :highlightCurrent="highlightCurrent"
              :load="load"
              :filterNodeMethod="filterNodeMethod"
              :accordion="accordion"
              :iconClass="iconClass"
              @node-expand="handleNodeExpand"
              @node-drag-star="handleDragStart"
              @node-drag-leave="handleDragLeavve"
              @node-drag-enter="handleDragEnter"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              @node-click="handleNodeClick"
            ></el-tree>
          </el-scrollbar>
        </div>
      </el-tree-select-menu>
    </transition>
  </div>
</template>

<script>
let cacheLastExpand = null;
import Clickoutside from 'element-ui/src/utils/clickoutside';
import { isDef } from 'element-ui/src/utils/shared';
import ElTreeSelectMenu from './select-menu';
import Emitter from 'element-ui/src/mixins/emitter';
import {
  addResizeListener,
  removeResizeListener,
} from 'element-ui/src/utils/resize-event';

export default {
  mixins: [Emitter],

  name: 'ElTreeSelect',

  directives: { Clickoutside },

  components: {
    ElTreeSelectMenu,
  },

  props: {
    value: {},
    loadData: {},
    data: {
      default() {
        return [];
      },
    },
    clearable: {
      default() {
        return true;
      },
    },
    disabled: {
      default() {
        return false;
      },
    },

    // tree属性
    emptyText: String,
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: false,
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: false,
    },
    autoExpandParent: {
      type: Boolean,
      default: true,
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    allowDrag: Function,
    allowDrop: Function,
    props: {
      default() {
        return {
          children: 'children',
          label: 'label',
          value: 'value',
          disabled: 'disabled',
          emitPath: true,
        };
      },
    },
    lazy: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    highlightCurrent: {
      default() {
        return true;
      },
    },
    load: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18,
    },
    iconClass: String,

    // popper属性
    popperAppendToBody: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    treeData() {
      return this.lazy ? this.searchResData : this.data;
    },
    clearBtnVisible() {
      if (!this.clearable || this.disabled) {
        return false;
      }
      return true;

      // todo 后面在扩展新功能
      /* return this.multiple
        ? !!this.checkedNodes.filter(node => !node.disabled).length
        : !!this.presentText; */
    },
  },
  data() {
    return {
      inputValue: '',
      keywords: '',
      searchResData: [],
      visible: false,
      checkedValue: this.value,
      inputHover: false,
      presentText: null,
      presentTags: [],
      checkedNodes: [],
      filtering: false,
      suggestions: [],
      inputInitialHeight: 0,
      pressDeleteCount: 0,
      wrapWidth: '',
    };
  },

  mounted() {
    addResizeListener(this.$el, this.handleResize);
    this.resetInputWidth();
    this.initSyncValue();
  },
  beforeDestroy() {
    if (this.$el && this.handleResize)
      removeResizeListener(this.$el, this.handleResize);
  },
  watch: {
    data: {
      handler() {
        if (!cacheLastExpand) return;
        if (!Array.isArray(cacheLastExpand.node.childNodes)) {
          cacheLastExpand.node.isLeaf = true;
        }
        cacheLastExpand.node.loading = false;
      },
      deep: true,
    },
  },
  methods: {
    initSyncValue() {
      const sync = () => {
        unwatchData && unwatchData();
        unWatchValue && unWatchValue();
        this.syncValueSelect();
      };

      const unwatchData = this.$watch(
        'data',
        async data => {
          if (!!data && Array.isArray(data) && data.length) {
            this.searchResData = data;
            if (this.value && !this.inputValue) {
              await this.$nextTick();
              sync();
            }
          }
        },
        {
          deep: true,
          immediate: true,
        }
      );
      const unWatchValue = this.$watch(
        'value',
        async value => {
          if (
            !!this.data &&
            Array.isArray(this.data) &&
            this.data.length &&
            !this.inputValue &&
            value
          ) {
            await this.$nextTick();
            sync();
          }
        },
        {
          deep: true,
          immediate: true,
        }
      );
    },
    handleNodeClick(pathLabel, pathValue, nodeData, node, instance) {
      this.inputValue = pathLabel;
      this.syncValue(pathValue);
    },
    search(keywords) {
      if (this.lazy)
        return this.$emit('search', keywords, this.setSearchResData);
      return this.$refs.tree.filter(keywords);
    },
    setSearchResData(data) {
      this.searchResData = data;
    },
    handleClear() {
      this.search();
    },
    syncValue(value) {
      this.$emit('input', value);
    },
    toggleDropDownVisible(visible) {
      if (this.disabled) return;
      this.visible = isDef(visible) ? visible : !this.visible;
      this.broadcast('ElTreeSelectDropdown', 'updatePopper');
    },
    handleNodeExpand(nodeData, node, instance) {
      if (!node.childNodes.length) {
        node.loading = true;
        this.handleLazyLoad(nodeData, node);
      }
      this.$emit('node-expand', nodeData, node, instance);
    },
    // todo 拖拽功能暂无
    handleDragStart(dragNode, dropNode, dropType, event) {},
    handleDragLeavve(dragNode, dropNode, dropType, event) {},
    handleDragEnter(dragNode, dropNode, dropType, event) {},
    handleDragOver(dragNode, dropNode, dropType, event) {},
    handleDragEnd(dragNode, dropNode, dropType, event) {},
    handleDrop(dragNode, dropNode, dropType, event) {},
    filterNodeMethod(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },

    getCurrentNode() {
      const currentNode = this.$refs.tree.store.currentNode;
      return currentNode ? { ...currentNode } : undefined;
    },

    getCurrentData() {
      const currentNode = this.getCurrentNode();
      if (currentNode) return { ...currentNode.data };
      return undefined;
    },

    getCurrentInfo() {
      const currentNode = this.$refs.tree.store.currentNode;
      return {
        currentNode,
        pathLabels: currentNode.getPathLabels(),
        pathNodes: currentNode.getPathNodes(),
        pathValue: currentNode.getPathValues(),
        pathData: currentNode.getPathDatas(),
        currentValue: currentNode.getCurrentValue(),
        currentLabel: currentNode.getCurrentLabel(),
        pathLabel: currentNode.getPathLabels(),
      };
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    //   当传入value的时候, 设置选择状态
    async syncValueSelect() {
      let value = Array.isArray(this.value)
        ? this.value[this.value.length - 1]
        : this.value;
      // const store = {...this.$refs.tree.store}
      const store = this.$refs.tree.store;
      if (
        !!store.root.childNodes &&
        Array.isArray(store.root.childNodes) &&
        store.root.childNodes.length
      ) {
        function findSelectNode(NodeList, needExpand) {
          for (let node of NodeList) {
            if (
              (node.data[store.props.value] || node.data[store.props.label]) ===
              value
            )
              return node;
            if (
              !!node.childNodes &&
              Array.isArray(node.childNodes) &&
              node.childNodes.length
            )
              return findSelectNode(node.childNodes);
          }
        }
        const selectNode = findSelectNode(store.root.childNodes);
        if (!selectNode)
          return (this.inputValue = Array.isArray(this.value)
            ? this.value.join(store.props.separator)
            : this.value);
        const { pathNodes } = selectNode;
        for (let i in pathNodes) {
          if (Number(i) === pathNodes.length - 1) {
            return pathNodes[i].instance.handleClick();
          }
          pathNodes[i].instance.handleExpandIconClick();
          await this.$nextTick();
        }
      }
    },

    // 懒加载逻辑
    handleLazyLoad(nodeData, node) {
      if (node.childNodes.length !== 0) return;
      const update = res => {
        this.updateData(res, node, nodeData);
      };
      this.loadData(node, nodeData, update);
    },
    updateData(res, node, nodeData) {
      node.loading = false;
      if (!res) return;
      if (!Array.isArray(res))
        throw new Error('loadData应返回一个由Promise包裹的数组');
      if (res.length === 0) {
        node.isLeaf = true;
      } else {
        nodeData.children = res;
      }
    },

    resetInputWidth() {
      const reference = this.$refs.reference;
      if (reference && reference.$el) {
        this.wrapWidth = reference.$el.getBoundingClientRect().width + 'px';
      }
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },
  },
};
</script>
