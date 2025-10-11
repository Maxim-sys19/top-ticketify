import * as fs from 'fs';
import { join } from 'path';
import * as Handlebars from 'handlebars';

export const registerHbsPartialRecursive = (dir: string) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      registerHbsPartialRecursive(fullPath);
    } else if (file.endsWith('.hbs')) {
      const name = file.replace(/\.hbs$/, '');
      const template = fs.readFileSync(fullPath, 'utf-8');
      Handlebars.registerPartial(name, template);
    }
  });
};
