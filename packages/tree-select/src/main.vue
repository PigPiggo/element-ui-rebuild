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
              'is-empty': !data.length,
            }"
          >
            <el-tree-lazy
              ref="tree"
              :value="value"
              :highlight-current="highlightCurrent"
              :data="data"
              :emptyText="emptyText"
              :renderAfterExpand="renderAfterExpand"
              :expandOnClickNode="expandOnClickNode"
              :checkDescendants="checkDescendants"
              :autoExpandParent="autoExpandParent"
              :showCheckbox="showCheckbox"
              :draggable="draggable"
              :props="props"
              :lazy="true"
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
              :load="loadData"
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
            ></el-tree-lazy>
          </el-scrollbar>
        </div>
      </el-tree-select-menu>
    </transition>
  </div>
</template>

<script>
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
    lazyExpand: {
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
    // this.initSyncValue();
  },
  beforeDestroy() {
    if (this.$el && this.handleResize)
      removeResizeListener(this.$el, this.handleResize);
  },
  watch: {
    value: {
      async handler (newValue, oldValue) {
        if (newValue === oldValue) return; 
        await this.$nextTick (); 
        this.inputValue = this.getCurrentInfo ().pathText;
      }
    }, 
  },
  methods: {
    handleNodeClick(pathLabel, pathValue, nodeData, node, instance) {
      this.inputValue = pathLabel;
      this.syncValue(pathValue);
      this.toggleDropDownVisible (false)
      this.$emit ('node-click', pathLabel, pathValue, nodeData, node, instance)
    },
    search(keywords) {
      if (this.lazy)
        return this.$emit('search', keywords);
      return this.$refs.tree.filter(keywords);
    },
    handleClear() {
      this.keywords = ''
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
      return this.$refs.tree.getCurrentInfo (); 
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
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
