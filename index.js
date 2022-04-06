'use strict';

//npm modules
const path = require('path');
const process = require('process');
const fs = require('fs');
const glob = require('glob');
const propertiesReader = require('properties-reader');

(function() {
    //current workspace
    const _cwd = process.cwd();

    //path to all resource bundle folders
    const paths = glob.sync(path.resolve(_cwd, '**', 'resources'));

    //constructs the bundle
    const getBundle = function(filename) {
        let filePaths = paths.filter(function(currentPath) {
            return fs.existsSync(path.resolve(currentPath, filename + '.properties'));
        });

        if (filePaths.length) {
            return propertiesReader(path.resolve(filePaths[0], filename + '.properties'));
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
        msg: function(name, bundleName, defaultValue) {
            return getBundle(bundleName).get(name) || defaultValue;
        },
        msgf: function(name, bundleName, defaultValue) {
            const argsArray = Array.prototype.slice.call(arguments, 3);
            const prop = this.msg(name, bundleName, defaultValue);

            return bindPlaceholders(prop, argsArray);
        }
    }
})();
