<template>
  <div v-if="loaded">
    <table
        v-if="orders.length"
        class="table table-striped table-hover"
    >
      <thead>
      <tr>
        <th>Order ID</th>
        <th>Order Date</th>
        <th>Cart ID</th>
        <th>Payment ID</th>
        <th>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="order in orders"
          @click="atRowClicked(order.ORDER_ID)"
      >
        <td>{{order.ORDER_ID}}</td>
        <td>{{order.ORDER_DATE.split('T')[0]}}</td>
        <td>{{order.CART_ID}}</td>
        <td>{{order.PAYMENT_ID}}</td>
        <td>{{order.STATUS}}</td>
      </tr>
      </tbody>
    </table>
    <div v-else>
      <h3>No Orders Available...</h3>
    </div>
  </div>
  <div v-else>
    <h3>Loading...</h3>
  </div>
</template>

<script>
let socket;
export default {
  name: "OrderHistory",
  data(){
    return {
      loaded: false,
      orders: []
    }
  },
  methods:{
    atRowClicked(orderId){
      this.$router.push('/customers/profile/history/'+orderId+'/details').catch((e)=>{
        console.log('Routing error in OrderHistory.vue');
      });
    }
  },
  created() {
    socket = this.$store.getters.getSocket;
    socket.emit('sendOrderHistory', this.$store.getters.getUser.token);
    socket.on('getOrderHistory', (res)=>{
      socket.off('getOrderHistory');
      this.orders = res;
      this.loaded = true;
    });
  }
}
</script>

<style scoped>

</style>
