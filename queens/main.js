var dim = 8;

var sizeX = 60;
var sizeY = 60;

////////////////////////////////////////////////////////////////////////////////

function Board(dim, elem) {
    this.dim = dim;
    this.elem = elem;

    this.data = [];
    for (var i = 0; i < dim; ++i)
    {
        this.data[i] = []
        for (var j = 0; j < dim; ++j)
        {
            this.data[i][j] = {
                x: i,
                y: j,
                attacked: 0,
                invalid: false,
            }
        }
    }

    this.queens = new Set();

    this.updateBoardState = function()
    {
        for (var i = 0; i < dim; ++i)
        {
            for (var j = 0; j < dim; ++j)
            {
                var position = j * this.dim + i;

                var cell = this.data[i][j];
                cell.attacked = 0;
                cell.invalid = false;
                for (let queen of this.queens)
                {
                    var queenX = queen % this.dim;
                    var queenY = Math.floor(queen / this.dim);
                    if (cell.x == queenX ||
                        cell.y == queenY ||
                        cell.x - cell.y == queenX - queenY ||
                        cell.x + cell.y == queenX + queenY)
                    {
                        cell.attacked++;

                        if (cell.attacked > 1 && this.queens.has(position))
                            cell.invalid = true;
                    }
                }
            }
        }
    }

    this.toggleQueen = function(x, y)
    {
        var position = y * this.dim + x;

        if (this.queens.has(position))
            this.queens.delete(position);
        else
            this.queens.add(position);
    }

    this.setState = function(state)
    {
        this.reset();
        for (var i = 0; i < state.length; ++i)
        {
            this.toggleQueen(state[i], i);
        }
        this.updateBoardState();
        this.drawBoard();

        // alert(state.join(", "));
    }

    this.reset = function()
    {
        this.queens.clear();
    }

    this.drawBoard = function()
    {
        this.updateBoardState();

        while (this.elem.firstChild)
            this.elem.removeChild(this.elem.firstChild);

        var boardSVG = d3.select(this.elem).append('svg')
            .attr('width', (this.dim * sizeX + 1) + 'px')
            .attr('height', (this.dim * sizeY + 1) + 'px')

        var row = boardSVG.selectAll()
            .data(this.data)
            .enter().append('g')
            .attr('class', 'row')

        var cell = row.selectAll()
            .data(function(d) { return d; })
            .enter().append('rect')
            .attr('class', function(d) {
                return 'cell'
                       + ' ' + (((d.x + d.y) % 2) ? 'white' : 'black')
                       + ' ' + (d.attacked ? (d.invalid ? 'invalid' : 'attacked') : '')
            })
            .attr("x", function(d) { return d.x * sizeX + 0.5; })
            .attr("y", function(d) { return d.y * sizeY + 0.5; })
            .attr("width", function(d) { return sizeX; })
            .attr("height", function(d) { return sizeY; })

        cell.on("click", (d) => {
            this.toggleQueen(d.x, d.y);
            this.drawBoard();
        })

        var solution = boardSVG
            .append('g')
            .attr('class', 'solution')

        var queen = solution.selectAll()
            .data(Array.from(this.queens))
            .enter().append('rect')
            .attr('class', 'queen')
            .attr("x", function(d) { return (d % dim) * sizeX + sizeX * 0.15 + 0.5; })
            .attr("y", function(d) { return Math.floor(d / dim) * sizeY + sizeY * 0.15 + 0.5; })
            .attr("width", function(d) { return sizeX * 0.7; })
            .attr("height", function(d) { return sizeY * 0.7; })
    }
}

var elem = document.getElementById('board');
var board = new Board(dim, elem);

// board.toggleQueen(2, 0);
// board.toggleQueen(4, 1);
// board.toggleQueen(7, 2);
// board.toggleQueen(3, 3);
// board.toggleQueen(0, 4);
// board.toggleQueen(6, 5);
// board.toggleQueen(1, 6);
// board.toggleQueen(5, 7);
board.toggleQueen(0, 0);
board.toggleQueen(2, 1);
board.toggleQueen(2, 5);
board.toggleQueen(1, 7);
board.updateBoardState();
board.drawBoard();
