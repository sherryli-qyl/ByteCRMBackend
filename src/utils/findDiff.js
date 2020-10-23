const mongoose = require("mongoose");

function findRedunDant(oldData, newData) {
    let results = [];
    for (let i in oldData) {
        if (!newData.includes(oldData[i].toString())) {
          
            results.push(oldData[i]);
        }
    }
    return results;
}

function findNew(oldData, newData) {
    let results = [];
    for (let i in oldData) {
        const item = new mongoose.Types.ObjectId(oldData[i]);
        if (!newData.includes(item)) {
            results.push(item);
        }
    }
    return results;
}

// function findDiff() {
//     const oldData = ["a","b"]
//     const newData = ["c","a"]
//     let results = [];
//     for (let i in oldData) {
//         if (!newData.includes(oldData[i])) {
//             console.log(oldData);
//             console.log(newData);
//             console.log(1);
//             console.log(oldData[i]);
//             results.push(oldData[i]);
//         }
//     }
//     return results;
// }

module.exports = { findRedunDant, findNew };