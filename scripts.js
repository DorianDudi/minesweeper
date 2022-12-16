// MINESWEEPER GAME
// EMPTY CELL = 0
// NUMBERED CELL = INTEGER VALUE BASED ON NEIGHBOURING MINES
// MINED CELL = 9
let game_matrix = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let mine_coordinates = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); //min-max inclusive
}

function reveal_cell(elem_id) {
	document.getElementById(elem_id).className = "cell_clicked";
	let x = parseInt(elem_id[0]), y = parseInt(elem_id[1]), cell_value = game_matrix[x][y];
	if (cell_value > 0) {
		update_HTML_ID(x, y, cell_value);
	} else {
		// call fill function
	}
}

function generate_mine_coordinates() {
    for (let j = 0; j < 10; ++j) {
        mine_coordinates[0][j] = getRandomIntInclusive(1, 9);
        mine_coordinates[1][j] = getRandomIntInclusive(1, 9);
        for (let x = 1; x < j; ++x) {
            while (mine_coordinates[0][x] == mine_coordinates[0][j] && mine_coordinates[1][x] == mine_coordinates[1][j]) {
                mine_coordinates[0][j] = getRandomIntInclusive(1, 9);
                mine_coordinates[1][j] = getRandomIntInclusive(1, 9);
            }
        }
    }
}

function update_HTML_ID(a, b, val) {
	let divID = "" + a + b;
	//console.log(divID);
	if (val != 9) {
		document.getElementById(divID).innerHTML = "<p>" + val + "</p>";
	} else {
		document.getElementById(divID).innerHTML = '<img src="https://iili.io/HoDm1Og.png" border="0" width="38" height="38" />';
	}
}

function generate_game() {
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

generate_mine_coordinates();
generate_game();
console.table(mine_coordinates);
console.table(game_matrix);
