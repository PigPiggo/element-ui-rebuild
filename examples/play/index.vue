<template>
  <div style="margin: 20px;">
    <el-button @click="getInfo">获取</el-button>
    <el-button @click="toggle">切换</el-button>
    <el-tree-select
      :data="data"
      ref="selectTree"
      @node-expand="handleNodeExpand"
      v-model="value"
      :lazy="true"
      :loadData="loadData"
    ></el-tree-select>
    <!-- <el-tree-lazy 
      :data="data"
      ref="lazyTree"
      @node-expand="handleNodeExpand"
      v-model="value"
      :lazy="true"
      :load="loadData"
    /> -->
  </div>
</template>

<script>
let id = 0;
export default {
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      value: '',
      data: [],
      props: {
        label: 'label', 
        value: 'value'
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.data = [
        {
          value: '123',
          label: `选项123`,
          children: [
            {
              value: '333',
              label: `选项333`,
              children: [
                {
                  value: '444',
                  label: `选项444`,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
    }, 2000);
    /* setTimeout(() => {
      this.data = [
        {
          value: id,
          label: `选项${id}`,
          children: [
            {
              value: ++id,
              label: `选项${id}`,
              children: [
                {
                  value: ++id,
                  label: `选项${id}`,
                  children: [],
                },
              ],
            },
          ],
        },
      ];
    }, 2000); */
    /* setTimeout(() => {
      this.value = 2;
    }, 3000); */
  },
  methods: {
    handleNodeExpand(nodeData, node, instance) {},

    getInfo() {
      console.log(this.$refs.lazyTree.getCurrentNode());
    },

    change(value) {
      console.log(value);
    },

    async loadData(node, nodeData, callback) {
      setTimeout(() => {
        if (id === 3) return callback([]);
        callback([
          {
            value: ++id,
            label: `选项${id}`,
            children: [],
          },
        ]);
      }, 1000);
    },
    toggle() {
      id = Math.floor(Math.random() * 10);
      let count = 0;
      const genData = value => {
        if (++count === 4) return [];
        this.value = value;
        return [
          {
            value: id,
            label: `选项${id}`,
            children: genData(++id),
          },
        ];
      };
      this.data = genData(id);
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
