// Edit titles

// Wikipedia:Dog -> Dog
function removeCategory(title) {
    return title.split(':').length === 1 ? title.split(':')[0] : title.split(':')[1]
}

// Dog (animal) -> Dog
function removeDescription(title) {
    return title.split('(')[0].trim()
}

//Small_dog => Small dog
function removeUnderline(title) {
    return (title.split("'")[1]) ? title.split("'")[1].split("_").join(' ') : title
}

//Small-dog => Small dog
function removeConnector(title) {
    return (title.split("'")[1]) ? title.split("'")[1].split("-").join(' ') : title
}


module.exports = { removeCategory, removeDescription, removeUnderline, removeConnector}