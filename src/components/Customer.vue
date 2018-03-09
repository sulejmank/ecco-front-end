<template>
  <div class="container">
    <div class="row">
      <div class="col-2 text-center" v-if="!isPassenger">
        <img class="img-thumbnail margin-y" src="@/assets/logo.png" alt="">
        <button class="btn btn-primary text-center" v-on:click.prevent="upload()">Upload Photo</button>
        <input type="file" class="d-none" id="profile-picture" v-on:change="uploadingPic($event)">
      </div>
      <form :class="{'form-row': true, 'col-10': !isPassenger, 'col-12': isPassenger }" @submit.prevent="validateForm('customer-form')" data-vv-scope="customer-form"  autocomplete='off'>
        <input-suggestion @modelSuggested="updateCustomer" @escapeSuggestion="setNewCustomer" :method="api.getSuggestedCustomers" @updateModel="updateName" :classes="'form-group col-6'" :label="'Ime'" :name="'name'" :formName="'customer-form'" :placeholder="'Ime Musterije'" :value="customer.ime"></input-suggestion>
        <div class="form-group col-6">
          <label for="surname">Prezime</label>
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.surname')}" id="surname" name="surname" placeholder="Prezime Musterije" v-model="customer.prezime" v-validate="'required|alpha_spaces'">
          <span v-show="errors.has('customer-form.surname')" id="nameHelp" class="form-text text-danger error-msg">{{ errors.first('customer-form.surname') }}</span>
        </div>
        <div class="form-group col-6 ">
          <label for="email">Email</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="email">@</span>
            </div>
            <input type="email" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.email')}" id="email" name="email" placeholder="Email Musterije" v-model="customer.email" v-validate="'required|email'">
          </div>
          <span v-show="errors.has('customer-form.email')" class="form-text text-danger error-msg">{{ errors.first('customer-form.email') }}</span>
        </div>
        <div class="form-group col-6">
          <label for="passportNumber">Broj Pasosa</label>
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.passport')}" id="passportNumber" name="passport" placeholder="Broj Pasosa Musterije" v-model="customer.brojPasosa" v-validate="'required|alpha_num'">
          <span v-show="errors.has('customer-form.passport')" class="form-text text-danger error-msg">{{ errors.first('customer-form.passport') }}</span>
        </div>
        <div class="form-group col-6">
          <label for="phoneNumber">Kontakt Telefon</label>
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.phone')}" id="phoneNumber" name="phone" placeholder="Kontakt Telefon" v-model="customer.brojTelefona" v-validate="{required:true, regex:/^[0-9+-]{6,30}$/}">
          <span v-show="errors.has('customer-form.phone')" class="form-text text-danger error-msg">{{ errors.first('customer-form.phone') }}</span>
        </div>
        <div class="form-group col-6">
          <label for="occupation">Struka</label>
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.occupation')}" id="occupation" name="occupation" placeholder="Zanimanje" v-model="customer.struka" v-validate="'required'">
          <span v-show="errors.has('customer-form.occupation')" class="form-text text-danger error-msg">{{ errors.first('customer-form.occupation') }}</span>
        </div>
        <div class="form-group col-6">
          <label for="address">Adresa</label>
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.address')}" id="address" name="address" placeholder="Adresa" v-model="customer.adresa" v-validate="'required'">
          <span v-show="errors.has('customer-form.address')" class="form-text text-danger error-msg">{{ errors.first('customer-form.address') }}</span>
        </div>
        <div class="form-group col-6">
          <label for="dateOfBirth">Datum Rodjenja</label>
           <date-picker :date='startTime' @change="update" :option="option"></date-picker>
          <small id="passportHelp" class="form-text text-muted d-none error-msg">This is error message</small>
        </div>
        <div class="form-group col-12 text-right">
          <button class="btn btn-primary" v-on:click.prevent="addCustomer" v-if="!isPassenger">Dodaj Musteriju</button>
          <button class="btn btn-primary" v-on:click.prevent="addPassenger" v-if="isPassenger">Dodaj Putnika</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Customer from '@/models/Customer.js'
import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
import Api from '@/services/api.js'
import Suggestion from '@/components/helpers/Suggestion'
// import myDatepicker from '@/components/helpers/Datepicker.custom.vue' // custom Datepicker refined one
import moment from 'moment'
import router from '@/router'

export default{
  name: 'customer',
  props: {
    isPassenger: {
      type: Boolean
    }
  },
  data () {
    return {
      api: new Api(),
      focusedItem: 0,
      formName: 'customer-form',
      customer: new Customer(),
      startTime: {
        time: moment().format('DD/MM/YYYY')
      },
      option: {
        type: 'day',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'DD/MM/YYYY',
        placeholder: 'Date of Birthday',
        overlayOpacity: 0.3, // 0.5 as default
        dismissible: true // as true as default
      },
      mockSuggestions: [],
      status: 'unavailable',
      timer: undefined,
      ajaxTimer: undefined
    }
  },
  computed: {
    name () {
      return this.customer.name
    },
    isNewCustomer () {
      var id = this.isPassenger === true ? this.$store.getters.getCurentPassengerId : this.$store.getters.getCustomerId
      return id === undefined
    }
  },
  components: {
    'date-picker': myDatepicker,
    'input-suggestion': Suggestion
  },
  methods: {
    updateCustomer (suggestedCustomer) {
      this.customer = suggestedCustomer
      if (this.isPassenger) {
        this.$store.commit('setCurrentPassenger', this.customer)
      } else {
        this.$store.commit('setCustomer', this.customer)
      }
    },
    addPassenger () {
      this.validateCustomerForm()
        .then((res) => {
          if (res) {
            if (this.isNewCustomer) {
              this.custmer.putnik = true
              this.api.saveCustomer(this.customer).then(res => {
                this.$store.commit('setCurrentPassengerId', res.data !== undefined ? res.data.id : undefined)
              })
            }
            this.$store.commit('storePassenger')
            this.$emit('passengerAdded')
          }
        })
    },
    addCustomer () {
      this.validateCustomerForm()
        .then((res) => {
          if (res) {
            if (this.isNewCustomer) {
              this.api.saveCustomer(this.customer).then(res => {
                this.$store.commit('setCustomerId', res.data !== undefined ? res.data.id : undefined)
              })
            }
            router.push('navigation')
          }
        })
    },
    validateCustomerForm () {
      return this.$validator.validateAll(this.formName)
    },
    upload () {
      document.getElementById('profile-picture').click()
    },
    update (event) {
      this.customer.datumRodjenja = moment().format('YYYY-MM-DD', event)
    },
    updateName (title) {
      this.customer.ime = title
    },
    validateForm (form) {
      this.$validator.validateAll(form)
        .then(result => {
          if (result) {
            console.log(result)
          }
        })
    },
    uploadingPic ($event) {
      console.log($event.target.value)
      console.log('uploading')
    },
    setNewCustomer () {
      this.customer = new Customer()
      this.$validator.reset('customer-form')
      this.$store.commit('setCustomer', this.customer)
    }
  },
  watch: {
  }
}
</script>

<style>
.margin-y{
  margin:5px 0;
}
.suggestions{
  width: 98%;
  position: absolute;
  background-color: #fff;
  z-index: 100;
  border: 1px solid #ddd;
  padding: 0 2px;
}
.bottom-margin{
  margin-bottom:0;
}
.size{
  width:30%;
}

.error-msg{
  font-size:.7em;
}
</style>
