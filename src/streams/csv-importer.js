import { parse } from 'csv-parse';
import fs from 'node:fs';

const file = new URL('./tasks.csv', import.meta.url);

async function importCsv() {
  // Read file  
  const stream = fs.createReadStream(file)
    .pipe(parse({ delimiter: ',', from_line: 2 }));

  for await (const record of stream) {
    const [title, description] = record;

    await fetch('http://localhost:3334/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    })
  }
};

importCsv();