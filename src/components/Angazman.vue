<template>
 <div class="row forma">
   <div class="col-4 ang">
      <div class="card bg-light mb-3">
        <div class="card-header">Aganzmani</div>
          <div class="card-body custom-card-body" v-for="angazman in angazmani" :key="angazman.id">
            <p class="card-title text-center trip"></p>
            <p class="sized-margins">Destinacija: <strong style="float:right">{{angazman.destinacija}}</strong></p>
            <p class="sized-margins">Hotel: <strong style="float:right">{{angazman.hotel}}</strong></p>
            <p class="sized-margins">Struktura sobe: <strong style="float:right">{{angazman.strukturaSobe}}</strong></p>
            <p class="sized-margins">Usluga: <strong style="float:right">{{angazman.usluge}}</strong></p>
            <p class="sized-margins">Datum Polaska: <strong style="float:right">{{angazman.datumPocetka.toString("mm-dd-yyyy hh:mm")}}</strong></p>
            <p class="sized-margins">Datum Zavrsetka: <strong style="float:right">{{angazman.datumZavrsetka}}</strong></p>
            <p class="sized-margins">Usluzna kompanija: <strong style="float:right">{{angazman.usluznaKompanija}}</strong></p>
            <p class="sized-margins">Broj putnika: <strong style="float:right">{{angazman.brojPutnika}}</strong></p>
            <p class="sized-margins">Cena: <strong style="float:right">{{angazman.cena | decimal }}€</strong></p>
              <br>
            <div  class="col text-center">
            <button class="btn btn-default"  v-on:click.prevent="addPassenger" type="button"><i class="fas fa-plus-circle"></i>Dodaj Putnika</button><br>            <hr class="custom-hr">

            </div>
            <div class="col card-header custom-card-body text-center" v-if="$store.state.passangers.length > 0">
              <div v-for="(pass, index) in $store.state.passangers" :key="pass.id">
                <p class="sized-margins">{{index + 1 + '.  '}}<i>Putnik: </i> <strong style="align:center">{{' ' +pass.ime + ' '}}{{pass.prezime}}</strong></p>
                <b-button style="align:center" class="btn btn-default " v-on:click.prevent="addToAngazman(pass.id, angazman.id)" variant="dark">Sacuvaj</b-button> <br>
              </div>
            </div> 
            <hr class="custom-hr">
          </div>
        </div>
      </div>
      <div class="col-6 forma">
      <b-form @submit="onSubmit"
                      label="Napravi Angazman">    
        <b-form-group 
                      label="Destinacija"
                      label-for="destinacijaInput"
                      horizontal="true">
          <b-form-input id="destinacijaInput"
                        type="text"
                        v-model="form.destinacija"
                        required
                        placeholder="Unesite destinaciju">
          </b-form-input>
        </b-form-group>
        <b-form-group 
                      label="Hotel"
                      horizontal="true">
          <b-form-input id="hotelInput"
                        type="text"
                        v-model="form.hotel"
                        required
                        placeholder="Naziv hotela">
          </b-form-input>
        </b-form-group>
        <b-form-group id=""
                      label="Struktura sobe"
                      horizontal="true">
          <b-form-select id="strukturaSobe"
                        type="text"
                        v-model="form.strukturaSobe"
                        :options="strukture"
                        required>
          </b-form-select>
        </b-form-group>
        <b-form-group id=""
                      label="Usluga"
                      horizontal="true">
          <b-form-select id="usluga"
                        type="text"
                        v-model="form.usluge"
                        :options = "usluge"
                        required>
          </b-form-select>
        </b-form-group>
        <b-form-group id=""
                      label="Datum Pocetka"
                      horizontal="true">
          <b-form-input id="datumPocetka"
                        type="date"
                        v-model="form.datumPocetka"
                        required>
          </b-form-input>
        </b-form-group>
        <b-form-group id=""
                      label="Datum Zavrsetka"
                      horizontal="true">
          <b-form-input id="datumZavrsetka"
                        type="date"
                        v-model="form.datumZavrsetka"
                        required>
          </b-form-input>
        </b-form-group>
        <b-form-group id=""
                      label="Usluzna Kompanija"
                      horizontal="true">
          <b-form-input id="usluznaKompanija"
                        type="text"
                        v-model="form.usluznaKompanija"
                        required
                        placeholder="Usluzna kompanija">
          </b-form-input>
        </b-form-group>
        <b-form-group id=""
                      label="Cena"
                      horizontal="true">
          <b-form-input id="cena"
                        type="text"
                        v-model="form.cena"
                        required
                        placeholder="€ 0,00">
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="dark">Napravi Aganzman</b-button>
      </b-form>
    </div>
    <modal v-if="show" @closeModal="show = false"></modal>
  </div>
</template>

<script>
import Angazman from '@/models/Angazman.js'
import Api from '@/services/api.js'
import PassangerModal from '@/components/helpers/PassangerModal'
import Customer from '@/models/Customer.js'

export default {
    components: {
    'modal': PassangerModal
  },
  data () {
    return {
      form: {
        destinacija: '',
        usluge: null,
        datumPocetka: '',
        datumZavrsetka: '',
        usluznaKompanija: '',
        hotel:'',
        strukturaSobe: null,
        cena: ''
      },
      show: false,
      angazmani: [],
      angazman: new Angazman(),
      api: new Api(), 
      passengers: [],
      passanger: new Customer(),
      strukture: [
        {value: null, text:"Izaberete opciju"},
        {value:'1-krevetna', text:'1-krevetna'},
        {value:'2-krevetna', text:'2-krevetna'},
        {value:'3-krevetna', text:'3-krevetna'},
        {value:'4-krevetna', text:'4-krevetna'}
      ],
      usluge: [
        {value: null, text:"Izaberete opciju" },
        {value: 'polu-pansion', text: "Polu-Pansion"},
        {value: 'pun-pansion', text: "Pun-Pansion"},
        {value: 'bez', text: "Bez"}
      ]
    }
  },
  methods: {
    onSubmit (evt) {
      this.angazman = {
        destinacija: this.form.destinacija,
        usluge: this.form.usluge,
        datumPocetka: this.form.datumPocetka,
        datumZavrsetka: this.form.datumZavrsetka,
        usluznaKompanija: this.form.usluznaKompanija,
        hotel: this.form.hotel,
        strukturaSobe: this.form.strukturaSobe,
        cena: this.form.cena
      };
      console.log(this.angazman.strukturaSobe)
      this.api.saveAngazman(this.angazman)
        .then(res => {
          console.log(res)
          if(res.status === 200) {
            this.getAngazmani()
            this.reset()
          }
        })
        .catch(err => {
          console.log(err)
        })
      evt.preventDefault();
    },
    reset() {
        this.form.destinacija = '',
        this.form.usluge = null,
        this.form.datumPocetka = '',
        this.form.datumZavrsetka = '',
        this.form.usluznaKompanija = '',
        this.form.hotel = '',
        this.form.strukturaSobe =  null,
        this.form.cena = ''
    },
    addCustomer (event) {
     // console.log(event);
      this.passangers.push(event)
      //console.log(this.passenger)
    },
    getAngazmani() {
      this.api.getAngazmani()
        .then(res => {
          console.log(res)
          for(let i = 0; i < res.data.length; i++)
            this.angazmani.unshift(res.data[i])   
          console.log(angazmani)
      })
    },
    addPassenger (event) {
      this.show = true
      console.log(event)
    },
    addToAngazman (idPutnika, idAngazmana) {
      this.api.addPassToAng(idPutnika, idAngazmana)
        .then(res => {
          if(res.status === 200)
          this.$store.commit('removePassanger', idPutnika)
          this.getAngazmani()
            alert("Sacuvano!")
          this.removePassanger(idPutnika)
        })
      },
    removePassanger (i) {
      this.$store.commit('removePassanger', i)
    }
  },
  beforeMount() {
    this.getAngazmani()
    //let pass = this.$store.getters.getCurentPassengers;
   console.log(this.passenger);
  }
}
</script>

<style scoped>
.forma {
  margin-top: 5%;
  margin-left: 5%;
}
</style>

