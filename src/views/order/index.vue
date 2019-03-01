<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.serNum" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <tree-table
      :data="orderList"
      :columns="columns"
      :eval-args="args"
      :expand-all="expandAll"
      border
    >
      <el-table-column label="支付状态">
        <template slot-scope="scope">
          {{ scope.row.payStatus | payStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column label="物流状态">
        <template slot-scope="scope">
          {{ scope.row.deliverStatus | deliverStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column label="订单总额">
        <template slot-scope="scope">
          {{ scope.row.totalFee | totalFeeFilter }}
        </template>
      </el-table-column>
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
      :total="orderCount"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="id">
          <template>{{ temp.id }}</template>
        </el-form-item>
        <el-form-item label="订单编号">
          <template>{{ temp.serNum }}</template>
        </el-form-item>
        <el-form-item label="收货人">
          <template>{{ temp.deliverName }}</template>
        </el-form-item>
        <el-form-item label="联系方式">
          <template>{{ temp.deliverPhone }}</template>
        </el-form-item>
        <el-form-item label="收货地址">
          <template>{{ temp.deliverAddress }}</template>
        </el-form-item>
        <el-form-item label="支付状态">
          <template>{{ temp.payStatus| payStatusFilter }}</template>
        </el-form-item>
        <el-form-item label="物流状态">
          <template>{{ temp.deliverStatus| deliverStatusFilter }}</template>
        </el-form-item>
        <el-form-item label="配送时间">
          <template>{{ temp.deliverTime | deliverTimeFilter }}个小时内送达</template>
        </el-form-item>
        <el-form-item label="创建时间">
          <!-- <el-input v-model="temp.deliverName"/> -->
          <template>{{ temp.createTime| createTimeFilter }}</template>
        </el-form-item>
        <el-form-item label="商品图片">
          <div v-for="(value,Indexes) in temp.productImg" :key="Indexes" class="productImg">
            <img :src="value.icon" alt="" width="150px" >
            <span class="productImg_name">{{ value.name }}</span>
            <span>单价：{{ value.price | totalFeeFilter }}</span>
            <br>
            <span>数量：{{ value.quantity }}</span>
          </div>
        </el-form-item>
        <el-form-item label="商品总价" >
          <template>{{ totalPrice | totalFeeFilter }}</template>
        </el-form-item>
        <el-form-item label="店铺优惠" >
          <template>{{ totalPrice-temp.totalFee | totalFeeFilter }}</template>
        </el-form-item>
        <el-form-item label="订单总额">
          <template>{{ temp.totalFee | totalFeeFilter }}</template>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import treeTable from '@/components/TreeTable'

export default {
  name: 'CatalogList',
  components: { treeTable },
  filters: {
    payStatusFilter(status) {
      const statusMap = {
        'NOT_PAY': '未支付',
        'PAID': '已支付'
      }
      return statusMap[status]
    },
    deliverStatusFilter(status) {
      const statusMap = {
        'ON_THE_WAY': '送货中',
        'CONFIRMED': '已送达'
      }
      return statusMap[status]
    },
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
    deliverTimeFilter(value) {
      return value / 60
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
          text: '订单编号',
          value: 'serNum'
        },
        {
          text: '收货人',
          value: 'deliverName'
        },
        {
          text: '联系电话',
          value: 'deliverPhone'
        },
        {
          text: '收货地址',
          value: 'deliverAddress'
        }
      ],
      args: [null, null, 'id'],
      pageIndex: 1,
      pageSize: 20,
      tableLoading: false,
      pageSizes: [20, 50, 100, 500],
      listQuery: {
        serNum: ''
      },
      totalPrice: 0, // 商品总价
      temp: {
        id: '',
        createTime: '',
        deliverAddress: '',
        deliverName: '',
        deliverPhone: '',
        deliverStatus: '',
        deliverTime: '',
        orderStatus: '',
        payStatus: '',
        productImg: '',
        serNum: '',
        storeId: '',
        totalFee: ''
      },
      payStatus: '',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '订单详情',
        create: 'Create'
      }

    }
  },
  computed: {
    orderList() {
      return this.$store.state.order.list
    },
    orderCount() {
      return this.$store.state.order.totalCount
    },
    tempPayStatus(status) {
      const statusMap = {
        'NOT_PAY': '未支付',
        'PAID': '已支付'
      }
      return statusMap[status]
    }
  },
  watch: {
    async pageIndex(newValue, oldValue) {
      this.tableLoading = true
      await this.getOrderList({ 'pageIndex': newValue, 'pageSize': this.pageSize, 'serNum': this.listQuery.serNum })
      this.tableLoading = false
    },
    async pageSize(newValue, oldValue) {
      this.tableLoading = true
      await this.getOrderList({ 'pageIndex': this.pageIndex, 'pageSize': newValue, 'serNum': this.listQuery.serNum })
      this.tableLoading = false
    }
  },
  created() {
    this.getOrderList({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'serNum': this.listQuery.serNum })
  },
  mounted() {
    // console.log('catalogList: ', this.catalogList)
  },
  methods: {
    ...mapActions({
      'getOrderList': 'GetOrderList'
    }),
    handleCurrentChange(val) {
      this.pageIndex = val
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleFilter() {
      this.getOrderList({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize, 'serNum': this.listQuery.serNum })
    },
    handleUpdate(row) {
      this.totalPrice = 0
      this.temp = Object.assign({}, row) // copy obj
      this.temp.productImg = JSON.parse(this.temp.productDetailJson)
      for (let i = 0; i < this.temp.productImg.length; i++) {
        this.totalPrice += this.temp.productImg[i].price * this.temp.productImg[i].quantity
      }
      console.log(this.totalPrice)
      console.log(this.temp.productImg)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
.productImg{
  height: 152px;
  margin-bottom: 10px;
  border: 1px solid #eee;
}
.productImg img{
  float: left;
}
.productImg .productImg_name{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

}
</style>
