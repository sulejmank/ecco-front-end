<template>
  <v-card-text>
    <v-form v-model="valid" ref="arrangmentForm">
      <v-layout row wrap>
        <v-flex sm12 md5 >
          <v-menu v-model="isLoading" transition="slide-y-transition" :nudge-bottom="100" full-width class="elevation-0">
            <v-text-field
              v-model="search"
              :rules="destinationRules"
              label="Destinacija"
              slot="activator"
              prepend-icon="place"
              required
            ></v-text-field>
            <v-list transition="slide-y-transition" v-if="destinationSuggestions">
              <v-list-tile v-for="suggestion in destinationSuggestions" :key="suggestion.id" @click="setDestinationSuggestion(suggestion)"  v-show="destinationSuggestions.length > 0">
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
        <v-flex sm12 md5 offset-sm1>
          <v-menu v-model="isLoadingHotel" transition="slide-y-transition" :nudge-bottom="100" full-width class="elevation-0">
            <v-text-field
              v-model="searchHotel"
              slot="activator"
              label="Hotel"
              :rules="hotelRules"
              @focus="lockHotel = true"
              @blur="lockHotel = false"
              required
            ></v-text-field>
            <v-list transition="slide-y-transition" v-if="hotelSuggestions">
              <v-list-tile v-for="suggestion in hotelSuggestions" :key="suggestion.id" @click="setHotelSuggestion(suggestion)"  v-show="hotelSuggestions.length > 0">
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
        </v-layout>
        <v-layout row wrap>
          <v-flex sm12 md5>
            <v-text-field
                v-model="dateStarting"
                prepend-icon="event"
                label="Datum Pocetka"
                :rules="dateStartingRules"
                @blur="setDateStart(dateStarting)"
                validate-on-blur
                mask="##.##.####"
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md5 offset-sm1 >
            <v-text-field
                v-model="arrangement.brojDana"
                prepend-icon="event"
                type="number"
                @blur="setEndStart(arrangement.brojDana)"
                label="Broj noci"
            ></v-text-field>
          </v-flex>
        </v-layout>
         <v-layout row wrap>
          <v-flex sm12 md5>
            <v-text-field
                v-model="dateEnding"
                prepend-icon="event"
                label="Datum Zavrsetka"
                :rules="dateEndingRules"
                validate-on-blur
                mask="##.##.####"
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md5 offset-sm1 >
             <v-select
                v-model="arrangement.ServiceId"
                :items="servicePicklist"
                item-text="title"
                item-value="id"
                label="Usluga"
                :rules="serviceRules"
              ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex sm12 md5 >
             <v-select
                v-model="arrangement.TypeId"
                :items="arrangmentTypePicklist"
                :rules="arrangmentTypeRules"
                item-text="title"
                item-value="id"
                open-on-click
                label="Tip Aranžmana"
              ></v-select>
          </v-flex>
          <v-flex sm12 md5 offset-sm1>
            <v-menu v-model="isLoadingAgent" transition="slide-y-transition" :nudge-bottom="100" full-width class="elevation-0">
              <v-text-field
                v-model="searchAgent"
                slot="activator"
                label="Agent"
                :rule="agentRules"
                @focus="lock = true"
                @blur="lock = false"
                required
              ></v-text-field>
              <v-list transition="slide-y-transition" v-if="agentsSuggestions">
                <v-list-tile v-for="suggestion in agentsSuggestions" :key="suggestion.id" @click="setAgentSuggestion(suggestion)"  v-show="agentsSuggestions.length > 0">
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
        </v-layout>
        <v-layout row wrap >
          <v-flex sm12 md5 >
            <v-menu v-model="departPlaceLoading" transition="slide-y-transition" :nudge-bottom="100" full-width class="elevation-0" v-if="isRentedArrangment">
              <v-text-field
                v-model="departSearch"
                slot="activator"
                :rules="isRentedArrangment ? departRules : []"
                label="Mesto odlaska"
                prepend-icon="place"
                required
              ></v-text-field>
              <v-list transition="slide-y-transition" v-if="departSuggestions">
                <v-list-tile v-for="suggestion in departSuggestions" :key="suggestion.id" @click="setDepartSuggestion(suggestion)"  v-show="departSuggestions.length > 0">
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
        <v-flex sm12 md5 offset-sm1>
          <v-btn block large slot="activator" @click.prevent="showDialog = !showDialog"
            center
          >
            <v-icon>person_add</v-icon>
            DODAJ SAPUTNIKA
          </v-btn>
        </v-flex>
        <v-dialog v-model="showDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Dodaj Saputnika</span>
            </v-card-title>
            <v-card-text>
              <customer :customer="passanger" :isPassenger="true" ref="passanger" @clearCustomer="passanger = new Customer()"></customer>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native.prevent="showDialog = false">Obustavi</v-btn>
              <v-btn color="blue darken-1" flat @click.native.prevent="addPassanger">Sacuvaj</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
      <v-layout>
        <v-flex sm12 md5 >
          <v-textarea
            solo
            elevation-3
            name="input-7-4"
            label="Opis sobe"
            v-model="arrangement.roomDescription"
          ></v-textarea>
        </v-flex>
        <v-flex sm12 md5 offset-sm1 elevation-4 mt-2 v-if="arrangement.passangers.length > 0">
          <v-card >
            <v-list two-line>
              <v-subheader>
                Saputnici
              </v-subheader>
              <template v-for="(passanger, index) in arrangement.passangers">

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
                  </v-list-tile-content>

                  <v-list-tile-action >
                    <div justify-center layout px-0>
                      <!-- <v-btn icon px-2 @click="editPassanger(passanger, index)">
                        <v-icon color="grey lighten-1">edit</v-icon>
                      </v-btn> -->
                      <v-btn icon @click="removePassanger(index)">
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
import router from '@/router'
import moment from 'moment'
import Api from '@/services/api.js'
import Room from '@/models/Room.js'
import RoomComponent from '@/components/Room'
import CustomerComponent from '@/components/Customer'
import Customer from '@/models/Customer'
import Destination from '@/models/Destination.js'
import convert from 'cyrillic-to-latin'

export default {
  name: 'Arrangement',
  props: {
    arrangement: {
      default: undefined,
      type: Object
    }
  },
  components: {
    'room': RoomComponent,
    'customer': CustomerComponent
  },
  data () {
    return {
      searchHotel: null,
      agentsSuggestions: [],
      hotelSuggestions: [],
      isLoadingHotel: [],
      lockHotel: false,
      isLoadingAgent: false,
      lock: false,
      searchAgent: null,
      passanger: new Customer(),
      convert: convert,
      newRoom: new Room(),
      showDialog: false,
      departSearch: null,
      arrivalSearch: null,
      departPlaceLoading: false,
      arrivalPlaceLoading: false,
      selectService: false,
      selectArrangment: false,
      departRules: [
        v => !!this.arrangement.mestoPolaska || 'Ovo je obavezan podatak',
        v => !!this.arrangement.mestoPolaskaObj || 'Morate odabrati jedan od ponudjenih opcija'
      ],
      arrivalRules: [
        v => !!this.arrangement.mestoPristanista || 'Ovo je obavezan podatak'
      ],
      dateStartingRules: [
        v => !!this.arrangement.datumPocetka || 'Datum pocetka je obavezan podatak',
        v => moment(v, 'DD.MM.YYYY').isValid() || 'Datum pocetka nije validan, koristite format dan.mesec.godina'
        // v => new Date(moment(v, 'DD.MM.YYYY')) > new Date() || 'Datum pocetka se ne nalazi u buducnosti'
      ],
      dateEndingRules: [
        v => !!this.arrangement.datumZavrsetka || 'Datum zavrsetka je obavezan podatak',
        v => moment(v, 'DD.MM.YYYY').isValid() || 'Datum zavrsetka nije validan, koristite format dan.mesec.godina',
        // v => new Date(moment(v, 'DD.MM.YYYY')) > new Date() || 'Datum zavrsetka se ne nalazi u buducnosti'
      ],
      dateStarting: null,
      dateEnding: null,
      api: new Api(),
      destinationRules: [
        v => !!v || 'Destinacija je obavezan podatak',
        v => !!this.arrangement.destinacija || 'Destinacija je obavezan podatak',
        v => !!this.arrangement.destinacijaObj || 'Morate odabrati jedan od ponudjenih opcija'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      hotelRules: [
        v => !!v || 'Hotel je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      agentRules: [
        v => !!v || 'Agent je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      arrangmentTypeRules: [
        v => !!v || 'Tip Aranzmana je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      serviceRules: [
        v => !!v || 'Usluga je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      isLoading: false,
      valid: false,
      search: null,
      destinationSuggestions: [],
      departSuggestions: [],
      arrivalSuggestions: []
    }
  },
  asyncComputed: {
    async servicePicklist () {
      let response = await this.api.getPicklist('service')
      return response.data
    },
    async arrangmentTypePicklist () {
      let response = await this.api.getPicklist('arrangement')
      return response.data
    }
  },
  computed: {
    arrangmentValid () {
      return this.$refs.arrangmentForm.validate()
    },
    isRentedArrangment () {
      let arrType = this.getArrangmentType(this.arrangement.TypeId)
      let arrangmentTypeValue = arrType !== null && arrType !== undefined ? arrType.value : ''
      return arrangmentTypeValue === 'avionski' || arrangmentTypeValue === 'autobuski'
    },
    // isArrangmentTypeBus () {
    //   let arrType = this.getArrangmentType(this.arrangement.TypeId)
    //   let arrangmentTypeValue = arrType !== null && arrType !== undefined ? arrType.value : ''
    //   return arrangmentTypeValue === 'avionski'
    // },
    departDateModel () {
      return this.arrangement.datumPocetka
    },
    arrivalDateModel () {
      return this.arrangement.datumZavrsetka
    }
  },
  methods: {
    getServiceText (id) {
      return this.servicePicklist.find(s => s.id == id).title
    },
    getArrangementText (id) {
      return this.arrangmentTypePicklist.find(s => s.id == id).title
    },
    addPassanger () {
      // TODO: Check if it can just return is validated Customer
      let passanger = this.$refs.passanger.addPassanger()
      if (this.$refs.passanger.customerValid) {
        this.arrangement.passangers.push(this.passanger)
        this.passanger = new Customer()
        this.showDialog = false
      }
    },
    setDateStart (dateStarting) {
      this.arrangement.datumPocetka = this.parseDate(dateStarting)
      if (this.arrangement.brojDana !== null) {
        this.setEndStart(this.arrangement.brojDana)
      }
    },
    setEndStart (numberOfDays) {
      // this.arrangement.datumZavrsetka = this.parseDate(dateEnding)
      // this.setNumberOfDays()
      var date = moment(this.arrangement.datumPocetka, 'YYYY-MM-DD').add(numberOfDays, 'days').format('DD.MM.YYYY')
      this.dateEnding = date
      this.arrangement.datumZavrsetka = this.parseDate(date)

    },
    removeRoom (i) {
      this.arrangement.rooms = this.arrangement.rooms.filter((el, index) => {
        return i !== index
      })
    },
    editRoom (i, room) {
      this.removeRoom(i)
      this.newRoom = room
      this.showDialog = true
    },
    removePassanger (i) {
      this.arrangement.passangers = this.arrangement.passangers.filter((p, k) => k != i)
    },
    getArrangmentType (id) {
      if (this.arrangmentTypePicklist === null) return null
      return this.arrangmentTypePicklist.find(e => e.id === id)
    },
    setDestinationSuggestion (suggestion) {
      var latinSuggestion = this.convert(suggestion.description)
      this.search = latinSuggestion
      this.arrangement.destinacija = latinSuggestion
      this.arrangement.destinacijaObj = new Destination(latinSuggestion, suggestion.id)
    },
    setDepartSuggestion (suggestion) {
      var latinSuggestion = this.convert(suggestion.description)
      this.departSearch = latinSuggestion
      this.arrangement.mestoPolaska = latinSuggestion
      this.arrangement.mestoPolaskaObj = new Destination(latinSuggestion, suggestion.id)
    },
    setAgentSuggestion (suggestion) {
      this.lock = false
      this.searchAgent = suggestion.name
      this.arrangement.agent = suggestion.name
      this.arrangement.agentObj = suggestion
    },
    setHotelSuggestion (suggestion) {
      this.lockHotel = false
      this.searchHotel = suggestion.name
      this.arrangement.hotel = suggestion.name
      this.arrangement.hotelObj = suggestion
    },
    // setArrivalSuggestion (suggestion) {
    //   this.arrivalSearch = suggestion.description
    //   this.arrangement.mestoPristanista = suggestion.description
    //   this.arrangement.mestoPristanistaObj = new Destination(suggestion.description, suggestion.id)
    // },
    parseDate (date) {
      if (!date) return null
      return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
    },
    setNumberOfDays () {
      var a = moment(this.arrangement.datumPocetka, 'YYYY-MM-DD')
      var b = moment(this.arrangement.datumZavrsetka, 'YYYY-MM-DD')
      if (a.isValid() && b.isValid()) {
        console.log(a, b)
        var numOfDays = b.diff(a, 'days') - 1 + ' noci / ' + b.diff(a, 'days') + ' dana'
        this.arrangement.brojDana = numOfDays
      }
    },
    addRoom () {
      if (this.$refs.room.validateRoom()) {
        this.arrangement.rooms.push(this.newRoom)
        this.newRoom = new Room()
        this.showDialog = false
      }
    },
    yourCallBackFunction (e) {
      console.log('heeyyyy')
      e.preventDefault()
      return false
    }
  },
  watch: {
    search (val = 'a', newVal) {
      if (val != null && val.length < 10) {
        var self = this
        this.isLoading = true
        this.arrangement.destinacijaObj = null
        this.api.getPlaceSuggestion(val)
          .then(res => {
            self.destinationSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    departSearch (val = 'a', newVal) {
      if (val != null && val.length < 10) {
        var self = this
        this.departPlaceLoading = true
        this.arrangement.mestoPolaskaObj = null
        this.api.getPlaceSuggestion(val)
          .then(res => {
            self.departSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    arrivalSearch (val = 'a', newVal) {
      if (val != null && val.length < 10) {
        var self = this
        this.arrivalPlaceLoading = true
        this.api.getPlaceSuggestion(val)
          .then(res => {
            self.arrivalSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    searchAgent (val = 'a', newVal) {
      if (val != null && val.length < 10 && this.lock) {
        var self = this
        this.isLoadingAgent = true
        this.arrangement.agentObj = null
        this.api.getAgentSuggestion(val)
          .then(res => {
            self.agentsSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    searchHotel (val = 'a', newVal) {
      if (val != null && val.length < 10 && this.lockHotel) {
        var self = this
        this.isLoadingHotel = true
        this.arrangement.hotelObj = null
        this.api.getHotelSuggestion(val)
          .then(res => {
            self.hotelSuggestions = res.data
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    departDateModel (val) {
      console.log('this triggered')
      this.dateStarting = moment(val, moment.ISO_8601).format('DD.MM.YYYY').toString()
    },
    arrivalDateModel (val) {
      console.log('this triggered also')
      this.dateEnding = moment(val, moment.ISO_8601).format('DD.MM.YYYY').toString()
    }
  }
}
</script>

<style scoped>
.m-auto {
  margin: auto;
}
</style>
