/**
 * Gets the values of the checkboxes and constructs an Array with the values
 * @returns Parameter Array
 */
function getUnicornDisplayParameters() {
    let checkboxes = document.getElementById("unicornAttributeCheckboxes").getElementsByTagName("input");
    let parameters = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            parameters.push(checkboxes[i].id.replace('flexCheck', '').toLowerCase())
        }
    }
    console.log(parameters)
    return parameters;
}

/**
 * Parses the unicorn input fields and returns an object with the values
 * @returns an object with the values of the input fields
 */
function getFieldValues() {
    let values = {};

    let selectedIndex = document.getElementById('fieldRelationInput').selectedIndex;
    values.fieldRelationType = document.getElementById('fieldRelationInput').options[selectedIndex].id;

    let names = formatStringArrayInput(document.getElementById("unicornNameInput"));
    if (names.length > 0) {
        // Names should be title case
        values.name = names.map(item => item.charAt(0).toUpperCase() + item.slice(1));
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
    // Split the string into an array of strings, remove whitespace, and capitalize the first letter
    let values = input.value.split(',').map(item => item.trim().toLowerCase());
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
function generateRequestURL(inputObject) {
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
function populateTable(data, params) {
    let table = document.getElementById("queryResultsTable");
    table.innerHTML = '';
    let headerRow = document.createElement("tr");
    for (let key of params) {
        console.log(key);
        let header = document.createElement("th");
        header.innerHTML = key;
        headerRow.appendChild(header);
    }
    table.appendChild(headerRow);
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        for (let key of params) {
            let cell = document.createElement("td");
            cell.innerHTML = data[i][key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}


document.getElementById("unicornSearchButton").addEventListener("click", async () => {
    try {
        let tableParameters = getUnicornDisplayParameters();
        if (tableParameters.length === 0) {
            throw new Error('You must select at least one parameter to display!')
        }
        let values = getFieldValues();
        console.log('Field values:', values);

        values.display = tableParameters.join(',');
        console.log('Display parameters:', values.display);

        tableParameters['sort'] = document.getElementById("unicornSortByInput").value.toLowerCase().replace('ascending', '1').replace('descending', '-1');
        console.log('Sort parameters:', tableParameters['sort']);

        let queryParams = generateRequestURL(values);
        console.log('Query parameters:', queryParams);

        response = await fetch(`http://localhost:3000/unicorns/` + queryParams)
        responseJSON = await response.json()
        console.log(responseJSON)
        populateTable(responseJSON, tableParameters)
    }
    catch (err) {
        alert(err);
    }
});

document.getElementById("sortParameterClearButton").addEventListener("click", () => {
    document.getElementById("unicornSortByInput").value = '';
    let sortOptions = document.getElementById("sortParameter").options;
    for (let i = 0; i < sortOptions.length; i++) {
        sortOptions[i].removeAttribute('disabled');
    }
});

document.getElementById("sortParameterAddButton").addEventListener("click", () => {
    // get the dropdown list
    let input = document.getElementById("sortParameter");
    // store all options
    let sortOptions = input.options;
    currentOption = sortOptions[input.selectedIndex]

    if (!currentOption.disabled) {
        currentOption.setAttribute('disabled', true);
        let sortParameter = input.value;
        let sortOrder = document.getElementById("sortAscDesc").value;
        let sortString = `${sortParameter}:${sortOrder}`;

        // update field with value or coma separated value
        if (document.getElementById("unicornSortByInput").value !== '') {
            document.getElementById("unicornSortByInput").value += ',' + sortString;
        } else {
            document.getElementById("unicornSortByInput").value = sortString;
        }
    }
});