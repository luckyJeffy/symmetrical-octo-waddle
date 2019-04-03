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
        <div class="wrapper">
          <ul class="item_wrapper">
            <li v-for="(item,index) in jobList" :key="item.id" class="item_first">
              <div class="item" @click="checkItem(index)">
                <div class="checkGroup" @click="checkAll(index)" @click.stop>
                  <i
                    :class="{'icon-gouxuan':isSelectAll[index] && isSelectAll[index].group,'icon-checkboxround0':isSelectAll[index] && !isSelectAll[index].group}"
                    class="iconfont"/>
                </div>
                {{ item.name }}
              </div>
              <ul v-show="isOpenItem[index] && isOpenItem[index].group" class="item_second">
                <div v-for="(second,j) in item.son" :key="second.id" class="item_third">
                  <div class="item" @click="checkSecondItem(index, j)">
                    <div class="checkGroup" @click="checkSecondAll(index, j)" @click.stop>
                      <i
                        :class="{'icon-gouxuan':isSelectAll[index] && isSelectAll[index].child[j],'icon-checkboxround0':isSelectAll[index] && !isSelectAll[index].child[j]}"
                        class="iconfont"/>
                    </div>
                    {{ second.name }}
                  </div>
                  <ul v-show="isOpenItem[index] && isOpenItem[index].child[j]" class="item_fourth">
                    <li v-for="(third,k) in second.member" :key="third.pid">
                      <input
                        :id="'check'+third.pid"
                        v-model="selectPeople"
                        :value="third"
                        type="checkbox"
                        name="school"
                        @click="stateChanged(index, j, k)">
                      <label :for="'check'+third.pid" class="content-wrap">
                        <!-- <div class="item_img" :style="{ background: third.headColor }">{{ third.name }}</div> -->
                        <div class="content">
                          <p class="content_name">
                            {{ third.userName }}
                          </p>
                          <p class="vice">{{ third.job }}</p>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
                <li v-for="(people,i) in item.member" :key="people.pid">
                  <input
                    :id="'check'+people.pid"
                    v-model="selectPeople"
                    :value="people"
                    type="checkbox"
                    name="school"
                    @click="stateChanged(index,i)">
                  <label :for="'check'+people.pid" class="content-wrap">
                    <!-- <div class="item_img" :style="{ background: people.headColor }">{{ people.name }}</div> -->
                    <div class="content">
                      <p class="content_name">
                        {{ people.userName }}
                      </p>
                      <p class="vice">{{ people.job }}</p>
                    </div>
                  </label>
                </li>
              </ul>
            </li>
          </ul>
        </div>

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
      headColor: ['#1c71fb', '#f7aa47', '#00c182', '#ff6769', '#917ee6', '#2cb2eb'], // 待选颜色
      jobList: [{
        'id': '2511',
        'name': '嫩江第一中学',
        'member': [{
          'pid': '12058',
          'userName': '冷风',
          'job': '安全主任',
          'name': '冷风'
        }, {
          'pid': '12005',
          'userName': '周大龙',
          'job': '安全主任',
          'name': '大龙'
        }],
        'son': [{
          'id': '2513',
          'name': '校领导',
          'member': [{
            'pid': '12056',
            'userName': '凌凌',
            'job': '安全主任',
            'name': '凌凌'
          }, {
            'pid': '12039',
            'userName': '唐老师',
            'job': '安全主任',
            'name': '老师'
          }]
        }]
      }, {
        'id': '2510',
        'name': '黑龙江黑河市嫩江县教育局',
        'son': [{
          'id': '2525',
          'name': '办公室 ',
          'member': [{
            'pid': '12006',
            'userName': '张喵喵',
            'job': '安全主任',
            'name': '喵喵'
          }, {
            'pid': '12024',
            'userName': '张徳龙',
            'job': '老师',
            'name': '徳龙'
          }]
        }, {
          'id': '2524',
          'name': '局长部',
          'member': [{
            'pid': '12015',
            'userName': '小组长',
            'job': '安全主任',
            'name': '组长'
          }, {
            'pid': '12025',
            'userName': 'TSY',
            'job': '11',
            'name': 'SY'
          }]
        }]
      }, {
        'id': '2545',
        'name': '城市之星2总部',
        'member': [{
          'pid': '12076',
          'userName': '文明',
          'job': '前端开发工程师',
          'name': '文明'
        }, {
          'pid': '12077',
          'userName': '不文明',
          'job': '高级架构师',
          'name': '文明'
        }]
      }], // 从后台获取的人员列表信息
      selectPeople: [], // 存储被选择的人员
      isOpenItem: [], // 控制每级面板的打开与折叠
      isSelectAll: []// 控制每级面板的选中状态
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
    this.initData()// 数据初始化
  },
  methods: {

    checkItem(index) { // 展开或折叠面板
      this.$set(this.isOpenItem[index], 'group', !this.isOpenItem[index].group)
    },
    checkSecondItem(firstIndex, secondIndex) { // 展开或折叠第二层面板
      this.$set(this.isOpenItem[firstIndex].child, secondIndex, !this.isOpenItem[firstIndex].child[secondIndex])
    },
    checkAll(index) { // 第一层级的全选操作
      this.$set(this.isSelectAll[index], 'group', !this.isSelectAll[index].group)// 改变当前按钮的选中状态
      if (!this.jobList[index].member && !this.jobList[index].son) {
        return
      }
      if (!this.isSelectAll[index].group) { // 从全选 =》 全不选
        for (const key in this.isSelectAll[index].child) { // 移除所有第二层级子项的选中状态
          this.$set(this.isSelectAll[index].child, key, false)
        }
        for (let i = 0, len = this.selectPeople.length; i < len; i++) {
          if (!this.selectPeople[i]) { // 删除干净了
            return
          }
          for (const k in this.jobList[index].son) { // 循环删除有部门的人员（对应列表第三层级）
            for (const j in this.jobList[index].son[k].member) {
              if (this.selectPeople[i] && this.selectPeople[i].pid == this.jobList[index].son[k].member[j].pid) {
                this.selectPeople.splice(i, 1)
                i--
                break
              }
            }
          }
          for (const j in this.jobList[index].member) { // 循环删除没有部门的人员（对应列表第二层级）
            if (this.selectPeople[i] && this.selectPeople[i].pid == this.jobList[index].member[j].pid) {
              this.selectPeople.splice(i, 1)
              i--
              break
            }
          }
        }
      } else { // 从全不选 =》 全选
        for (const key in this.isSelectAll[index].child) { // 给所有第二层级子项添加选中状态
          this.$set(this.isSelectAll[index].child, key, true)
        }
        for (const i in this.jobList[index].member) { // 循环添加没有部门的人员（对应列表第二层级）
          if (this.selectPeople.includes(this.jobList[index].member[i])) { // 如果已经存在，就不用再进行添加
            continue
          }
          this.selectPeople.push(this.jobList[index].member[i])
        }
        for (const i in this.jobList[index].son) { // 循环添加有部门的人员（对应列表第三层级）
          for (const j in this.jobList[index].son[i].member) {
            if (this.selectPeople.includes(this.jobList[index].son[i].member[j])) { // 如果已经存在，就不用再进行添加
              continue
            }
            this.selectPeople.push(this.jobList[index].son[i].member[j])
          }
        }
      }
    },
    checkSecondAll(index, secondIndex) { // 第二层级的全选操作
      this.$set(this.isSelectAll[index].child, secondIndex, !this.isSelectAll[index].child[secondIndex])// 改变当前按钮的选中状态
      const members = this.jobList[index].son[secondIndex].member// 当前选项的所有成员
      if (!members) {
        return
      }
      if (!this.isSelectAll[index].child[secondIndex]) { // 从全选 =》 全不选
        this.$set(this.isSelectAll[index], 'group', false)// 改变顶级按钮的选中状态为非选中状态
        for (let i = 0, len = this.selectPeople.length; i < len; i++) {
          if (!this.selectPeople[i]) { // 删除干净了
            return
          }
          for (const j in members) { // 循环删除当前部门的所有人员（对应列表第三层级）
            if (this.selectPeople[i].pid == members[j].pid) {
              this.selectPeople.splice(i, 1)
              i--
              break
            }
          }
        }
      } else { // 从全不选 =》 全选
        for (const j in members) { // 循环添加当前部门的所有人员（对应列表第三层级）
          if (this.selectPeople.includes(members[j])) { // 如果已经存在，就不用再进行添加
            continue
          }
          this.selectPeople.push(members[j])
        }
        this.setFirstLevelChecked(index)
      }
    },
    setHeadColor(data, headColor) { // 设置头像背景颜色
      const length = headColor.length
      for (const i in data) {
        // 添加headColor属性
        this.$set(data[i], 'headColor', headColor[Math.floor(Math.random() * length)])
      }
    },
    stateChanged(index, i, j) {
      if (j !== undefined) { // 如果有j值，代表第三层级数据
        if (this.selectPeople.includes(this.jobList[index].son[i].member[j])) { // 点击之前为选中状态
          this.$set(this.isSelectAll[index].child, i, false)// 改变父级按钮的选中状态为非选中状态
          this.$set(this.isSelectAll[index], 'group', false)// 改变顶级按钮的选中状态为非选中状态
        } else { // 点击之前为非选中状态
          // 给父级添加选中状态
          for (let k = 0; k < this.jobList[index].son[i].member.length; k++) {
            if (!this.selectPeople.includes(this.jobList[index].son[i].member[k]) && this.jobList[index].son[i].member[k] != this.jobList[index].son[i].member[j]) { // 只要有其中一个未选中，就跳出循环，不给父级添加选中状态
              return false
            }
          }
          this.$set(this.isSelectAll[index].child, i, true)// 改变父级按钮的选中状态为选中状态
          this.setFirstLevelChecked(index, this.jobList[index].son[i].member[j])// 给第一级添加选中状态
        }
      } else { // 没有j值，第二层级数据
        if (this.selectPeople.includes(this.jobList[index].member[i])) { // 点击之前为选中状态
          this.$set(this.isSelectAll[index], 'group', false)// 改变父级按钮的选中状态为非选中状态
        } else { // 点击之前为非选中状态
          this.setFirstLevelChecked(index, this.jobList[index].member[i])// 给第一级添加选中状态
        }
      }
    },
    setFirstLevelChecked(index, data) { // 给第一级添加选中状态
      for (const k in this.jobList[index].member) {
        if (!this.selectPeople.includes(this.jobList[index].member[k]) && data != this.jobList[index].member[k]) { // 只要有其中一个未选中，就跳出循环，不给父级添加选中状态
          return false
        }
      }
      for (const i in this.jobList[index].son) { // 循环添加有部门的人员（对应列表第三层级）
        for (const j in this.jobList[index].son[i].member) {
          if (!this.selectPeople.includes(this.jobList[index].son[i].member[j]) && data != this.jobList[index].son[i].member[j]) { // 如果已经存在，就不用再进行添加
            return false
          }
        }
      }
      this.$set(this.isSelectAll[index], 'group', true)// 改变第一级按钮的选中状态为选中状态
    },
    initData() { // 数据初始化
      // 设置头像背景颜色
      const len = this.jobList.length
      for (let i = 0; i < len; i++) {
        this.setHeadColor(this.jobList[i].member, this.headColor)
        // 根据数据初始化全选按钮状态
        this.isSelectAll.push([])
        this.$set(this.isSelectAll[i], 'group', false)
        this.$set(this.isSelectAll[i], 'child', [])
        // 根据数据初始化折叠面板折叠状态
        this.isOpenItem.push([])
        this.$set(this.isOpenItem[i], 'group', false)
        this.$set(this.isOpenItem[i], 'child', [])
        // 设置第二层级的状态
        for (const j in this.jobList[i].son) {
          this.isSelectAll[i].child.push(false)
          this.isOpenItem[i].child.push(false)
          this.setHeadColor(this.jobList[i].son[j].member, this.headColor)
        }
      }
    },

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
<style lang="stylus" scoped>
    @import "../../style/reset.styl"
    @import "../../style/common.styl"
    .filter-container .filter-item{
      font-size: 14px;
    }
    .el-button--mini{
      font-size: 12px;
    }
    .el-button--medium{
      font-size: 12px;
    }
    .wrapper {
        // padding-bottom: px2vw(90px)
    }

    .item_first {
        borderBottom()
    }

    .item {
        display flex
        // fontSize(34px)
        fontSize(17px)
        // paddingAround()
        .iconfont {
            // fontSize(44px)
            fontSize:22px;
        }
    }

    .item_second li {
        display: flex
        align-items center
        borderTop()
        // paddingAround()
        // padding-left px2vw(45px)
        .content-wrap {
            display: flex;
            width: 100%
            .item_img {
                display flex
                justify-content center
                align-items center
                width: 45px;
                height: 45px;
                border-radius: 50%
                // margin-left px2vw(20px)
                // margin-right px2vw(15px)
                color: #fff
                text-align: center
            }
            .content {
                .content_name {
                    font-weight: bold
                }
                .vice {
                    color: vice-font-color
                }
            }

        }

    }

    .item_second label {
        flex 1
    }

    .item_third {
        borderTop()
    }

    .item_third .item {
        // margin-left px2vw(15px)
    }

    .item_fourth > li {
        // padding-left px2vw(90px)
    }

    .icon-gouxuan {
        color: main-color
    }

    .icon-checkboxround0 {
        color: vice-font-color
    }

    .checkGroup {
        // width px2vw(60px)
        display inline-block
    }

    .head_img {
        // width: px2vw(100px)
        // height: px2vw(100px)
        border-radius 50%
        // margin-left px2vw(15px)
        // margin-right px2vw(15px)
    }

    input[type='checkbox'] {
        width: 40px;
        height: 40px;
        -webkit-appearance: none;
        background: url("../../assets/checkbox_round.png") no-repeat center;
        background-size 40px 40px;
        outline: none;
    }

    input[type='checkbox']:checked {
        background: url("../../assets/checkbox_check.png") no-repeat center;
        background-size 40px 40px;
    }
</style>
