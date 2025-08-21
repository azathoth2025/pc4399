export interface ClientPC {
  getSAuthJson: () => Promise<SAuthJsonPC>;
}

interface SAuthJson {
  aim_info: string;
  app_channel: string;
  login_channel: string;
  client_login_sn: string;
  platform: string;
  source_platform: string;
  sdk_version: string;
  sdkuid: string;
  deviceid?: string;
  gameid: string;
  sessionid: string;
  udid: string;
  ip: string;
}

export type SAuthJsonPC = SAuthJson;
