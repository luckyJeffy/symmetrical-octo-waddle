<template>
  <div class="upload-container">
    <el-button size="small" type="primary">点击上传更多图片</el-button>
    <el-upload
      :headers="uploadHeaders"
      :on-success="handleImageSuccess"
      :on-remove="handleFileRemove"
      :file-list="morePics | picsFilter"
      action="/api/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com"
      class="upload-demo"
      list-type="picture"/>
  </div>
</template>

<script>

export default {
  name: 'ZytPicsUpload',
  filters: {
    picsFilter(list) {
      const urls = []
      for (const url of list) {
        urls.push({
          name: url.substring(url.lastIndexOf('/'), url.lastIndexOf('.')),
          url: url
        })
      }
      return urls
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    //   morePics: []
    }
  },
  computed: {
    morePics() {
    //   return this.value
      const pics = this.value
      if (pics && pics !== '') {
        return pics.split(',')
      } else {
        return []
      }
    },
    uploadHeaders() {
      return { 'accessToken': this.$store.state.user.token }
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleFileRemove(file) {
      const index = this.morePics.indexOf(file.url)
      if (index > -1) {
        this.morePics.splice(index, 1)
        this.emitInput(this.morePics.join(','))
      }
    },
    handleImageSuccess(response, file) {
      const res = response[0]
      if (res.resultCode !== '200') {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
        return
      }
      this.morePics.push(`http://${res.url}`)
      this.emitInput(this.morePics.join(','))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  width: 100%;
}
</style>
