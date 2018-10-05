<template>
  <v-card-text>
    <v-form v-model="valid" ref="customerForm">

      <v-layout row wrap>
        <v-flex sm12 md5 style="position: relative !important">
          <v-menu v-model="showMenu" transition="slide-y-transition" full-width bottom offset-y class="elevation-0" >
              <v-text-field
                v-model="customer.ime"
                :rules="nameRules"
                slot="activator"
                label="Ime"
                @focus="lock = true"
                @blur="lock = false"
                :clear-icon-cb="emitNewInstance"
                :clearable="!isPassenger"
                :readonly="customer.id != null"
                :hint="!isPassenger && customer.id != null ? 'Da bi ste izmenili podatke kupca posetite Musterije Sekciju, u ovoj sekciji mozete samo promeniti musteriju ili staviti novu' : ''"
                required
              ></v-text-field>

            <v-list transition="slide-y-transition" v-if="customerSuggestions">
              <v-list-tile v-for="suggestion in customerSuggestions" :key="suggestion.id" @click="setSuggestion(suggestion)"  v-show="customerSuggestions.length > 0">
                <v-list-tile-avatar
                  color="indigo"
                  class="headline font-weight-light white--text"
                >
                  {{ suggestion.ime.charAt(0) }}
                </v-list-tile-avatar>
                <v-list-tile-title>{{suggestion.prezime + ', ' + suggestion.ime}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>

        <v-flex sm12 md5 offset-md1>
          <v-text-field
            v-model="customer.prezime"
            :rules="surnameRules"
            label="Prezime"
            :clear-icon-cb="emitNewInstance"
            :clearable="!isPassenger"
            :readonly="customer.id != null"
            :hint="!isPassenger ? 'Da bi ste izmenili podatke kupca posetite Musterije Sekciju, u ovoj sekciji mozete samo promeniti musteriju ili staviti novu' : ''"            required
          ></v-text-field>
        </v-flex>

      </v-layout>

      <v-layout row wrap>
        <v-flex sm12 md5>
          <v-text-field
            v-model="customer.brojTelefona"
            label="Kontakt Telefon"
            v-show="showDetails"
            transition="slide-y-transition"
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md5 offset-md1>
          <v-text-field
            v-model="customer.email"
            label="E-Mail"
            v-show="showDetails"
            transition="slide-y-transition"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex sm12 md5>
          <v-text-field
              v-model="birthDate"
              prepend-icon="event"
              label="Datum Rodjenja"
              v-show="showDetails"
              :rules="showDetails & birthDate !== null ? birthDateRules : []"
              @blur="customer.datumRodjenja = parseDate(birthDate)"
              mask="##.##.####"
          ></v-text-field>
          </v-flex>
        <v-flex sm12 md5 offset-md1>
          <v-text-field
            v-model="customer.struka"
            label="Struka"
            v-show="showDetails"
            transition="slide-y-transition"
          ></v-text-field>
        </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex sm12 md5>
            <v-text-field
              v-model="customer.brojPasosa"
              label="Broj Pasosa"
              v-show="showDetails"
              transition="slide-y-transition"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-card-actions >
            <v-btn @click="showDetails = !showDetails"
              flat
              right
            >
              {{ showDetails ? 'SAKRIJI DETALJE' : 'PRIKAZI DETALJE'}}
              <v-icon>{{ showDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-layout>
    </v-form>
  </v-card-text>
</template>

<script>
// import Customer from '@/models/Customer.js'
// import router from '@/router'
import Api from '@/services/api.js'
import toast from '@/services/toast'
import moment from 'moment'

export default {
  name: 'customer',

  props: {
    customer: {
      type: Object
    },
    isPassenger: {
      type: Boolean,
      default: false
    },
    id: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      toolTip: false,
      lock: false,
      showDetails: false,
      showMenu: false,
      menu: false,
      valid: false,
      loading: false,
      ime: '',
      // TODO: Move Rules to separate JS Class
      nameRules: [
        v => !!v || 'Ime Musterije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      surnameRules: [
        v => !!v || 'Prezime Musterije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      birthDateRules: [
        v => moment(v, 'DD.MM.YYYY').isValid() || 'Datum rodjenja nije validan, koristite format dan.mesec.godina',
        v => new Date(moment(v, 'DD.MM.YYYY')) < new Date() || 'Datum rodjenja se ne nalazi u proslosti'
      ],
      moreDetails: false,
      api: new Api(),
      urlslike: '',
      customerSuggestions: [],
      birthDate: null
    }
  },
  computed: {
    customerValid () {
      return this.$refs.customerForm.validate()
    },
    birthDateModel () {
      return this.customer.datumRodjenja
    },
    customerSearch () {
      return this.customer.ime === null ? '' : this.customer.ime
    }
  },
  methods: {
    emitNewInstance () {
      this.$emit('newCustomer')
    },
    addPassanger () {
      // TODO: Check if it can just return is validated Customer
      if (this.customerValid) {
        return this.customer
      } else {
        toast.error('Podatci o Putniku nisu potpuni ili su pogresni')
        return false
      }
    },
    async saveCustomer () {
      if (this.customerValid) {
        let response = await this.api.saveCustomer(this.customer)
        return response.data !== null
      } else {
        toast.error('Podatci o Musteriju nisu potpuni ili su pogresni')
      }
    },
    parseDate (date) {
      if (!date) return null
      return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
    },
    setSuggestion (customer) {
      Object.assign(this.customer, customer)
      this.showMenu = false
    },
    upload () {
      document.getElementById('profile-picture').click()
    },
    uploadingPic ($event) {
      this.api.uploadPhoto($event).then(res => {
        console.log(res.data.urlSlike)
        document.getElementById('slika').src = res.data.urlSlike
      }).catch(err => {
        console.log(err)
      })

      console.log($event.target.value)
      console.log('uploading')
    }
  },
  watch: {
    birthDateModel (val) {
      this.birthDate = moment(val, moment.ISO_8601).format('DD.MM.YYYY').toString()
    },
    customerSearch (val = '') {
      if (val !== '' && val.length < 10 && this.lock) {
        var self = this
        this.showMenu = true
        if (this.isPassenger) {
          this.api.getSuggestedPassanger(val)
            .then(res => {
              self.customerSuggestions = res.data
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.api.getSuggestedCustomers(val)
            .then(res => {
              self.customerSuggestions = res.data
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    }
  },
  mounted () {

  }
}
</script>

<style>
.menuable__content__active{
  min-width: 0 !important;
}
</style>
