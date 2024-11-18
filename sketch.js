
let grid = []
let size = 30;
let tooltip = "block"
let run = false
let STATE_COLOR;

let start_pos = [5, 5];
let end_pos = [12, 20];

let visited = [];
let closed = [];
let last_node;


const run_btn = document.querySelector('#play-btn');
const rst_btn = document.querySelector('#rst-btn');

const blck_btn = document.querySelector('#block')
const st_btn = document.querySelector('#start')
const end_btn = document.querySelector('#end')

function setup() {
    createCanvas(windowWidth, windowHeight)

    STATE_COLOR = {
        path: color(240),
        block: "grey",
        highlight: "red",
        start: "blue",
        end: "green",
        active: "yellow",
        crct: "violet"
    }

    // initializing the grid
    let cols = width / size;
    let rows = height / size;
    for (let i = 0; i < rows; i++) {
        grid.push([])
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j, "path", size, STATE_COLOR)
        }
    }

    // handling ui
    run_btn.addEventListener('click', () => {
        run = !run;
    })
    rst_btn.addEventListener('click', () => {
        resetGridPreserveBlock()
        grid[start_pos[0]][start_pos[1]].state = "start"
        grid[end_pos[0]][end_pos[1]].state = "end"
        last_node = grid[start_pos[0]][start_pos[1]]
    })
    blck_btn.addEventListener('click', () => {
        selectTooltip("block")
    })
    st_btn.addEventListener('click', () => {
        selectTooltip("start")
    })
    end_btn.addEventListener('click', () => {
        selectTooltip("end")
    })



    // setting arbitrary start and end
    grid[start_pos[0]][start_pos[1]].state = "start"
    grid[end_pos[0]][end_pos[1]].state = "end"
    last_node = grid[start_pos[0]][start_pos[1]]
    frameRate(40)
}

function draw() {
    renderGrid(grid)
    if (last_node.row == end_pos[0] && last_node.col == end_pos[1]) {
        showPath(end_pos);
        renderGrid(grid)
        // noLoop()
    }
    else if (run) {
        gridUpdate()
    }

}

function renderGrid(gd) {
    for (let row of gd) {
        for (let cell of row) {
            cell.show()
        }
    }
}

class Cell {
    constructor(row, col, state, size, state_color) {
        this.col = col
        this.row = row
        this.state = state
        this.state_clr = state_color
        this.size = size
        this.g = 0
        this.h = 0
        this.f = 1000
        this.parent = null
    }
    show() {
        fill(this.state_clr[this.state])
        rect((this.col * this.size) + 5, (this.row * this.size) + 5, this.size, this.size)

        
        // DEGUGGING
        // if (this.parent != null) {
        //     fill("white")
        //     text(this.f.toPrecision(2), this.col * this.size, this.row * this.size)
        // }
    }
    highlight() {
        if (this.state != "block") {
            this.state = "highlight"
        }
    }
    generateF(end_pos) {
        if (this.state != "block") {
            this.g = this.row != this.parent.row || this.col != this.parent.col ? this.parent.g + 1 : this.parent.g + 1.4
            this.h = calculateHeuristicDistance([this.row, this.col], end_pos)
            this.f = this.g + this.h;
        }
        else {
            this.f = 10000
        }
    }
    setParent(cell) {
        this.parent = cell
    }
}


function getNeighbours(grid, row, col) {
    let n = []

    if (row > 0) {
        n.push(grid[row - 1][col])
        if (col > 0) {
            n.push(grid[row - 1][col - 1])
        }
        if (col < grid[0].length - 1) {
            n.push(grid[row - 1][col + 1])
        }
    }
    if (col > 0) {
        n.push(grid[row][col - 1])
    }
    if (col < grid[0].length) {
        n.push(grid[row][col + 1])
    }
    if (row < grid.length - 1) {
        n.push(grid[row + 1][col])
        if (col > 0) {
            n.push(grid[row + 1][col - 1])
        }
        if (col < grid[0].length) {
            n.push(grid[row + 1][col + 1])
        }
    }
    return n;
}

function gridUpdate() {
    
    let n = getNeighbours(grid, last_node.row, last_node.col)
    n.forEach(cell => {
        if (!visited.includes(cell)) {
            cell.highlight()
            cell.setParent(last_node)
            cell.generateF(end_pos)
            visited.push(cell)
        }
    })
    visited.sort((a, b) => a.f - b.f);
    last_node.state = "highlight"
    for (let i = 0; i < visited.length; i++) {
        if (!closed.includes(visited[i])) {
            last_node = visited[i]
            break
        }
    }
    last_node.state = "active"
    closed.push(last_node)
}

function calculateHeuristicDistance(start_pos, end_pos) {
    let dx = abs(start_pos[1] - end_pos[1])
    let dy = abs(start_pos[0] - end_pos[0])

    const h = (dx + dy) + (1.41 - 2) * min(dx, dy)
    return h
}

class Grid {
    constructor() {
        this.start_pos = []
        this.end_pos = []
    }
    setStart(pos) {
        this.start_pos = pos
    }
    setEnd(pos) {
        this.end_pos = pos
    } 
}

function resetGrid() {

    run = false
    visited = []
    closed = []
    grid = []
    // initializing the grid
    let cols = width / size;
    let rows = height / size;
    for (let i = 0; i < rows; i++) {
        grid.push([])
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j, "path", size, STATE_COLOR)
            
        }
    }

}

function resetGridPreserveBlock() {
    run = false
    visited = []
    closed = []
    // initializing the grid
    let cols = width / size;
    let rows = height / size;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j].state != "block") {
                grid[i][j] = new Cell(i, j, "path", size, STATE_COLOR)
            }
        }
    }
}


function showPath(endPos, count = 0) {
    grid[endPos[0]][[endPos[1]]].parent.state = "crct"
    let new_end = [grid[endPos[0]][[endPos[1]]].parent.row, grid[endPos[0]][[endPos[1]]].parent.col]
    if (count < 20) {
        showPath(new_end, count + 1)
        STATE_COLOR.highlight = ""
    }
}



function mousePressed() {
    if (mouseX < width - 300 && mouseY < 600) {
        const cellRow = Math.floor(mouseY / size);
        const cellCol = Math.floor(mouseX / size)

        if (tooltip != "block") {
            if (tooltip == "start") {
                grid[start_pos[0]][start_pos[1]].state = "path"
                start_pos = [cellRow, cellCol]
                grid[start_pos[0]][start_pos[1]].state = "start"
                last_node = grid[start_pos[0]][start_pos[1]]
            }
            else if (tooltip == "end") {
                grid[end_pos[0]][end_pos[1]].state = "path"
                end_pos = [cellRow, cellCol]
                grid[end_pos[0]][end_pos[1]].state = "end"
            }
        }
        else {
            grid[cellRow][cellCol].state = "block"
        }
    }
}
