var TokenGenerator = require('uuid-token-generator');
var tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
token = tokgen.generate();