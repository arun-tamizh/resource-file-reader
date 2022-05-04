'use strict';

const fs = require('fs');

class PropReader {
    constructor(file) {
        this.propFile = file;
        this.encoding = 'utf-8';
        this.escapeMap = {'\\n': '\n', '\\r': '\r', '\\t': '\t'}
        this.props = {};
        this.parse();
    }

    parse() {
        let fileStream = fs.readFileSync(this.propFile, { encoding: this.encoding });
        let chunks = fileStream.split('\n');
        for (let chunk of chunks) {
            let cText = ('' + chunk).trim();
            if (cText) {
                let property = /^([^#=]+)(={0,1})(.*)$/.exec(cText);
                if (property) {
                    this.props[property[1].trim()] = property[3].trim();
                }
            }
        }
    }

    get(lookupText) {
        return String(this.props[lookupText]).replace(/\\[nrt]/g, function (key) {
            return this.escapeMap[key];
        }.bind(this));
    }
}

// exports
module.exports = function(file) {
    return new PropReader(file)
};
