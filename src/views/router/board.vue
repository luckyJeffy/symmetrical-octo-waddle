<template>
  <div class="router-board-container">
    <el-row>
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
      >
        <h3>
          <svg-icon icon-class="tree" />
          {{ $t('routerBoard.currentRoutesTitle') }}
        </h3>
        <el-tree
          :data="treeNode"
          :props="defaultProps"
          node-key="id"
        />
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="16"
        :xl="16"
        class="routes-edit-container"
      >
        <h3>
          <svg-icon icon-class="edit" />
          {{ $t('routerBoard.editRoutesTitle') }}
        </h3>
        <h4>选择路由</h4>
        <el-row>
          <el-col
            :xs="24"
            :sm="24"
            :md="16"
            :lg="16"
            :xl="16"
          >
            <el-cascader
              :options="treeNode"
              class="routes-edit-cascader"
              placeholder="试试搜索：图表"
              filterable
              change-on-select
            />
          </el-col>
        </el-row>
        <h4>添加路由</h4>
        <el-row :gutter="20">
          <el-col
            :xs="24"
            :sm="24"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <el-input
              v-model="currentNodeInput"
              placeholder="请输入路由名称"
            />
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <el-select
              v-model="currentSelectedComponent"
              filterable
              placeholder="请选择路由对应组件"
            >
              <!-- TODO 获取可用组件 -->
              <el-option
                v-for="item in treeNode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="4"
            :lg="4"
            :xl="4"
          >
            <el-button
              type="primary"
              plain
            >添加子节点至当前选中节点</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col
            :xs="24"
            :sm="24"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <el-input
              v-model="mainNodeInput"
              placeholder="请输入路由名称"
            />
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="4"
            :lg="4"
            :xl="4"
          >
            <el-button
              type="primary"
              plain
            >添加一级节点</el-button>
          </el-col>
        </el-row>
        <h4>删除路由</h4>
        <el-button
          type="danger"
          plain
        >删除当前选中节点</el-button>
        <span>*会连同删除下方节点</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import local from './local'
import { asyncRouterMap } from '@/router/index'
import { generateRandomString } from '@/utils'
const viewName = 'routerBoard'

export default {
  name: 'RouterBoard',
  data() {
    return {
      routes: [...asyncRouterMap],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentNodeInput: '',
      currentSelectedComponent: '',
      mainNodeInput: ''
    }
  },
  computed: {
    treeNode: function() {
      return this.generateNodeTree(this.routes)
    }
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[viewName]) {
      this.$i18n.mergeLocaleMessage('en', local.en)
      this.$i18n.mergeLocaleMessage('zh', local.zh)
    }
  },
  methods: {
    generateNodeTree(map) {
      if (!map) return false
      // invoke getter then filter data
      const parsedMap = JSON.parse(
        JSON.stringify(map)
      ).filter(item => item.hasOwnProperty('meta'))
      return parsedMap.map(node => {
        const randomStr = generateRandomString(3)
        return {
          id: randomStr,
          value: randomStr,
          label: this.$t(`route.${node.meta.title}`),
          children: this.generateNodeTree(node.children)
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.router-board-container {
  padding: 10px;
}
.routes-edit-container {
  .routes-edit-cascader {
    width: 100%;
  }
  .el-col {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
