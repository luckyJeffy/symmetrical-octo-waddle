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
          <!-- <el-button type="primary" icon="el-icon-document" class="filter-item">新增</el-button> -->
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
           <el-table-column label="状态" prop="bargainStatus" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.bargainStatus | bargainStatusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | createTimeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-document" @click="handleUpdate(scope.row)">详情</el-button>
              <el-button type="danger" size="mini" icon="el-icon-document" @click="handleProductRemove(scope.row)">删除</el-button>
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
    <el-dialog :visible.sync="limitedTimeDialogFormVisible">
      <el-form ref="limitedTimeDataForm" :rules="limitedTimeRules" :model="limitedTimeTemp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="id" prop="id">
          <el-input v-model="limitedTimeTemp.id" disabled />
        </el-form-item>
        <el-form-item label="门店ID" prop="storeId">
          <el-input v-model="limitedTimeTemp.storeId" disabled />
        </el-form-item>
        <el-form-item label="商品id" prop="productId">
          <el-input v-model="limitedTimeTemp.productId" disabled />
        </el-form-item>
        <el-form-item label="序列号" prop="serNum">
          <el-input v-model="limitedTimeTemp.serNum" disabled />
        </el-form-item>
       
        <el-form-item label="特价" prop="specialOffer">
          <el-input v-model="limitedTimeTemp.specialOffer"/>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="limitedTimeTemp.startTime"
            type="datetime"
            format="yyyy-MM-dd-HH"
            placeholder="请选择结束时间"
            class="limitedTimeTempTime"/>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="limitedTimeTemp.endTime"
            :picker-options="pickerOptions"
            type="datetime"
            format="yyyy-MM-dd-HH"
            placeholder="请选择结束时间"
            class="limitedTimeTempTime"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="limitedTimeDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="limitedTimeHandle">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
import { getlistBizBargain, updateBizBargain, forceRemoveBizBargain } from '@/api/limitedTime'
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
    },
    bargainStatusFilter(value){
      if(value==0) return "正常"
      if(value==9) return "已失效"
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
      listQuery: {
        serNum: ''
      },
      limitedTimeTemp: {
        id:'',
        storeId: '',
        productId: '',
        serNum: '',
        specialOffer: '',
        startTime: '',
        endTime: ''
      },
      limitedTimeRules: {
        specialOffer: [{ required: true, message: '特价不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
      },
      pickerOptions: {// 禁用当前日之前的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      limitedTimeDialogFormVisible: false,
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
      const page = {
        'pageNo': newValue,
        'pageSize': this.pageSize,
        'serNum': this.listQuery.serNum
      }
      await this.getlistBizBargain(page)
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      const page = {
        'pageNo': this.pageIndex,
        'pageSize': newValue,
        'serNum': this.listQuery.serNum
      }
      await this.getlistBizBargain(page)
      this.tableLoading = false
    }
  },
  created() {
    const page = {
      'pageNo': this.pageIndex,
      'pageSize': this.pageSize,
      'serNum': this.listQuery.serNum
    }
    this.getlistBizBargain(page)
  },
  methods: {
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
      const page = {
        'pageNo': this.pageIndex,
        'pageSize': this.pageSize,
        'serNum': this.listQuery.serNum
      }
      this.getlistBizBargain(page)
    },
    handleUpdate(row) {
      this.limitedTimeTemp = Object.assign({}, row) // copy obj
      this.limitedTimeDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['limitedTimeDataForm'].clearValidate()
      })
    },
    limitedTimeHandle() {
      this.$refs.limitedTimeDataForm.validate((valid) => {
        if (valid) {
          console.log(this.limitedTimeTemp)
          const para = {
            id:this.limitedTimeTemp.id,
            storeId: this.limitedTimeTemp.storeId,
            productId: this.limitedTimeTemp.id,
            serNum: this.limitedTimeTemp.serNum,
            specialOffer: this.limitedTimeTemp.specialOffer,
            startTime: this.limitedTimeTemp.startTime,
            endTime: this.limitedTimeTemp.endTime
          }
          console.log(para)
          updateBizBargain(para).then((res) => {
            if (res.data.resultCode == 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.resultMessage,
                type: 'error'
              })
            }
            this.limitedTimeDialogFormVisible = false
            this.handleFilter()
          })
        }
      })
    },
    handleProductRemove(row) {
      const self = this
      self.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        forceRemoveBizBargain({id:row.id}).then(res => {
          console.log(res)
          if (res.data.resultCode === '200') {
            self.$message({
              message: '修改成功',
              type: 'success'
            })
            self.handleFilter()
          } else {
              self.$message({
                message: res.data.resultMessage,
                type: 'error'
              })
            }
        }).catch(e => {
          console.error(e)
        })
      })
    },
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
</style>
