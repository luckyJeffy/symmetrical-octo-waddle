<template>
  <div class="postInfo-more-containe">
    <p class="postInfo-more-title">更多参数</p>
    <div class="postInfo-more-item">
      <el-row v-for="(value, key) in property" :key="key" :gutter="10">
        <el-col :span="1">
          <el-button circle class="el-icon-delete" type="primary" @click.native="removeI(key)"/>
        </el-col>
        <el-col :span="2">
          <el-input
            :value="key"
            class="postInfo-more-key"
            placeholder="请输入内容"/>
        </el-col>
        <el-col :span="18">
          <el-input
            :value="value"
            class="postInfo-more-value"
            type="textarea"
            placeholder="请输入内容"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtherPropertyJson',
  filters: {},
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    property() {
      const data = this.value
      if (data === '') {
        return {}
      } else {
        return JSON.parse(data)
      }
    },
    uploadHeaders() {
      return { accessToken: this.$store.state.user.token }
    }
  },
  created() {
  },
  methods: {
    emitInput(val) {
      console.log(val)
      this.$emit('input', val)
    },
    removeI(key) {
      console.log(key)
      if (key) {
        delete this.property.key
        // this.emitInput(JSON.stringify(this.property))
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.postInfo-more-container {
  width: 100%;
  .postInfo-more-item{
    height: 100%;
    margin-bottom: 20px;
  }
}
</style>
