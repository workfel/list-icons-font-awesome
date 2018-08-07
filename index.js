#!/usr/bin/env node

const args = require("args-parser")(process.argv);
const fs = require('fs');
const preFixFa = args.prefixFa || 'fa';
const pathOutFile = args.outFile || 'font-awesome.json';

try {
    const content = fs.readFileSync('./node_modules/@fortawesome/fontawesome-free-webfonts/less/_icons.less', {
        encoding: 'utf8'
    });
    const icones = content.split('.@{fa-css-prefix}-');

    const icons = icones.filter((currentIcon) => {
        return (currentIcon.indexOf(':before') !== -1);
    }).map((currentIcon) => {
        return currentIcon.substr(0, currentIcon.indexOf(':before'))
    }).map((currentIcon) => {
        return `${preFixFa}-${currentIcon}`;
    });

    const json = {
        version: JSON.parse(fs.readFileSync('package.json', {
            encoding: 'utf8'
        })).version,
        icons: icons
    };

    fs.writeFileSync(pathOutFile, JSON.stringify(json), {
        encoding: "utf8"
    });

    console.log(`File wrote on ${pathOutFile}`);
} catch (error) {
    console.error("Error during reading icons list file.", error);
    throw error;
}