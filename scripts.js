// MINESWEEPER GAME
// EMPTY CELL = 0
// NUMBERED CELL = INTEGER VALUE BASED ON NEIGHBOURING MINES
// MINED CELL = 9

let game_matrix = [];
initialize_game_matrix();
let mine_coordinates = [];
for (let i = 0; i <= 1; i++) {
    mine_coordinates[i] = [];
    for (let j = 0; j < 10; j++) {
        mine_coordinates[i][j] = 0;
    }
}

function initialize_game_matrix() {
    for (let i = 0; i <= 10; i++) {
        game_matrix[i] = [];
        for (let j = 0; j <= 10; j++) {
            game_matrix[i][j] = 0;
        }
    }
}	// the above code declares and initializes the game matrix and the coordinate matrix

function toggle_flag(divID) {	// toggles flag on right clik - disables flagged cell
	if (document.getElementById(divID).classList.contains('cell_unclicked')) {
		if(document.getElementById(divID).innerHTML != '') {
			document.getElementById(divID).innerHTML = '';
			if (!user_wins) {
				document.getElementById(divID).setAttribute("onclick", "reveal_cell(this.id)");
			}
		} else {
			document.getElementById(divID).innerHTML = '<img src="https://iili.io/Hz9kofR.png" border="0" width="30" height="30" />';
			document.getElementById(divID).removeAttribute("onclick");
		}
	}
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); // random number in interval - min-max inclusive
}

function update_HTML_ID(a, b, val) { //changes display style of clicked cell and displays values or mine picture
	let divID = "" + a + b;
	if (val != 9) {
		document.getElementById(divID).innerHTML = "<p>" + val + "</p>";
	} else {
		document.getElementById(divID).innerHTML = '<img src="https://iili.io/HoDm1Og.png" border="0" width="38" height="38" />';
		game_over(0);
	}
}

function reveal_cell(elem_id) {		// reveals contents of clicked cells by calling update_HTML_ID() triggers the flood-fill if value is 0
	document.getElementById(elem_id).classList.replace('cell_unclicked', 'cell_clicked');
	let x = parseInt(elem_id[0]), y = parseInt(elem_id[1]), cell_value = game_matrix[x][y];
	if (cell_value > 0) {
		update_HTML_ID(x, y, cell_value);
	} else {				// also calls the flood-fill function if cell has value of 0
		fill_cleared_cells(x, y);
		reveal_corners();
	}
	if (user_wins()) {
		game_over(1);
	}
}

function user_wins() {	// checks if all empty cells have been cleared
	let cleared_cells = 0;
	for (let i = 1; i <= 9; ++i) {
		for (let j = 1; j <= 9; ++j) {
			let elemID = "" + i + j;
			if (document.getElementById(elemID).classList.contains('cell_clicked')) {
				++cleared_cells;
			}
		}
	}
	if (cleared_cells == 71) {
		return 1;
	}
	return 0;
}

function generate_mine_coordinates() {	// populates mine coordinate matrix with random non-identical values
    for (let j = 0; j < 10; ++j) {
        mine_coordinates[0][j] = getRandomIntInclusive(1, 9);
        mine_coordinates[1][j] = getRandomIntInclusive(1, 9);
        for (let x = 0; x < j; ++x) {
            while (mine_coordinates[0][x] == mine_coordinates[0][j] && mine_coordinates[1][x] == mine_coordinates[1][j]) {
                mine_coordinates[0][j] = getRandomIntInclusive(1, 9);
                mine_coordinates[1][j] = getRandomIntInclusive(1, 9);
            }
        }
    }
}

function generate_game() {	//populates game matrix with values 1 to 9 (9 being the mines and 1 to 8 are neighbouring values)
	for (let i = 0; i < 10; ++i) {
		let x = mine_coordinates[0][i], y = mine_coordinates[1][i];
		game_matrix[x][y] = 9;
	}
	for (let i = 1; i <= 9; ++i) {
		for (let j = 1; j <= 9; ++j) {
			if (game_matrix[i][j] != 9) {
				let cell_value = 0;
				for (let x = i - 1; x <= i + 1; ++x) {
					for (let y = j - 1; y <= j + 1; ++y) {
						if (game_matrix[x][y] == 9) {
							++cell_value;
						}
					}
				}
				game_matrix[i][j] = cell_value;
			}
		}
	}
}

function fill_cleared_cells(x, y) {
	let limit_up = 0;
    for (let i = x - 1, j = y; !limit_up && i > 0; --i) {
        let currentID = "" + i + j;
        if (document.getElementById(currentID).classList.contains('cell_unclicked') && game_matrix[i][j] < 9) {
        	document.getElementById(currentID).classList.replace('cell_unclicked', 'cell_clicked');
        	if (game_matrix[i][j] > 0) {
            	document.getElementById(currentID).innerHTML = "<p>" + game_matrix[i][j] + "</p>";
            	limit_up = 1;    
            } else {
            	fill_cleared_cells(i, j);
            }
        } else {
        	limit_up = 1;
        }
    }
    let limit_down = 0;
    for (let i = x + 1, j = y; !limit_down && i < 10; ++i) {
        let currentID = "" + i + j;
        if (document.getElementById(currentID).classList.contains('cell_unclicked') && game_matrix[i][j] < 9) {
        	document.getElementById(currentID).classList.replace('cell_unclicked', 'cell_clicked');
        	if (game_matrix[i][j] > 0) {
            	document.getElementById(currentID).innerHTML = "<p>" + game_matrix[i][j] + "</p>";
                limit_down = 1;
            } else {
            	fill_cleared_cells(i, j);
            }
        } else {
        	limit_down = 1;
        }
    }
   	let limit_left = 0;
    for (let i = x, j = y - 1; !limit_left && j > 0; --j) {
        let currentID = "" + i + j;
        if (document.getElementById(currentID).classList.contains('cell_unclicked') && game_matrix[i][j] < 9) {
        	document.getElementById(currentID).classList.replace('cell_unclicked', 'cell_clicked');
        	if (game_matrix[i][j] > 0) {
            	document.getElementById(currentID).innerHTML = "<p>" + game_matrix[i][j] + "</p>";
                limit_left = 1;
            } else {
            	fill_cleared_cells(i, j);
            }
        } else {
        	limit_left = 1;
        }
    }
   let limit_right = 0;
   for (let i = x, j = y + 1; !limit_right && j < 10; ++j) {
        let currentID = "" + i + j;
        if (document.getElementById(currentID).classList.contains('cell_unclicked') && game_matrix[i][j] < 9) {
        	document.getElementById(currentID).classList.replace('cell_unclicked', 'cell_clicked');
        	if (game_matrix[i][j] > 0) {
            	document.getElementById(currentID).innerHTML = "<p>" + game_matrix[i][j] + "</p>";
                limit_right = 1;
            } else {
            	fill_cleared_cells(i, j);
            }
        } else {
        	limit_right = 1;
        }
    }
}

function display_adjacents_of(x, y) {  // displays the 3x3 submatrix that has the cell of x,y coordinates at it's center
	for (let i = x - 1; i <= x + 1; ++i) {
		for (let j = y - 1; j <= y + 1; ++j) {
    		if (i != 0 && j != 0 && i != 10 && j != 10) { //  if coordinates are not out of bounds
            	let currentID = "" + i + j;
                document.getElementById(currentID).classList.replace('cell_unclicked', 'cell_clicked');
                if (game_matrix[i][j] > 0) {
            		document.getElementById(currentID).innerHTML = "<p>" + game_matrix[i][j] + "</p>";
                }
            }
    	}
    }
}

function reveal_corners() { // auxiliary function used by fill_cleared_cells() that handles the corners of the filled area
	for (let i = 1; i < 10; ++i) {
        for (let j = 1; j < 10; ++j) {
            if (game_matrix[i][j] == 0) {
                let currentID = "" + i + j;
                if (document.getElementById(currentID).classList.contains('cell_clicked')) {
                    display_adjacents_of(i, j);
                }
            }
        }
    }
}

function grid_freeze(state) { // disables all cells if argument is 1 or activates them when argument is 0
	for (let i = 1; i <= 9; ++i) {
    	for (let j = 1; j <= 9; ++j) {
        let elemID = "" + i + j;
        	if (state == 1) {
            	document.getElementById(elemID).removeAttribute("onclick");		
            } else {
            	document.getElementById(elemID).setAttribute("onclick", "reveal_cell(this.id)");
            }	
        }
    }
}

function game_over(user_won) { // changes icon at game over
	document.getElementById("game_on").hidden = true;	
	if (user_won) {
    	document.getElementById("winner").hidden = false;
    } else {
    	document.getElementById("game_over").hidden = false;
        for (let i = 1; i <= 9; ++i) {
    		for (let j = 1; j <= 9; ++j) {
        		let elemID = "" + i + j;
        		if (game_matrix[i][j] == 9) {
            		document.getElementById(elemID).classList.replace('cell_unclicked', 'cell_clicked');
                    document.getElementById(elemID).innerHTML = '<img src="https://iili.io/HoDm1Og.png" border="0" width="38" height="38" />';
            	}
        	}
    	}
    }
    grid_freeze(1);
} 

function restart_game() { // resets the HTML and adds new values in the matrices
	grid_freeze(0);
	generate_mine_coordinates();
    initialize_game_matrix();
	generate_game();
	console.table(mine_coordinates);
	console.table(game_matrix);
    document.getElementById("game_over").hidden = true;
	document.getElementById("winner").hidden = true;
    document.getElementById("game_on").hidden = false;
    for (let i = 1; i <= 9; ++i) {
    	for (let j = 1; j <= 9; ++j) {
        let elemID = "" + i + j;
        	document.getElementById(elemID).classList.replace('cell_clicked', 'cell_unclicked');
            document.getElementById(elemID).innerHTML = "";
        }
    }
} 

document.addEventListener('contextmenu', event => event.preventDefault()); // disables context menu
generate_mine_coordinates();
generate_game();
console.table(mine_coordinates);
console.table(game_matrix);