function BacktrackingFinder(board, results)
{
    this.board = board;
    this.results = results;
    this.numSteps = 0
    this.options = [];
    this.currentSolution = [];
    this.solutions = [];

    this.reset = function()
    {
        this.board.reset();

        while (this.results.firstChild)
            this.results.removeChild(this.results.firstChild);

        this.numSteps = 0;
        this.options = [[7, 6, 5, 4, 3, 2, 1, 0]];
        this.currentSolution = [];
        this.solutions = [];
        this.board.drawBoard();
    }

    this.step = function()
    {
        if (this.options.length <= 0)
            return;

        this.numSteps++;

        var currentLevel = this.currentSolution.length;
        var currentOptions = this.options[this.options.length-1];

        if (currentLevel < this.board.dim || true)
        {
            if (currentOptions.length <= 0)
            {
                this.board.toggleQueen(this.currentSolution.pop(), currentLevel-1);
                this.options.pop();

                this.board.drawBoard();
                return;
            }

            var nextMove = currentOptions.pop();

            this.board.toggleQueen(nextMove, currentLevel);
            this.board.updateBoardState();
            this.currentSolution.push(nextMove);

            var newOptions = [];

            if (currentLevel == this.board.dim-1)
            {
                this.solutions.push(this.currentSolution.slice());

                var elem = document.createElement("li");
                elem.textContent = "[" + this.currentSolution.join(", ") + "]";
                elem.classList.add("solution");
                elem.addEventListener("click", setStateFactory(this.board, this.currentSolution.slice()));
                this.results.appendChild(elem);

                // console.log(this.solutions);
                // console.log(this.numSteps);
            }
            else
            {
                for (var i = this.board.dim-1; i >= 0; --i)
                {
                    if (!this.board.data[i][currentLevel+1].attacked)
                        newOptions.push(i);
                }
            }

            this.options.push(newOptions);

            this.board.drawBoard();
        }
    }
}

var elem = document.getElementById('results-list');
var finder = new BacktrackingFinder(board, elem);

function reset()
{
    finder.reset();
}

function step()
{
    finder.step();
}

var interval;
function start()
{
    interval = setInterval(step, 1);
}

function stop()
{
    clearInterval(interval);
}

function setStateFactory(board, state)
{
    return function () {
        board.setState(state);
    };
}
