export const enum FaqEndPointUrl {
    GET_ALL_FAQ = "/faqs/?page={number}",
    STORE_FAQ = "/faqs/store",
    UPDATE_FAQ = "/faqs/{id}/update",
    DELETE_FAQ = "/faqs/{id}/delete",

    UPDATE_FAQ_STATUS_ENABLE = "/faqs/{id}/enable",
    UPDATE_FAQ_STATUS_DISABLE = "/faqs/{id}/disable",

  }
  