<template>
  <li :id="'o' + object.id">
    <div class="object-menu">
      <input id="lock" type="checkbox" v-model="locked">
    </div>
    <div
      ref="plantCanvas"
      class="drawing-wrapper"
      draggable="true"
      :id="'oc' + object.id"
      @drop="onDrop"
      @dragstart="onDragStart"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
    >
      <canvas ref="rasterCanvas" class="raster-canvas" :class="{ visible: isRasterized }"></canvas>
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
const plantCanvas = ref(null);
const rasterCanvas = ref(null);
const isRasterized = ref(false);
let snapInstance = null;
let half = 0;
let dragCounter = 0;

watch(locked, (val) => {
  props.object.locked = val;
});

function rasterize() {
  const svgEl = snapInstance?.node;
  if (!svgEl) return;
  const width = svgEl.clientWidth || parseInt(svgEl.getAttribute('width'), 10);
  const height = svgEl.clientHeight || parseInt(svgEl.getAttribute('height'), 10);
  if (!width || !height) return;

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = rasterCanvas.value;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    snapInstance.clear();
    isRasterized.value = true;
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

onMounted(() => {
  const width = plantCanvas.value.clientWidth;
  half = width / 2;
  const svg = new Snap(width, width);
  svg.prependTo(plantCanvas.value);
  snapInstance = svg;
  props.object.drawing = new DrawingObject(svg);
  props.object.locked = locked.value;

  const originalDraw = props.object.drawing.draw.bind(props.object.drawing);
  props.object.drawing.draw = () => { isRasterized.value = false; originalDraw(); rasterize(); };
  props.object.drawing.draw();
});

function onDragStart(event) {
  event.dataTransfer.setData('text/plain', props.object.id);
  const src = rasterCanvas.value;
  if (src && src.width && src.height) {
    const ghost = document.createElement('canvas');
    ghost.width = src.width;
    ghost.height = src.height;
    ghost.getContext('2d').drawImage(src, 0, 0);
    ghost.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
    document.body.appendChild(ghost);
    event.dataTransfer.setDragImage(ghost, ghost.width / 2, ghost.height / 2);
    requestAnimationFrame(() => document.body.removeChild(ghost));
  }
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

.raster-canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  pointer-events: none;
}

.raster-canvas.visible {
  display: block;
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
  background: rgba(44, 74, 53, 0.72);
}

.drop-zone-swap {
  background: rgba(55, 95, 160, 0.68);
}
</style>
