/**
 * Gets the values of the checkboxes and constructs an object with the values
 * @returns Parameter object
 */
function getUnicornDisplayParameters() {
    let checkboxes = document.getElementById("unicornAttributeCheckboxes").getElementsByTagName("input");
    let parameters = {};
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) { }
        parameters[checkboxes[i].id.replace('flexCheck', '').toLowerCase()] = checkboxes[i].checked;
    }
    console.log(parameters)
    return parameters;
}


/**
 * Validates the parameters to ensure at least one is true
 * @param {Object} parameters The parameters to display the unicorns with
 * @returns True if the parameters are valid, false otherwise
 */
function validateUnicornDisplayParameters(parameters) {
    let valid = false;
    for (let key in parameters) {
        if (parameters[key] === true) {
            valid = true;
            break;
        }
    }
    return valid;
}

/**
 * Parses the unicorn input fields and returns an object with the values
 * @returns an object with the values of the input fields
 */
function getFieldValues() {
    let values = {};

    let names = formatStringArrayInput(document.getElementById("unicornNameInput"));
    if (names.length > 0) {
        values.name = names;
    }

    let loves = formatStringArrayInput(document.getElementById("unicornLovesInput"));
    if (loves.length > 0) {
        values.loves = loves;
    }

    let weightRelationType = getNumberRelationType('weight');
    let weight = document.getElementById("unicornWeightInput");
    if (weight.value !== '') {
        values[weightRelationType] = parseNumberFromInput(weight);
    }

    let gender = document.getElementById("unicornGenderInput").value;
    if (gender != 'Any') {
        values.gender = gender.toLowerCase();
    }

    let vampireRelationType = getNumberRelationType('vampires');
    let vampires = document.getElementById("unicornVampiresInput");
    if (vampires.value !== '') {
        values[vampireRelationType] = parseNumberFromInput(vampires);
    }

    let vaccinated = document.getElementById("unicornVaccinatedInput").value;
    if (vaccinated == 'Yes') {
        values.vaccinated = true;
    } else if (vaccinated == 'No') {
        values.vaccinated = false;
    }
    return values;
}


/**
 * Breaks input string into array of strings and removes whitespace
 * @param {Node} input A csv string
 * @returns an Array of strings
 */
function formatStringArrayInput(input) {
    let values = input.value.split(',').map(item => item.trim());
    if (values[0] === '' && values.length === 1) {
        values = [];
    }
    return values;
}

/**
 * Attempts to parse an int from the input Node value
 * @param {Node} input The input Node
 * @returns The parsed value
 * @throws Error if the value cannot be parsed as an int
 */
function parseNumberFromInput(input) {
    let parsedValue = parseInt(input.value);
    if (isNaN(parsedValue)) {
        let message = `${input.id.replace('Input', '').replace('unicorn', '')} must be able to be parsed as an int!`
        input.value = 'invalid!';
        throw new Error(message)
    } else {
        return parsedValue;
    }
}

/**
 * Gets the value of a selector based on input string and returns the relational type
 * @param {String} input The start of an id referring to a dropdown list
 * @returns A string representing the relational type of a selector
 */
function getNumberRelationType(input) {
    let node = document.getElementById(input + 'RelationInput');
    switch (node.value) {
        case 'less than:':
            return input + '_$lt';
        case 'greater than:':
            return input + '_$gt';
        case 'equal to:':
            return input + '_$eq';
    }
}

/**
 * Generates a URL string from an object acquired from the web page
 * @param {Object} inputObject An Object storing the data from the web page
 * @returns A URL String to send to the server
 */
function generateRequestURL(inputObject){
    let urlArray = []
    
    for (const key in inputObject) {
        urlArray.push(`${key}=${inputObject[key]}`)
    }

    let queryParams = '?' + urlArray.join('&')
    return queryParams
}

/**
 * Populates a table with the data from the server given the parameters
 * @param {Object} parameters The parameters to display the unicorns with
 * @param {Object} data The data received from the server
 */
function populateTable(parameters, data) {
    let table = document.getElementById("queryResultsTable");
    table.innerHTML = '';
    let headerRow = document.createElement("tr");
    for (let key in parameters) {
        if (parameters[key]) {
            let header = document.createElement("th");
            header.innerHTML = key;
            headerRow.appendChild(header);
        }
    }
    table.appendChild(headerRow);
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        for (let key in parameters) {
            if (parameters[key]) {
                let cell = document.createElement("td");
                cell.innerHTML = data[i][key];
                row.appendChild(cell);
            }
        }
        table.appendChild(row);
    }
}


document.getElementById("unicornSearchButton").addEventListener("click", async () => {
    try {
        let tableParameters = getUnicornDisplayParameters();
        if (validateUnicornDisplayParameters(tableParameters)) {
        } else {
            throw new Error('At least one parameter must be selected!');
        }
        let values = getFieldValues();
        let queryParams = generateRequestURL(values);
        console.log('Query parameters:', queryParams);
        response = await fetch(`http://localhost:3000/unicorns/` + queryParams)
        responseJSON = await response.json()
        console.log(responseJSON)
        populateTable(tableParameters, responseJSON)
    }
    catch (err) {
        alert(err);
    }
});