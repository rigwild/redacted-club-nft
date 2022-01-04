<script setup lang="ts">
import ElementComponent from '../components/Element.vue'

import elementsFixed from '../../_output_elementsNullTraitsAsNone.json'
const props = defineProps({ elementId: String })

const elementId = +props.elementId
const isValidElementId =
  !Number.isNaN(elementId) && elementId >= 0 && elementId <= elementsFixed.length.toString().length
const element = isValidElementId && elementsFixed.filter(x => x.id === elementId)[0]
</script>

<template>
  <div v-if="!isValidElementId">
    <h2 class="text-center">Invalid ID!</h2>
  </div>
  <div v-else>
    <div>
      <ElementComponent :element="(element as any)" />
    </div>
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
