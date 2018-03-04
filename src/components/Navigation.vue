<template>
  <div class="container">
    <div class="row products-row">
      <router-link class="col-4 text-center product" to="flight-ticket" >
          <i class="fas fa-plane"></i>
          <h3>Avio Karte</h3>
      </router-link>
      <router-link class="col-4 text-center product" to="customer">
          <i class="fas fa-suitcase"></i>
          <h3>Angazmani</h3>
      </router-link>
      <router-link class="col-4 text-center product" to="customer">
          <i class="fas fa-chart-pie"></i>
          <h3>Statistika</h3>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Navigation'
}
</script>
<style>
.products-row {
  margin:5% 2%;
  border: 1px solid #ddd;
}

.product {
  padding-top:5%;
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

.product:hover {
  box-shadow: 0px 0px 15px #ddd;
  z-index:11;
  transform:translateY(-4px);
}
</style>
