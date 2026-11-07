import { app } from './app.js';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, () => {
  console.log(`
  ═════════════════════════════════════════════════════════════════
  🏪  SHREE SEVA ENTERPRISES & READYMADE — BACKEND API
  📍  Pachora, Maharashtra, India
  🌐  Server running on http://localhost:${PORT}
  🚀  Health check: http://localhost:${PORT}/api/health
  🛒  Catalog: http://localhost:${PORT}/api/products
  📂  Categories: http://localhost:${PORT}/api/categories
  ═════════════════════════════════════════════════════════════════
  `);
});

