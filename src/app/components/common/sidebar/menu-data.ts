export const sidebarMenuAdmin: any[] = [
  {
    title: "MENU.0.title",
    icon: "flaticon-home",
    link: "/dashboard",
    type: "link",
  },
  {
    headTitle: "MENU.1.headTitle",
  },
  {
    title: "MENU.2.title",
    icon: "flaticon-box",
    type: "sub",
    subItems: [
      { id: 6, title: "MENU.2.subItems.0.title", link: "/campaign/list" },
      { id: 7, title: "MENU.2.subItems.1.title", link: "/campaign/category" },
    ],
  },
  {
    title: "MENU.3.title",
    icon: "flaticon-credit-cards",
    type: "sub",
    subItems: [
      { id: 8, title: "MENU.3.subItems.0.title", link: "/deposit/list" },
    ],
  },
  {
    title:"MENU.4.title",
    icon :"flaticon-user",
    type:"sub",
    subItems:[
      { id: 9, title: "MENU.4.subItems.0.title", link: "/member/list" },
    ],

  },
  {
    title:"MENU.5.title",
    icon :"flaticon-loading",
    type:"sub",
    subItems:[
      { id: 11, title: "MENU.5.subItems.0.title", link: "/request-colector/list" },
    ],

  },
  {
    headTitle: "MENU.6.headTitle",
  },
  {
    title: "MENU.7.title",
    icon: "flaticon-settings",
    type: "sub",
    subItems: [
      { id: 3, title: "MENU.7.subItems.0.title", link: "/settings/users" },
      { id: 4, title: "MENU.7.subItems.1.title", link: "/settings/faq" },
      { id: 5, title: "MENU.7.subItems.2.title", link: "/settings/payment" },
    ],
  },
];
