import { SimpleRouterDefinition } from "./route-definition";


export const AppRoutes = {
  home: {
    route: () => "/"
  },
  menuList :{
    route: () => "/menuList"
  },
  clientList: {
    route: () => "/clientList"
  },
  aboutMe: {
    route: () => "/aboutMe"
  },
  clientMiners: {
    route: () => "/clientMiners"
  }
} as const satisfies Record<string, SimpleRouterDefinition>;

export type Routes = keyof typeof AppRoutes;

export const routeList = Object.values(AppRoutes);