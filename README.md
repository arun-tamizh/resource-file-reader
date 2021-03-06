# Resource File Reader
Simple .properties files reader for NodeJS applications similar to salesforce b2c commercecloud dw Resource class.

# Installation

```
npm install resource-file-reader
```
# Methods Usage

## msg

This method reads the value of the given property name from the specified bundle/.properties file, if no values found returns the default value.
```
const Resource = require('resource-file-reader');

Resource.msg('property.name', 'bundleName', defaultValue);
```

## msgf

This method reads the value similar to msg method and replaces the placeholders ({0}, {1}...) with the arguments passed.
```
Resource.msgf('property.name', 'bundleName', defaultValue, ...args);
```
