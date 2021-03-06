let drawCell = function (leftTopCornerX, leftTopCornerY, size = 2, ctx = window.ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(leftTopCornerX, leftTopCornerY, size, size);
};

let drawEmpty = function (leftTopCornerX, leftTopCornerY, size = 2, ctx = window.ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(leftTopCornerX, leftTopCornerY, size, size);
};

let mapArrToCanvas = function (pos) {
    return window.gridSize * pos;
};

let drawGrid = function (size, width = canvas.width, height = canvas.height) {
    for (let x = size; x < width; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }

    for (let y = size; y < height; y += size) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

    }

    ctx.strokeStyle = 'grey';
    ctx.stroke();
};

let generateRandomCellArr = function (arr, size, probabilityOfOccupied) {
    let correctArray = 0;

    for (i = 0; i < size; i++) {
        let random = Math.random();
        if (random < probabilityOfOccupied) {
            arr[i] = 1;
            correctArray = 1;
        } else {
            arr[i] = 0;
        }
    }
    arr.forEach((cell, index) => {
        if (cell == 1)
            drawCell(mapArrToCanvas(index), 0, window.gridSize);
        else {
            drawEmpty(mapArrToCanvas(index), 0, window.gridSize);
        }
    });

};

let convertRuleToBinAndReverse = function (rule = 30) {
    let binaryRule = Number(rule).toString(2);
    let binaryRuleReversed = binaryRule.split("").reverse().join("");
    while (binaryRuleReversed.length < 8) binaryRuleReversed += "0";
    return binaryRuleReversed;
}

let getNewCellState = function (cellIndex, rule = 30) {
    let ruleBin = convertRuleToBinAndReverse(rule);


    let cellB = CellArr[currentTime][cellIndex];
    let cellA = CellArr[currentTime][cellIndex - 1],
        cellC = CellArr[currentTime][cellIndex + 1];

    if (window.periodity) {
        if (cellIndex == 0) cellA = CellArr[currentTime][CellArr[currentTime].length - 1];
        if (cellIndex == CellArr[currentTime].length - 1) cellC = CellArr[currentTime][CellArr[currentTime][0]];
    } else {
        if (cellIndex == 0) cellA = 0;
        if (cellIndex == CellArr[currentTime].length - 1) cellC = 0;
    }

    let neightboursVal = parseInt(String(cellA) + String(cellB) + String(cellC), 2);

    return ruleBin[neightboursVal];
};


let drawLevel = function (time) {
    CellArr[time].forEach((cell, index) => {
        if (cell == 1)
            drawCell(mapArrToCanvas(index), currentTime * window.gridSize, window.gridSize);
        else {
            drawEmpty(mapArrToCanvas(index), currentTime * window.gridSize, window.gridSize);
        }
    });
};

let startCellAutomaton = function () {
    window.growTime = document.getElementById("growthTime").valueAsNumber + 2;
    window.numberOfCells = document.getElementById("cells").valueAsNumber;
    window.occupiedProbability = document.getElementById("occupiedProbability").valueAsNumber / 100;
    window.rule = document.getElementById("rule").options[document.getElementById("rule").selectedIndex].value;
    window.periodity = document.getElementById("peroid").checked;


    for (currentTime = 0; currentTime < growTime - 1; currentTime++) {
        let line = "";
        window.CellArr[currentTime].forEach((cell, index) => {
            line += " " + cell;
            window.CellArr[window.currentTime + 1][index] = getNewCellState(index, window.rule); // set next timestamp cell value
            drawLevel(window.currentTime);
        });
    }

    drawGrid()
};

let init = function () {
    window.canvas = document.getElementById("workingCanvas");
    window.ctx = canvas.getContext("2d");
    window.CellArr = [[]];
    window.growTime = document.getElementById("growthTime").valueAsNumber + 2;
    window.canvas.width = window.innerWidth - 40;
    window.currentTime = 0;
    window.numberOfCells = document.getElementById("cells").valueAsNumber;
    window.occupiedProbability = document.getElementById("occupiedProbability").valueAsNumber / 100;
    window.rule = document.getElementById("rule").options[document.getElementById("rule").selectedIndex].value;
    window.periodity = document.getElementById("peroid").checked;


    for (i = 0; i < growTime; i++) CellArr[i] = []; // init all level arrays


    window.gridSize = (canvas.width) / numberOfCells;

    window.canvas.height = growTime * window.gridSize;
    generateRandomCellArr(window.CellArr[0], numberOfCells, window.occupiedProbability);


    drawGrid(window.gridSize);


};

document.addEventListener("DOMContentLoaded", function () {
    window.debugVars = init();
    document.getElementById("workingCanvas").addEventListener('click', function (event) {

        var x = event.pageX,
            y = event.pageY;
        if (getCursorPosition(canvas, event)[1] < window.gridSize) {
            let clickedCell = Math.floor(getCursorPosition(canvas, event)[0] / window.gridSize);
            if (CellArr[0][clickedCell] == 1) CellArr[0][clickedCell] = 0;
            else CellArr[0][clickedCell] = 1;


            if (CellArr[0][clickedCell] == 1)
                drawCell(mapArrToCanvas(clickedCell), 0, window.gridSize);
            else {
                drawEmpty(mapArrToCanvas(clickedCell), 0, window.gridSize);
            }

        }
    }, false);
});

function getCursorPosition(canvas, event) {
    var x, y;

    let canoffset = canvas.getBoundingClientRect();
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor((canoffset.top)) + 1;

    return [x, y];
}

