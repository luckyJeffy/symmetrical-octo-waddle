<template>
  <order-detail :is-edit="true"/>
</template>

<script>
import orderDetail from './components/orderDetail'

export default {
  name: 'OrderDetail',
  components: { orderDetail }
}
</script>

