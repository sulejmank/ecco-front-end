
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

export default {
  data () {
    return {
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
      } catch (error) {
        toast.error(error.toString())
      }
    },
    async checkoutEnd () {
      if (this.$refs.checkout.valid) {
        // TODO: Implement Loading
        // TODO: Implement Error Handling
        try {
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

          // TODO: Create File from Plan
          this.proceed = true
          router.push({ path: `/dashboard/plans` })
        } catch (error) {
          console.error(error)
          toast.error('Neuspesno upisivanje prodaje ' + error.toString())
        }
      }
    },
    async checkoutUpdate () {
      if (this.$refs.checkout.valid) {
        // TODO: Implement Loading
        // TODO: Implement Error Handling
        try {
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
          // TODO: Create File from Plan
          this.proceed = true
          router.push({ path: `/dashboard/plans` })
        } catch (error) {
          console.error(error)
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
