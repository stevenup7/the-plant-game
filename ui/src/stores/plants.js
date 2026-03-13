import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlantsStore = defineStore('plants', () => {
  const drawingObjects = ref([]);
  const mutationChance = ref(0.1);

  function init(count = 24) {
    const current = drawingObjects.value;
    if (count > current.length) {
      for (let i = current.length; i < count; i++) {
        current.push({ id: i });
      }
    } else {
      drawingObjects.value = current.slice(0, count);
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

  function breed(drag, drop) {
    const dragGenes = drag.genes.clone();
    const dropGenes = drop.genes.clone();
    drawingObjects.value.forEach(drawing => {
      if (drawing.locked !== true) {
        drawing.drawing.genes = dragGenes.breed(dropGenes, 0.1, mutationChance.value);
        drawing.drawing.draw();
      }
    });
  }

  function breedChecked() {
    const parents = drawingObjects.value.filter(o => o.locked === true);
    if (parents.length < 2) return;
    drawingObjects.value.forEach(drawing => {
      if (drawing.locked === true) return;
      const a = parents[Math.floor(Math.random() * parents.length)];
      let b = parents[Math.floor(Math.random() * parents.length)];
      if (parents.length > 1) {
        while (b === a) b = parents[Math.floor(Math.random() * parents.length)];
      }
      drawing.drawing.genes = a.drawing.genes.clone().breed(b.drawing.genes.clone(), 0.1, mutationChance.value);
      drawing.drawing.draw();
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
    Object.entries(data).forEach(([k, v]) => {
      const objectId = parseInt(k.replace('drawing', ''), 10);
      drawingObjects.value[objectId].drawing.genes.fromJSON(v);
      drawingObjects.value[objectId].drawing.draw();
    });
  }

  return { drawingObjects, mutationChance, init, handleDrop, breedChecked, random, save, load };
});
