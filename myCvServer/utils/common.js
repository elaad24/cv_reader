const stripRtf = (rtf) => {
  return rtf
    .replace(/\\[a-z]+(?:-?\d+)?[ ]?|{\*\\[^}]+}|[{}]|\\'[0-9a-f]{2}/gi, "")
    .replace(/\n\s*\n/g, "\n");
};

module.exports = { stripRtf };
