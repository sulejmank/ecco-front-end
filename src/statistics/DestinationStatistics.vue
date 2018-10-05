<template>
  <v-layout justify-center row wrap>
    <v-flex sm3 class="text-center" px-5>
      <h1>
        {{totalNumberOfPassangers}}
      </h1>
      <small> Ukupan Broj Putovanja (ukljucuje i putnike koji vise puta putovali)</small>
    </v-flex>
    <v-flex sm3 class="text-center" px-5>
      <h1>
        {{unique(passangers).length}}
      </h1>
      <small> Ukupan Broj osoba koje su putovale</small>
    </v-flex>
    <v-flex sm3 class="text-center" px-5>
      <h1>
        {{totalNumberOfPassangers}}
      </h1>
      <small> Ukupan Broj putnika (ukljucuje i putnike koji vise puta putovali)</small>
    </v-flex>
    <v-flex sm3 class="text-center" px-5>
      <h1>
        {{totalNumberOfPassangers}}
      </h1>
      <small> Ukupan Broj putnika (ukljucuje i putnike koji vise puta putovali)</small>
    </v-flex>
    <v-flex>
      <div>
        <pie-chart :data="destinationOptions"></pie-chart>
      </div>
    </v-flex>
    <v-flex sm12>
      <v-expansion-panel popout>
        <v-expansion-panel-content v-for="destination in destinations" :key="destination.id" v-if="getPassangers(destination).length > 0">
          <div slot="header" class="header">
            <span class="name-heading">{{destination.destinacija}} </span>
            <span>{{getPassangers(destination).length }} Putnika</span>
            <!-- <span class="danger-message" v-if="haveDept">
              <v-icon
                small
                color="red"
              >
                error
              </v-icon>
            Neplaceni dugovi
            </span>   -->
          </div>
          <v-card>

          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <pre>{{destinations}}</pre>

    </v-flex>
  </v-layout>
</template>
<script>
import _ from 'lodash'
import PieChart from '@/charts/PieChart'

export default {
  name: 'DestinationStatistics',
  props: {
    destinations: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'pie-chart': PieChart
  },
  data () {
    return {
      destinationOptions: {
        title: 'Destinacije Musterije',
        subtitle: '',
        type: 'Destinacija posecena:',
        series: this.destinations.filter(t => this.getPassangers(t).length > 0 )
                                  .map(d => [d.destinacija, this.getPassangers(d).length])
      }
    }
  },
  computed: {
    totalNumberOfPassangers () {
      if (this.destinations == null) return 0
      return this.destinations.reduce((acc, d) => {
        acc += d.Arrangements.reduce((add, a) => {
          add += a.PassangersArrangements.length
          return add
        }, 0)
        acc += d.Arrival.reduce((agg, t) => {
          agg += t.PassangersTickets.length
          return agg
        }, 0)
        return acc
      }, 0)
    },
    passangers () {
      if (this.destinations == null) return []
      let passangers = this.destinations.reduce((acc, d) => {
        acc.push.apply(acc, ...d.Arrangements.map(a => {
          return a.PassangersArrangements.map(pa => pa.Passanger != null ? pa.Passanger : pa.ClientPassanger)
        }))
        acc.push.apply(acc, ...d.Arrival.map(a => {
          return a.PassangersTickets.map(pa => pa.Passanger != null ? pa.Passanger : pa.ClientPassanger)
        }))
        return acc
      }, [])
      return passangers
    }
  },
  methods: {
    getPassangers (destination) {
      let passangers = [];
      passangers.push.apply(passangers, ...destination.Arrangements.map(a => {
        return a.PassangersArrangements.map(pa => pa.Passanger != null ? pa.Passanger : pa.ClientPassanger)
      }))
      passangers.push.apply(passangers, ...destination.Arrival.map(a => {
        return a.PassangersTickets.map(pa => pa.Passanger != null ? pa.Passanger : pa.ClientPassanger)
      }))
      return passangers
    },
    unique (array) {
      return _.uniqBy(array, 'id')
    }
  }
}
</script>
<style>
.text-center {
  text-align: center;
}
</style>
