<template>
  <v-card-text>
    <v-data-table
      v-if="payments" 
      :headers="paymentHeaders"
      :items="payments"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="justify-center layout px-0">
          <v-icon
            small
            @click="$emit('deletePayment', props.item.id)"
          >
            delete
          </v-icon>
        </td>
        <td class="text-xs-left">{{ formatISODate(props.item.paymentDate) }}</td>
        <td class="text-xs-center">{{ props.item.payment }}</td>
      </template>
      <template slot="footer">
        <tr class="gray">
          <td colspan="2">
            Do sada uplaceno (bez avansa)
          </td>
          <td class="text-xs-center">
            {{totalWithoutAvans}}
          </td>
        </tr>
        <tr class="gray">
          <td colspan="2">
            Do sada uplaceno (sa avansom)
          </td>
          <td class="text-xs-center">
            {{total}}
          </td>
        </tr>
        <tr class="gray">
          <td colspan="2">
            Dug
          </td>
          <td class="text-xs-center">
            {{rest}}
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-form ref="paymentForm" v-model="valid">
      <v-layout row wrap v-if="this.rest != 0 && !plan.status">
        <v-flex sm12 md5>
          <v-text-field
            v-model="paymentDate"
            prepend-icon="event"
            label="Datum Uplate"
            :rules="paymentDateRules"
            @blur="payment.paymentDate = parseDate(paymentDate)"
            mask="##.##.####"
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md5 offset-md1>
          <v-text-field
            prefix="€"
            v-model="payment.payment"
            :rules="amountRule"
            label="Kolicina uplate"
            transition="slide-y-transition"
            @change="limitInput"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-form>
  </v-card-text>
</template>
<script>
import Api from '@/services/api'
import moment from 'moment'

export default {
  name: 'Payment',
  props: {
    plan: {
      type: Object
    },
    payment: {
      type: Object
    }
  },
  data () {
    return {
      amountRule: [
        v => !!v || 'Kolicina uplate je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      paymentDateRules: [
        v => !!this.payment.paymentDate || 'Datum uplate je obavezan podatak',
        v => moment(v, 'DD.MM.YYYY').isValid() || 'Datum uplate nije validan, koristite format dan.mesec.godina',
        v => new Date(moment(v, 'DD.MM.YYYY')) > new Date() || 'Datum uplate polaska se ne nalazi u buducnosti'
      ],
      paymentDate: null,
      valid: false,
      menu: false,
      api: new Api(),
      paymentHeaders: [
        {
          text: 'Akcije',
          align: 'left',
          sortable: false
          // value: '.Client.'
        },
        {
          text: 'Datum Uplate',
          align: 'left',
          sortable: false
          // value: '.Client.'
        },
        {
          text: 'Kolicina Uplate',
          align: 'left',
          sortable: false
          // value: '.Client.'
        }
      ]
    }
  },
  computed: {
    paymentValid () {
      return this.$refs.paymentForm.validate()
    },
    total () {
      let allPaymentsSum = this.totalWithoutAvans
      return allPaymentsSum + parseInt(this.plan.avans || 0)
    },
    totalWithoutAvans () {
      if (this.payments == null) return 0
      return this.payments.reduce((acc, e) => {
        acc += parseInt(e.payment)
        return acc
      }, 0)
    },
    rest () {
      if(this.plan.neto == null){
        console.log(this.plan)
      }
      return this.plan.totalnaCena - this.total
    },
    paymentDateModel () {
      return this.payment.paymentDate
    }

  },
  asyncComputed: {
    payments: {
      get () {
        return this.api.getAllPayments(this.plan.id).then(res => res.data !== null ? res.data : [])
      },
      watch () {
        /* eslint no-unused-expressions: [2, { allowShortCircuit: true, allowTernary: true }] */
        this.plan.id
      }
    }
  },
  methods: {
    resetValidation () {
      this.$refs.paymentForm.reset()
    },
    formatISODate (date) {
      if (date == null) return '-'
      return moment(date, moment.ISO_8601).format('DD MMM YYYY')
    },
    limitInput (value) {
      if (parseInt(this.rest) < parseInt(value)) {
        this.payment.payment = this.rest
      }
    },
    parseDate (date) {
      if (!date) return null
      return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD').toString()
    }
  },
  watch: {
    paymentDateModel (val) {
      this.paymentDate = moment(val, moment.ISO_8601).format('DD.MM.YYYY').toString()
    }
  }
}
</script>
<style>

</style>
