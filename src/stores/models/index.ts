import { Models } from "@rematch/core";
import { announcement } from "./Announcement";
import { userAuth } from "./UserAuthModel";
import { common } from "./CommonModel";
import { juristic } from "./JuristicModel";
import { developerTeam } from "./DeveloperTeamModel";

export interface RootModel extends Models<RootModel> {
  announcement: typeof announcement;
  userAuth: typeof userAuth;
  common: typeof common;
  juristic: typeof juristic;
  developerTeam: typeof developerTeam;
}

export const models: RootModel = {
  announcement,
  userAuth,
  common,
  juristic,
  developerTeam,
};