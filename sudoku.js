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
};

var globalSudoku;

/**
 * Counts the number of total possibilities
 * Across all cells
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
        log(`Possibilites: ${possibilites}`);
    } else {
        log(errorMessages.noSudoku);
    }
}

/**
 * Counts the number of known cells
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
        log(`Known: ${known}`);
    } else {
        log(errorMessages.noSudoku);
    }
}

/**
 * Removes any known numbers from the rows' possibilities
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
 * Removes any known numbers from the cols' possibilities
 * This is nearly identical to processRows() 
 * Except rows are switched for cols
 * Could probably combine into single function
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
 * Removes any known numbers from the squs' possibilities
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

/*
 * scan square 
 */

/**
 * Removes any array of numners (removeFrom) from another array (toRemove)
 * @returns {Array}
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
 * Populates the grid based on the sudoku passed to it
 */
function populateCells(sudoku) {

    try {
        if (sudoku) {
            for (var elem in sudoku) {
                var table = generateCellTable(sudoku[elem]);
                document.getElementById(elem).innerHTML = table;
            }
            log(successMessages.cells);
        } else {
            log(errorMessages.noSudoku);
        }
    } catch {
        log(errorMessages.noGrid);
    }

}

/**
 * Generates a sudoku grid of squares
 * Rows and Columns are labelled from 1 to 9 for easier sudoku processing
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
    document.getElementById("Log").innerHTML += "<br>" + tStamp + ": " + text;

}

/**
 * Clears the console log
 */
function clearLog() {

    document.getElementById("Log").innerHTML = "";

}

// If squ = 1 -> row + 0 col + 0
// If squ = 2 -> row + 0 col + 3
// If squ = 3 -> row + 0 col + 6

// If squ = 4 -> row + 3 col + 0
// If squ = 5 -> row + 3 col + 3
// If squ = 6 -> row + 3 col + 6

// If squ = 7 -> row + 6 col + 0
// If squ = 8 -> row + 6 col + 3
// If squ = 9 -> row + 6 col + 6

/**
 * Determines the row offset for a given square
 * @returns {int}
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
 * Determines the col offset for a given square
 * @returns {int}
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
 * Determines the squ for a given row, col
 * @returns {int}
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
 * Generates an HTML table of unknown elements for a cell
 * @returns {string}
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
 * Generates a blank sudoku object
 * @returns {object}
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
        log(successMessages.uploaded);
    });
    globalSudoku = sudoku;

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