const {
  doc: {
    builders: { indent, line }
  }
} = require('prettier');

const printComments = (node, path, options) => {
  const parts = [];
  if (node.comments) {
    let first = true;
    path.each(commentPath => {
      const comment = commentPath.getValue();
      if (comment.trailing || comment.leading) {
        return;
      }

      if (first) {
        first = false;
      } else {
        parts.push(indent(line));
      }

      comment.printed = true;
      parts.push(options.printer.printComment(commentPath));
    }, 'comments');
  }
  return parts;
};

module.exports = printComments;
