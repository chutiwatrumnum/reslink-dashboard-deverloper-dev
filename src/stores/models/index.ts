import { Models } from "@rematch/core";
import { announcement } from "./Announcement";
import { userAuth } from "./UserAuthModel";
import { common } from "./CommonModel";

export interface RootModel extends Models<RootModel> {
  announcement: typeof announcement;
  userAuth: typeof userAuth;
  common: typeof common;
}
export const models: RootModel = {
  announcement,
  userAuth,
  common,
};
