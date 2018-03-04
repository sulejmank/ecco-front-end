<template>
  <div class="container">
    <div class="row">
      <div class="col-2 text-center">
        <img class="img-thumbnail margin-y" src="@/assets/logo.png" alt="">
        <button class="btn btn-primary text-center" v-on:click.prevent="upload()">Upload Photo</button>
        <input type="file" class="d-none" id="profile-picture">
      </div>
      <form class="form-row col-10" @submit.prevent="validateForm('customer-form')" data-vv-scope="customer-form"  autocomplete='off'>
        <input-suggestion @modelSuggested="updateCustomer" :classes="'form-group col-6'" :label="'Ime'" :name="'name'" :formName="'customer-form'" :placeholder="'Ime Musterije'" :value="customer.name"></input-suggestion>
        <div class="form-group col-6">
          <label for="surname">Prezime</label>
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.surname')}" id="surname" name="surname" placeholder="Prezime Musterije" v-model="customer.surname" v-validate="'required|alpha_spaces'">
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
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.passport')}" id="passportNumber" name="passport" placeholder="Broj Pasosa Musterije" v-model="customer.passportNumber" v-validate="'required|alpha_num'">
          <span v-show="errors.has('customer-form.passport')" class="form-text text-danger error-msg">{{ errors.first('customer-form.passport') }}</span>
        </div>
        <div class="form-group col-6">
          <label for="phoneNumber">Kontakt Telefon</label>
          <input type="text" v-bind:class="{'form-control': true, 'is-invalid': errors.has('customer-form.phone')}" id="phoneNumber" name="phone" placeholder="Kontakt Telefon" v-model="customer.phoneNumber" v-validate="{required:true, regex:/^[0-9+-]{6,30}$/}">
          <span v-show="errors.has('customer-form.phone')" class="form-text text-danger error-msg">{{ errors.first('customer-form.phone') }}</span>
        </div>
        <div class="form-group col-6">
          <label for="dateOfBirth">Datum Rodjenja</label>
           <date-picker :date='startTime' @change="update" :option="option"></date-picker>
          <small id="passportHelp" class="form-text text-muted d-none error-msg">This is error message</small>
        </div>
        <div class="form-group col-6">
          <button class="btn btn-primary" v-on:click.prevent="print()">Print</button>
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

export default{
  name: 'customer',
  data () {
    return {
      api: new Api(),
      focusedItem: 0,
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
    }
  },
  components: {
    'date-picker': myDatepicker,
    'input-suggestion': Suggestion
  },
  methods: {
    updateCustomer (customer) {
      this.customer = customer
    },
    print () {
      this.$validator.validateAll('customer-form')
        .then((res) => {
          if (res) {
            console.log(this.customer)
          }
          console.log(res)
        })
    },
    upload () {
      document.getElementById('profile-picture').click()
    },
    update (event) {
      this.customer.dateOfBirth = event
    },
    validateForm (form) {
      this.$validator.validateAll(form)
        .then(result => {
          console.log(result)
        })
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
.customer{
  padding:6px 0;
  margin:0;
}
.size{
  width:30%;
}
.focused{
  background-color:#e9ecef;
}
.error-msg{
  font-size:.7em;
}
</style>
