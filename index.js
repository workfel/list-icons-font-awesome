#!/usr/bin/env node

const args = require("args-parser")(process.argv);
const svgson = require('svgson')
const fs = require('fs');
const preFixFa = args.prefixFa || 'fa';
const pathOutFile = args.outFile || 'font-awesome.json';


try {


    const contentBrand = fs.readFileSync('./node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/fa-brands-400.svg', {
        encoding: 'utf8'
    });

    const contentRegular = fs.readFileSync('./node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/fa-regular-400.svg', {
        encoding: 'utf8'
    });

    const contentSolid = fs.readFileSync('./node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/fa-solid-900.svg', {
        encoding: 'utf8'
    });


    svgson(contentBrand, {}, (svgBrand) => {
        const brands = svgBrand.childs[0].childs[0].childs.map(e => e.attrs.glyphName).filter(e => e).map((glyphName) => {
            return `fab fa-${glyphName}`;
        });

        svgson(contentRegular, {}, (svgRegular) => {
            const regular = svgRegular.childs[0].childs[0].childs.map(e => e.attrs.glyphName).filter(e => e).map((glyphName) => {
                return `far fa-${glyphName}`;
            });
            svgson(contentSolid, {}, (svgSolid) => {
                const solid = svgSolid.childs[0].childs[0].childs.map(e => e.attrs.glyphName).filter(e => e).map((glyphName) => {
                    return `fas fa-${glyphName}`;
                });

                const json = {
                    version: JSON.parse(fs.readFileSync('package.json', {
                        encoding: 'utf8'
                    })).version,
                    icons: [...solid, ...regular, ...brands]
                };

                fs.writeFileSync(pathOutFile, JSON.stringify(json), {
                    encoding: "utf8"
                });
                console.log(`File wrote on ${pathOutFile}`);
            });

        });

    });
} catch (error) {
    console.error("Error during reading icons list file.", error);
    throw error;
}