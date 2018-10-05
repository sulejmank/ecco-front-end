<template>
  <v-card-text>
    <v-layout>
      <v-flex md6 v-if="arrangement.Client !== undefined">
          <h3 style="text-decoration:underline">Nosilac Putovanja</h3>
          <table style="list-style-type: none; padding:0; width: 100%">
            <tr>
              <td>
                Ime Prezime:
              </td>
              <td>
                <strong>{{arrangement.Client.ime + " " + arrangement.Client.prezime}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Telefona:
              </td>
              <td>
                <strong>{{arrangement.Client.brojTelefona}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Email: 
              </td>
              <td>
                <strong>{{arrangement.Client.email}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Pasosa:
              </td>
              <td>
                <strong>{{arrangement.Client.brojPasosa}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Datum Rodjenja:
              </td>
              <td>
                <strong>{{arrangement.Client.datumRodjenja}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Struka:
              </td>
              <td>
                <strong>{{arrangement.Client.struka}}</strong>
              </td>
            </tr>
          </table>
      </v-flex>
      <v-flex md6 v-if="arrangement.Client !== undefined">
          <h3 style="text-decoration:underline">Aranžman</h3>
          <table style="list-style-type: none; padding:0; width: 100%">
            <tr>
              <td>
                Destinacija:
              </td>
              <td>
                <strong>{{arrangement.Destination != undefined ? arrangement.Destinacija.destinacija : arrangement.destinacijaObj.description}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Hotel:
              </td>
              <td>
                <!-- <strong>{{arrangement.Hotel != undefined ? arrangement.Hotel.name : arrangement.searchHotel}}</strong> -->
              </td>
            </tr>
            <tr>
              <td>
                Trajanje:
              </td>
              <td>
                <strong>{{parseDate(arrangement.datumPocetka) + " - " + parseDate(arrangement.datumZavrsetka)}}</strong>
              <span class="grey--text">({{arrangement.brojDana}} Noćenja)</span>
              </td>
            </tr>
            <tr>
              <td>
                Usluga:
              </td>
              <td>
                <strong>{{arrangement.Service != undefined ? arrangement.Service.title : arrangement.serviceText }}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Tip Anranžmana:
              </td>
              <td>
                <strong>{{arrangement.Type != undefined ? arrangement.Type.title : arrangement.arrangementTypeText}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Agent:
              </td>
              <td>
                <strong>{{arrangement.Agent != undefined ? arrangement.Agent.name : arrangement.searchAgent}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Mesto Polaska:
              </td>
              <td>
                <strong>{{arrangement.mestoPolaska}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Putnika: 
              </td>
              <td>
                <strong>{{arrangement.PassangersArrangements != undefined ? arrangement.PassangersArrangements.length + 1 : arrangement.numberOfPassangers }}</strong>
              </td>
            </tr>
            <tr v-if="arrangement.Plan != undefined">
              <td>
                Status: 
              </td>
              <td>
                <v-chip :color="arrangement.Plan.status ? 'green': 'red'" text-color='white'>{{arrangement.Plan.status ? 'Isplaćeno': 'Neisplaćeno'}}</v-chip>
              </td>
            </tr>
            <tr v-if="arrangement.Plan != undefined">
              <td>
                Avans: 
              </td>
              <td>
                <strong>{{arrangement.Plan.avans}}</strong>
              </td>
            </tr>
          </table>
      </v-flex>
    </v-layout>
    <v-layout v-if="arrangement.Plan !== undefined" column>
      <v-flex>
        <payment :plan="arrangement.Plan" :payment="payment" ref="payment" @deletePayment="deletePayment"></payment>
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
import PaymentComponent from '@/components/Payment'
import Arrangement from '@/models/Arrangement'
import Api from '@/services/api'
import toast from '@/services/toast'

export default {
  name: 'ArrangementDetails',
  props: {
    arrangement: {
      type: Object,
      default: () => new Arrangement()
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
      return this.arrangement.Plan.status
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
          var response = await this.api.makePayment(this.arrangement.Plan.id, this.payment)
          if (response.data !== undefined) {
            this.payment = new Payment()
            this.$emit('restartArrangement', this.arrangement.id)
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
          this.$emit('restartArrangement', this.arrangement.id)
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
