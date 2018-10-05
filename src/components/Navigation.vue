<template>
  <v-card flat>
    <v-tabs
      centered
      color="white darken-3"
      light
      icons-and-text
    >
      <v-tabs-slider color="green"></v-tabs-slider>

      <v-tab href="#tab-1">
        Prodaja
        <v-icon color='black'>attach_money</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Statistika
        <v-icon color='black'>cloud_circle</v-icon>
      </v-tab>

      <v-tab-item id="tab-1">
        <v-card flat >
          <v-layout row wrap class="custom-padding">
            <v-flex md8 lg4 px-3>
              <v-card>
                <v-card-media
                  src="https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1440,w_2560,x_0,y_0/dpr_2.0/c_limit,w_740/fl_lossy,q_auto/v1513972747/171220-irving-zunmun-aero-tease_yccsqq"
                  height="200px"
                  max-height="350px"
                ></v-card-media>

                <v-card-title primary-title>
                  <div>
                    <p class="headline mb-0 uppercase">Prodaja Avio Karti</p>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-btn 
              dark
              fab              
              color="green"  to="/dashboard/tickets-store/flight"><v-icon>add</v-icon></v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex md7 lg4 px-3>
              <v-card>
                <v-card-media
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxtAer9SqA4DfXK5c13YpLZJvA65sqDzaS2yg5ZTb1UQfqIVxpg"
                  height="200px"
                ></v-card-media>

                <v-card-title primary-title>
                  <div>
                    <p class="headline mb-0 uppercase">Prodaja Aranžmana</p>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-btn dark
              fab              
              color="green" to="/dashboard/arrangment-store"><v-icon>add</v-icon></v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex md6 lg4 px-3>
              <v-card>
                <v-card-media
                  src="http://www.passengerplus.co.uk/images/5/bb7e64fyutong-cover-jpg.jpg"
                  height="200px"
                ></v-card-media>

                <v-card-title primary-title>
                  <div>
                    <p class="headline mb-0 uppercase">Prodaja Bus Karti</p>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-btn dark
              fab              
              color="green" to="/dashboard/tickets-store/bus"><v-icon>add</v-icon></v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>

            <!-- <v-flex md6 lg3 px-3>
              <v-card>
                <v-card-media
                  src="https://i.kinja-img.com/gawker-media/image/upload/t_original/m6kueolchok1dbxd3n5o.jpg"
                  height="200px"
                  max-height="350px"
                ></v-card-media>

                <v-card-title primary-title>
                  <div>
                    <p class="headline mb-0 uppercase">Organizovani Aranžmani</p>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-btn flat>Explore</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex> -->
          </v-layout>
        </v-card>
      </v-tab-item>
      <v-tab-item id="tab-2">
        <statistics></statistics>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
// import router from '@/router'
// import 'es6-promise/auto'
import Api from '@/services/api.js'
import Statistics from '@/entities/Statistics'

export default {
  name: 'Navigation',
  computed: {
  },
  data () {
    return {
      bottomNav: 'prodaja',
      api: new Api()
    }
  },
  components: {
    'statistics': Statistics
  }
}
</script>
<style>


.uppercase {
  text-transform: uppercase;
  font-size: 18px !important;
  text-align:center !important;
}
.custom-padding {
  padding: 5%;
}
</style>
