<template>

<div class="">
  <navbar></navbar>
    <div class="col-3 ang"> 
      <hr class="custom"/>
      <div class="text-center" v-if="!customerAdded">
        <button class="btn btn-light" v-on:click.prevent="openDialog()"><i class="fas fa-plus-circle"></i>Dodaj Musteriju</button>
      </div>
      <hr class="custom"/>
      
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
    }
  },
  methods: {
    openDialog() {
      this.show = true;
    },
    reset() {
        this.form.destinacija = ' ',
        this.form.usluge = null,
        this.form.usluznaKompanija = ' ',
        this.form.hotel = ' ',
        this.form.strukturaSobe =  null,
        this.form.cena = ' '
    },
  },
  beforeMount() {

  }
}
</script>

<style scoped>
.forma {
  margin-top: 5%;
  margin-left: 5%;
}
.ang {
  margin-left: 35%;
}
</style>

