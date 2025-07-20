import dotenv from 'dotenv';

const maxActiveTables = process.env.maxActiveTables || 10;
const activeTables = [];
export default activeTables