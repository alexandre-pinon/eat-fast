import type { IO } from "fp-ts/IO";
import pinoLogger, { type Logger } from "pino";

let logger: Logger;
export const getLogger = () => {
  if (!logger) {
    const deploymentEnv = process.env.NODE_ENV || "development";
    logger = pinoLogger({
      level: deploymentEnv === "production" ? "info" : "debug",
    });
  }
  return logger;
};

export const logDebug: <T>(obj: T) => IO<void> = obj => () => {
  getLogger().debug(obj);
};
export const logInfo: (msg: string) => IO<void> = msg => () => {
  getLogger().info(msg);
};
export const logWarn =
  <W>(warn: W): IO<void> =>
  () => {
    getLogger().warn(warn);
  };
export const logError =
  <E>(error: E): IO<void> =>
  () => {
    getLogger().error(error);
  };
