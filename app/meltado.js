// Public menu observations are a small selection, not a complete or live menu.
// Quantities, costs, orders, staff, payments, suppliers and every operational metric are fictional.
export const menuSource='https://www.zomato.com/ncr/meltado-1-karkardooma-new-delhi/order';
export const menu=[
 {name:'Classic Cold Coffee',category:'Beverages',price:120,units:31,cost:46},
 {name:'Hazelnut Cold Coffee',category:'Beverages',price:150,units:22,cost:57},
 {name:'Javachip Cold Coffee',category:'Beverages',price:190,units:18,cost:76},
 {name:'Iced Latte',category:'Beverages',price:130,units:14,cost:51},
 {name:'Watermelon Mint Mojito',category:'Beverages',price:160,units:12,cost:58},
 {name:'Cheesy Loaded Nachos',category:'Snacks',price:170,units:17,cost:73},
 {name:'Cheesy Mozzarella Sticks',category:'Snacks',price:180,units:15,cost:87},
 {name:'Falafel and Hummus Wrap',category:'Snacks',price:220,units:12,cost:94},
 {name:'Cheese and Corn Panini Sandwich',category:'Sandwiches',price:220,units:16,cost:91},
 {name:'Spinach Mushroom Panini Sandwich',category:'Sandwiches',price:200,units:12,cost:85},
 {name:'Belgian Chocolate Slice',category:'Desserts',price:140,units:20,cost:61},
 {name:'Blueberry Cheesecake Slice',category:'Desserts',price:180,units:13,cost:83},
];
const today=menu.reduce((n,i)=>n+i.price*i.units,0);
const cashExpected=Math.round(today*.20),upiExpected=Math.round(today*.60),cardExpected=today-cashExpected-upiExpected;
export const meltadoSeed={
 schema:'meltado-v1',shop:'Meltado',owner:'Owner',date:'18 Nov 2026',location:'Kiran Vihar, Karkardooma, East Delhi',
 sales:{today,previous:Math.round(today*.91),cashExpected,cashCounted:cashExpected-750,upiExpected,upiReceived:upiExpected-1600,cardExpected},
 menu,orders:112,weekly:[{day:'Thu',sales:19240},{day:'Fri',sales:22480},{day:'Sat',sales:29870},{day:'Sun',sales:27820},{day:'Mon',sales:17610},{day:'Tue',sales:Math.round(today*.91)},{day:'Wed',sales:today}],
 inventory:[{name:'Milk (litres)',stock:8,daily:5,supplier:'Demo dairy supplier',pack:5,cost:65,unit:'L'},{name:'Coffee beans (kg)',stock:4,daily:1.5,supplier:'Demo coffee supplier',pack:2,cost:950,unit:'kg'},{name:'Cheese (kg)',stock:7,daily:1.4,supplier:'Demo dairy supplier',pack:2,cost:480,unit:'kg'}],
 receivables:[{name:'Demo office order A',amount:4800,days:12},{name:'Demo event order B',amount:3200,days:4}],
 staff:[{name:'Team member A',role:'Barista',sales:null,shifts:1},{name:'Team member B',role:'Kitchen',sales:null,shifts:1},{name:'Team member C',role:'Counter',sales:null,shifts:1}],
 expenses:{labour:4500,rentAllocation:2200,utilities:900,other:650},
 sources:[{label:'Zomato: Karkardooma online ordering menu',url:menuSource},{label:'District: Karkardooma listing',url:'https://www.district.in/dining/ncr/meltado-1-karkardooma-new-delhi'}]
};
export function cafeMetrics(data){const revenue=data.menu.reduce((n,i)=>n+i.price*i.units,0);const ingredientCost=data.menu.reduce((n,i)=>n+i.cost*i.units,0);const operatingCost=Object.values(data.expenses).reduce((a,b)=>a+b,0);const categories={};for(const i of data.menu)categories[i.category]=(categories[i.category]||0)+i.price*i.units;return {revenue,ingredientCost,contribution:revenue-ingredientCost,operatingCost,illustrativeSurplus:revenue-ingredientCost-operatingCost,categories,units:data.menu.reduce((n,i)=>n+i.units,0),aov:data.orders?revenue/data.orders:0};}
