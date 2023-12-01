/**
 * Gets the values of the checkboxes and constructs an object with the values
 * @returns Parameter object
 */
function getUnicornDisplayParameters(){
    let checkboxes = document.getElementById("unicornAttributeCheckboxes").getElementsByTagName("input");
    let parameters = {};
    for(let i = 0; i < checkboxes.length; i++){
        parameters[checkboxes[i].id.replace('flexCheck', '')] = checkboxes[i].checked;
    }
    return parameters;
}


/**
 * Validates the parameters to ensure at least one is true
 * @param {Object} parameters The parameters to display the unicorns with
 * @returns True if the parameters are valid, false otherwise
 */
function validateUnicornDisplayParameters(parameters){
    let valid = false;
    for(let key in parameters){
        if(parameters[key] === true){
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
function getFieldValues(){
    let values = {};

    let names = formatStringArrayInput(document.getElementById("unicornNameInput"));
    if (names.length > 0){
        values.name = names;
    }

    let loves = formatStringArrayInput(document.getElementById("unicornLovesInput"));
    if (loves.length > 0){
        values.loves = loves;
    }

    let weightRelationType;
    console.log(document.getElementById("weightRelationInput").value);
    switch(document.getElementById("weightRelationInput").value){
        case 'less than:':
            weightRelationType = 'weight_$lt';
            break;
        case 'greater than:':
            weightRelationType = 'weight_$gt';
            break;
        case 'equal to:':
            weightRelationType = 'weight_$eq';
            break;
    }
    let weight = document.getElementById("unicornWeightInput");
    if (weight.value !== ''){
        values[weightRelationType] = parseNumberFromInput(weight);
    }
    

    let vampireRelationType;
    switch(document.getElementById("vampiresRelationInput").value){
        case 'less than:':
            vampireRelationType = 'vampires_$lt';
            break;
        case 'greater than:':
            vampireRelationType = 'vampires_$gt';
            break;
        case 'equal to:':
            vampireRelationType = 'vampires_$eq';
            break;
    }
    let vampires = document.getElementById("unicornVampiresInput");
    if (vampires.value !== ''){
        values[vampireRelationType] = parseNumberFromInput(vampires);
    }

    return values;
}


/**
 * Breaks input string into array of strings and removes whitespace
 * @param {Node} input A csv string
 * @returns an Array of strings
 */
function formatStringArrayInput(input){
    let values = input.value.split(',').map(item => item.trim());
    if (values[0] === '' && values.length === 1){
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
function parseNumberFromInput(input){
    let parsedValue = parseInt(input.value);
    if (isNaN(parsedValue)){
        input.value = 'Value must be able to be parsed as an int!';
        throw new Error('Value must be able to be parsed as an int!')
    } else {
        return parsedValue;
    }
}

document.getElementById("unicornSearchButton").addEventListener("click", () => {
    console.log(getFieldValues())
});