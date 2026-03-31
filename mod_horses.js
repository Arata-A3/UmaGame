const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf-8');
const match = code.match(/const HORSES = \[([\s\S]*?)\];/);
if (!match) process.exit(1);

let horsesStr = match[1];
const lines = horsesStr.split('\n').filter(l => l.trim());

const newLines = lines.map(line => {
    return line.replace(/speed: (\d+), stamina: (\d+), guts: (\d+)/, (m, sp, st, gu) => {
        let nsp = Math.max(30, Math.min(120, Math.floor(30 + (parseInt(sp) - 70) * 3)));
        let nst = Math.max(30, Math.min(120, Math.floor(30 + (parseInt(st) - 70) * 3)));
        let ngu = Math.max(30, Math.min(120, Math.floor(30 + (parseInt(gu) - 70) * 3)));
        return `speed: ${nsp}, stamina: ${nst}, guts: ${ngu}`;
    });
});

let indexHtml = code.replace(/const HORSES = \[([\s\S]*?)\];/, `const HORSES = [\n${newLines.join('\n')}\n];`);
fs.writeFileSync('index.html', indexHtml);
console.log('Modified HORSES successfully');
