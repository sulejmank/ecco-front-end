<template>
  <v-card-text>
    <v-form v-model="valid" ref="hotelForm">
      <v-layout row wrap>

        <v-flex sm12>
          <v-text-field
            v-model="hotel.name"
            :rules="nameRules"
            label="Ime Hotela"
            required
          ></v-text-field>
        </v-flex>

      </v-layout>
    </v-form>
  </v-card-text>
</template>

<script>

import Api from '@/services/api.js'
import toast from '@/services/toast'
import moment from 'moment'

export default {
  name: 'Hotel',

  props: {
    hotel: {
      type: Object
    }
  },
  data () {
    return {
      valid: false,
      nameRules: [
        v => !!v || 'Ime Hotela je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
    }
  },
  computed: {
    isValid () {
      return this.$refs.hotelForm.validate()
    }
  },
  methods: {
  },
  watch: {
  },
  mounted () {

  }
}
</script>

<style>
.menuable__content__active{
  min-width: 0 !important;
}
</style>
