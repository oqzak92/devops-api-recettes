const fs = require('fs');
const path = require('path');

module.exports = async () => {
  try {
    fs.unlinkSync(path.join(process.cwd(), 'test.db'));
  } catch (_e) {
    // Ignore — le fichier peut déjà être supprimé
  }
};
