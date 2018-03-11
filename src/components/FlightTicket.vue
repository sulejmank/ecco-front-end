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
          <div class="col text-right" v-if="!customerIsCreated">
            <button class="btn btn-light" v-on:click.prevent="navigate">Dodaj Musteriju</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <form class="form-row col-12" @submit.prevent="validateForm(formName)" data-vv-scope="flight-ticket-form"  autocomplete='off'> <!-- @submit.prevent="validateForm('customer-form')" data-vv-scope="customer-form"  autocomplete='off' -->
        <div class="form-group col-12 bottom-margin extra-padding">
          <p class="bottom-margin">
            <label class="switch">
              <input type="checkbox" v-model="roundTrip" name="round-trip" id="round-trip">
              <span class="slider round"></span>
            </label>
            <label for="round-trip" class="custom-label">Avio Karta u <strong>Oba Smera</strong></label>
          </p>
        </div>
        <suggestion @modelSuggested="updateDeparture" @updateModel="updateDeparture" :method="api.getPlaceSuggestion" :classes="'form-group col-6'" :label="'Mesto polaska'" :fieldname="'departurePlace'" :formName="formName" :placeholder="'Mesto polaska'" :value="ticket.putovanjeOd"></suggestion>
        <suggestion @modelSuggested="updateDestination" @updateModel="updateDestination" :method="api.getPlaceSuggestion" :classes="'form-group col-6'" :label="'Destinacija'" :fieldname="'destination'" :formName="formName" :placeholder="'Destinacija'" :value="ticket.putovanjeDo"></suggestion>
        <div class="form-group col-6">
          <label for="departureDate">Polazak</label>
          <date-picker :date='departureTime' @change="updateDepartureTime" :option="option" :hasErrors="validDepartureTime"></date-picker>
          <span class="form-text text-danger error-msg" v-show="validDepartureTime">{{departureDateValidationMessage}}</span>
        </div>
        <div class="form-group col-6">
          <label for="returnDate" v-show="roundTrip">Povratak</label>
          <date-picker :date='returnTime' @change="updateReturnTime" :option="option" :hasErrors="validReturnTime" v-show="roundTrip"></date-picker>
          <span class="form-text text-danger error-msg" v-show="validReturnTime">{{returnDateValidationMessage}}</span>
        </div>
        <div class="form-group col-6">
          <label for="flight-company">Avio Kompanija</label>
          <input type="text" id="flight-company" v-bind:class="{'form-control': true, 'is-invalid': errors.has(formName + '.flight-company')}" name="flight-company" v-model="ticket.avioKompanija" placeholder="Ime Kompanije" v-validate="'required'">
          <span class="form-text text-danger error-msg" v-show="errors.has(formName + '.flight-company')">{{ errors.first(formName + '.flight-company') }}</span>
        </div>
        <hr class="col-12 horizontal" />
        <div class="form-group col-12 row bottom-margin">
          <div class="col-12 row passangers" v-for="(passanger, index) in flightPassengers" :key="passanger.id">
            <label for="" class="col-6 text-center passanger-row">
              <i class="far fa-times-circle close-awsome" v-on:click="removePassanger(index)"></i>
              {{passanger.prezime + ", " +passanger.ime }}
            </label>
            <div class="form-group form-group col-6">
              <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has(formName + '.'+ 'price-bruto-' + index)}" v-bind:name="'price-bruto-' + index" placeholder="Broj rezervacije/karte" v-model="passanger.cardId" v-validate="'required|alpha_num'">
              <span v-show="errors.has(formName + '.'+ 'price-bruto-' + index)" id="nameHelp" class="form-text text-danger error-msg">{{ errors.first(formName + '.'+ 'price-bruto-' + index) }}</span>
            </div>
          </div>
          <div  class="col text-center">
            <button class="btn btn-default" v-on:click.prevent="addPassenger" type="button"><i class="fas fa-plus-circle"></i>Dodaj Putnika</button>
          </div>
        </div>
        <hr class="col-12 horizontal" />
        <div class="container" v-show="flightPassengers.length > 0">
          <div class="form-group col-12 row">
            <label for="" class="col-6 text-center">Cena jedne karte</label>
            <div class="col-6">
              <vue-numeric :currency="'€'" :separator="'.'" :classes="'form-control text-center'" v-model="ticket.cena" :decimal-separator="','" :precision="2"></vue-numeric>
              <!-- <input type="number" v-bind:class="{'form-control text-center': true, 'is-invalid': errors.has(formName + '.price')}" name="price" v-model="ticket.cena" v-validate="'required|numeric'"> -->
              <span v-show="errors.has(formName + '.price')" id="nameHelp" class="form-text text-danger error-msg">{{ errors.first(formName + '.price') }}</span>
            </div>
          </div>
          <div class="form-group col-12 row">
            <label for="" class="col-6 text-center">Cena BRUTO</label>
            <div class="col-6">
              <vue-numeric :currency="'€'" :separator="'.'" :classes="'form-control text-center'" v-model="ticket.cenaBruto" :decimal-separator="','" :precision="2"></vue-numeric>
              <!-- <input type="number" v-bind:class="{'form-control text-center': true, 'is-invalid': errors.has(formName + '.price-bruto')}" name="price-bruto" v-validate="'required|numeric'"> -->
              <span v-show="errors.has(formName + '.price')" id="nameHelp" class="form-text text-danger error-msg">{{ errors.first(formName + '.price-bruto') }}</span>
            </div>
          </div>
          <div class="form-group col-12 row">
            <label for="" class="col-6 text-center">Cena NETO</label>
            <div class="col-6">
              <vue-numeric :currency="'€'" :separator="'.'" :classes="'form-control text-center'" v-model="ticket.cenaNeto" :decimal-separator="','" :precision="2"></vue-numeric>
              <!-- <input type="number" v-bind:class="{'form-control text-center': true, 'is-invalid': errors.has(formName + '.price-neto')}" name="price-neto" v-validate="'required|numeric'"> -->
              <span v-show="errors.has(formName + '.price')" id="nameHelp" class="form-text text-danger error-msg">{{ errors.first(formName + '.price-neto') }}</span>
            </div>
          </div>
          <div class="form-group col-12 row">
            <div class="col-6">
              <button class="btn btn-primary btn-lg btn-block" v-on:click.prevent="toMoreProducts">Jos Produkta</button>
            </div>
            <div class="col-6">
              <button class="btn btn-primary btn-lg btn-block" v-on:click.prevent="toCheckout">Naplati</button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <modal v-if="show" @closeModal="show = false"></modal>
  </div>
</template>
<script>
import myDatepicker from '@/components/helpers/Datepicker.custom.vue'
import FlightTicket from '@/models/FlightTicket.js'
import Suggestion from '@/components/helpers/Suggestion'
import PassangerModal from '@/components/helpers/PassangerModal'
import VueNumeric from '@/components/helpers/Numeric.custom'
import Api from '@/services/api.js'
import moment from 'moment'
import router from '@/router'

export default{
  name: 'FlightTicket',
  components: {
    'date-picker': myDatepicker,
    'suggestion': Suggestion,
    'modal': PassangerModal,
    'vue-numeric': VueNumeric
  },
  data () {
    return {
      ticket: new FlightTicket(),
      passangers: [],
      show: false,
      api: new Api(),
      roundTrip: false,
      destination: '',
      formName: 'flight-ticket-form',
      departureTime: {
        time: ''
      },
      returnTime: {
        time: ''
      },
      option: {
        type: 'min',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'DD/MM/YYYY HH:mm',
        placeholder: 'Date',
        overlayOpacity: 0.3, // 0.5 as default
        dismissible: true // as true as default
      },
      departureDateValidationMessage: 'Datum polaska ne moze biti smesten u proslosti',
      returnDateValidationMessage: 'Datum povratka ne moze biti smesten u proslosti ili pre datuma polaska'
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
    },
    validDepartureTime () {
      var dateOfDeparture = this.formatDateToComparable(this.ticket.datumPolaska)
      var isValid = dateOfDeparture < new Date()
      return isValid
    },
    validReturnTime () {
      var dateOfReturn = this.formatDateToComparable(this.ticket.datumDolaska)
      var dateOfDeparture = this.ticket.datumPolaska !== '' ? this.formatDateToComparable(this.ticket.datumPolaska) : new Date()
      var isValid = dateOfReturn < dateOfDeparture
      return isValid
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
      this.ticket.datumDolaska = event
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
    toMoreProducts () {
      this.validateFlightTicketForm().then(res => {
        if (res) {
          console.log('valid')
        } else {
          console.log('not valid')
        }
      })
    },
    toCheckout () {
      this.validateFlightTicketForm().then(res => {
        if (res) {
          var flightTickets = this.ticketIds.map(el => {
            return new FlightTicket(el.passangerId, this.ticket.putovanjeOd, this.ticket.putovanjeDo, this.roundTrip, this.ticket.datumPolaska, this.ticket.datumDolaska, el.ticketId, this.ticket.avioKompanija, false, this.ticket.cena, new Date())
          })
          console.log(flightTickets)
          this.$store.commit('addFlightTickets', flightTickets)
          this.$store.commit('removeAllPassanger')
          router.push('navigation')
        } else {
          console.log('not valid')
        }
      })
    },
    navigate () {
      router.push('customer')
    },
    formatDateToComparable (date) {
      return new Date(moment(date, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD').toString())
    },
    validateFlightTicketForm () {
      return this.$validator.validateAll(this.formName)
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
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
  margin-bottom:0;
}

.switch input {display:none;}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 17px;
  width: 17px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #41b882;
}

input:focus + .slider {
  box-shadow: 0 0 1px #41b882;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.custom-label {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  display: inline;
  left: 5px;
  position: relative;
  bottom: .4em;
}
</style>
