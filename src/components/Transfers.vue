<template>

<div class="">
  <navbar></navbar>
    <div class="col-6 ang"> 
      <hr class="custom"/>
      <div class="text-center" v-if="!customerAdded">
        <button class="btn btn-light" v-on:click.prevent="openDialog()"><i class="fas fa-plus-circle"></i>Dodaj Musteriju</button>
      </div>
      <hr class="custom"/>
      <div class=" forma">
      <b-form @submit="onSubmit"
                      label="Napravi Transfer">    
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
                      label="Polazak"
                      horizontal="true">
          <b-form-input id="polazak"
                        type="text"
                        v-model="form.polazak"
                        required
                        placeholder="Mesto polaska">
          </b-form-input>
        </b-form-group>
        <b-form-group id=""
                      label="Tip prevoza "
                      horizontal="true">
          <b-form-select id="prevoz"
                        type="text"
                        v-model="form.prevoz"
                        :options="prevoz"
                        required>
          </b-form-select>
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
          <b-button type="submit" variant="dark">Napravi Transfer</b-button>
      </b-form>
      </div>
    </div>
    <modal v-if="show" @closeModal="show = false"></modal> 
</div>

</template>

<script>
import Api from '@/services/api.js'
import PassangerModal from '@/components/helpers/PassangerModal'
import Customer from '@/models/Customer.js'
import NavBar from '@/components/helpers/NavBar'

export default {
    components: {
    'modal': PassangerModal,
    'navbar': NavBar
  },
  data () {
    return {
      customerAdded: false,
      show: false,
      angazmani: [],
      api: new Api(), 
      passengers: [],
      passanger: new Customer(),
      form: {
        destinacija: '',
        prevoz: null,
        polazak: '',
        cena: ''
      },
       prevoz: [
        {value: null, text:"Izaberete opciju"},
        {value:'vozilo', text:'vozilo'},
        {value:'taxi', text:'taxi'},
        {value:'bus', text:'autobus'}
      ]
    }
  },
  methods: {
    openDialog() {
      this.show = true;
    },
    onSubmit (evt) {
    }
  }
}
</script>

<style scoped>
.forma {
  margin-top: 5%;
  margin-left: 5%;
}
.ang {
  margin-left: 25%;
}
</style>

