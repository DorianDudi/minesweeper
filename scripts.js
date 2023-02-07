// MINESWEEPER GAME
// EMPTY CELL = 0
// NUMBERED CELL = INTEGER VALUE BASED ON NEIGHBOURING MINES (values range 1 to 8 inclusive)
// MINED CELL = 9

let game_matrix = [], mine_coordinates = [], grid_length = 0, grid_height = 0, number_of_mines = 0;

function init_mine_coord_matrix(total_mines) {
    for (let i = 0; i <= 1; i++) {// initialize coordinates matrix
        mine_coordinates[i] = [];
        for (let j = 0; j < total_mines; j++) {
            mine_coordinates[i][j] = 0;
        }
    }
    //console.table(mine_coordinates);
}

function initialize_game_matrix() {
	let rows = parseInt(grid_height) + 1, columns = parseInt(grid_length) + 1;
    for (let i = 0; i <= rows; i++) {
        game_matrix[i] = [];
        for (let j = 0; j <= columns; j++) {
        	if (i == 0 || i == rows || j == 0 || j == columns) {
            	game_matrix[i][j] = -1;
            } else {
            	game_matrix[i][j] = 0;
            }
        }
    }
    //console.table(game_matrix);
}	// the above code declares and initializes the game matrix and the coordinate matrix

function startGame() {//
	grid_length = document.getElementById('grid_length').value;
    grid_height = document.getElementById('grid_height').value;
    number_of_mines = Math.ceil(grid_length * grid_height / 10) + 1;
    //console.log(number_of_mines);
    document.getElementById('add_mines_count').innerHTML += (' ' + Math.ceil(number_of_mines) + ' mines.');
    if ((Number.isInteger(grid_length) && Number.isInteger(grid_height)) && grid_length == 0 || grid_height == 0 || grid_length < 5 || grid_height < 5 || grid_length > 40 || grid_height > 40) {
    	//alert("enter values that range from 5 to 40");
        show_input_warning();
    } else {
    	document.getElementById("grid_size_input").setAttribute("hidden", "true");
        document.getElementById("in_game_instructions").removeAttribute("hidden");
    	restart_game();
    }
}

function restart_game() { // resets the HTML and adds new values in the matrices
	document.getElementById("game_grid").innerHTML = "";
    initialize_game_matrix();
    generate_mine_coordinates(number_of_mines);
    generate_game(number_of_mines);
    generate_game_grid();
	//console.table(mine_coordinates);
	//console.table(game_matrix);
	document.getElementById("game_over").hidden = true;
	document.getElementById("winner").hidden = true;
	document.getElementById("game_on").hidden = false;
}

function resize_grid() {
	grid_length = 0;
	grid_height = 0;
    document.getElementById('grid_length').value = "";
    document.getElementById('grid_height').value = "";
    document.getElementById("game_grid").innerHTML = "";
    document.getElementById("in_game_instructions").setAttribute("hidden", "true");
    document.getElementById("grid_size_input").removeAttribute("hidden");
    document.getElementById('add_mines_count').innerHTML = "Clear all the cells by avoiding the";
}

function generate_game_grid() {
	for (let i = 1; i <= grid_height; ++i) {
    	for (let j = 1; j <= grid_length; ++j) {
        	add_cell(i, j);
    	}
    }
}

function add_cell_delay(i, j) {
	const show_cell_ID = setTimeout(add_cell, 5 * i, i, j);
}

function add_cell(line, col) {
	document.getElementById("game_grid").innerHTML += '<div class="cell_unclicked" onclick="reveal_cell(this.id)" oncontextmenu="toggle_flag(this.id)" id="' + line + '.'+ col + '"></div>';
    if (col == grid_length) {
		document.getElementById('game_grid').innerHTML += "<br>";
    }
}

function show_input_warning() {
	document.getElementById("input_warning").removeAttribute("hidden");
    setTimeout(() => {document.getElementById("input_warning").setAttribute("hidden", "true")}, 5000);
    //setTimeout(() => {console.log("this is the third message")}, 1000);
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); // random number in interval - min-max inclusive
}

function generate_mine_coordinates(total_mines) {	// populates mine coordinate matrix with random non-identical values
	init_mine_coord_matrix(total_mines);
    for (let j = 0; j < total_mines; ++j) {
        mine_coordinates[0][j] = getRandomIntInclusive(1, parseInt(grid_height));
        mine_coordinates[1][j] = getRandomIntInclusive(1, parseInt(grid_length));
        for (let x = 0; x < j; ++x) {
            while (mine_coordinates[0][x] == mine_coordinates[0][j] && mine_coordinates[1][x] == mine_coordinates[1][j]) {
                mine_coordinates[0][j] = getRandomIntInclusive(1, parseInt(grid_height));
                mine_coordinates[1][j] = getRandomIntInclusive(1, parseInt(grid_length));
            }
        }
    }
}

function generate_game(total_mines) {	//populates game matrix with values 1 to 9 (9 being the mines and 1 to 8 are neighbouring values)
	for (let i = 0; i < total_mines; ++i) {
		let x = mine_coordinates[0][i], y = mine_coordinates[1][i];
		game_matrix[x][y] = 9;
	}
	for (let i = 1; i <= grid_height; ++i) {
		for (let j = 1; j <= grid_length; ++j) {
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

function toggle_flag(divID) {	// toggles flag on right clik - disables flagged cell
	if (document.getElementById(divID).classList.contains('cell_unclicked')) {
		if(document.getElementById(divID).innerHTML != '') { // if has flag
			document.getElementById(divID).innerHTML = '';
			if (!document.getElementById("game_on").hasAttribute("hidden")) { // reactivate cell if game has not ended
				document.getElementById(divID).setAttribute("onclick", "reveal_cell(this.id)");
			}
		} else {
			document.getElementById(divID).innerHTML = '<img src="https://iili.io/Hz9kofR.png" border="0" width="28" height="28" />';
			document.getElementById(divID).removeAttribute("onclick");
		}
	}
}

function reveal_cell(elem_id) {		// reveals contents of clicked cells by calling update_HTML_ID() triggers the flood-fill if value is 0
	document.getElementById(elem_id).classList.replace('cell_unclicked', 'cell_clicked');
	//let x = parseInt(elem_id[0]), y = parseInt(elem_id[1]), cell_value = game_matrix[x][y];
    let x = 0, y = 0, store_in_x = 1;
    for (let i = 0; i < elem_id.length; i++) {
		let current_char = elem_id[i];
        if (current_char == '.') {
        	store_in_x = 0;
        } else if (store_in_x) {
        	x = x * 10 + parseInt(current_char);
        } else {
        	y = y * 10 + parseInt(current_char);
        }
    }
    //console.log(elem_id);
    //console.log(x);
    //console.log(y);
    let cell_value = game_matrix[x][y];
	if (cell_value > 0) {
		update_HTML_ID(x, y, cell_value);	// display number value in cell or...
	} else {
		fill_cleared_cells(x, y);			// call flood-fill functions
		reveal_corners();
	}
	if (user_wins()) {
		game_over(1);
	}
}

function update_HTML_ID(a, b, val) { // displays cell value or mine in case of end-game
	let divID = "" + a + "." + b;
	if (val != 9) {
		document.getElementById(divID).innerHTML = "<h3>" + val + "</h3>";
	} else {
		document.getElementById(divID).innerHTML = '<img src="https://iili.io/HoDm1Og.png" border="0" width="25" height="25" />';
		game_over(0);
	}
}

function user_wins() {	// checks if all empty cells have been cleared
	let cleared_cells = 0, mines_;
	for (let i = 1; i <= parseInt(grid_height); ++i) {
		for (let j = 1; j <= parseInt(grid_length); ++j) {
			let elemID = "" + i + "." + j;
			if (document.getElementById(elemID).classList.contains('cell_clicked') && game_matrix[i][j] != 9) {
				++cleared_cells;
			}
		}
	}
    let total_free_cells = Math.floor(grid_length * grid_height - number_of_mines);
	if (cleared_cells == total_free_cells) {
		return 1;
	}
	return 0;
}

function fill_cleared_cells(x, y) {
	direction_flag = [0, 0, 0, 0];
	direction_i = [-1, 1, 0, 0];// up-down-left-right
	direction_j = [0, 0, -1, 1];
    for (let dir = 0; dir < direction_i.length; ++dir) {
    	let current_x = x + direction_i[dir], current_y = y + direction_j[dir];
		while (game_matrix[current_x][current_y] >= 0 && direction_flag[dir] == 0) {
        	let ID_html = "" + current_x + "." + current_y;
            if (document.getElementById(ID_html).classList.contains('cell_unclicked')) {
                document.getElementById(ID_html).classList.replace('cell_unclicked', 'cell_clicked'); // changes style
                if (game_matrix[current_x][current_y] > 0) {
                    document.getElementById(ID_html).innerHTML = "<h3>" + game_matrix[current_x][current_y] + "</h3>"; // mine near: display number, set limit
                    direction_flag[dir] = 1;
                } else {// run flood-fill again on empty cell
                    document.getElementById(ID_html).innerHTML = ''; // clears flag
                    fill_cleared_cells(current_x, current_y);
                    reveal_corners();
                }
            } else {
                direction_flag[dir] = 1;
            }
            current_x += direction_i[dir];
            current_y += direction_j[dir];
        }
	}
}

function reveal_corners() { // auxiliary function used by fill_cleared_cells() that handles the corners of the filled area
	for (let i = 1; i <= parseInt(grid_height); ++i) {
		for (let j = 1; j <= parseInt(grid_length); ++j) {
			if (game_matrix[i][j] == 0) {
				let currentID = "" + i + "." + j;
				if (document.getElementById(currentID).classList.contains('cell_clicked')) {
					display_adjacents_of(i, j);
				}
			}
		}
	}
}

function display_adjacents_of(x, y) {  // displays the 3x3 submatrix that has the cell of x,y coordinates at it's center
	for (let i = x - 1; i <= x + 1; ++i) {
		for (let j = y - 1; j <= y + 1; ++j) {
			if (i != 0 && j != 0 && i != (parseInt(grid_height) + 1) && j != (parseInt(grid_length) + 1)) { //  if coordinates are not out of bounds
				let currentID = "" + i + "." + j;
                if (document.getElementById(currentID).classList.contains('cell_unclicked')) { // only affect unclicked cells
                	document.getElementById(currentID).classList.replace('cell_unclicked', 'cell_clicked');
                   	if (game_matrix[i][j] > 0) {
                        document.getElementById(currentID).innerHTML = "<h3>" + game_matrix[i][j] + "</h3>";
                    } else  {
                        fill_cleared_cells(i, j);
                        reveal_corners();
                    }
                }
			}
		}
	}
}

function grid_freeze(state) { // disables all cells if argument is 1 or activates them when argument is 0
	for (let i = 1; i <= parseInt(grid_height); ++i) {
		for (let j = 1; j <= parseInt(grid_length); ++j) {
			let elemID = "" + i + "." + j;
			if (state == 1) {
				document.getElementById(elemID).removeAttribute("onclick");	
			} else {
				document.getElementById(elemID).setAttribute("onclick", "reveal_cell(this.id)");
			}
		}
	}
}

function game_over(user_won) { //changes icon at game over
	document.getElementById("game_on").hidden = true;
	if (user_won) {
		document.getElementById("winner").hidden = false;
	} else {
		document.getElementById("game_over").hidden = false;
		for (let i = 1; i <= parseInt(grid_height); ++i) {
			for (let j = 1; j <= parseInt(grid_length); ++j) {
				let elemID = "" + i + "." + j;
				if (game_matrix[i][j] == 9) {
					document.getElementById(elemID).classList.replace('cell_unclicked', 'cell_clicked');
					document.getElementById(elemID).innerHTML = '<img src="https://iili.io/HoDm1Og.png" border="0" width="25" height="25" />';
				}
			}
		}
	}
	grid_freeze(1);
} 

document.addEventListener('contextmenu', event => event.preventDefault()); // disables context menu