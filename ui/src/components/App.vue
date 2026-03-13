<template>
  <div>
    <div class="header">
      <h1>Plants <span class="header-tagline">an experiment in generative drawing</span></h1>
      <div class="header-actions">
        <button class="button-header" @click="store.save()">save</button>
        <button class="button-header" @click="store.load()">load</button>
        <button class="button-header" @click="togglePreview">preview</button>
      </div>
    </div>
    <div class="game-menu">
      <button class="button-secondary" @click="store.random()">random</button>
      <button class="button-secondary" @click="store.breedChecked()">breed checked</button>
      <button class="button-secondary" @click="showConfig = !showConfig">config</button>
      <button class="button-secondary" @click="showAbout = !showAbout">about</button>
    </div>
    <AboutPane v-if="showAbout" @close="showAbout = false" />
    <div v-if="showConfig" class="config-panel">
      <label>
        Mutation chance: <strong>{{ (store.mutationChance * 100).toFixed(0) }}%</strong>
        <input type="range" min="0" max="1" step="0.01" v-model.number="store.mutationChance">
      </label>
      <label>
        Drawings: <strong>{{ count }}</strong>
        <input type="range" min="4" max="60" step="4" v-model.number="count" @change="store.init(count)">
      </label>
    </div>
    <ul id="game-list">
      <DrawingObject
        v-for="obj in store.drawingObjects"
        :key="obj.id"
        :object="obj"
      />
    </ul>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePlantsStore } from '../stores/plants.js';
import DrawingObject from './DrawingObject.vue';
import AboutPane from './AboutPane.vue';

const store = usePlantsStore();
const isPreview = { value: false };
const showAbout = ref(false);
const showConfig = ref(false);
const count = ref(24);

onMounted(() => {
  store.init(count.value);

  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'r') store.random();
  });
});


function togglePreview() {
  isPreview.value = !isPreview.value;
  const el = document.getElementById('main-pane');
  el.className = isPreview.value ? 'preview' : '';
}
</script>
