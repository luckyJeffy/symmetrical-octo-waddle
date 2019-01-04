<template>
  <div class="product-list-container">
    <el-table
      :data="productList"
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
            <el-form-item label="店铺 ID">
              <span>{{ props.row.storeId }}</span>
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
        label="描述"
        prop="title"
      />
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import local from './local'
const viewName = 'productList'

export default {
  name: 'RouterBoard',
  data() {
    return {
      productsInfo: []
    }
  },
  computed: {
    ...mapGetters([
      'productList'
    ])
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[viewName]) {
      this.$i18n.mergeLocaleMessage('en', local.en)
      this.$i18n.mergeLocaleMessage('zh', local.zh)
    }
    this.$store.dispatch('GetProductInfo')
  },
  methods: {
    getProductInfo() {
      this.$store.dispatch('GetProductInfo')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.product-list-container {
  padding: 10px;
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
    width: 50%;
  }
}
</style>
