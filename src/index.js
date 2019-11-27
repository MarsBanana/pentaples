import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const sqarr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "*"];

function Square(props) {
    return (
        <div className="square" onClick={props.onClick}>
            {props.value}
        </div>
    );
}
class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }
    render() {
        return (
            <div className="inner-container">
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                </div>
                <div className="board-row">
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                    {this.renderSquare(10)}
                    {this.renderSquare(11)}
                </div>
                <div className="board-row">
                    {this.renderSquare(12)}
                    {this.renderSquare(13)}
                    {this.renderSquare(14)}
                    {this.renderSquare(15)}
                </div>
            </div>
        );
    }
}
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            movesCount: 0
        };
    }
    handleClick(i) {
        let history = this.state.history.slice(0, this.state.movesCount + 1);
        let current = history[history.length - 1];
        let squares = current.squares.slice();
        if (calculateWinner(squares)) {
            return;
        }
        console.log(i);
        let emptySquare = squares.indexOf("*");
        if (i === emptySquare - 4 || i === emptySquare - 1 || i === emptySquare + 1 || i === emptySquare + 4) {
            let tiem = squares[i];
            let meit = squares.indexOf("*");
            squares[i] = "*";
            squares[meit] = tiem;
            this.setState({
                history: history.concat([
                    {
                        squares: squares
                    }
                ]),
                movesCount: history.length
            });
        }
    }
    jumpTo(step) {
        this.setState({
            movesCount: step,
            moveOrCap: true
        });
    }
    fill(e) {
        this.setState({
            history: this.state.history.concat([{ squares: shuffle(sqarr) }])
        });
    }
    keyDown(e) {
        e.preventDefault();
        let emptySquare = this.state.history[this.state.movesCount].squares.indexOf("*");
        if (e.code === "ArrowUp" && emptySquare > 3) {
            this.handleClick(emptySquare - 4);
        } else if (e.code === "ArrowDown" && emptySquare < 12) {
            this.handleClick(emptySquare + 4);
        } else if (e.code === "ArrowLeft" && emptySquare !== 0 && emptySquare !== 4 && emptySquare !== 8 && emptySquare !== 12) {
            this.handleClick(emptySquare - 1);
        } else if (e.code === "ArrowRight" && emptySquare !== 3 && emptySquare !== 7 && emptySquare !== 11 && emptySquare !== 15) {
            this.handleClick(emptySquare + 1);
        }
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.movesCount];
        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            return <option key={move}>{desc}</option>;
        });

        let move = this.state.movesCount;
        function announcer(move, history) {
            if (calculateWinner(history[move].squares)) {
                return "You won in " + move + " steps!";
            } else {
                return move;
            }
        }

        document.onkeydown = event => this.keyDown(event);
        if (history.length > 0) {
            return (
                <div className="container">
                    <h1>Pentaples</h1>
                    <Board squares={current.squares} onClick={i => this.handleClick(i)} />
                    <div className="game-info">
                        <div className="moves-counter">{announcer(move, history)}</div>
                        <button
                            onClick={() =>
                                this.setState({
                                    history: [{ squares: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "*"]) }],
                                    movesCount: 0
                                })
                            }
                        >
                            Restart?
                        </button>
                        <button
                            onClick={() =>
                                this.setState({
                                    history: [{ squares: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "*"] }],
                                    movesCount: 0
                                })
                            }
                        >
                            Press to win
                        </button>
                        <select onChange={move => this.jumpTo(move)}>{moves}</select>
                    </div>
                </div>
            );
        } else {
            document.onkeydown = event => this.fill(event);
            return (
                <div id="pregame">
                    <h3>Use your keyboard to play</h3>
                    <div id="keys"></div>
                </div>
            );
        }
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));

//##############################################################

function putToCache(elem, cache) {
    if (cache.indexOf(elem) !== -1) {
        return;
    }
    var i = Math.floor(Math.random() * (cache.length + 1));
    cache.splice(i, 0, elem);
}
function madness() {
    var cache = [];
    return function(a, b) {
        putToCache(a, cache);
        putToCache(b, cache);
        return cache.indexOf(b) - cache.indexOf(a);
    };
}
function shuffle(arr) {
    var compare = madness();
    return arr.sort(compare);
}

function calculateWinner(squares) {
    if (squares.toString() === "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,*") {
        return true;
    } else {
        return false;
    }
}
