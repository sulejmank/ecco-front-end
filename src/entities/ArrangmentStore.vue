<template>
  <div>
    <v-card v-if="step == 2">
      <!-- <v-layout
          row
          px-5
          py-4
          
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
              <h3 style="text-decoration:underline">Aranžman</h3>
              <ul style="list-style-type: none; padding:0">
                <li>Destinacija: <strong>{{arrangement.destinacija}}</strong></li>
                <li>Hotel: <strong>{{$refs.arrangement.searchHotel}}</strong></li>
                <li>
                  Trajanje: <strong>{{parseDate(arrangement.datumPocetka) + " - " + parseDate(arrangement.datumZavrsetka)}}</strong>
                  <span class="grey--text">({{arrangement.brojDana}} Noćenja)</span>
                </li>
                <li>Usluga: <strong>{{$refs.arrangement.getServiceText(arrangement.ServiceId)}}</strong></li>
                <li>Tip Anranžmana: <strong>{{$refs.arrangement.getArrangementText(arrangement.TypeId)}}</strong></li>
                <li>Agent: <strong>{{$refs.arrangement.searchAgent}}</strong></li>
                <li>Mesto Polaska: <strong>{{arrangement.mestoPolaska}}</strong></li>
                <li>Broj Putnika: <strong>{{arrangement.passangers.length + 1}}</strong></li>
              </ul>
          </v-flex>

          <v-flex no-wrap xs5 sm3>
          </v-flex>
        </v-layout> -->
        <arrangement-details :arrangement="arrangementSummary"></arrangement-details>
    </v-card>
    <v-stepper v-model='step' vertical>
      <v-stepper-step :complete='step > 1' step='1'>
        Novi Aranzman
      </v-stepper-step>

      <v-stepper-content step='1'>
        <v-subheader>Podatci o nosiocu putovanja</v-subheader>
        <customer :customer='customer' ref='customer' @newCustomer="newCustomerInstance"></customer>
        <v-divider></v-divider>
        <v-subheader>Aranžmani</v-subheader>
        <arrangement :arrangement='arrangement' ref='arrangement'></arrangement>
        <v-btn color='primary' @click='toCheckout()'>Naplati</v-btn>
        <v-btn flat>Obustavi</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete='step > 2' step='2'>
        Naplata
        <!-- <small>Summarize if needed</small> -->
      </v-stepper-step>

      <v-stepper-content step='2'>
        <checkout ref='checkout' :checkout='checkout'></checkout>
        <v-btn color='primary' @click='endCheckout' v-if='!isEditMode'>Zakljuci Prodaju</v-btn>
        <v-btn color='primary' @click='checkoutUpdate' v-if='isEditMode'>Sacuvaj Promene</v-btn>
        <v-btn flat @click='step = 1'>Nazad</v-btn>
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
import Destination from '@/models/Destination.js'
import Room from '@/models/Room.js'
import ArrangementDetails from '@/component-details/ArrangementDetails'
import ArrangementComponent from '@/components/Arrangement'
import CheckoutComponent from '@/components/Checkout'
import Arrangement from '@/models/Arrangement'
import Checkout from '@/models/Checkout'
import Customer from '@/models/Customer'
import toast from '@/services/toast'
import Api from '@/services/api'
import router from '@/router'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'ArrangmentStore',
  data () {
    return {
      showLoading: false,
      loadingMessage: '',
      proceed: false,
      api: new Api(),
      step: 1,
      customer: new Customer(),
      arrangement: new Arrangement(),
      checkout: new Checkout()
    }
  },
  components: {
    'customer': CustomerComponent,
    'arrangement': ArrangementComponent,
    'checkout': CheckoutComponent,
    'arrangement-details': ArrangementDetails
  },
  computed: {
    isEditMode () {
      return this.$route.params.id !== undefined
    },
    arrangementSummary () {
      let arrangement = this.arrangement
      arrangement.Client = this.customer
      if (this.$refs.arrangement != undefined) {
        arrangement.searchHotel = this.$refs.arrangement.searchHotel
        arrangement.searchAgent = this.$refs.arrangement.searchAgent
        arrangement.serviceText = this.$refs.arrangement.getServiceText(this.arrangement.ServiceId)
        arrangement.arrangementTypeText = this.$refs.arrangement.getServiceText(this.arrangement.ServiceId)
      }
      arrangement.numberOfPassangers = 1 + this.arrangement.passangers.length
      return arrangement
    }
  },
  methods: {
    parseDate (date) {
      var date = moment(date, moment.ISO_8601).format('DD.MM.YYYY')
      return moment(date, 'DD.MM.YYYY').isValid() ? date : '-'
    },
    newCustomerInstance () {
      this.customer = new Customer()
    },
    toCheckout () {
      let validCustomer = this.$refs.customer.customerValid
      let validArrangment = this.$refs.arrangement.arrangmentValid
      // let hasRoom = this.arrangement.passangers.length > 0
      if (validArrangment && validCustomer) {
        this.step = 2
      } else {
        let message = validCustomer ? '' : 'Nevalidni podatci za musteriju \n'
        message += validArrangment ? '' : 'Nevalidni podatci za aranzman \n'
        // message += hasRoom ? '' : 'Na karti nisu dodate sobe'
        toast.error(message)
      }
    },
    setDesination (destination) {
      return new Destination(destination.destinacija, destination.google_id, destination.id)
    },
    async getPlan (id) {
      try {
        this.loadingMessage = 'Učitavanje Aranžmana u toku'
        this.showLoading = true
        let response = await this.api.getPlansById(id)
        // Assign Checkout
        this.$refs.checkout.avans = response.data.avans > 0
        _.assign(this.checkout, _.pick(response.data, _.keys(this.checkout)))
        // Assign Customer
        _.assign(this.customer, _.pick(response.data.Client, _.keys(this.customer)))
        // Assign Arrangement
        _.assign(this.arrangement, _.pick(response.data.Arrangements[0], _.keys(this.arrangement)))
        this.$refs.arrangement.setDestinationSuggestion(this.setDesination(response.data.Arrangements[0].Destination))
        if (response.data.Arrangements[0].Depart != null) {
          this.$refs.arrangement.setDepartSuggestion(this.setDesination(response.data.Arrangements[0].Depart))
        }
        // Assign Hotel
         this.$refs.arrangement.setHotelSuggestion(response.data.Arrangements[0].Hotel)
        // Assign Agent
        this.$refs.arrangement.setAgentSuggestion(response.data.Arrangements[0].Agent)
        // if (response.data.Arrangements[0].Arrival) {
        //   this.$refs.arrangement.setArrivalSuggestion(this.setDesination(response.data.Arrangements[0].Arrival))
        // }

        // Assign Rooms and Passangers
        let passangers = response.data.Arrangements[0].PassangersArrangements.filter(p => p.Passanger !== null)
        this.arrangement.passangers = passangers.map(p => {
          return p.Passanger
        })
        // this.arrangement.rooms = response.data.Arrangements[0].Rooms.map(r => {
        //   var room = _.assign(new Room(), _.pick(r, _.keys(new Room())))
        //   room.passangers = r.PassangersInRooms.map(p => p.Passanger)
        //   return room
        // })
        this.loadingMessage = 'Aranžmana uspesno ucitan'
        this.showLoading = false
      } catch (error) {
        this.loadingMessage = 'Aranžmana nije potpuno ucitan'
        this.showLoading = false
        toast.error(error.toString())
      }
    },
    async endCheckout () {
      var succesfulRequests = [] 
      if (this.$refs.checkout.checkoutValid) {
        // TODO: Implement Loading
        // TODO: Implement Error Handling
        this.showLoading = true
        try {
          // Save Customer
          this.loadingMessage = 'Zapisivanje Musterije u bazu'
          let client = await this.api.saveCustomer(this.customer)
          succesfulRequests.push({data: client, request: 'saveCustomer'}) // ROLLBACK

          // Save Destinations
          this.loadingMessage = 'Zapisivanje Destinacije u bazu'
          let destinationId = await this.api.saveDestination(this.arrangement.destinacijaObj)
          if (this.arrangement.mestoPolaskaObj !== null) {
            let departId = await this.api.saveDestination(this.arrangement.mestoPolaskaObj)
            succesfulRequests.push({data: departId, request: 'saveDestination'}) // ROLLBACK
            this.arrangement.DepartId = departId.data.id
          }
          this.loadingMessage = 'Zapisivanje Mesta odlaska u bazu'
          if (this.arrangement.mestoPristanistaObj !== null) {
            let arrivalId = await this.api.saveDestination(this.arrangement.mestoPristanistaObj)
            succesfulRequests.push({data: arrivalId, request: 'saveDestination'}) // ROLLBACK
            this.arrangement.ArrivalId = arrivalId.data.id
          }
          // Continue ROLLBACK from hee
          // Save Hotel
          this.loadingMessage = 'Zapisivanje Hotela u bazu'
          if (this.arrangement.hotelObj === null) {
            let response = await this.api.addHotel(this.$refs.arrangement.searchHotel)
            this.arrangement.hotelObj = response.data
          }
          // Save Agent
          this.loadingMessage = 'Zapisivanje Agenta u bazu'
          if (this.arrangement.agentObj === null) {
            let response = await this.api.addAgent(this.$refs.arrangement.searchAgent)
            this.arrangement.agentObj = response.data
          }
          // Save Plan
          this.loadingMessage = 'Zapisivanje Kupovine u bazu'
          this.checkout.customerId = client.data.id
          let planId = await this.api.savePlan(this.checkout)

          // Save Arrangement
          this.loadingMessage = 'Zapisivanje Arannžmana u bazu'
          this.arrangement.DestinationId = destinationId.data.id
          this.arrangement.ClientId = client.data.id
          this.arrangement.PlanId = planId.data.id
          this.arrangement.HotelId = this.arrangement.hotelObj.id
          this.arrangement.AgentId = this.arrangement.agentObj.id
          let arrangementId = await this.api.saveArrangement(this.arrangement)

          // Save Passangers
          this.loadingMessage = 'Zapisivanje Putnika u bazu'
          if (this.arrangement.passangers.length > 0) {
            await this.api.setClientAsPassangerOnArrangement(client.data.id, arrangementId.data.id)
            // Save Passangers
            for (var p in this.arrangement.passangers) {
              this.arrangement.passangers[p].ArrangementId = arrangementId.data.id
              await this.api.addPassangerOnArrangement(this.arrangement.passangers[p])
            }
          } else {
            await this.api.setClientAsPassangerOnArrangement(client.data.id, arrangementId.data.id)
          }

          // TODO: Create File from Plan
          this.loadingMessage = 'Uspesno zapisana kupovina Aranžmana u bazu'
          this.proceed = true
          router.push({ path: `/dashboard/plans` })
        } catch (error) {
          this.loadingMessage = 'Zapisivanje nije uspelo, probajte opet'
          toast.error('Neuspesno upisivanje prodaje' + error.toString())
        }
        this.showLoading = false
      } else {
        toast.error('Nevalidni podatci prodaje')
      }
      this.loadingMessage = ''
    },
    async checkoutUpdate () {
      if (this.$refs.checkout.checkoutValid) {
        // TODO: Implement Loading
        // TODO: Implement Error Handling
        this.showLoading = true
        try {
          // Save Customer
          this.loadingMessage = 'Ažuriranje u toku'
          let client = await this.api.saveCustomer(this.customer)

          // Save Destinations
          let destinationId = await this.api.saveDestination(this.arrangement.destinacijaObj)
          if (this.arrangement.mestoPolaskaObj !== null) {
            let departId = await this.api.saveDestination(this.arrangement.mestoPolaskaObj)
            this.arrangement.DepartId = departId.data.id
          }
          // if (this.arrangement.mestoPristanistaObj !== null) {
          //   let arrivalId = await this.api.saveDestination(this.arrangement.mestoPristanistaObj)
          //   this.arrangement.ArrivalId = arrivalId.data.id
          // }

          // Save Hotel
          console.log(this.$refs.arrangement.searchHotel, this.$refs.arrangement.searchAgent)
          if (this.arrangement.hotelObj === null) {
            let response = await this.api.addHotel(this.$refs.arrangement.searchHotel)
            this.arrangement.hotelObj = response.data
          }
          // Save Agent
          if (this.arrangement.agentObj === null) {
            let response = await this.api.addAgent(this.$refs.arrangement.searchAgent)
            this.arrangement.agentObj = response.data
          }

          // Save Plan
          this.checkout.customerId = client.data.id
          let planId = await this.api.updatePlan(this.checkout)

          // Save Arrangement
          this.arrangement.DestinationId = destinationId.data.id
          this.arrangement.ClientId = client.data.id
          this.arrangement.PlanId = planId.data.id
          this.arrangement.HotelId = this.arrangement.hotelObj.id
          this.arrangement.AgentId = this.arrangement.agentObj.id
          let arrangementId = await this.api.saveChangedArrangement(this.arrangement)

          // Remove all Rooms attached to Arrangement
          await this.api.removeAllRoomsFromArrangement(arrangementId.data.id)

          // Save Rooms
          // for (var j in this.arrangement.rooms) {
          //   let room = this.arrangement.rooms[j]
          //   room.ArrangementId = arrangementId.data.id
          //   let response = await this.api.saveRoom(room)
          //   for (var k in room.passangers) {
          //     let p = room.passangers[k]
          //     p.RoomId = response.data.id
          //     await this.api.savePassangerWithRoom(p)
          //   }
          // }
          await this.api.removeAllPassangersFromArrangement(arrangementId.data.id)
          // Save Passangers
          if (this.arrangement.passangers.length > 0) {
            await this.api.setClientAsPassangerOnArrangement(client.data.id, arrangementId.data.id)
            // Save Passangers
            for (var p in this.arrangement.passangers) {
              this.arrangement.passangers[p].ArrangementId = arrangementId.data.id
              await this.api.addPassangerOnArrangement(this.arrangement.passangers[p])
            }
          } else {
            await this.api.setClientAsPassangerOnArrangement(client.data.id, arrangementId.data.id)
          }

          // TODO: Create File from Plan
          this.loadingMessage = 'Ažuriranje u uspelo'
          this.proceed = true
          router.push({ path: `/dashboard/plans` })
        } catch (error) {
          this.loadingMessage = 'Ažuriranje u nije uspelo, probajte ponovo'
          toast.error('Neuspesno upisivanje prodaje' + error.toString())
        }
        this.showLoading = false
      }
      this.loadingMessage = ''
    }

  },
  mounted () {
    if (this.$route.params.id !== undefined) {
      this.getPlan(this.$route.params.id)
    }
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
