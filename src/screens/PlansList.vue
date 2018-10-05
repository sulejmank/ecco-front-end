<template>
  <v-layout align-center row>
  <v-flex>
    <v-toolbar flat color="white" class="elevation-1">
      <v-toolbar-title>Poslednje prodaje</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <!-- Delete Confirm Dialog -->
       <v-dialog v-model="conformationDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Upozorenje</span>
          </v-card-title>

          <v-card-text>
            <p>Da li zelite izbrisati prodaju ?</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="conformationDialog = false">Odustani</v-btn>
            <v-btn color="blue darken-1" flat @click.native="deletePlan">Nastavi</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Payment Modal -->
      <v-dialog v-model="paymentModal" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Uplate</span>
          </v-card-title>

          <payment v-if="payment != null" :payment="payment" :plan="planPayment" ref="payment" @deletePayment="deletePayment"></payment>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="paymentModal = false">Zatvori</v-btn>
            <v-btn color="blue darken-1" flat @click.native="makePayment" v-if="!isPlanPayed">Izvrsi Uplatu</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="plans == null ? [] : plans"
      :loading="plans == null"
      hide-actions
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate ></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td class="text-xs-left relative">
          <span class="indicator"></span>
          <v-avatar size="25px" tile>
            <img
              :src="props.item.Client.urlSlike"
              alt="Customer Avatar"
            >
          </v-avatar>
          {{ props.item.Client.ime + " " + props.item.Client.prezime }}
        </td>
        <td class="text-xs-left">{{ formatISODate(props.item.createdAt) }}</td>
        <td class="text-xs-center" v-if="props.item.status"> <v-chip color='green' text-color='white'>Isplaćeno</v-chip></td>
        <td class="text-xs-center" v-if="!props.item.status"> <v-chip color='red' text-color='white'>Neisplaćeno</v-chip> </td>
        <td class="text-xs-center">{{ soldServices(props.item) }}</td>
        <td class="text-xs-left">{{ props.item.avans > 0 ? props.item.avans : '-' }}</td>
        <td class="text-xs-left">{{ props.item.neto }}</td>
        <td class="text-xs-left">{{ formatISODate(props.item.rokUplate) }}</td>
        <td class="text-xs-left">
          <v-btn slot="activator" depressed small color="primary" @click="openPaymentDialog(props.item.id)">Uplate</v-btn>
        </td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <!-- <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template> -->
    </v-data-table>
    <!-- <pre>{{plans}}</pre> -->
  </v-flex>
  </v-layout>
</template>
<script>
import moment from 'moment'
import Api from '@/services/api.js'
import toast from '@/services/toast.js'
import router from '@/router'
import Plan from '@/models/Plan'
import Payment from '@/models/Payment'
import PaymentComponent from '@/components/Payment'
// import DocumentPreview from '@/components/helpers/DocumentPreview'
export default {
  name: 'PlanList',
  components: {
    'payment': PaymentComponent
  },
  asyncComputed: {
    plans: {
      get () {
        return this.api.getPlans().then(res => {
            this.progress = false
            res.data = res.data.map(r => {
              r.dateCreatedSorting =  new Date(r.createdAt).getSeconds()
              return r
            })
            return res.data !== null ? res.data : []
          })
      },
      watch () {
        this.updatePlans
      }
    }
  },
  data () {
    return {
      progress: true,
      planPayment: new Plan(),
      payment: null,
      paymentModal: false,
      planDeleteId: null,
      conformationDialog: false,
      api: new Api(),
      headers: [
        {
          text: 'Kupac',
          align: 'left',
          sortable: true,
          value: 'Client.ime'
        },
        { text: 'Kupljeno', value: 'createdAt', sortable: true },
        {
          text: 'Status',
          value: 'status',
          align: 'center',
          sortable: false
        },
        {
          text: 'Prodato',
          // value: 'status',
          align: 'center'
        },
        { text: 'Avans', value: 'avanas' },
        { text: 'Ukupna Cena', value: 'cena' },
        { text: 'Rok Uplate', value: 'rokUplate' },
        { text: '', sortable: false },
        { text: 'Akcije', sortable: false }
      ],
      previewShow: false,
      documentId: 0,
      currentPlanId: 0,
      currentPrice: 0,
      updatePlans: false
    }
  },
  computed: {
    isPlanPayed () {
      if (this.planPayment.id == 0) return true
      var plan = this.plans.find(e => {
        return e.id == this.planPayment.id
      })
      return plan.status
    }

  },
  methods: {
    getPlanWithId (id) {
      var plan = this.plans.find(e => {
        return e.id == id
      })
      return new Plan(plan.id, plan.clientId, plan.neto, plan.status, plan.rokUplate, plan.avans, plan.napomena)
    },
    formatISODate (date) {
      if (date == null) return '-'
      return moment(date, moment.ISO_8601).format('DD MMM YYYY')
    },
    deleteItem (item) {
      this.planPayment = new Plan()
      this.conformationDialog = true
      this.planDeleteId = item.id
    },
    openPaymentDialog (id) {
      this.payment = new Payment()
      this.planPayment = this.getPlanWithId(id)
      this.paymentModal = true
    },
    soldServices (plan) {
      var message = plan.Tickets.length > 0 ? plan.Tickets[0].PassangersTickets.length + ' Karti' : ''
      message += plan.Arrangements.length > 0 ? plan.Arrangements.length + ' Aranžmana' : ''
      return message
    },

    async makePayment () {
      if (this.$refs.payment.paymentValid) {
        try {
          var response = await this.api.makePayment(this.planPayment.id, this.payment)
          if (response.data !== undefined) {
            this.payment = new Payment()
            this.updatePlans = new Date()
            this.planPayment = this.getPlanWithId(response.data.PlanId)
            this.$refs.payment.resetValidation()
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    },
    editItem (plan) {
      if (plan.Tickets.length > 0) {
        router.push({ path: `/dashboard/${plan.Tickets[0].type}-tickets-store/` + plan.id })
      } else {
        router.push({ path: `/dashboard/arrangment-store/` + plan.id })
      }
    },
    async deletePlan () {
      // IMPLEMENT Error Handling
      try {
        // let response = await this.api.deletePlansById(this.planDeleteId)
        await this.api.deletePlansById(this.planDeleteId)
        this.conformationDialog = false
        this.updatePlans = new Date()
      } catch (err) {
        toast.error('Neuspesno brisanje kupovine ' + err)
      }
    },
    async deletePayment (id) {
      let response = await this.api.deletePayment(id)
      if (response.data !== undefined) {
        this.payment = new Payment()
        this.updatePlans = new Date()
        this.planPayment = this.getPlanWithId(response.data.id)
        this.$refs.payment.resetValidation()
      }
    }
  }
}
</script>
<style>
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
