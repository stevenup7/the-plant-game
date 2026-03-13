<template>
  <div>
    <div class="game-menu">
      <button class="pure-button button-secondary" @click="store.random()">random</button>
      <button class="pure-button button-secondary" @click="store.save()">save</button>
      <button class="pure-button button-secondary" @click="store.load()">load</button>
      <button class="pure-button button-secondary" @click="breedChecked">Breed Checked</button>
      <button class="pure-button button-secondary" @click="togglePreview">Preview</button>
    </div>
    <ul id="game-list" class="pure-g">
      <DrawingObject
        v-for="obj in store.drawingObjects"
        :key="obj.id"
        :object="obj"
      />
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePlantsStore } from '../stores/plants.js';
import DrawingObject from './DrawingObject.vue';

const store = usePlantsStore();
const isPreview = { value: false };

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
