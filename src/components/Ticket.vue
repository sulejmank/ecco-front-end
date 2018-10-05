<template>
  <v-card-text>
    <v-form v-model="valid" ref="ticketForm">
      <v-layout row wrap>
        <v-flex xs12>
          <v-switch
            :label="`Putovanje u ${ roundTrip ? 'oba pravca ' : 'jednom pravcu'}`"
            v-model="roundTrip"
          ></v-switch>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex sm12 md5 >
          <v-menu v-model="isLoading" transition="slide-y-transition" full-width bottom offset-y class="elevation-0">
            <v-text-field
              v-model="search"
              slot="activator"
              :rules="departureRules"
              label="Putovanje Od"
              prepend-icon="place"
              required
            ></v-text-field>
            <v-list transition="slide-y-transition" v-if="destinationSuggestions">
              <v-list-tile v-for="suggestion in destinationSuggestions" :key="suggestion.id" @click="setDepartureSuggestion(suggestion)"  v-show="destinationSuggestions.length > 0">
                <v-list-tile-avatar
                  color="indigo"
                  class="headline font-weight-light white--text"
                >
                  {{ suggestion.description.charAt(0) }}
                </v-list-tile-avatar>
                <v-list-tile-title>{{convert(suggestion.description)}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>

        </v-flex>
        <v-flex sm12 md5 offset-sm1>
          <v-menu v-model="isLoadingArr" transition="slide-y-transition" full-width bottom offset-y class="elevation-0">
            <v-text-field
              v-model="searchArr"
              slot="activator"
              :rules="arrivalRules"
              prepend-icon="place"
              label="Putovanje Do"
              required
            ></v-text-field>
            <v-list transition="slide-y-transition" v-if="arrivalSuggestions">
              <v-list-tile v-for="suggestion in arrivalSuggestions" :key="suggestion.id" @click="setArrivalSuggestion(suggestion)"  v-show="arrivalSuggestions.length > 0">
                <v-list-tile-avatar
                  color="indigo"
                  class="headline font-weight-light white--text"
                >
                  {{ convert(suggestion.description.charAt(0)) }}
                </v-list-tile-avatar>
                <v-list-tile-title>{{convert(suggestion.description)}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex sm12 md5>
          <v-text-field
              v-model="departureDate"
              prepend-icon="event"
              label="Datum Polaska"
              :rules="departureDateRules"
              @blur="ticket.datumPolaska = parseDate(departureDate)"
              mask="##.##.####"
              required
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md5 offset-sm1 v-if="roundTrip">
          <v-text-field
              v-model="arrivalDate"
              prepend-icon="event"
              label="Datum Povratka"
              :rules="roundTrip ? arrivalDateRules : null"
               @blur="ticket.datumDolaska = parseDate(arrivalDate)"
              mask="##.##.####"
              required
          ></v-text-field>
        </v-flex>
        </v-layout>
      <v-layout row wrap>
        <v-flex sm12 md5>
          <v-menu v-model="isLoadingComp" transition="slide-y-transition" full-width bottom offset-y class="elevation-0">
            <v-text-field
              v-model="searchComp"
              slot="activator"
              :label="ticket.type === 'bus' ? 'Kompanija' : 'Avio Kompanija'"
              @focus="lock = true"
              @blur="lock = false"
              required
            ></v-text-field>
            <v-list transition="slide-y-transition" v-if="companiesSuggestions">
              <v-list-tile v-for="suggestion in companiesSuggestions" :key="suggestion.id" @click="setCompanySuggestion(suggestion)"  v-show="companiesSuggestions.length > 0">
                <v-list-tile-avatar
                  color="indigo"
                  class="headline font-weight-light white--text"
                >
                  {{ suggestion.name.charAt(0) }}
                </v-list-tile-avatar>
                <v-list-tile-title>{{suggestion.name}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
        <v-flex sm12 md5 offset-sm1>
            <v-btn slot="activator" @click.prevent="showDialog = !showDialog"
              center
              block
            >
              <v-icon>person_add</v-icon>
              DODAJ SAPUTNIKA
            </v-btn>
          <v-dialog v-model="showDialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Dodaj Saputnika</span>
              </v-card-title>
              <v-card-text>
                <customer :customer="passanger" :isPassenger="true" ref="passanger"></customer>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native.prevent="showDialog = false">Obustavi</v-btn>
                <v-btn color="blue darken-1" flat @click.native.prevent="addPassanger">Sacuvaj</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-card mt-1 v-if="this.passangers.length > 0">
            <v-list two-line>
              <v-subheader>
                Saputnici
              </v-subheader>
              <template v-for="(passanger, index) in passangers">

                <v-divider :key="index + '-divider'"></v-divider>

                <v-list-tile @click="() => {}" :key="index">
                  <v-list-tile-avatar
                    color="indigo"
                    class="headline font-weight-light white--text"
                  >
                    {{ passanger.ime.charAt(0) }}
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title><strong>{{passanger.prezime + ", " + passanger.ime}}</strong></v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-text-field
                        v-model="passanger.brojRezervacije"
                        label="Broj rezervacije"
                        :rules="brojRezervacijeRules"
                      ></v-text-field>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action >
                    <div justify-center layout px-0>
                      <!-- <v-btn icon px-2 @click="editPassanger(passanger, index)">
                        <v-icon color="grey lighten-1">edit</v-icon>
                      </v-btn> -->
                      <v-btn icon @click="$emit('removePassanger', index)">
                        <v-icon color="grey lighten-1">delete</v-icon>
                      </v-btn>
                    </div>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-form>
  </v-card-text>
</template>
<script>
import CustomerComponent from '@/components/Customer'
import Destination from '@/models/Destination.js'
import Customer from '@/models/Customer.js'
import Api from '@/services/api.js'
import moment from 'moment'
import convert from 'cyrillic-to-latin'
// import FlightTicket from '@/models/FlightTicket.js'
// import router from '@/router'

export default{
  name: 'Ticket',
  components: {
    'customer': CustomerComponent
  },
  props: {
    ticket: {
      default: undefined,
      type: Object
    },
    passangers: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      lock: false,
      convert: convert,
      departureRules: [
        v => !!v || 'Mesto polaska je obavezan podatak',
        v => !!this.ticket.putovanjeOd || 'Mesto polaska je obavezan podatak',
        v => !!this.ticket.putovanjeOdObj || 'Morate odabrati jedan od ponudjenih opcija'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      arrivalRules: [
        v => !!v || 'Destinacija je obavezan podatak',
        v => !!this.ticket.putovanjeDo || 'Mesto polaska je obavezan podatak',
        v => !!this.ticket.putovanjeDoObj || 'Morate odabrati jedan od ponudjenih opcija'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      departureDateRules: [
        v => !!this.ticket.datumPolaska || 'Datum polaska je obavezan podatak',
        v => moment(v, 'DD.MM.YYYY').isValid() || 'Datum polaska nije validan, koristite format dan.mesec.godina'
        // v => new Date(moment(v, 'DD.MM.YYYY')) > new Date() || 'Datum polaska se ne nalazi u buducnosti'
      ],
      arrivalDateRules: [
        v => !!this.ticket.datumDolaska || 'Datum povratka je obavezan podatak',
        v => moment(v, 'DD.MM.YYYY').isValid() || 'Datum povratka nije validan, koristite format dan.mesec.godina'
        // v => new Date(moment(v, 'DD.MM.YYYY')) > new Date() || 'Datum povratka se ne nalazi u buducnosti'
      ],
      brojRezervacijeRules: [
        v => !!v || 'Broj rezervacije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      destinationSuggestions: [],
      arrivalSuggestions: [],
      companiesSuggestions: [],
      isLoading: false,
      isLoadingArr: false,
      isLoadingComp: false,
      search: null,
      searchArr: null,
      searchComp: null,
      passanger: new Customer(),
      showDialog: false,
      showSuggestions: false,
      showPlacesSuggestions: false,
      valid: false,
      departureDate: null,
      arrivalDate: null,
      show: false,
      api: new Api(),
      roundTrip: false,
      destination: ''
    }
  },
  computed: {
    ticketValid () {
      return this.$refs.ticketForm.validate()
    },
    departureDateModel () {
      return this.ticket.datumPolaska
    },
    arrivalDateModel () {
      return this.ticket.datumDolaska
    }
  },
  methods: {
    setDepartureSuggestion (suggestion) {
      let toLatin = this.convert(suggestion.description)
      this.search = toLatin
      this.ticket.putovanjeOd = toLatin
      this.ticket.putovanjeOdObj = new Destination(toLatin, suggestion.id)
    },
    setArrivalSuggestion (suggestion) {
      let toLatin = this.convert(suggestion.description)
      this.searchArr = toLatin
      this.ticket.putovanjeDo = toLatin
      this.ticket.putovanjeDoObj = new Destination(toLatin, suggestion.id)
    },
    setCompanySuggestion (suggestion) {
      this.lock = false
      this.searchComp = suggestion.name
      this.ticket.avioKompanija = suggestion.name
      this.ticket.avioKompanijaObj = suggestion
    },
    addPassanger () {
      // TODO: Check if it can just return is validated Customer
      let passanger = this.$refs.passanger.addPassanger()
      if (passanger !== false) {
        this.passangers.push(passanger)
        this.passanger = new Customer()
        this.showDialog = false
      }
    },
    parseDate (date) {
      if (!date) return null
      return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
    },
    addCustomer (event) {
      this.passangers.push(event)
    }
  },
  watch: {
    // TODO: Refine Autocomplete
    search (val = 'a', newVal) {
      if (val != null && val.length < 10) {
        var self = this
        this.isLoading = true
        this.ticket.putovanjeOdObj = null
        this.api.getPlaceSuggestion(val)
          .then(res => {
            self.destinationSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    searchArr (val = 'a', newVal) {
      if (val != null && val.length < 10) {
        var self = this
        this.isLoadingArr = true
        this.ticket.putovanjeDoObj = null
        this.api.getPlaceSuggestion(val)
          .then(res => {
            self.arrivalSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    searchComp (val = 'a', newVal) {
      if (val != null && val.length < 10 && this.lock) {
        var self = this
        this.isLoadingComp = true
        this.ticket.avioKompanijaObj = null
        this.api.getCompanySuggestion(val)
          .then(res => {
            self.companiesSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    departureDateModel (val) {
      this.departureDate = moment(val, moment.ISO_8601).format('DD.MM.YYYY').toString()
    },
    arrivalDateModel (val) {
      this.arrivalDate = moment(val, moment.ISO_8601).format('DD.MM.YYYY').toString()
    }
  },
  mounted () {
  }
}
</script>
<style>

</style>
