import xlsx from "node-xlsx";
import * as fs from "fs";

const excel = xlsx.parse(fs.readFileSync(`${__dirname}/testFiles/teszt1`));

console.log(excel);
