<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" >搜索</el-button>
    </div>
    <tree-table
      :data="userList"
      :columns="columns"
      :eval-args="args"
      :expand-all="expandAll"
      border
    >
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="70">
        <template slot-scope="scope">
          {{ scope.row.sex | sexFilter }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="会员等级">
        <template slot-scope="scope">
          {{ scope.row.vip | vipFilter }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | createTimeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-document" @click="handleUpdate(scope.row)">详情</el-button>
          <el-button v-if="scope.row.vip" type="primary" size="mini" @click="handleUpdateGift(scope.row)">领取礼品</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="id">
          <template>{{ temp.id }}</template>
        </el-form-item>
        <el-form-item label="用户名">
          <template>{{ temp.nickname }}</template>
        </el-form-item>
        <el-form-item label="微信ID">
          <template>{{ temp.userOpenId }}</template>
        </el-form-item>
        <el-form-item label="性别">
          <template>{{ temp.sex | sexFilter }}</template>
        </el-form-item>
        <el-form-item label="手机号">
          <template>{{ temp.phone }}</template>
        </el-form-item>
        <el-form-item label="详细地址">
          <template>{{ temp.detailedAddress }}</template>
        </el-form-item>
        <el-form-item label="会员等级">
          <template>{{ temp.nickname | vipFilter }}</template>
        </el-form-item>
        <el-form-item label="创建时间">
          <template>{{ temp.createTime | createTimeFilter }}</template>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div> -->
    </el-dialog>
    <el-dialog :title="giftTextMap[giftDialogStatus]" :visible.sync="giftDialogFormVisible">
      <el-form ref="dataFormGift" :model="giftTemp" label-position="right" label-width="150px" style="width: 500px; margin-left:50px;">
        <el-form-item label="领取注册礼品次数:">
          <template>{{ giftNum.注册礼品 }}</template>
          <el-button v-if="giftTemp.vip && giftNum.注册礼品=='0'" type="primary" @click="registeredGifts(giftTemp.userOpenId)">可领取</el-button>
          <el-button v-else type="info" disabled @click="registeredGifts(giftTemp.userOpenId)">已领取</el-button>
        </el-form-item>
        <el-form-item label="推广人数:">
          <template>{{ giftNum.推广人数 }}</template>
        </el-form-item>
        <el-form-item label="领取推广礼品次数:">
          <template>{{ giftNum.推广礼品 }}</template>
          <el-button v-if="spreadNum>0" type="primary" @click="promotionalGifts(giftTemp.userOpenId)">可领取{{ spreadNum }}次</el-button>
          <el-button v-else type="info" disabled>可领取{{ spreadNum }}次</el-button>
        </el-form-item>
        <template>领取记录：</template>
        <el-table :data="giftList" row-key="id" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="业务">
            <template slot-scope="scope">
              {{ scope.row.businessType }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="礼品">
            <template slot-scope="scope">
              {{ scope.row.detailed }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="领取时间">
            <template slot-scope="scope">
              {{ scope.row.createTime | createTimeFilter }}
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
import { getlistGiftNum, insertGiftLog, listGiftLog } from '@/api/user'
export default {
  name: 'Index',
  components: { treeTable },
  filters: {
    sexFilter(value) {
      const statusMap = {
        '0': '',
        '1': '男',
        '2': '女'
      }
      return statusMap[value]
    },
    vipFilter(value) {
      const statusMap = {
        'MEMBER': '普通会员',
        undefined: '注册会员'
      }
      return statusMap[value]
    },
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
        }
      ],
      args: [null, null, 'id'],
      pageIndex: 1,
      pageSize: 20,
      tableLoading: false,
      pageSizes: [20, 50, 100, 500],
      listQuery: {
        name: '',
        phone: ''
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '用户详情',
        create: 'Create'
      },
      giftTemp: {},
      giftNum: {},
      giftList: [],
      spreadNum: 0, // 能领取次数
      giftDialogFormVisible: false,
      giftDialogStatus: '',
      giftTextMap: {
        update: '礼品详情',
        create: 'Create'
      }
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
      await this.getUserList({ 'pageIndex': newValue, 'pageSize': this.pageSize, 'phone': this.listQuery.phone, 'name': this.listQuery.name })
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      await this.getUserList({ 'pageSize': newValue, 'pageIndex': this.pageIndex, 'phone': this.listQuery.phone, 'name': this.listQuery.name })
      this.tableLoading = false
    }
  },
  created() {
    this.getUserList({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'phone': this.listQuery.phone, 'name': this.listQuery.name })
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
    handleFilter() {
      this.getUserList({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'phone': this.listQuery.phone, 'name': this.listQuery.name })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateGift(row) {
      this.giftTemp = Object.assign({}, row) // copy obj
      this.giftDialogStatus = 'update'
      this.giftDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormGift'].clearValidate()
      })
      getlistGiftNum(this.giftTemp.userOpenId).then(res => {
        if (res.data.resultCode === '200') {
          this.giftNum = Object.assign({}, res.data.giftNum)
          this.spreadNum = parseInt(res.data.giftNum.推广人数 / 5) - res.data.giftNum.推广礼品// 领取次数=推广人数/5-已领取次数
        } else {
          console.log(res.data.resultMessage)
        }
      })
      listGiftLog('1', '1000', this.giftTemp.userOpenId).then(res => {
        if (res.data.resultCode === '200') {
          this.giftList = res.data.list
        } else {
          console.log(res.data.resultMessage)
        }
      })
    },
    registeredGifts(userOpenId) {
      insertGiftLog(userOpenId, '礼品', '注册').then(res => {
        if (res.data.resultCode === '200') {
          this.$notify({
            title: '成功',
            message: '领取成功',
            type: 'success',
            duration: 2000
          })
          this.giftDialogFormVisible = false
        } else {
          console.log(res.data.resultMessage)
        }
      })
    },
    promotionalGifts(userOpenId) {
      insertGiftLog(userOpenId, '礼品', '推广').then(res => {
        if (res.data.resultCode === '200') {
          this.$notify({
            title: '成功',
            message: '领取成功',
            type: 'success',
            duration: 2000
          })
          this.giftDialogFormVisible = false
        } else {
          console.log(res.data.resultMessage)
        }
      })
    }
  }
}
</script>

