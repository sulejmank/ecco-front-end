<template>
<div :class="classes">
  <label :for="fieldname">{{label}}</label>
  <input type="text" :class="{'form-control': true, 'is-invalid': errors.has(formName +'.'+ fieldname)}" v-bind:id="fieldname" v-bind:name="fieldname" :placeholder="placeholder" v-model="model" v-validate="'required: true, alpha_spaces: true, regex: ^[\d,\s]+$'" v-on:keydown.down.prevent="focusSuggestions('down')" v-on:keydown.up.prevent="focusSuggestions('up')" v-on:blur="unfocused()" v-on:keydown.esc.prevent="escapeMessage" autocomplete="new-suggestion">
  <span v-show="errors.has(formName +'.'+ fieldname)" id="nameHelp" class="form-text text-danger error-msg">{{ errors.first(formName +'.'+ fieldname) }}</span>
  <div class="suggestions" v-show="status == 'loading'">
    <div :class="{'customer row':true, 'focused': isFocusedItem(i)}" v-for="(suggestion, i) in suggestions" :key="suggestion.id" v-show="suggestions.length > 0">
      <div class="col-2">
        <img src="@/assets/logo.png" class="img-thumbnail" alt="">
      </div>
      <div class="col-10">
        <p class="bottom-margin"><strong>{{suggestion.mainData}}</strong></p>
        <p class="bottom-margin">{{suggestion.subData}}</p>
      </div>
    </div>
    <div class="customer row" v-show="status == 'loading' && suggestions.length == 0 ">
      <div class="col text-center">
        <img src="@/assets/loading.gif" class="size" alt="">
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Api from '@/services/api.js'

export default {
  name: 'Suggestion',
  props: {
    value: {
      type: String
    },
    fieldname: {
      type: String
    },
    classes: {
      type: String
    },
    label: {
      type: String
    },
    formName: {
      type: String
    },
    placeholder: {
      type: String
    },
    method: {
      type: Function
    }
  },
  data () {
    return {
      api: new Api(),
      model: '',
      status: undefined,
      suggestions: [],
      focusedItem: 0
    }
  },
  methods: {
    isFocusedItem (i) {
      let index = i++
      return index === this.focusedItem
    },
    getSuggestions (input) {
      this.focusedItem = 0
      this.$validator.validate(this.formName + '.' + this.fieldname).then(res => {
        if (res) {
          this.status = undefined
          clearTimeout(this.timer)
          this.status = 'loading'
          this.timer = setTimeout(() => {
            var self = this
            this.method(input).then(
              res => {
                if (res.length > 0) {
                  self.suggestions = res
                } else {
                  this.status = undefined
                }
              }
            )
          }, 400)
        } else {
          clearTimeout(this.timer)
          clearTimeout(this.ajaxTimer)
          this.status = undefined
        }
      })
    },
    unfocused () {
      clearTimeout(this.timer)
      clearTimeout(this.ajaxTimer)
      this.status = undefined
      this.$emit('updateModel', this.model)
    },
    focusSuggestions (direction) {
      this.focusedItem = direction === 'down' ? this.next(this.focusedItem) : this.previous(this.focusedItem)
      console.log(this.suggestions[this.focusedItem])
      if (this.suggestions[this.focusedItem] !== undefined) {
        this.$emit('modelSuggested', this.suggestions[this.focusedItem].objectEntity)
      }
    },
    next (current) {
      return current === this.suggestions.length - 1 ? 0 : ++current
    },
    previous (current) {
      return current === 0 ? this.suggestions.length - 1 : --current
    },
    escapeMessage () {
      this.status = undefined
      this.$emit('escapeSuggestion')
    }
  },
  watch: {
    model (oldValue, newValue) {
      if (!this.imported) {
        this.getSuggestions(newValue)
      } else {
        this.imported = false
      }
    },
    value (newValue, oldValue) {
      this.imported = true
      this.model = newValue
    }
  }

}
</script>
<style>
.suggestions{
  width: 98%;
  position: absolute;
  background-color: #fff;
  z-index: 100;
  border: 1px solid #ddd;
  padding: 0 2px;
}

.customer{
  padding:6px 0;
  margin:0;
}

.error-msg{
  font-size:.7em;
}

.bottom-margin{
  margin-bottom:0;
}

.focused{
  background-color:#e9ecef;
}
</style>
