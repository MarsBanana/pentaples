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
            history: [{ squares: shuffle(sqarr) }],
            movesCount: 0,
            moveOrCap: true,
            currentSquare: null,
            currentSquareValue: null
        };
    }
    /*
    capture(i, squares) {
        this.setState({
            currentSquare: i,
            currentSquareValue: squares[i]
        });
    }

    move(i, history, current, squares) {
        let tiem = current.squares[i];
        squares[i] = this.state.currentSquareValue;
        squares[this.state.currentSquare] = tiem;
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            movesCount: history.length,
            moveOrCap: !this.state.moveOrCap
        });
    }
    */
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
        /*
        this.state.moveOrCap ? this.capture(i, squares) : this.move(i, history, current, squares);
        this.setState({
            moveOrCap: !this.state.moveOrCap
        });
        */
    }
    jumpTo(step) {
        this.setState({
            movesCount: step,
            moveOrCap: true
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.movesCount];
        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}> {desc} </button>{" "}
                </li>
            );
        });
        let move = this.state.movesCount;
        function announcer(move, history) {
            if (calculateWinner(history[move].squares)) {
                return "You won in " + move + " steps!";
            } else {
                return move;
            }
        }
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
                                movesCount: 0,
                                moveOrCap: true
                            })
                        }
                    >
                        Restart?
                    </button>
                    <button
                        onClick={() =>
                            this.setState({
                                history: [{ squares: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, "*"] }],
                                movesCount: 0,
                                moveOrCap: true
                            })
                        }
                    >
                        Press to win
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));

//##############################################################

//вспомогательная функция
function putToCache(elem, cache) {
    if (cache.indexOf(elem) !== -1) {
        return;
    }
    var i = Math.floor(Math.random() * (cache.length + 1));
    cache.splice(i, 0, elem);
}
//функция, возвращающая свеженький, девственный компаратор
function madness() {
    var cache = [];
    return function(a, b) {
        putToCache(a, cache);
        putToCache(b, cache);
        return cache.indexOf(b) - cache.indexOf(a);
    };
}
//собственно функция перемешивания
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
