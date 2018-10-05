<template>
  <div>
    <v-layout align-center row>
      <!-- Services Picklist START -->
      <v-flex xs12 sm6 md4 lg3 mx-2 >
        <v-card class="cart">
          <v-card-title><h4>List Usluga</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="servicePicklist" class="scrollable-list">
            <v-list-tile v-for="setting in servicePicklist" :key="setting.id">
              <v-list-tile-content>{{ setting.title }}</v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editPicklistOption(setting)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removePicklistOption(setting)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              @click="addNewOption(servicePicklist[0].delimeter)"
              color="green"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
      <!-- Services Picklist END -->

      <!-- Arrangements Type Picklist START -->
      <v-flex xs12 sm6 md4 lg3 mx-2>
        <v-card class="cart">
          <v-card-title><h4>Tipovi Aranžmana</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="arrangmentTypePicklist" class="scrollable-list">
            <v-list-tile v-for="setting in arrangmentTypePicklist" :key="setting.id">
              <v-list-tile-content>{{ setting.title }}</v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editPicklistOption(setting)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removePicklistOption(setting)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              @click="addNewOption(arrangmentTypePicklist[0].delimeter)"
              color="green"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
      <!-- Arrangements Type Picklist END -->

      <!-- Room Structure Picklist START -->
      <v-flex xs12 sm6 md4 lg3 mx-2>
        <v-card class="cart">
          <v-card-title><h4>Struktura sobe</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="roomContents" class="scrollable-list">
            <v-list-tile v-for="setting in roomContents" :key="setting.id">
              <v-list-tile-content>{{ setting.title }}</v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editPicklistOption(setting)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removePicklistOption(setting)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              @click="addNewOption(roomContents[0].delimeter)"
              color="green"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
      <!-- Room Structure Picklist END -->

      <!-- Room Type Picklist START -->
      <v-flex xs12 sm6 md4 lg3 mx-2>
        <v-card class="cart">
          <v-card-title><h4>Tipovi Soba</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="roomTypes" class="scrollable-list">
            <v-list-tile v-for="setting in roomTypes" :key="setting.id">
              <v-list-tile-content>{{ setting.title }}</v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editPicklistOption(setting)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removePicklistOption(setting)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="green"
              @click="addNewOption(roomTypes[0].delimeter)"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
      <!-- Room Type Picklist END -->

      <!-- Picklist Modal -->
      <v-dialog v-model="picklistModal" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Nova Opcija</span>
          </v-card-title>

          <picklist :picklist="picklist" ref="picklist"></picklist>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="closePicklistModal">Zatvori</v-btn>
            <v-btn color="blue darken-1" flat @click.native="addPicklistOption">{{ picklist.id == null ? 'Dodaj Opciju' : 'Izmeni Opciju'}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Delete Confirm Dialog -->
       <v-dialog v-model="conformationDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Upozorenje</span>
          </v-card-title>

          <v-card-text>
            <p>Da li zelite izbrisati ovu opciju ?</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="conformationDialog = false">Odustani</v-btn>
            <v-btn color="blue darken-1" flat @click.native="deleteOption">Nastavi</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout align-center row mt-5>
      <!-- Companies List START -->
      <v-flex xs12 sm6 md4 lg3 mx-2 >
        <v-card class="cart">
          <v-card-title><h4>List Kompanija</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="companies" class="scrollable-list">
            <v-list-tile v-for="company in companies" :key="company.id">
              <v-list-tile-content>{{ company.name }}</v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editCompany(company)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removeCompany(company)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              @click="addNewCompany()"
              color="green"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
        <!-- Company Modal -->
        <v-dialog v-model="companyModal" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Nova Opcija</span>
            </v-card-title>

            <company :company="company" ref="company"></company>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="closeCompanyModal">Zatvori</v-btn>
              <v-btn color="blue darken-1" flat @click.native="addCompany">{{ company.id == null ? 'Dodaj Kompaniju' : 'Izmeni Kompaniju'}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Delete Confirm Dialog -->
        <v-dialog v-model="conformationCompanyDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Upozorenje</span>
            </v-card-title>

            <v-card-text>
              <p>Da li zelite izbrisati ovu Kompaniju ?</p>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="conformationCompanyDialog = false">Odustani</v-btn>
              <v-btn color="blue darken-1" flat @click.native="deleteCompany">Nastavi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <!-- Companies List START -->

      <!-- Agents List START -->
      <v-flex xs12 sm6 md4 lg3 mx-2 >
        <v-card class="cart">
          <v-card-title><h4>Lista Agenata</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="agents" class="scrollable-list">
            <v-list-tile v-for="agent in agents" :key="agent.id">
              <v-list-tile-content>{{ agent.name }}</v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editAgent(agent)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removeAgent(agent)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              @click="addNewAgent()"
              color="green"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
        <!-- Company Modal -->
        <v-dialog v-model="agentModal" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Novi Agent</span>
            </v-card-title>

            <agent :agent="agent" ref="agent"></agent>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="closeAgentModal">Zatvori</v-btn>
              <v-btn color="blue darken-1" flat @click.native="addAgent">{{ agent.id == null ? 'Dodaj Agenta' : 'Izmeni Agenta'}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Delete Confirm Dialog -->
        <v-dialog v-model="conformationAgentDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Upozorenje</span>
            </v-card-title>

            <v-card-text>
              <p>Da li zelite izbrisati Agenta ?</p>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="conformationAgentDialog = false">Odustani</v-btn>
              <v-btn color="blue darken-1" flat @click.native="deleteAgent">Nastavi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex xs12 sm6 md4 lg3 mx-2 >
        <v-card class="cart">
          <v-card-title><h4>Lista Hotela</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="hotels" class="scrollable-list">
            <v-list-tile v-for="hotel in hotels" :key="hotel.id">
              <v-list-tile-content>{{ hotel.name }}</v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editHotel(hotel)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removeHotel(hotel)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              @click="addNewHotel()"
              color="green"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
        <!-- Company Modal -->
        <v-dialog v-model="hotelModal" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Novi Hotel</span>
            </v-card-title>

            <hotel :hotel="hotel" ref="hotel"></hotel>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="closeHotelModal">Zatvori</v-btn>
              <v-btn color="blue darken-1" flat @click.native="addHotel">{{ hotel.id == null ? 'Dodaj Hotel' : 'Izmeni Hotel'}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Delete Confirm Dialog -->
        <v-dialog v-model="conformationHotelDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Upozorenje</span>
            </v-card-title>

            <v-card-text>
              <p>Da li zelite izbrisati Hotel ?</p>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="conformationHotelDialog = false">Odustani</v-btn>
              <v-btn color="blue darken-1" flat @click.native="deleteHotel">Nastavi</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-layout align-center row mt-5>
      <v-flex sm12 md12 lg6 offset-lg3 mx-2 >
        <v-card class="cart">
          <v-card-title><h4>Destinacije</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense v-if="destinations" class="scrollable-list">
            <v-list-tile v-for="destination in destinations" :key="destination.id">
              <v-list-tile-content>
                  <!-- @click.native="toggleAll"
                  :indeterminate="props.indeterminate" -->
                <v-checkbox
                  :input-value="destination.active"
                  :label="destination.destinacija"
                  primary
                  hide-details
                ></v-checkbox>
              </v-list-tile-content>
              <v-list-tile-action class="custom-tile-action">
                <v-btn icon @click="editPicklistOption(setting)">
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <v-btn icon @click="removePicklistOption(setting)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="green"
            >
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import Api from '@/services/api'
import toast from '@/services/toast'
import PicklistOptionComponent from '@/components/PicklistOption'
import PicklistOption from '@/models/PicklistOption'
import CompanyComponent from '@/components/Company'
import Company from '@/models/Company'
import HotelComponent from '@/components/Hotel'
import Hotel from '@/models/Hotel'
import AgentComponent from '@/components/Agent'
import Agent from '@/models/Agent'

export default {
  name: 'Settings',
  components: {
    'picklist': PicklistOptionComponent,
    'company': CompanyComponent,
    'hotel': HotelComponent,
    'agent': AgentComponent
  },
  data: () => ({
    api: new Api(),
    picklistModal: false,
    picklist: new PicklistOption(),
    company: new Company(),
    hotel: new Hotel(),
    agent: new Agent(),
    updateSettings: 0,
    updateCompany: 0,
    updateDestinations: 0,
    conformationDialog: false,
    conformationCompanyDialog: false,
    companyModal: false,
    deletePicklistId: 0,
    deleteCompanyId: 0,
    deleteAgentId: 0,
    deleteHotelId: 0,
    updateAgents: 0,
    updateHotels: 0,
    conformationAgentDialog: false,
    agentModal: false,
    conformationHotelDialog: false,
    hotelModal: false
  }),
  asyncComputed: {
    servicePicklist: {
      get () {
        return this.api.getPicklist('service').then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateSettings
      }
    },
    arrangmentTypePicklist: {
      get () {
        return this.api.getPicklist('arrangement').then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateSettings
      }
    },
    roomContents: {
      get () {
        return this.api.getPicklist('room-content').then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateSettings
      }
    },
    roomTypes: {
      get () {
        return this.api.getPicklist('room-type').then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateSettings
      }
    },
    companies: {
      get () {
        return this.api.getCompanies().then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateCompany
      }
    },
    destinations: {
      get () {
        return this.api.getDestinations().then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateDestinations
      }
    },
    agents: {
      get () {
        return this.api.getAgents().then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateAgents
      }
    },
    hotels: {
      get () {
        return this.api.getHotels().then(res => res.data !== null ? res.data : [])
      },
      watch () {
        this.updateHotels
      }
    }
  },
  methods: {
    addNewCompany () {
      this.company = new Company()
      this.companyModal = true
    },
    addNewAgent () {
      this.agent = new Agent()
      this.agentModal = true
    },
    addNewHotel () {
      this.hotel = new Hotel()
      this.hotelModal = true
    },
    addNewOption (type) {
      this.picklist = new PicklistOption(type)
      this.picklistModal = true
    },
    closePicklistModal () {
      this.picklistModal = false
      this.picklist = new PicklistOption()
    },
    removePicklistOption (setting) {
      this.deletePicklistId = setting.id
      this.conformationDialog = true
    },
    editPicklistOption (setting) {
      this.picklist = setting
      this.picklistModal = true
    },
    editCompany (company) {
      this.company = company
      this.companyModal = true
    },
    editHotel (hotel) {
      this.hotel = hotel
      this.hotelModal = true
    },
    editAgent (agent) {
      this.agent = agent
      this.agentModal = true
    },
    closeCompanyModal () {
      this.companyModal = false
      this.company = new Company()
    },
    closeAgentModal () {
      this.agentModal = false
      this.agent = new Agent()
    },
    closeHotelModal () {
      this.hotelModal = false
      this.hotel = new Hotel()
    },
    removeCompany (company) {
      this.deleteCompanyId = company.id
      this.conformationCompanyDialog = true
    },
    removeAgent (agent) {
      this.deleteAgentId = agent.id
      this.conformationAgentDialog = true
    },
    removeHotel (hotel) {
      this.deleteHotelId = hotel.id
      this.conformationHotelDialog = true
    },


    async deleteCompany () {
      try {
          let response = await this.api.deleteCompany(this.deleteCompanyId)
          this.updateCompany = new Date()
          this.conformationCompanyDialog = false
      } catch (err) {
        toast.error(err.toString())
      }
    },
    async deleteAgent () {
      try {
          let response = await this.api.deleteAgent(this.deleteAgentId)
          this.updateAgents = new Date()
          this.conformationAgentDialog = false
      } catch (err) {
        toast.error(err.toString())
      }
    },
    async deleteHotel () {
      try {
          let response = await this.api.deleteHotel(this.deleteHotelId)
          this.updateHotels = new Date()
          this.conformationHotelDialog = false
      } catch (err) {
        toast.error(err.toString())
      }
    },
    async addCompany () {
      if (this.$refs.company.isValid) {
        try {
            let response = await this.api.addCompany(this.company)
            this.updateCompany = new Date()
            this.companyModal = false
        } catch (err) {
          toast.error(err.toString())
        }
      }
    },
    async addAgent () {
      if (this.$refs.agent.isValid) {
        try {
            let response = await this.api.addAgent(this.agent)
            this.updateAgents = new Date()
            this.agentModal = false
        } catch (err) {
          toast.error(err.toString())
        }
      }
    },
    async addHotel () {
      if (this.$refs.hotel.isValid) {
        try {
            let response = await this.api.addHotel(this.hotel)
            this.updateHotels = new Date()
            this.hotelModal = false
        } catch (err) {
          toast.error(err.toString())
        }
      }
    },
    async deleteOption () {
      try {
          let response = await this.api.deletePicklistOption(this.deletePicklistId)
          this.updateSettings = new Date()
          this.conformationDialog = false
      } catch (err) {
        toast.error(err.toString())
      }
    },
    async addPicklistOption () {
      if (this.$refs.picklist.isValid) {
        try {
          let response = await this.api.addPicklistOption(this.picklist)
          this.updateSettings = new Date()
          this.picklistModal = false
        } catch (err) {
          toast.error(err.toString())
        }
      }
    }
  }
}
</script>
<style>
.cart {
  height:20em;
  position: relative;
}
.icon-custom {
  display: inline-block;
}
.custom-tile-action {
  flex-direction: row;
}
.scrollable-list {
  overflow-y: auto;
  max-height: 14em;
}
</style>
