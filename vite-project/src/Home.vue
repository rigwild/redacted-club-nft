<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { UseVirtualList } from '@vueuse/components'
import { useRouteQuery } from '@vueuse/router'

import ElementComponent from '../components/Element.vue'

import elementsFixed from '../../_output_elementsNullTraitsAsNone.json'
import rarity from '../../_output_rarity.json'
import { categories } from '../../types'

console.log('Use `elements()` to show raw data')
;(window as any).elements = () => {
  console.log('This can be found here: https://github.com/rigwild/redacted-club-nft#raw-rarity-scores')
  console.log('elements', elementsFixed)
  console.log('rarity', rarity)
}

const breakpoints = useBreakpoints({ laptop: 1024 })

const elementCardSize = () => (breakpoints.isGreater('laptop') ? 630 : 1350)
console.log('elementCardSize', elementCardSize())
const props = defineProps({
  sortBy: String,
  filterTrait: String
})

if (props.sortBy !== 'id' && props.sortBy !== 'score') throw new Error('Invalid sort')

let elements = ref(elementsFixed)
let filterId = ref()
let filterTrait = ref('')
let sortBy = ref(props.sortBy || 'id')

const filterTraitQuery = useRouteQuery('filterTrait')

let stateKey = computed(
  () => `${sortBy.value}-${filterId.value || '_'}-${filterTrait.value || '_'}-${elements.value.length}`
)

// Keep `sortBy` route query prop in sync with state
watch(
  () => props.sortBy,
  value => {
    sortBy.value = value
  }
)

// Auto-apply element sort on sort type change
watch(
  () => sortBy.value,
  () => sortElement()
)

// Keep `filterTrait` state in sync with route query prop
watch(
  () => filterTrait.value,
  value => {
    filterTraitQuery.value = value ? value : undefined
  }
)

const filterElementsById = () => {
  filterTrait.value = ''
  if (!filterId.value) {
    elements.value = elementsFixed
    sortElement()
  } else {
    elements.value = []
    const results = elementsFixed.find(x => filterId.value === `${x.id}`)
    nextTick(() => {
      elements.value = results ? [results] : []
    })
  }
}
const filterElementsByTrait = () => {
  filterId.value = ''
  filterTrait.value = filterTrait.value.toLowerCase()
  if (!filterTrait.value) {
    elements.value = elementsFixed
    sortElement()
  } else {
    elements.value = elementsFixed.filter(element =>
      categories.some(category => element[category].toLowerCase().includes(filterTrait.value))
    )
  }
}

const sortElement = () => {
  if (sortBy.value === 'id') sortById()
  else if (sortBy.value === 'score') sortByScore()
}
const sortById = () => (elements.value = elements.value.sort((a, b) => a.id - b.id))
const sortByScore = () =>
  (elements.value = elements.value.sort((a, b) => rarity.elements[b.id].score - rarity.elements[a.id].score))

// Apply route query parameters on page load
sortElement()
filterTrait.value = props.filterTrait
if (filterTrait.value) filterElementsByTrait()
</script>

<template>
  <div class="filters">
    <div>
      <div>
        <label for="filterId">Rabbit ID</label>
        <input
          v-model="filterId"
          @input="filterElementsById"
          id="filterId"
          type="text"
          placeholder="Filter by Rabbit ID"
          :maxlength="elementsFixed.length.toString().length"
        />
      </div>
      <div>
        <label for="filterTrait">Trait Name</label>
        <input
          v-model="filterTrait"
          @input="filterElementsByTrait"
          id="filterTrait"
          type="text"
          placeholder="Filter by Trait Name"
        />
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-center">{{ elements.length }} / {{ elementsFixed.length }} Rabbits</h2>
  </div>
  <div v-if="elements.length === 0">
    <h2 class="text-center">Nothing found!</h2>
  </div>

  <div v-else :key="stateKey">
    <UseVirtualList :list="elements" :options="{ itemHeight: elementCardSize, overscan: 2 }" height="94vh">
      <template #="{ data: element }">
        <ElementComponent :element="element" />
      </template>
    </UseVirtualList>
  </div>
</template>

<style>
.filters {
  text-align: center;
  margin: 15px;
}
.filters input {
  margin: 0 auto;
  text-align: center;
  margin-bottom: 20px;
}
.filters > div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.filters > div > div {
  margin: 15px;
}

@media (max-width: 1280px) {
  .filters > div {
    flex-direction: column;
  }
}
</style>
