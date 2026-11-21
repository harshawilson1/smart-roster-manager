/**
 * Smart Roster Manager - scheduling logic (calendars, status, generation, validation, backups)
 * Classic script: shares global scope with the other files in src/.
 */
const $=id=>document.getElementById(id);let M='2026-12',hol=['2026-12-25'],wo={},ov={},view='company',fl='';
const O={pod:pods.map((p,i)=>[i,p.name+' (lead '+p.lead+')']),brand:brands.map((b,i)=>[i,b.name]),process:brands.flatMap((b,i)=>b.procs.map(p=>[i+'|'+p.n,b.name+' · '+p.n])),employee:emps.map(e=>[e.id,e.name])};
const SY={W:'W',WO:'O',L:'L',C:'C',H:'–'},SL={L:'on leave',C:'on comp-off',WO:'on weekly off',H:'not rostered',W:'working'};
const ds=()=>{const[y,m]=M.split('-').map(Number),n=new Date(y,m,0).getDate();return Array.from({length:n},(_,i)=>`${M}-${String(i+1).padStart(2,'0')}`)};
const dow=d=>new Date(d+'T00:00:00').getDay(),pr=(b,p)=>brands[b].procs.find(x=>x.n==p);
const dayMin=[],mn=(b,p,d)=>{const o=dayMin.find(x=>x.b==b&&x.p==p&&x.d==d);return o?o.min:pr(b,p).min};
const open=(b,p,d)=>{const c=pr(b,p).cal;return c=='365'||(!hol.includes(d)&&(c=='NH'||dow(d)!=0))};
const st=(e,d)=>{const k=e.id+d;if(e.leaves.includes(d))return'L';if(e.comp.includes(d))return'C';const any=e.asg.some(([b,p])=>open(b,p,d));if(ov[k]=='O')return'WO';if(ov[k]=='W')return any?'W':'H';if(wo[k])return'WO';return any?'W':'H'};
const team=(b,p)=>emps.filter(e=>e.asg.some(a=>a[0]==b&&a[1]==p));
function gen(){wo={};ov={};const D=ds(),cnt={},sun={},K=(b,p,d)=>b+p+d,off=(dow(D[0])+6)%7;
emps.forEach(e=>e.asg.forEach(([b,p])=>D.forEach(d=>{if(!e.leaves.includes(d)&&!e.comp.includes(d))cnt[K(b,p,d)]=(cnt[K(b,p,d)]||0)+1})));
const flex=e=>Math.min(...e.asg.map(([b,p])=>team(b,p).length));
[...emps].sort((a,b)=>flex(a)-flex(b)||a.id-b.id).forEach(e=>{const wk={};D.forEach((d,i)=>(wk[Math.floor((i+off)/7)]??=[]).push(d));
Object.values(wk).forEach(days=>{if(days.length<5||days.some(d=>st(e,d)!='W'))return;let best,bc=1e9;
days.forEach((d,i)=>{let c=(e.wp>=0&&dow(d)!=e.wp?1000:0)+(dow(d)==e.pref?0:PW)+((i+e.id)%7)*.01+(dow(d)==0?(sun[e.id]||0)*SW:0);e.asg.forEach(([b,p])=>{if(open(b,p,d)&&(cnt[K(b,p,d)]||0)-1<mn(b,p,d))c+=10});if(c<bc){bc=c;best=d}});
wo[e.id+best]=1;if(dow(best)==0)sun[e.id]=(sun[e.id]||0)+1;e.asg.forEach(([b,p])=>{if(open(b,p,best))cnt[K(b,p,best)]--})})})}
function val(){const D=ds(),gaps=[],warns=[];
brands.forEach((br,b)=>br.procs.forEach(pc=>{const bad=[];D.forEach(d=>{if(!open(b,pc.n,d))return;const t=team(b,pc.n),n=t.filter(e=>st(e,d)=='W').length;if(n<mn(b,pc.n,d))bad.push({d,n,t})});if(bad.length)gaps.push({b,p:pc.n,min:pc.min,bad})}));
emps.forEach(e=>{let r=0,mx=0;D.forEach(d=>{r=st(e,d)=='W'?r+1:0;mx=Math.max(mx,r)});if(mx>6)warns.push(`${e.name}: ${mx} consecutive working days (limit 6)`);
const hw=D.filter(d=>hol.includes(d)&&st(e,d)=='W').length;if(hw>e.comp.length)warns.push(`${e.name}: worked ${hw} public holiday(s), ${hw-e.comp.length} comp-off(s) owed (use Auto-grant comp-offs)`);const ob=D.filter(d=>new Set(e.asg.filter(([b,p])=>open(b,p,d)).map(a=>a[0])).size>2).length;if(ob)warns.push(`${e.name}: covers more than 2 brands on ${ob} day(s), overlapping responsibilities`);const np=D.filter(d=>st(e,d)=='WO'&&dow(d)!=e.pref).length;if(np)warns.push(`${e.name}: weekly off not on preferred ${DN[e.pref]} in ${np} week(s) (preference only)`)});const errs=[];emps.forEach(e=>{const s=new Set(e.asg.map(([b,p])=>pr(b,p).sf).filter(x=>x!='G'));if(s.size>1)errs.push(`${e.name}: assigned to processes on incompatible shifts (${[...s].join(', ')})`);e.asg.forEach(([b,p])=>{const f=pr(b,p).sf;if(f!='G'&&e.sh!='G'&&e.sh!=f)errs.push(`${e.name}: shift ${e.sh} is incompatible with ${brands[b].name} · ${p} (needs ${f}). Change the shift in the Employee view.`)})});return{gaps,warns,errs}}
const bk=(b,p,d)=>emps.filter(e=>!e.asg.some(a=>a[0]==b&&a[1]==p)&&['H','W'].includes(st(e,d))).map(e=>[(e.pod==b%4?0:2)+(st(e,d)=='H'?0:1),e]).sort((x,y)=>x[0]-y[0]).slice(0,2).map(([,e])=>e.name+(st(e,d)=='H'?' (free that day)':' (busy elsewhere)')).join(', ')||'none available';

// Plan strategies: [preference weight, Sunday-off fairness weight]
const STR={Balanced:[1,.5],'Preference-first':[5,.1],'Fairness-first':[.3,3]};let PW=1,SW=.5;
