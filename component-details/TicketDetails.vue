<template>
  <v-card-text>
    <v-layout>
      <v-flex md6 v-if="ticket.Client !== undefined">
          <h3 style="text-decoration:underline">Nosilac Putovanja</h3>
          <table style="list-style-type: none; padding:0; width: 100%">
            <tr>
              <td>
                Ime Prezime:
              </td>
              <td>
                <strong>{{ticket.Client.ime + " " + ticket.Client.prezime}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Telefona:
              </td>
              <td>
                <strong>{{ticket.Client.brojTelefona}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Email: 
              </td>
              <td>
                <strong>{{ticket.Client.email}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Pasosa:
              </td>
              <td>
                <strong>{{ticket.Client.brojPasosa}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Datum Rodjenja:
              </td>
              <td>
                <strong>{{ticket.Client.datumRodjenja}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Struka:
              </td>
              <td>
                <strong>{{ticket.Client.struka}}</strong>
              </td>
            </tr>
          </table>
      </v-flex>
      <v-flex md6 v-if="ticket.Client !== undefined">
          <h3 style="text-decoration:underline">Karta</h3>
          <table style="list-style-type: none; padding:0; width: 100%">
            <tr>
              <td>
                Destinacija:
              </td>
              <td>
                <strong>{{ticket.Destination != undefined ? ticket.Destination.destinacija : ticket.putovanjeDoObj.description}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Datum polaska / povratka:
              </td>
              <td>
                <strong>{{parseDate(ticket.datumPolaska) + " - " + parseDate(ticket.datumDolaska)}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Agencija:
              </td>
              <td>
                <strong>{{ticket.Company != undefined ? ticket.Company.name : ticket.avioKompanija }}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Putovanje:
              </td>
              <td>
                <strong>
                  {{ticket.Destination != undefined ? ticket.Destination.destinacija : ticket.putovanjeDoObj.description}} -
                  {{ticket.Arrival != undefined ? ticket.Arrival.destinacija : ticket.putovanjeOdObj.description}}
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Putnika: 
              </td>
              <td>
                <strong>{{ticket.PassangersTickets != undefined ? ticket.PassangersTickets.length + 1 : ticket.numberOfPassangers }}</strong>
              </td>
            </tr>
            <tr v-if="ticket.Plan != undefined">
              <td>
                Status: 
              </td>
              <td>
                <v-chip :color="ticket.Plan.status ? 'green': 'red'" text-color='white'>{{ticket.Plan.status ? 'Isplaćeno': 'Neisplaćeno'}}</v-chip>
              </td>
            </tr> 
            <tr v-if="ticket.Plan != undefined">
              <td>
                Avans: 
              </td>
              <td>
                <strong>{{ticket.Plan.avans}}</strong>
              </td>
            </tr>
            <tr v-if="ticket.Plan != undefined">
              <td>
                Neto: 
              </td>
              <td>
                <strong>{{ticket.Plan.neto}}</strong>
              </td>
            </tr>
            <tr v-if="ticket.Plan != undefined">
              <td>
                Bruto: 
              </td>
              <td>
                <strong>{{ticket.Plan.bruto}}</strong>
              </td>
            </tr>
          </table>
      </v-flex>
    </v-layout>
    <v-layout v-if="ticket.Plan !== undefined" column>
      <v-flex>
        <payment v-if="ticket.Plan.avans != null" :plan="ticket.Plan" :payment="payment" ref="payment" @deletePayment="deletePayment"></payment>
      </v-flex>
      <v-flex class="text-right">
        <v-btn color="blue darken-1" flat @click.native="makePayment" v-if="!isPlanPayed" >Izvrsi Uplatu</v-btn>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>
<script>
import moment from 'moment'
import Payment from '@/models/Payment'
import Ticket from '@/models/Ticket'
import PaymentComponent from '@/components/Payment'
import Api from '@/services/api'
import toast from '@/services/toast'

export default {
  name: 'TicketsDetails',
  props: {
    ticket: {
      type: Object,
      default: () => new Ticket()
    }
  },
  components: {
    'payment': PaymentComponent
  },
  data () {
    return {
      valid: false,
      payment: new Payment(),
      api: new Api()
    }
  },
  computed: {
    isPlanPayed () {
      return this.ticket.Plan.status
    }
  },
  methods: {
    parseDate (date) {
      var date = moment(date, moment.ISO_8601).format('DD.MM.YYYY')
      return moment(date, 'DD.MM.YYYY').isValid() ? date : '-'
    },
    async makePayment () {
      if (this.$refs.payment.paymentValid) {
        try {
          var response = await this.api.makePayment(this.ticket.Plan.id, this.payment)
          if (response.data !== undefined) {
            this.payment = new Payment()
            this.$emit('restartTicket', this.ticket.id)
            this.$refs.payment.resetValidation()
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    },
    async deletePayment (id) {
      try {
        let response = await this.api.deletePayment(id)
        if (response.data !== undefined) {
          this.payment = new Payment()
          this.$emit('restartTicket', this.ticket.id)
          this.$refs.payment.resetValidation()
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }
}
</script>
<style>

</style>
