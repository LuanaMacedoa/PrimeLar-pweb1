import fs from 'node:fs';
import path from 'node:path';

const outputPath = path.join(process.cwd(), 'src/environments/environment.runtime.ts');

const supabaseUrl = process.env.SUPABASE_URL?.trim() || 'https://gwwzahbscsijbehvxlgz.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY?.trim() || 'REPLACE_WITH_SUPABASE_ANON_KEY';

const content = `export const environment = {\n  production: false,\n  supabaseUrl: '${supabaseUrl}',\n  supabaseKey: '${supabaseKey}',\n};\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, 'utf8');