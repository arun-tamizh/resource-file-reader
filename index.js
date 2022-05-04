'use strict';

//npm modules
const path = require('path');
const process = require('process');
const fs = require('fs');
const glob = require('glob');
const propFileReader = require('./lib/propReader');

(function() {
    //current workspace
    const _cwd = process.cwd();

    //path to all resource bundle folders
    const paths = glob.sync(path.resolve(_cwd, '**'));

    //constructs the bundle
    const getBundle = function(filename) {
        let filePaths = paths.filter(function(currentPath) {
            return fs.existsSync(path.resolve(currentPath, filename + '.properties'));
        });

        if (filePaths.length) {
            return propFileReader(path.resolve(filePaths[0], filename + '.properties'));
        }
    }

    //binds the placeholders with the given text dynamically
    const bindPlaceholders = function(text, argsArray) {
        let placeholders = text.match(/{(.*?)}/g);

        for (let placeholder of placeholders) {
            let idx = placeholder.substring(1, placeholder.length - 1);
            if (argsArray[idx]) {
                text = text.replace(placeholder,argsArray[idx])
            }
        }

        return text;
    }

    //global exposed methods
    module.exports = {
        cache: {},
        msg: function(name, bundleName, defaultValue) {
            let bundle = { get: function(name) {return ''}};
            if (this.cache[bundleName]) {
                bundle = this.cache[bundleName];
            } else {
                bundle = getBundle(bundleName);
                this.cache[bundleName] = bundle;
            }
            return bundle.get(name) || defaultValue;
        },
        msgf: function(name, bundleName, defaultValue) {
            const argsArray = Array.prototype.slice.call(arguments, 3);
            const prop = this.msg(name, bundleName, defaultValue);

            return bindPlaceholders(prop, argsArray);
        }
    }
})();
