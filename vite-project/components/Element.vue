<script setup lang="ts">
import rarity from '../../_output_rarity.json'
import { Element, categories } from '../../types'
import elementsFixed from '../../_output_elementsNullTraitsAsNone.json'

const { element } = defineProps<{ element: Element }>()

const setUriHash = (elementId: number) => {
  const path = `/element/${elementId}`
  const fullUri = `${window.location.origin}${path}`
  navigator.clipboard.writeText(fullUri).then(() => alert(`Link copied to clipboard! ${fullUri}`))
}
</script>

<template>
  <div class="element-card" :key="`element-${element.id}`">
    <div class="element-img-container">
      <img :src="`/elements-images/element-${element.id}.webp`" :alt="`element ${element.id}`" :key="element.id" />
    </div>
    <div class="element-stats">
      <h2>
        Rabbit #{{ element.id }} (Rank {{ rarity.elements[(element.id + '') as keyof typeof rarity.elements].rank }} /
        {{ elementsFixed.length }})
        <span @click="setUriHash(element.id)" class="pointer">🔗</span>
      </h2>
      <h4>Traits</h4>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Trait</th>
            <th class="text-right">Trait Count</th>
            <th class="text-right">Trait %</th>
            <th class="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="category of categories">
            <tr v-if="element[category]">
              <td>{{ category }}</td>
              <td>{{ element[category] }}</td>
              <td class="text-right">
                {{ rarity.categories[category][element[category]].count }} / {{ elementsFixed.length }}
              </td>
              <td class="text-right">{{ rarity.categories[category][element[category]].totalPercent.toFixed(3) }} %</td>
              <td class="text-right">{{ rarity.categories[category][element[category]].score.toFixed(3) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <h3>
        Total Rarity Score:
        {{ rarity.elements[(element.id + '') as keyof typeof rarity.elements].score.toFixed(3)





        }}<!-- -<a :href="`https://www.anons.army/anon/${element.id}`" target="_blank" rel="noopener">See on anons.army</a> -->
      </h3>
    </div>
  </div>
</template>

<style scoped>
.element-card {
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2e3844;
  border-radius: 30px;
  box-shadow: 0px 5px 24px 5px #00000042;
}
.element-card > .element-img-container {
  width: 500px;
  height: 500px;
  flex-basis: 500px;
  flex-grow: 0;
  flex-shrink: 0;
  margin: 20px;
}

.element-img-container img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  box-shadow: 0px 5px 24px 5px #00000042;
}

.element-stats {
  width: 100%;
  padding: 0 15px;
}

@media only screen and (max-width: 1280px) {
  .element-card {
    text-align: center;
    flex-direction: column;
    margin: 50px 0;
    height: 1350px;
  }
  .element-card > .element-img-container {
    width: 100%;
    height: 100%;
    flex-basis: initial;
    flex-grow: initial;
    flex-shrink: initial;
  }
  .element-stats {
    padding: 5px 0;
  }
}

@media only screen and (max-width: 640px) {
  .element-card img {
    height: inherit;
    width: auto;
    border-radius: 30px 30px 0px 0px;
  }
}

@media only screen and (min-width: 640px) and (max-width: 1280px) {
  .element-card > .element-img-container {
    width: initial;
    height: initial;
    flex-basis: initial;
    flex-grow: initial;
    flex-shrink: initial;
  }
  .element-card img {
    height: 500px;
    width: 500px;
    border-radius: 30px;
    margin-top: 30px;
  }
}
</style>
