<template>
  <div
    v-clickoutside="() => toggleDropDownVisible(false)"
    :class="[{ 'is-disabled': disabled }]"
  >
    <el-input
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
            dropDownVisible && 'is-reverse',
          ]"
          @click.stop="toggleDropDownVisible()"
        ></i> </template
    ></el-input>
    <el-card v-show="dropDownVisible">
      <el-input size="small" @input="search" v-model="keywords">
        <template slot="suffix">
          <i
            key="clear"
            class="el-input__icon el-icon-circle-close"
            @click.stop="handleClear"
          ></i>
        </template>
      </el-input>
      <el-tree
        :highlight-current="highlightCurrent"
        :expand-on-click-node="false"
        :data="data"
        :emptyText="emptyText"
        :renderAfterExpand="renderAfterExpand"
        :expandOnClickNode="expandOnClickNode"
        :checkDescendants="checkDescendants"
        :autoExpandParent="autoExpandParent"
        :showCheckbox="showCheckbox"
        :draggable="draggable"
        :props="props"
        :lazy="lazy"
        nodeKey
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
      ></el-tree>
    </el-card>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';
import { isDef } from 'element-ui/src/utils/shared';
  import {t} from 'element-ui/src/locale';


export default {
  name: 'ELTreeSelect',

  directives: { Clickoutside },

  props: {
    data: {
      default() {
        return [
          {
            label: '一级 1',
            children: [
              {
                label: '二级 1-1',
                children: [
                  {
                    label: '三级 1-1-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 2',
            children: [
              {
                label: '二级 2-1',
                children: [
                  {
                    label: '三级 2-1-1',
                  },
                ],
              },
              {
                label: '二级 2-2',
                children: [
                  {
                    label: '三级 2-2-1',
                  },
                ],
              },
            ],
          },
          {
            label: '一级 3',
            children: [
              {
                label: '二级 3-1',
                children: [
                  {
                    label: '三级 3-1-1',
                  },
                ],
              },
              {
                label: '二级 3-2',
                children: [
                  {
                    label: '三级 3-2-1',
                  },
                ],
              },
            ],
          },
        ];
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
    emptyText: {
      type: String,
      default() {
        return t('el.tree.emptyText');
      },
    },
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true,
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
          disabled: 'disabled',
        };
      },
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18,
    },
    iconClass: String,
  },
  computed: {
    data() {
      return this.search ? this.data : this.searchResData;
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
      dropDownVisible: false,
      checkedValue: this.value,
      inputHover: false,
      inputValue: null,
      presentText: null,
      presentTags: [],
      checkedNodes: [],
      filtering: false,
      suggestions: [],
      inputInitialHeight: 0,
      pressDeleteCount: 0,
    };
  },
  methods: {
    handleNodeClick() {
      return false;
    },
    search(keywords) {
      this.$emit('search', keywords, this.setSearchResData);
    },
    setSearchResData(data) {
      this.searchResData = data;
    },
    handleClear() {
      this.inputValue = '';
      this.syncValue(this.inputValue);
    },
    syncValue(value) {
      this.$emit('change', value);
    },
    toggleDropDownVisible(dropDownVisible) {
      if (this.disabled) return;
      this.dropDownVisible = isDef(dropDownVisible)
        ? dropDownVisible
        : !this.dropDownVisible;
    },
    handleNodeExpand (dragNode, dropNode, dropType, event) {

    },
    handleDragStart (dragNode, dropNode, dropType, event) {

    },
    handleDragLeavve (dragNode, dropNode, dropType, event) {

    },
    handleDragEnter (dragNode, dropNode, dropType, event) {

    },
    handleDragOver (dragNode, dropNode, dropType, event) {

    },
    handleDragEnd (dragNode, dropNode, dropType, event) {

    },
    handleDrop (dragNode, dropNode, dropType, event) {

    },
  },
};
</script>
