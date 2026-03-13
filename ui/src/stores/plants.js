import { defineStore } from 'pinia';
import { ref } from 'vue';
import _ from 'lodash';

export const usePlantsStore = defineStore('plants', () => {
  const drawingObjects = ref([]);

  function init(count = 24) {
    drawingObjects.value = [];
    for (let i = 0; i < count; i++) {
      drawingObjects.value.push({ id: i });
    }
  }

  function getDrawingById(id) {
    return drawingObjects.value.find(o => o.id === id)?.drawing;
  }

  function handleDrop({ target, dragged, action }) {
    const drag = getDrawingById(target);
    const drop = getDrawingById(dragged);
    if (action === 'swap') {
      swap(drag, drop);
    } else {
      breed(drag, drop);
    }
  }

  function breed(drag, drop, mutation = 0.1) {
    const dragGenes = drag.genes.clone();
    const dropGenes = drop.genes.clone();
    drawingObjects.value.forEach(drawing => {
      if (drawing.locked !== true) {
        drawing.drawing.genes = dragGenes.breed(dropGenes, 0.1, mutation);
        drawing.drawing.draw();
      }
    });
  }

  function swap(drag, drop) {
    drag.swap(drop);
    drop.draw();
    drag.draw();
  }

  function random() {
    drawingObjects.value.forEach(drawing => {
      if (drawing.locked !== true) {
        drawing.drawing.genes.randomize();
        drawing.drawing.draw();
      }
    });
  }

  function save() {
    const saveData = {};
    drawingObjects.value.forEach(drawing => {
      saveData['drawing' + drawing.id] = drawing.drawing.genes.toJSON();
    });
    localStorage.setItem('plants', JSON.stringify(saveData));
  }

  function load() {
    const data = JSON.parse(localStorage.getItem('plants'));
    _.forEach(data, (v, k) => {
      const objectId = parseInt(k.replace('drawing', ''), 10);
      drawingObjects.value[objectId].drawing.genes.fromJSON(v);
      drawingObjects.value[objectId].drawing.draw();
    });
  }

  return { drawingObjects, init, handleDrop, random, save, load };
});
