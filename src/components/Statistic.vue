<template>
  <div class="container " id="tabs">
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Avio karte" active> 
          <b-table striped hover :items="karte" :fields="fields"></b-table>
        </b-tab>
        <b-tab title="Nove kupovine">
        </b-tab>
        <b-tab title="Neplacene kupovine">
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import Api from '@/services/api.js'

  export default {
    data() {
      return {
        value: 1,
        fields: ['putovanjeOd', 'putovanjeDo','jedanParvac','datumPolaska','brojRezervacije','cena'],
        karte: [],
        api: new Api(),
        putnik: {}
      }
    },
    methods: {
      getKarte () {
          this.api.getKarte()
          .then(res => {
            console.log(res)
            for(let i = 0; i < res.data.length; i++) {
              this.karte.push(res.data[i])
            }
          })
      },
      Putnik (id) {
        console.log(id)
        this.api.getPutnik(id)
          .then(res => {
            console.log(res);
            if(res.status == 200){
              this.putnik = {}
              this.putnik = res.data[0]
            }
          })
      },
      check (id) {
        this.api.checkTicket (id)
          .then(res => {
            if (res.status == 200){
              this.karte = []
              this.getKarte()
            }
            else
              console.log(res)
          })
      }
    },
    beforeMount() {
      this.getKarte()
    }
  }
</script>

<style scoped>
#tabs {
  margin-top:2%;
}
.put {
  width: 100%;
}
.trip{
  margin-bottom:0;
  font-style:1.5em
}

</style>