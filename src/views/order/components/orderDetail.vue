<template>
  <div class="createPost-container">
    <el-button v-loading="loading" type="warning" @click="cancel">取消</el-button>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  filters: {

  },
  data() {
    return {
      loading: false
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    cancel() {
      this.$router.push({ path: '/order/list' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
