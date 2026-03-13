<template>
  <li class="pure-u-1-2 pure-u-md-1-4 pure-u-lg-1-6" :id="'o' + object.id" :class="{ 'is-over': isOver }">
    <div class="object-menu">
      <input id="lock" type="checkbox" v-model="locked">
      {{ message }}
    </div>
    <div
      draggable="true"
      :id="'oc' + object.id"
      @drop="onDrop"
      @dragstart="onDragStart"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
    />
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
const message = ref('');
let half = 0;

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
  const draggingId = parseInt(event.dataTransfer.getData('text'), 10);
  store.handleDrop({
    target: props.object.id,
    dragged: draggingId,
    action: message.value
  });
  message.value = '';
  isOver.value = false;
}

function onDragEnter() {
  isOver.value = true;
}

function onDragLeave() {
  message.value = '';
  isOver.value = false;
}

function onDragOver(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  message.value = (event.clientX - rect.left > half) ? 'swap' : 'breed';
  event.preventDefault();
}
</script>
