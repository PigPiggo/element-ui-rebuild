<template>
  <div>
    <el-progress-color
      type="circle"
      :percentage="20"
      background-color="#00589C"
      color="#4BCBEB"
      :font-size="22"
    ></el-progress-color>
  </div>
</template>

<script>
export default {
  created () {
    document.querySelector ('html').style.fontSize="100px"
  }
};
</script>

<style>

</style>
