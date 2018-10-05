<template>
  <vue-highcharts :options="options"></vue-highcharts>
</template>
<script>
import VueHighcharts from 'vue2-highcharts'
import Api from '@/services/api.js'
import Plan from '@/models/Plan'

export default {
  name: 'LineChart',
  components: {
    VueHighcharts
  },
  
  props: {
    data: {
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
   asyncComputed: {
    plans: {
      get () {
        return this.api.getPlans().then(res => {
            this.progress = false
            let data = res.data
            if(data.length > 0) {
                data.map(x => {
                    let arr = [];
                   let date = x.createdAt.toString()
                    arr.push(date);
                    arr.push(x.neto)

                    this.incomeData.push(arr)
                    this.options.series[0].setData(this.incomeData)
                })
                console.log(this.incomeData)
            }    
           
          })
      },
      watch () {
        this.updatePlans
      }
    }
  },
  data () {
    return {
        api: new Api(),
        incomeData: [],
      options: {
        chart: {
          type: 'line',
           th: 1
        },
          options3d: {
              enabled: true,
              alpha: 45
          },
        title: {
            text: 'Prodaja'
        },
        subtitle: {
            text: 'u toku godine'
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
         yAxis: [{ // left y axis
            title: {
            text: 'Prihod u eurima'
        }}],
      
        legend: {
        align: 'left',
        verticalAlign: 'top',
        borderWidth: 0
    },
        series: [{
            name: 'Prihod',
            data: [
                ['2.5.2018', 3200],
                ['2.9.2018', 1200],
                ['4.9.2018', 2200],
                ['2.11.2018', 6200]
            ]
        }]
      }
    }
  }
}
</script>
<style>

</style>
