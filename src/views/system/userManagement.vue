<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" placeholder="账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" >搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-document" @click="addHandleUpdate()">新增</el-button>
    </div>
    <tree-table
      :data="systemList"
      :columns="columns"
      :eval-args="args"
      :expand-all="expandAll"
      border
    >
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="登录账号">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.oneRoleVo.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" >
        <template slot-scope="scope">
          {{ scope.row.createTime | createTimeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==0" type="primary" size="mini" @click="lockingUser(scope.row)">锁定</el-button>
          <el-button v-if="scope.row.status>0" type="primary" size="mini" @click="unlockUser(scope.row)">解锁</el-button>
          <el-button size="mini" @click="editHandleUpdate(scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-pagination
      v-loading.fullscreen.lock="tableLoading"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="systemCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="addDialogFormVisible" title="新增">
      <el-form ref="addDataForm" :rules="addRules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="oneRoleVo_id">
          <el-select v-model="temp.oneRoleVo_id" placeholder="请选择">
            <el-option v-for="(a,index) in roleList" :value="a.id" :label="a.name" :key="index"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="用户手机" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password"/>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editDialogFormVisible" title="修改密码">
      <el-form ref="editDataForm" :rules="editRules" :model="editTemp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="oneRoleVo_id">
          <el-select v-model="editTemp.oneRoleVo_id" placeholder="请选择">
            <el-option v-for="(a,index) in roleList" :value="a.id" :label="a.name" :key="index"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="editTemp.name"/>
        </el-form-item>
        <el-form-item label="用户手机" prop="phone">
          <el-input v-model="editTemp.phone"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editTemp.email"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editTemp.password" type="password"/>
        </el-form-item>
        <el-form-item label="再次输入密码">
          <el-input v-model="editTemp.confirmPassword" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
import { myPhoneFilter, myEmailFilter } from '@/filters/index'
import { getUserListConsole, getlistConsoleRole, saveConsoleUserAccount, frozenConsoleUserAccount, removeFrozenConsoleUserAccount } from '@/api/system'
export default {
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
          value: 'id',
          width: '150'
        }
      ],
      args: [null, null, 'id'],
      pageIndex: 1,
      pageSize: 20,
      tableLoading: false,
      pageSizes: [20, 50, 100, 500],
      listQuery: {
        account: '',
        phone: ''
      },
      dialogFormVisible: false,
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      dialogStatus: '',
      temp: {
        oneRoleVo_id: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      editTemp: {
        oneRoleVo_id: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      roleList: [],
      addRules: {
        oneRoleVo_id: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { type: 'string', min: 11, message: '手机号不允许小于11位', trigger: 'blur' },
          { validator: myPhoneFilter, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: myEmailFilter, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不允许小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不允许小于6位', trigger: 'blur' }
        ]
      },
      editRules: {
        oneRoleVo_id: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { type: 'string', min: 11, message: '手机号不允许小于11位', trigger: 'blur' },
          { validator: myPhoneFilter, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: myEmailFilter, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    systemList() {
      return this.$store.state.system.list
    },
    systemCount() {
      return this.$store.state.system.totalCount
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      await this.getUserListConsole({ 'pageIndex': newValue, 'pageSize': this.pageSize, 'account': this.listQuery.account, 'phone': this.listQuery.phone })
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      await this.getUserListConsole({ 'pageSize': newValue, 'pageIndex': this.pageIndex, 'account': this.listQuery.account, 'phone': this.listQuery.phone })
      this.tableLoading = false
    }
  },
  created() {
    this.getUserListConsole({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'account': this.listQuery.account, 'phone': this.listQuery.phone })
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    ...mapActions({
      'getUserListConsole': 'GetUserListConsole'
    }),
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleFilter() {
      this.getUserListConsole({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'account': this.listQuery.account, 'phone': this.listQuery.phone })
    },
    getUsers() {
      getlistConsoleRole(this.pageIndex, this.pageSize).then((res) => {
        if (res.data.resultCode == 200) {
          this.roleList = res.data.list
        } else {
          console.log(res.data.resultMessage)
        }
      })
    },
    addHandleUpdate() {
      this.dialogStatus = 'update'
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addDataForm'].clearValidate()
      })
    },
    editHandleUpdate(row) {
      this.editTemp = Object.assign({}, row) // copy obj
      this.editTemp.oneRoleVo_id = row.oneRoleVo.id
      this.dialogStatus = 'update'
      this.editDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editDataForm'].clearValidate()
      })
    },
    addSubmit() {
      this.$refs.addDataForm.validate((valid) => {
        if (valid) {
          this.addDialogFormVisible = true
          const para = Object.assign({}, this.temp)
          para.oneRoleVo = {}
          para.oneRoleVo.id = para.oneRoleVo_id
          para.account = para.phone
          saveConsoleUserAccount(para).then((res) => {
            this.addDialogFormVisible = false
            this.handleFilter()
            if (res.data.resultCode == 200) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.data.resultMessage,
                type: 'error',
                duration: 2000
              })
              // console.log(res.data.resultMessage)
            }
          })
        }
      })
    },
    editSubmit() {
      this.$refs.editDataForm.validate((valid) => {
        if (valid) {
          this.editDialogFormVisible = true
          const para = Object.assign({}, this.editTemp)
          para.oneRoleVo = {}
          para.oneRoleVo.id = para.oneRoleVo_id
          para.account = para.phone
          saveConsoleUserAccount(para).then((res) => {
            this.editDialogFormVisible = false
            this.handleFilter()
            if (res.data.resultCode == 200) {
              this.$notify({
                title: '修改',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.data.resultMessage,
                type: 'error',
                duration: 2000
              })
              // console.log(res.data.resultMessage)
            }
          })
        }
      })
    },
    lockingUser(row) {
      this.$confirm('您真的确定要锁定该用户吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const para = { id: row.id }
        frozenConsoleUserAccount(para).then((res) => {
          if (res.data.resultCode == 200) {
            this.handleFilter()
            this.$notify({
              title: '成功',
              message: '锁定成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: res.data.resultMessage,
              type: 'error',
              duration: 2000
            })
            // console.log(res.data.resultMessage)
          }
        })
      }).catch(() => {

      })
    },
    unlockUser(row) {
      this.$confirm('您真的确定要解锁该用户吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const para = { id: row.id }
        removeFrozenConsoleUserAccount(para).then((res) => {
          if (res.data.resultCode == 200) {
            this.handleFilter()
            this.$notify({
              title: '成功',
              message: '解锁成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: res.data.resultMessage,
              type: 'error',
              duration: 2000
            })
            // console.log(res.data.resultMessage)
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>

