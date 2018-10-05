<template>
  <v-layout align-center row>
    <v-flex>
      <v-toolbar flat color="white" class="elevation-1">
        <v-toolbar-title>Radnici</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2" @click="newUserInstance()">
            <v-icon>{{ "person_add" }}</v-icon> Dodaj Korisnika
          </v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">Dodaj Korisnika</span>
            </v-card-title>

            <v-card-text>
              <user :user="user" ref="user"></user>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="dialog = false">Odustani</v-btn>
              <v-btn color="blue darken-1" flat @click.native="saveUser">{{user.id != null ? 'Izmeni Korisnika' : 'Dodaj Korisnika'}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        v-if="users"
        :headers="headers"
        :items="users"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">
            <v-avatar size="25px" tile>
              <img
                :src="props.item.imageUrl"
                alt="Customer Avatar"
              >
            </v-avatar>
            {{ props.item.name }}
          </td>
          <td class="text-xs-left">
            {{ props.item.surname}}
          </td>
          <td class="text-xs-left">{{ props.item.username}}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <!-- <td class="text-xs-left">{{ props.item.password }}</td> -->
          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              class="mr-2"
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
      <!-- <pre>{{users}}</pre> -->
    </v-flex>
    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="conformationDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Upozorenje</span>
        </v-card-title>

        <v-card-text>
          <p>Da li zelite izbrisati ovog Korisnika ?</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="conformationDialog = false">Odustani</v-btn>
          <v-btn color="blue darken-1" flat @click.native="deleteUser()">Nastavi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from 'moment'
import router from '@/router'
import Api from '@/services/api.js'
import User from '@/models/User.js'
import UserComponent from '@/components/User'

export default {
  name: 'UsersList',
  data: () => ({
    conformationDialog: false,
    user: new User(),
    conformationDialog: false,
    updateUsers: 0,
    dialog: false,
    api: new Api(),
    headers: [
      {
        text: 'Ime',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Przime',
        align: 'left',
        sortable: false,
        value: 'surname'
      },
      // { text: 'Hotel', value: 'hotel' },
      { text: 'Korisnicko Ime', value: 'username' },
      { text: 'E-mail', value: 'email' },
     // { text: 'Sifra', value: 'password' },
      { text: 'Akcije', value: 'role', align: 'center' },
    ],
    editedIndex: -1
  }),
  components: {
    'user': UserComponent
  },
  asyncComputed: {
    users: {
      get () {
        return this.api.getAllUsers().then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateUsers
      }
    }
  },

  watch: {
  },

  methods: {
    parseDate (date) {
      return moment(date, moment.ISO_8601).format('DD.MM.YYYY').toString()
    },
    close () {
      this.conformationDialog = false
    },
    editItem (item) {
      this.user = item
      this.dialog = true
    },
    deleteItem (item) {
      this.user = item
      this.conformationDialog =  true
    },
    newUserInstance () {
      this.user = new User()
    },
    async saveUser () {
      if (this.$refs.user.isValid) {
        try {
          let response = await this.api.addUser(this.user)
          this.updateUsers = new Date()
          this.dialog = false
        } catch (err) {
          toast.error(err.toString())
        }
      }
    },
    async deleteUser () {
      try {
        let response = await this.api.deleteUser(this.user.id)
        this.updateUsers = new Date()
        this.user = new User()
        this.conformationDialog = false
      } catch (err) {
        toast.error(err.toString())
      }
    }

  },
  mounted () {
  }
}
</script>
<style>
</style>
