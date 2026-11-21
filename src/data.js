/**
 * Smart Roster Manager - sample data (pods, brands, processes, employees)
 * Classic script: shares global scope with the other files in src/.
 */
const F=['Aarav','Diya','Kabir','Meera','Rohan','Isha','Vikram','Anaya','Arjun','Sana','Dev','Tara','Nikhil','Pooja','Rahul','Zoya','Karan'],S=['Sharma','Mehta'],DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const BN=['Lumina Skin','UrbanNest','Kora Foods','PetPulse','Zenfit','Bloom Co','Velvet Wear','NutriNest','Glow Lab','Terra Home','Aqua Pure','Spice Route','Mocha Beans','Pixel Gear','Luxe Leaf','Craft Cove','Moon Candle','Swift Kicks','Herbal Hub','Cozy Linen','Brew Bros','Tiny Toes','Alpha Fit','Silk Road','Nord Bags','Sunny Pets','Vita Roots'];
const pods=[['Pod Alpha','Neha Rao'],['Pod Beta','Sameer Khan'],['Pod Gamma','Priya Nair'],['Pod Delta','Arvind Das']].map(([name,lead])=>({name,lead}));
const P=(n,cal,min=1)=>({n,cal,min,sf:'G'});
const brands=[{name:BN[0],procs:[P('CS','365'),P('ACC','NH'),P('NDR','SH')]},{name:BN[1],procs:[P('CS','365'),P('RET','NH')]},{name:BN[2],procs:[P('CS','NH'),P('ACC','SH')]},{name:BN[3],procs:[P('CS','365'),P('NDR','NH')]},{name:BN[4],procs:[P('CS','NH'),P('ACC','SH')]}];
for(let i=0;i<22;i++){const c=i%10==0?'NH':i==5?'365':'SH';brands.push({name:BN[5+i],procs:[P('CS',c),P(['ACC','NDR','RET'][i%3],c)]})}
const emps=[],add=(b,ps)=>{const i=emps.length;emps.push({id:i,name:F[i%17]+' '+S[i>16?1:0],pod:b%4,pref:[0,1,2,3,5,6,4][i%7],sh:'G',wp:-1,leaves:[],comp:[],asg:ps.map(p=>[b,p])})};
add(0,['CS']);add(0,['ACC']);add(0,['NDR']);add(1,['CS']);add(1,['CS']);add(1,['RET']);add(2,['CS']);add(2,['ACC']);add(3,['CS','NDR']);add(3,['NDR']);add(4,['CS']);add(4,['ACC']);
brands.slice(5).forEach((b,i)=>add(i+5,b.procs.map(p=>p.n)));
emps[4].leaves=['2026-12-10','2026-12-11'];emps[7].leaves=['2026-12-14'];emps[1].comp=['2026-12-12'];add(1,['CS']);add(4,['ACC']);emps[emps.length-1].asg.push([2,'ACC']);brands[1].procs[0].min=2;brands[1].procs[0].sf='M';emps[3].wp=3;emps[5].wp=2;emps[3].sh='E';
