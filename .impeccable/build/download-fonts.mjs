import { writeFile, mkdir } from 'node:fs/promises';
await mkdir('public/fonts', {recursive:true});
const entries = [400,500,600,700].map(weight=>({family:'ibm-plex-sans',weight})).concat([{family:'ibm-plex-mono',weight:500}]);
await Promise.all(entries.map(async ({family,weight})=>{const response=await fetch('https://cdn.jsdelivr.net/fontsource/fonts/'+family+'@latest/latin-'+weight+'-normal.woff2'); if(!response.ok)throw new Error('Font request: '+response.status);const data=Buffer.from(await response.arrayBuffer());if(data.subarray(0,4).toString()!=='wOF2')throw new Error('Invalid font');await writeFile('public/fonts/'+family+'-'+weight+'.woff2',data);console.log(family+' '+weight+': '+data.length+' bytes');}));
const license=await fetch('https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt');if(!license.ok)throw new Error('Font license download failed');await writeFile('public/fonts/OFL.txt',await license.text());
