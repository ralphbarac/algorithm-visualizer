<template>
<div class="tutorial-modal">
  <div class="modal">
    <div class="page" v-if='page === 0'>
      <h1>Pathfinding Visualizer Tutorial</h1>
      <div class="modal-content-container">
        <p class="description">This short tutorial will walk you through all of the features of this application.</p>
        <p class="description">You can skip the tutorial if you've already been through it.</p>
      </div>
      <div class="footer">
        <div class="button-container">
          <button class="modal-button" @click='skip()'>SKIP</button>
          <a href='https://github.com/ralphbarac/algorithm-visualizer'><button class="modal-button">GITHUB</button></a>
        </div>
        <div class="button-container">
          <button class="modal-button" @click='nextPage()'>NEXT</button>
        </div>
      </div>
    </div>
    <div class="page" v-if='page === 1'>
      <h1>Picking An Algorithm</h1>
      <div class="modal-content-container">
        <p class="description">Choose an algorithm from the 'Algorithms' drop down menu.</p>
        <p class="description">Currently you can choose between Dijkstra's, Depth First Search (DFS), and A* Search.</p>
      </div>
      <div class="footer">
        <div class="button-container">
          <button class="modal-button" @click='skip()'>SKIP</button>
          <a href='https://github.com/ralphbarac/algorithm-visualizer'><button class="modal-button">GITHUB</button></a>
        </div>
        <div class="button-container">
          <button class="modal-button" @click='prevPage()'>PREVIOUS</button>
          <button class="modal-button" @click='nextPage()'>NEXT</button>
        </div>
      </div>
    </div>
    <div class="page" v-if='page === 2'>
      <h1>Algorithms</h1>
      <div class="modal-content-container">
        <p class="description-one-block">
          <b>Dijkstra's Algorithm - </b> the father of pathfinding algorithms. This algorithm will guarantee the shortest path.<br>
          <b>A* Search - </b> Uses heuristics (specifically, the Manhattan Heuristic) to guarantee the shortest path much faster than Dijkstra's Algorithm.<br>
          <b>Depth-First Search - </b>This algorithm searches the deepest nodes of the graph before searching outwards. It does not guarantee the shortest path.
          </p>
      </div>
      <div class="footer">
        <div class="button-container">
          <button class="modal-button" @click='skip()'>SKIP</button>
          <a href='https://github.com/ralphbarac/algorithm-visualizer'><button class="modal-button">GITHUB</button></a>
        </div>
        <div class="button-container">
          <button class="modal-button" @click='prevPage()'>PREVIOUS</button>
          <button class="modal-button" @click='nextPage()'>NEXT</button>
        </div>
      </div>
    </div>
    <div class="page" v-if='page === 3'>
      <h1>Adding Walls</h1>
      <div class="modal-content-container">
        <p class="description">Click and move the mouse around to draw walls on the grid. Note: This is not 'click and drag', you do not need to hold the mouse down. Click again to stop drawing.</p>
        <p class="description">Walls act as nodes that the pathfinder cannot cross and must find a way around.</p>
      </div>
      <div class="footer">
        <div class="button-container">
          <button class="modal-button" @click='skip()'>SKIP</button>
          <a href='https://github.com/ralphbarac/algorithm-visualizer'><button class="modal-button">GITHUB</button></a>
        </div>
        <div class="button-container">
          <button class="modal-button" @click='prevPage()'>PREVIOUS</button>
          <button class="modal-button" @click='nextPage()'>NEXT</button>
        </div>
      </div>
    </div>
    <div class="page" v-if='page === 4'>
      <h1>Other Notes</h1>
      <div class="modal-content-container">
        <p class="description">Make sure you use the 'Reset Board' button after running an algorithm, and don't click the buttons multiple times. This will be fixed soon but currently there is no lock while an algorithm is running.</p>
        <p class="description">Future update plans include: Maze Generation (using recursive division), making the application more visually appealing, and adding the option for user weights on nodes. I'd also rather have the walls be click and drag as opposed to click and hover. Lastly, moving starting and ending nodes are important and that will be implemented shortly.</p>
      </div>
      <div class="footer">
        <div class="button-container">
          <button class="modal-button" @click='skip()'>SKIP</button>
          <a href='https://github.com/ralphbarac/algorithm-visualizer'><button class="modal-button">GITHUB</button></a>
        </div>
        <div class="button-container">
          <button class="modal-button" @click='prevPage()'>PREVIOUS</button>
          <button class="modal-button" @click='finish()'>FINISH</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import { eventBus } from '../main'
/*
Step 1: draw walls by clicking and hovering, stop drawing by clicking again
Step 2: choose an algorithm to run (explanation of each algorithm)
Step 3: reset the board and repeat!
next page: features coming soon/bugs working on, as well as github
*/

export default {
  data: function () {
    return {
      page: 0
    }
  },
  methods: {
    skip: function () {
      eventBus.$emit('showTutorial', false)
    },
    nextPage: function () {
      this.page++
    },
    prevPage: function () {
      this.page--
    },
    finish: function () {
      eventBus.$emit('showTutorial', false)
    }
  }

}

</script>

<style scoped>

.tutorial-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 75%;
  width: 75%;
  margin: 2em;
  background-color: var(--colour-gray-light-1);
  border: 1px solid black;
  -webkit-box-shadow: 2px 2px 17px -3px rgba(0,0,0,1);
  -moz-box-shadow: 2px 2px 17px -3px rgba(0,0,0,1);
  box-shadow: 2px 2px 17px -3px rgba(0,0,0,1);
}

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: 2em;
  color: var(--colour-primary-dark);
  margin: 2em;
  height: 100%;
}

.modal-content-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 30%;
}

.description {
  width: 45%;
}

.description a {
  text-decoration: none;
  color: var(--colour-primary-dark);
}

.description-one-block {
  width: 80%;
}

.description a:visited {
  color: var(--colour-gray-dark-1);
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
}

.modal-button {
  border: 1px solid var(--colour-primary-dark);
  border-radius: 6px;
  width: 6em;
  height: 2em;
  color: var(--colour-gray-dark-1);
  font-weight: bold;
  cursor: pointer;
  margin-left: 2em;
}

.modal-button:hover {
  border: 1px solid black;
  background-color: var(--colour-primary-dark);
  color: var(--colour-gray-light-1);
}

</style>
