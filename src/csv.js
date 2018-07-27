const fs = require('fs');
const {packci4, packci5, population} = require('./parsers');

function parseLine(line) {
    const [code, name, ...rest] = line.split('\t');
    const numbers = rest.map(Number);
    return [code, ...numbers];
}

function process(input, output, fn) {
    const data = fs
        .readFileSync(input)
        .toString()
        .split('\n')
        .filter((line)=> line)
        .map(parseLine);

    const [total, ...others] = data;
    const out = {
        total: fn ? fn(total) : total,
    };
    others.forEach((region)=> {
        const [code] = region;
        out[code] = fn ? fn(region) : region;
    });
    fs.writeFileSync(output, JSON.stringify(out));
}

function process52(input, output) {
    const data = fs
        .readFileSync(input)
        .toString()
        .split('\n')
        .filter((line)=> line)
        .map((line)=> line.split(','));

    fs.writeFileSync(output, JSON.stringify(data));
}

function split(lines, lastCol) {
    const linesize = lines.indexOf(lastCol) + 1;
    let idx = linesize + linesize;
    const ret = [];
    while((idx+1) < lines.length) {
        ret.push(lines.slice(idx, idx + linesize));
        idx += linesize;
    }
    return ret;
}

function process52txt(input, output) {
    const data = fs
        .readFileSync(input)
        .toString()
        .split('\n');
    fs.writeFileSync(output, JSON.stringify(split(data, 'Примітки')));
}

function main() {
    process('./src/data/CI5_2018_05_all.csv', './src/data/CI5_2018_05_all.json', packci5);
    process('./src/data/CI4_2018_05_all.csv', './src/data/CI4_2018_05_all.json', packci4);
    process('./src/data/population_2018_05.csv', './src/data/population_2018_05.json', population);
    process52('./src/data/F52_UA51_2017.csv', './src/data/F52_UA51_2017.json');
    process52txt('./src/data/F52_UA26_2017.txt', './src/data/F52_UA26_2017.json');
}

main()
