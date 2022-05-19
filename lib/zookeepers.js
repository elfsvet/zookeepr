const fs = require('fs');
// we need file system to get access to files in the computer
// to be able to write, change, or create files.
const path = require('path');
const { Z_NO_COMPRESSION } = require('zlib');
// we need path module for 
const filterByQuery = (query, zookeepers) => {
    let filteredResults = zookeepers;
    // if we looking for specific age
    if (query.age) {
        filteredResults = filteredResults.filter(
            // since out form data will be coming in as strings, and our JSON is storing
            // age as a number, we must convert the query string to a number to 
            // perform a comparison:
            (zookeeper) => zookeeper.age === Number(query.age)
        );
    }
    // if we looking for specific favorite animal
    if (query.favoriteAnimal) {
        filteredResults = filteredResults.filter(
            zookeeper => zookeeper.favoriteAnimal === query.favoriteAnimal
        );
    }
    // if we looking for specific name
    if (query.name) {
        filteredResults = filteredResults.filter(
            zookeeper => zookeeper.name === query.name
        );
    }
    // after we filtered all the results, we return the filtered data.
    return filteredResults;
};

const findById = (id, zookeepers) => {
    //TODO: what does [0] means at the end
    const result = zookeepers.filter(zookeeper=> zookeeper.id === id)[0];
    return result;
};

const createNewZookeeper = (body, zookeepers) => {
    // takes input from the user body
    const zookeeper = body;
    // adds it to the end of zookeepers data array
    zookeepers.push(zookeeper);
    // write file sync takes a file where to write and data - it is a string, that will be written to the file
    fs.writeFileSync(
        // the file is path here
        // path join, takes string parameters and returns a string with a single joint path. on my pc it will be:
        // __dirname will return this directory of file(c:\Users\stepa\OneDrive\Desktop\bootcamp\activities\chalenges and projects\week-11\zookeepr\lib) +
        // going one folder up and the rest of the string after ..(one folder up)we provided.
        //c:\Users\stepa\OneDrive\Desktop\bootcamp\activities\chalenges and projects\week-11\zookeepr\data\zookeepers.json
        path.join(__dirname, '../data/zookeepers.json'),
        // the data is a string of json data with value = zookeepers
        // replace = null - all properties of the object are included in the resulting json string
        // space = 2 -  it indicates the number of space characters to use as white space for indenting purposes
        JSON.stringify({zookeepers}, null, 2)
    );
    return zookeeper;
};

const validateZookeeper = zookeeper => {
    if (!zookeeper.name || typeof zookeeper.name !== "string"){
        return false;
    }
    if (!zookeeper.age || typeof zookeeper.age !== "number"){
        return false;
    }
    if (!zookeeper.favoriteAnimal || typeof zookeeper.favoriteAnimal !== 'string') {
        return false;
    }
    return true;
};

module.exports = {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper,
};

//! check this file if something doesn't work