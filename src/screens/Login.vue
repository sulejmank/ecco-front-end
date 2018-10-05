<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height grid-list-md text-xs-center>
        <v-layout row align-center justify-center wrap>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar>
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="Login" type="text" v-model="user.username"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password" v-model="user.password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-on:click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import router from '@/router'
import User from '@/models/User'
import Api from '@/services/api.js'

export default {
  name: 'LogIn',
  data: () => ({
    user: new User(),
    api: new Api(),
    showError: false
  }),
  methods: {
    async login () {
      let response = await this.api.login(this.user.username, this.user.password)
      this.$store.commit('setLoggedInUser', response.data)
      window.localStorage.setItem('user', JSON.stringify(response.data))
      router.push({ path: `/dashboard` })
    }
  }
}
</script>
<style>
  #error-handler{
    position:fixed;
    bottom: 0;
    width:100%;
    padding:0 5%;
    background-color: transparent;
  }
</style>
