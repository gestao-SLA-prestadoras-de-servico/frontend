import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('../../tmp/flowsla-review/node_modules/playwright');
const AxeBuilder = require('../../tmp/flowsla-review/node_modules/@axe-core/playwright').default;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', msg => { if(msg.type()==='error') errors.push(msg.text()); });
const out = '.impeccable/review/';
const report = { checks: [], widths: [], axe: [], errors };
try {
  await page.goto('http://127.0.0.1:4300/', {waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const response = await page.request.get('http://127.0.0.1:4300/');
  const serverHtml = await response.text();
  assert(serverHtml.includes('ngh='), 'Prerender hydration markers absent');
  assert(serverHtml.includes('ng-state'), 'Hydration state absent');
  report.checks.push('Prerendered HTML and hydration state served');
  for(const width of [320,390,600,768,820,821,1024,1280,1440,1536]){
    await page.setViewportSize({width,height:1000});
    const measures=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,fonts:document.fonts.status}));
    report.widths.push(measures);
    assert(measures.scrollWidth<=width, 'Horizontal overflow at '+width);
  }
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['user-1536',1536,900]]){
    await page.setViewportSize({width,height});
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:out+name+'.png',fullPage:true});
    if(name==='mobile')await page.screenshot({path:out+'mobile-viewport.png'});
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    report.axe.push({viewport:name,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  }
  await page.setViewportSize({width:1440,height:1000});
  const triggers = page.getByRole('button',{name:'Acessar o sistema',exact:true});
  for(let i=0;i<await triggers.count();i++){
    const trigger=triggers.nth(i);
    await trigger.click();
    assert(await page.locator('dialog').evaluate(d=>d.open));
    assert(await page.getByRole('button',{name:'Entendi',exact:true}).evaluate(b=>b===document.activeElement));
    await page.keyboard.press('Escape');
    assert(!await page.locator('dialog').evaluate(d=>d.open));
    assert(await trigger.evaluate(b=>b===document.activeElement));
  }
  report.checks.push('All 3 access buttons, Escape and focus restoration passed');
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
  await page.keyboard.press('Escape');
  assert(await page.getByRole('button',{name:'Abrir menu',exact:true}).evaluate(b=>b===document.activeElement));
  await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
  await page.getByRole('navigation').getByRole('button',{name:'Acessar o sistema',exact:true}).click();
  await page.keyboard.press('Tab');
  report.tabCycle = await page.evaluate(()=>({inside:!!document.activeElement.closest('dialog'),active:document.activeElement.tagName}));
  assert(report.tabCycle.inside);
  await page.keyboard.press('Shift+Tab');
  assert(await page.getByRole('button',{name:'Entendi',exact:true}).evaluate(b=>b===document.activeElement));
  report.checks.push('Dialog focus loop in both Tab directions passed');
  await page.screenshot({path:out+'mobile-dialog.png'});
  await page.keyboard.press('Escape');
  assert(await page.getByRole('navigation').getByRole('button',{name:'Acessar o sistema',exact:true}).evaluate(b=>b===document.activeElement));
  for(const [name,id] of [['Benefícios','beneficios'],['Como funciona','como-funciona'],['Plataforma','plataforma'],['FAQ','faq']]){
    if(await page.getByRole('button',{name:'Abrir menu',exact:true}).isVisible())await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
    await page.getByRole('navigation').getByRole('link',{name,exact:true}).click();
    assert.equal(new URL(page.url()).hash,'#'+id);
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    assert.equal(await page.evaluate(()=>document.activeElement.id),id);
  }
  report.checks.push('Mobile menu, Escape, all navigation anchors and target focus passed');
  const summaries=page.locator('summary');
  for(let i=0;i<await summaries.count();i++){
    await summaries.nth(i).press('Enter');
    assert(await summaries.nth(i).evaluate(s=>s.parentElement.open));
    await summaries.nth(i).press('Space');
    assert(!await summaries.nth(i).evaluate(s=>s.parentElement.open));
  }
  report.checks.push('All 6 FAQ disclosures with Enter and Space passed');
  await page.locator('.hero-actions button').click();
  await page.getByRole('button',{name:'Entendi',exact:true}).click();
  assert(await page.locator('.hero-actions button').evaluate(b=>b===document.activeElement));
  report.checks.push('Entendi closes and restores focus');
  const motion=await page.locator('app-product-preview').evaluate(el=>getComputedStyle(el).animationName);
  assert.equal(motion,'none');
  report.checks.push('Reduced motion disables entrance animation');
  report.complete=true;
} catch(error) { report.failure=error.stack; process.exitCode=1; }
finally { await writeFile(out+'verification.json',JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2)); await browser.close(); }
