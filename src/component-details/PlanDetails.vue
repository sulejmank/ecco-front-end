<template>
  <v-card-text>
        <v-layout>
      <v-flex md6 v-if="arrangement.Client !== undefined">
          <h3 style="text-decoration:underline">Nosilac Putovanja</h3>
          <table style="list-style-type: none; padding:0; width: 100%">
            <tr>
              <td>
                Ime Prezime:
              </td>
              <td>
                <strong>{{arrangement.Client.ime + " " + arrangement.Client.prezime}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Telefona:
              </td>
              <td>
                <strong>{{arrangement.Client.brojTelefona}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Email: 
              </td>
              <td>
                <strong>{{arrangement.Client.email}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Pasosa:
              </td>
              <td>
                <strong>{{arrangement.Client.brojPasosa}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Datum Rodjenja:
              </td>
              <td>
                <strong>{{arrangement.Client.datumRodjenja}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Struka:
              </td>
              <td>
                <strong>{{arrangement.Client.struka}}</strong>
              </td>
            </tr>
          </table>
      </v-flex>
      <v-flex md6 v-if="arrangement.Client !== undefined">
          <h3 style="text-decoration:underline">Aranžman</h3>
          <table style="list-style-type: none; padding:0; width: 100%">
            <tr>
              <td>
                Destinacija:
              </td>
              <td>
                <strong>{{arrangement.Destination.destinacija}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Hotel:
              </td>
              <td>
                <strong>{{arrangement.Hotel.name}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Trajanje:
              </td>
              <td>
                <strong>{{parseDate(arrangement.datumPocetka) + " - " + parseDate(arrangement.datumZavrsetka)}}</strong>
              <span class="grey--text">({{arrangement.brojDana}} Noćenja)</span>
              </td>
            </tr>
            <tr>
              <td>
                Usluga:
              </td>
              <td>
                <strong>{{arrangement.Service.title}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Tip Anranžmana:
              </td>
              <td>
                <strong>{{arrangement.Type.title}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Agent:
              </td>
              <td>
                <strong>{{arrangement.Agent.name}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Mesto Polaska:
              </td>
              <td>
                <strong>{{arrangement.mestoPolaska}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Broj Putnika: 
              </td>
              <td>
                <strong>{{arrangement.PassangersArrangements.length + 1}}</strong>
              </td>
            </tr>
            <tr>
              <td>
                Status: 
              </td>
              <td>
                <v-chip :color="arrangement.Plan.status ? 'green': 'red'" text-color='white'>{{arrangement.Plan.status ? 'Isplaceno': 'Nesplaceno'}}</v-chip>
              </td>
            </tr>
          </table>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>
<script>
export default {
  name: 'PlanDetails',
  props: {
    plan: {
      type: Object
    }
  },
  data () {
    return {
      valid: false
    }
  },
  methods: {
    
  }
}
</script>

<style>

</style>

