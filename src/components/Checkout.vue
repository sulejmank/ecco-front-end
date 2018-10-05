<template>
  <v-form v-model="valid" ref="payment">
    <v-layout>
      <v-flex xs8 md6 offset-md2 >
        <v-textarea
          solo
          elevation-3
          name="input-7-4"
          label="Napomena"
          v-model="checkout.notes"
        ></v-textarea>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex sm12 md5 >
        <v-text-field
          v-model="checkout.neto"
          label="Neto Cena Karti"
          prefix="€"
          type="number"
          :rules="netoRules"
          transition="slide-y-transition"
        ></v-text-field>
      </v-flex>
      <v-flex sm12 md5 offset-sm1>
        <v-text-field
          v-model="checkout.bruto"
          label="Bruto Cena Karti"
          prefix="€"
          type="number"
          :rules="brutoRules"
          transition="slide-y-transition"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-switch
          :label="`${ avans ? 'Sa avansom ' : 'Bez avansa'}`"
          v-model="avans"
          @change="avansDisabled"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="avans">
      <v-flex sm12 md5 >
        <v-text-field
          v-model="checkout.avans"
          label="Uplacen avans u iznosu"
          prefix="€"
          type="number"
          transition="slide-y-transition"
          @change="limitInput"
        ></v-text-field>
      </v-flex>
      <v-flex sm12 md5 offset-sm1>
        <v-text-field
          v-model="dueDate"
          prepend-icon="event"
          label="Uplata dozvoljena do"
          :rules="avans ? dueDateRules : []"
          @blur="checkout.rokUplate = parseDate(dueDate)"
          mask="##.##.####"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-form>
</template>
<script>
import moment from 'moment'
// import Api from '@/services/api.js'

export default{
  name: 'Checkout',
  components: {
  },
  props: {
    checkout: {
      default: undefined,
      type: Object
    }
  },
  data () {
    return {
      avans: false,
      dueDate: null,
      valid: false,
      netoRules: [
        v => !!v || 'Neto cena je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      brutoRules: [
        v => !!v || 'Bruto cena je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      dueDateRules: [
        v => !!this.checkout.rokUplate || 'Datum poslednje uplate je obavezan podatak',
        v => moment(v, 'DD.MM.YYYY').isValid() || 'Datum poslednje uplate nije validan, koristite format dan.mesec.godina',
        v => new Date(moment(v, 'DD.MM.YYYY')) > new Date() || 'Datum poslednje uplate polaska se ne nalazi u buducnosti'
      ]
    }
  },
  computed: {
    checkoutPaymentDateModel () {
      return this.checkout.rokUplate
    },
    checkoutValid () {
      return this.$refs.payment.validate()
    }
  },
  filters: {
    decimal: function (value) {
      if (!value) return ''
      value = value.toString().split('.')
      return value[0] + '.' + (value[1] !== undefined ? value[1] : '00')
    }
  },
  methods: {
    limitInput (value) {
      if (parseInt(this.checkout.neto) < parseInt(value)) {
        this.checkout.avans = this.checkout.neto
      }
    },
    parseDate (date) {
      if (!date) return null
      return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD').toString()
    },
    toDin () {
      this.api.euroToRsd().then(res => {
        var str = res.data
        var match = str.substring(str.lastIndexOf('{'), str.lastIndexOf('}'))
        this.$store.commit('setCustomerId', JSON.parse(match).val)
      })
    },
    avansDisabled (val) {
      if (!val) {
        this.checkout.avans = null
        this.checkout.rokUplate = null
      } else {
        let currentYear = parseInt(new Date().getYear()) + 1900
        this.checkout.rokUplate = currentYear + '-12-31'
      }
    }
  },
  watch: {
    checkoutPaymentDateModel (val) {
      this.dueDate = moment(val, moment.ISO_8601).format('DD.MM.YYYY').toString()
    }
  }
}
</script>
<style>
</style>
