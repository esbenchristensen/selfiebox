// Fills a local development database with the support test bookings, so the chat can be tried in the browser.
//   node --conditions=react-server --import tsx --env-file=.env.local scripts/support-seed.mts
// Refuses databases whose name does not contain "test" or "dev".

import { MongoClient } from "mongodb";

import { BOOKINGS, seed } from "../support/tests/fixtures";

const client = await new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017").connect();
const d = client.db(process.env.MONGODB_DB ?? "selfiebox_support_dev");
await seed(d);
console.log(`Seedet ${d.databaseName} med ${BOOKINGS.length} bookinger:`);
for (const b of BOOKINGS) console.log(`  ${b.id}  ${b.email}  ${b.status}  ${b.from}–${b.to}`);
await client.close();
