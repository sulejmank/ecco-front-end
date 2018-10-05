<template>
  <v-card-text>
    <v-form v-model="valid" ref="picklistForm">
      <v-layout row wrap>

        <v-flex sm12>
          <v-text-field
            v-model="picklist.title"
            :rules="titleRules"
            label="Naslov Opcije"
            required
          ></v-text-field>
        </v-flex>

      </v-layout>
      <v-layout row wrap>

        <v-flex xs12>
          <v-textarea
            solo
            elevation-3
            name="input-7-4"
            label="Opis Opcije"
            v-model="picklist.description"
          ></v-textarea>
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
  name: 'PicklistOption',

  props: {
    picklist: {
      type: Object
    }
  },
  data () {
    return {
      valid: false,
      titleRules: [
        v => !!v || 'Naslov opcije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
    }
  },
  computed: {
    isValid () {
      return this.$refs.picklistForm.validate()
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
