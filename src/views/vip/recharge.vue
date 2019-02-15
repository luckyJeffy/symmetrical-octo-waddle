<template>
  <el-form :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="temp.name" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input />
    </el-form-item>
    <el-form-item label="充值金额" prop="money">
      <el-input />
    </el-form-item>
    <el-button type="primary">充值</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      temp: {
        name: '',
        phone: '',
        money: ''
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        money: [{ required: true, message: '充值金额不能为空', trigger: 'blur' }]
      }

    }
  }
}
</script>
