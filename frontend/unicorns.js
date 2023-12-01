/**
 * Gets the values of the checkboxes and constructs an object with the values
 * @returns Parameter object
 */
function getUnicornDisplayParameters() {
    let checkboxes = document.getElementById("unicornAttributeCheckboxes").getElementsByTagName("input");
    let parameters = {};
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) { }
        parameters[checkboxes[i].id.replace('flexCheck', '')] = checkboxes[i].checked;
    }
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
        values.gender = gender;
    }

    let vampireRelationType = getNumberRelationType('vampires');
    let vampires = document.getElementById("unicornVampiresInput");
    if (vampires.value !== '') {
        values[vampireRelationType] = parseNumberFromInput(vampires);
    }

    let vaccinated = document.getElementById("unicornVaccinatedInput").value;
    if (vaccinated != 'Any') {
        values.vaccinated = vaccinated;
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


function generateRequestURL(inputObject){
    let urlArray = []
    
    for (const key in inputObject) {
        urlArray.push(`${key}=${inputObject[key]}`)
    }

    let queryParams = '?' + urlArray.join('&')
    return queryParams
}


document.getElementById("unicornSearchButton").addEventListener("click", async () => {
    try {
        let parameters = getUnicornDisplayParameters();
        if (validateUnicornDisplayParameters(parameters)) {
            console.log(parameters);
        } else {
            throw new Error('At least one parameter must be selected!');
        }
        let values = getFieldValues();
        response = await fetch(`http://localhost:3000/unicorns/` + generateRequestURL(values))
        responseJSON = await response.json()
        console.log(responseJSON)
    }
    catch (err) {
        alert(err);
    }

    
});