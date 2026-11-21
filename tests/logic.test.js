// Run with: npm test
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const src = ['data', 'logic'].map(f => fs.readFileSync(`src/${f}.js`, 'utf8')).join('\n');
const r = vm.runInNewContext(src + `
gen(); const v = val();
({ n: emps.length, nb: brands.length,
  single: brands.filter((_, b) => new Set(emps.filter(e => e.asg.some(a => a[0] == b)).map(e => e.id)).size == 1).length,
  gaps: v.gaps.length, errs: v.errs.length,
  thuOff: ds().filter(d => dow(d) == 3 && wo['3' + d]).length,
  offs3: Object.keys(wo).filter(k => k.startsWith('32026-')).length })`,
  { document: { getElementById: () => ({}) } });
assert(r.n >= 30, 'at least 30 employees');
assert(r.single / r.nb >= 0.8, 'about 80% single-resource brands');
assert(r.gaps > 0, 'single-owner open-calendar brands must show gaps');
assert(r.errs > 0, 'sample shift conflict must be detected');
assert(r.thuOff >= 4 && r.offs3 === r.thuOff, 'fixed weekly off (Thursday) honoured');
console.log('All tests passed', r);
