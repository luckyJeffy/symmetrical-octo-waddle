<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" type="warning" @click="cancel">取消</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" name="name" required>
                名称
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="价格:" class="postInfo-container-item">
                    <el-input v-model="postForm.price" placeholder="请输入价格"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="销量:" class="postInfo-container-item">
                    <el-input v-model="postForm.salesVolume" placeholder="请输入销量"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="序列号:" class="postInfo-container-item">
                    <el-input v-model="postForm.serNum" placeholder="请输入序列号"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="单位:" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.unit"
                      value-key
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择单位">
                      <el-option
                        v-for="item in unitOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="规格:" class="postInfo-container-item">
                    <el-input v-model="postForm.specification" placeholder="请输入规格"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="分类:" class="postInfo-container-item">
                    <el-select v-model="postForm.catalogId" filterable placeholder="请选择">
                      <el-option
                        v-for="item in catalogList"
                        :key="item.value"
                        :label="item.nodeName"
                        :value="item.catalogId"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input :rows="1" v-model="postForm.title" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>
        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.icon" />
        </div>
        <div style="margin-bottom: 20px;">
          <Pics v-model="postForm.morePics" />
        </div>
        <div v-if="false" style="margin-bottom: 20px;">
          <other-property-json v-model="postForm.otherPropertyJson" />
        </div>
        <div class="editor-container">
          <Tinymce ref="editor" :height="400" v-model="postForm.richDescription" />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/zytIconUpload'
import OtherPropertyJson from '@/components/OtherPropertyJson/otherPropertyJson'
import Pics from '@/components/Upload/zytPicsUpload'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validateURL } from '@/utils/validate'
import { getProductDetails, updateProductInfo, addProductInfo } from '@/api/product'
import { userSearch } from '@/api/remoteSearch'
import { fetchCatalogList } from '@/api/catalog'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  id: '',
  name: '', // 名称
  title: '', // 简介
  price: 0, // 价格 单位 分
  salesVolume: 0, // 销量
  catalogId: 0, // 分类id
  unit: '', // 单位
  serNum: '', // 序列号
  specification: '', // 规格
  icon: '', // 图标/封面
  morePics: '', // 更多图片
  description: '', // 纯文本简介
  richDescription: '', // 富文本简介
  otherPropertyJson: '{}', // 更多属性
  status: 0, // 状态 0正常 9删除/禁用
  storeId: '0', // 门店id
  lastUpdator: '',
  createTime: '',
  lastUpdateTime: ''
}

const unitOptions = [
  {
    label: '盒',
    value: '盒'
  },
  {
    label: '瓶',
    value: '瓶'
  },
  {
    label: '袋',
    value: '袋'
  },
  {
    label: '支',
    value: '支'
  }
]

export default {
  name: 'ProductDetail',
  components: { Tinymce, MDinput, Upload, Pics, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown, OtherPropertyJson },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'info',
        9: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        price: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }]
        // content: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      unitOption: unitOptions,
      catalogList: []
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.title.length
    }
  },
  created() {
    if (this.isEdit) {
      // this.fetchCatalog()
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    this.$store.dispatch('FetchCatalogList', { 'pageIndex': 1, 'pageSize': 100 }).then(() => {
      this.fetchcatalog()
    })
  },
  methods: {
    fetchcatalog() {
      fetchCatalogList().then(res => {
        const data = res.data
        this.catalogList = data.list
      })
    },
    fetchData(id) {
      getProductDetails(id).then(response => {
        this.postForm = Object.assign({}, this.postForm, response.data)
      }).catch(err => {
        console.error('Page: productDetail methods: fetchData :', err)
      })
    },
    submitForm() {
      const product = Object.assign({}, this.postForm)
      let submitPostAPI
      if (product.id === '') {
        submitPostAPI = addProductInfo
      } else {
        submitPostAPI = updateProductInfo
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          submitPostAPI(product).then(res => {
            if (res.data.resultCode === '200') {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
            } else {
              this.$message({
                message: '修改失败',
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    cancel() {
      this.$router.push({ path: '/product/list' })
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
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
