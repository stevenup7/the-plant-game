<template>
  <li :id="'o' + object.id">
    <div class="object-menu">
      <input id="lock" type="checkbox" v-model="locked">
    </div>
    <div
      class="drawing-wrapper"
      draggable="true"
      :id="'oc' + object.id"
      @drop="onDrop"
      @dragstart="onDragStart"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
    >
      <div v-if="isOver" class="drop-overlay">
        <div class="drop-zone drop-zone-breed" :class="{ active: action === 'breed' }">breed</div>
        <div class="drop-zone drop-zone-swap" :class="{ active: action === 'swap' }">swap</div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Snap from 'snapsvg-cjs';
import DrawingObject from '../plant.js';
import { usePlantsStore } from '../stores/plants.js';

const props = defineProps(['object']);
const store = usePlantsStore();

const isOver = ref(false);
const locked = ref(false);
const action = ref('');
let half = 0;
let dragCounter = 0;

watch(locked, (val) => {
  props.object.locked = val;
});

onMounted(() => {
  const plantCanvas = document.querySelector('#oc' + props.object.id);
  const width = plantCanvas.clientWidth;
  half = width / 2;
  const svg = new Snap(width, width);
  svg.prependTo(plantCanvas);
  props.object.drawing = new DrawingObject(svg);
  props.object.locked = locked.value;
  props.object.drawing.draw();
});

function onDragStart(event) {
  event.dataTransfer.setData('text/plain', props.object.id);
}

function onDrop(event) {
  event.preventDefault();
  dragCounter = 0;
  const draggingId = parseInt(event.dataTransfer.getData('text'), 10);
  store.handleDrop({
    target: props.object.id,
    dragged: draggingId,
    action: action.value
  });
  action.value = '';
  isOver.value = false;
}

function onDragEnter() {
  dragCounter++;
  isOver.value = true;
}

function onDragLeave() {
  dragCounter--;
  if (dragCounter === 0) {
    action.value = '';
    isOver.value = false;
  }
}

function onDragOver(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  action.value = (event.clientX - rect.left > half) ? 'swap' : 'breed';
  event.preventDefault();
}
</script>

<style scoped>
.drawing-wrapper {
  position: relative;
}

.drop-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
  z-index: 10;
}

.drop-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85em;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  transition: opacity 0.1s;
}

.drop-zone.active {
  opacity: 0.85;
}

.drop-zone-breed {
  background: rgba(28, 184, 65, 0.7);
}

.drop-zone-swap {
  background: rgba(66, 184, 221, 0.7);
}
</style>
