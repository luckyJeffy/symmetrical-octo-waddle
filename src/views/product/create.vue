<template>
  <product-detail :is-edit="false"/>
</template>

<script>
import productDetail from './components/productDetail'

export default {
  name: 'ProductCreate',
  components: { productDetail }
}
</script>
