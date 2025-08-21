export class Games4399RegisterError extends Error {
  name = "Games4399RegisterError";
  constructor(message: string) {
    super(message);
  }
}

export class Games4399RegisterCaptchError extends Error {
  name = "Games4399RegisterCaptchError";
  constructor(
    message: string,
    readonly captchaId: string,
    readonly captchaUrl: string,
  ) {
    super(message);
  }
}

export class Games4399LoginError extends Error {
  name = "Games4399LoginError";
  constructor(
    message: string,
  ) {
    super(message);
  }
}

export class Games4399LoginCaptchaError extends Games4399LoginError {
  name = "Games4399LoginCaptchaError";
  constructor(
    message: string,
    readonly captchaId: string,
    readonly captchaUrl: string,
  ) {
    super(message);
  }
}
