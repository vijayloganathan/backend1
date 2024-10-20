import * as Hapi from "@hapi/hapi";
import {
  UserRouters,
  UserProfile,
  StaffRoutes,
  DirectorRoutes,
} from "./api/routes";
// import StaffRoutes from "./api/staff/routes";

export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new UserRouters().register(server);
    await new UserProfile().register(server);
    await new StaffRoutes().register(server);
    await new DirectorRoutes().register(server);
  }
}
