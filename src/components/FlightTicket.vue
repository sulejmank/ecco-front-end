<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h2>Flight Tickets</h2>
      </div>
      <div class="col colored">
        <div class="customer row">
          <div class="col-2 align-self-center">
            <h4>
              <strong>Musterija:</strong>
            </h4>
          </div>
          <div class="col row">
            <img src="@/assets/logo.png" class="img-thumbnail sized" alt="">
            <div class="col-10">
              <p class="bottom-margin">
                Name:<strong>Zenovic, Haris</strong>
              </p>
              <p class="bottom-margin">
                Email:<strong>zenovicharis@gmail.com</strong>
              </p>
              <p class="bottom-margin">
                Passport:<strong>011123230494</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <form class="form-row col-12"> <!-- @submit.prevent="validateForm('customer-form')" data-vv-scope="customer-form"  autocomplete='off' -->
        <div class="form-group col-12 bottom-margin extra-padding">
          <p class="bottom-margin">
            <input type="checkbox" v-model="roundTrip" id="round-trip">
            <label for="round-trip">Avio Karta u <strong>Oba Smera</strong></label>
          </p>
        </div>
        <div class="form-group col-6">
          <label for="departurePlace">Mesto polazka</label>
          <input type="text" id="departurePlace" name="departurePlace" class="form-control" placeholder="Mesto polazka">
          <span class="form-text text-danger error-msg">This is error message</span>
        </div>
        <div class="form-group col-6">
          <label for="destination">Destinacija</label>
          <input type="text" id="destination" class="form-control" name="destination" placeholder="Destinacija">
          <span class="form-text text-danger error-msg">This is error message</span>
        </div>
        <div class="form-group col-6">
          <label for="departureDate">Polazak</label>
          <date-picker :date='departureTime' @change="update" :option="option"></date-picker>
          <!-- <input type="text" id="departureDate" name="departureDate" class="form-control" placeholder="Vreme polazka"> -->
          <span class="form-text text-danger error-msg">This is error message</span>
        </div>
        <div class="form-group col-6">
          <label for="returnDate" v-show="roundTrip">Povratak</label>
          <date-picker :date='returnTime' @change="update" :option="option" v-show="roundTrip"></date-picker>
          <span class="form-text text-danger error-msg" v-show="roundTrip">This is error message</span>
        </div>
        <div class="form-group col-6">
          <label for="flight-company">Avio Kompanija</label>
          <input type="text" id="flight-company" class="form-control" name="flight-company" placeholder="Ime Kompanije">
          <span class="form-text text-danger error-msg">This is error message</span>
        </div>
        <hr class="col-12 horizontal" />
        <div class="form-group col-12 row bottom-margin">
          
          <div  class="col-4 text-center">
            <button class="btn btn-default"><i class="fas fa-plus-circle"></i>Dodaj Putnika</button>
          </div>
          <div class="input-group col-4">
            <select class="custom-select" id="inputGroupSelect01">
              <option selected>Choose...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <input type="text" class="form-control col-4" name="price-bruto" placeholder="Sifra Karte">
        </div>
        <hr class="col-12 horizontal" />
        <div class="form-group col-12 row">
          <label for="" class="col-6 text-center">Cena BRUTO</label>
          <input type="text" class="form-control col-6" name="price-bruto">
        </div>
        <div class="form-group col-12 row">
          <label for="" class="col-6 text-center">Cena NETO</label>
          <input type="text" class="form-control col-6" name="price-neto">
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
import moment from 'moment'

export default{
  name: 'FlightTicket',
  components: {
    'date-picker': myDatepicker
  },
  data () {
    return {
      roundTrip: false,
      departureTime: {
        time: moment().format('DD/MM/YYYY hh:mm')
      },
      returnTime: {
        time: moment().format('DD/MM/YYYY hh:mm')
      },
      option: {
        type: 'day',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'DD/MM/YYYY hh:mm',
        placeholder: 'Date of Birthday',
        overlayOpacity: 0.3, // 0.5 as default
        dismissible: true // as true as default
      }
    }
  },
  methods: {
    update () {
      console.log(' It\'s all good, broo ')
    }
  }
}
</script>
<style>
.colored {
  background-color:#ddd;
}
.sized {
  height:5em;
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
</style>
