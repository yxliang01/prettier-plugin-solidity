const {
  doc: {
    builders: { group, line, concat, indent }
  }
} = require('prettier/standalone');

const indentIfNecessaryBuilder = path => doc => {
  let node = path.getNode();
  for (let i = 0; ; i += 1) {
    const parentNode = path.getParentNode(i);
    if (parentNode.type === 'ReturnStatement') return doc;
    if (parentNode.type === 'IfStatement') return doc;
    if (parentNode.type === 'ForStatement') return doc;
    if (parentNode.type === 'WhileStatement') return doc;
    if (parentNode.type !== 'BinaryOperation') return indent(doc);
    if (node === parentNode.right) return doc;
    node = parentNode;
  }
};

module.exports = {
  match: op => ['<', '>', '<=', '>=', '==', '!='].includes(op),
  print: (node, path, print) => {
    const indentIfNecessary = indentIfNecessaryBuilder(path);

    return group(
      concat([
        path.call(print, 'left'),
        ' ',
        indentIfNecessary(
          concat([node.operator, line, path.call(print, 'right')])
        )
      ])
    );
  }
};
