import { DashboardComponent } from "@/pages/dashboard/ui/dashboard.component";
import { Routes } from "@angular/router";

export const DASHBOARD = "dashboard";

export const content: Routes = [

  {
    path: DASHBOARD,
    component: DashboardComponent
  },
  {
    path: "members",
    loadChildren: () =>
      import("../../pages/members/members.module").then(
        (m) => m.MembersModule,
      ),
  },
  {
    path: "users",
    loadChildren: () =>
      import("../../pages/users/users.module").then(
        (m) => m.UsersModule,
      ),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("../../pages/administration/settings/settings.module").then(
        (m) => m.SettingsModule,
      ),
  },
  {
    path: "campaign",
    loadChildren: () => import("../../pages/management/campaign/campaign.module").then(
      (m) => m.CampaignModule,
    )
  },
  {
    path: "accounting",
    loadChildren: () => import("../../pages/management/accouting/accouting.module").then(
      (m) => m.AccoutingModule,
    )
  },
  {
    path: "member",
    loadChildren: () => import("../../pages/management/member/member.module").then(
      (m) => m.MemberModule,
    )

  },
  {
    path: "deposit",
    loadChildren: () => import("../../pages/management/deposit/deposit.module").then(
      (m) => m.DepositModule,
    )

  },
  {
    path: "request-colector",
    loadChildren: () => import("../../pages/management/colector-profile/colector-profile.module").then(
      (m) => m.ColectorProfileModule,
    )

  },
  {
    path: "historical",
    loadChildren: () => import("../../pages/management/historical/historical.module").then(
      (m) => m.HistoricalModule,
    )

  },
  {
      path: '',
      redirectTo: `${DASHBOARD}`,
      pathMatch: 'full'
  },
];
