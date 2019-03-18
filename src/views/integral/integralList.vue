<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="商品名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="primary" icon="el-icon-document" class="filter-item" @click="addIntegralProduct">新增</el-button>
    </div>
    <tree-table
      :data="integralList"
      :columns="columns"
      :eval-args="args"
      :expand-all="expandAll"
      border
    >
        <el-table-column label="图标" width="80" align="center">
            <template slot-scope="scope">
                <img v-if="scope.row.icon" :src="scope.row.icon" class="prodicon">
                <span v-else>暂无图片</span>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template slot-scope="scope">
            {{ scope.row.createTime | createTimeFilter }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
            <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-document" @click="handleUpdate(scope.row)">详情</el-button>
            <el-button type="danger" size="mini" icon="el-icon-document" @click="handleDel(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </tree-table>
    <el-pagination
      v-loading.fullscreen.lock="tableLoading"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="integralCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="addDialogFormVisible" title="新增">
      <el-form ref="addDataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 500px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="temp.title"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="原价" prop="originPrice">
          <el-input type="number" v-model="temp.originPrice"/>
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input type="number" v-model="temp.integral"/>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="temp.unit"/>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="temp.specification"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="temp.brand"/>
        </el-form-item>
        <el-form-item label="产地" prop="cradle">
          <el-input v-model="temp.cradle"/>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-upload
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            class="avatar-uploader"
            action="/api/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com">
            <img v-if="temp.icon" :src="temp.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片" prop="morePics">
          <el-upload
            :headers="uploadHeaders"
            :on-success="handleFilePreview"
            :on-remove="handleFileRemove"
            :file-list="temp.morePics | picsFilter"
            action="/api/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com"
            class="upload-demo"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        
       
        <!-- <div v-if="false" style="margin-bottom: 20px;">
          <other-property-json v-model="temp.otherPropertyJson" />
        </div> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="insertIntegralProduct">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editDialogFormVisible" title="详情">
      <el-form ref="editDataForm" :rules="editRules" :model="editTemp" label-position="left" label-width="70px" style="width: 500px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editTemp.name"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="editTemp.title"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="原价" prop="originPrice">
          <el-input v-model="editTemp.originPrice" type="number"/>
        </el-form-item>
        <el-form-item label="积分">
          <el-input v-model="editTemp.integral" type="number" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="editTemp.unit"/>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="editTemp.specification"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="editTemp.brand"/>
        </el-form-item>
        <el-form-item label="产地" prop="cradle">
          <el-input v-model="editTemp.cradle"/>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-upload
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            class="avatar-uploader"
            action="/api/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com">
            <img v-if="editTemp.icon" :src="editTemp.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片" prop="morePics">
          <el-upload
            :headers="uploadHeaders"
            :on-success="handleFilePreview"
            :on-remove="handleFileRemove"
            :file-list="editTemp.morePics | picsFilter"
            action="/api/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com"
            class="upload-demo"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateIntegralProduct">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'
import { insertIntegralProduct, updateIntegralProduct, forceRemoveIntegralProduct } from '@/api/integral'
import OtherPropertyJson from '@/components/OtherPropertyJson/otherPropertyJson'
export default {
  name: 'integralList',
  components: { treeTable, OtherPropertyJson },
  filters: {
    totalFeeFilter(value) {
      if (value) {
        value = Number(value)
        return '￥' + (value / 100).toFixed(2)
      } else {
        return '￥0.00'
      }
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
    },
    picsFilter(list) {
      const urls = []
      for (const url of list) {
        urls.push({
          name: url.substring(url.lastIndexOf('/'), url.lastIndexOf('.')),
          url: url
        })
      }
      return urls
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
          text: '商品名',
          value: 'name'
        },
        {
          text: '原价',
          value: 'originPrice'
        },
        {
          text: '积分',
          value: 'integral'
        },
        {
          text: '单位',
          value: 'unit'
        },
        
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
      temp: {
        storeId: 0,
        name: '',
        title: '',
        integral: '',
        originPrice:'',
        unit:'',
        icon:'',
        morePics: [],
        otherPropertyJson:'',
        specification:'',
        brand:'',
        cradle:''
      },
      editTemp: {
        id:'',
        storeId: 0,
        name: '',
        title: '',
        integral: '',
        originPrice:'',
        unit:'',
        icon:'',
        morePics: [],
        otherPropertyJson:'',
        specification:'',
        brand:'',
        cradle:''
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        originPrice: [{ required: true, message: '原价不能为空', trigger: 'blur' }],
        integral: [{ required: true, message: '积分不能为空', integral: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        specification: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
        brand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
        cradle: [{ required: true, message: '产地不能为空', trigger: 'blur' }]
      },
      editRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        originPrice: [{ required: true, message: '原价不能为空', trigger: 'blur' }],
        integral: [{ required: true, message: '积分不能为空', integral: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        specification: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
        brand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
        cradle: [{ required: true, message: '产地不能为空', trigger: 'blur' }]
      }

    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    integralList() {
      return this.$store.state.integral.list
    },
    integralCount() {
      return this.$store.state.integral.totalCount
    },
    uploadHeaders() {
      return { 'accessToken': this.token }
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      let page = {
        'pageNo': newValue,
        'pageSize': this.pageSize,
        'name': this.listQuery.name 
      }
      await this.getlistIntegralProduct(page)
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      let page = {
        'pageNo': this.pageIndex,
        'pageSize': newValue,
        'name': this.listQuery.name 
      }
      await this.getlistIntegralProduct(page)
      this.tableLoading = false
    }
  },
  created() {
    let page = {
        'pageNo': this.pageIndex,
        'pageSize': this.pageSize,
        'name': this.listQuery.name 
    }
    this.getlistIntegralProduct(page)
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      'getlistIntegralProduct': 'GetlistIntegralProduct'
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
            'name': this.listQuery.name 
        }
      this.getlistIntegralProduct(page)
    },
    handleAvatarSuccess(response, file) {
      const res = response[0]
      if (res.resultCode !== '200') {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
        return
      }
      this.temp.icon = `http://${res.url}`
      console.log('icon', this.temp.icon)
    },
    handleFilePreview(response, file) {
      const res = response[0]
      if (res.resultCode !== '200') {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
        return
      }
      this.temp.morePics.push(`http://${res.url}`)
      console.log(this.temp.morePics)
    },
    handleFileRemove(file) {
      const index = this.temp.morePics.indexOf(file.url)
      if (index > -1) {
        this.temp.morePics.splice(index, 1)
      }
    },
    addIntegralProduct(){
        this.addDialogFormVisible = true
        this.$nextTick(() => {
            this.$refs['addDataForm'].clearValidate()
        })
    },
    insertIntegralProduct(){
        this.$refs.addDataForm.validate((valid) => {
        if (valid) {
          this.addDialogFormVisible = true
          const para = Object.assign({}, this.temp)
          para.morePics = para.morePics.join(',')
          console.log(para)
          insertIntegralProduct(para).then((res) => {
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
    handleUpdate(row) {
        this.editTemp = Object.assign({}, row) // copy obj
        this.temp.morePics = this.temp.morePics === null ? [] : this.temp.morePics
        const pics = this.editTemp.morePics
        if (pics && pics !== '') {
            this.editTemp.morePics = pics.split(',')
        } else {
            this.editTemp.morePics = []
        }
        // console.log(this.editTemp.morePics)
        this.id = row.id
        this.editDialogFormVisible = true
        this.$nextTick(() => {
            this.$refs['editDataForm'].clearValidate()
        })
    },
    updateIntegralProduct(){
        this.$refs.editDataForm.validate((valid) => {
        if (valid) {
          this.editDialogFormVisible = true
          const para = Object.assign({}, this.editTemp)
          para.morePics = para.morePics.join(',')
          delete para._expanded;//删除属性
          delete para._level;//删除属性
          delete para._show;//删除属性
          updateIntegralProduct(para).then((res) => {
            this.editDialogFormVisible = false
            this.handleFilter()
            if (res.data.resultCode == 200) {
              this.$notify({
                title: '成功',
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
        this.dialogFormVisible = true
        const para = { id: row.id }
        forceRemoveIntegralProduct(para).then((res) => {
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
    },
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.prodicon {
    width: 100%;
    height: 100%;
    display: block;
}
</style>


