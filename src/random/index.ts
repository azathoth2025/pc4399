import crypto from "node:crypto";

export function randomUniqueId(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function randomUserAgent(): string {
  type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | "Opera";
  type OS = "Windows" | "MacOS" | "Linux" | "iOS" | "Android";

  const browsers: Browser[] = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
  const osList: OS[] = ["Windows", "MacOS", "Linux", "iOS", "Android"];

  const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomElement = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

  const getRandomVersion = (maxMajor: number = 100): string => {
    const major = getRandomInt(50, maxMajor);
    const minor = getRandomInt(0, 9);
    const patch = getRandomInt(0, 99);
    return `${major}.${minor}.${patch}`;
  };

  const browser = getRandomElement(browsers);
  const os = getRandomElement(osList);
  const browserVersion = getRandomVersion();
  const webkitVersion = getRandomVersion(600);
  const osVersion = `${getRandomInt(10, 15)}_${getRandomInt(0, 9)}`;
  const androidVersion = `${getRandomInt(6, 12)}.${getRandomInt(0, 9)}`;

  switch (browser) {
    case "Chrome":
      return `Mozilla/5.0 (${
        os === "Android" ? `Linux; Android ${androidVersion}` : os
      }) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${browserVersion} Safari/${webkitVersion}`;
    case "Firefox":
      return `Mozilla/5.0 (${
        os === "Android" ? `Android ${androidVersion}` : os
      }) Gecko/20100101 Firefox/${browserVersion}`;
    case "Safari":
      return `Mozilla/5.0 (${
        os === "iOS"
          ? `iPhone; CPU iPhone OS ${osVersion} like Mac OS X`
          : os
      }) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Version/${getRandomVersion(
        15,
      )} Safari/${webkitVersion}`;
    case "Edge":
      return `Mozilla/5.0 (${
        os === "Windows" ? `Windows NT ${getRandomInt(10, 11)}.0` : os
      }) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${browserVersion} Safari/${webkitVersion} Edg/${browserVersion}`;
    case "Opera":
      return `Mozilla/5.0 (${
        os === "Android" ? `Linux; Android ${androidVersion}` : os
      }) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${browserVersion} Safari/${webkitVersion} OPR/${getRandomVersion()}`;
    default:
      throw new Error("Unsupported browser");
  }
}
