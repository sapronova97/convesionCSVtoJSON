const fs = require('fs');
const iconv = require('iconv-lite');
const csvToJson = require('convert-csv-to-json');
const prompt = require('prompt-sync')();


const slicer = prompt('Please inter your slicer: ');


let data = fs.readFileSync('./table.csv').toString();

let stringSlicer = slicer.repeat(data.slice(0,data.indexOf('\n')).split(slicer).length - 1);

let firstPartText = '';
let lastPartText = '';

function sliceCSVFile(slicerString, csvString) {
    let indexSlice = csvString.indexOf(slicerString, csvString.indexOf(slicerString) + 1);
    firstPartText = csvString.slice(0, indexSlice);
    lastPartText = csvString.slice(indexSlice + slicerString.length);
    return firstPartText, lastPartText

};

sliceCSVFile(stringSlicer, data);


fs.writeFileSync('lastPartText.csv', lastPartText);

let fileInputName = 'lastPartText.csv';


const createLastPartJSON = (inputName)=>{
    
    return csvToJson.getJsonFromCsv(inputName);
};

let lastPartJSON = createLastPartJSON(fileInputName); 


let arrayKeys = ['Оператор', 'Дата/Время'];

let firstPartObject = {};

function getValueOnRight(key, string) {

    let indexOfKey = string.indexOf(key) + key.length + 1
    let result = string.slice(indexOfKey, string.indexOf(';', indexOfKey));
    return result

};

arrayKeys.forEach(item => {

    firstPartObject[item] = getValueOnRight(item, firstPartText);
});


properties = ['Наименование', 'Дата', 'Конц.[mg/L]'];

let lastPartObj = lastPartJSON.map(
    item => Object.fromEntries(
        Object.entries(item).filter(
            ([key, value]) => properties.includes(key)
        )
    )
);


let regexp = /\d{1,}\/\d{2}/g;
lastPartObj.map(item => {
    item['Наименование'] = Object.values(item)[0].match(regexp)[0];

    item['Дата'] = new Date(Object.values(item)[1]);

});

let resultLastPartObj = {};
resultLastPartObj["пробы"] = lastPartObj;
let result = Object.assign(firstPartObject, resultLastPartObj)

let resultJSON = JSON.stringify(result);
fs.writeFileSync('resultJSON.json', resultJSON);

























