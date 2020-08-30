<template>
<div class="container">
    <div class="grid">
      <tbody>
        <tr v-for='i in column' :id="'column' + '-' + i" :key='i'>
          <td class="node" v-for='j in row' :id="i + '-' + j" :key='j' @mouseenter="handleMouseEnter(i + '-' + j)" @click="handleClick(i + '-' + j)"></td>
        </tr>
      </tbody>
    </div>
    <div class="button-menu">
      <button class="button" @click="dijkstras()">Dijskstras!</button>
      <button class="button" @click="resetBoard()">Reset Board</button>
    </div>
</div>
</template>

<script>
export default {
  mounted () {
    document.getElementById(String(this.startNode[0]) + String('-') + String(this.startNode[1])).classList.add('startNode')
    document.getElementById(String(this.finishNode[0]) + String('-') + String(this.finishNode[1])).classList.add('endNode')
  },
  computed: {
    row: function () {
      return Array.from({ length: this.numRows }, (x, i) => i)
    },
    column: function () {
      return Array.from({ length: this.numCols }, (x, i) => i)
    },
    nodes: function () {
      return Array(this.numCols).fill(null).map(() => new Array(this.numRows).fill(null))
    }
  },
  data: function () {
    return {
      startNode: [2, 2], // Column, Row
      finishNode: [28, 20], // Column, Row
      numRows: 25,
      numCols: 30,
      isDrawing: false
    }
  },
  methods: {
    createGraph: function () {
      for (let i = 0; i < this.numCols; ++i) {
        for (let j = 0; j < this.numRows; ++j) {
          const id = document.getElementById(String(i) + String('-') + String(j)).id
          this.nodes[i][j] = {
            name: id,
            row: i,
            col: j,
            distance: Infinity,
            isWall: false,
            isStart: false,
            isEnd: false,
            isVisited: false,
            isShort: false,
            previousNode: null
          }
          if (document.getElementById(id).classList.contains('wallNode')) {
            this.nodes[i][j].isWall = true
          }
          if (document.getElementById(id).classList.contains('startNode')) {
            this.nodes[i][j].isStart = true
          }
          if (document.getElementById(id).classList.contains('endNode')) {
            this.nodes[i][j].isEnd = true
          }
        }
      }
    },
    handleClick: function (id) {
      if (!this.isDrawing) {
        this.isDrawing = true
        const node = document.getElementById(id)
        if (!node.classList.contains('wallNode')) {
          node.classList.add('wallNode')
        }
      } else {
        this.isDrawing = false
      }
    },
    handleMouseEnter: function (id) {
      if (this.isDrawing) {
        const node = document.getElementById(id)
        if (!node.classList.contains('wallNode')) {
          node.classList.add('wallNode')
        }
      }
    },
    dijkstras: function () {
      this.createGraph()
      const graph = this.nodes
      const startNode = this.nodes[this.startNode[0]][this.startNode[1]]
      const finishNode = this.nodes[this.finishNode[0]][this.finishNode[1]]
      const visitedNodesInOrder = []
      startNode.distance = 0
      const unvisitedNodes = this.getAllNodes(graph)
      while (unvisitedNodes.length) {
        this.sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        if (closestNode.isWall) continue
        if (closestNode.distance === Infinity) return visitedNodesInOrder
        closestNode.isVisited = true
        visitedNodesInOrder.push(closestNode)
        setTimeout(() => {
          if (!closestNode.isStart && !closestNode.isEnd) {
            document.getElementById(String(closestNode.row) + String('-') + String(closestNode.col)).classList.add('visitedNode')
          }
        }, 100 * closestNode.distance)
        if (closestNode === finishNode) {
          setTimeout(() => {
            const shortestPath = this.shortestPath(finishNode)
            setTimeout(() => {
              shortestPath.forEach(el => {
                setTimeout(() => {
                  if (!el.isStart && !el.isEnd) {
                    document.getElementById(String(el.row) + String('-') + String(el.col)).classList.add('shortNode')
                  }
                }, 50 * el.distance)
              })
            }, 50 * closestNode.distance)
          })
          return visitedNodesInOrder
        }
        this.updateUnvisitedNeighbours(closestNode, graph)
      }
    },
    getAllNodes: function (graph) {
      const nodes = []
      for (const row of graph) {
        for (const node of row) {
          nodes.push(node)
        }
      }
      return nodes
    },
    sortNodesByDistance: function (unvisitedNodes) {
      unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
    },
    updateUnvisitedNeighbours: function (node, graph) {
      const unvisitedNeighbours = this.getUnvisitedNeighbours(node, graph)
      for (const neighbour of unvisitedNeighbours) {
        neighbour.distance = node.distance + 1
        neighbour.previousNode = node
      }
    },
    getUnvisitedNeighbours: function (node, graph) {
      const neighbours = []
      const { col, row } = node
      if (row > 0) neighbours.push(graph[row - 1][col])
      if (row < graph.length - 1) neighbours.push(graph[row + 1][col])
      if (col > 0) neighbours.push(graph[row][col - 1])
      if (col < graph[0].length - 1) neighbours.push(graph[row][col + 1])
      return neighbours.filter(neighbour => !neighbour.isVisited)
    },
    shortestPath: function (finishNode) {
      const nodesInShortestPath = []
      let currentNode = finishNode
      while (currentNode !== null) {
        nodesInShortestPath.unshift(currentNode)
        currentNode.isShort = true
        currentNode = currentNode.previousNode
      }
      return nodesInShortestPath
    },
    resetBoard: function () {
      for (let i = 0; i < this.numCols; ++i) {
        for (let j = 0; j < this.numRows; ++j) {
          const node = document.getElementById(String(i) + String('-') + String(j))
          node.classList.remove('wallNode', 'shortNode', 'visitedNode')
        }
      }
      this.createGraph()
    }
  }

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
  background-color: white;
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

.container {
  display: flex;
  flex-direction: column;
  width: 80%;
  justify-content: center;
  align-items: center;
  align-self: center;
  justify-self: center;
}

.grid tbody{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

</style>
