<template>
  <v-layout align-center row>
    <v-flex>
      <v-toolbar flat color="white" class="elevation-1">
        <v-toolbar-title>Aranžmani</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="arrangements == null ? [] : arrangements"
        :loading="arrangements == null"
        hide-actions
        class="elevation-1"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate ></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr  @click="openDetails($event, props.item)">
            <td class="text-xs-left relative">
              <span class="indicator"></span>
              {{ props.item.Client.prezime + ", " + props.item.Client.ime }}
            </td>
            <td class="text-xs-left">
              {{ props.item.destinacija}}
            </td>
            <td class="text-xs-left">{{ props.item.brojOsoba }} {{props.item.brojOsoba > 1 ? " putnika" : " putnik"}}</td>
            <td class="text-xs-left">{{ parseDate(props.item.datumPocetka) }}</td>
            <td class="text-xs-left">{{ props.item.Service.title }}</td>
            <td class="text-xs-center">{{ parseDate(props.item.datumPocetka) + ' - ' + parseDate(props.item.datumZavrsetka)  }}</td>
            <td class="text-xs-left">{{ props.item.mestoPolaska }}</td>
            <td class="text-xs-left">{{ props.item.zarada }}</td>
            <td class="text-xs-left">{{ props.item.dug }}</td>
            <td class="justify-center layout px-0">
              <v-menu offset-y>
                <v-btn
                  slot="activator"
                  color="blue"
                  dark
                >
                  Akcije
                </v-btn> 
                <v-list>
                  <!-- <v-list-tile @click="addTransfers(props.item.id)">
                    <v-list-tile-title>Dodaj Transfer</v-list-tile-title >
                  </v-list-tile> -->
                  <v-list-tile @click="generateMemorandum(props.item.Plan.id)" v-if="props.item.MemorandumId == null">
                    <v-list-tile-title>Generisi Memorandum</v-list-tile-title>
                  </v-list-tile>
                  <!-- <v-list-tile @click="generateBill(props.item.id)">
                    <v-list-tile-title>Generisi Racun</v-list-tile-title>
                  </v-list-tile> -->
                </v-list>
              </v-menu>   
              <v-btn icon @click="editItem(props.item)">
                <v-icon
                  small
                >
                  edit
                </v-icon>
              </v-btn>
              <v-menu offset-y v-if="props.item.MemorandumId != null">
                <v-btn icon 
                  slot="activator"
                >
                  <v-icon
                    small
                  >
                    cloud
                  </v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="downloadMemorandum(props.item.MemorandumId)">
                    <v-list-tile-title>Download</v-list-tile-title >
                  </v-list-tile>
                   <!-- <v-list-tile @click="generateMemorandum(props.item.id)">
                    <v-list-tile-title>Link</v-list-tile-title>
                  </v-list-tile>  -->
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="detailModal" max-width="800px">
        <v-card>
          <!-- <v-card-title>
            <span class="headline">Detalji</span>
          </v-card-title> -->

          <arrangement-detail :arrangement="arrangementDetail" @restartArrangement="updateChanges"></arrangement-detail>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="detailModal = false">Zatvori</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <pre v-if="arrangementsProps.length == 0">{{arrangements}}</pre> -->
    </v-flex>
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
  </v-layout>
</template>

<script>
import moment from 'moment'
import router from '@/router'
import ArrangementDetails from '@/component-details/ArrangementDetails'
import Arrangement from '@/models/Arrangement'
import Api from '@/services/api.js'
import toast from '@/services/toast.js'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default {
  name: 'ArrangementsList',
  props: {
    arrangementsProps: {
      type: Array,
      default: () => []
    },
    statistics: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'arrangement-detail': ArrangementDetails
  },
  data: () => ({
    loadingMessage: '',
    showLoading: false, 
    arrangementDetail: new Arrangement(),
    detailModal: false,
    conformationDialog: false,
    updateArrangements: 0,
    dialog: false,
    api: new Api(),
    headers: [
      {
        text: 'Kupac',
        align: 'left',
        sortable: false
        // value: '.Client.'
      },
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
    editedIndex: -1
  }),

  asyncComputed: {
    arrangements: {
      get () {
        if (this.arrangementsProps.length > 0) {
          return this.formatArrangements(this.arrangementsProps)
        } else {
          if (this.statistics) return []
          return this.api.getArrangements().then(res => {
            res.data = this.formatArrangements(res.data)
            return res.data !== null ? res.data : []
          })
        }
      },
      watch () {
        this.updateArrangements
      }
    }
  },

  watch: {
  },

  methods: {
    formatArrangements (data) {
      data = data.map(r => {
        r.brojOsoba = r.PassangersArrangements.length
        r.datumPocetkaSortable = new Date(moment(r.datumPocetka, moment.ISO_8601)).getSeconds()
        r.zarada = parseInt(r.Plan.neto) - parseInt(r.Plan.bruto)
        r.dug = parseInt(r.Plan.neto) - (parseInt(r.Plan.avans) + r.Plan.Payments.reduce((acc, p) => {
          acc += parseInt(p.payment)
          return acc
        }, 0))
        return r
      })

      return data
    },
    updateChanges (id) {
      this.updateArrangements = new Date()
      this.arrangementDetail = this.arrangements.find(a => a.id == id)
      console.log(this.arrangementDetail)
    },
    parseDate (date) {
      return moment(date, moment.ISO_8601).format('DD.MM.YYYY').toString()
    },
    close () {
      this.conformationDialog = false
    },
    editItem (item) {
      router.push({ path: `/dashboard/arrangment-store/` + item.PlanId })
    },
    openDetails ($event, arrangement) {
      console.log($event.toElement.tagName)
      if ($event.toElement.tagName == 'TD') {
        this.detailModal = true
        this.arrangementDetail = arrangement
      }
    },
    async downloadMemorandum (id) {
      try {
        this.showLoading = true
        this.loadingMessage = 'Preuzimanje dokumenta sa Google Drive'
        var request = new Promise((resolve, reject) => {
          this.api.downloadFile(id).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
        var response = await request  

        var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
        FileSaver.saveAs(blob, "second-chance.docx")
        
        this.showLoading = false;
      } catch (err) {
        console.error(err)
        this.showLoading = false;
        toast.error({message: err.toString()})
      }
    },
    addTransfers (id) {

    },
    async generateMemorandum (id) {
      try {
        this.showLoading = true
        this.loadingMessage = 'Generisanje dokumenta u Google Drive'
        let response = await this.api.generateMemorandum(id)
        this.updateArrangements = new Date()
        this.showLoading = false
      } catch (err) {
        this.updateArrangements = new Date()
        toast.error(err.toString())
      }
    },
    generateBill (id) {

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
