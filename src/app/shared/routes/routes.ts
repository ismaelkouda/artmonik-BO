import { DashboardComponent } from "@/pages/dashboard/ui/dashboard.component";
import { Routes } from "@angular/router";

export const SEARCH = "search";
export const DASHBOARD = "dashboard";
export const MANAGEMENT = "management";
export const SETTING = "setting"
export const ARTISTS = "artists";
export const CATEGORIES_ARTISTS = "categories-artists";
export const SLIDES = "slides";
export const LABEL = "label";
export const SERVICES = "services";
export const LOGO = "logo";
export const NEWSLETTER = "newsletter";
export const MESSAGING = "messaging";
export const EVENEMENTIEL = "evenementiels";

export const content: Routes = [

  {
    path: DASHBOARD,
    component: DashboardComponent
  },
  {
    path: `${MANAGEMENT}/${ARTISTS}`,
    loadChildren: () => import("src/app/pages/artist/artist.module").then((m) => m.ArtistModule),
  },
  {
    path: `${MANAGEMENT}/${EVENEMENTIEL}`,
    loadChildren: () => import("src/app/pages/evenementiels/evenementiels.module").then((m) => m.EvenementielModule),
  },
  {
    path: `${MANAGEMENT}/${CATEGORIES_ARTISTS}`,
    loadChildren: () => import("src/app/pages/categories-artists/categories-artists.module").then((m) => m.CategoryArtistModule),
  },
  {
    path: `${MANAGEMENT}/${SLIDES}`,
    loadChildren: () => import("src/app/pages/slides/slides.module").then((m) => m.SlidesModule,)
  },
  {
    path: `${MANAGEMENT}/${LABEL}`,
    loadChildren: () => import("src/app/pages/label/label.module").then((m) => m.LabelModule,)
  },
  {
    path: `${MANAGEMENT}/${SERVICES}`,
    loadChildren: () => import("src/app/pages/services/services.module").then((m) => m.ServicesModule,)
  },
  {
    path: `${SETTING}/${LOGO}`,
    loadChildren: () => import("../../pages/logo/logo.module").then(
      (m) => m.LogoModule,
    )
  },
  {
    path: `${SETTING}/${NEWSLETTER}`,
    loadChildren: () => import("../../pages/newsletter/newsletter.module").then(
      (m) => m.NewsletterModule,
    )
  },
  {
    path: `${SETTING}/${MESSAGING}`,
    loadChildren: () => import("../../pages/messaging/messaging.module").then(
      (m) => m.MessagingModule,
    )
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
    path: '',
    redirectTo: `${DASHBOARD}`,
    pathMatch: 'full'
  },
];
