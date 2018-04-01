<template>
  <div class="container " id="tabs">
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Avio karte" active>
           <div class="card  bg-light container col-8 mb-5" v-for="karta in karte" :key="karta.id" id="karta">    
            <div class="card-header text-center">Avio Karta</div>
              <div class="card-body custom-card-body">
                <b-btn v-b-toggle.collapse1 variant="dark" class="btn put" v-on:click.prevent="Putnik(karta.KlijentId)" >Putnik</b-btn>
                  <b-collapse id="collapse1" class="mt-2">
                    <b-card>
                       <p class="card-text text-center" v-if="putnik.id === karta.KlijentId"><strong>{{putnik.ime + ' ' + putnik.prezime}}</strong></p>
                    </b-card>
                  </b-collapse><br>
                  <hr class="custom-hr">
                  <p class="sized-margins">Od: <strong style="float:right">{{karta.putovanjeOd}}</strong></p>
                  <p class="text-center trip"><i :class="{'fas fa-long-arrow-alt-down': !karta.jedanParvac, 'fas fa-arrows-alt-v': karta.jedanParvac}"></i></p>
                  <p class="sized-margins">Do: <strong style="float:right">{{karta.putovanjeDo}}</strong></p>
                  <p class="sized-margins">Cena: <strong style="float:right">{{karta.cena | decimal }}€</strong></p>
                  <p class="sized-margins">Datum Polaska: <strong style="float:right">{{karta.datumPolaska}}</strong></p>
                  <p class="sized-margins" v-if="karta.jedanParvac">Datum povratka: <strong style="float:right">{{karta.datumDolaska}}</strong></p>
                  <p class="sized-margins">Avio kompanija: <strong style="float:right">{{karta.avioKompanija}}</strong></p>
                  <p class="sized-margins">Broj rezervacije: <strong style="float:right">{{karta.brojRezervacije}}</strong></p>
                  <p class="sized-margins text-center" v-if="karta.potvrdjeno"><strong >Potvrdjeno</strong></p>
                  <hr class="custom-hr">
                  <button class="btn btn-dark put text-center" v-on:click.prevent="check(karta.id)" v-if="!karta.potvrdjeno">Potvrdi kartu</button>
              </div>
          </div>
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


</style>