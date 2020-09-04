<template>
<div class="container">
  <header class="header">
    <div class="header-container">
      <h1 class="title">Pathfinding Visualizer</h1>
      <div class="button-container">
        <button class="button" @click="dijkstras()">Dijkstras</button>
        <button class="button" @click="depthFirstSearch(), dfs=true">DFS</button>
        <button class="button" @click="astar()">A* Search</button>
        <!-- <button class="button" @click="divide(nodes, numRows, numCols)">Generate Maze</button> -->
        <button class="button" @click="resetBoard()">Reset Board</button>
      </div>
    </div>
  </header>
    <p class="information" v-if='dfs'>The Depth First Search algorithm does not guarantee the shortest path. As such, it does not re-highlight the path.</p>
    <div class="grid">
      <tbody>
        <tr v-for='i in column' :id="'column' + '-' + i" :key='i'>
          <td class="node" v-for='j in row' :id="i + '-' + j" :key='j' @mouseenter="handleMouseEnter(i + '-' + j)" @click="handleClick(i + '-' + j)"></td>
        </tr>
      </tbody>
    </div>
</div>
</template>

<script>
export default {
  mounted () {
    const startNode = document.getElementById(String(this.startNode[0]) + String('-') + String(this.startNode[1]))
    startNode.classList.add('startNode')
    const endNode = document.getElementById(String(this.finishNode[0]) + String('-') + String(this.finishNode[1]))
    endNode.classList.add('endNode')
    this.createGraph(this.numRows, this.numCols)
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
      startNode: [15, 15], // Column, Row
      finishNode: [59, 22], // Column, Row
      numRows: 35,
      numCols: 65,
      isDrawing: false,
      running: false,
      dfs: false
    }
  },
  methods: {
    // This function is algorithm agnostic and animates all visited nodes of the chosen algorithm.
    animateVisitedNode: function (node) {
      setTimeout(() => {
        if (!node.isStart && !node.isEnd) {
          document.getElementById(String(node.row) + String('-') + String(node.col)).classList.add('visitedNode')
        }
      }, 100 * node.distance)
    },
    // This function is algorithm agnostic and animates all shortest path nodes of the chosen algorithm.
    animateShortestPath: function (node) {
      console.log(node.distance)
      setTimeout(() => {
        const shortestPath = this.shortestPath(node)
        console.log(shortestPath)
        setTimeout(() => {
          shortestPath.forEach(el => {
            console.log(el.distance)
            setTimeout(() => {
              if (!el.isStart && !el.isEnd) {
                document.getElementById(String(el.row) + String('-') + String(el.col)).classList.add('shortNode')
              }
            }, 50 * el.distance)
          })
        }, 100 * node.distance)
      })
      console.log('test')
    },
    astar: function () {
      this.createGraph(this.numRows, this.numCols)
      const graph = this.nodes
      const startNode = graph[this.startNode[0]][this.startNode[1]]
      const finishNode = graph[this.finishNode[0]][this.finishNode[1]]
      const openList = []
      openList.push(startNode)
      startNode.g = 0
      startNode.f = this.manhattanDistance(startNode, finishNode)
      startNode.isVisited = true

      while (openList.length > 0) {
        const node = this.getLowestF(openList)
        if (node.isEnd) {
          this.animateShortestPath(node)
          return
        }
        openList.splice(openList.indexOf(node), 1)
        const neighbours = this.getUnvisitedNeighbours(node, graph)
        neighbours.forEach(neighbour => {
          neighbour.previousNode = node
          neighbour.g = node.g + 1
          neighbour.distance = neighbour.g // This is for consistency with dijkstras. It's the same as g but g is standard language for a*
          neighbour.h = this.manhattanDistance(neighbour, finishNode)
          neighbour.f = neighbour.g + neighbour.h
          neighbour.isVisited = true
          this.animateVisitedNode(neighbour)
          if (!openList.includes(neighbour)) { openList.push(neighbour) }
        })
      }
      console.log('done')
    },
    createGraph: function (rows, cols) {
      for (let i = 0; i < cols; ++i) {
        for (let j = 0; j < rows; ++j) {
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
            previousNode: null,
            f: Infinity,
            g: Infinity,
            h: 0
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
    getLowestF: function (array) {
      let node = array[0]
      for (let i = 0; i < array.length; ++i) {
        if (array[i].f < node.f) { node = array[i] }
      }
      return node
    },
    // Somewhere along the way rows and columns got confused - this will be fixed for clarity later on.
    divide: function (graph, height, width) {
      if (width < 3 || height < 3) {
        return
      }
      let vertical = Boolean(width > height)
      if (width === height) {
        const flip = Math.floor(Math.random() * 2)
        if (flip === 0) {
          vertical = true
        } else {
          vertical = false
        }
      }
      const node = graph[Math.floor(width / 2)][Math.floor(height / 2)]
      let holeX = Math.floor(Math.random() * width)
      while (holeX === Math.floor(width / 2)) {
        holeX = Math.floor(Math.random() * width)
      }
      let holeY = Math.floor(Math.random() * height)
      while (holeY === Math.floor(height / 2)) {
        holeY = Math.floor(Math.random() * height)
      }
      const hole = graph[holeX][holeY]
      hole.isHole = true
      if (vertical) {
        graph.forEach(row => {
          row.forEach(n => {
            if (n.row === node.row && !n.isStart && !n.isEnd && n.col !== hole.col) {
              setTimeout(() => {
                n.isWall = true
                document.getElementById(n.name).classList.add('wallNode')
              }, n.col * 20)
            }
          })
        })
        const rightGraph = []
        const leftGraph = []
        for (let i = 0; i < graph.length; ++i) {
          const rightRow = []
          const leftRow = []
          for (let j = 0; j < graph[i].length; ++j) {
            if (i > Math.floor(width / 2) && j < height) {
              rightRow.push(graph[i][j])
            } else if (i < Math.floor(width / 2) && j < height) {
              leftRow.push(graph[i][j])
            }
          }
          // It's 4AM don't judge me
          if (rightRow.length !== 0) {
            rightGraph.push(rightRow)
          }
          if (leftRow.length !== 0) {
            leftGraph.push(leftRow)
          }
        }
        setTimeout(() => {
          this.divide(rightGraph, height, rightGraph.length)
        }, height * 5)
        setTimeout(() => {
          this.divide(leftGraph, height, rightGraph.length)
        }, height * 5)
      } else {
        graph.forEach(row => {
          row.forEach(n => {
            if (n.col === node.col && !n.isStart && !n.isEnd && n.row !== hole.row) {
              setTimeout(() => {
                n.isWall = true
                document.getElementById(n.name).classList.add('wallNode')
              }, n.row * 20)
            }
          })
        })
        const upperGraph = []
        const lowerGraph = []

        for (let i = 0; i < graph.length; ++i) {
          const upRow = []
          const lowRow = []
          for (let j = 0; j < graph[i].length; ++j) {
            if (i < width && j < Math.floor(height / 2)) {
              upRow.push(graph[i][j])
            } else if (i < width && j > Math.floor(height / 2)) {
              lowRow.push(graph[i][j])
            }
          }
          upperGraph.push(upRow)
          lowerGraph.push(lowRow)
        }
        setTimeout(() => {
          this.divide(upperGraph, upperGraph[0].length, width)
        }, width * 5)
        setTimeout(() => {
          this.divide(lowerGraph, lowerGraph[0].length, width)
        }, width * 5)
      }
    },
    handleClick: function (id) {
      if (!this.isDrawing) {
        this.isDrawing = true
        const node = document.getElementById(id)
        if (!node.classList.contains('wallNode') && !node.classList.contains('startNode') && !node.classList.contains('endNode')) {
          node.classList.add('wallNode')
        }
      } else {
        this.isDrawing = false
      }
    },
    handleMouseEnter: function (id) {
      if (this.isDrawing) {
        const node = document.getElementById(id)
        if (!node.classList.contains('wallNode') && !node.classList.contains('startNode') && !node.classList.contains('endNode')) {
          node.classList.add('wallNode')
        }
      }
    },
    // Somewhere along the lines rows and column got confused. Will be fixing that for clarity later on.
    getRow: function (graph, rowIndex) {
      const row = []
      graph.forEach(col => {
        col.forEach(node => {
          if (node.col === rowIndex) { row.push(node) }
        })
      })
      return row
    },
    dijkstras: function () {
      this.createGraph(this.numRows, this.numCols)
      const graph = this.nodes
      const startNode = graph[this.startNode[0]][this.startNode[1]]
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
        this.animateVisitedNode(closestNode)
        if (closestNode.isEnd === true) {
          setTimeout(() => {
            this.animateShortestPath(closestNode)
          }, 200)
          return visitedNodesInOrder
        }
        this.updateUnvisitedNeighbours(closestNode, graph)
      }
    },
    depthFirstSearch: function () {
      this.createGraph(this.numRows, this.numCols)
      const graph = this.nodes
      const startNode = graph[this.startNode[0]][this.startNode[1]]
      const stack = []
      let counter = 0
      stack.push(startNode)
      while (stack.length !== 0) {
        const node = stack.pop()
        if (node.isWall) continue
        if (node.isEnd) break
        setTimeout(() => {
          counter++
          this.animateVisitedNode(node)
        }, counter * 5)
        node.isVisited = true
        const neighbours = this.getUnvisitedNeighbours(node, graph)
        neighbours.forEach(el => {
          if (!el.isVisited) {
            counter++
            stack.push(el)
          }
        })
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
    manhattanDistance: function (currentNode, goalNode) {
      return Math.abs(currentNode.row - goalNode.row) + Math.abs(currentNode.col - goalNode.col)
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
      return neighbours.filter(neighbour => (!neighbour.isVisited && !neighbour.isWall))
    },
    shortestPath: function (finishNode) {
      const nodesInShortestPath = []
      let currentNode = finishNode
      while (currentNode !== null) {
        console.log(currentNode)
        nodesInShortestPath.unshift(currentNode)
        currentNode.isShort = true
        currentNode = currentNode.previousNode
      }
      console.log(nodesInShortestPath)
      return nodesInShortestPath
    },
    resetBoard: function () {
      this.dfs = false
      for (let i = 0; i < this.numCols; ++i) {
        for (let j = 0; j < this.numRows; ++j) {
          const node = document.getElementById(String(i) + String('-') + String(j))
          node.classList.remove('wallNode', 'shortNode', 'visitedNode')
        }
      }
      this.createGraph(this.numRows, this.numCols)
    }
  }

}
</script>

<style>

.node {
  border: 1px solid lightblue;
  height: 2em;
  width: 2em;
  margin: 0 auto;
  cursor: pointer;
  display: flex;
  background-color: var(--colour-gray-light-2);
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
  background-image: url(../assets/start.svg);
}
.endNode {
  background-image: url(../assets/finish.svg);
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
    background-color: var(--colour-gray-dark-1);
    border-radius: 100%;
  }
  50% {
    background-color: var(--colour-primary-dark);
  }
  75% {
    transform: scale(1.2);
    background-color: var(--colour-primary);
  }
  100% {
    transform: scale(1);
    background-color: var(--colour-primary-light);
  }
}
@keyframes shortestPath {
  0% {
    transform: scale(0.6);
    background-color: darkblue;
    border-radius: 80%;
  }
  50% {
    transform: scale(0.8);
    background-color: darkblue;
  }
  100% {
    transform: scale(1);
    background-color: darkblue;
  }
}
@keyframes wallAnimation {
  0% {
    transform: scale(.3);
    background-color: var(--colour-gray-dark-3);
  }
  50% {
    transform: scale(1.2);
    background-color: var(--colour-gray-dark-2);
  }
  100% {
    transform: scale(1.0);
    background-color: var(--colour-gray-dark-1);
  }
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  background-color: var(--colour-gray-dark-2);
  }

.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 95%;
}

.title {
  color: var(--colour-gray-light-1);
  font-size: 2.2em;
}

.button {
  border-radius: 6px;
  border: 1px solid var(--colour-gray-light-1);
  height: 2em;
  width: 8em;
  margin: 1em;
  background-color: white;
  cursor: pointer;
}

.button:hover {
  background-color: var(--colour-gray-dark-3);
  border: 1px solid white;
}

.information {
  font-size: 1.5em;
  color: var(--colour-gray-dark-1);
}

.grid tbody{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: white;
  border: 1px solid lightblue;
  margin-top: 3em;
}
</style>
