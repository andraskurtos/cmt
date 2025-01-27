import { useState } from "preact/hooks";
import "./grid.less";

export function Cell({ className, value, onClick }: { className: string, value: string, onClick: () => void }) {
    return (
        <div className={"cell " + className} onClick={onClick}>
            <p>{value}</p>
        </div>
    );
}



export function Grid() {
    const [grid, setGrid] = useState(Array.from({ length: 5 }, () => Array(5).fill("")));
    const [lineGrid, setLineGrid] = useState(Array.from({ length: 5 }, () => Array(5).fill(false)));
    const [nextValue, setNextValue] = useState("c");
    const [lines, setLines] = useState(0);
    const values = ["c", "m", "t"];
    console.log(lines);
    const countLines = () => {
        let newLines = 0;
        let newLineGrid = lineGrid;
        // horizontal and vertical lines
        for (let i = 0; i < 5; i++) {
            let counts = [0, 0];
            let indexes = [[], []];
            let current = ["x", "x"];

            for (let j = 0; j < 5; j++) {
                // horizontal lines
                if (grid[i][j] !== "") {
                    if (grid[i][j].toLowerCase() === current[0]) {
                        counts[0] += 1;
                        indexes[0].push(j);
                    } else {
                        counts[0] = 1;
                        indexes[0] = [j];
                        current[0] = grid[i][j].toLowerCase();
                    }
                    
                } else {
                    counts[0] = 0;
                    indexes[0] = [];
                    current[0] = "x";
                }
                if (counts[0] >= 3) {
                    if (counts[0] === 3) newLines++;
                    indexes[0].forEach((index) => {
                        newLineGrid[i][index] = true;
                 });
                } else {
                    counts[1] = 0;
                    indexes[1] = [];
                    current[1] = "x";
                }
                // vertical lines
                if (grid[j][i] !== "") {
                    if (grid[j][i].toLowerCase() === current[1]) {
                        counts[1]++;
                        indexes[1].push(j);
                    } else {
                        counts[1] = 1;
                        indexes[1] = [j];
                        current[1] = grid[j][i].toLowerCase();
                    }                    
                }
                if (counts[1] >= 3) {
                    if (counts[1]===3) newLines++;
                    indexes[1].forEach((index) => {
                        newLineGrid[index][i] = true;
                    });
                }
            }

        }

        // diagonal lines 
        /*
        x x x x x
        x x x x x
        x x x x x
        x x x x x
        x x x x x
        */
        //topleft - bottomright
        let diagonals = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5 - i; j++) {

                if (
                    grid[i][j] !== "" &&
                    grid[i][j] === grid[i + 1][j + 1] &&
                    grid[i][j] === grid[i + 2][j + 2]
                ) {
                    let newline = true;
                    for (let diagonal of diagonals) {
                        if (diagonal.some(point => point[0] === i && point[1] === j) && diagonal.some(point => point[0] === i + 1 && point[1] === j + 1)) {
                            diagonal.push([i + 2, j + 2]);
                            newline = false;
                        }
                    }
                    if (newline) {
                        diagonals.push([[i, j], [i + 1, j + 1], [i + 2, j + 2]]);
                        newLines++;
                    }
                }
            }
        }

        //bottomleft - topright
        for (let i = 2; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                if (
                    grid[i][j] !== "" &&
                    grid[i][j] === grid[i - 1][j + 1] &&
                    grid[i][j] === grid[i - 2][j + 2]
                ) {

                    let newline = true;
                    for (let diagonal of diagonals) {
                        if (diagonal.some(point => point[0] === i && point[1] === j) && diagonal.some(point => point[0] === i - 1 && point[1] === j + 1)) {
                            diagonal.push([i - 2, j + 2]);
                            newline = false;
                        }
                    }
                    if (newline) {
                        diagonals.push([[i, j], [i - 1, j + 1], [i - 2, j + 2]]);
                        newLines++;
                    }
                }
            }
        }
        for (let diagonal of diagonals) {
            diagonal.forEach((index) => {
                newLineGrid[index[0]][index[1]] = true;
            });
        }
        setLineGrid(newLineGrid);
        setLines(newLines);
    }
    const handleClick = (row: number, col: number) => {
        const newGrid = [...grid];
        if (newGrid[row][col] !== "") {
            return;
        }
        newGrid[row][col] = nextValue;
        setGrid(newGrid);
        setNextValue(values[(values.indexOf(nextValue) + 1) % values.length]);
        countLines();
    };

    const reset = () => {
        setGrid(Array.from({ length: 5 }, () => Array(5).fill("")));
        setLineGrid(Array.from({ length: 5 }, () => Array(5).fill(false)));
        setNextValue("c");
        setLines(0);
    }

    function isFull() {
        for (let row of grid) {
            for (let cell of row) {
                if (cell === "") {
                    return false;
                }
            }
        }
        return true;
    }

    return (
        <div className="grid">
            {grid.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <Cell className={lineGrid[rowIndex][cellIndex] ? cell + "line" : ""} key={cellIndex} value={cell.toUpperCase()} onClick={() => handleClick(rowIndex, cellIndex)} />
                    ))}
                </div>
            ))}
            <div className="info">
                <p className={isFull() ? "" : "hidden"}>{lines >= 0 ? `Congratulations, you have ${lines} lines!` : "You have no lines, try again!"}</p>
                <button onClick={reset}>Reset</button>
            </div>
        </div>

    );
}