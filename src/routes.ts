import * as Hapi from "@hapi/hapi";
import {
  UserRouters,
  UserProfile,
  StaffRoutes,
  DirectorRoutes,
  UserPageRoutes,
  BatchProgram,
  Finance,
} from "./api/routes";
// import StaffRoutes from "./api/staff/routes";

export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new UserRouters().register(server);
    await new UserProfile().register(server);
    await new StaffRoutes().register(server);
    await new DirectorRoutes().register(server);
    await new UserPageRoutes().register(server);
    await new BatchProgram().register(server);
    await new Finance().register(server);
  }
}
