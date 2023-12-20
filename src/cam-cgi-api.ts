import { hostname, password, username } from "./cam-cgi-api.config";


const baseUrl = `http://${hostname}/cgi-bin/hi3510/param.cgi?`;

async function getServerData(cmd: string): Promise<string> {
  return (fetch(baseUrl + cmd, {
    headers: {
      "Authorization": `Basic ${btoa(`${username}:${password}`)}`
    },
    credentials: "include",
  })).then((res) => {
    if (res.status !== 200) {
      return Promise.reject(new Error(`code: ${res.status} : message: ${res.statusText}`));
    } else {
      return res.text();
    }
  });
}

type CCApiTemplate = {
  command: string,
  function_generator: (serverText: string) => string,
}

/**
    var videomode = "31";
    var vinorm = "N";
    var profile = "1";
    var maxchn = "2";
 */
export type CCApiVideoAttr = {
  videomode: number;
  vinorm: "N" | "P";  // N: NTSC 60Hz, P: PAL: 50Hz
  profile: number;
  maxchn: number;
};

const CCApiVideoAttrTemplate: CCApiTemplate = {
  command: "cmd=getvideoattr",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {videomode: parseInt(videomode), vinorm, profile: parseInt(profile), maxchn: parseInt(maxchn)}
      `
  }
}
/**
 * 
var dhcpflag="on";
var ip="192.168.10.78";
var netmask="255.255.255.0";
var gateway="192.168.10.1";
var dnsstat="1";
var fdnsip="192.168.10.1";
var sdnsip="";
var macaddress="00:C2:13:F8:0C:BD";
var networktype="LAN";
 */

export type CCApiNetAttr = {
  dhcpflag: string;
  ip: string,
  netmask: string;
  gateway: string;
  dnsstat: number;
  fdnsip: string,
  sdnsip: string,
  macaddress: string,
  networktype: string,
};

const CCApiNetAttrTemplate: CCApiTemplate = {
  command: "cmd=getnetattr",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {dhcpflag, ip, netmask, gateway, dnsstat: parseInt(dnsstat), fdnsip, sdnsip, macaddress, networktype}
      `
  }
}

/**
var show_0="1";
var place_0="0";
var x_0="976";
var y_0="0";
var name_0="YYYY-MM-DD hh:mm:ss";
 */
export type CCApiOverlayAttr = {
  show: number,
  place: number,
  x: number,
  y: number,
  name: string,
};

const CCApiOverlayAttr0Template: CCApiTemplate = {
  command: "cmd=getoverlayattr&-region=0",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {show: show_0, place: place_0, x: x_0, y: y_0, name: name_0}
      `
  }
}

const CCApiOverlayAttr1Template: CCApiTemplate = {
  command: "cmd=getoverlayattr&-region=1",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {show: show_1, place: place_1, x: x_1, y: y_1, name: name_1}
      `
  }
}

/**
 * var at_username0="admin";
var at_password0="****";
var at_authlevel0="15";
var at_username1="user";
var at_password1="user";
var at_authlevel1="3";
var at_username2="guest";
var at_password2="guest";
var at_authlevel2="1";
 */
export type CCApiUserAttr = {
  at_username0: string,
  at_password0: string,
  at_authlevel0: number,
  at_username1: string,
  at_password1: string,
  at_authlevel1: number,
  at_username2: string,
  at_password2: string,
  at_authlevel2: number,
};

const CCApiUserAttrTemplate: CCApiTemplate = {
  command: "cmd=getuserattr",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {
          at_username0, at_password0, at_authlevel0: parseInt(at_authlevel0), 
          at_username1, at_password1, at_authlevel1: parseInt(at_authlevel1), 
          at_username2, at_password2, at_authlevel2: parseInt(at_authlevel2), 
        }
      `
  }
}

/**
 * 
var ft_server="";
var ft_port="21";
var ft_username="";
var ft_password="";
var ft_mode="1";
var ft_dirname="./";
var ft_autocreatedir="1";
 */
export type CCApiFtpAttr = {
  ft_server: string,
  ft_port: number,
  ft_username: string,
  ft_password: string,
  ft_mode: number,
  ft_dirname: string,
  ft_autocreatedir: number,
};

const CCApiFtpAttrTemplate: CCApiTemplate = {
  command: "cmd=getftpattr",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {
          ft_server, ft_port: parseInt(ft_port),
          ft_username, ft_password,
          ft_mode: parseInt(ft_mode),
          ft_dirname, 
          ft_autocreatedir: parseInt(ft_autocreatedir),
        }
      `
  }
}

/**
 * 
var model="C9F0SeZ3N0P8L0";
var hardVersion="V1.0.0.1";
var softVersion="V13.1.30.5.3-20190820";
var webVersion="V1.0.1";
var name="IPCAM";
var startdate="2023-12-20 16:38:29";
var upnpstatus="off";
var facddnsstatus="off";
var th3ddnsstatus="off";
var platformstatus="0";
var sdstatus="Ready";
var sdfreespace="241558912";
var sdtotalspace="242391168";
 */

export type CCApiServerInfo = {
  model: string,
  hardVersion: string,
  softVersion: string,
  webVersion: string,
  name: string,
  startdate: string,
  upnpstatus: string,
  facddnsstatus: string,
  th3ddnsstatus: string,
  platformstatus: string,
  sdstatus: string,
  sdfreespace: number,
  sdtotalspace: number,
};

const CCApiServerInfoTemplate: CCApiTemplate = {
  command: "cmd=getserverinfo",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {
          model, hardVersion, softVersion, webVersion,
          name,
          startdate, upnpstatus, facddnsstatus, th3ddnsstatus, platformstatus,
          sdstatus, sdfreespace: parseInt(sdfreespace), sdtotalspace: parseInt(sdtotalspace),
        }
      `
  }
}

/**
 var ntpenable="1";
var ntpserver="time.nist.gov";
var ntpinterval="1";
 */
export type CCApiNtpAttr = {
  ntpenable: number,
  ntpserver: string,
  ntpinterval: number,
};

const CCApiNtpAttrTemplate: CCApiTemplate = {
  command: "cmd=getntpattr",
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {
          ntpenable: parseInt(ntpenable), ntpserver, ntpinterval: parseInt(ntpinterval)
        }
      `
  }
}

/**

var md_email_switch="off";
var md_emailsnap_switch="off";
var md_ftpsnap_switch="off";
var md_snap_switch="on";
var md_emailrec_switch="off";
var md_record_switch="on";
var md_ftprec_switch="off";
var md_relay_switch="off";

 */
export type CCApiMdAlarm = {
  md_email_switch: string,
  md_emailsnap_switch: string,
  md_snap_switch: string,
  md_record_switch: string,
  md_ftprec_switch: string,
  md_relay_switch: string,
}

const CCApiMdAlarmTemplate: CCApiTemplate = {
  command: 'cmd=getmdalarm&-aname=email&cmd=getmdalarm&-aname=emailsnap&cmd=getmdalarm&-aname=ftpsnap&cmd=getmdalarm&-aname=snap&cmd=getmdalarm&-aname=emailrec&cmd=getmdalarm&-aname=record&cmd=getmdalarm&-aname=ftprec&cmd=getmdalarm&-aname=relay',
  function_generator: (serverText: string): string => {
    return `
        ${serverText}
        return {
          md_email_switch, md_emailsnap_switch, md_snap_switch, md_record_switch,md_ftprec_switch,md_relay_switch
        }
      `
  }
}



/**
    var waccess_points="4";
    var wchannel=new Array();
    var wrssi=new Array();
    var wessid=new Array();
    var wenc=new Array();
    var wauth=new Array();
    var wnet=new Array();
 */
export type CCApiSearchWireless = {
  wchannel: number,
  wrssi: number,
  wessid: string,
  wauth: string,
  wnet: string,
}

const CCApiSearchWirelessTemplate: CCApiTemplate = {
  command: "cmd=searchwireless",
  function_generator: (serverText: string): string => {
    return `
    ${serverText}
    const array = [];
    wessid.forEach((item, i) => {
        array[i] = {
          wchannel: parseInt(wchannel[i]), 
          wrssi: parseInt(wrssi[i]), 
          wessid: wessid[i],
          wenc: wenc[i],
          wauth: wauth[i],
          wnet: wnet[i],
      }
    });
    return array;
  `;
  }
}


/**
 * *****************************************************************************
 */

export type CCApiDataTypes =
  "CCApiVideoAttr" | "CCApiNetAttr" |
  "CCApiOverlayAttr0" | "CCApiOverlayAttr1" |
  "CCApiUserAttr" | "CCApiFtpAttr" | 
  "CCApiServerInfo" | "CCApiNtpAttr" | "CCApiMdAlarm";

const CCApiTemplateTable: Record<CCApiDataTypes, CCApiTemplate> = {
  "CCApiVideoAttr": CCApiVideoAttrTemplate,
  "CCApiNetAttr": CCApiNetAttrTemplate,
  "CCApiOverlayAttr0": CCApiOverlayAttr0Template,
  "CCApiOverlayAttr1": CCApiOverlayAttr1Template,
  "CCApiUserAttr": CCApiUserAttrTemplate,
  "CCApiFtpAttr": CCApiFtpAttrTemplate,
  "CCApiServerInfo": CCApiServerInfoTemplate,
  "CCApiNtpAttr": CCApiNtpAttrTemplate,
  "CCApiMdAlarm": CCApiMdAlarmTemplate,
}

export type CCApiDataArrayTypes =
  "CCApiSearchWireless";

const CCApiTemplateTable2: Record<CCApiDataArrayTypes, CCApiTemplate> = {
  "CCApiSearchWireless": CCApiSearchWirelessTemplate,
}

export async function getCCApi<T>(templateName: CCApiDataTypes): Promise<T | null> {
  try {
    const template = CCApiTemplateTable[templateName];
    const serverText = await getServerData(template.command);
    // console.log(serverText);
    const func = new Function(template.function_generator(serverText));
    const obj: T = func();
    return Promise.resolve(obj);
  } catch (e) {
    console.error(e);
    return Promise.resolve(null);
  }
}

export async function getCCApiArray<T>(templateName: CCApiDataArrayTypes): Promise<T[]> {
  try {
    const template = CCApiTemplateTable2[templateName];
    const serverText = await getServerData(template.command);
    const func = new Function(template.function_generator(serverText));
    const obj: T[] = func();
    return Promise.resolve(obj);
  } catch (e) {
    console.error(e);
    return Promise.resolve([]);
  }
}
