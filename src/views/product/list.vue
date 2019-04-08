<template>
  <div class="product-list-container">
    <el-row>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
      >
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.serNum" placeholder="序列号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <router-link to="/product/create">
            <el-button type="primary" icon="el-icon-document" class="filter-item">新增</el-button>
          </router-link>
          <el-select v-model="listQuery.catalog" class="filter-item query-select" filterable placeholder="分类选择" @change="selectFilter">
            <el-option
              v-for="item in catalogList"
              :key="item.value"
              :label="item.nodeName"
              :value="item.catalogId"/>
          </el-select>
        </div>
        <el-table
          v-loading="tableLoading"
          :data="productList"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="id" prop="id" align="center" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" label="价格" width="88" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分类" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.catalogId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="序列号" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.serNum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图标" width="80" align="center">
            <template slot-scope="scope">
              <img v-if="scope.row.icon" :src="scope.row.icon" class="prodicon">
              <span v-else>暂无图片</span>
            </template>
          </el-table-column>
          <el-table-column label="商品描述" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" class-name="status-col" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusInfoFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <router-link :to="'/product/edit/'+scope.row.id">
                <el-button type="primary" size="mini" icon="el-icon-document">详情</el-button>
              </router-link>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-if="scope.row.status === 0" type="danger" size="mini" icon="el-icon-delete" @click="handleProductRemove(scope.row)">删除</el-button>
              <el-button v-if="scope.row.status === 9" type="danger" size="mini" icon="el-icon-delete" @click="handleProductRestore(scope.row)">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="temp.price"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="temp.title"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-upload
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            class="avatar-uploader"
            action="/api/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com">
            <img v-if="temp.icon" :src="temp.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片" prop="morePics">
          <el-upload
            :headers="uploadHeaders"
            :on-success="handleFilePreview"
            :on-remove="handleFileRemove"
            :file-list="temp.morePics | picsFilter"
            action="/api/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com"
            class="upload-demo"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="序列号" prop="serNum">
          <el-input v-model="temp.serNum"/>
        </el-form-item>
        <el-form-item label="分类" prop="catalog">
          <el-select v-model="temp.catalogId" filterable placeholder="请选择">
            <el-option
              v-for="item in catalogList"
              :key="item.value"
              :label="item.nodeName"
              :value="item.catalogId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" filterable placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="handleModifyStatus">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
'use strict'
import { mapGetters, mapActions } from 'vuex'
import { parseTime, recursivelyParseObjectString } from '@/utils'
import { updateProductInfo, deleteProduct, restoreBizProduct } from '@/api/product'
import { fetchCatalogList } from '@/api/catalog'
import local from './local'
import Dropzone from '@/components/Dropzone'
const viewName = 'productList'

export default {
  name: 'ProductList',
  components: { Dropzone },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'info',
        9: 'danger'
      }
      return statusMap[status]
    },
    statusInfoFilter(status) {
      const statusMap = {
        0: '正常',
        1: 'info',
        9: '禁用'
      }
      return statusMap[status]
    },
    picsFilter(list) {
      console.log(list)
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
  data() {
    return {
      tableLoading: false,
      pageIndex: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 500],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogFormVisible: false,
      catalogList: [],
      temp: {
        id: undefined,
        name: '',
        title: '',
        price: 0,
        morePics: [],
        catalogId: 0
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      },
      listQuery: {
        name: '',
        serNum: '',
        catalog: ''
      },
      statusList: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '禁用',
          value: 9
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'productList',
      'totalCount',
      'token'
    ]),
    formattedProductList() {
      return JSON.parse(JSON.stringify(this.productList)).map(item => {
        return this.filterNullValue(Object.assign({}, item, {
          createTime: parseTime(item.createTime),
          lastUpdateTime: parseTime(item.lastUpdateTime),
          otherPropertyJson: this.filterNullValue(recursivelyParseObjectString(item.otherPropertyJson))
          // price: `${item.price / 100} CNY`
        }))
      })
    },
    uploadHeaders() {
      return { 'accessToken': this.token }
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      // debugger
      if (this.listQuery.catalog) {
        await this.queryProductCatalog({ 'catalogId': this.listQuery.catalog, 'pageIndex': newValue, 'pageSize': this.pageSize })
      } else if (this.listQuery.name || this.listQuery.serNum) {
        await this.searchProductInfo({ 'name': this.listQuery.name, 'serNum': this.listQuery.serNum })
      } else {
        await this.getProductInfo({ 'pageIndex': newValue, 'pageSize': this.pageSize })
      }
      // await this.getProductInfo({ 'pageIndex': newValue, 'pageSize': this.pageSize })
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      await this.getProductInfo({ 'pageIndex': this.pageIndex, 'pageSize': newValue })
      this.tableLoading = false
    }
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[viewName]) {
      this.$i18n.mergeLocaleMessage('en', local.en)
      this.$i18n.mergeLocaleMessage('zh', local.zh)
    }
    this.getProductInfo({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize })
    this.fetchcatalog()
  },
  methods: {
    ...mapActions({
      'getProductInfo': 'GetProductInfo',
      'searchProductInfo': 'SearchProductInfo',
      'queryProductCatalog': 'QueryProductCatalog'
    }),
    fetchcatalog() {
      fetchCatalogList().then(res => {
        const data = res.data
        this.catalogList = data.list
      })
    },
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    filterNullValue(obj) {
      // deep clone
      const tmpObject = JSON.parse(JSON.stringify(obj))
      // 替换为 null 的键值
      // Object.keys(tmpObject).map(keyName => {
      //   tmpObject[keyName] = tmpObject[keyName] === null || !tmpObject[keyName] === true ? '暂无数据' : tmpObject[keyName]
      // })
      return tmpObject
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.morePics = this.temp.morePics === null ? [] : this.temp.morePics
      const pics = this.temp.morePics
      if (pics && pics !== '') {
        this.temp.morePics = pics.split(',')
      } else {
        this.temp.morePics = []
      }
      console.log(this.temp.morePics)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModifyStatus() {
      const product = Object.assign({}, this.temp)
      product.morePics = product.morePics.join(',')
      updateProductInfo(product).then(res => {
        if (res.data.resultCode === '200') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.handleFilter(this.listQuery.catalog)
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
        }
      })
    },
    handleProductRemove(prod) {
      const self = this
      self.$confirm('是否禁用该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(prod.id).then(res => {
          console.log(res)
          if (res.data.resultCode === '200') {
            self.$message({
              message: '修改成功',
              type: 'success'
            })
            self.handleFilter()
          }
        }).catch(e => {
          console.error(e)
        })
      })
    },
    handleProductRestore(prod) {
      const self = this
      self.$confirm('是否恢复该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restoreBizProduct(prod.id).then(res => {
          console.log(res)
          if (res.data.resultCode === '200') {
            self.$message({
              message: '修改成功',
              type: 'success'
            })
            self.handleFilter()
          }
        }).catch(e => {
          console.error(e)
        })
      })
    },
    handleAvatarSuccess(response, file) {
      const res = response[0]
      if (res.resultCode !== '200') {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
        return
      }
      this.temp.icon = `http://${res.url}`
      console.log('icon', this.temp.icon)
    },
    handleFileRemove(file) {
      const index = this.temp.morePics.indexOf(file.url)
      if (index > -1) {
        this.temp.morePics.splice(index, 1)
      }
    },
    handleFilePreview(response, file) {
      const res = response[0]
      if (res.resultCode !== '200') {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
        return
      }
      this.temp.morePics.push(`http://${res.url}`)
      console.log(this.temp.morePics)
    },
    handleFilter(query) {
      if (query === this.listQuery.catalog && query) {
        this.queryProductCatalog({ 'catalogId': query, 'pageIndex': this.pageIndex, 'pageSize': this.pageSize })
      } else if (this.listQuery.name || this.listQuery.serNum) {
        this.searchProductInfo({ 'name': this.listQuery.name, 'serNum': this.listQuery.serNum })
      } else {
        this.getProductInfo({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize })
      }
    },
    selectFilter(query) {
      this.pageIndex = 1
      this.queryProductCatalog({ 'catalogId': query, 'pageIndex': 1, 'pageSize': this.pageSize })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.product-list-container {
  padding: 10px;
  .el-pagination {
    padding: 10px 5px;
    white-space: normal;
  }
}
.table-expand {
  font-size: 14px;
  label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-top: 10px;
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    img {
      max-width: 100%;
    }
  }
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.prodicon{
  width: 100%;
  height: 100%;
  display: block;
}
.query-select{
  width: 125px;
}
</style>
