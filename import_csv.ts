import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import readline from 'readline';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim().replace(/^["']/, '').replace(/["']$/, '');
    }
  });
}

const sql = postgres(process.env.SUPABASE_URL!, { prepare: false });

async function run() {
  console.log('Connecting to database...');
  
  const csvPath = path.resolve(process.cwd(), '.agents/database/data.csv');
  console.log('Reading CSV from', csvPath);
  
  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isFirstLine = true;
  let buffer: any[] = [];
  let totalInserted = 0;
  
  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    
    if (!line.trim()) continue;

    // id,current,voltage,power_watt,last_updated,createdAt
    const [id, currentStr, voltageStr, power_wattStr, last_updated, createdAt] = line.split(',');
    
    buffer.push({
      id,
      current: parseFloat(currentStr),
      voltage: parseFloat(voltageStr),
      power_watt: parseFloat(power_wattStr),
      last_updated,
      createdAt
    });

    if (buffer.length >= 1000) {
      await sql`INSERT INTO firebase ${sql(buffer)} ON CONFLICT (id) DO NOTHING`;
      totalInserted += buffer.length;
      console.log(`Inserted ${totalInserted} rows...`);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    await sql`INSERT INTO firebase ${sql(buffer)} ON CONFLICT (id) DO NOTHING`;
    totalInserted += buffer.length;
    console.log(`Inserted ${totalInserted} rows...`);
  }

  console.log('Import completed!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
