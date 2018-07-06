const fs = require('fs');

function parseLine(line) {
    const [code, name, ...rest] = line.split(',');
    const numbers = rest.map(Number);
    return [code, ...numbers];
}

function main() {
    const data = fs
        .readFileSync('./src/data/CI5_2018_05_all.csv')
        .toString()
        .split('\n')
        .filter((line)=> line)
        .map(parseLine);

    const [total, ...others] = data;
    const out = {
        total,
    };
    others.forEach((region)=> {
        const [code] = region;
        out[code] = region;
    });
    fs.writeFileSync('./src/data/CI5_2018_05_all.json', JSON.stringify(out));
}

main()
