// const posts = document.querySelectorAll('.artdeco-carousel__slider.ember-view .ember-view a');
// const urns = Array.from(posts)
//   .map(a => a.href)
//   .filter(href => href.includes('urn:li:activity'))
//   .map(href => {
//     const match = href.match(/urn:li:activity:\d+/);
//     return match ? match[0] : null;
//   })
//   .filter(Boolean);

// console.log(urns);

// ////////////////////

// const res = await fetch("https://www.linkedin.com/voyager/api/graphql", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "csrf-token": "ajax:<csrf_token>",
//     "cookie": "li_at=<your_li_at_cookie>",
//   },
//   body: JSON.stringify({
//     query: `query { ... }`, // use the query above
//     variables: {
//       profileUrn: "urn:li:fsd_profile:ACoAAAQrCgoBZCZt2tAXmpXdBULW_QBojZp4vxE",
//       count: 10,
//     },
//   }),
// });

// const data = await res.json();
// console.log(data);

// -------------------------------------------------------------
const url =
  "https://www.linkedin.com/posts/shalinijundhare_harvard-university-just-released-free-online-activity-7320446659744702466-k4ma/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFnqPhABBCBE0n5YJYWKg9SiWltrg-5M0HU";
const match = url.match(/activity-(\d+)-/);
console.log("match-", match);
const activityId = match ? match[1] : null;
console.log("activityId-", activityId);
const activityUrn = activityId ? `urn:li:activity:${activityId}` : null;
console.log("Activity URN:", activityUrn);




///
bcookie="v=2&095a5fa3-7249-4adb-8d74-9a59b49b1644"; bscookie="v=1&2025041809345680794a83-c573-4380-89a9-d0cab22c47b5AQF3IC3V7dEPRFso1fBurM5S1INmFoLH"; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; li_sugr=0759bee4-c9fa-4537-8cba-863948ab5938; _guid=d372f139-f81c-4519-b6c6-69ff90b799d7; dfpfpt=6e33b61a741b4e878e521ca830691709; aam_uuid=40055468509829061671320128096958346019; visit=v=1&M; li_rm=AQE5o1CTTMHomAAAAZZIR9TMTWyWz6aQK-BMaCkJJ7sc4I3f_mZrolv5NQFgk5GYqphdVKV1WeJ79U99-JTJ90t1CTwpMrasIuIPZYxDi3EqmGegu5wZBhCJ4xMV8Zp5qOA9M_vxciEBZemZSxWxYn50S8-K3VEh2i2oau1jrT_tymLnueAOHJj_jwWJFugN5wyJ9fOOQ-tKvuSznwnJLmUfMf1WtgV4X0kwVuFuWJo8eg9BGMd8MOruI38FcAlLTHOweXPofo2c1KL86DuaLhB0UzrTO4kFbwIFPNRNHhsLEQt3SvzUQ4wYxNPJbqMz24oDE5IyWFCQmtSYcf0; gpv_pn=developer.linkedin.com%2F; s_tp=3486; AnalyticsSyncHistory=AQL89U1yYHbHMAAAAZZXwgu3Uhcknx7TVe_VIwMolQk6CRQLsJJxLbtNI3_QCLO9bZCFbCdTMd98tYwgOTKI6w; lms_ads=AQEAcsBCKdAFkAAAAZZXwgz6-BF8XHBj5u_k3Ye5N0Bmo4f5KRG0YaJlEBnhgXf4nmDh-VWf0OveirIn6PtPSVmlfH0HPbYb; lms_analytics=AQEAcsBCKdAFkAAAAZZXwgz6-BF8XHBj5u_k3Ye5N0Bmo4f5KRG0YaJlEBnhgXf4nmDh-VWf0OveirIn6PtPSVmlfH0HPbYb; s_ips=695; fid=AQEHdtMxeDD_vAAAAZZZk3WomeHjEfM09cMHXzbsykNPNjCi_52XMCOlcOGzGSaQewdIjEcPVpm0SQ; _uetvid=06db78901e7c11f083b6ffa60746fc08; s_tslv=1745301387453; mbox=PC#123beebb94b646a0bac8d0f45a225dff.37_0#1760853388|session#bfc8fa8afc484445b1ab2c7bab1c71e5#1745303248; sdui_ver=sdui-flagship:0.1.2346; JSESSIONID="ajax:1585394358242614312"; g_state={"i_l":0}; li_at=AQEDAVnqPhACuV2IAAABll083OEAAAGWgUlg4VYAFv_576SwM2O8f2nn96fPKuo6gtuiHsJ5348oLe0SP8hw6AyxvSDxHCu7unaHHcqeOwK53UrcEYRdTbPuH9wPmYLNVYQ7cxrjtjziX3pN6Zx3WeR_; liap=true; _gcl_au=1.1.565830213.1744968917.1228599076.1745325650.1745325847; lang=v=2&lang=en-us; fptctx2=taBcrIH61PuCVH7eNCyH0FC0izOzUpX5wN2Z%252b5egc%252f4O5vB6Z50Ts2iZSiEpsZb8Z4ElWXfodtbhyVvjT0Qr9RyTFIwfCtQPRDLp%252bohFet45yHEi1u%252bprMjPh72R4%252f9xl1yFmTERKtvUXpXGGO6ieAHDhQcB0dI1yUUl2fsDtQIZ7qOmFkecdFDiGeMDGwHSTlctnYNWgTjkvymh33AH0FD3Iz0raD2PIZ%252bFVpfDe9%252bsIg0wz3FwSMeEBGjCn%252bGrz60LC9yUmCCkZIBiBjAh7YMqut5nM7ngegdLiJxSvK5hfKFt6CzZmQRZE9G%252f28w7mD%252fedbX%252bYpHV%252fYzDuUte5AcHFGt7tA6acqA8Usn7jk8%253d; UserMatchHistory=AQJNST6mHqV_wQAAAZZhOEZh4YddxG-k0oPC8o2An50gaFREKfBGcqhug-u2XsrDADkI3FZLEl5UGaDNs6ObULmtTzgfhcYm-01uEu76KgbOfCvEmPcKF3j-AU_GHrxyI1_VZXaPqGlW8gjPhZ-gL1X_0bZhKUiXV5jtw9d5GJx3XMUkXLJQC_KTEqvWEQFBusKDX2EF0xuhlW4bisUoVX0gF1b9sCnRhswn-BSKipiH9O5lig9RaQo01E349YsEQRnuMWFFxd9psD8LhmagX0rdOKpvXy0QEJGHJfIY0UFFuUC4yNV_Y0M5khAPF1JYMTqy9yhvRQES7UYrQM9J4LEjK7afxoxD3cquHTQOnn7WW_V5jA; lidc="b=TB36:s=T:r=T:a=T:p=T:g=22076:u=5:x=1:i=1745387802:t=1745473689:v=2:sig=AQFSEhPELzc9ZdwSM8_8MuklS-bj_HVT"; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C20201%7CMCMID%7C39883955507963973081341270862481064168%7CMCAAMLH-1745992602%7C12%7CMCAAMB-1745992602%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1745395002s%7Cpartner%7CMCCIDH%7C209649908%7CvVersion%7C5.1.1>to