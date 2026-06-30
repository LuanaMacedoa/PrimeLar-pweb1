import fs from 'node:fs';
import path from 'node:path';

const outputPath = path.join(process.cwd(), 'src/environments/environment.ts');
const apiUrl = process.env.API_URL?.trim() || 'http://localhost:8080';

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, 'utf8');
