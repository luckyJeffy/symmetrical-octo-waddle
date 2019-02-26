<template>
  <div class="app-container">
    <tree-table
      :data="userList"
      :columns="columns"
      :eval-args="args"
      :expand-all="expandAll"
      border
    >
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | createTimeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-document" @click="handleUpdate(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-pagination
      v-loading.fullscreen.lock="tableLoading"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="userCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
export default {
  name: 'Index',
  components: { treeTable },
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
    return {
      expandAll: false,
      // 要显示的字段, 需要自定义的字段请使用 slot
      columns: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: '名称',
          value: 'name'
        }
      ],
      args: [null, null, 'id'],
      pageIndex: 1,
      pageSize: 20,
      tableLoading: false,
      pageSizes: [20, 50, 100, 500],
      temp: {}
    }
  },
  computed: {
    userList() {
      return this.$store.state.userList.list
    },
    userCount() {
      return this.$store.state.userList.totalCount
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      await this.getUserList({ 'pageIndex': newValue, 'pageSize': this.pageSize })
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      await this.getUserList({ 'pageIndex': this.pageIndex, 'pageSize': newValue })
      this.tableLoading = false
    }
  },
  created() {
    this.getUserList({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize })
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      'getUserList': 'GetUserList'
    }),
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
    }
  }
}
</script>

