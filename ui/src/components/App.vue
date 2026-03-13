<template>
  <div>
    <div class="game-menu">
      <button class="button-secondary" @click="store.random()">random</button>
      <button class="button-secondary" @click="store.save()">save</button>
      <button class="button-secondary" @click="store.load()">load</button>
      <button class="button-secondary" @click="store.breedChecked()">Breed Checked</button>
      <button class="button-secondary" @click="togglePreview">Preview</button>
      <button class="button-secondary" @click="showConfig = !showConfig">Config</button>
      <button class="button-secondary" @click="showAbout = !showAbout">About</button>
    </div>
    <AboutPane v-if="showAbout" />
    <div v-if="showConfig" class="config-panel">
      <label>
        Mutation chance: <strong>{{ (store.mutationChance * 100).toFixed(0) }}%</strong>
        <input type="range" min="0" max="1" step="0.01" v-model.number="store.mutationChance">
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

onMounted(() => {
  store.init(24);

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
