<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="分类名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <tree-table
      :data="catalogList"
      :eval-func="func"
      :columns="columns"
      :eval-args="args"
      :expand-all="expandAll"
      border
    >
      <el-table-column label="图标">
        <template slot-scope="scope">
          <img v-if="scope.row.classifyImage" :src="scope.row.classifyImage" class="classifyImage">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-pagination
      v-loading.fullscreen.lock="tableLoading"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="catalogCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'

export default {
  name: 'CatalogList',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      // 要显示的字段, 需要自定义的字段请使用 slot
      columns: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: '名称',
          value: 'nodeName'
        }
      ],
      args: [null, null, 'id'],
      pageIndex: 1,
      pageSize: 20,
      tableLoading: false,
      pageSizes: [20, 50, 100, 500],
      listQuery: {
        name: ''
      }
    }
  },
  computed: {
    catalogList() {
      return this.$store.state.catalog.list
    },
    catalogCount() {
      return this.$store.state.catalog.totalCount
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      await this.fetchCatalogList({ 'pageIndex': newValue, 'pageSize': this.pageSize })
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      await this.fetchCatalogList({ 'pageIndex': this.pageIndex, 'pageSize': newValue })
      this.tableLoading = false
    }
  },
  created() {
    this.fetchCatalogList({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize })
  },
  mounted() {
    // console.log('catalogList: ', this.catalogList)
  },
  methods: {
    ...mapActions({
      'fetchCatalogList': 'FetchCatalogList'
    }),
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleFilter() {
      const search = this.listQuery.name
      if (!search) {
        this.getProductInfo({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize })
        return
      }
    //   this.searchProductInfo(search)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.classifyImage{
  width: 50px;
  height: 50px;
  display: block;
}
</style>
