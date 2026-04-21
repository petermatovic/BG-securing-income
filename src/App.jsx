import { useState, useMemo, useEffect } from "react";

/* Rate tables */
var DIS_R={18:2.82,19:2.94,20:2.94,21:3.06,22:3.06,23:3.18,24:3.18,25:3.3,26:3.3,27:3.43,28:3.55,29:3.67,30:3.79,31:3.92,32:4.04,33:4.16,34:4.41,35:4.53,36:4.77,37:5.02,38:5.26,39:5.51,40:5.75,41:6,42:6.24,43:6.61,44:6.98,45:7.34,46:7.71,47:8.2,48:8.57,49:9.18,50:9.67,51:10.28,52:10.89,53:11.51,54:12.12,55:12.85,56:13.71,57:14.57,58:15.67,59:16.65,60:18.12,61:18.6,62:19.34,63:20.2,64:21.42,65:23.75};
var CI_R={18:4.43,19:4.57,20:4.71,21:4.85,22:4.99,23:5.14,24:5.3,25:5.47,26:5.64,27:5.84,28:6.03,29:6.24,30:6.46,31:6.7,32:6.95,33:7.22,34:7.5,35:7.81,36:8.14,37:8.51,38:8.89,39:9.3,40:9.74,41:10.21,42:10.71,43:11.24,44:11.8,45:12.39,46:13.01,47:13.66,48:14.35,49:15.07,50:15.85,51:16.65,52:17.52,53:18.45,54:19.5,55:20.69,56:21.59,57:22.77,58:24.05,59:25.57,60:27.37};
var CA_R={18:3.84,19:3.97,20:4.09,21:4.21,22:4.33,23:4.46,24:4.6,25:4.74,26:4.9,27:5.06,28:5.23,29:5.4,30:5.59,31:5.79,32:6.01,33:6.24,34:6.49,35:6.74,36:7.04,37:7.34,38:7.67,39:8.03,40:8.41,41:8.81,42:9.23,43:9.68,44:10.17,45:10.67,46:11.2,47:11.76,48:12.34,49:12.96,50:13.62,51:14.31,52:15.06,53:15.85,54:16.73,55:17.74,56:18.53,57:19.54,58:20.59,59:21.89,60:23.43};
var IN_R={18:4.55,19:4.61,20:4.70,21:4.77,22:4.87,23:4.98,24:5.09,25:5.21,26:5.34,27:5.47,28:5.63,29:5.79,30:5.95,31:6.12,32:6.30,33:6.50,34:6.72,35:6.95,36:7.18,37:7.45,38:7.74,39:8.04,40:8.35,41:8.65,42:8.96,43:9.25,44:9.55,45:9.87,46:10.24,47:10.66,48:11.11,49:11.60,50:12.15,51:12.78,52:13.44,53:14.15,54:14.90,55:15.84,56:16.71,57:17.80,58:19.01,59:20.51,60:22.31};
var DD={15:{5:13.26,10:13.26,15:13.26,20:13.26,25:13.26,30:13.26},20:{5:15.3,10:15.3,15:15.3,20:15.3,25:15.3,30:15.3},25:{5:15.3,10:15.3,15:15.3,20:15.3,25:15.3,30:15.3},30:{5:15.3,10:15.3,15:15.3,20:16.32,25:17.34,30:19.38},35:{5:18.36,10:18.36,15:20.4,20:22.44,25:24.48,30:27.54},40:{5:25.5,10:26.52,15:29.58,20:31.62,25:35.7,30:40.8},45:{5:35.7,10:39.78,15:44.88,20:48.96,25:54.06},50:{5:55.08,10:61.2,15:67.32,20:73.44},55:{5:79.56,10:90.78,15:100.98},60:{5:122.4,10:139.74}};
var DOT={15:{5:10.2,10:10.2,15:10.2,20:10.2,25:10.2,30:10.2},20:{5:12.24,10:12.24,15:12.24,20:12.24,25:12.24,30:12.24},25:{5:12.24,10:12.24,15:12.24,20:12.24,25:12.24,30:13.26},30:{5:13.26,10:13.26,15:13.26,20:13.26,25:14.28,30:15.3},35:{5:15.3,10:15.3,15:16.32,20:17.34,25:19.38,30:20.4},40:{5:20.4,10:20.4,15:22.44,20:24.48,25:26.52,30:28.56},45:{5:27.54,10:29.58,15:32.64,20:34.68,25:37.74,30:40.8},50:{5:38.76,10:41.82,15:45.9,20:48.96,25:53.04,30:58.14},55:{5:53.04,10:58.14,15:64.26,20:69.36,25:74.46},60:{5:76.5,10:84.66,15:91.8,20:98.94}};
var RCT={1:{acc:1.5,pi:1.5,frac:16},2:{acc:2.5,pi:2.5,frac:20},3:{acc:4,pi:4,frac:27}};
var WRT={1:0.043799,2:0.0525,3:0.07};
var KCH5={18:1.4,25:1.4,26:2.35,30:2.35,31:4.63,35:4.63,36:7.24,40:7.24,41:12.31,45:12.31,46:20.45,50:20.45,51:31.79,55:31.79,56:46.34,60:46.34};
var KCH10={18:1.85,25:1.85,26:3.19,30:3.19,31:6.23,35:6.23,36:9.57,40:9.57,41:16,45:16,46:25.47,50:25.47,51:38.07,55:38.07};

/* CARE plan presets: [DIS, PD, CI, Cancer, InSitu, telemedicine] */
var CARE_PLANS={
  "Bronze plan":[10000,10000,10000,10000,5000,true],
  "Silver plan":[25000,25000,25000,25000,12500,true],
  "Gold plan":[50000,50000,50000,50000,25000,true],
  "Platinum plan":[100000,100000,100000,100000,50000,true],
  "not included":[0,0,0,0,0,false]
};

/* Pension replacement brackets from Excel */
var PEN_MIN_BR=516.8138335;var PEN_MAX_BR=1738.392396;
var PEN_MIN_REP=238.7733085;var PEN_MAX_REP=1022.5837624;var PEN_COEF=0.462;

function lr(t,a,d){var as=Object.keys(t).map(Number).sort(function(x,y){return x-y;});var ca=as[0];for(var i=0;i<as.length;i++){if(as[i]<=a)ca=as[i];}if(!t[ca])return 0;var avd=Object.keys(t[ca]).map(Number).sort(function(x,y){return x-y;});var cd=avd[0];for(var j=0;j<avd.length;j++){if(avd[j]<=d)cd=avd[j];}return t[ca][cd]||0;}
function fmt(n,d){if(d===undefined)d=0;if(n===null||n===undefined||isNaN(n)||!isFinite(n))return"\u2014";return new Intl.NumberFormat("sk-SK",{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);}
function safe(x){return(x!==null&&x!==undefined&&isFinite(x))?x:0;}

/* Clamped lookup for rate tables (DIS_R, CI_R, CA_R, IN_R) – clamps age to valid range */
function rateAt(table,age){var keys=Object.keys(table).map(Number).sort(function(a,b){return a-b;});var clamped=Math.max(keys[0],Math.min(age,keys[keys.length-1]));return table[clamped]||0;}

/* Interval lookup for KCH tables – keys are lower bounds of age ranges */
function kchRate(table,age){var keys=Object.keys(table).map(Number).sort(function(a,b){return a-b;});var result=table[keys[0]];for(var i=0;i<keys.length;i++){if(keys[i]<=age)result=table[keys[i]];}return result||0;}

/* PV of annuity: how much capital needed to pay 'pmt' monthly for 'n' months at rate 'r'/month */
function pvAnnuity(r,n){r=Number(r)||0;n=Number(n)||0;if(n<=0)return 0;if(r===0)return n;return(1-Math.pow(1+r,-n))/r;}

/* Monthly savings needed to reach target FV (monthly compounding, consistent with fvAnnuity) */
function monthlySavings(target,annualRate,years){
  target=Number(target)||0;annualRate=Number(annualRate)||0;years=Number(years)||0;
  if(target<=0||years<=0)return 0;
  var mr=annualRate/12;var n=years*12;
  if(mr===0)return target/n;
  var factor=(Math.pow(1+mr,n)-1)/mr;
  if(!isFinite(factor)||factor<=0)return 0;
  return target/factor;
}

/* FV of annuity */
function fvAnnuity(pmt,r,n){pmt=Number(pmt)||0;r=Number(r)||0;n=Number(n)||0;if(n<=0)return 0;if(r===0)return pmt*n;var x=pmt*((Math.pow(1+r,n)-1)/r);return isFinite(x)?x:0;}

/* FV of annuity – monthly compounding, consistent with monthlySavings() */
function fvDaily(pmt,annualRate,years){
  pmt=Number(pmt)||0;annualRate=Number(annualRate)||0;years=Number(years)||0;
  if(pmt===0||years<=0)return 0;
  if(annualRate===0)return pmt*years*12;
  return fvAnnuity(pmt,annualRate/12,years*12);
}

/* UL cash value table per 300€/year (from Hárok1 projection) - scales proportionally for different UL amounts */
var UL_TABLE={1:0,2:0,3:237.69,4:466.3,5:774.72,6:1169.85,7:1659.13,8:2250.63,9:2952.6,10:3430.98,11:3970.98,12:4542.62,13:5147.76,14:5788.35,15:6466.49,16:7184.36,17:7944.29,18:8748.76,19:9600.37,20:10501.87,21:11422.61,22:12397.31,23:13429.12,24:14521.38,25:15677.66,26:16901.68,27:18197.43,28:19569.11,29:21021.17,30:22558.31,31:24185.52,32:25908.08,33:27731.58,34:29661.93,35:31705.39,36:33868.59,37:36158.55,38:38582.69,39:41148.88,40:43865.44};
function ulLookup(years,yearlyPremium){
  var baseYearly=300;/* table is for 300€/year */
  var yr=Math.round(Math.max(1,Math.min(years,40)));
  var base=UL_TABLE[yr]||0;
  return base*(yearlyPremium/baseYearly);
}

function penRepl(brutto){
  if(brutto<=PEN_MIN_BR)return PEN_MIN_REP;
  if(brutto>=PEN_MAX_BR)return PEN_MAX_REP;
  return brutto*PEN_COEF;
}

function calcAll(br,ne,age,dur,iy,py,pyr,st,loan,ulOn,ulMonthly,cgOn,cgDD,cgInsured,carePlan,cgDur, embDO){
  br=Number(br)||0;ne=Number(ne)||0;dur=Math.max(Number(dur)||1,1);
  iy=Number(iy)||0;py=Number(py)||0;pyr=Number(pyr)||0;
  var pr=penRepl(br);
  /* gap = shortfall you need to cover, repl = what social insurance gives */
  var repl50=pr*0.85,repl70=pr*1.05,repl90=pr*1.15,replPen=pr;
  var gap50=ne-repl50,gap70=ne-repl70,gap90=ne-repl90,gapPen=ne-replPen;
  var pct50=ne>0?repl50/ne:0,pct70=ne>0?repl70/ne:0,pct90=ne>0?repl90/ne:0,pctPen=ne>0?replPen/ne:0;
  var pvF=pvAnnuity(py/12,pyr*12);
  var pvFd=pvAnnuity(py/12,dur*12);
  var needed=safe(pvF*gapPen);

  /* UL savings from projection table */
  var ulYearly=ulOn?Math.max(ulMonthly*12,300):0;
  var ulSavings=ulOn?ulLookup(dur,ulYearly):0;

  /* Embedded death */
  var embDeath=0;
  if(ulOn){
    if(st==="SINGLE")embDeath=2500;
    else if(age<=30)embDeath=ulYearly*30;
    else if(age<=35)embDeath=ulYearly*20;
    else if(age<=45)embDeath=ulYearly*15;
    else if(age<=55)embDeath=ulYearly*10;
    else embDeath=ulYearly*6;
  }
  if(embDO!==""&&embDO!=null) embDeath=Number(embDO);

  /* Monthly PI savings */
  var piTarget=safe(needed-ulSavings);
  var monthlyPI=monthlySavings(piTarget,iy,dur);

  /* CARE sums */
  var cp=CARE_PLANS[carePlan]||CARE_PLANS["not included"];
  var careDis=cp[0],carePD=cp[1],careCI=cp[2];

  /* Suggested sums (use pvFd = duration-based PV, matching Excel M11) */
  var sugCGDeath;
  if(cgDD){sugCGDeath=safe(pvFd*gap70*1.5+loan-careDis-carePD);}
  else if(st==="SINGLE"){sugCGDeath=4000;}
  else{sugCGDeath=ne*12*5+loan;}

  var sugULDeath;
  if(st==="SINGLE")sugULDeath=4000;
  else sugULDeath=safe(ne*12*5+loan-embDeath-(cgOn?cgInsured:0));

  /* Perm dis: when CG has Death+Disability, simply netto*10; otherwise complex formula */
  var sugPermDis;
  if(cgDD){sugPermDis=ne*10;}
  else{sugPermDis=safe(pvFd*gap70*1.5+loan-carePD-careDis);if(sugPermDis<0)sugPermDis=0;}

  var sugCI=careCI>0?0:sugPermDis;
  if(sugCI<0)sugCI=0;

  return{
    d50:{gap:safe(gap50),repl:safe(repl50),pct:safe(pct50)},
    d70:{gap:safe(gap70),repl:safe(repl70),pct:safe(pct70)},
    d90:{gap:safe(gap90),repl:safe(repl90),pct:safe(pct90)},
    pen:{gap:safe(gapPen),repl:safe(replPen),pct:safe(pctPen)},
    needed:needed,ulSavings:ulSavings,embDeath:embDeath,
    monthlyPI:safe(monthlyPI),piTarget:safe(piTarget),
    sugCGDeath:Math.max(0,Math.round(sugCGDeath)),
    sugULDeath:Math.max(0,Math.round(sugULDeath)),
    sugPermDis:Math.round(sugPermDis),sugCI:Math.round(sugCI),
    ulYearly:ulYearly,pvF:pvF
  };
}

/* i18n */
var I={
  title:{sk:"Kalkula\u010dka zabezpe\u010denia pr\u00edjmu",en:"Income Protection Calculator",bg:"\u041a\u0430\u043b\u043a\u0443\u043b\u0430\u0442\u043e\u0440 \u0437\u0430 \u0437\u0430\u0449\u0438\u0442\u0430 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434\u0430"},
  inputs:{sk:"Vstupn\u00e9 \u00fadaje",en:"Input Data",bg:"\u0412\u0445\u043e\u0434\u043d\u0438 \u0434\u0430\u043d\u043d\u0438"},
  brutto:{sk:"Pr\u00edjem brutto",en:"Gross income",bg:"\u0411\u0440\u0443\u0442\u043e \u0434\u043e\u0445\u043e\u0434"},netto:{sk:"Pr\u00edjem netto",en:"Net income",bg:"\u041d\u0435\u0442\u043e \u0434\u043e\u0445\u043e\u0434"},
  age:{sk:"Vek",en:"Age",bg:"\u0412\u044a\u0437\u0440\u0430\u0441\u0442"},
  invYield:{sk:"Predpokladan\u00fd v\u00fdnos invest\u00edcie",en:"Expected investment yield",bg:"\u041e\u0447\u0430\u043a\u0432\u0430\u043d \u0434\u043e\u0445\u043e\u0434 \u043e\u0442 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044f"},
  penYield:{sk:"Predpokladan\u00fd v\u00fdnos penzie",en:"Expected pension yield",bg:"\u041e\u0447\u0430\u043a\u0432\u0430\u043d \u043f\u0435\u043d\u0441\u0438\u043e\u043d\u0435\u043d \u0434\u043e\u0445\u043e\u0434"},
  penYears:{sk:"V\u00fdplata d\u00f4chodku v rokoch",en:"Pension payment in years",bg:"\u041f\u0435\u043d\u0441\u0438\u043e\u043d\u043d\u043e \u043f\u043b\u0430\u0449\u0430\u043d\u0435 \u0432 \u0433\u043e\u0434\u0438\u043d\u0438"},
  status:{sk:"Status",en:"Status",bg:"\u0421\u0442\u0430\u0442\u0443\u0441"},single:{sk:"Jednotlivec",en:"Single",bg:"\u0421\u0430\u043c"},couple:{sk:"P\u00e1r",en:"Couple",bg:"\u0414\u0432\u043e\u0439\u043a\u0430"},
  riskClass:{sk:"Rizikov\u00e1 trieda",en:"Risk class",bg:"\u0420\u0438\u0441\u043a\u043e\u0432 \u043a\u043b\u0430\u0441"},
  low:{sk:"N\u00edzke",en:"Low",bg:"\u041d\u0438\u0441\u044a\u043a"},medium:{sk:"Stredn\u00e9",en:"Medium",bg:"\u0421\u0440\u0435\u0434\u0435\u043d"},high:{sk:"Vysok\u00e9",en:"High",bg:"\u0412\u0438\u0441\u043e\u043a"},
  loan:{sk:"V\u00fd\u0161ka \u00faveru",en:"Loan amount",bg:"\u0420\u0430\u0437\u043c\u0435\u0440 \u043d\u0430 \u043a\u0440\u0435\u0434\u0438\u0442\u0430"},dur:{sk:"Doba poistenia",en:"Insurance duration",bg:"\u041f\u0435\u0440\u0438\u043e\u0434 \u043d\u0430 \u0437\u0430\u0441\u0442\u0440\u0430\u0445\u043e\u0432\u043a\u0430"},
  tabModel:{sk:"Model poistenia",en:"Insurance Model",bg:"\u041c\u043e\u0434\u0435\u043b \u043d\u0430 \u0437\u0430\u0441\u0442\u0440\u0430\u0445\u043e\u0432\u043a\u0430"},
  tabOverview:{sk:"Anal\u00fdza pr\u00edjmu",en:"Income Analysis",bg:"\u0410\u043d\u0430\u043b\u0438\u0437 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434\u0430"},
  tabInvest:{sk:"Invest\u00edcia",en:"Investment",bg:"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044f"},
  mustHave:{sk:"Must have",en:"Must have",bg:"Must have"},niceHave:{sk:"Nice to have",en:"Nice to have",bg:"Nice to have"},
  investPart:{sk:"Investi\u010dn\u00e1 \u010das\u0165 (PI)",en:"Investment part (PI)",bg:"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u043e\u043d\u043d\u0430 \u0447\u0430\u0441\u0442 (PI)"},
  addPI:{sk:"Doplni\u0165 do PI",en:"Add to PI",bg:"\u0414\u043e\u0431\u0430\u0432\u0438 PI"},
  neededSav:{sk:"Potrebn\u00e9 \u00faspory",en:"Needed savings",bg:"\u041d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u0438 \u0441\u043f\u0435\u0441\u0442\u044f\u0432\u0430\u043d\u0438\u044f"},
  realSum:{sk:"Re\u00e1lna suma",en:"Real sum",bg:"\u0420\u0435\u0430\u043b\u043d\u0430 \u0441\u0443\u043c\u0430"},
  pension:{sk:"D\u00f4chodok",en:"Pension",bg:"\u041f\u0435\u043d\u0441\u0438\u044f"},month:{sk:"mesiac",en:"month",bg:"\u043c\u0435\u0441\u0435\u0446"},
  activate:{sk:"Aktivova\u0165",en:"Activate",bg:"\u0410\u043a\u0442\u0438\u0432\u0438\u0440\u0430\u043d\u0435"},
  deathOnly:{sk:"Smr\u0165",en:"Death",bg:"\u0421\u043c\u044a\u0440\u0442"},deathDis:{sk:"Smr\u0165 + Invalidita",en:"Death + Disability",bg:"\u0421\u043c\u044a\u0440\u0442 + \u0418\u043d\u0432\u0430\u043b\u0438\u0434\u043d\u043e\u0441\u0442"},
  death:{sk:"Smr\u0165",en:"Death",bg:"\u0421\u043c\u044a\u0440\u0442"},deathAndDis:{sk:"Smr\u0165 + Invalidita",en:"Death + Disability",bg:"\u0421\u043c\u044a\u0440\u0442 + \u0418\u043d\u0432\u0430\u043b\u0438\u0434\u043d\u043e\u0441\u0442"},
  withUL:{sk:"S investi\u010dnou zlo\u017ekou (UL)",en:"With investment (UL)",bg:"\u0421 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u043e\u043d\u043d\u0430 \u0447\u0430\u0441\u0442 (UL)"},
  investUL:{sk:"Investi\u010dn\u00e1 zlo\u017eka UL",en:"Investment part UL",bg:"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u043e\u043d\u043d\u0430 \u0447\u0430\u0441\u0442 UL"},
  savML:{sk:"\u00daspory v Metlife",en:"Savings in Metlife",bg:"\u0421\u043f\u0435\u0441\u0442\u044f\u0432\u0430\u043d\u0438\u044f \u0432 Metlife"},
  embDeath:{sk:"Vnoren\u00e1 smr\u0165",en:"Embedded death",bg:"\u0412\u0433\u0440\u0430\u0434\u0435\u043d\u0430 \u0441\u043c\u044a\u0440\u0442"},
  carePlan:{sk:"CARE bal\u00edk",en:"CARE plan",bg:"CARE \u043f\u043b\u0430\u043d"},
  disTEMC:{sk:"Invalidita chorobou alebo \u00farazom min 51%",en:"Disability due to illness or accident min 51%",bg:"\u0418\u043d\u0432\u0430\u043b\u0438\u0434\u043d\u043e\u0441\u0442 \u043e\u0442 \u0437\u0430\u0431\u043e\u043b\u044f\u0432\u0430\u043d\u0435 \u0438\u043b\u0438 \u0437\u043b\u043e\u043f\u043e\u043b\u0443\u043a\u0430 min 51%"},
  permDis:{sk:"Trval\u00e1 invalidita \u00farazom",en:"Permanent disability from accident",bg:"\u0422\u0440\u0430\u0439\u043d\u0430 \u0438\u043d\u0432\u0430\u043b\u0438\u0434\u043d\u043e\u0441\u0442 \u043e\u0442 \u0437\u043b\u043e\u043f\u043e\u043b\u0443\u043a\u0430"},
  ci40:{sk:"40 kritick\u00fdch chor\u00f4b",en:"40 critical illnesses",bg:"40 \u0422\u0435\u0436\u043a\u0438 \u0437\u0430\u0431\u043e\u043b\u044f\u0432\u0430\u043d\u0438\u044f"},
  cancer:{sk:"Rakovina",en:"Cancer",bg:"\u0417\u043b\u043e\u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043d\u0438 \u043d\u043e\u0432\u043e\u043e\u0431\u0440\u0430\u0437\u0443\u0432\u0430\u043d\u0438\u044f \u2013 \u0440\u0430\u043a"},insitu:{sk:"Karcin\u00f3m in situ",en:"Carcinoma in situ",bg:"\u0422\u0435\u0436\u043a\u043e \u0417\u0430\u0431\u043e\u043b\u044f\u0432\u0430\u043d\u0435 - \u041a\u0430\u0440\u0446\u0438\u043d\u043e\u043c \u0438\u043d \u0441\u0438\u0442\u0443"},
  teleCare:{sk:"Telemedic\u00edna",en:"Telemedicine",bg:"\u0422\u0435\u043b\u0435\u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430 / \u0412\u0442\u043e\u0440\u043e \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e \u043c\u043d\u0435\u043d\u0438\u0435 /"},
  accDeath:{sk:"\u00darazov\u00e1 smr\u0165",en:"Accidental death",bg:"\u0421\u043c\u044a\u0440\u0442 \u043e\u0442 \u0437\u043b\u043e\u043f\u043e\u043b\u0443\u043a\u0430"},
  permCons:{sk:"Trval\u00e9 n\u00e1sledky \u00farazu",en:"Permanent consequences of accident",bg:"\u0422\u0440\u0430\u0439\u043d\u0438 \u043f\u043e\u0441\u043b\u0435\u0434\u0438\u0446\u0438 \u043e\u0442 \u0437\u043b\u043e\u043f\u043e\u043b\u0443\u043a\u0430"},
  critIll:{sk:"Kritick\u00e9 choroby",en:"Critical illness",bg:"\u041a\u0440\u0438\u0442\u0438\u0447\u043d\u0438 \u0437\u0430\u0431\u043e\u043b\u044f\u0432\u0430\u043d\u0438\u044f"},
  hospital:{sk:"Hospital cash",en:"Hospital cash",bg:"Hospital cash"},surgical:{sk:"Surgical",en:"Surgical",bg:"Surgical"},
  fractures:{sk:"Zlomeniny a pop\u00e1leniny",en:"Fractures and burns",bg:"\u0421\u0447\u0443\u043f\u0432\u0430\u043d\u0438\u044f \u0438 \u0438\u0437\u0433\u0430\u0440\u044f\u043d\u0438\u044f"},
  telemed:{sk:"Telemedic\u00edna",en:"Telemedicine",bg:"\u0422\u0435\u043b\u0435\u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430 / \u0412\u0442\u043e\u0440\u043e \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e \u043c\u043d\u0435\u043d\u0438\u0435 /"},
  waiver:{sk:"Waiver",en:"Waiver",bg:"\u041e\u0442\u043a\u0430\u0437 \u043e\u0442 \u043f\u0440\u0435\u043c\u0438\u044f"},
  cur:{sk:"\u20ac",en:"\u20ac",bg:"\u20ac"},
  totalYearly:{sk:"Celkov\u00e9 ro\u010dn\u00e9 poistn\u00e9",en:"Total yearly premium",bg:"\u041e\u0431\u0449\u0430 \u0431\u0440\u0443\u0442\u043d\u0430 \u0433\u043e\u0434\u0438\u0448\u043d\u0430 \u043f\u0440\u0435\u043c\u0438\u044f"},
  riskPart:{sk:"Rizikov\u00e1 \u010das\u0165",en:"Risk part",bg:"\u0420\u0438\u0441\u043a\u043e\u0432\u0430 \u0447\u0430\u0441\u0442"},
  investInc:{sk:"Investi\u010dn\u00e1 \u010das\u0165 z pr\u00edjmu",en:"Investment part of income",bg:"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u043e\u043d\u043d\u0430 \u0447\u0430\u0441\u0442 \u043e\u0442 \u0434\u043e\u0445\u043e\u0434\u0430"},riskInc:{sk:"Rizikov\u00e1 \u010das\u0165 z pr\u00edjmu",en:"Risk part of income",bg:"\u0420\u0438\u0441\u043a\u043e\u0432\u0430 \u0447\u0430\u0441\u0442 \u043e\u0442 \u0434\u043e\u0445\u043e\u0434\u0430"},
  incomeLoss:{sk:"Strata pr\u00edjmu",en:"Income loss",bg:"\u0417\u0430\u0433\u0443\u0431\u0430 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434"},
  remaining:{sk:"Zost\u00e1vaj\u00faci pr\u00edjem",en:"Remaining income",bg:"\u041e\u0441\u0442\u0430\u0432\u0430\u0449 \u0434\u043e\u0445\u043e\u0434"},
  dis50:{sk:"Invalidita 50%",en:"Disability 50%",bg:"\u0418\u043d\u0432\u0430\u043b\u0438\u0434\u043d\u043e\u0441\u0442 50%"},dis70:{sk:"Invalidita 70%",en:"Disability 70%",bg:"\u0418\u043d\u0432\u0430\u043b\u0438\u0434\u043d\u043e\u0441\u0442 70%"},dis90:{sk:"Invalidita 90%",en:"Disability 90%",bg:"\u0418\u043d\u0432\u0430\u043b\u0438\u0434\u043d\u043e\u0441\u0442 90%"},
  netIncome:{sk:"Netto pr\u00edjem",en:"Net income",bg:"\u041d\u0435\u0442\u043e \u0434\u043e\u0445\u043e\u0434"},
  monthlyDep:{sk:"Mesa\u010dn\u00fd vklad",en:"Monthly deposit",bg:"\u041c\u0435\u0441\u0435\u0447\u043d\u0430 \u0432\u043d\u043e\u0441\u043a\u0430"},
  estYield:{sk:"Predpokladan\u00fd v\u00fdnos",en:"Expected yield",bg:"\u041e\u0447\u0430\u043a\u0432\u0430\u043d \u0434\u043e\u0445\u043e\u0434"},
  investDur:{sk:"Doba investovania",en:"Investment period",bg:"\u041f\u0435\u0440\u0438\u043e\u0434 \u043d\u0430 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044f"},
  totalDep:{sk:"Celkov\u00e9 vklady",en:"Total deposits",bg:"\u041e\u0431\u0449\u043e \u0432\u043d\u043e\u0441\u043a\u0438"},
  appreciation:{sk:"Zhodnotenie",en:"Appreciation",bg:"\u041f\u0435\u0447\u0430\u043b\u0431\u0430"},
  futureVal:{sk:"Bud\u00faca hodnota",en:"Future value",bg:"\u0411\u044a\u0434\u0435\u0449\u0430 \u0441\u0442\u043e\u0439\u043d\u043e\u0441\u0442"},
  yearly:{sk:"ro\u010dne",en:"yearly",bg:"\u0433\u043e\u0434\u0438\u0448\u043d\u043e"},years:{sk:"rokov",en:"years",bg:"\u0433\u043e\u0434\u0438\u043d\u0438"},
  yearlyOverview:{sk:"Ro\u010dn\u00fd preh\u013ead",en:"Yearly overview",bg:"\u0413\u043e\u0434\u0438\u0448\u0435\u043d \u043f\u0440\u0435\u0433\u043b\u0435\u0434"},
  year:{sk:"Rok",en:"Year",bg:"\u0413\u043e\u0434\u0438\u043d\u0430"},depTotal:{sk:"Vklady",en:"Deposits",bg:"\u0412\u043d\u043e\u0441\u043a\u0438"},profit:{sk:"Zisk",en:"Profit",bg:"\u041f\u0435\u0447\u0430\u043b\u0431\u0430"},
  goal:{sk:"Cie\u013e",en:"Goal",bg:"\u0426\u0435\u043b"},
  colSugg:{sk:"Navrhovan\u00e1 suma",en:"Suggested sum",bg:"\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0430 \u0441\u0443\u043c\u0430"},colSum:{sk:"Poistn\u00e1 suma",en:"Sum insured",bg:"\u0417\u0430\u0441\u0442\u0440\u0430\u0445\u043e\u0432\u0430\u043d\u0430 \u0441\u0443\u043c\u0430"},colYrs:{sk:"Roky",en:"Years",bg:"\u0413\u043e\u0434\u0438\u043d\u0438"},colPrem:{sk:"Poistn\u00e9 za rok",en:"Premium per year",bg:"Нетна Годишна премия"},
  light:{sk:"Svetl\u00e1",en:"Light",bg:"\u0421\u0432\u0435\u0442\u043b\u0430"},dark:{sk:"Tmav\u00e1",en:"Dark",bg:"\u0422\u044a\u043c\u043d\u0430"},
  tabIncomeSecHeader: {sk:"Anal\u00fdza zabezpe\u010denia pr\u00edjmu", en:"Income protection analysis", bg:"\u0410\u043d\u0430\u043b\u0438\u0437 \u043d\u0430 \u0437\u0430\u0449\u0438\u0442\u0430\u0442\u0430 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434\u0430"},
  tabInvestCapHeader: {sk:"Invest\u00edcia a budovanie kapit\u00e1lu", en:"Investment and capital building", bg:"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0438 \u0438 \u043d\u0430\u0442\u0440\u0443\u043f\u0432\u0430\u043d\u0435 \u043d\u0430 \u043a\u0430\u043f\u0438\u0442\u0430\u043b"},
  tabCoverModelHeader: {sk:"Model poistn\u00e9ho krytia", en:"Insurance coverage model", bg:"\u041c\u043e\u0434\u0435\u043b \u043d\u0430 \u0437\u0430\u0441\u0442\u0440\u0430\u0445\u043e\u0432\u0430\u043d\u0435"},
  descModel: {sk:"Kalkula\u010dka sl\u00fa\u017ei na model\u00e1ciu finan\u010dn\u00e9ho zabezpe\u010denia a invest\u00edci\u00ed klienta za \u00fa\u010delom pokrytia \u017eivotn\u00fdch riz\u00edk a renty.", en:"The calculator models financial security and investments to cover life risks and pension.", bg:"\u041a\u0430\u043b\u043a\u0443\u043b\u0430\u0442\u043e\u0440\u044a\u0442 \u0441\u043b\u0443\u0436\u0438 \u0437\u0430 \u043c\u043e\u0434\u0435\u043b\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 \u0444\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u0430\u0442\u0430 \u0437\u0430\u0449\u0438\u0442\u0430 \u0438 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0438"},
  overviewLossComp: {sk:"Porovnanie straty pr\u00edjmu", en:"Income loss comparison", bg:"\u0421\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435 \u043d\u0430 \u0437\u0430\u0433\u0443\u0431\u0430\u0442\u0430 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434\u0430"},
  overviewLossLbl: {sk:"V\u00fdpadok", en:"Loss", bg:"\u0417\u0430\u0433\u0443\u0431\u0430"},
  incomeStrata: {sk:"strata pr\u00edjmu", en:"income loss", bg:"\u0437\u0430\u0433\u0443\u0431\u0430 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434"},
  withIncome: {sk:"s pr\u00edjmom", en:"with income", bg:"\u0441 \u0434\u043e\u0445\u043e\u0434"},
  overviewLongText: {sk:"Tieto prostriedky v\u00e1m umo\u017enia udr\u017ea\u0165 si aktu\u00e1lnu \u017eivotn\u00fa \u00farove\u0148 aj pri v\u00fdpadku pr\u00edjmu trval\u00e9ho charakteru (napr. zdravotn\u00e9 postihnutie alebo odchod na d\u00f4chodok).", en:"These funds will allow you to maintain your standard of living in case of a permanent income loss.", bg:"\u0422\u0435\u0437\u0438 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430 \u0449\u0435 \u0432\u0438 \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0442 \u0434\u0430 \u0437\u0430\u043f\u0430\u0437\u0438\u0442\u0435 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0430 \u0441\u0438 \u043d\u0430 \u0436\u0438\u0432\u043e\u0442 \u0434\u043e\u0440\u0438 \u043f\u0440\u0438 \u0442\u0440\u0430\u0439\u043d\u0430 \u0437\u0430\u0433\u0443\u0431\u0430 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434"},
  btnDetailRenty: {sk:"ZOBRAZI\u0164 DETAIL RENTY", en:"SHOW PENSION DETAIL", bg:"\u041f\u041e\u041a\u0410\u0416\u0418 \u0414\u0415\u0422\u0410\u0419\u041b\u0418 \u0417\u0410 \u041f\u0415\u041d\u0421\u0418\u042f\u0422\u0410"},
  monthlyPiAndModel: {sk:"Mesa\u010dne (PI + Model)", en:"Monthly (PI + Model)", bg:"\u041c\u0435\u0441\u0435\u0447\u043d\u043e (PI + \u041c\u043e\u0434\u0435\u043b)"},
  lblRemAtLoss: {sk:"(Pri v\u00fdpadku pr\u00edjmu)", en:"(At income loss)", bg:"(\u041f\u0440\u0438 \u0437\u0430\u0433\u0443\u0431\u0430 \u043d\u0430 \u0434\u043e\u0445\u043e\u0434)"},
  pillRisk: {sk:"Riziko", en:"Risk", bg:"\u0420\u0438\u0441\u043a"},
  pillInvest: {sk:"Invest", en:"Invest", bg:"\u0418\u043d\u0432\u0435\u0441\u0442."},
  pillExpenses: {sk:"V\u00fddaj", en:"Expense", bg:"\u0420\u0430\u0437\u0445\u043e\u0434"},
  investAnalTitle: {sk:"Anal\u00fdza invest\u00edcie", en:"Investment analysis", bg:"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u043e\u043d\u0435\u043d \u0430\u043d\u0430\u043b\u0438\u0437"},
  investCiel: {sk:"Metlife cie\u013e", en:"Metlife goal", bg:"\u0426\u0435\u043b Metlife"},
  fvInvestment: {sk:"Bud\u00faca hodnota invest\u00edcie", en:"Future investment value", bg:"\u0411\u044a\u0434\u0435\u0449\u0430 \u0441\u0442\u043e\u0439\u043d\u043e\u0441\u0442 \u043d\u0430 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044f\u0442\u0430"},
  tabCoverHeaderRizik: {sk:"Krytie riz\u00edk a \u00faveru", en:"Coverage of risks and loan", bg:"\u041f\u043e\u043a\u0440\u0438\u0442\u0438\u0435 \u043d\u0430 \u0440\u0438\u0441\u043a\u043e\u0432\u0435 \u0438 \u043a\u0440\u0435\u0434\u0438\u0442\u0438"},
  tabCoverHeaderMetlifeHlavne: {sk:"Metlife Hlavn\u00e9 krytie", en:"Metlife Main Coverage", bg:"\u041e\u0441\u043d\u043e\u0432\u043d\u043e \u043f\u043e\u043a\u0440\u0438\u0442\u0438\u0435 Metlife"},
  tabCoverHeaderDoplnkSluzby: {sk:"Doplnkov\u00e9 a flexibiln\u00e9 pripoistenia", en:"Additional and flexible riders", bg:"Допълнителни застрахователни договори"},
  cgTitle: {sk:"Metlife Credit Guard", en:"Metlife Credit Guard", bg:"Metlife Credit Guard"},
  careTitle: {sk:"Metlife CARE", en:"Metlife CARE", bg:"Metlife CARE"},
  yes: {sk:"\u00e1no", en:"yes", bg:"\u0434\u0430"},
  min25: {sk:"(min 25)", en:"(min 25)", bg:"(min 25)"},
  rdTitle: {sk: "Detail v\u00fdpo\u010dtu renty", en: "Pension calculation detail", bg: "\u0414\u0435\u0442\u0430\u0439\u043b \u043d\u0430 \u0438\u0437\u0447\u0438\u0441\u043b\u0435\u043d\u0438\u0435\u0442\u043e"},
  rdGap: {sk: "Po\u017eadovan\u00e1 mesa\u010dn\u00e1 renta (v\u00fdpadok)", en: "Required monthly pension (gap)", bg: "\u041d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u0430 \u043c\u0435\u0441\u0435\u0447\u043d\u0430 \u043f\u0435\u043d\u0441\u0438\u044f"},
  rdDur: {sk: "Doba poberania renty", en: "Pension duration", bg: "\u041f\u0435\u0440\u0438\u043e\u0434 \u043d\u0430 \u043f\u043e\u043b\u0443\u0447\u0430\u0432\u0430\u043d\u0435"},
  rdYield: {sk: "O\u010dak\u00e1van\u00e9 zhodnotenie po\u010das renty", en: "Expected appreciation during payout", bg: "\u041e\u0447\u0430\u043a\u0432\u0430\u043d\u0430 \u0434\u043e\u0445\u043e\u0434\u043d\u043e\u0441\u0442"},
  rdMattress: {sk: "Potrebn\u00fd kapit\u00e1l, keby sa ne\u00faro\u010dil", en: "Required capital without interest", bg: "\u041d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c \u043a\u0430\u043f\u0438\u0442\u0430\u043b \u0431\u0435\u0437 \u043b\u0438\u0445\u0432\u0430"},
  rdSaved: {sk: "V\u00e1\u0161 bonus v\u010faka \u00faro\u010deniu", en: "Your bonus thanks to investing", bg: "\u0412\u0430\u0448\u0438\u044f\u0442 \u0431\u043e\u043d\u0443\u0441 \u0431\u043b\u0430\u0433\u043e\u0434\u0430\u0440\u0435\u043d\u0438\u0435 \u043d\u0430 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0440\u0430\u043d\u0435"},
  rdExpl: {sk: "Suma, ktor\u00fa skuto\u010dne potrebujete nakumulova\u0165, je podstatne ni\u017e\u0161ia, preto\u017ee va\u0161a renta sa bude zhodnocova\u0165 aj po\u010das jej vypl\u00e1cania.", en: "The amount you actually need to accumulate is significantly lower because your pension will continue to appreciate even during its payout.", bg: "\u0421\u0443\u043c\u0430\u0442\u0430, \u043a\u043e\u044f\u0442\u043e \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043b\u043d\u043e \u0442\u0440\u044f\u0431\u0432\u0430 \u0434\u0430 \u043d\u0430\u0442\u0440\u0443\u043f\u0430\u0442\u0435, \u0435 \u0437\u043d\u0430\u0447\u0438\u0442\u0435\u043b\u043d\u043e \u043f\u043e-\u043d\u0438\u0441\u043a\u0430, \u0442\u044a\u0439 \u043a\u0430\u0442\u043e \u043f\u0435\u043d\u0441\u0438\u044f\u0442\u0430 \u0432\u0438 \u0449\u0435 \u043f\u0440\u043e\u0434\u044a\u043b\u0436\u0438 \u0434\u0430 \u0441\u0435 \u043e\u043b\u0438\u0445\u0432\u044f\u0432\u0430."},
  pensionWithPlan: {sk:"D\u00f4chodok s va\u0161\u00edm pl\u00e1nom", en:"Pension with your plan", bg:"\u041f\u0435\u043d\u0441\u0438\u044f \u0441 \u0432\u0430\u0448\u0438\u044f \u043f\u043b\u0430\u043d"},
  stateOnly: {sk:"\u0160t\u00e1tna penzia", en:"State pension", bg:"\u0414\u044a\u0440\u0436\u0430\u0432\u043d\u0430 \u043f\u0435\u043d\u0441\u0438\u044f"},
  fromInvestment: {sk:"renta z invest\u00edcie", en:"rent from investment", bg:"\u0440\u0435\u043d\u0442\u0430 \u043e\u0442 \u0438\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u044f\u0442\u0430"},
  ofWhichPI: {sk:"z toho PI", en:"of which PI", bg:"\u043e\u0442 \u043a\u043e\u0438\u0442\u043e PI"},
  ofWhichUL: {sk:"z toho UL", en:"of which UL", bg:"\u043e\u0442 \u043a\u043e\u0438\u0442\u043e UL"},
  clientName: {sk:"Meno klienta", en:"Client name", bg:"\u0418\u043c\u0435 \u043d\u0430 \u043a\u043b\u0438\u0435\u043d\u0442\u0430"},
  advisorName: {sk:"Poradca", en:"Advisor", bg:"\u041a\u043e\u043d\u0441\u0443\u043b\u0442\u0430\u043d\u0442"},
  clientSection: {sk:"Klientsk\u00e9 \u00fadaje", en:"Client data", bg:"\u041a\u043b\u0438\u0435\u043d\u0442\u0441\u043a\u0438 \u0434\u0430\u043d\u043d\u0438"},
  exportPDF: {sk:"Export PDF", en:"Export PDF", bg:"\u0415\u043a\u0441\u043f\u043e\u0440\u0442 PDF"},
  date: {sk:"D\u00e1tum", en:"Date", bg:"\u0414\u0430\u0442\u0430"},
  export: {sk:"Export JSON", en:"Export JSON", bg:"\u0415\u043a\u0441\u043f\u043e\u0440\u0442 JSON"},
  import: {sk:"Import JSON", en:"Import JSON", bg:"\u0412\u043d\u043e\u0441 JSON"}
};
var GLang = "bg";
function t(k,l){return(I[k]&&I[k][l||GLang])||I[k].sk||k;}
function tx(k){return t(k, GLang);}

/* ══════════════════════════════════════════════════════════════
   STERLING HERITAGE – Light Mode Tokens (matches Stitch output)
   White cards, burgundy accents, lavender section fills
   ══════════════════════════════════════════════════════════════ */
/* Light theme */
var LT={
  bg:"#eef0f5",          /* page background – cool light grey */
  card:"#ffffff",         /* card surface */
  text:"#1a1a2e",        /* primary text */
  dim:"#6b6b80",         /* muted text */
  border:"#e0dde8",      /* card borders */
  bl:"#f5f4f8",          /* row separator fill */
  input:"#f8f7fa",       /* input bg */
  red:"#8B1538",         /* Sterling burgundy */
  blue:"#3d3d8f",        /* secondary accent (blue labels) */
  yellow:"#fff4eb",      /* warm highlight bg */
  lblue:"#eceaf8",       /* lavender tint for cards */
  lgreen:"#e8f4ee",      /* green tint for positive */
  hbg:"#ffffff",         /* header bg */
  secMust:"#8B1538",     /* Must-have header gradient start */
  secNice:"#44445a",     /* Nice header */
  secSub:"#f3f1f7",      /* Sub-section header */
  totBg:"#ffffff",       /* totals card bg */
  totBdr:"#8B1538"       /* totals card border */
};
/* Dark theme */
var DK={
  bg:"#1d1e2a",card:"#282a3a",text:"#f2f1f6",dim:"#a1a2b8",
  border:"#3d3e54",bl:"#343548",input:"#1c1e2d",red:"#c84666",
  blue:"#9a9ad6",yellow:"#382914",lblue:"#282a3a",lgreen:"#202c26",
  hbg:"#282a3a",secMust:"#8B1538",secNice:"#3d3e54",secSub:"#343548",
  totBg:"#282a3a",totBdr:"#c84666"
};

var G5="var(--g5)";
var FH="'Manrope',Arial,sans-serif";
var FB="'Inter',Arial,sans-serif";
var MN="'Inter','Courier New',monospace";

function mL(T){return{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:FB};}
function mI(T){return{flex:1,background:"transparent",border:"none",outline:"none",fontSize:13,fontWeight:600,color:T.text,fontFamily:MN,width:"100%",textAlign:"right"};}
function mW(T){return{display:"flex",alignItems:"center",gap:4,background:T.input,borderRadius:5,padding:"5px 8px",border:"1px solid "+T.border};}

/* ─ Input component ──────────────────────────────────────────── */
function Inp(p){var T=p.T;return(
  <div style={{display:"flex",flexDirection:"column",gap:3}}>
    {p.l&&<label style={mL(T)}>{p.l}</label>}
    <div style={mW(T)} className="inp-wrap">
      <input type="number" value={p.v} onChange={function(e){p.c(Number(e.target.value));}} min={p.mn||0} max={p.mx||9999999} step={p.st||1} style={mI(T)}/>
      {p.s&&<span style={{fontSize:11,color:T.dim,fontWeight:600,fontFamily:FB,marginLeft:2}}>{p.s}</span>}
    </div>
  </div>
);}

/* ─ Select component ─────────────────────────────────────────── */
function Sel(p){var T=p.T;return(
  <div style={{display:"flex",flexDirection:"column",gap:3}}>
    {p.l&&<label style={mL(T)}>{p.l}</label>}
    <select value={p.v} onChange={function(e){p.c(e.target.value);}} style={{background:T.input,borderRadius:5,padding:"6px 8px",border:"1px solid "+T.border,fontSize:12,fontWeight:600,color:T.text,fontFamily:FB,cursor:"pointer",outline:"none"}}>
      {p.o.map(function(x){return <option key={x.v} value={x.v}>{x.l}</option>;})}
    </select>
  </div>
);}

/* ─ Checkbox ─────────────────────────────────────────────────── */
function Chk(p){var T=p.T;return(
  <label className="chk-label" style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:12,fontWeight:600,color:p.ch?T.text:T.dim,fontFamily:FB}}>
    <div onClick={function(){p.c(!p.ch);}} style={{width:17,height:17,borderRadius:4,border:p.ch?"2px solid "+T.red:"2px solid "+T.border,background:p.ch?T.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.15s"}}>
      {p.ch&&<span style={{color:"#fff",fontSize:11,fontWeight:900}}>{"\u2713"}</span>}
    </div>
    {p.l}
  </label>
);}

/* ─ Section card ─────────────────────────────────────────────── */
function Sec(p){var T=p.T;
  var gradMust="linear-gradient(135deg,"+T.secMust+" 0%,#AB0534 100%)";
  var gradNice="linear-gradient(135deg,"+T.secNice+" 0%,#5a5a74 100%)";
  var bgMap={must:gradMust,nice:gradNice,sub:T.secSub};
  var txMap={must:"#fff",nice:"#fff",sub:T.text};
  return(
    <div className="sec-card" style={{background:T.card,borderRadius:8,border:"1px solid "+T.border,overflow:"hidden",marginBottom:10,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
      <div style={{padding:"10px 16px",background:bgMap[p.type]||T.secSub,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:12,fontWeight:700,color:txMap[p.type]||T.text,fontFamily:FH,letterSpacing:"0.02em",textTransform:"uppercase"}}>{p.t}</span>
        {p.badge!==undefined&&<span style={{fontSize:9,fontWeight:700,background:"rgba(255,255,255,0.22)",padding:"2px 8px",borderRadius:12,color:txMap[p.type]||T.text,fontFamily:FB,letterSpacing:"0.05em"}}>{p.badge}</span>}
      </div>
      <div style={{padding:"10px 16px"}}>{p.children}</div>
    </div>
  );
}

/* ─ Coverage header row ──────────────────────────────────────── */
function CH(p){var T=p.T;return(
  <div style={{display:"grid",gridTemplateColumns:G5,gap:4,padding:"4px 0",borderBottom:"2px solid "+T.red,marginBottom:2}}>
    {["",t("colSugg",p.L),t("colSum",p.L),t("colYrs",p.L),t("colPrem",p.L)].map(function(h,i){
      return <div key={i} style={{fontSize:8,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:"0.06em",textAlign:i>0?"right":"left",fontFamily:FB}}>{h}</div>;
    })}
  </div>
);}

/* ─ Data row with optional editable fields ───────────────────── */
function DR(p){var T=p.T;var w=mW(T),s={...mI(T),fontSize:11};return(
  <div className="grid-row" style={{display:"grid",gridTemplateColumns:G5,gap:4,alignItems:"center",padding:"5px 0",borderBottom:"1px solid "+T.bl}}>
    <div style={{fontWeight:p.b?700:500,color:p.b?T.text:T.dim,fontSize:p.b?12:11,fontFamily:FB}}>{p.l}</div>
    <div style={{textAlign:"right",fontSize:11,color:T.dim,fontFamily:MN}}>{p.sg!=null?fmt(p.sg)+" "+tx("cur"):""}</div>
    {p.sc?(<div style={w}><input type="number" value={p.si||0} onChange={function(e){p.sc(Number(e.target.value));}} style={s}/><span style={{fontSize:9,color:T.dim}}>{tx("cur")}</span></div>):(<div style={{textAlign:"right",fontSize:11,color:T.dim,fontFamily:MN}}>{p.si!=null?fmt(p.si)+" "+tx("cur"):""}</div>)}
    {p.dc?(<div style={w}><input type="number" value={p.dur||0} onChange={function(e){p.dc(Number(e.target.value));}} min={1} max={80} style={s}/></div>):(<div style={{textAlign:"right",fontSize:11,color:T.dim,fontFamily:MN}}>{p.dur||""}</div>)}
    <div style={{textAlign:"right",fontSize:12,fontWeight:p.b?700:600,color:p.pr>0.005?T.red:T.dim,fontFamily:MN}}>{p.pr!=null?fmt(p.pr,2)+" "+tx("cur"):""}</div>
  </div>
);}

/* ─ Nice-to-have row ─────────────────────────────────────────── */
function NR(p){var T=p.T;var w=mW(T),s={...mI(T),fontSize:11};return(
  <div className="grid-row" style={{display:"grid",gridTemplateColumns:G5,gap:4,alignItems:"center",padding:"5px 0",borderBottom:"1px solid "+T.bl}}>
    <div style={{fontSize:11,color:T.dim,fontFamily:FB}}>{p.l}{p.note?" ("+p.note+")":""}</div>
    <div></div>
    <div style={w}><input type="number" value={p.si} onChange={function(e){p.sc(Number(e.target.value));}} min={0} max={p.mx||9999} style={s}/><span style={{fontSize:9,color:T.dim}}>{tx("cur")}</span></div>
    <div></div>
    <div style={{textAlign:"right",fontSize:12,fontWeight:600,color:p.pr>0.005?T.red:T.dim,fontFamily:MN}}>{fmt(p.pr,2)+" "+tx("cur")}</div>
  </div>
);}


/* APP */
export default function App(){
  var _=useState;
  var _d=_(false),dark=_d[0],setDark=_d[1];
  var _l=_("bg"),lang=_l[0],setLang=_l[1];
  GLang = lang;
  var T=dark?DK:LT;var L=lang;

  var _br=_(2550),br=_br[0],sBr=_br[1];var _ne=_(2000),ne=_ne[0],sNe=_ne[1];
  var _age=_(25),age=_age[0],sAge=_age[1];var _iy=_(8),iy=_iy[0],sIy=_iy[1];
  var _py=_(4),py=_py[0],sPy=_py[1];var _pyr=_(20),pyr=_pyr[0],sPyr=_pyr[1];
  var _st=_("SINGLE"),st=_st[0],sSt=_st[1];var _rk=_(1),rk=_rk[0],sRk=_rk[1];
  var _loan=_(0),loan=_loan[0],sLoan=_loan[1];var _dur=_(30),dur=_dur[0],sDur=_dur[1];

  var _cg=_(true),cg=_cg[0],sCg=_cg[1];var _cgDD=_(true),cgDD=_cgDD[0],sCgDD=_cgDD[1];
  var _cgS=_(241000),cgS=_cgS[0],sCgS=_cgS[1];var _cgD=_(30),cgD=_cgD[0],sCgD=_cgD[1];

  var _ul=_(true),ul=_ul[0],sUl=_ul[1];var _ulM=_(25),ulM=_ulM[0],sUlM=_ulM[1];
  var _ulDS=_(4000),ulDS=_ulDS[0],sUlDS=_ulDS[1];var _ulDur=_(30),ulDur=_ulDur[0],sUlDur=_ulDur[1];

  var _cp=_("Silver plan"),cp=_cp[0],sCp=_cp[1];
  var _cDiD=_(30),cDiD=_cDiD[0],sCDiD=_cDiD[1];

  var _aDS=_(0),aDS=_aDS[0],sADS=_aDS[1];var _aDDur=_(30),aDDur=_aDDur[0],sADDur=_aDDur[1];
  var _pDS=_(20000),pDS=_pDS[0],sPDS=_pDS[1];var _pDDur=_(30),pDDur=_pDDur[0],sPDDur=_pDDur[1];
  var _ciS=_(0),ciS=_ciS[0],sCiS=_ciS[1];var _ciDur=_(5),ciDur=_ciDur[0],sCiDur=_ciDur[1];

  var _hS=_(0),hS=_hS[0],sHS=_hS[1];var _sS=_(0),sS=_sS[0],sSS=_sS[1];var _fS=_(0),fS=_fS[0],sFS=_fS[1];
  var _telOn=_(true),telOn=_telOn[0],sTelOn=_telOn[1];var _wavOn=_(false),wavOn=_wavOn[0],sWavOn=_wavOn[1];
  var _piReal=_(93),piReal=_piReal[0],sPiReal=_piReal[1];
  var _tab=_("model"),tab=_tab[0],sTab=_tab[1];
  var _pm=_(false),printMode=_pm[0],setPrintMode=_pm[1];
  var _cn=_(""),clientName=_cn[0],setClientName=_cn[1];
  var _an=_(""),advisorName=_an[0],setAdvisorName=_an[1];

  function handlePrint(){
    setPrintMode(true);
    setTimeout(function(){
      window.print();
      setTimeout(function(){setPrintMode(false);},1000);
    },200);
  }

  function handleExport(){
    var state = {br:br,ne:ne,age:age,iy:iy,py:py,pyr:pyr,st:st,rk:rk,loan:loan,dur:dur,cg:cg,cgDD:cgDD,cgS:cgS,cgD:cgD,ul:ul,ulM:ulM,ulDS:ulDS,ulDur:ulDur,cp:cp,cDiD:cDiD,aDS:aDS,aDDur:aDDur,pDS:pDS,pDDur:pDDur,ciS:ciS,ciDur:ciDur,hS:hS,sS:sS,fS:fS,telOn:telOn,wavOn:wavOn,piReal:piReal,clientName:clientName,advisorName:advisorName};
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    var anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", (clientName||"klient") + "_BG_Income.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function handleImport(e){
    var file = e.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(evt){
      try{
        var st = JSON.parse(evt.target.result);
        if(st.br!==undefined) sBr(st.br); if(st.ne!==undefined) sNe(st.ne);
        if(st.age!==undefined) sAge(st.age); if(st.iy!==undefined) sIy(st.iy);
        if(st.py!==undefined) sPy(st.py); if(st.pyr!==undefined) sPyr(st.pyr);
        if(st.st!==undefined) sSt(st.st); if(st.rk!==undefined) sRk(st.rk);
        if(st.loan!==undefined) sLoan(st.loan); if(st.dur!==undefined) sDur(st.dur);
        if(st.cg!==undefined) sCg(st.cg); if(st.cgDD!==undefined) sCgDD(st.cgDD);
        if(st.cgS!==undefined) sCgS(st.cgS); if(st.cgD!==undefined) sCgD(st.cgD);
        if(st.ul!==undefined) sUl(st.ul); if(st.ulM!==undefined) sUlM(st.ulM);
        if(st.ulDS!==undefined) sUlDS(st.ulDS); if(st.ulDur!==undefined) sUlDur(st.ulDur);
        if(st.cp!==undefined) sCp(st.cp); if(st.cDiD!==undefined) sCDiD(st.cDiD);
        if(st.aDS!==undefined) sADS(st.aDS); if(st.aDDur!==undefined) sADDur(st.aDDur);
        if(st.pDS!==undefined) sPDS(st.pDS); if(st.pDDur!==undefined) sPDDur(st.pDDur);
        if(st.ciS!==undefined) sCiS(st.ciS); if(st.ciDur!==undefined) sCiDur(st.ciDur);
        if(st.hS!==undefined) sHS(st.hS); if(st.sS!==undefined) sSS(st.sS);
        if(st.fS!==undefined) sFS(st.fS); if(st.telOn!==undefined) sTelOn(st.telOn);
        if(st.wavOn!==undefined) sWavOn(st.wavOn); if(st.piReal!==undefined) sPiReal(st.piReal);
        if(st.clientName!==undefined) setClientName(st.clientName);
        if(st.advisorName!==undefined) setAdvisorName(st.advisorName);
      }catch(err){alert("Chybný súbor / Invalid file");}
    };
    reader.readAsText(file);
    e.target.value = null;
  }

  var _embO=_(""),embO=_embO[0],sEmbO=_embO[1];
  var _showRD=_(false),showRD=_showRD[0],sShowRD=_showRD[1];

  var rc=RCT[rk]||RCT[1];
  var calc=useMemo(function(){return calcAll(br,ne,age,dur,iy/100,py/100,pyr,st,loan,ul,ulM,cg,cgDD,cgS,cp,cgD,embO);},[br,ne,age,dur,iy,py,pyr,st,loan,ul,ulM,cg,cgDD,cgS,cp,cgD,embO]);
  var mPI=calc.monthlyPI;
  var careVals=CARE_PLANS[cp]||CARE_PLANS["not included"];
  var careActive=cp!=="not included";

  useEffect(function(){
    var c=CARE_PLANS[cp]||CARE_PLANS["not included"];
    if(c[2]===0) sCiS(calc.sugCI);
  }, [cp, cgDD, calc.sugCI]);

  /* Premiums */
  var cgRate=lr(cgDD?DD:DOT,age,cgD);var cgPr=cg?(cgS/100000)*cgRate*12:0;
  var ulYr=calc.ulYearly;
  /* UL Death uses Rider table if UL on, Basic if off */
  var ulDeathRate=lr(DD,age,ulDur);
  var ulDeathPr=(ulDS/100000)*ulDeathRate*12;

  var dR=rateAt(DIS_R,age),ciRR=rateAt(CI_R,age),caRR=rateAt(CA_R,age),inRR=rateAt(IN_R,age);
  var cDisPr=careActive?careVals[0]/1000*dR:0;
  var cPDPr=careActive?careVals[1]*rc.pi/1000:0;
  var cCIPr=careActive?careVals[2]/1000*ciRR:0;
  var cCaPr=careActive?careVals[3]/1000*caRR:0;
  var cInPr=careActive?careVals[4]/1000*inRR:0;
  var cTelPr=careVals[5]?15:0;

  var aDPr=aDS*rc.acc/1000;var pDPr=pDS*rc.pi/1000;
  var kR=ciDur<=5?kchRate(KCH5,age):kchRate(KCH10,age);
  var ciPr=ul?(ciS/1000*ciRR):(ciS/1000*kR);

  var hPr=hS*4.25;var sPr=sS*8.32/100;var fPr=fS*rc.frac/1000;
  var telPr=telOn?15:0;

  /* Renta z plánu (PI + UL) pri dôchodku */
  var piRealFV = fvDaily(piReal, iy/100, dur);
  var totalCapitalAtRetirement = piRealFV + (calc.ulSavings || 0);
  var monthlyRentFromPlan = calc.pvF > 0 ? totalCapitalAtRetirement / calc.pvF : 0;
  var pensionWithPlan = (calc.pen.repl || 0) + monthlyRentFromPlan;

  var riskSum=cgPr+ulDeathPr+cDisPr+cPDPr+cCIPr+cCaPr+cInPr+cTelPr+aDPr+pDPr+ciPr+hPr+sPr+fPr+telPr;
  var wvPr=wavOn?safe(riskSum*WRT[rk]):0;
  /* Fee: 15 if UL, 13 if not + 5 if CG */
  var fee=(ul?15:13)+(cg?5:0);
  var rP=riskSum+wvPr;
  var tY=rP+fee+ulYr+piReal*12;
  var investOnInc=ne>0?((ulYr+piReal*12)/12/ne):0;
  var riskOnInc=ne>0?rP/(ne*12):0;

  var btnS=function(a){return{
    padding:"4px 10px",borderRadius:5,
    border:"1px solid "+(a?T.red:T.border),
    background:a?T.red:"transparent",
    color:a?"#fff":T.dim,
    fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:FB,
    transition:"all 0.15s"
  };};

  return(
    <div style={{fontFamily:FB,background:T.bg,color:T.text,minHeight:"100vh"}}>
      {/* ─ HEADER ─────────────────────────────────────────────── */}
      <div style={{background:T.card,padding:"0 24px",borderBottom:"1px solid "+T.border,marginBottom:30}}>
        <div className="top-bar-content" style={{maxWidth:1440,margin:"0 auto",justifyContent:"space-between"}}>
          
          <div style={{display:"flex",alignItems:"center",gap:40}}>
            {/* Logo/Avatar - PARTNERS wordmark podľa manuálu doplneny o symbol */}
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <svg width="34" height="34" viewBox="0 0 34 34" style={{borderRadius:4}}><rect width="34" height="34" fill={T.red}/><polygon points="12,24 16,24 21,10 17,10" fill="#fff"/><polygon points="22,14 26,24 22,24 19.5,18" fill="#fff"/></svg>
              <div style={{display:"flex",flexDirection:"column"}}>
              <div style={{fontSize:22,fontWeight:900,color:T.text,letterSpacing:"0.06em",fontFamily:FH, display:"flex", alignItems:"center"}}>
                P
                <svg width="0.75em" height="0.75em" viewBox="0 0 24 24" style={{fill:"currentColor", margin:"0 0.04em 0 0.05em", transform:"translateY(0.02em)"}}>
                  <polygon points="1,24 8,24 17,0 10,0" />
                  <polygon points="17,8 24,24 17,24 12,12" />
                </svg>
                RTNERS
              </div>
              <div style={{fontSize:9,color:T.dim,fontFamily:FB,marginTop:2,letterSpacing:"0.02em"}}>{tx("title")+" \u2022 BG 3/2026"}</div>
              </div>
            </div>
            {/* TABS removed from here */}
          </div>

          <div className="no-print header-controls" style={{display:"flex",alignItems:"center",gap:6}}>
            {["bg","sk","en"].map(function(lg){return <button key={lg} className="lang-btn" onClick={function(){setLang(lg);}} style={btnS(lang===lg)}>{lg.toUpperCase()}</button>;})}
            <div style={{width:1,height:18,background:T.border,margin:"0 4px"}}></div>
            <button className="lang-btn" onClick={function(){setDark(!dark);}} style={btnS(false)}>{dark?tx("light"):tx("dark")}</button>
            <div style={{width:1,height:18,background:T.border,margin:"0 4px"}}></div>
            <label style={{...btnS(false),cursor:"pointer",display:"flex",alignItems:"center"}}>
              &#10515; {tx("import")}
              <input type="file" accept=".json" onChange={handleImport} style={{display:"none"}}/>
            </label>
            <button className="lang-btn" onClick={handleExport} style={btnS(false)}>&#10514; {tx("export")}</button>
            <button className="lang-btn" onClick={handlePrint} style={{...btnS(false),background:"#AB0534",color:"#fff",borderColor:"#AB0534"}}>{"\u2913 "+tx("exportPDF")}</button>
          </div>
        </div>
      </div>

      <div className="app-container">
        
        {/* PRINT-ONLY HEADER - viditeľný iba pri tlači */}
        <div className="print-only print-header">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"2px solid #AB0534",paddingBottom:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:22,fontWeight:900,color:"#AB0534",letterSpacing:"0.06em"}}>PARTNERS</div>
              <div style={{fontSize:11,color:"#4D4D4D",marginTop:2}}>{tx("title")} \u2022 BG 3/2026</div>
            </div>
            <div style={{textAlign:"right",fontSize:11,color:"#4D4D4D"}}>
              <div><strong>{tx("clientName")}:</strong> {clientName||"\u2014"}</div>
              <div><strong>{tx("advisorName")}:</strong> {advisorName||"\u2014"}</div>
              <div><strong>{tx("date")}:</strong> {new Date().toLocaleDateString("sk-SK")}</div>
            </div>
          </div>
        </div>

        {/* TABS NAD STREDNOU TABULKOU */}
        <div className="main-grid no-print" style={{marginBottom: 20, alignItems: "center"}}>
          <div>
            {/* Title can stay in the left col or be hidden, let's keep it here aligned cleanly */}
            <h1 style={{fontSize:22,fontWeight:800,fontFamily:FH,color:T.text}}>
              {tab==="overview"?tx("tabIncomeSecHeader"):tab==="invest"?tx("tabInvestCapHeader"):tx("tabCoverModelHeader")}
            </h1>
          </div>
          
          {/* TABS CENTERED OVER MAIN COLUMN */}
          <div style={{display:"flex",justifyContent:"center"}}>
            <div className="tab-buttons" style={{display:"inline-flex",gap:4,background:T.card,padding:5,borderRadius:12,border:"1px solid "+T.border,boxShadow:"0 3px 12px rgba(0,0,0,0.03)"}}>
              {[{id:"model",k:"tabModel"},{id:"overview",k:"tabOverview"},{id:"invest",k:"tabInvest"}].map(function(tb){
                var a=tab===tb.id;
                return <button key={tb.id} onClick={function(){sTab(tb.id);}} style={{
                  padding:"10px 24px",border:"none",borderRadius:8,cursor:"pointer",
                  background:a?T.red:"transparent",
                  color:a?"#fff":T.dim,fontSize:13,fontWeight:800,fontFamily:FH,letterSpacing:"0.03em",
                  textTransform: "uppercase", transition: "all 0.2s ease",
                  boxShadow:a?"0 4px 10px rgba(139,21,56,0.25)":"none"
                }}>{tx(tb.k)}</button>;
              })}
            </div>
          </div>
          
          <div></div> {/* right col spacer */}
        </div>

        <div className="main-grid">
          
          {/* LFT COLUMN: VSTUPNÉ ÚDAJE (Fixný pre vš. taby) */}
          <aside className={tab !== "model" ? "hide-on-mobile" : ""}>
            <div style={{background:T.card,borderRadius:8,padding:"14px 18px",boxShadow:"0 2px 10px rgba(0,0,0,0.02)",border:"1px solid "+T.border,marginBottom:14}}>
              <div style={{...mL(T),color:T.red,marginBottom:10,fontSize:11}}>{tx("clientSection")}</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <label style={mL(T)}>{tx("clientName")}</label>
                  <div style={mW(T)}>
                    <input type="text" value={clientName} onChange={function(e){setClientName(e.target.value);}} style={{...mI(T),textAlign:"left"}}/>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <label style={mL(T)}>{tx("advisorName")}</label>
                  <div style={mW(T)}>
                    <input type="text" value={advisorName} onChange={function(e){setAdvisorName(e.target.value);}} style={{...mI(T),textAlign:"left"}}/>
                  </div>
                </div>
              </div>
            </div>

            <div style={{background:T.card,borderRadius:8,padding:"16px 18px",boxShadow:"0 2px 10px rgba(0,0,0,0.02)",border:"1px solid "+T.border}}>
              <div style={{...mL(T),color:T.red,marginBottom:14,fontSize:11}}>{tx("inputs")}</div>
              
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Inp T={T} l={tx("brutto")} v={br} c={sBr} s={"\u20ac"}/>
                <Inp T={T} l={tx("netto")} v={ne} c={sNe} s={"\u20ac"}/>
                
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <Inp T={T} l={tx("age")} v={age} c={sAge} s="r." mn={18} mx={65}/>
                  <Inp T={T} l={tx("dur")} v={dur} c={sDur} s="r." mn={1} mx={45}/>
                </div>
                
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <Sel T={T} l={tx("status")} v={st} c={sSt} o={[{v:"SINGLE",l:tx("single")},{v:"COUPLE",l:tx("couple")}]}/>
                  <Sel T={T} l={tx("riskClass")} v={String(rk)} c={function(v){sRk(Number(v));}} o={[{v:"1",l:"1 - "+tx("low")},{v:"2",l:"2 - "+tx("medium")},{v:"3",l:"3 - "+tx("high")}]}/>
                </div>
                
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <Inp T={T} l={tx("invYield")} v={iy} c={sIy} s="%" st={0.5}/>
                  <Inp T={T} l={tx("penYield")} v={py} c={sPy} s="%" st={0.5}/>
                </div>
                
                <Inp T={T} l={tx("penYears")} v={pyr} c={sPyr} s="r."/>
                <Inp T={T} l={tx("loan")} v={loan} c={sLoan} s={"\u20ac"}/>
              </div>
            </div>
            
            <div style={{marginTop:16,fontSize:10,color:T.dim,lineHeight:1.5,fontFamily:FB,padding:"0 10px"}}>
              {tx("descModel")}
            </div>
          </aside>

          {/* ─ OVERVIEW ───────────────────────────────────────────── */}
          {(tab==="overview"||printMode)&&(<>
            {printMode&&<div className="print-tab-title" style={{gridColumn:"1 / -1"}}><h2 style={{fontSize:16,fontWeight:800,color:"#AB0534",margin:"20px 0 10px",pageBreakBefore:"always"}}>{tx("tabIncomeSecHeader")}</h2></div>}
            <div className="center-col">
              <Sec T={T} t={tx("overviewLossComp")} type="must">
                <div style={{padding:"6px 0"}}>
                  {[{k:"dis50",v:calc.d50},{k:"dis70",v:calc.d70},{k:"dis90",v:calc.d90},{k:"pension",v:calc.pen}].map(function(r,i){
                    var lossGap=Math.max(0,Math.round(r.v.gap));
                    return <div key={i} style={{padding:"10px 0",borderBottom:"1px solid "+T.bl}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                        <span style={{fontSize:12,color:T.dim,fontFamily:FB}}>{tx(r.k)}</span>
                        <div style={{textAlign:"right"}}>
                           <span style={{fontSize:10,color:T.dim,fontFamily:FB,marginRight:8}}>{tx("overviewLossLbl")}</span>
                           <span style={{fontSize:15,fontWeight:800,color:T.red,fontFamily:MN}}>{fmt(lossGap)+" \u20ac"}</span>
                        </div>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{width:Math.min(Math.max((1-r.v.pct)*100,0),100)+"%"}}></div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                         <span style={{fontSize:10,color:T.dim,fontFamily:FB}}>{((1-r.v.pct)*100).toFixed(0)+"% "+tx("incomeStrata")}</span>
                         <span style={{fontSize:10,color:T.dim,fontFamily:FB}}>{(r.v.pct*100).toFixed(0)+"% "+tx("withIncome")}</span>
                      </div>
                    </div>;
                  })}
                </div>
              </Sec>

              {/* Dolný blok pre Potrebné úspory */}
              <div style={{marginTop:24,padding:"16px",background:T.card,borderRadius:8,border:"1px solid "+T.border}}>
                <h3 style={{fontFamily:FB,fontSize:14,color:T.dim,marginBottom:6}}>{tx("neededSav")}</h3>
                <div style={{fontSize:38,fontWeight:800,color:T.red,fontFamily:MN}}>{fmt(Math.round(calc.needed))+" \u20ac"}</div>
                <p style={{fontSize:12,color:T.dim,fontFamily:FB,marginTop:10,lineHeight:1.4}}>
                  {tx("overviewLongText")}
                </p>
                <div style={{marginTop:16}}>
                  <button onClick={function(){sShowRD(!showRD);}} style={{background:showRD?T.bg:T.red,color:showRD?T.text:"#fff",border:showRD?"1px solid "+T.border:"none",padding:"10px 20px",borderRadius:6,fontFamily:FB,fontWeight:700,fontSize:12,cursor:"pointer",boxShadow:showRD?"none":"0 4px 10px rgba(139,21,56,0.3)",transition:"all 0.2s"}}>
                    {tx("btnDetailRenty")} {showRD?"\u25b2":"\u25bc"}
                  </button>
                </div>
                {showRD&&(
                  <div style={{marginTop:16,padding:20,background:T.bg,borderRadius:8,border:"1px solid "+T.border,animation:"fadeIn 0.3s ease"}}>
                    <div style={{fontSize:15,fontWeight:800,fontFamily:FH,color:T.text,marginBottom:16,letterSpacing:"-0.02em"}}>{tx("rdTitle")}</div>
                    
                    <div style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"1px solid "+T.border}}>
                      <span style={{fontSize:11,color:T.dim,fontFamily:FB,paddingRight:20}}>{tx("rdGap")}</span>
                      <span style={{fontSize:13,fontWeight:700,fontFamily:MN,color:T.text,whiteSpace:"nowrap"}}>{fmt(Math.max(0,calc.pen.gap))} {tx("cur")} / {tx("month")}</span>
                    </div>
                    
                    <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+T.border}}>
                      <span style={{fontSize:11,color:T.dim,fontFamily:FB,paddingRight:20}}>{tx("rdDur")}</span>
                      <span style={{fontSize:13,fontWeight:700,fontFamily:MN,color:T.text,whiteSpace:"nowrap"}}>{pyr} {tx("years")}</span>
                    </div>
                    
                    <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+T.border}}>
                      <span style={{fontSize:11,color:T.dim,fontFamily:FB,paddingRight:20}}>{tx("rdYield")}</span>
                      <span style={{fontSize:13,fontWeight:700,fontFamily:MN,color:T.text,whiteSpace:"nowrap"}}>{py} %</span>
                    </div>
                    
                    <div style={{marginTop:16,padding:16,background:"rgba(139,21,56,0.04)",borderRadius:6,border:"1px dashed rgba(139,21,56,0.2)"}}>
                      <div style={{fontSize:11,color:T.dim,fontFamily:FB,lineHeight:1.5,marginBottom:12}}>
                        {tx("rdExpl")}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <span style={{fontSize:11,color:T.dim,fontFamily:FB}}>{tx("rdMattress")}</span>
                        <span style={{fontSize:13,textDecoration:"line-through",opacity:0.6,fontFamily:MN}}>{fmt(Math.max(0,calc.pen.gap)*pyr*12)} {tx("cur")}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:11,fontWeight:700,color:"#22863a",fontFamily:FB}}>{tx("rdSaved")}</span>
                        <span style={{fontSize:15,fontWeight:800,color:"#22863a",fontFamily:MN}}>+{fmt(Math.max(0,(Math.max(0,calc.pen.gap)*pyr*12)-calc.needed))} {tx("cur")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="right-col">
              <div className="totals-card" style={{borderRadius:8,padding:"26px 22px"}}>
                <h2 style={{fontSize:13,fontWeight:800,fontFamily:FH,marginBottom:24,color:"#fff",letterSpacing:"0.04em"}}>
                  {tx("remaining")} <span style={{opacity:0.6,fontWeight:500,fontSize:11,display:"block",marginTop:4}}>{tx("lblRemAtLoss")}</span>
                </h2>
                
                <div style={{background:"rgba(255,255,255,0.1)",borderRadius:6,padding:"12px 14px",marginBottom:20}}>
                   <div style={{fontSize:10,fontFamily:FB,opacity:0.8,marginBottom:4}}>{tx("netIncome")}</div>
                   <div style={{fontSize:24,fontWeight:800,fontFamily:MN}}>{fmt(ne)+" "+tx("cur")}</div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {[{k:"dis50",v:calc.d50.repl},{k:"dis70",v:calc.d70.repl},{k:"dis90",v:calc.d90.repl},{k:"pension",v:calc.pen.repl}].map(function(r,i){
                    return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:i<3?"1px solid rgba(255,255,255,0.15)":"none",paddingBottom:i<3?12:0}}>
                      <span style={{fontSize:12,fontFamily:FB,opacity:0.9,color:"#fff"}}>{tx(r.k)}</span>
                      <span style={{fontSize:15,fontWeight:700,fontFamily:MN,color:"#fff"}}>{fmt(Math.round(r.v))+" "+tx("cur")}</span>
                    </div>;
                  })}
                </div>

                {/* Dôchodok s plánom — highlight blok */}
                <div style={{marginTop:24,padding:"16px 14px",background:"rgba(255,255,255,0.20)",borderRadius:6,border:"1px solid rgba(255,255,255,0.30)"}}>
                  <div style={{fontSize:10,fontFamily:FB,opacity:0.9,marginBottom:8,color:"#fff",fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase"}}>
                    {tx("pensionWithPlan")}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6,fontSize:11,fontFamily:FB,opacity:0.85,color:"#fff"}}>
                    <span>{tx("stateOnly")}: {fmt(Math.round(calc.pen.repl))} {tx("cur")}</span>
                    <span>+{fmt(Math.round(monthlyRentFromPlan))} {tx("cur")} ({tx("fromInvestment")})</span>
                  </div>
                  <div style={{fontSize:26,fontWeight:800,fontFamily:MN,color:"#fff",textAlign:"right",marginTop:4}}>
                    = {fmt(Math.round(pensionWithPlan))} {tx("cur")}
                  </div>
                </div>
              </div>
            </div>
          </>)}

          {/* ─ INVEST ─────────────────────────────────────────────── */}
          {(tab==="invest"||printMode)&&(<><div className="print-tab-title" style={{gridColumn:"1 / -1",display:printMode?"block":"none"}}><h2 style={{fontSize:16,fontWeight:800,color:"#AB0534",margin:"20px 0 10px",pageBreakBefore:"always"}}>{tx("tabInvestCapHeader")}</h2></div><div style={{gridColumn:"span 2",display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>
              <div>
                <Sec T={T} t={tx("investAnalTitle")} type="must">
                  <div style={{padding:"8px 0"}}>
                    {[{l:tx("neededSav"),v:fmt(Math.round(calc.needed))+" "+tx("cur"),c:T.text},{l:tx("savML"),v:fmt(Math.round(calc.ulSavings))+" "+tx("cur"),c:T.text},{l:tx("investCiel")+" ("+tx("colSugg")+")",v:fmt(Math.round(calc.piTarget))+" "+tx("cur"),c:T.red},{l:tx("monthlyDep")+" ("+tx("colSugg")+")",v:fmt(mPI,2)+" "+tx("cur"),c:T.dim},{l:tx("monthlyDep")+" ("+tx("realSum")+")",v:fmt(piReal,2)+" "+tx("cur"),c:T.red},{l:tx("estYield"),v:iy+" %",c:T.text},{l:tx("investDur"),v:dur+" "+tx("years"),c:T.text},{l:tx("totalDep"),v:fmt(Math.round(piReal*dur*12+(ul?Math.max(ulM*12,300)*dur:0)))+" "+tx("cur"),c:T.dim}].map(function(r,i){
                      return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+T.bl}}>
                        <span style={{fontSize:12,color:T.dim,fontFamily:FB}}>{r.l}</span>
                        <span style={{fontSize:14,fontWeight:700,color:r.c,fontFamily:MN}}>{r.v}</span>
                      </div>;
                    })}
                  </div>
                </Sec>
                
                <Sec T={T} t={tx("investPart")} type="must">
                  <div className="table-responsive">
                {function(){
                  var piRealFV=fvDaily(piReal,iy/100,dur);
                  var pvF=calc.pvF||1;
                  var piRealPension=pvF>0?(piRealFV+(calc.ulSavings||0))/pvF:0;
                  var w=mW(T),si={...mI(T),fontSize:12};
                  return(
                    <div style={{padding:"4px 0", minWidth:"450px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"var(--g4)",gap:6,padding:"4px 0",borderBottom:"2px solid "+T.red,marginBottom:6}}>
                        <div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase"}}>PI</div>
                        <div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",textAlign:"right"}}>{tx("realSum")}</div>
                        <div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",textAlign:"right"}}>{tx("pension")}</div>
                        <div style={{fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",textAlign:"right"}}>{tx("month")}</div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"var(--g4)",gap:6,alignItems:"center",padding:"8px 0"}}>
                        <div style={{fontSize:12,fontWeight:600,color:T.text}}>{tx("addPI")}</div>
                        <div style={w} className="inp-wrap"><input type="number" value={piReal} onChange={function(e){sPiReal(Number(e.target.value));}} min={0} style={si}/><span style={{fontSize:9,color:T.dim}}>{tx("cur")}</span></div>
                        <div style={{textAlign:"right",fontSize:13,fontWeight:700,color:"#22863a",fontFamily:MN}}>{fmt(Math.round(piRealPension))+" "+tx("cur")}</div>
                        <div style={{textAlign:"right",fontSize:13,fontWeight:600,color:T.text,fontFamily:MN}}>{fmt(piReal,2)+" "+tx("cur")}</div>
                      </div>
                    </div>
                  );
                }()}
                </div>
              </Sec>
              </div>

              <div>
                <div style={{background:T.card,borderRadius:8,padding:"22px",border:"1px solid "+T.border,marginBottom:24,boxShadow:"0 4px 18px rgba(0,0,0,0.04)"}}>
                   <div style={{fontSize:11,fontWeight:700,color:T.dim,fontFamily:FH,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:10}}>{tx("fvInvestment")}</div>
                   <div style={{fontSize:42,fontWeight:800,color:T.red,fontFamily:MN,lineHeight:1.1,marginBottom:16}}>
                      {fmt(Math.round(fvDaily(piReal,iy/100,dur)+(calc.ulSavings||0)))} <span style={{fontSize:24}}>{tx("cur")}</span>
                   </div>
                   <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,borderTop:"1px solid "+T.bl,paddingTop:14}}>
                      <div>
                         <div style={{fontSize:10,color:T.dim,fontFamily:FB,marginBottom:2}}>{tx("ofWhichPI")}</div>
                         <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:MN}}>{fmt(Math.round(fvDaily(piReal,iy/100,dur)))} {tx("cur")}</div>
                      </div>
                      <div>
                         <div style={{fontSize:10,color:T.dim,fontFamily:FB,marginBottom:2}}>{tx("ofWhichUL")}</div>
                         <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:MN}}>{fmt(Math.round(calc.ulSavings||0))} {tx("cur")}</div>
                      </div>
                      <div>
                         <div style={{fontSize:10,color:T.dim,fontFamily:FB,marginBottom:2}}>{tx("appreciation")}</div>
                         <div style={{fontSize:14,fontWeight:700,color:"#22863a",fontFamily:MN}}>+{fmt(Math.max(0,Math.round(fvDaily(piReal,iy/100,dur)+(calc.ulSavings||0)-(piReal+(ul?Math.max(ulM*12,300)/12:0))*dur*12)))} {tx("cur")}</div>
                      </div>
                   </div>
                </div>

                <Sec T={T} t={tx("yearlyOverview")} type="must">
                  <div className="table-responsive">
                    <div style={{minWidth:"450px"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{borderBottom:"2px solid "+T.red}}>
                      {[tx("year"),tx("depTotal"),tx("futureVal"),tx("profit")].map(function(h,i){return <th key={i} style={{padding:"8px 4px",textAlign:"right",fontSize:9,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>;})}
                    </tr></thead>
                    <tbody>{[5,10,15,20,25,30].filter(function(y){return y<=dur;}).map(function(yr){
                      var dep=piReal*yr*12;var val=fvDaily(piReal,iy/100,yr);var p=val-dep;
                      return <tr key={yr} style={{borderBottom:"1px solid "+T.bl}}>
                        <td style={{padding:"8px 4px",textAlign:"right",fontWeight:700,color:T.text,fontFamily:MN}}>{yr}</td>
                        <td style={{padding:"8px 4px",textAlign:"right",fontFamily:MN,color:T.dim}}>{fmt(Math.round(dep))}</td>
                        <td style={{padding:"8px 4px",textAlign:"right",fontFamily:MN,fontWeight:700,color:T.red}}>{fmt(Math.round(val))}</td>
                        <td style={{padding:"8px 4px",textAlign:"right",fontFamily:MN,color:p>=0?"#22863a":T.text}}>+{fmt(Math.round(p))}</td>
                      </tr>;
                    })}</tbody>
                  </table>
                    </div>
                  </div>
                </Sec>
              </div>
          </div></>)}

          {/* ─ MODEL POISTENIA ──────────────────────────────────── */}
          {(tab==="model"||printMode)&&(<>
            {printMode&&<div className="print-tab-title" style={{gridColumn:"1 / -1"}}><h2 style={{fontSize:16,fontWeight:800,color:"#AB0534",margin:"20px 0 10px"}}>{tx("tabCoverModelHeader")}</h2></div>}
            <div className="center-col">
              <Sec T={T} t={tx("tabCoverHeaderRizik")} type="must">
                {/* Credit Guard */}
                <div style={{padding:"0 0 12px",borderBottom:"1px solid "+T.bl,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                     <span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:FH}}>{tx("cgTitle")}</span>
                     <div style={{display:"flex",gap:12}}>
                        <Chk T={T} l={tx("activate")} ch={cg} c={sCg}/>
                        {cg&&<Sel T={T} v={cgDD?"dd":"d"} c={function(v){sCgDD(v==="dd");}} o={[{v:"d",l:tx("deathOnly")},{v:"dd",l:tx("deathDis")}]}/>}
                     </div>
                  </div>
                  {cg&&<div className="table-responsive"><div style={{minWidth:"450px"}}><CH T={T} L={L}/><DR T={T} l={cgDD?tx("deathAndDis"):tx("death")} sg={calc.sugCGDeath} si={cgS} sc={sCgS} dur={cgD} dc={sCgD} pr={cgPr} b={true}/></div></div>}
                </div>

                {/* Metlife UL */}
                <div style={{padding:"0 0 12px",borderBottom:"1px solid "+T.bl,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                     <span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:FH}}>{tx("tabCoverHeaderMetlifeHlavne")}</span>
                     <Chk T={T} l={tx("withUL")} ch={ul} c={sUl}/>
                  </div>
                  {ul&&(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:12,padding:"10px",background:T.input,borderRadius:6,border:"1px solid "+T.border}}>
                      <Inp T={T} l={tx("investUL")+" "+tx("min25")} v={ulM} c={sUlM} s={tx("cur")+"/m"} mn={25}/>
                      <div><div style={mL(T)}>{tx("savML")}</div><div style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:MN,marginTop:4}}>{fmt(Math.round(calc.ulSavings))+" "+tx("cur")}</div></div>
                      <Inp T={T} l={tx("embDeath")} v={embO!==""?embO:Math.round(calc.embDeath)} c={sEmbO} s={tx("cur")}/>
                    </div>
                  )}
                  <div className="table-responsive"><div style={{minWidth:"450px"}}><CH T={T} L={L}/><DR T={T} l={tx("death")} sg={calc.sugULDeath} si={ulDS} sc={sUlDS} dur={ulDur} dc={sUlDur} pr={ulDeathPr} b={true}/></div></div>
                </div>

                {/* CARE */}
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                     <span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:FH}}>{tx("careTitle")}</span>
                     <Sel T={T} v={cp} c={sCp} o={Object.keys(CARE_PLANS).map(function(k){return{v:k,l:k};})}/>
                  </div>
                  {careActive&&(<div className="table-responsive"><div style={{minWidth:"450px"}}><CH T={T} L={L}/>
                    <DR T={T} l={tx("disTEMC")} si={careVals[0]} dur={cDiD} dc={sCDiD} pr={cDisPr}/>
                    <DR T={T} l={tx("permDis")} si={careVals[1]} dur={cDiD} pr={cPDPr}/>
                    <DR T={T} l={tx("ci40")} si={careVals[2]} pr={cCIPr}/>
                    <DR T={T} l={tx("cancer")} si={careVals[3]} pr={cCaPr}/>
                    <DR T={T} l={tx("insitu")} si={careVals[4]} pr={cInPr}/>
                  </div></div>)}
                </div>
              </Sec>
              
              <Sec T={T} t={tx("tabCoverHeaderDoplnkSluzby")} type="must">
                <div className="table-responsive">
                <div style={{minWidth:"450px"}}>
                <CH T={T} L={L}/>
                <DR T={T} l={tx("accDeath")} si={aDS} sc={sADS} dur={aDDur} dc={sADDur} pr={aDPr} b={true}/>
                <DR T={T} l={tx("permCons")} sg={calc.sugPermDis} si={pDS} sc={sPDS} dur={pDDur} dc={sPDDur} pr={pDPr} b={true}/>
                <DR T={T} l={tx("critIll")} sg={calc.sugCI} si={ciS} sc={sCiS} dur={ciDur} dc={sCiDur} pr={ciPr} b={true}/>
                <div style={{margin:"16px 0",paddingTop:12,borderTop:"1px dashed "+T.border}}>
                  <NR T={T} l={tx("hospital")} note={"5-300 "+tx("cur")} si={hS} sc={sHS} pr={hPr} mx={300}/>
                  <NR T={T} l={tx("surgical")} note={"150-5000 "+tx("cur")} si={sS} sc={sSS} pr={sPr} mx={5000}/>
                  <NR T={T} l={tx("fractures")} note={"500-1500 "+tx("cur")} si={fS} sc={sFS} pr={fPr} mx={1500}/>
                </div>
                </div>
                </div>
                <div style={{padding:"12px 0",display:"flex",gap:16,flexWrap:"wrap"}}>
                  <Chk T={T} l={tx("telemed")+" (+15 "+tx("cur")+")"} ch={telOn} c={sTelOn}/>
                  <Chk T={T} l={tx("waiver")} ch={wavOn} c={sWavOn}/>
                </div>
                {wavOn&&(<div style={{display:"grid",gridTemplateColumns:G5,gap:3,alignItems:"center",padding:"4px 0",borderBottom:"1px solid "+T.bl}}>
                  <div style={{fontWeight:600,color:T.text,fontSize:11}}>{tx("waiver")}</div>
                  <div style={{textAlign:"right",fontSize:10,color:T.dim,fontFamily:MN}}>{fmt(riskSum+ulYr,2)+" \u20ac"}</div>
                  <div style={{textAlign:"right",fontSize:10,color:T.dim,fontFamily:MN}}>{fmt(riskSum+ulYr,2)+" \u20ac"}</div>
                  <div style={{textAlign:"center",fontSize:9,color:T.red,fontWeight:700}}>{tx("yes")}</div>
                  <div style={{textAlign:"right",fontSize:11,fontWeight:700,color:T.red,fontFamily:MN}}>{fmt(wvPr,2)+" \u20ac"}</div>
                </div>)}
              </Sec>
            </div>

            <div className="right-col">
              <div className="totals-card" style={{borderRadius:8,padding:"26px 22px",position:"sticky",top:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                  <span style={{fontSize:12,fontWeight:700,fontFamily:FB,letterSpacing:"0.05em",textTransform:"uppercase",opacity:0.8,color:"#fff"}}>{tx("totalYearly")}</span>
                  <span style={{fontSize:32,fontWeight:800,fontFamily:MN,letterSpacing:"-0.02em",color:"#fff",whiteSpace:"nowrap"}}>{fmt(tY,2)+"\u00A0"+tx("cur")}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:FB,opacity:0.8,color:"#fff"}}>{tx("riskPart")}</span>
                  <span style={{fontSize:18,fontWeight:700,fontFamily:MN,color:"#fff",whiteSpace:"nowrap"}}>{fmt(rP,2)+"\u00A0"+tx("cur")}</span>
                </div>
                
                <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:16,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                  <div className="metric-pill">
                    <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:FB,marginBottom:6,opacity:0.8,color:"#fff"}}>{tx("pillRisk")}</div>
                    <div style={{fontSize:18,fontWeight:800,fontFamily:MN,color:"#fff"}}>{tY>0?((rP/tY)*100).toFixed(0)+"%":"0%"}</div>
                  </div>
                  <div className="metric-pill">
                     <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:FB,marginBottom:6,opacity:0.8,color:"#fff"}}>{tx("pillInvest")}</div>
                    <div style={{fontSize:18,fontWeight:800,fontFamily:MN,color:"#fff"}}>{(investOnInc*100).toFixed(1)+"%"}</div>
                  </div>
                  <div className="metric-pill">
                    <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:FB,marginBottom:6,opacity:0.8,color:"#fff"}}>{tx("pillExpenses")}</div>
                    <div style={{fontSize:18,fontWeight:800,fontFamily:MN,color:"#fff"}}>{(riskOnInc*100).toFixed(1)+"%"}</div>
                  </div>
                </div>

                <div style={{marginTop:24,padding:"14px",background:"rgba(255,255,255,0.1)",borderRadius:6}}>
                  <div style={{fontSize:11,fontFamily:FB,opacity:0.8,marginBottom:4,color:"#fff"}}>{tx("monthlyPiAndModel")}</div>
                  <div style={{fontSize:24,fontWeight:800,fontFamily:MN,color:"#fff"}}>{fmt(tY/12,2)+" \u20ac"}</div>
                </div>
              </div>
            </div>
          </>)}
          
        </div>
        <div style={{marginTop:40,textAlign:"center",fontSize:10,color:T.dim,fontFamily:FB}}>{"\u00a9 PARTNERS GROUP SK \u2022 "+tx("title")+" \u2022 BG 3/2026"}</div>
      </div>
    </div>
  );
}