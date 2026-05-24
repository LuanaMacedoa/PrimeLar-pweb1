import fs from 'node:fs';
import path from 'node:path';

const outputPath = path.join(process.cwd(), 'src/environments/environment.runtime.ts');

const existingContent = fs.existsSync(outputPath)
  ? fs.readFileSync(outputPath, 'utf8')
  : '';

const hasRealKey =
  existingContent.includes('supabaseKey:') &&
  !existingContent.includes("supabaseKey: ''") &&
  !existingContent.includes('REPLACE_WITH_SUPABASE_ANON_KEY');

if (hasRealKey) {
  process.exit(0);
}

const supabaseUrl = process.env.SUPABASE_URL?.trim() || 'https://gwwzahbscsijbehvxlgz.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY?.trim() || 'REPLACE_WITH_SUPABASE_ANON_KEY';

const content = `export const environment = {
  production: false,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, 'utf8');