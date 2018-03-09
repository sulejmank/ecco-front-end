<template>
  <div class="container">
    <div class="row">
      <div class="col colored">
        <div class="customer row">
          <div class="col-2 align-self-center">
            <h4>
              <strong>Avio Karte</strong>
            </h4>
          </div>
          <div class="col text-right" v-if="customerIsCreated">
            <img src="@/assets/logo.png" class="img-thumbnail sized" alt="">
          </div>
          <div class="col-4" v-if="customerIsCreated">
            <p class="bottom-margin">
              Name:<strong>{{customer.prezime + ', ' + customer.ime}}</strong>
            </p>
            <p class="bottom-margin">
              Email:<strong>{{customer.email}}</strong>
            </p>
            <p class="bottom-margin">
              Passport:<strong>{{customer.brojPasosa}}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <form class="form-row col-12" @submit.prevent="validateForm('flight-ticket-form')" data-vv-scope="flight-ticket-form"  autocomplete='off'> <!-- @submit.prevent="validateForm('customer-form')" data-vv-scope="customer-form"  autocomplete='off' -->
        <div class="form-group col-12 bottom-margin extra-padding">
          <p class="bottom-margin">
            <input type="checkbox" v-model="roundTrip" id="round-trip">
            <label for="round-trip">Avio Karta u <strong>Oba Smera</strong></label>
          </p>
        </div>
        <suggestion @modelSuggested="updateDeparture" @updateModel="updateDeparture" :method="api.getPlaceSuggestion" :classes="'form-group col-6'" :label="'Mesto polaska'" :name="'departurePlace'" :formName="'flight-ticket-form'" :placeholder="'Mesto polaska'" :value="ticket.putovanjeOd"></suggestion>
        <suggestion @modelSuggested="updateDestination" @updateModel="updateDestination" :method="api.getPlaceSuggestion" :classes="'form-group col-6'" :label="'Destinacija'" :name="'destination'" :formName="'flight-ticket-form'" :placeholder="'Destinacija'" :value="ticket.putovanjeDo"></suggestion>
        <div class="form-group col-6">
          <label for="departureDate">Polazak</label>
          <date-picker :date='departureTime' @change="updateDepartureTime" :option="option"></date-picker>
          <span class="form-text text-danger error-msg">This is error message</span>
        </div>
        <div class="form-group col-6">
          <label for="returnDate" v-show="roundTrip">Povratak</label>
          <date-picker :date='returnTime' @change="updateReturnTime" :option="option" v-show="roundTrip"></date-picker>
          <span class="form-text text-danger error-msg" v-show="roundTrip">This is error message</span>
        </div>
        <div class="form-group col-6">
          <label for="flight-company">Avio Kompanija</label>
          <input type="text" id="flight-company" class="form-control" name="flight-company" placeholder="Ime Kompanije">
          <span class="form-text text-danger error-msg">This is error message</span>
        </div>
        <hr class="col-12 horizontal" />
        <div class="form-group col-12 row bottom-margin">
          <div class="col-12 row passangers" v-for="(passanger, index) in flightPassengers" :key="passanger.id">
            <label for="" class="col-6 text-center passanger-row">
              <i class="far fa-times-circle close-awsome" v-on:click="removePassanger(index)"></i>
              {{passanger.prezime + ", " +passanger.ime }}
            </label>
            <input type="text" class="form-control col-6" name="price-bruto" placeholder="Broj rezervacije/karte" v-model="passanger.cardId">
          </div>
          <div  class="col text-center">
            <button class="btn btn-default" v-on:click.prevent="addPassenger" type="button"><i class="fas fa-plus-circle"></i>Dodaj Putnika</button>
          </div>
        </div>
        <hr class="col-12 horizontal" />
        <div class="form-group col-12 row">
          <label for="" class="col-6 text-center">Cena jedne karte</label>
          <input type="text" class="form-control col-6" name="price-bruto">
        </div>
        <div class="form-group col-12 row">
          <label for="" class="col-6 text-center">Cena BRUTO</label>
          <input type="text" class="form-control col-6" name="price-bruto">
        </div>
        <div class="form-group col-12 row">
          <label for="" class="col-6 text-center">Cena NETO</label>
          <input type="text" class="form-control col-6" name="price-neto">
        </div>
        <div class="form-group col-12 row">
          <div class="col-6">
            <button class="btn btn-primary btn-lg btn-block" v-on:click.prevent="print">Jos Produkta</button>
          </div>
          <div class="col-6">
            <button class="btn btn-primary btn-lg btn-block">Add Produc</button>
          </div>
        </div>
      </form>
    </div>
    <modal v-if="show" @closeModal="show = false"></modal>
  </div>
</template>
<script>
import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
import FlightTicket from '@/models/FlightTicket.js'
import Suggestion from '@/components/helpers/Suggestion'
import PassangerModal from '@/components/helpers/PassangerModal'
import Api from '@/services/api.js'
import moment from 'moment'

export default{
  name: 'FlightTicket',
  components: {
    'date-picker': myDatepicker,
    'suggestion': Suggestion,
    'modal': PassangerModal
  },
  data () {
    return {
      ticket: new FlightTicket(),
      passangers: [],
      show: false,
      api: new Api(),
      roundTrip: false,
      destination: '',
      departureTime: {
        time: moment().format('DD/MM/YYYY hh:mm')
      },
      returnTime: {
        time: moment().format('DD/MM/YYYY hh:mm')
      },
      option: {
        type: 'min',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'DD/MM/YYYY HH:mm',
        placeholder: 'Date ',
        overlayOpacity: 0.3, // 0.5 as default
        dismissible: true // as true as default
      }
    }
  },
  computed: {
    customerIsCreated () {
      return this.$store.state.customer.id !== undefined
    },
    customer () {
      return this.$store.getters.getCustomer
    },
    flightPassengers () {
      return this.$store.state.passangers
    },
    ticketIds () {
      return this.flightPassengers.map(el => {
        var obj = {
          'ticketId': el.cardId,
          'passangerId': el.id
        }
        return obj
      })
    }
  },
  methods: {
    update () {
      console.log(' It\'s all good, broo ')
    },
    updateDepartureTime (event) {
      this.ticket.datumPolaska = event
    },
    updateReturnTime (event) {
      this.ticket.datumPovratka = event
    },
    addPassenger () {
      this.show = true
      console.log(' Passenger Added')
    },
    updateDestination (event) {
      this.ticket.putovanjeDo = event
    },
    updateDeparture (event) {
      this.ticket.putovanjeOd = event
    },
    addCustomer (event) {
      console.log('here')
      this.passangers.push(event)
    },
    removePassanger (i) {
      this.$store.commit('removePassanger', i)
    },
    print () {
      console.log(this.ticketIds)
    }
  }
}
</script>
<style>
.colored {
  background-color:#ddd;
}
.sized {
  height:6em;
}

.bottom-margin{
  margin-bottom:0;
}

.error-msg{
  font-size:.7em;
}

.extra-padding{
  padding-top:2%;
}
.btn i{
  padding-right:1em;
}

.passangers{
  margin:1% 0%
}

.passanger-row{
  font-size: 1.1em;
  padding-top: 5px;
}

.close-awsome{
  float: left;
  margin-top: .2em;
  padding:5px;
}
.close-awsome:hover {
  background-color:#ddd;
  border-radius: 15px;
  cursor: pointer;
}
</style>
