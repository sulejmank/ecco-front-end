<template>
  <div>
    <v-card>
      <v-layout
          row
          px-5
          py-4
          v-if="step == 2"
        >
          <v-flex xs4 sm2>
              <h3 style="text-decoration:underline">Nosilac Putovanja</h3>
              <ul style="list-style-type: none; padding:0">
                <li>Ime Prezime: <strong>{{customer.ime + " " + customer.prezime}}</strong></li>
                <li>Broj Telefona: <strong>{{customer.brojTelefona}}</strong></li>
                <li>Email: <strong>{{customer.email}}</strong></li>
                <li>Broj Pasosa: <strong>{{customer.brojPasosa}}</strong></li>
                <li>Datum Rodjenja: <strong>{{customer.datumRodjenja}}</strong></li>
                <li>Struka: <strong>{{customer.struka}}</strong></li>
              </ul>
          </v-flex>
          <v-divider
            class="mx-3"
            inset
            vertical
            dark
          ></v-divider>
          <v-flex sm5 md3 hidden-xs-only>
              <h3 style="text-decoration:underline">Bus Karta</h3>
              <ul style="list-style-type: none; padding:0">
                <li>Putovanje: <strong>{{ticket.putovanjeOd + " - " + ticket.putovanjeDo }}</strong></li>
                <li>
                  Datum polaska/povratka: <strong>{{parseDate(ticket.datumPolaska) + " / " + parseDate(ticket.datumDolaska)}}</strong>
                </li>
                <li>Kompanija: <strong>{{ticket.avioKompanija}}</strong></li>
                <li>Broj Putnika: <strong>{{passangers.length + 1}}</strong></li>
              </ul>
          </v-flex>
        </v-layout>
    </v-card>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="step > 1" step="1">
        Nova Bus Karta
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-subheader>Podatci o putniku</v-subheader>
        <customer :customer="customer" ref="customer" @newCustomer="newCustomerInstance"></customer>
        <v-divider></v-divider>
        <v-subheader>Bus Karta</v-subheader>
        <bus-ticket :ticket="ticket" :passangers="passangers" ref="ticket" @removePassanger="removePassanger"></bus-ticket>
        <v-layout row wrap>
          <v-flex sm12 md5 ml-3>
            <v-text-field
              v-model="customer.brojRezervacije"
              label="Broj rezervacije kupca karte"
              :rules="brojRezervacijeRules"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn color="primary" @click="toCheckout()">Naplati</v-btn>
        <v-btn flat>Obustavi</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2">
        Naplata
        <!-- <small>Summarize if needed</small> -->
      </v-stepper-step>

      <v-stepper-content step="2">
        <checkout ref="checkout" :checkout="checkout"></checkout>
        <v-btn color="primary" @click="checkoutEnd" v-if="!isEditMode">Zakljuci Prodaju</v-btn>
        <v-btn color="primary" @click="checkoutUpdate" v-if="isEditMode">Sacuvaj Promene</v-btn>
        <v-btn flat @click="step = 1">Nazad</v-btn>
      </v-stepper-content>

    </v-stepper>
    <v-dialog
      v-model="showLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
      color="blue darken-3"
      >
        <v-card-text style="color:#fff" text-center>
          {{loadingMessage}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

import CustomerComponent from '@/components/Customer'
import TicketComponent from '@/components/Ticket'
import Ticket from '@/models/Ticket.js'
import Company from '@/models/Company.js'
import CheckoutComponent from '@/components/Checkout'
import Checkout from '@/models/Checkout.js'
import Customer from '@/models/Customer.js'
import Destination from '@/models/Destination.js'
import Api from '@/services/api'
import toast from '@/services/toast'
import router from '@/router'
import moment from 'moment'
import _ from 'lodash'

const TicketType = 'bus'

export default {
  name: 'BusTicketStore',
  data () {
    return {
      showLoading: false,
      loadingMessage: '',
      proceed: false,
      api: new Api(),
      step: 1,
      customer: new Customer(),
      ticket: new Ticket(TicketType),
      checkout: new Checkout(),
      passangers: [],
      brojRezervacijeRules: [
        v => !!v || 'Broj rezervacije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ]
    }
  },
  computed: {
    isValidSale () {
      let isValidTicket = this.$refs.ticket.ticketValid
      let isValidCustomer = this.$refs.customer.customerValid
      let customerReservation = this.customer.brojRezervacije !== null
      return isValidTicket && isValidCustomer && customerReservation
    },
    generateErrorMessage () {
      let message = this.$refs.ticket.ticketValid ? '' : 'Nevalidni podatci za kartu'
      message += this.$refs.customer.customerValid ? '' : ' \n Nevalidni podatci za musteriju'
      message += this.customer.brojRezervacije !== null ? '' : ' Broj Rezervacije nije unet'
      return message
    },
    isEditMode () {
      return this.$route.params.id !== undefined
    }
  },
  components: {
    'customer': CustomerComponent,
    'bus-ticket': TicketComponent,
    'checkout': CheckoutComponent
  },
  methods: {
    parseDate (date) {
      var date = moment(date, moment.ISO_8601).format('DD.MM.YYYY')
      return moment(date, 'DD.MM.YYYY').isValid() ? date : '-'
    },
    newCustomerInstance () {
      this.customer = new Customer()
    },
    removePassanger (index) {
      this.passangers = this.passangers.filter((el, i) => {
        return i !== index
      })
    },
    toCheckout () {
      if (this.isValidSale) {
        this.step = 2
      } else {
        toast.error(this.generateErrorMessage)
      }
    },
    setTicketDesination (destination) {
      return new Destination(destination.destinacija, destination.google_id, destination.id)
    },
    async getPlan (id) {
      try {
        this.showLoading = true
        this.loadingMessage = 'Učitavanje bus karte u toku'
        let response = await this.api.getPlansById(id)
        // Assign Checkout
        this.$refs.checkout.avans = response.data.avans > 0
        _.assign(this.checkout, _.pick(response.data, _.keys(this.checkout)))
        // Assign Customer
        _.assign(this.customer, _.pick(response.data.Client, _.keys(this.customer)))
        this.customer.brojRezervacije = response.data.Tickets[0].PassangersTickets.find(e => e.ClientPassanger != null).brojRezervacije
        // Assign Ticket
        _.assign(this.ticket, _.pick(response.data.Tickets[0], _.keys(this.ticket)))
        this.$refs.ticket.setDepartureSuggestion(this.setTicketDesination(response.data.Tickets[0].Destination))
        this.$refs.ticket.setArrivalSuggestion(this.setTicketDesination(response.data.Tickets[0].Arrival))
        this.$refs.ticket.setCompanySuggestion(response.data.Tickets[0].Company)
        this.$refs.ticket.roundTrip = response.data.Tickets[0].datumDolaska !== null

        // Assign Passangers
        var passangers = response.data.Tickets[0].PassangersTickets.filter(p => p.Passanger != null)
        this.passangers = passangers.map(e => {
          e.Passanger.brojRezervacije = e.brojRezervacije
          return e.Passanger
        })
        this.loadingMessage = 'Učitavanje avionske karte uspešno'
      } catch (error) {
        this.loadingMessage = 'Učitavanje avionske karte nije uspelo'
        toast.error(error.toString())
      }
      this.showLoading = false
    },
    async checkoutEnd () {
      if (this.$refs.checkout.valid) {
        // TODO: Implement Loading
        // TODO: Implement Error Handling
        this.showLoading = true
        try {
          this.loadingMessage = 'Kreiranje bus karte u toku'
          // Save Customer
          let client = await this.api.saveCustomer(this.customer)

          // Save Destinations
          let destinationId = await this.api.saveDestination(this.ticket.putovanjeOdObj)
          let arrivalId = await this.api.saveDestination(this.ticket.putovanjeDoObj)

          // Save Plan
          this.checkout.customerId = client.data.id
          let planId = await this.api.savePlan(this.checkout)

          // Save Company
          if (this.ticket.avioKompanijaObj === null) {
            let response = await this.api.addCompany(new Company(null, this.$refs.ticket.searchComp))
            this.ticket.avioKompanijaObj = response.data
          }

          // Save Ticket
          this.ticket.DestinationId = destinationId.data.id
          this.ticket.ArrivalId = arrivalId.data.id
          this.ticket.ClientId = client.data.id
          this.ticket.PlanId = planId.data.id
          this.ticket.CompanyId = this.ticket.avioKompanijaObj.id
          let ticketId = await this.api.saveTicket(this.ticket)

          // Save Passangers
          if (this.passangers.length > 0) {
            await this.api.addClientAsPassanger(ticketId.data.id, client.data.id, this.customer.brojRezervacije)
            // Save Passangers
            for (var p in this.passangers) {
              this.passangers[p].TicketId = ticketId.data.id
              await this.api.savePassanger(this.passangers[p])
            }
          } else {
            await this.api.addClientAsPassanger(ticketId.data.id, client.data.id, this.customer.brojRezervacije)
          }

          this.loadingMessage = 'Kreiranje bus karte je uspela'
          this.showLoading = false
          // TODO: Create File from Plan
          this.proceed = true
          router.push({ path: `/dashboard/plans` })
        } catch (error) {
          this.loadingMessage = 'Izmena bus karte nije uspela'
          this.showLoading = false
          toast.error('Neuspesno upisivanje prodaje ' + error.toString())
        }
      }
    },
    async checkoutUpdate () {
      if (this.$refs.checkout.valid) {
        // TODO: Implement Loading
        // TODO: Implement Error Handling
        try {
          this.loadingMessage = 'Izmena bus karte u toku'
          this.showLoading = true
          // Save Customer
          let client = await this.api.saveCustomer(this.customer)

          // Save Destinations
          let destinationId = await this.api.saveDestination(this.ticket.putovanjeOdObj)
          let arrivalId = await this.api.saveDestination(this.ticket.putovanjeDoObj)

          // Save Plan
          this.checkout.customerId = client.data.id
          let planId = await this.api.updatePlan(this.checkout)

          // Save Company
          if (this.ticket.avioKompanijaObj === null) {
            let response = await this.api.addCompany(new Company(null, this.$refs.ticket.searchComp))
            this.ticket.avioKompanijaObj = response.data
          }

          // Save Ticket
          this.ticket.DestinationId = destinationId.data.id
          this.ticket.ArrivalId = arrivalId.data.id
          this.ticket.ClientId = client.data.id
          this.ticket.PlanId = planId.data.id
          this.ticket.CompanyId = this.ticket.avioKompanijaObj.id
          let ticketId = await this.api.saveChangedTicket(this.ticket)
          // Remove Passangers from Ticket
          await this.api.removeAllPassangersFromTicket(ticketId.data.id)

          // Save Passangers
          if (this.passangers.length > 0) {
            await this.api.addClientAsPassanger(ticketId.data.id, client.data.id, this.customer.brojRezervacije)
            // Save Passangers
            for (var p in this.passangers) {
              this.passangers[p].TicketId = ticketId.data.id
              await this.api.savePassanger(this.passangers[p])
            }
          } else {
            await this.api.addClientAsPassanger(ticketId.data.id, client.data.id, this.customer.brojRezervacije)
          }
          this.loadingMessage = 'Kreiranje bus karte je uspela'
          this.showLoading = false
          // TODO: Create File from Plan
          this.proceed = true
          router.push({ path: `/dashboard/plans` })
        } catch (error) {
          this.loadingMessage = 'Izmena bus karte nije uspela'
          this.showLoading = false
          toast.error('Neuspesno upisivanje prodaje ' + error.toString())
        }
      }
    }
  },
  mounted () {
    if (this.$route.params.id !== undefined) {
      this.getPlan(this.$route.params.id)
    }
    console.log(this.$route.params.id)
  },
  beforeRouteLeave (to, from, next) {
    if (this.step == 2 && !this.proceed) {
      this.step = 1
      next(false)
    } else {
      next()
    }
  }
}
</script>
<style>
</style>
