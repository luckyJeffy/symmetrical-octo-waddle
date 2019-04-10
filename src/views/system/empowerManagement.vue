<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="角色备注">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column label="创建时间" >
        <template slot-scope="scope">
          {{ scope.row.createTime | createTimeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="authorize(scope.row)">授权</el-button>
          <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="角色备注" prop="description">
          <el-input v-model="temp.description"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editDialogFormVisible" title="编辑">
      <el-form ref="editDataForm" :rules="editRules" :model="editTemp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editTemp.name"/>
        </el-form-item>
        <el-form-item label="角色备注" prop="description">
          <el-input v-model="editTemp.description"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="editSubmit">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync=" authorizeDialogFormVisible" title="授权">
      <el-form ref=" authorizeDataForm" label-position="right" label-width="110px" style="width: 600px; margin-left:50px;">

        <!-- <div v-for="(item,index) in jobList" :key="index">
          <input type="checkbox" v-model="checkall" @change="checkAllFlag(index,item.id,$event)">
          <span>{{item.name}}</span>
          <div v-for="(items,indexs) in item.subMenuList" :key="indexs" style="margin: 0 15px;">
            <input type="checkbox" @click="checkFlag(index,items.id,$event)">
            <span>{{items.name}}</span>
          </div>
          <div style="margin: 15px 0;"></div>
        </div> -->
  

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" authorizeDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
import { getlistConsoleRole, saveConsoleRole, deleteConsoleRole, getListAllMenuFunction } from '@/api/system'
export default {
  name: 'EmpowerManagement',
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
        name: ''
      },
      dialogFormVisible: false,
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      authorizeDialogFormVisible: false,
      dialogStatus: '',
      temp: {
        name: '',
        description: ''
      },
      editTemp: {
        name: '',
        description: ''
      },
      addRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色备注', trigger: 'blur' }]
      },
      editRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色备注', trigger: 'blur' }]
      },
      
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
      await this.getlistConsoleRole({ 'pageIndex': newValue, 'pageSize': this.pageSize, 'name': this.listQuery.name })
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      await this.getlistConsoleRole({ 'pageSize': newValue, 'pageIndex': this.pageIndex, 'name': this.listQuery.name })
      this.tableLoading = false
    }
  },
  created() {
    this.getlistConsoleRole({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'name': this.listQuery.name })
  },
  mounted() {

  },
  methods: {

    

    checkAllFlag(index, id, e) {
      console.log(index, id, e.target.checked)
      // var _this = this

      // if(e==undefined){
      //   this.checkall = true;
      // }else{
      //   this.checkall = e.target.checked;
      // }
      // if (this.checkall) {//全选时
      //   this.checked = []
      //   this.jobList.forEach(item => {
      //     _this.checked.push(item.id)
      //   })
      // } else {
      //   this.checked = []
      // }
      // console.log(this.checked)
    },
    checkFlag(index, id, e) {
      var childrenArray = this.jobList[index].subMenuList
      var tickCount = 0, unTickCount = 0, len = childrenArray.length
      const idIndex = this.checked.indexOf(id)
      if (idIndex >= 0) { // 如果已经包含就去除
        this.checked.splice(idIndex, 1)
      } else { // 如果没有包含就添加
        this.checked.push(id)
      }
      console.log(this.checked)
      console.log(tickCount)
      for (var i = 0; i < childrenArray.length; i++) {
        if (this.checked.indexOf(childrenArray[i].id) >= 0) {
          tickCount++
        }
      }
      console.log(tickCount)
      // let idIndex = this.checked.indexOf(id)
      // if (idIndex >= 0) {//如果已经包含就去除
      //   this.checked.splice(idIndex, 1)
      // } else {//如果没有包含就添加
      //   this.checked.push(id)
      // }
      // console.log(this.checked)
      // console.log(this.jobList)
      // for(let i =0;i<this.jobList.length;i++){
      //   let k =0;
      //   for(let j =0;j<this.jobList[i].subMenuList.length;j++){
      //     if(this.checked.includes(this.jobList[i].subMenuList[j].id)){
      //       k+=1
      //     }
      //     if(this.jobList[i].subMenuList.length==k){
      //       this.checkall=true;
      //       return;
      //     }else{
      //       this.checkall=false
      //     }
      //   }
      // }
    },
    ...mapActions({
      'getlistConsoleRole': 'GetlistConsoleRole'
    }),

    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleFilter() {
      this.getlistConsoleRole({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'name': this.listQuery.name })
    },
    addHandleUpdate() {
      this.dialogStatus = 'update'
      this.addDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addDataForm'].clearValidate()
      })
    },
    addSubmit() {
      this.$refs.addDataForm.validate((valid) => {
        if (valid) {
          this.addDialogFormVisible = true
          const para = Object.assign({}, this.temp)
          saveConsoleRole(para).then((res) => {
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
            }
          })
        }
      })
    },
    edit(row) {
      this.editTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.editDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['editDataForm'].clearValidate()
      })
    },
    editSubmit() {
      this.$refs.editDataForm.validate((valid) => {
        if (valid) {
          this.editDialogFormVisible = true
          const para = Object.assign({}, this.editTemp)
          saveConsoleRole(para).then((res) => {
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
            }
          })
        }
      })
    },
    handleDel(row) {
      this.$confirm('您真的确定要删除角色吗？可能会造成对应的用户缺少权限 请确认！', '提示', {
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible = true
        const para = { id: row.id }
        deleteConsoleRole(para).then((res) => {
          this.dialogFormVisible = false
          this.handleFilter()
          if (res.data.resultCode == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {

      })
    },
    authorize(row) {
      this.authorizeTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.authorizeDialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['authorizeDataForm'].clearValidate()
      // })
      const para = { roleId: row.id }
      getListAllMenuFunction(para).then((res) => {
        if (res.data.resultCode == 200) {

        } else {
        }
      })
    }

  }

}
</script>
