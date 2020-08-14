<template>
  <div class="node" :class="computedClass" @mousedown="mouseDown()" @mouseup="mouseUp()" @mouseenter="mouseEnter()">
  </div>
</template>

<script>
import { eventBus } from '../main.js'
export default {
  computed: {
    computedClass: function () {
      if (this.node.isStart) {
        return 'startNode'
      } else if (this.node.isFinish) {
        return 'endNode'
      } else if (this.node.isWall) {
        return 'wallNode'
      } else if (this.node.isShort) {
        return 'shortNode'
      } else if (this.node.isVisited) {
        return 'visitedNode'
      } else { return 'none' }
    }
  },
  data: function () {
    return {
    }
  },
  methods: {
    mouseDown: function () {
      eventBus.$emit('mouseDown', this)
    },
    mouseUp: function () {
      eventBus.$emit('mouseUp', this)
    },
    mouseEnter: function () {
      eventBus.$emit('mouseEnter', this)
    }
  },
  props: ['node']
}
</script>

<style>
.node {
  border: 1px solid black;
  height: 2rem;
  width: 2rem;
  margin: 0 auto;
  cursor: pointer;
  display: flex;
}
.wallNode {
  animation-name: wallAnimation;
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
.startNode {
  background-color: red;
}
.endNode {
  background-color: green;
}
.visitedNode {
  animation-name: visitedAnimation;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
.shortNode {
  animation-name: shortestPath;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
@keyframes visitedAnimation {
  0% {
    transform: scale(0.3);
    background-color: rgba(0, 0, 66, 0.75);
    border-radius: 100%;
  }
  50% {
    background-color: rgba(17, 104, 217, 0.75);
  }
  75% {
    transform: scale(1.2);
    background-color: rgba(0, 217, 159, 0.75);
  }
  100% {
    transform: scale(1);
    background-color: rgba(0, 190, 218, 0.75);
  }
}
@keyframes shortestPath {
  0% {
    transform: scale(0.6);
    background-color: rgb(255, 254, 106);
    border-radius: 80%;
  }
  50% {
    transform: scale(0.8);
    background-color: rgb(255, 254, 106);
  }
  100% {
    transform: scale(1);
    background-color: rgb(255, 254, 106);
  }
}
@keyframes wallAnimation {
  0% {
    transform: scale(.3);
    background-color: rgb(12, 53, 71);
  }
  50% {
    transform: scale(1.2);
    background-color: rgb(12, 53, 71);
  }
  100% {
    transform: scale(1.0);
    background-color: rgb(12, 53, 71);
  }
}
</style>
