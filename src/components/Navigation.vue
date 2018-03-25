<template>
  <div class="container">
    <div class="row">
      <div class="col colored">
        <div class="customer row">
          <div class="col-2 align-self-center">
            <h4>
              <strong>Navigacija</strong>
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="row products-row">
      <router-link class="col-4 text-center product" to="flight-ticket" >
          <i class="fas fa-plane"></i>
          <h3>Avio Karte</h3>
      </router-link>
      <router-link class="col-4 text-center product" to="angazman">
          <i class="fas fa-suitcase"></i>
          <h3>Angazmani</h3>
      </router-link>
      <router-link class="col-4 text-center product" to="customer">
          <i class="fas fa-chart-pie"></i>
          <h3>Statistika</h3>
      </router-link>
    </div>
    <div class="row" v-if="flightTickets !== undefined">
      <div class="col" v-for="ticket in flightTickets" :key="ticket.id">
        <div class="card bg-light mb-3" style="max-width: 18rem;margin:auto">
          <div class="card-header">Avio Karte</div>
          <div class="card-body">
            <h5 class="card-title" v-if="!ticket.jedanParvac">{{ticket.putovanjeOd}} <i class="fas fa-long-arrow-alt-right"></i> {{ticket.putovanjeDo}}</h5>
            <h5 class="card-title" v-if="ticket.jedanParvac">{{ticket.putovanjeOd}} <i class="fas fa-arrows-alt-h"></i> {{ticket.putovanjeDo}}</h5>
            <p class="card-text">ID Putnika: <strong>{{ticket.idPutnika}}</strong></p>
            <p class="card-text">ID Karte: <strong>{{ticket.brojRezervacije}}</strong></p>
          </div>
        </div>
      </div>

      <div class="col-12">
        <button type="button" class="btn btn-secondary btn-lg btn-block" v-on:click="toCheckout">Naplata</button>
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/router'

export default {
  name: 'Navigation',
  computed: {
    flightTickets () {
      return this.$store.getters.getFlightTickets
    }
  },
  methods: {
    toCheckout () {
      router.push('check-out')
    }
  }
}
</script>
<style>
.products-row {
  margin: 20px 0%;
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
