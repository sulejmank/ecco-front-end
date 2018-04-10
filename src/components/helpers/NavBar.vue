 <template> 
  <div class="container">
      <div class="row products-row">
        <router-link class="col-2 text-center product"  to="navigation">
          <i class="fas fa-bars"></i>
        </router-link>
        <router-link class="col-2 text-center product" to="flight-ticket" >
          <i class="fas fa-plane"></i>
        </router-link>
        <router-link class="col-2 text-center product" to="angazman">
          <i class="fas fa-suitcase"></i>
        </router-link>
        <router-link class="col-2 text-center product" to="statistic">
          <i class="fas fa-chart-pie"></i>
        </router-link>
        <router-link class="col-2 text-center product"  to="customer">
          <i class="fas fa-address-card"></i>
        </router-link>
        <router-link class="col-2 text-center product"  to="transfers">
          <i class="fas fa-exchange-alt"></i>
        </router-link>
      </div>
        <hr class="custom-hr">  
  </div>  
</template>
  
<style scoped>
.colored {
  background-color:#ddd;
}
.margin-y{
  margin:5px 0;
}
.size{
  width:20%;
}

.products-row {
  margin: 20px 0%;
  border: 1px solid #ddd;
}

.product {
  padding-bottom:5%;
  background-color:#fff;
  z-index:10;
  transition:all .2s ease 0s;
  color:#000;
  text-decoration: none;
}

.product i {
  font-size:3em;
  color:#000;
  text-decoration: none;
}
.product h3, .product:hover h3 {
  color:#000;
  text-decoration: none;
}
#ak {
  box-shadow: 0px 0px 15px #ddd;
  z-index:11;
  transform:translateY(-4px);
}

.product:hover {
  box-shadow: 0px 0px 15px #ddd;
  z-index:11;
  transform:translateY(-4px);
}
</style>
