<template>
  <div style="margin: 20px;">
    <el-button @click="aa">试试</el-button>
    <el-tree-select
      ref="selectTree"
      :data="treeData"
      @node-expand="handleNodeExpand"
      v-model="value"
    ></el-tree-select>

  </div>
</template>

<script>
export default {
  data() {
    return {
      treeData: [
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
      ],
      value: '',
      select: '',
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
        {
          value: '选项6',
          label: '黄金糕',
        },
        {
          value: '选项7',
          label: '双皮奶',
        },
        {
          value: '选项8',
          label: '蚵仔煎',
        },
        {
          value: '选项9',
          label: '龙须面',
        },
        {
          value: '选项10',
          label: '北京烤鸭',
        },
      ],
      value: '',
    };
  },
  watch: {
    value() {
      console.log(this.value);
    },
  },
  methods: {
    handleNodeExpand(nodeData, node, instance) {},
    aa() {
      console.log(this.$refs.selectTree.getCurrentInfo());
    },
    change(value) {
      console.log(value);
    },
  },
};
</script>


<style scoped>
.el-select {
  margin-top: 100px;
}
.eL-tree-select {
  margin-top: 300px;
}
</style>