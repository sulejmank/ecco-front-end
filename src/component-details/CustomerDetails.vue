<template>
  <v-expansion-panel-content :key="customer.id">
    <div slot="header" class="header">
      <span class="name-heading">{{customer.imePrezime}} </span>
      <span class="danger-message" v-if="haveDept">
        <v-icon
          small
          color="red"
        >
          error
        </v-icon>
      Neplaceni dugovi
      </span>  
    </div>
    <v-card>
      <v-card-text>
        <v-layout row>
          <v-flex md12>
            <h3 style="text-decoration:underline; width: 100%;">Podaci</h3>
            <table style="list-style-type: none; padding:0; width: 100%">
              <tr>
                <td>
                  Broj Telefona:
                </td>
                <td>
                  <strong>{{customer.brojTelefona}}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  Email: 
                </td>
                <td>
                  <strong>{{customer.email}}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  Broj Pasosa:
                </td>
                <td>
                  <strong>{{customer.brojPasosa}}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  Datum Rodjenja:
                </td>
                <td>
                  <strong>{{customer.datumRodjenja}}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  Struka:
                </td>
                <td>
                  <strong>{{customer.struka}}</strong>
                </td>
              </tr>
            </table>
            <br>
          </v-flex>
        </v-layout>
        <v-layout>
          <tickets-list :ticketsProps="customer.Tickets" :statistics="true"></tickets-list>
        </v-layout>
        <v-layout mt-3>
          <arrangement-list :arrangementsProps="customer.Arrangements" :statistics="true"></arrangement-list>  
        </v-layout>        
        <v-layout mt-3>
          <destinations-details :destinations="destinations"></destinations-details>  
        </v-layout>
      </v-card-text>
    </v-card>
  </v-expansion-panel-content>
</template>
<script>
import _ from 'lodash'
import moment from 'moment'
import Api from '@/services/api.js'
import toast from '@/services/toast'
import Ticket from '@/models/Ticket'
import TicketsList from '@/screens/TicketsList'
import TicketDetails from '@/component-details/TicketDetails'
import ArrangementDetails from '@/component-details/ArrangementDetails'
import DestinationsDetails from '@/component-details/DestinationsDetails'
import ArrangementsList from '@/screens/ArrangementsList'
import Arrangement from '@/models/Arrangement'

export default {
  name: 'CustomerDetails',
  components: {
    'ticket-detail': TicketDetails,
    'arrangement-detail': ArrangementDetails,
    'tickets-list': TicketsList,
    'arrangement-list': ArrangementsList,
    'destinations-details': DestinationsDetails
  },
  props: {
    customer: {
      type: Object
    }
  },
  data () {
    return {
      arrangementDetailModal: false,
      arrangementDetail: new Arrangement(),
      ticketDetail: new Ticket(),
      detailModalTickets: false, 
      ticketsHeader: [
        { text: 'Tip karte', value: 'type' },
        { text: 'Broj Putnika', value: 'Broj Putnika' },
        {
          text: 'Putovanje Od',
          align: 'left',
          sortable: true,
          value: 'putovanjeOd'
        },
        {
          text: 'Putovanje Do',
          align: 'left',
          sortable: true,
          value: 'putovanjeDo'
        },
        // { text: 'Hotel', value: 'hotel' },
        { text: 'Datum Polaska', value: 'datumPolaska' },
        { text: 'Datum Povratka', value: 'Datum Povratka' },
        { text: 'Datum Rezervacije', align: 'center', value: 'datumRezervacije' },
        { text: '-'},
        { text: '', value: 'name', sortable: false }
      ],
      arrangementsHeader: [
        {
          text: 'Destinacija',
          align: 'left',
          sortable: false,
          value: 'destinacija'
        },
        { text: 'Broj putnika', value: 'brojOsoba' },
        { text: 'Datum pocetka', value: 'datumPocetkaSortable' },
        { text: 'Usluga', value: 'Service' },
        { text: 'Period', align: 'center' },
        { text: 'Mesto Polaska', value: 'mestoPolaska' },
        { text: 'Zarada', value: 'zarada' },
        { text: 'Dug', value: 'dug' },
        { text: '', value: 'name', sortable: false, align: 'center' }
      ],
    }
  },
  computed: {
    haveDept () {
      let paidAllTickets = this.customer.Tickets.reduce((acc, t) => {
        acc = acc & t.Plan.status
        return acc
      }, true)
      let paidAllArrangements = this.customer.Arrangements.reduce((acc, a) => {
        acc = acc & a.Plan.status
        return acc
      }, true)
      return !(paidAllTickets & paidAllArrangements)
    },
    destinations () {
      let arrangementDestinations = this.customer.Arrangements.map(a => {
          a.Destination.from = 'arrangement'
          return a.Destination
        })
      let ticketsDestinations = this.customer.Tickets.map(t => {
          t.Arrival.from = 'ticket'
          return t.Arrival
        })
      let destinations = arrangementDestinations.concat(ticketsDestinations)
      let uniqueDestinations = _.uniqBy(destinations, 'google_id')
      uniqueDestinations = uniqueDestinations.map(uD => {
        uD.count = destinations.filter(d => d.google_id == uD.google_id).length
        return uD
      })
      return uniqueDestinations
    }
    
  },
  methods: {
    parseDate (date) {
      return moment(date, moment.ISO_8601).format('DD.MM.YYYY').toString()
    },
    updateChanges () {
      this.$emit('updateChanges')
    },
    openDetailsArrangement ($event, arrangement) {
      if ($event.toElement.tagName !== 'DIV') {
        this.arrangementDetailModal = true
        this.arrangementDetail = arrangement
      }
    },
    openDetails ($event, ticket) {
      if ($event.toElement.tagName !== 'DIV') {
        this.detailModalTickets = true
        this.ticketDetail = ticket
      }
    },
  }
}
</script>
<style>
.header {
  display: flex !important;
}
.name-heading {
  flex: 0 50%;
}
.danger-message {
  flex: 0 50%;
  text-align: right;
  color: red;
}
.indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 5%;
  height: 100%;
  background-color: black;
}
.indicator::after {
  content: '';
  display: block;
  right: -50%;
  top: 2%;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 50%;
}
.relative {
  position: relative;
}
tr:hover .indicator::after {
  background-color: #eee;
  transition: background .3s cubic-bezier(.25,.8,.5,1);
}
.airport_shuttle {
  background-color: blue;
}
.flight {
  background-color: red;
}
.arrangement {
  background-color: green;
}
</style>


