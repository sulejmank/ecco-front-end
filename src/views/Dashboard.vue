<template>
  <v-app id="inspire">
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click="navigate(child)"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.text" @click="navigate(item)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="white"
      light
      app
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Ecco</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-btn
          icon
          slot="activator"
        >
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(notification, index) in notifications"
            :key="index"
          >
            <!-- @click="" -->
            <v-list-tile-title>{{ notification.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <v-btn
          icon
          large
          slot="activator"
        >
          <v-avatar size="32px" tile>
            <img
              src="https://i.imgur.com/BjP9MgO.png"
              alt="Vuetify"
            >
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(option, index) in userOptions"
            :key="index"
            @click="navigate(option)"
          >
            <!-- @click="" -->
            <v-list-tile-title>{{ option.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container fluid align-start>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import router from '@/router'

export default {
  data: () => ({
    dialog: false,
    notifications: [
      {title: 'Nema novih obaveštenja..'}
    ],
    userOptions: [
      {icon: 'lock', title: 'Odjava', link: 'Login'}
    ],
    drawer: null,
    items: [
      { icon: 'home', text: 'Početna', link: 'Navigation' },
      { icon: 'contacts', text: 'Mušterije', link: 'CustomersList' },
      { icon: 'history', text: 'Poslednje Prodaje', link: 'PlansList' },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Labels',
        model: true,
        children: [
          { icon: 'flight', text: 'Avio Karte', link: 'TicketsList', params: {type: 'flight'} },
          { icon: 'airport_shuttle', text: 'Bus Karte', link: 'TicketsList', params: {type: 'bus'} },
          { icon: 'beach_access', text: 'Aranžmani', link: 'ArrangementsList' }
         // { icon: 'group', text: 'Organizovani Angažmani' }
        ]
      },
      { icon: 'person_add', text: 'Dodaj Radnika', link: 'UsersList' },
      { icon: 'settings', text: 'Podešavanja', link: 'Settings' }
    ]
  }),
  methods: {
    navigate (item) {
      if (item['params'] != undefined) {
        router.push({name: item.link, params: item.params})
      } else {
        router.push({name: item.link})
      }
    }
  },
  // computed: {
  //   isCurrentProductPlacement () {
  //     return router.history.current.name !== 'ProductPlacement'
  //   },
  //   isLoginScreen () {
  //     return router.history.current.name === 'Login'
  //   },
  //   isLoggedIn () {
  //     return this.$store.getters.isLoggedIn
  //   }
  // },
  props: {
    source: String
  }
}
</script>
