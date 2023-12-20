import { CCApiFtpAttr, CCApiMdAlarm, CCApiNetAttr, CCApiNtpAttr, CCApiOverlayAttr, CCApiSearchWireless, CCApiServerInfo, CCApiUserAttr, CCApiVideoAttr, getCCApi, getCCApiArray } from "./cam-cgi-api";

console.log("hello, world!");

async function main () {
  const videoattr = await getCCApi<CCApiVideoAttr>("CCApiVideoAttr");
  console.log(JSON.stringify(videoattr, null, " "));

  const netattr = await getCCApi<CCApiNetAttr>("CCApiNetAttr");
  console.log(JSON.stringify(netattr, null, " "));

  const overlay0 = await getCCApi<CCApiOverlayAttr>("CCApiOverlayAttr0");
  console.log(JSON.stringify(overlay0, null, " "));

  const overlay1 = await getCCApi<CCApiOverlayAttr>("CCApiOverlayAttr1");
  console.log(JSON.stringify(overlay1, null, " "));

  const userattr = await getCCApi<CCApiUserAttr>("CCApiUserAttr");
  console.log(JSON.stringify(userattr, null, " "));

  const ftpattr = await getCCApi<CCApiFtpAttr>("CCApiFtpAttr");
  console.log(JSON.stringify(ftpattr, null, " "));

  const serverInfo = await getCCApi<CCApiServerInfo>("CCApiServerInfo");
  console.log(JSON.stringify(serverInfo, null, " "));

  const ntpattr = await getCCApi<CCApiNtpAttr>("CCApiNtpAttr");
  console.log(JSON.stringify(ntpattr, null, " "));

  const mdalarm = await getCCApi<CCApiMdAlarm>("CCApiMdAlarm");
  console.log(JSON.stringify(mdalarm, null, " "));

  const wireless = await getCCApiArray<CCApiSearchWireless>("CCApiSearchWireless");
  console.log(JSON.stringify(wireless, null, " "));
}

main();


