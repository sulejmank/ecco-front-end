<template>
<div class="container">
  <div class="row">
    <div class="col colored">
      <div class="customer row">
        <div class="col-2 align-self-center">
          <h4>
            <strong>Naplata</strong>
          </h4>
        </div>
      </div>
    </div>
  </div>
  <div class="row" style="margin-top: 2%;">
    <div class="col-5">
      <div class="card bg-light mb-3">
        <div class="card-header">Flight Tickets</div>
        <div class="card-body custom-card-body" v-for="ticket in flightTickets" :key="ticket.id">
          <p class="card-title text-center trip">{{ticket.putovanjeOd}} </p>
          <p class="text-center trip"><i :class="{'fas fa-long-arrow-alt-down': !ticket.jedanParvac, 'fas fa-arrows-alt-v': ticket.jedanParvac}"></i></p>
          <p class="card-title text-center trip">{{ticket.putovanjeDo}}</p>
          <p class="sized-margins">Putnik: <strong style="float:right">{{getPassangerById(ticket.idPutnika)}}</strong></p>
          <p class="sized-margins">ID Rezervacije: <strong style="float:right">{{ticket.brojRezervacije}}</strong></p>
          <p class="sized-margins">Datum putovanja: <strong style="float:right">{{ticket.datumPolaska}}</strong></p>
          <p class="sized-margins" v-if="ticket.jedanParvac">Datum povratka: <strong style="float:right">{{ticket.datumDolaska}}</strong></p>
          <p class="sized-margins">Avio kompanija: <strong style="float:right">{{ticket.avioKompanija}}</strong></p>
          <p class="sized-margins">Cena: <strong style="float:right">{{ticket.cena | decimal }}</strong></p>
          <hr class="custom-hr">
        </div>
        <div class="card-body">
          <p>Ukupno: <strong style="float:right">{{sumedPrice| decimal }}</strong></p>
        </div>
      </div>
    </div>
    <div class="col-5">
      <div class="form-group">
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default{
  name: 'Checkout',
  computed: {
    flightTickets () {
      return this.$store.getters.getFlightTickets
    },
    sumedPrice () {
      return this.$store.getters.getFlightTickets.reduce((sum, el) => sum += el.cena, 0)
    }
  },
  filters: {
    decimal: function (value) {
      if (!value) return ''
      value = value.toString().split('.')
      return value[0] + '.' + (value[1] !== undefined ? value[1] : '00')
    }
  },
  methods: {
    getPassangerById (idPutnika) {
      var passengers = this.$store.getters.getAllPassengers
      var passenger
      passengers.forEach(element => {
        if (element.id === idPutnika) {
          passenger = element
        }
      })
      var surnameName = passenger !== undefined ? passenger.prezime + ', ' + passenger.ime : 'Passanger not available'
      return surnameName
    }
  }

}
</script>
<style>
.trip{
  margin-bottom:0;
  font-style:1.5em
}

.sized-margins {
  margin-bottom:.5rem;
}

.custom-card-body{
  padding-bottom:0;
}

.custom-card-body:hover{
  background-color:#ddd;
}
.custom-hr{
  margin-bottom:0;
}
</style>
