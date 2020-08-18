<template>
<div class="container">
  <div class="header-menu">
    <button class="button" @click="visualizeDijkstra()">Dijskstras!</button>
    <button class="button" @click="resetBoard()">Reset Board</button>
  </div>
  <div class="grid">
    <div v-for="(row, i) in this.grid" :key="i">
      <div v-for="(node, j) in row" :key="j"><node
                                                :node="grid[j][i]"
                                                ></node></div>
    </div>
  </div>
</div>
</template>

<script>
import Node from './Node.vue'
import { eventBus } from '../main.js'
const START_NODE_ROW = 12
const START_NODE_COL = 12
const FINISH_NODE_ROW = 5
const FINISH_NODE_COL = 5
export default {
  created: function () {
    eventBus.$on('mouseDown', (node) => {
      this.handleMouseDown(node)
    })
    eventBus.$on('mouseUp', (node) => {
      this.handleMouseUp()
    })
    eventBus.$on('mouseEnter', (node) => {
      this.handleMouseEnter(node)
    })
  },
  components: {
    Node
  },
  data: function () {
    return {
      grid: this.createGrid(),
      mouseisPressed: false
    }
  },
  methods: {
    createGrid: function () {
      const grid = []
      for (let row = 0; row < 25; row++) {
        const currentRow = []
        for (let col = 0; col < 25; col++) {
          currentRow.push(this.createNode(row, col))
        }
        grid.push(currentRow)
      }
      return grid
    },
    createNode: function (row, col) {
      return {
        index: (row, col),
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        isShort: false,
        previousNode: null
      }
    },
    handleMouseDown: function (node) {
      this.mouseisPressed = true
      node.node.isWall = !node.node.isWall
    },
    handleMouseEnter: function (node) {
      if (this.mouseisPressed) { node.node.isWall = !node.node.isWall }
    },
    handleMouseUp: function () {
      this.mouseisPressed = false
    },
    dijkstras: function (grid, startNode, finishNode) {
      const visitedNodesInOrder = []
      startNode.distance = 0
      const unvisitedNodes = this.getAllNodes(grid)
      while (unvisitedNodes.length) {
        this.sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        if (closestNode.isWall) continue
        if (closestNode.distance === Infinity) return visitedNodesInOrder
        closestNode.isVisited = true
        visitedNodesInOrder.push(closestNode)
        if (closestNode === finishNode) return visitedNodesInOrder
        this.updateUnvisitedNeighbours(closestNode, grid)
      }
    },
    getAllNodes: function (grid) {
      const nodes = []
      for (const row of grid) {
        for (const node of row) {
          nodes.push(node)
        }
      }
      return nodes
    },
    sortNodesByDistance: function (unvisitedNodes) {
      unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
    },
    updateUnvisitedNeighbours: function (node, grid) {
      const unvisitedNeighbours = this.getUnvisitedNieghbours(node, grid)
      for (const neighbour of unvisitedNeighbours) {
        neighbour.distance = node.distance + 1
        neighbour.previousNode = node
      }
    },
    getUnvisitedNieghbours: function (node, grid) {
      const neighbours = []
      const { col, row } = node
      if (row > 0) neighbours.push(grid[row - 1][col])
      if (row < grid.length - 1) neighbours.push(grid[row + 1][col])
      if (col > 0) neighbours.push(grid[row][col - 1])
      if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1])
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
    visualizeDijkstra: function () {
      const startNode = this.grid[START_NODE_ROW][START_NODE_COL]
      const finishNode = this.grid[FINISH_NODE_ROW][FINISH_NODE_COL]
      const visitedNodesInOrder = this.dijkstras(this.grid, startNode, finishNode)
      const nodesInShortestPath = this.shortestPath(finishNode)
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPath)
    },
    animateDijkstra: function (visitedNodesInOrder, nodesInShortestPath) {
      for (let i = 0; i <= visitedNodesInOrder.length; ++i) {
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPath)
          }, 5 * i)
          return
        }
        setTimeout(() => {
          const node = visitedNodesInOrder[i]
          node.nodeVisited = true
        }, 10 * i)
      }
    },
    animateShortestPath: function (nodesInShortestPath) {
      for (let i = 0; i < nodesInShortestPath.length; ++i) {
        setTimeout(() => {
          const node = nodesInShortestPath[i]
          node.nodeShort = true
        }, 50 * i)
      }
    },
    resetBoard: function () {
      this.grid = this.createGrid()
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-menu {
  display: flex;
  flex-direction: row;
}
.button {
  cursor: pointer;
  margin: 1rem;
}
.grid {
  display: flex;
  flex-wrap: nowrap;
  margin: 0 auto;
  padding: 0 auto;
}

</style>
