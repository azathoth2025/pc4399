import type { ClientPC, SAuthJsonPC } from "../types";
import axios from "axios";
import * as cheerio from "cheerio";
import { randomUniqueId, randomUserAgent } from "@/random";
import { encryptPassword } from "./cipher";
import { Games4399LoginCaptchaError, Games4399LoginError, Games4399RegisterCaptchError, Games4399RegisterError } from "./errors";

export class ClientPCImpl implements ClientPC {
  constructor(
    readonly cookies: string[],
  ) { }

  getCookies(): string[] {
    return this.cookies;
  }

  static async login({
    captcha,
    captcha_id,
    password,
    proxy,
    username,
  }: {
    username: string;
    password: string;
    captcha?: string;
    captcha_id?: string;
    proxy?: {
      host: string;
      port: number;
      protocol: "http" | "https";
    };
  }): Promise<any> {
    const response = await axios.post<string>(
      "https://ptlogin.4399.com/ptlogin/login.do?v=1",
      {
        appId: "kid_wdsj",
        bizId: "2100001792",
        css: "", // loginUrlParams.get('css')
        displayMode: "popup",
        externalLogin: "qq",
        gameId: "wd",
        includeFcmInfo: "false",
        inputCaptcha: captcha ?? "",
        layout: "vertical",
        layoutSelfAdapting: "true",
        level: "8",
        loginFrom: "uframe",
        mainDivId: "popup_login_div",
        password: encryptPassword(password),
        postLoginHandler: "default",
        redirectUrl: "",
        regLevel: "8",
        sec: "1",
        sessionId: captcha_id ?? "",
        username,
        userNameLabel: "4399用户名",
        userNameTip: "请输入4399用户名",
        welcomeTip: "欢迎回到4399",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": randomUserAgent(),
        },
        proxy,
      },
    );

    const $ = cheerio.load(response.data, {
      baseURI: "https://ptlogin.4399.com/",
    });
    // 获取错误信息
    const errorMessage = $("#Msg").text().trim();
    // 验证码错误
    if (errorMessage === "验证码错误") {
      const captchaId = $("input[name=\"sessionId\"]").val() as string;
      const captchaUrl = $("#captcha").prop("src") as string;
      throw new Games4399LoginCaptchaError(
        "请输入验证码",
        captchaId,
        captchaUrl,
      );
    }
    // 其他错误
    if (errorMessage) {
      throw new Games4399LoginError(errorMessage);
    }
    // 获取cookies
    const cookies = response.headers["set-cookie"];
    if (!cookies) {
      throw new Games4399LoginError("未获取到cookies");
    }
    const clientInstance = new this(
      cookies,
    );
    const sauthJson = await clientInstance.getSAuthJson();
    await axios.post(
      "https://mgbsdk.matrix.netease.com/x19/sdk/uni_sauth",
      {
        sdklog: JSON.stringify({
          app_ver: "840265012",
          country_code: "CN",
          device_model: "Xiaomi 13",
          imei: "",
          is_emulator: 0,
          is_root: 0,
          msa_oaid: "",
          oaid: "",
          os_name: "android",
          os_ver: "13",
          udid: sauthJson.udid,
        }),
        ...sauthJson,
      },
    );
    return clientInstance;
  }

  static async register({
    captcha,
    captcha_id,
    password,
    proxy,
    username,
  }: {
    username: string;
    password: string;
    captcha?: string;
    captcha_id?: string;
    proxy?: {
      host: string;
      port: number;
      protocol: "http" | "https";
    };
  }): Promise<any> {
    const response = await axios.post<string>(
      "https://ptlogin.4399.com/ptlogin/register.do?v=1",
      {
        aid: "",
        appId: "kid_wdsj",
        bizId: "2100001792",
        cid: "",
        crossDomainIFrame: "",
        crossDomainUrl: "",
        css: "", // '//uc.img4399.com/sso/intl/css/skin.css',
        displayMode: "embed",
        email: "",
        expandFcmInput: "false",
        externalLogin: "qq",
        fcmFakeValidate: "true",
        gameId: "wd",
        iframeId: "popup_reg_frame",
        includeFcmInfo: "false",
        inputCaptcha: captcha,
        level: "6",
        mainDivId: "popup_reg_div",
        noEmail: "",
        password: encryptPassword(password),
        passwordveri: encryptPassword(password),
        postLoginHandler: "refreshParent",
        realnameValidate: "false",
        redirectUrl: "",
        ref: "",
        reg_eula_agree: "on",
        regIdcard: "false",
        regMode: "reg_normal",
        sec: "1",
        sessionId: captcha_id ?? "",
        showRegInfo: "true",
        username,
        userNameLabel: "4399用户名",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": randomUserAgent(),
        },
        proxy,
      },
    );

    const $ = cheerio.load(response.data, {
      baseURI: "https://ptlogin.4399.com/",
    });
    // 获取错误信息
    const errorMessage = $("#Msg").text().trim();
    // 验证码错误
    if (errorMessage === "验证码错误") {
      const captchaId = $("input[name=\"sessionId\"]").val() as string;
      const captchaUrl = $("#captcha").prop("src") as string;
      throw new Games4399RegisterCaptchError(
        "请输入验证码",
        captchaId,
        captchaUrl,
      );
    }
    // 其他错误
    if (errorMessage) {
      throw new Games4399RegisterError(errorMessage);
    }
    // 获取cookies
    const cookies = response.headers["set-cookie"];
    if (!cookies) {
      throw new Games4399RegisterError("未获取到cookies");
    }
    const clientInstance = new this(
      cookies,
    );
    const sauthJson = await clientInstance.getSAuthJson();
    await axios.post(
      "https://mgbsdk.matrix.netease.com/x19/sdk/uni_sauth",
      {
        sdklog: JSON.stringify({
          app_ver: "840265012",
          country_code: "CN",
          device_model: "Xiaomi 13",
          imei: "",
          is_emulator: 0,
          is_root: 0,
          msa_oaid: "",
          oaid: "",
          os_name: "android",
          os_ver: "13",
          udid: sauthJson.udid,
        }),
        ...sauthJson,
      },
    );
    return clientInstance;
  }

  async getSAuthJson(): Promise<SAuthJson4399PC> {
    const uauthCookie = this.cookies.find(u => u.startsWith("Uauth="));
    if (!uauthCookie)
      throw new Games4399RegisterError("未获取到Uauth cookie");

    const timestamp = uauthCookie
      .split(";")[0] // 去除后面 Path/Domain/Expires
      .split("=")[1] // 得到 "4399|1|…"
      .split("|")[4]; // 拿到第五段 ⇒ "1754274754471"

    const cookieHeader = this.cookies
      .map(s => s.split(/; */)[0]) // 去除 Path/Domain/Expires
      .filter(pair => !pair.startsWith("USESSIONID="))
      .join("; ");

    const getRedirect = await axios.get<void>(
      `http://ptlogin.4399.com/ptlogin/checkKidLoginUserCookie.do?appId=kid_wdsj&gameUrl=http://cdn.h5wan.4399sj.com/microterminal-h5-frame?game_id%3D500352&rand_time=${timestamp}&nick=null&onLineStart=false&show=1&isCrossDomain=1&retUrl=http://ptlogin.4399.com/resource/ucenter.html`,
      {
        headers: {
          "Cookie": cookieHeader,
          "User-Agent": randomUserAgent(),
        },
        maxRedirects: 0,
        validateStatus(status) {
          return status === 200 || status === 302;
        },
      },
    );

    const url = new URL(getRedirect.headers.location);

    const sdkLoginInfoResponse = await axios.get<SdkLoginInfoResponse> (
      `https://microgame.5054399.net/v2/service/sdk/info`,
      {
        headers: {
          "User-Agent": randomUserAgent(),
        },
        params: {
          queryStr: url.searchParams.toString(),
        },
      },
    );

    const sdkLoginInfo = new URLSearchParams(sdkLoginInfoResponse.data.data.sdk_login_data);
    return {
      aim_info: "{\"aim\":\"\",\"country\":\"CN\",\"tz\":\"+0800\",\"tzid\":\"Asia\\/Shanghai\"}",
      app_channel: "4399pc",
      client_login_sn: randomUniqueId(),
      deviceid: randomUniqueId(),
      gameid: "x19",
      gas_token: "",
      ip: "",
      login_channel: "4399pc",
      platform: "pc",
      realname: "{\"realname_type\":\"0\"}",
      sdk_version: "1.0.0",
      sdkuid: sdkLoginInfo.get("uid") as string,
      sessionid: sdkLoginInfo.get("token") as string,
      source_platform: "pc",
      timestamp: sdkLoginInfo.get("time") as string,
      udid: randomUniqueId(),
      userid: sdkLoginInfo.get("username") as string,
    };
  }
}

export interface SAuthJson4399PC extends SAuthJsonPC {
  app_channel: "4399pc";
  login_channel: "4399pc";
  platform: "pc";
  source_platform: "pc";
  gas_token: string;
  realname: string;
  timestamp: string;
  userid: string;
}

interface SdkLoginInfoResponse {
  code: number;
  msg: string;
  data: {
    ops: [
      {
        name: string;
        link: string;
        banner: string;
        type: number;
      },
      {
        name: string;
        link: string;
        type: number;
      },
      {
        name: string;
        link: string;
        type: number;
      },
      {
        name: string;
        link: string;
        type: number;
      },
    ];
    username: string;
    login_tip: string;
    sdk_login_data: string;
  };
}
