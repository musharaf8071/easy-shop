<template>
  <div v-if="loaded">
    <div>
      <h3 class="info text-light p-2">Cart Details</h3>
      <table
          class="table table-striped table-hover"
          v-if="cart.length"
      >
        <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Quantity</th>
          <th>Total Price</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item,idx) in cart"
        >
          <td>{{item.MODEL_NAME}}</td>
          <td>{{item.PRICE}}</td>
          <td>{{item.DISCOUNT}}</td>
          <td>{{item.QUANTITY}}</td>
          <td>{{item.PRICE*(1-item.DISCOUNT/100)*item.QUANTITY}}</td>
        </tr>
        </tbody>
      </table>
      <h3
          style="margin: 25px;text-align: center"
      >Total Price : <b>TK.{{totalPrice}}</b></h3>
      <b-alert
          variant="danger"
          :show="!checkAvailability"
      >Some cart items are not available now!</b-alert>
    </div>
    <div>
      <h3 class="info text-light p-2">Payment Section:</h3>
      <b-form>
        <b-form-select
            :options="paymentOptions"
            v-model="paymentType"
            style="margin: 10px;"
            :state="paymentType!=null"
        ></b-form-select>
      </b-form>
      <h4
          style="margin: 10px;"
      >Total Amount: <b>TK.{{totalPrice}}</b></h4>
      <h4
          style="margin: 10px;"
      >Payment Stauts: <b>{{paymentStatus}}</b></h4>

      <b-button
          variant="success"
          block
          @click="makePayment"
      >Make Payment</b-button>
    </div>


  </div>
  <div v-else><h3>Loading...</h3></div>
</template>

<script>
let socket;
export default {
  name: "Checkout",
  data(){
    return{
      loaded: false,
      cartId: null,
      paymentStatus: 'Not Paid',
      cart: [],
      paymentType: null,
      paymentOptions: [
        {text:'Payment Type', value: null},
        {text: 'bKash', value: 'bKash'},
        {text: 'Rocket', value: 'Rocket'}
      ]
    }
  },
  methods:{
    makePayment(){
      if(this.paymentType==null){
        alert('Payment type not selected!');
        return;
      }
      if(this.checkAvailability){
        let date = (new Date().toLocaleDateString()).split('/');
        let today = date[2]+'/'+date[0]+'/'+date[1];
        let data = {
          id: '',
          type: this.paymentType,
          tablename: 'payments',
          amount: this.totalPrice,
          date: today,
          status: 'Paid',
          cartId: this.cartId,
          customerToken: this.$store.getters.getUser.token
        }
        socket.emit('insert',data);
      }
      else{
        alert('Items not available');
      }
    }

  },
  computed: {
    totalPrice(){
      let price=0;
      for(let i=0;i<this.cart.length;i++){
        price += this.cart[i].PRICE*(1-this.cart[i].DISCOUNT/100)*this.cart[i].QUANTITY;
      }
      return price;
    },
    checkAvailability(){
      let available = true;
      for(let i=0; i<this.cart.length;i++){
        if(this.cart[i].QUANTITY>this.cart[i].STOCK){
          available = false;
          break;
        }
      }
      return available;
    }
  },
  created() {
    let user = this.$store.getters.getUser;
    if(user == null || user.type.toLowerCase() !== 'customer'){
      alert('You mush sign in as Customer!');
      this.$router.push('/auth/signin').catch((e)=>{
        console.log('Routing Error in Checkout.vue');
      });
      return;
    }

    this.cartId = this.$route.params.id;
    socket = this.$store.getters.getSocket;
    socket.emit('sendCartItems',this.cartId);
    socket.on('getCartItems', (res) => {
      socket.off('getCartItems');
      this.cart = res;
      this.loaded = true;
    });
    socket.on('paymentInfo',(res)=>{
      socket.off('paymentInfo');
      if(res.success){
        this.$router.push('/orders/carts/bought-carts').catch((e)=>{
          console.log('Routing error in Checkout.vue');
        });
      }
    });
  }
}
</script>

<style scoped>

</style>
