<template>
  <div>
    <div class="game-menu">
      <button class="button-secondary" @click="store.random()">random</button>
      <button class="button-secondary" @click="store.save()">save</button>
      <button class="button-secondary" @click="store.load()">load</button>
      <button class="button-secondary" @click="breedChecked">Breed Checked</button>
      <button class="button-secondary" @click="togglePreview">Preview</button>
      <button class="button-secondary" @click="showAbout = !showAbout">About</button>
    </div>
    <AboutPane v-if="showAbout" />
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

onMounted(() => {
  store.init(24);

  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'r') store.random();
  });
});

function breedChecked() {
  alert('todo');
}

function togglePreview() {
  isPreview.value = !isPreview.value;
  const el = document.getElementById('main-pane');
  el.className = isPreview.value ? 'preview' : '';
}
</script>
