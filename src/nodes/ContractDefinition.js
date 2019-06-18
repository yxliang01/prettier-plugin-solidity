const {
  doc: {
    builders: { concat, group, indent, join, line }
  }
} = require('prettier');

const printPreservingEmptyLines = require('./print-preserving-empty-lines');
const printComments = require('./print-comments');

const inheritance = (node, path, print) => {
  if (node.baseContracts.length > 0) {
    return concat([
      ' is',
      indent(
        concat([
          line,
          join(concat([',', line]), path.map(print, 'baseContracts'))
        ])
      )
    ]);
  }
  return '';
};

const body = (node, path, options, print) => {
  if (node.subNodes.length > 0 || node.comments) {
    return concat([
      indent(line),
      indent(printPreservingEmptyLines(path, 'subNodes', options, print)),
      ...printComments(node, path, options),
      line
    ]);
  }
  return '';
};

const ContractDefinition = {
  print: ({ node, options, path, print }) =>
    concat([
      group(
        concat([
          node.kind,
          ' ',
          node.name,
          inheritance(node, path, print),
          line,
          '{'
        ])
      ),
      body(node, path, options, print),
      '}'
    ])
};

module.exports = ContractDefinition;
