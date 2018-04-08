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
    <router-link class="col-2 text-center product" to="customer">
          <i class="fas fa-address-card"></i>
      </router-link>
      <router-link class="col-2 text-center product"  to="customer">
          <i class="fas fa-exchange-alt"></i>
      </router-link>
    </div>
        <hr class="custom-hr">
        <br>
 
  <div class="row" style="margin-top: 2%;">
    <div class="col-12">
      <div>
          <h2>Klijent: </h2> 
          <div v-if="klijent.id == undefined">
            <button class="btn btn-default"  v-on:click.prevent="addKlijent" type="button"><i class="fas fa-plus-circle"></i>Dodaj Klijenta</button><br>            <hr class="custom-hr">
          </div>
          <h2>Produkti:  </h2>
            <button class="btn btn-default"  v-on:click.prevent="" type="button"><i class="fas fa-plus-circle"></i>Dodaj Produkt</button><br>            <hr class="custom-hr">
        </div>
      </div>
    </div>
    <div class="col-7">
      <div class="form-group">
        <h3>Ukupno:<span class="" style="float:right;font-size:2em">{{sumedPrice}}</span></h3>
        <div class="clearfix"></div>
      </div>
      <div class="form-group text-center">
        <b-button-group>
          <b-button @click="setPaymentMethod('epayment')">Elektronsko Placanje</b-button>
          <b-button @click="setPaymentMethod('cache')">Gotovina</b-button>
          <b-button @click="setPaymentMethod('installments')">U ratama</b-button>
        </b-button-group>
      </div>
      <div class="form-group" v-if="paymentMethod == 'epayment'">
        <p>Elektronsko</p>
      </div>
      <div class="form-group" v-if="paymentMethod == 'cache'">
        <p>Rate</p>
      </div>
      <div class="form-group" v-if="paymentMethod == 'installments'">
        <div class="form-group col-12 bottom-margin extra-padding">
          <p class="bottom-margin">
            <label class="switch">
              <input type="checkbox" v-model="avans" name="round-trip" id="round-trip">
              <span class="slider round"></span>
            </label>
            <label for="round-trip" class="custom-label">Avans</label>
          </p>
        </div>
        <!-- <div class="form-group col-12 row">
          <label for="" class="col-6 text-center">Cena NETO</label>
          <div class="col-6">
            <input type="number" class="form-control text-center" name="avans-amount" >
            <span v-show="errors.has(formName + '.price')" id="nameHelp" class="form-text text-danger error-msg">{{ errors.first(formName + '.price-neto') }}</span>
          </div>
        </div> -->
        <div class="form-group col-12" style="min-height:40px" >
          <vue-numeric v-show="avans" :currency="'€'" :separator="'.'" :classes="'form-control text-center'" v-model="avansAmount" :decimal-separator="','" :precision="2"></vue-numeric>
          <span v-show="avans" id="nameHelp" class="form-text text-danger error-msg"></span> <!-- v-show="errors.has('customer-form.surname')"  {{ errors.first('customer-form.surname') }}-->
        </div>
        <hr class="custom-hr">
      </div>
      <div class="row" v-for="(installment, index) in installments" :key="installment.id">
        <div class="form-group col-6">
          <label for="returnDate">Rok uplacivanja rate</label>
          <date-picker :date='installment.rokUplate'  :option="option"></date-picker> <!-- :hasErrors="validReturnTime" @change="updateReturnTime" -->
          <span class="form-text text-danger error-msg" ></span> <!-- v-show="validReturnTime"-->
        </div>
        <div class="form-group col-6">
          <label for="flight-company">Iznos</label>
          <vue-numeric :currency="'€'" :separator="'.'" :classes="'form-control text-center'" v-model="installment.iznos" :decimal-separator="','" :precision="2"></vue-numeric>
          <span class="form-text text-danger error-msg" ></span> <!--v-show="errors.has(formName + '.flight-company')" -->
          <i class="far fa-times-circle close-awsome absolute-icon" v-on:click="removeInstallment(index)"></i>
        </div>
      </div>
      <hr class="custom-hr" v-if="paymentMethod == 'installments'">
      <div class="row" v-if="paymentMethod == 'installments'">
        <div class="col-12">
          <button class="btn btn-default btn-lg btn-block" v-on:click="addMoreInstallments">Dodaj Ratu</button>
          <br>
           <hr class="custom-hr">
          <button class="btn btn-default btn-lg btn-block" v-on:click="">Zavrsi kupovinu</button>
          <br>
          <hr class="custom-hr">
        </div>
       
      </div>
    </div>
      <modal v-if="show" @closeModal="show = false"></modal>
  </div>
</template>
<script>
import bButtonGroup from 'bootstrap-vue/es/components/button-group/button-group';
import myDatepicker from '@/components/helpers/Datepicker.custom.vue'
import VueNumeric from '@/components/helpers/Numeric.custom'
import Installment from '@/models/Installment'
import Api from '@/services/api.js'
import Customer from '@/models/Customer'
import PassangerModal from '@/components/helpers/PassangerModal'


export default{
  name: 'Checkout',
  components: {
    'b-button-group': bButtonGroup,
    'vue-numeric': VueNumeric,
    'date-picker': myDatepicker,
    'modal': PassangerModal
  },
  computed: {
    flightTickets () {
      return this.$store.getters.getFlightTickets
    },
    sumedPrice () {
      return this.$store.getters.getFlightTickets.reduce((sum, el) => sum += el.cena, 0)
    }
  },
  data () {
    return {
      paymentMethod: '',
      avans: false,
      avansAmount: 0,
      show: false,
      kupovine: [],
      api: new Api(),
      klijent: new Customer(),
      returnTime: {
        time: ''
      },
      option: {
        type: 'day',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'DD/MM/YYYY',
        placeholder: 'Date',
        overlayOpacity: 0.3, // 0.5 as default
        dismissible: true // as true as default
      },
      installments: []
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
    },
    setPaymentMethod (method) {
      this.paymentMethod = method
    },
    addKlijent () {
      this.show = true;
    },
    updateReturnTime () {
      console.log('It\'s OK bro.. ')
    },
    addMoreInstallments () {
      this.installments.push(new Installment())
    },
    removeInstallment (i) {
      this.installments = this.installments.filter((el, index) => index != i)
    },
    checkout () {
      console.log(this.installments)
    }
  }
}
</script>
<style>
.colored {
  background-color:#ddd;
  padding: 1%;
}
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

.absolute-icon {
  position: absolute;
    right: -1em;
    top: 2em;
}
.prod {
  font-size: 1.2em;
}
.close-awsome{
  margin-top: .2em;
  padding:5px;
}
.close-awsome:hover {
  background-color:#ddd;
  border-radius: 15px;
  cursor: pointer;
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
.products-row {
  margin: 20px 0%;
  border: 1px solid #ddd;
}


</style>
