<template>
<div class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
    
      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">Putnik</h4>
        <button type="button" class="close" data-dismiss="modal" v-on:click="dissmis">&times;</button>
      </div>
      
      <!-- Modal body -->
      <div class="modal-body">
        <customer v-bind:isPassenger="isPassanger" @addPassenger='addPassenger'></customer>
        <div class="container">
          <div class="row">
            <div class="col text-right">
              <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="addPassenger">Dodaj Putnika</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="dissmis">Close</button>
            </div>
          </div>
        </div>
      </div>      
    </div>
  </div>
</div>
</template>
<script>
import Customer from '@/components/Customer'

export default {
  name:'PassangerModal',
  props:{
    show:{
      type: Boolean
    }
  },
  components: {
    'customer': Customer
  },
  data () {
    return {
      isPassanger: true
    }
  },
  methods: {
    dissmis () {
      this.$emit('closeModal')
    },
    addPassenger (event) {
      console.log(event)
      this.dissmis()
      this.$emit("addCustomer", event)
    }
  },

}
</script>
<style>
.modal{
  display:block;
}
</style>
