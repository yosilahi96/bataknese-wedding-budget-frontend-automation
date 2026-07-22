import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const reportPath = join(root, 'reports', 'cucumber-report.html');
const jsonPath = join(root, 'reports', 'cucumber-report.json');

const json = JSON.parse(readFileSync(jsonPath, 'utf-8'));
const durations = {};
for (const feature of json) {
  let totalNs = 0;
  if (feature.elements) {
    for (const scenario of feature.elements) {
      if (scenario.steps) {
        for (const step of scenario.steps) {
          if (step.result && step.result.duration) totalNs += step.result.duration;
        }
      }
    }
  }
  const totalMs = totalNs / 1_000_000;
  const s = Math.floor(totalMs / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  const time = String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0')+'.'+String(Math.round(totalMs%1000)).padStart(3,'0');
  durations[feature.uri] = { name: feature.name, time: time };
}

let html = readFileSync(reportPath, 'utf-8');
const mapJson = JSON.stringify(durations);

// One-shot MutationObserver approach: detect when feature cards appear, add once
const script =
'<script>' +
'(function(){' +
'var d=' + mapJson + ';' +
'var done=false;' +
'function addDurs(){' +
'if(done)return;' +
'done=true;' +
'var els=document.querySelectorAll(\'[role="heading"]\');' +
'for(var i=0;i<els.length;i++){' +
'var h=els[i];' +
'var k=h.textContent.trim();' +
'var v=d[k];' +
'if(!v)continue;' +
'var s=document.createElement("span");' +
's.style.cssText="display:block;font-size:0.85em;color:#4a5568;font-weight:500;margin:-2px 0 4px 0;padding-left:16px;";' +
's.textContent=v.name+" | "+v.time;' +
'h.parentElement.insertBefore(s,h.nextSibling);' +
'}' +
'}' +
'var ob=new MutationObserver(function(){addDurs();});' +
'ob.observe(document.getElementById("content")||document.body,{childList:true,subtree:true});' +
'setTimeout(function(){ob.disconnect();addDurs();},3000);' +
'})();' +
'</script>';

html = html.replace('</body>', script + '\n</body>');
writeFileSync(reportPath, html);
console.log('OK');
