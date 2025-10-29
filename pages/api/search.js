// pages/api/search.js
import readline from 'readline';
import { PassThrough } from 'stream';

export default async function handler(req, res) {
  const { num } = req.query;

  if (!num) {
    return res.status(400).json({ error: 'Please provide ?num=' });
  }

  try {
    const driveUrl =
      'https://gfs204n166.userstorage.mega.co.nz/dl/Y8TXa9a_seogKgeTZeRcANdDE660KWwg881bSqhZLmoSBXc6kgdexpR1rezpYKdhJBqFTHl3xUHnq-qP1jSzSHAz4csQK2L22hFV57oZw40MJafacBT98GizDjewC0quVwy0IZl7USb_kxexwUyV_5fanTQbdw/numbers.db';

    // Use the global fetch available in Node 18+ (no need for node-fetch)
    const response = await fetch(driveUrl);
    if (!response.ok) throw new Error('Failed to fetch file from Google Drive');

    const pass = new PassThrough();
    response.body.pipe(pass);

    const rl = readline.createInterface({
      input: pass,
      crlfDelay: Infinity,
    });

    let foundLine = null;

    for await (const line of rl) {
      if (line.includes(num)) {
        foundLine = line;
        break;
      }
    }

    if (!foundLine) {
      return res.status(404).json({ error: 'Number not found' });
    }

    // Split CSV line
    const parts = foundLine.split(',');
    const result = {
      mobile: parts[0]?.replace(/"/g, ''),
      name: parts[1]?.replace(/"/g, ''),
      fname: parts[2]?.replace(/"/g, ''),
      address: parts[3]?.replace(/"/g, ''),
      alt: parts[4]?.replace(/"/g, ''),
      circle: parts[5]?.replace(/"/g, ''),
      id: parts[6]?.replace(/"/g, ''),
      email: parts[7]?.replace(/"/g, ''),
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: 'Internal Server Error', details: err.message });
  }
}
```
