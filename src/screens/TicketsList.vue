<template>
  <v-layout align-center row>
    <v-flex>
      <v-toolbar flat color="white" class="elevation-1">
        <v-toolbar-title>{{getHeader}}</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="tickets == null ? [] : tickets"
        :loading="tickets == null"
        hide-actions
        class="elevation-1"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate ></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr  @click="openDetails($event, props.item)">
            <td class="text-xs-left relative">
              <span class="indicator"></span>
              {{ props.item.Client.ime + " " +  props.item.Client.prezime }}
            </td>
            <td class="text-xs-left">
              <v-icon small>
                {{props.item.type == 'bus' ? 'airport_shuttle' : 'flight'}}
              </v-icon>
              {{ props.item.PassangersTickets.length }} {{props.item.PassangersTickets.length > 1 ? " Putnika" : "Putnik"}}</td>
            <td class="text-xs-left">
              {{ props.item.putovanjeOd}}
            </td>
            <td class="text-xs-left">
              {{ props.item.putovanjeDo }}
            </td>
            <td class="text-xs-left">{{ parseDate(props.item.datumPolaska) }}</td>
            <td class="text-xs-left">{{ parseDate(props.item.datumDolaska) }}</td>
            <td class="text-xs-center">{{ parseDate(props.item.datumRezervacije) }}</td>
            <td class="text-xs-left">
              <v-chip v-if="props.item.potvrdjeno" color='green' text-color='white' close v-model="props.item.potvrdjeno" @input="removeChecked(props.item.id)">Potvrdjeno</v-chip>
            </td>
            <td class="text-xs-left">
              <v-menu offset-y>
                <v-btn
                  slot="activator"
                  color="blue"
                  dark
                >
                  Akcije
                </v-btn>
                <v-list>
                  <v-list-tile @click.prevent="checkTicket(props.item.id)" v-if="!props.item.potvrdjeno">
                    <v-list-tile-title>Potvrdi Kartu</v-list-tile-title >
                  </v-list-tile>
                  <!-- <v-list-tile @click="generateBill(props.item.id)">
                    <v-list-tile-title>Generisi Racun</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="addTransfer(props.item.id)">
                    <v-list-tile-title>Dodaj Transfer</v-list-tile-title>
                  </v-list-tile> -->
                </v-list>
              </v-menu>   
            </td>
            <td class="justify-center layout px-0">
              <v-btn icon @click="editItem(props.item)">
                <v-icon small>
                edit
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="detailModal" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">Detalji</span>
          </v-card-title>

          <ticket-detail :ticket="ticketDetail"  @restartTicket="updateChanges"></ticket-detail>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="detailModal = false">Zatvori</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <pre v-if="ticketsProps.length == 0">{{tickets}}</pre> -->
    </v-flex>
  </v-layout>
</template>
<script>
import router from '@/router'
import moment from 'moment'
import Api from '@/services/api.js'
import Ticket from '@/models/Ticket'
import TicketDetails from '@/component-details/TicketDetails'
import toast from '@/services/toast'

export default {
  name: 'TicketsList',
  components: {
    'ticket-detail': TicketDetails
  },
  props: {
    ticketsProps: {
      type: Array,
      default: () => []
    },
    statistics: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    ticketDetail: new Ticket(),
    detailModal: false,
    conformationDialog: false,
    updateTickets: 0,
    dialog: false,
    api: new Api(),
    headers: [
      {
        text: 'Kupac',
        align: 'left',
        sortable: true,
        value: 'Client.ime'
      },
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
      { text: '--'},
      { text: '', sortable: false }
    ],
    editedIndex: -1
  }),

  asyncComputed: {
    tickets: {
      get () {
        if (this.ticketsProps.length > 0) {
          return this.ticketsProps
        } else {
          if (this.statistics) return []
          return this.api.getTickets(this.$route.params.type).then(res => res.data !== null ? res.data : [])
        }
      },
      watch () {
        this.updateTickets
      }
    }
  },

  watch: {
  },
  computed: {
    getHeader () {
      if (this.$route.params.type !== undefined) {
        return this.$route.params.type == 'bus' ? 'Bus Karte' : 'Avio Karte' 
      } 
      return 'Karte'
    }
  },

  methods: {
    updateChanges (id) {
      this.updateTickets = new Date()
      this.ticketDetail = this.ticketDetail.find(a => a.id == id)
    },
    parseDate (date) {
      var date = moment(date, moment.ISO_8601).format('DD.MM.YYYY')
      return moment(date, 'DD.MM.YYYY').isValid() ? date : '-'
    },
    close () {
      this.conformationDialog = false
    },
    editItem (item) {
      router.push({ path: `/dashboard/${this.$route.params.type}-tickets-store/${item.PlanId}` })
    },
    openDetails ($event, ticket) {
      if ($event.toElement.tagName !== 'DIV') {
        this.detailModal = true
        this.ticketDetail = ticket
      }
    },
    addTransfer (id) {

    },
    generateBill (id) {

    },
    async removeChecked (id) {
      try {
        var response = await this.api.uncheckTicket(id)
        toast.success(response.data.message)
        this.updateTickets = new Date()
      } catch (err) {
        toast.error(err.toString())
      }
    },
    async checkTicket (id) {
      try {
        var response = await this.api.checkTicket(id)
        toast.success(response.data.message)
        this.updateTickets = new Date()
      } catch (err) {
        toast.error(err.toString())
      }
    }

  },
  mounted () {

  }
}
</script>
<style>
  .overflow-visible{
      overflow: visible !important;
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
</style>
