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