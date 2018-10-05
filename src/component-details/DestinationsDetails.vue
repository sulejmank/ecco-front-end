<template>
  <v-layout>
    <v-flex sm6>
      <div align-center>
        <v-toolbar flat color="white" class="elevation-1">
          <v-toolbar-title>Destinacije</v-toolbar-title>
          <v-divider
            class="mx-2"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="destinations == null ? [] : destinations"
          :loading="destinations == null"
          hide-actions
          class="elevation-1"
        >
          <v-progress-linear slot="progress" color="blue" indeterminate ></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-left">
                {{ props.item.destinacija}}
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-flex>
    <v-flex sm6 style="height:500px">
      <pie-chart :data="destinationOptions"></pie-chart>
    </v-flex>
  </v-layout>
</template>
<script>
import PieChart from '@/charts/PieChart'

export default {
  name: 'DestinationsDetails',
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
        headers: [
        {
          text: 'Destinacija',
          align: 'left',
          sortable: true,
          value: 'destinacija'
        },
        // {
        //   text: 'Destinacija',
        //   align: 'left',
        //   sortable: false,
        //   value: 'destinacija'
        // }
      ],
      destinationOptions: {
        title: 'Destinacije Musterije',
        subtitle: '',
        type: 'Destinacija posecena:',
        series: this.destinations.map(d => [d.destinacija, d.count])
      }
    }
  },
  methods: {
    callback () {
      console.log('triggered')
    }
  }
}
</script>
<style>

</style>


