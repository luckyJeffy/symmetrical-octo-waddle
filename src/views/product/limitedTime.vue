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
          <el-input v-model="listQuery.serNum" placeholder="序列号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button type="primary" icon="el-icon-document" class="filter-item">新增</el-button>
        </div>
        <el-table
          v-loading="tableLoading"
          :data="limitedTimeList"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="id" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="门店ID" prop="storeId" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.storeId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品ID" prop="productId" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.productId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="序列号" prop="serNum" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.serNum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="特价" prop="specialOffer" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specialOffer }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" prop="startTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.startTime | createTimeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" prop="endTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.endTime | createTimeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | createTimeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-document">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="limitedTimeCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
import { getlistBizBargain } from '@/api/limitedTime'
export default {
  filters: {
    createTimeFilter(value) {
      var date = new Date(value)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '/'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
      var D = date.getDate() + '/'
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y + M + D + h + m + s
    }
  },
  data() {
    return{
      tableLoading: false,
      pageIndex: 1,
      pageSize: 20,
      pageSizes: [20, 50, 100, 500],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      listQuery: {
        serNum: ''
      },
    }
  },
  computed: {
    limitedTimeList() {
      return this.$store.state.limitedTime.list
    },
    limitedTimeCount() {
      return this.$store.state.limitedTime.totalCount
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      let page = {
        'pageNo': newValue,
        'pageSize': this.pageSize,
        'serNum': this.listQuery.serNum 
      }
      await this.getlistBizBargain(page)
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      let page = {
        'pageNo': this.pageIndex,
        'pageSize': newValue,
        'serNum': this.listQuery.serNum 
      }
      await this.getlistBizBargain(page)
      this.tableLoading = false
    }
  },
  created() {
    let page = {
        'pageNo': this.pageIndex,
        'pageSize': this.pageSize,
        'serNum': this.listQuery.serNum 
    }
    this.getlistBizBargain(page)
  },
  methods:{
     ...mapActions({
      'getlistBizBargain': 'GetlistBizBargain'
    }),
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleFilter() {
      let page = {
        'pageNo': this.pageIndex,
        'pageSize': this.pageSize,
        'serNum': this.listQuery.serNum 
      }
      this.getlistBizBargain(page)
    },
  }
}
</script>
<style>

</style>
