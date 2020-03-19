////////////////////////////////////
// Constants and global variables //
////////////////////////////////////



const possibilites = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", ];

const errorMessages = {
    noSudoku: "Please Upload Sudoku",
    noGrid: "Please Generate Grid",
};

const successMessages = {
    rows: 'Rows Processed',
    cols: 'Cols Processed',
    squs: 'Squs Processed',
    cells: 'Cells Populated',
    grid: 'Grid Generated',
    generated: 'Blank Sudoku Generated',
    uploaded: 'Sudoku Uploaded',
    solutionFound: 'Solution Found',
};

const statusMessages = {
    findingSolution: 'Looking for solution',
};

var globalSudoku;










////////////////////////////////
// Sudoku solution processing //
////////////////////////////////

/**
 * @param {object} sudoku
 * @returns {number} the total number of possibilities accross unknown cells
 */
function countPossibilities(sudoku) {
    if (sudoku) {
        var squ;
        var propertyName;
        var possibilites = 0;    
        // Loop through the rows
        for (var row = 1; row <= 9; row++) {
            // Loop through the columns
            for (var col = 1; col <= 9; col++) {
                squ = detSqu(row, col);
                propertyName = `squ${squ}row${row}col${col}`;
                if (sudoku[propertyName].length > 1) {
                    possibilites += sudoku[propertyName].length;
                }
            }   
        }
        return possibilites;
    } else {
        log(errorMessages.noSudoku);
    }
}

/**
 * @param {object} sudoku
 * @returns {number} the number of known cells
 */
function countKnowns(sudoku) {
    if (sudoku) {
        var squ;
        var propertyName;
        var known = 0;  
        // Loop through the rows
        for (var row = 1; row <= 9; row++) {
            // Loop through the columns
            for (var col = 1; col <= 9; col++) {
                squ = detSqu(row, col);
                propertyName = `squ${squ}row${row}col${col}`;
                if (sudoku[propertyName].length === 1) {
                    known++;
                }
            }   
        }
        return known;
    } else {
        log(errorMessages.noSudoku);
    }
}

/**
 * @param {object} sudoku 
 * @param {int} number
 * @returns {number} the number of known cells containing number 
 */
function countKnownNumber(sudoku, number) {

    if (sudoku) {
        var squ;
        var propertyName;
        var known = 0;  
        // Loop through the rows
        for (var row = 1; row <= 9; row++) {
            // Loop through the columns
            for (var col = 1; col <= 9; col++) {
                squ = detSqu(row, col);
                propertyName = `squ${squ}row${row}col${col}`;
                if (sudoku[propertyName].length === 1) {
                    if (sudoku[propertyName][0] === number) {
                        known++;
                    }
                }
            }   
        }
        return known;
    } else {
        log(errorMessages.noSudoku);
    }

};

/**
 * @param {object} sudoku
 * Removes possibilities from cells based on known values in rows
 */
function processRows(sudoku) {
    if (sudoku) {
        var squ;
        var propertyName;
        // Loop through the rows
        for (var row = 1; row <= 9; row++) {
            var known = [];
            // Determine which numbers are known in the row
            // Loop through the columns
            for (var col = 1; col <= 9; col++) {            
                squ = detSqu(row, col);
                propertyName = `squ${squ}row${row}col${col}`;
                if (sudoku[propertyName].length === 1) {
                    known.push(sudoku[propertyName][0]);
                }
            }
            // Remove the knowns from the row possibilities
            for (var col = 1; col <= 9; col++) {            
                squ = detSqu(row, col);
                propertyName = `squ${squ}row${row}col${col}`;
                // clone array
                const arrayToProcess = [...sudoku[propertyName]];
                const processedArray = removePossibilities(arrayToProcess, known);
                // clone result 
                sudoku[propertyName] = [...processedArray];
            }
        }
        log(successMessages.rows);
    } else {
        log(errorMessages.noSudoku);
    }

}

/**
 * @param {object} sudoku
 * Removes possibilities from cells based on known values in cols
 */
function processCols(sudoku) {

    if (sudoku) {
        var squ;
        var propertyName;
        // Loop through the columns
        for (var col = 1; col <= 9; col++) {
            var known = [];
            // Determine which numbers are known in the col
            // Loop through the rows
            for (var row = 1; row <= 9; row++) {            
                squ = detSqu(row, col);
                propertyName = `squ${squ}row${row}col${col}`;
                if (sudoku[propertyName].length === 1) {
                    known.push(sudoku[propertyName][0]);
                }
            }
            // Remove the knowns from the col possibilities
            for (var row = 1; row <= 9; row++) {            
                squ = detSqu(row, col);
                propertyName = `squ${squ}row${row}col${col}`;
                // clone array
                const arrayToProcess = [...sudoku[propertyName]];
                const processedArray = removePossibilities(arrayToProcess, known);
                // clone result 
                sudoku[propertyName] = [...processedArray];
            }
        }
        log(successMessages.cols);
    } else {
        log(errorMessages.noSudoku);
    }

}

/**
 * @param {object} sudoku
 * Removes possibilities from cells based on known values in squs
 */
function processSqus(sudoku) {

    if (sudoku) {
        var squ;
        var propertyName;
        // Loop through the squares
        for (var squ = 1; squ <= 9; squ++) {
            var known = [];
            // Determine which numbers are known in the squ
            // Loop through the rows
            for (var row = 1; row <= 3; row++) {
                // Loop through the cols
                for (var col = 1; col <= 3; col++) {       
                    propertyName = `squ${squ}row${row + detRowOffSet(squ)}col${col + detColOffSet(squ)}`;
                    if (sudoku[propertyName].length === 1) {
                        known.push(sudoku[propertyName][0]);
                    }
                }
            }
            // Remove the knowns from the squ possibilities
            for (var row = 1; row <= 3; row++) {
                // Loop through the cols
                for (var col = 1; col <= 3; col++) { 
                    propertyName = `squ${squ}row${row + detRowOffSet(squ)}col${col + detColOffSet(squ)}`;
                // clone array
                const arrayToProcess = [...sudoku[propertyName]];
                const processedArray = removePossibilities(arrayToProcess, known);
                // clone result 
                sudoku[propertyName] = [...processedArray];
                }
            }
        }
        log(successMessages.squs);
    } else {
        log(errorMessages.noSudoku);
    }

}

/**
 * Removes any array of numners (removeFrom) from another array (toRemove)
 * @param {string[]} removeFrom
 * @param {string[]} toRemove
 * @returns {string[]} string with the numbers in toRemove removed
 */
function removePossibilities(removeFrom, toRemove) {

    for (var i = 0; i < toRemove.length; i++) {
        if ((removeFrom.includes(toRemove[i]))&&(removeFrom.length > 1)) {
            const index = removeFrom.indexOf(toRemove[i]);
            removeFrom.splice(index, 1);
        }
    }

    return removeFrom;

}

/**
 * @param {number} squ
 * @returns {number} The row offset for a given square
 */
function detRowOffSet(squ) {

    var offSet;
    if ((squ == 1)||(squ == 2)||(squ == 3)) {
        offSet = 0;
    }
    if ((squ == 4)||(squ == 5)||(squ == 6)) {
        offSet = 3;
    } 
    if ((squ == 7)||(squ == 8)||(squ == 9)) {
        offSet = 6;
    }    
    return offSet;

}

/**
 * @param {number} squ
 * @returns {number} The col offset for a given square
 */
function detColOffSet(squ) {

    var offSet;
    if ((squ == 1)||(squ == 4)||(squ == 7)) {
        offSet = 0;
    }
    if ((squ == 2)||(squ == 5)||(squ == 8)) {
        offSet = 3;
    } 
    if ((squ == 3)||(squ == 6)||(squ == 9)) {
        offSet = 6;
    }    
    return offSet;

}

/**
 * @param {number} row
 * @param {number} col
 * @returns {number} The squ for a given row, col
 */
function detSqu(row, col) {

    var squ;
    if ((row == 1)||(row == 2)||(row == 3)) {
        if ((col == 1)||(col == 2)||(col == 3)) {
            squ = 1;
        }
        if ((col == 4)||(col == 5)||(col == 6)) {
            squ = 2;
        }
        if ((col == 7)||(col == 8)||(col == 9)) {
            squ = 3;
        }
    }
    if ((row == 4)||(row == 5)||(row == 6)) {
        if ((col == 1)||(col == 2)||(col == 3)) {
            squ = 4;
        }
        if ((col == 4)||(col == 5)||(col == 6)) {
            squ = 5;
        }
        if ((col == 7)||(col == 8)||(col == 9)) {
            squ = 6;
        }
    }
    if ((row == 7)||(row == 8)||(row == 9)) {
        if ((col == 1)||(col == 2)||(col == 3)) {
            squ = 7;
        }
        if ((col == 4)||(col == 5)||(col == 6)) {
            squ = 8;
        }
        if ((col == 7)||(col == 8)||(col == 9)) {
            squ = 9;
        }
    }
    return squ;

}

/**
 * @param {object} sudoku 
 * @param {number} rowOfGuess 
 * @param {number} colOfGuess 
 * @param {number} valueOfGuess 
 * @returns {boolean} whether the guess is possible for the given cell
 */
function isKValidGuess(sudoku, rowOfGuess, colOfGuess, valueOfGuess) {

    var squOfGuess = detSqu(rowOfGuess, colOfGuess);

    // Is k a known in the cell's row, col, or squ?
    // Check the row

    // Loop through the columns
    for (var col = 1; col <= 9; col++) {
        var squ = detSqu(rowOfGuess, col);
        var propertyName = `squ${squ}row${rowOfGuess}col${col}`;
        // Is the cell known?
        if (sudoku[propertyName].length === 1) {
            // Does it contain the guess?
            if (sudoku[propertyName][0] === [valueOfGuess.toString()][0]) {
                // Return false that the guess is invalid
                // console.log("Guess is already in row");
                return false;
            }
        }
    }
    
    // Check the column

    // Loop through the rows
    for (var row = 1; row <= 9; row++) {
        var squ = detSqu(row, colOfGuess);
        var propertyName = `squ${squ}row${row}col${colOfGuess}`;
        // Is the cell known?
        if (sudoku[propertyName].length === 1) {
            // Does it contain the guess?
            if (sudoku[propertyName][0] === [valueOfGuess.toString()][0]) {
                // Return false that the guess is invalid
                return false;
            }
        }
    }
    
    // Check the square

    // Loop through the rows
    for (var row = 1; row <= 3; row++) {
        // Loop through the cols
        for (var col = 1; col <= 3; col++) {     
            var propertyName = `squ${squOfGuess}row${row + detRowOffSet(squOfGuess)}col${col + detColOffSet(squOfGuess)}`;
            // Is the cell known?
            if (sudoku[propertyName].length === 1) {
                // Does it contain the guess?
                if (sudoku[propertyName][0] === [valueOfGuess.toString()][0]) {
                    // Return false that the guess is invalid
                    return false;
                }
            }
        }
    }

    return true;

}

/**
 * @param {object} sudoku 
 * Solve the sudoku (backtracking) 
 * https://stackoverflow.com/questions/42736648/sudoku-solver-in-js
 */
function solve(sudoku) {

    // Loops though the square of the sudoku
    // Loop through the rows
    for (var row = 1; row <= 9; row++) {
        // Loop through the cols
        for (var col = 1; col <= 9; col++) {
            // Get the square
            var squ = detSqu(row, col);
            var propertyName = `squ${squ}row${row}col${col}`;
            // Is the square unknown?
            if (sudoku[propertyName].length !== 1) {
                // Run through possible guesses
                for (var guess = 1; guess <= 9; guess++) {
                    // Is it a valid guess
                    if (isKValidGuess(sudoku, row, col, guess)) {
                        // If so enter the guess in
                        sudoku[propertyName] = [`${guess}`];
                        // If the function called recursively returns true
                        if (solve(sudoku)) {
                            // We are done
                            return true;
                        } else {
                            // The guess was wrong
                            sudoku[propertyName] = possibilites;
                        }
                    } 
                    // If not just move onto the next guess
                }
                // ?
                return false;
            }
        }
    }
    // ?
    return true;

}

/**
 * @param {object} sudoku 
 * @param {number} row 
 * @param {number} number 
 * @returns {boolean} 
 */
function doesRowContainKnown(sudoku, row, number) {

    // row = document.getElementById('rowGuess').value;
    // number = document.getElementById('valueGuess').value;

    for (var col = 1; col <= 9; col++) {
        var squ = detSqu(row, col);
        var propertyName = `squ${squ}row${row}col${col}`;
        if (sudoku[propertyName].length === 1) {
            if (sudoku[propertyName][0] == `${number}`) {
                return true;
            }
        }
    }
    return false;

}

/**
 * @param {object} sudoku 
 * @param {number} row 
 * @param {number} number 
 * @returns {boolean} 
 */
function doesColContainKnown(sudoku, col, number) {

    // col = document.getElementById('colGuess').value;
    // number = document.getElementById('valueGuess').value;

    for (var row = 1; row <= 9; row++) {
        var squ = detSqu(row, col);
        var propertyName = `squ${squ}row${row}col${col}`;
        if (sudoku[propertyName].length === 1) {
            if (sudoku[propertyName][0] == `${number}`) {
                return true;
            }
        }
    }
    return false;

}

/**
 * @param {object} sudoku 
 * @param {number} squ 
 * @param {number} number 
 * @returns {boolean} 
 */
function doesSquContainKnown(sudoku, squ, number) {

    for (var row = 1; row <= 3; row++) {
        for (var col = 1; col <= 3; col++) {
            var propertyName = `squ${squ}row${row + detRowOffSet(squ)}col${col + detColOffSet(squ)}`;
            if (sudoku[propertyName].length === 1) {
                if (sudoku[propertyName][0] == `${number}`) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkIfAnyNumberOnlyInOnePossibilityForRow(sudoku) {

    // Loop through rows
    for (var row = 1; row <= 9; row++) {
        // Loop through numbers
        for (var number = 1; number <= 9; number++) {
            var rowFrequency = 0;
            // Loop through cols
            for (var col = 1; col <= 9; col++) {
                var squ = detSqu(row, col);
                var propertyName = `squ${squ}row${row}col${col}`;
                // Is it a cell that contains possibilites
                if (sudoku[propertyName].length > 1) {
                    // Is the number one of them?
                    if (sudoku[propertyName].includes(`${number}`)) {
                        rowFrequency++;                    
                    }
                } 
            }
            // Is the number just in one set of possibilities
            if (rowFrequency === 1) {
                // Is it a known already?
                // Need to check this as this method does not remove possibilities and could have already been run
                if (!doesRowContainKnown(sudoku, row, number)) {
                    // Which cell was it?
                    for (var col = 1; col <= 9; col++) {
                        var squ = detSqu(row, col);
                        var propertyName = `squ${squ}row${row}col${col}`;
                        if (sudoku[propertyName].includes(`${number}`)) {
                            sudoku[propertyName] = [`${number}`];
                        }
                    }
                }
            }
        }
    }

}

function checkIfAnyNumberOnlyInOnePossibilityForCol(sudoku) {

    // Loop through cols
    for (var col = 1; col <= 9; col++) {
        // Loop through numbers
        for (var number = 1; number <= 9; number++) {
            var colFrequency = 0;
            // Loop through rows
            for (var row = 1; row <= 9; row++) {
                var squ = detSqu(row, col);
                var propertyName = `squ${squ}row${row}col${col}`;
                // Is it a cell that contains possibilites
                if (sudoku[propertyName].length > 1) {
                    // Is the number one of them?
                    if (sudoku[propertyName].includes(`${number}`)) {
                        colFrequency++;                    
                    }
                } 
            }
            // Is the number just in one set of possibilities
            if (colFrequency === 1) {
                // Is it a known already?
                // Need to check this as this method does not remove possibilities and could have already been run
                if (!doesColContainKnown(sudoku, col, number)) {
                    // Which cell was it?
                    for (var row = 1; row <= 9; row++) {
                        var squ = detSqu(row, col);
                        var propertyName = `squ${squ}row${row}col${col}`;
                        if (sudoku[propertyName].includes(`${number}`)) {
                            sudoku[propertyName] = [`${number}`];
                        }
                    }
                }
            }
        }
    }

}

function checkIfAnyNumberOnlyInOnePossibilityForSqu(sudoku) {

    // Loop through squs
    for (var squ = 1; squ <= 9; squ++) {
        // Loop through numbers
        for (var number = 1; number <= 9; number++) {
            var squFrequency = 0;
            // Loop through rows
            for (var row = 1; row <= 3; row++) {
                // Loop through cols
                for (var col = 1; col <= 3; col++) {
                    var propertyName = `squ${squ}row${row + detRowOffSet(squ)}col${col + detColOffSet(squ)}`;
                    // Is it a cell that contains possibilites
                    if (sudoku[propertyName].length > 1) {
                        // Is the number one of them?
                        if (sudoku[propertyName].includes(`${number}`)) {
                            squFrequency++;                    
                        }
                    }
                } 
            }
            // Is the number just in one set of possibilities
            if (squFrequency === 1) {
                // Is it a known already?
                // Need to check this as this method does not remove possibilities and could have already been run
                if (!doesSquContainKnown(sudoku, squ, number)) {
                    // Which cell was it?
                    for (var row = 1; row <= 3; row++) {
                        for (var col = 1; col <= 3; col++) {
                            var propertyName = `squ${squ}row${row + detRowOffSet(squ)}col${col + detColOffSet(squ)}`;
                            if (sudoku[propertyName].includes(`${number}`)) {
                                sudoku[propertyName] = [`${number}`];
                            }
                        }
                    }
                }
            }
        }
    }

}








//////////////////////
// Sudoku Rendering //
//////////////////////



/**
 * @param {object} sudoku
 * Populates the grid based on the sudoku passed to it
 */
function populateCells(sudoku) {

    try {
        if (sudoku) {
            // Populate the sudoku
            for (var elem in sudoku) {
                if ((elem !== 'initialKnown') && (elem !== 'initialPossibilities')) {
                    var table = generateCellTable(sudoku[elem]);
                    document.getElementById(elem).innerHTML = table;
                    // Can I add an ID here?
                }
            }
            log(successMessages.cells);
            // Populate the stats - Overal
            document.getElementById('InitialKnown').innerHTML = sudoku.initialKnown;
            document.getElementById('InitialPossibilities').innerHTML = sudoku.initialPossibilities;
            document.getElementById('CurrentKnown').innerHTML = countKnowns(sudoku);
            document.getElementById('CurrentPossibilities').innerHTML = countPossibilities(sudoku);
            // Populate the stats - Known Numbers
            document.getElementById('Known1s').innerHTML = countKnownNumber(sudoku, "1");
            document.getElementById('Known2s').innerHTML = countKnownNumber(sudoku, "2");
            document.getElementById('Known3s').innerHTML = countKnownNumber(sudoku, "3");
            document.getElementById('Known4s').innerHTML = countKnownNumber(sudoku, "4");
            document.getElementById('Known5s').innerHTML = countKnownNumber(sudoku, "5");
            document.getElementById('Known6s').innerHTML = countKnownNumber(sudoku, "6");
            document.getElementById('Known7s').innerHTML = countKnownNumber(sudoku, "7");
            document.getElementById('Known8s').innerHTML = countKnownNumber(sudoku, "8");
            document.getElementById('Known9s').innerHTML = countKnownNumber(sudoku, "9");
        } else {
            log(errorMessages.noSudoku);
        }
    } catch (err) {
        log(err);
        log(errorMessages.noGrid);
    }

}

/**
 * Generates a sudoku grid of squares
 * Rows and Columns are labelled from 1 to 9 for easier sudoku processing
 * Called on page load
 */
function generateGrid() {

    var table;
    table = "<table class=\"Sudoku\">\n";
    // Create the table of 9 sudoku squares
    for (var squ = 1; squ <= 9; squ++) {
        // Start new row if squ 1, 4 or 5
        if ((squ == 1)||(squ == 4)||(squ == 7)) {
            table += "<tr>\n";
        }
        // Start new table entry for square
        table += "<td>\n";
        // Start new table for grid of square
        table += "<table class=\"Square\">\n";
        // Create the rows of the square
        for (var row = 1; row <= 3; row++) {
            table += "<tr>\n";
            // Create the columns of the square
            for (var col = 1; col <=3; col++) {
                table += `<td id=\"squ${squ}row${row + detRowOffSet(squ)}col${col + detColOffSet(squ)}\" class=\"Cell\">`
                table += " ";
                table += "</td>\n"
            }
            table += "</tr>\n";
        }
        table += "</table>\n";
        table += "</td>\n";
        // End row if squ 3, 6 or 9
        if ((squ == 3)||(squ == 6)||(squ == 9)) {
            table += "</tr>\n";
        }
    }
    table += "</table>\n";
    document.getElementById("SudokuContainer").innerHTML = table;
    log(successMessages.grid);

}

/**
 * @param {string []} CellPossibilities
 * @returns {string} An HTML table of unknown elements for a cell
 */
function generateCellTable(CellPossibilities) {

    var table;
    if (CellPossibilities.length > 1) {
        table = "<table>";
        var value = 0;
        for (var row = 1; row <= 3; row++) {
            table += "<tr>";
            for (var col = 1; col <= 3; col++) {
                table += "<td class=\"CellPossibility\">"
                value++;
                if (CellPossibilities.includes(value.toString())) {
                    table += value.toString();
                } else {
                    table += " ";
                }
                table == "</td>"
            }
            table += "</tr>";
        }
        table += "</table>";
        document.getElementById("Log").value = table.toString();
    } else {
        table = CellPossibilities[0];
    }
    return table;

}

/**
 * @param {object} sudoku
 * Output the solved sudoku
 */
function solveButton(sudoku) {
    log(statusMessages.findingSolution);
    solve(sudoku);
    log(successMessages.solutionFound);
    populateCells(sudoku);
}

/**
 * @param {object} sudoku 
 * @param {number} row
 * Highlights the row 
 */
function highlightRow(sudoku, row) {
    
    const highlightColor = '#ccaeae';

    // Loop col
    // const rowToHighlight = document.getElementById('rowGuess').value;
    const rowToHighlight = row;
    for (var col = 1; col <= 9; col++) {
        var squ = detSqu(rowToHighlight, col);
        var propertyName = `squ${squ}row${rowToHighlight}col${col}`;

        var element = document.getElementById(propertyName);
        element.style.backgroundColor = highlightColor;
        
        // Does the cell have possibilities
        if (sudoku[propertyName].length > 1) {
            const elements = element.getElementsByClassName('CellPossibility');
            for(var cell = 1; cell <= 9; cell++) {
                elements[cell - 1].style.backgroundColor = highlightColor;
            }
        }
    }
}

/**
 * @param {object} sudoku 
 * @param {number} col
 * Highlights the column 
 */
function highlightCol(sudoku, col) {
    
    const highlightColor = '#ccaeae';

    // Loop row
    const colToHighlight = col;
    for (var row = 1; row <= 9; row++) {
        var squ = detSqu(row, colToHighlight);
        var propertyName = `squ${squ}row${row}col${colToHighlight}`;

        var element = document.getElementById(propertyName);
        element.style.backgroundColor = highlightColor;
        
        // Does the cell have possibilities
        if (sudoku[propertyName].length > 1) {
            const elements = element.getElementsByClassName('CellPossibility');
            for(var cell = 1; cell <= 9; cell++) {
                elements[cell - 1].style.backgroundColor = highlightColor;
            }
        }
    }
}

/**
 * @param {object} sudoku 
 * Clears any row/col highlighting
 */
function clearHighlighting(sudoku) {

    // Loop through rows
    for (var row = 1; row <= 9; row++) {
        // Loop through columns
        for (var col = 1; col <= 9; col++) {
            var squ = detSqu(row, col);
            var propertyName = `squ${squ}row${row}col${col}`;
            var element = document.getElementById(propertyName);
            element.style.backgroundColor = '';

            // Does the cell have possibilities
            if (sudoku[propertyName].length > 1) {
                const elements = element.getElementsByClassName('CellPossibility');

                for(var cell = 1; cell <= 9; cell++) {
                    elements[cell - 1].style.backgroundColor = '';
                }
            }
        }
    }

}

/**
 * @param {object} sudoku 
 * @param {number} number 
 * Highlights any rows containing the number
 */
function highlightRowsWith(sudoku, number) {

    number = document.getElementById('valueGuess').value;

    for (var row = 1; row <= 9; row++) {
        if (doesRowContainKnown(sudoku, row, number)) {
            highlightRow(sudoku, row);
        }
    }

}

/**
 * @param {object} sudoku 
 * @param {number} number 
 * Highlights any cols containing the number
 */
function highlightColsWith(sudoku, number) {

    number = document.getElementById('valueGuess').value;

    for (var col = 1; col <= 9; col++) {
        if (doesColContainKnown(sudoku, col, number)) {
            highlightCol(sudoku, col);
        }
    }

}











/////////////
// Buttons //
/////////////

function rowsButton(sudoku) {

    const preKnown = countKnowns(sudoku);
    const prePossibilites = countPossibilities(sudoku);
    processRows(sudoku);
    populateCells(sudoku);
    const postKnown = countKnowns(sudoku);
    const postPossibilites = countPossibilities(sudoku);
    log(`${postKnown - preKnown} cells found`);
    log(`${prePossibilites - postPossibilites} possibilities removed`);
}

function colsButton(sudoku) {

    const preKnown = countKnowns(sudoku);
    const prePossibilites = countPossibilities(sudoku);
    processCols(sudoku);
    populateCells(sudoku);
    const postKnown = countKnowns(sudoku);
    const postPossibilites = countPossibilities(sudoku);
    log(`${postKnown - preKnown} cells found`);
    log(`${prePossibilites - postPossibilites} possibilities removed`);

}

function squsButton(sudoku) {

    const preKnown = countKnowns(sudoku);
    const prePossibilites = countPossibilities(sudoku);
    processSqus(sudoku);
    populateCells(sudoku);
    const postKnown = countKnowns(sudoku);
    const postPossibilites = countPossibilities(sudoku);
    log(`${postKnown - preKnown} cells found`);
    log(`${prePossibilites - postPossibilites} possibilities removed`);

}

function rowsButton2(sudoku) {

    const preKnown = countKnowns(sudoku);
    const prePossibilites = countPossibilities(sudoku);
    checkIfAnyNumberOnlyInOnePossibilityForRow(sudoku);
    populateCells(sudoku);
    const postKnown = countKnowns(sudoku);
    const postPossibilites = countPossibilities(sudoku);
    log(`${postKnown - preKnown} cells found`);
    log(`${prePossibilites - postPossibilites} possibilities removed`);

}

function colsButton2(sudoku) {

    const preKnown = countKnowns(sudoku);
    const prePossibilites = countPossibilities(sudoku);
    checkIfAnyNumberOnlyInOnePossibilityForCol(sudoku);
    populateCells(sudoku);
    const postKnown = countKnowns(sudoku);
    const postPossibilites = countPossibilities(sudoku);
    log(`${postKnown - preKnown} cells found`);
    log(`${prePossibilites - postPossibilites} possibilities removed`);

}

function squsButton2(sudoku) {

    const preKnown = countKnowns(sudoku);
    const prePossibilites = countPossibilities(sudoku);
    checkIfAnyNumberOnlyInOnePossibilityForSqu(sudoku);
    populateCells(sudoku);
    const postKnown = countKnowns(sudoku);
    const postPossibilites = countPossibilities(sudoku);
    log(`${postKnown - preKnown} cells found`);
    log(`${prePossibilites - postPossibilites} possibilities removed`);

}











/////////
// Log //
/////////



/**
 * @param {string} text
 * Outputs the input text to the log
 */
function log(text) {

    var date = new Date(); 
    var hour = date.getHours().toString();
    if (hour.length === 1) {hour = "0" + hour;}
    var minutes = date.getMinutes().toString();
    if (minutes.length === 1) {minutes = "0" + minutes;}
    var seconds = date.getSeconds().toString();
    if (seconds.length === 1) {seconds = "0" + seconds;}
    var tStamp = "[" + hour + ":" + minutes + ":" + seconds + "]";
    const logText = document.getElementById("Log").innerHTML;
    const newLine = `<br> ${tStamp}: ${text}`;
    const newText = newLine + logText;
    document.getElementById("Log").innerHTML = newText;

}

/**
 * Clears the console log
 */
function clearLog() {

    document.getElementById("Log").innerHTML = "";

}

/**
 * @param {object} sudoku 
 * output the given sudoku to the console log
 */
function consoleLogSudoku(sudoku) {
    console.log(sudoku);
}










//////////////////////////
// Sudoku Initilisation //
//////////////////////////



/**
 * @returns {object} A blank sudoku object
 */
function generateBlankSudoku() {

    var sudoku = {};
    var propertyName;
    for (var squ = 1; squ <= 9; squ++) {
        for (var row = 1; row <= 3; row++) {
            for (var col = 1; col <= 3; col++) {
                propertyName=`squ${squ}row${row + detRowOffSet(squ)}col${col + detColOffSet(squ)}`;
                sudoku[propertyName] = [];
            }
        }
    }
    log(successMessages.generated);
    return sudoku;

}

/**
 * Uploads a Sudoku from a text file
 * Text file should be 9 line sudoku
 * With unknowns represent with an X
 * and store it in the globalSudoku variable
 */
function uploadSudoku() {

    var sudoku = generateBlankSudoku();
    uploadText().then(text => {
        // String out spaces and CRs
        text = text.replace( /[\r\n]+/gm, "" );
        var index = 1;
        while (index <= text.length) {
            var row = Math.floor((index - 1) / 9) + 1;
            var col = (index - 1 + 9) % 9 + 1;
            var squ = detSqu(row, col);
            var propertyName = `squ${squ}row${row}col${col}`
            if (text.charAt(index -1) !== "X") {
                sudoku[propertyName] = [text.charAt(index -1)];
            } else {
                sudoku[propertyName] = possibilites;
            }
            index++;
        }
        sudoku.initialKnown = countKnowns(sudoku);
        sudoku.initialPossibilities = countPossibilities(sudoku);
        log(successMessages.uploaded);
        populateCells(sudoku);
        globalSudoku = sudoku;
    });

}

/**
 * Creates a file upload dialog and returns text in promise
 * @returns {Promise<any>}
 */
// https://stackoverflow.com/questions/19038919/is-it-possible-to-upload-a-text-file-to-input-in-html-js/19039880
function uploadText() {

    return new Promise((resolve) => {
        // create file input
        const uploader = document.createElement('input');
        uploader.type = 'file';
        uploader.style.display = 'none';

        // listen for files
        uploader.addEventListener('change', () => {
            const files = uploader.files;

            if (files.length) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    uploader.parentNode.removeChild(uploader);
                    resolve(reader.result);
                })
                reader.readAsText(files[0]);
            }
        });

        // trigger input
        document.body.appendChild(uploader);
        uploader.click();
    });

}