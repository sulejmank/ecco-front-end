<template>
  <v-card-text>
    <v-form v-model="valid" ref="userForm">
      <v-layout row wrap>

        <v-flex sm12>
          <v-text-field
            v-model="user.name"
            :rules="nameRules"
            label="Ime"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex sm12>
          <v-text-field
            v-model="user.surname"
            :rules="surnameRules"
            label="Prezime"
            required
          ></v-text-field>
        </v-flex>

      </v-layout>

      <v-layout row wrap>
        <v-flex sm12>
          <v-text-field
            v-model="user.email"
            label="E-Mail"
            transition="slide-y-transition"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex sm12>
          <v-text-field
            :append-icon="show ? 'visibility_off' : 'visibility'"
            :rules="passwordRules"
            :type="show ? 'text' : 'password'"
            label="Sifra"
            v-model="user.password"
            transition="slide-y-transition"
            @click:append="show = !show"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex sm12>
          <v-text-field
            v-model="user.username"
            label="Korisnicko Ime"
            :rules="usernameRules"
            transition="slide-y-transition"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-select
          v-model="user.role"
          :items="userRolesPicklist"
          item-text="title"
          item-value="value"
          label="Permisije"
        ></v-select>
      </v-layout>
    </v-form>
  </v-card-text>
</template>

<script>
// import Customer from '@/models/Customer.js'
// import router from '@/router'
import Api from '@/services/api.js'
import toast from '@/services/toast'
import moment from 'moment'

export default {
  name: 'User',

  props: {
    user: {
      type: Object
    }
  },
  data () {
    return {
      valid: false,
      show: false,
      // TODO: Move Rules to separate JS Class
      nameRules: [
        v => !!v || 'Ime Musterije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      surnameRules: [
        v => !!v || 'Prezime Musterije je obavezan podatak'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      usernameRules: [
        v => !!v || 'Korisnicko ime je obavezan podatak'
      ],
      passwordRules: [
        v => !!v || 'Sifra je obavezan podatak',
      ],
      api: new Api(),
    }
  },
  asyncComputed: {
    async userRolesPicklist () {
      let response = await this.api.getPicklist('role')
      return response.data
    }
  },
  computed: {
    isValid () {
      return this.$refs.userForm.validate()
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
