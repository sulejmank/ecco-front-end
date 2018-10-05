<template>
  <v-form ref="roomForm">
    <v-card-text mb-0>
      <v-layout row wrap>
        <v-flex sm12>
          <v-select
            v-model="room.RoomContent"
            :items="roomContents"
            item-text="title"
            @input="handleContents(room.RoomContent)"
            label="Kapacitet sobe"
            return-object
          ></v-select>
        </v-flex>
        <v-flex sm12>
            <v-select
              v-model="room.RoomType"
              :items="roomTypes"
              item-text="title"
              @input="handleTypes(room.RoomType)"
              label="Sadrzaj sobe"
              return-object
            ></v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap justify-center v-if="this.room.passangers.length > 0">
        <v-flex sm12 elevation-4 mt-2>
          <v-card >
            <v-list two-line>
              <v-subheader>
                Putnici
              </v-subheader>
              <template v-for="(passanger, index) in this.room.passangers">

                <v-divider :key="index + '-divider'"></v-divider>

                <v-list-tile @click="() => {}" :key="index">
                  <v-list-tile-avatar
                    color="indigo"
                    class="headline font-weight-light white--text"
                  >
                    {{ passanger.ime.charAt(0) }}
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title><strong>{{passanger.prezime + ", " + passanger.ime}}</strong></v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action >
                    <div justify-center layout px-0>
                      <v-btn icon @click="removePassanger(index)">
                        <v-icon color="grey lighten-1">delete</v-icon>
                      </v-btn>
                    </div>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <customer :customer="passanger" :isPassenger="true" ref="passanger" v-if="roomTypeAndStructureSelected"></customer>
    <v-card-text v-if="roomTypeAndStructureSelected">
      <v-layout>
        <div class="text-center">
          <v-btn @click.prevent="addPassanger()"
            center
          >
            <v-icon>person_add</v-icon>
            DODAJ PUTNIKA
          </v-btn>
        </div>
      </v-layout>

    </v-card-text>
  </v-form>
</template>
<script>
// import Room from '@/models/Room'
import Customer from '@/models/Customer'
import CustomerComponent from '@/components/Customer'
import Api from '@/services/api.js'
import toast from '@/services/toast.js'

export default {
  name: 'Room',
  components: {
    'customer': CustomerComponent
  },
  props: {
    room: {
      type: Object
    },
    roomPassangers: {
      type: Array
    }
  },
  data () {
    return {
      api: new Api(),
      passanger: new Customer(),
      openPassangerForm: false
    }
  },
  asyncComputed: {
    async roomContents () {
      let response = await this.api.getPicklist('room-content')
      return response.data
    },
    async roomTypes () {
      let response = await this.api.getPicklist('room-type')
      return response.data
    }
  },
  computed: {
    roomTypeAndStructureSelected () {
      return this.room.roomType !== null && this.room.roomContents !== null
    },
    canSaveRoom () {
      return !this.openPassangerForm && this.roomTypeAndStructureSelected && this.room.passangers.length > 0
    },
    passangerIsCreated () {
      return this.$store.getters.getCurentPassengerId === undefined || this.$store.getters.getCurentPassengerId === 0
    }
  },

  methods: {
    handleContents (item) {
      this.room.RoomContentId = item.id
    },
    handleTypes (item) {
      this.room.RoomTypeId = item.id
    },
    validateRoom () {
      console.log(this.room)
      if (this.$refs.roomForm.validate() && this.room.passangers.length > 0) {
        return true
      } else {
        toast.error('Podatci o sobi nisu potpuni')
        return false
      }
    },
    addPassanger () {
      // TODO: Check if it can just return is validated Customer
      var passanger = this.$refs.passanger.addPassanger()
      if (passanger !== false) {
        this.room.passangers.push(passanger)
        this.passanger = new Customer()
      }
    },
    removePassanger (index) {
      this.room.passangers = this.room.passangers.filter((el, i) => {
        return i !== index
      })
    }
  },
  beforeMount () {
  }
}
</script>
<style>

</style>
