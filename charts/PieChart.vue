<template>
  <vue-highcharts :options="options"></vue-highcharts>
</template>
<script>
import VueHighcharts from 'vue2-highcharts'

export default {
  name: 'PieChart',
  components: {
    VueHighcharts
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          title: 'No Title',
          subtitle: 'No Subtitle',
          type: 'No Type:',
          series: [
            ['No Series', 1]
          ]
        }
      }
    }
  },
  data () {
    return {
      options: {
        chart: {
          type: 'pie',
          options3d: {
              enabled: true,
              alpha: 45
          }
        },
        title: {
            text: this.data.title
        },
        subtitle: {
            text: this.data.subtitle
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: [{
            name: this.data.type,
            data: this.data.series
        }]
      }
    }
  }
}
</script>
<style>

</style>
