<template>
<v-layout align-center row>
  <v-flex>
    <v-toolbar flat color="white" class="elevation-1">
      <v-toolbar-title>Mušterije</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2" @click="newCustomerInstance()">
          <v-icon>{{ "person_add" }}</v-icon> Dodaj Musteriju
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Dodaj Musteriju</span>
          </v-card-title>

          <v-card-text>
            <customer :customer="customer" ref="form"></customer>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="closeCustomerDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="saveCustomer">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="conformationDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Upozorenje</span>
          </v-card-title>

          <v-card-text>
            <p>Da li zelite izbrisati korisnika ?</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Odustani</v-btn>
            <v-btn color="blue darken-1" flat @click.native="deleteCustomer">Nastavi</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      v-if="customers"
      :headers="headers"
      :items="customers"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          <v-avatar size="25px" tile>
            <img
              :src="props.item.urlSlike"
              alt="Customer Avatar"
            >
          </v-avatar>
          {{ props.item.prezime + ", " + props.item.ime }}
        </td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.brojTelefona }}</td>
        <td class="text-xs-left">{{ props.item.brojPasosa }}</td>
        <td class="text-xs-left">{{ props.item.adresa }}</td>
        <td class="text-xs-left">{{ props.item.struka }}</td>
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
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <!-- <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template> -->
    </v-data-table>
    <!-- <pre>{{customers}}</pre> -->
  </v-flex>
  </v-layout>
</template>
<script>
import Api from '@/services/api.js'
import toast from '@/services/toast.js'
import CustomerComponent from '@/components/Customer'
import Customer from '@/models/Customer.js'

export default {
  components: {
    'customer': CustomerComponent
  },
  data: () => ({
    customerDeleteId: null,
    conformationDialog: false,
    updateCustomers: 0,
    customer: new Customer(),
    dialog: false,
    api: new Api(),
    headers: [
      {
        text: 'Musterija',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'E-Mail', value: 'email' },
      { text: 'Broj Telefona', value: 'brojTelefona' },
      { text: 'Broj Pasosa', value: 'brojPasosa' },
      { text: 'Adresa', value: 'adresa' },
      { text: 'Struka', value: 'adresa' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedIndex: -1
  }),

  asyncComputed: {
    customers: {
      get () {
        return this.api.getCustomers().then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateCustomers
      }
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    // this.customers = this.getCustomers
  },

  methods: {
    newCustomerInstance () {
      this.customer = new Customer()
    },

    editItem (item) {
      this.customer = item
      this.dialog = true
    },

    deleteItem (item) {
      this.conformationDialog = true
      this.customerDeleteId = item.id
    },

    async deleteCustomer () {
      try {
        let response = await this.api.deleteCustomer(this.customerDeleteId)
        if (response.data !== undefined) {
          this.conformationDialog = false
          this.updateCustomers = new Date()
        }
      } catch (error) {
        toast.error('Pri brisanju Musterije')
      }
    },

    close () {
      this.conformationDialog = false
    },

    closeCustomerDialog () {
      this.dialog = false
    },

    async saveCustomer () {
      var response = await this.$refs.form.saveCustomer()
      this.dialog = !response
      this.updateCustomers = new Date()
    }
  },
  mounted () {
    // this.customers = this.getCustomers
  }
}
</script>
<style>
.overflow-visible{
    overflow: visible !important;
}
</style>
