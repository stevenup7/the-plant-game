<template>
  <div>
    <div class="header">
      <h1>Plants <span class="header-tagline">an experiment in generative drawing</span></h1>
      <div class="header-actions">
        <button class="button-header" @click="openSave">save</button>
        <button class="button-header" @click="openLoad">load</button>
        <button class="button-header" @click="togglePreview">preview</button>
        <button class="button-header" @click="showConfig = !showConfig">config</button>
        <button class="button-header" @click="showAbout = !showAbout">about</button>
      </div>
    </div>
    <div class="game-menu">
      <button class="button-secondary" @click="store.random()"><u v-if="ctrlHeld">r</u><template v-else>r</template>andom</button>
      <button class="button-secondary" @click="store.breedChecked()"><u v-if="ctrlHeld">b</u><template v-else>b</template>reed checked</button>
    </div>
    <AboutPane v-if="showAbout" @close="showAbout = false" />

    <!-- Save dialog -->
    <div v-if="showSaveDialog" class="about-overlay" @click.self="showSaveDialog = false">
      <div class="dialog-pane">
        <button class="about-close" @click="showSaveDialog = false" aria-label="Close">×</button>
        <h2>Save</h2>
        <form @submit.prevent="confirmSave">
          <input
            class="dialog-input"
            v-model="saveName"
            placeholder="Name this save…"
            ref="saveInput"
            autocomplete="off"
          />
          <div class="dialog-actions">
            <button type="submit" class="button-success" :disabled="!saveName.trim()">save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Load dialog -->
    <div v-if="showLoadDialog" class="about-overlay" @click.self="showLoadDialog = false">
      <div class="dialog-pane">
        <button class="about-close" @click="showLoadDialog = false" aria-label="Close">×</button>
        <h2>Load</h2>
        <p v-if="saves.length === 0" class="dialog-empty">No saves yet.</p>
        <ul v-else class="saves-list">
          <li v-for="name in saves" :key="name" class="saves-item">
            <button class="saves-name" @click="confirmLoad(name)">{{ name }}</button>
            <button class="saves-delete" @click="confirmDelete(name)" aria-label="Delete">×</button>
          </li>
        </ul>
      </div>
    </div>
    <!-- Config dialog -->
    <div v-if="showConfig" class="about-overlay" @click.self="showConfig = false">
      <div class="about-pane config-panel">
        <button class="about-close" @click="showConfig = false" aria-label="Close">×</button>
        <h2>Config</h2>
        <label>
          Mutation chance: <strong>{{ (store.mutationChance * 100).toFixed(0) }}%</strong>
          <input type="range" min="0" max="0.5" step="0.01" v-model.number="store.mutationChance">
        </label>
        <label>
          Drawings: <strong>{{ count }}</strong>
          <input type="range" min="4" max="100" step="4" v-model.number="count" @change="store.init(count)">
        </label>
      </div>
    </div>
    <ul id="game-list" :class="{ preview: isPreview }">
      <DrawingObject
        v-for="obj in store.drawingObjects"
        :key="obj.id"
        :object="obj"
      />
    </ul>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { usePlantsStore } from '../stores/plants.js';
import DrawingObject from './DrawingObject.vue';
import AboutPane from './AboutPane.vue';

const store = usePlantsStore();
const isPreview = ref(false);
const showAbout = ref(false);
const showConfig = ref(false);
const count = ref(24);
const ctrlHeld = ref(false);

const showSaveDialog = ref(false);
const showLoadDialog = ref(false);
const saveName = ref('');
const saves = ref([]);
const saveInput = ref(null);

function openSave() {
  saveName.value = '';
  showSaveDialog.value = true;
  nextTick(() => saveInput.value?.focus());
}

function confirmSave() {
  const name = saveName.value.trim();
  if (!name) return;
  store.save(name);
  showSaveDialog.value = false;
}

function openLoad() {
  saves.value = store.listSaves();
  showLoadDialog.value = true;
}

async function confirmLoad(name) {
  const savedCount = store.getSaveCount(name);
  store.init(savedCount);
  await nextTick();
  store.load(name);
  count.value = savedCount;
  showLoadDialog.value = false;
}

function confirmDelete(name) {
  store.deleteSave(name);
  saves.value = store.listSaves();
}

onMounted(() => {
  store.init(count.value);

  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Control') ctrlHeld.value = true;
    if (e.key === 'Escape') {
      showConfig.value = false;
      showSaveDialog.value = false;
      showLoadDialog.value = false;
      showAbout.value = false;
    }
  });
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Control') ctrlHeld.value = false;
    if (e.key === 'r' && e.ctrlKey) store.random();
    if (e.key === 'b' && e.ctrlKey) store.breedChecked();
  });
});


function togglePreview() {
  isPreview.value = !isPreview.value;
}
</script>
