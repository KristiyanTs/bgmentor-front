<template>
  <v-autocomplete
    filled
    :id="`search-${label}`"
    v-model="value"
    :items="allModels"
    chips
    flat
    :label="$t(`search.labels.${model}`)"
    item-text="text"
    item-value="value"
    multiple
  >
    <template v-slot:selection="data">
      <v-chip color="primary" v-bind="data.attrs" :input-value="data.selected">
        {{ data.item.text }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
import store from '@/store'

export default {
  name: 'SearchFilterSelect',
  components: {},
  props: {
    label: {
      type: String,
      default: '',
      description: 'Search filter name'
    },
    model: {
      type: String,
      default: '',
      description: 'Search filter name'
    },
    suggestions: {
      type: Array,
      default: () => [],
      description:
        'List of suggestions. TODO: This component should fetch these'
    }
  },
  data() {
    return {
      value: [],
      fetchedFilters: []
    }
  },
  mounted() {
    this.value = store.getters.filters[this.model]
  },
  methods: {},
  computed: {
    allModels() {
      return [
        { header: this.$t(`search.labels.from_input`) },
        ...this.fetchedFilters,
        { header: this.$t(`search.labels.suggestions`) },
        ...this.formattedSuggestions
      ]
    },
    formattedSuggestions() {
      return this.suggestions.map((s) => {
        return {
          text: this.$t(`search.${this.model}.${s}`),
          value: s
        }
      })
    }
  },
  watch: {
    value(val) {
      store.dispatch('performSearch', { [this.model]: val })
    }
  }
}
</script>

<style scoped lang="sass"></style>
