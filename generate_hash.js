import bcrypt from 'bcryptjs';
import fs from 'fs';

const password = 'password123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
fs.writeFileSync('hash.txt', hash);
console.log('Hash written to hash.txt');
