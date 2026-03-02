const platformSummary={google:{totalVisits:9,totalClicks:3,totalSubscribers:1,totalUnsubscribers:1,conversionRate:33.33,clickThroughRate:33.33,totalSpend:0},meta:{totalVisits:0,totalClicks:0,totalSubscribers:0,totalUnsubscribers:0,conversionRate:0,clickThroughRate:0,totalSpend:0}};
const rawChartByPlatform={
 google:{visits:[0,9],clicks:[0,3],subscribers:[0,1],unsubscribers:[0,1]},
 meta:{visits:[0,0],clicks:[0,0],subscribers:[0,0],unsubscribers:[0,0]}
};
const projectChartSeries={visits:[0,9],clicks:[0,3],subscribers:[0,1],unsubscribers:[0,1]};
const spendSeriesByPlatform={google:[0,0],meta:[0,0]};
const xAxisDates=['Jan','Feb'];
function resolveMetricSeries(platformData, metric){
 const candidates = [metric]; if(metric==='visits') candidates.push('visitors'); if(metric==='visitors') candidates.push('visits');
 for(const k of candidates){ if(Array.isArray(platformData?.[k])) return platformData[k]; }
 return [];
}
function getGlobalChartData(selectedChartMetric, selectedChartPlatform){
 const platformOnlyMetrics=new Set(['totalSpend']);
 const isPlatformOnly=platformOnlyMetrics.has(selectedChartMetric);
 const rows=xAxisDates.map((name,idx)=>{
   const entry={name};
   if(isPlatformOnly){
     if(selectedChartPlatform==='all'){
       entry.google=Number(spendSeriesByPlatform.google[idx]||0);
       entry.meta=Number(spendSeriesByPlatform.meta[idx]||0);
     } else {entry[selectedChartPlatform]=Number(spendSeriesByPlatform[selectedChartPlatform][idx]||0);}   
   } else if(selectedChartMetric==='conversionRate'){
     if(selectedChartPlatform==='all'){
       const c=Number(projectChartSeries.clicks[idx]||0);
       const s=Number(projectChartSeries.subscribers[idx]||0);
       entry.all_projects=c>0?Number(((s/c)*100).toFixed(2)):0;
     } else {
       const clicks=Number(rawChartByPlatform[selectedChartPlatform]?.clicks?.[idx]||0);
       const subscribers=Number(rawChartByPlatform[selectedChartPlatform]?.subscribers?.[idx]||0);
       entry[selectedChartPlatform]=clicks>0?Number(((subscribers/clicks)*100).toFixed(2)):0;
     }
   } else {
     if(selectedChartPlatform==='all'){
       const projectKey= selectedChartMetric==='visits'?'visits':selectedChartMetric;
       entry.all_projects=Number(projectChartSeries[projectKey]?.[idx]||0);
     } else {
       const series=resolveMetricSeries(rawChartByPlatform[selectedChartPlatform], selectedChartMetric);
       entry[selectedChartPlatform]=Number(series?.[idx]||0);
     }
   }
   return entry;
 });
 const hasAnyValue=rows.some(row=>Object.entries(row).some(([k,v])=>k!=='name'&&Number(v)>0));
 if(!hasAnyValue && platformSummary && rows.length){
   let summaryMetricKey;
   if(selectedChartMetric==='visits') summaryMetricKey='totalVisits';
   else if(selectedChartMetric==='clicks') summaryMetricKey='totalClicks';
   else if(selectedChartMetric==='subscribers') summaryMetricKey='totalSubscribers';
   else if(selectedChartMetric==='unsubscribers') summaryMetricKey='totalUnsubscribers';
   else if(selectedChartMetric==='conversionRate') summaryMetricKey='conversionRate';
   if(summaryMetricKey){
     const last=rows[rows.length-1];
     if(selectedChartPlatform==='all'){
       const isPlatformOnly = platformOnlyMetrics.has(selectedChartMetric);
       if(isPlatformOnly){
         Object.entries(platformSummary).forEach(([pf,summary])=>{last[String(pf).toLowerCase()]=Number(summary?.[summaryMetricKey]||0);});
       } else {
         const total=Object.values(platformSummary).reduce((sum,summary)=>sum+Number(summary?.[summaryMetricKey]||0),0);
         last.all_projects=total;
       }
     } else {
       last[selectedChartPlatform]=Number(platformSummary?.[selectedChartPlatform]?.[summaryMetricKey]||0);
     }
   }
 }
 return rows;
}
console.log('meta visits',getGlobalChartData('visits','meta'));
console.log('meta clicks',getGlobalChartData('clicks','meta'));
console.log('meta subscribers',getGlobalChartData('subscribers','meta'));
console.log('meta conversionRate',getGlobalChartData('conversionRate','meta'));
console.log('google visits',getGlobalChartData('visits','google'));
