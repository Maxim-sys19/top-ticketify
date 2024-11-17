import * as fs from 'fs';
import * as yaml from 'yaml';
import { join } from 'path';

export const loadYamlConfig = () => {
  const filePath = join(__dirname, '../..', '/src/cron/cron.job.config.yaml');
  const file = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(file);
};
