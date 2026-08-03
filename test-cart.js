const { DecisionTreeRegression } = require('ml-cart');
const fs = require('fs');
const tree = new DecisionTreeRegression();
tree.train([[1, 2], [3, 4], [5, 6]], [10, 20, 30]);
fs.writeFileSync('test-cart-out.json', JSON.stringify(tree.toJSON(), null, 2));
