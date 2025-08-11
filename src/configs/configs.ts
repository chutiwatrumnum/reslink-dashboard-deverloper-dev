export const MODE = "dev"; // dev, uat

// [0] == version
// [1] == type of server
// [2] == major version
// [3] == minor version
/*
0 = DEV
1 = SIT
2 = UAT
3 = UAT.
*/
// uat
const APP_VERSION_CODE_UAT = "0.0.1";
// dev
const APP_VERSION_CODE_DEV = "0.0.1-dev";
// prod
const APP_VERSION_CODE_PROD = "0.0.1";

const API_URL_OBJECT = {
  uat: "https://",
  prod: "https://",
  dev : "https://"
}
const MODE_URL = {
  uat: APP_VERSION_CODE_UAT,
  prod: APP_VERSION_CODE_PROD,
  dev : APP_VERSION_CODE_DEV
}

export const APP_VERSION = MODE_URL[MODE as keyof typeof MODE_URL]
export const API_URL = API_URL_OBJECT[MODE as keyof typeof API_URL_OBJECT]