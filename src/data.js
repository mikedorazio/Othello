export const Player = {
    WHITE: { code: 1, color: "white-option" },
    BLACK: { code: 2, color: "black-option" },
}

export const CodeColor = {
    BLANK: { code: 0, color: "blank-container" },
    WHITE: { code: 1, color: "white-container" },
    BLACK: { code: 2, color: "black-container" },
    OPTION_WHITE: { code: 3, color: "white-option" },
    OPTION_BLACK: { code: 4, color: "black-option" },
};

export let dataGrid = [];
for (let i = 0; i < 8; i++) {
    // Initialize an empty array for the current row
    dataGrid[i] = [];

    // Inner loop for columns
    for (let j = 0; j < 8; j++) {
        // Create an object with properties
        let obj;
        if (i == 3 && j == 3 || i == 4 && j == 4) {
            obj = { id: i * 8 + j, row: i, column: j, code: CodeColor.WHITE.code, color: CodeColor.WHITE.color };
            dataGrid[i].push(obj);
            continue;
        }
        if (i == 3 && j == 4 || i == 4 && j == 3) {
            obj = { id: i * 8 + j, row: i, column: j, code: CodeColor.BLACK.code, color: CodeColor.BLACK.color };
            dataGrid[i].push(obj);
            continue;
        }
        obj = { id: i * 8 + j, row: i, column: j, code: CodeColor.BLANK.code, color: CodeColor.BLANK.color };
        // Add the object to the current row
        dataGrid[i].push(obj);
    }
}
dataGrid[2][3].color = "black-option";
dataGrid[2][3].code = CodeColor.OPTION_BLACK.code;
dataGrid[3][2].color = "black-option";
dataGrid[3][2].code = CodeColor.OPTION_BLACK.code;
dataGrid[4][5].color = "black-option";
dataGrid[4][5].code = CodeColor.OPTION_BLACK.code;
dataGrid[5][4].color = "black-option";
dataGrid[5][4].code = CodeColor.OPTION_BLACK.code;

console.log("dataGrid", dataGrid);







