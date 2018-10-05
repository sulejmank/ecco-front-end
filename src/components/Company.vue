<template>
  <v-card-text>
    <v-form v-model="valid" ref="companyForm">
      <v-layout row wrap>

        <v-flex sm12>
          <v-text-field
            v-model="company.name"
            :rules="nameRules"
            label="Ime Kompanije"
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
  name: 'Company',

  props: {
    company: {
      type: Object
    }
  },
  data () {
    return {
      valid: false,
      nameRules: [
        v => !!v || 'Ime Kompanije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
    }
  },
  computed: {
    isValid () {
      return this.$refs.companyForm.validate()
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
