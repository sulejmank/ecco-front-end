<template>
  <div>
    <v-tabs
      v-model="active"
      color="white "
      slider-color="green"
    >
      <v-tab
        :key="0"
        color="white"
      >
        PUTNICI

      </v-tab>
      <!-- <v-tab
        :key="1"
        color="white"
      >
        DESTINACIJE

      </v-tab>  -->
      <v-tab
        :key="2"
        color="white"
      >
        NOVAC

      </v-tab>
      <v-tab-item
        :key="0"
      >
        <v-card flat>
          <v-card-text>
            <v-layout px-5>
              <v-flex xs12 md5>
                <v-select
                  :items="searchProperties"
                  label="Filtriraj po"
                  v-model="property"
                  item-value="value"
                  item-text="title"
                ></v-select>
              </v-flex>
              <v-flex xs12 md6 offset-md1>
                <v-text-field
                  label="Kljucna rec"
                  prepend-icon="search"
                  v-model="keyWord"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 mb-3>
                <v-expansion-panel popout>
                  <customer-details :key='i' v-for="(customer, i) in customersFiltered" :customer="customer" @updateChanges="updateChanges"></customer-details>
                </v-expansion-panel>
              </v-flex>
            </v-layout>
          </v-card-text>
      
        </v-card>
        <!-- <pre>
          {{customersFiltered}}
        </pre> -->
      </v-tab-item>
      <!-- <v-tab-item
        :key="1"
      >
        <v-card flat>
          <v-card-text>
            <destination-statistics :destinations.sync="destinations" v-if="destinations"></destination-statistics>
          </v-card-text>
        </v-card>
      </v-tab-item> -->


      <v-tab-item
        :key="2"
      >
        
        <line-chart :data="lineChartOptions"></line-chart>
      
      
      </v-tab-item>
      
    </v-tabs>
  </div>  
</template>
<script>
import Api from '@/services/api'
import CustomerDetails from '@/component-details/CustomerDetails'
import DestinationStatistics from '@/statistics/DestinationStatistics'
import LineChart from '@/charts/LineChart'

export default {
  name: 'Statistics',
  data () {
    return {
      lineChartOptions: {
        title: 'Prodaja u toku godine',
        subtitle: '',
         xAxis: {
        tickInterval: 7 * 24 * 3600 * 1000, // one week
        tickWidth: 0,
        gridLineWidth: 1,
        
        },
        plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },
        type: ''
      },
      active: 0,
      api: new Api(),
      property: null,
      keyWord: '',
      updateCustomers: new Date(),
      updateDestinations: new Date(),
      searchProperties: [
        {
          title: 'Ime i prezime',
          value: 'imePrezime'
        }

      ]
    }
  },
  components: {
    'customer-details': CustomerDetails,
    'destination-statistics': DestinationStatistics,
    'line-chart': LineChart
  },
  asyncComputed: {
    customers: {
      get () {
        return this.api.getCustomerStatistics().then(res => {
          res.data = res.data.map(c => {
            c.imePrezime = c.ime + " " + c.prezime
            return c
          })
          return res.data !== null ? res.data : []
        })
      },
      watch () {
        this.updateCustomers
      }
    },
    destinations: {
      get () {
        return this.api.getDestinationsStatistics().then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateDestinations
      }
    }
  },
  methods: {
    updateChanges () {
      this.updateCustomers = new Date()
    }
  },
  computed: {
    customersFiltered () {
      if (this.customers === null) return []
      return this.customers.filter(c => {
        if (this.property === null) return true
        return c[this.property].toString().includes(this.keyWord)
      })
    }
  }
}
</script>
<style>

</style>

