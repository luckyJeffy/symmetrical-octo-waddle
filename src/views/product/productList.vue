<template>
  <div class="product-list-container">
    <el-table
      v-loading="tableLoading"
      :data="formattedProductList"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="table-expand"
          >
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="门店 ID">
              <span>{{ props.row.storeId }}</span>
            </el-form-item>
            <el-form-item label="序列货号">
              <span>{{ props.row.serNum }}</span>
            </el-form-item>
            <el-form-item label="产品条码">
              <span>{{ props.row.barCode }}</span>
            </el-form-item>
            <el-form-item label="市场价或原价">
              <span>{{ props.row.originPrice }}</span>
            </el-form-item>
            <el-form-item label="商品分类 ID">
              <span>{{ props.row.catalogId }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="规格">
              <span>{{ props.row.specification }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="最后更新时间">
              <span>{{ props.row.lastUpdateTime }}</span>
            </el-form-item>
            <el-form-item label="商品缩略图">
              <img :src="props.row.icon">
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="商品 ID"
        prop="id"
      />
      <el-table-column
        label="商品名称"
        prop="name"
      />
      <el-table-column
        label="创建时间"
        prop="createTime"
      />
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { parseTime } from '@/utils/index'
import local from './local'
const viewName = 'productList'

export default {
  name: 'RouterBoard',
  data() {
    return {
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500]
    }
  },
  computed: {
    ...mapGetters([
      'productList',
      'totalCount'
    ]),
    formattedProductList() {
      return JSON.parse(JSON.stringify(this.productList)).map(item => {
        // 替换为 null 的健值
        Object.keys(item).map(keyName => {
          item[keyName] = item[keyName] === null ? '暂无数据' : item[keyName]
        })
        return Object.assign({}, item, {
          createTime: parseTime(item.createTime),
          lastUpdateTime: parseTime(item.lastUpdateTime),
          price: `${item.price / 100} CNY`
        })
      })
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      await this.getProductInfo({ 'pageIndex': newValue, 'pageSize': this.pageSize })
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
  },
  methods: {
    ...mapActions({
      'getProductInfo': 'GetProductInfo'
    }),
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.product-list-container {
  padding: 10px;
  el-pagination {
    width: 100%;
  }
}
.table-expand {
  font-size: 0;
  label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    img {
      max-width: 100%;
    }
  }
}
</style>
