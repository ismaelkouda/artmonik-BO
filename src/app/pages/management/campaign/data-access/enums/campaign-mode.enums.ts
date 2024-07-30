export const enum CampainsModeEndPointUrl {
    GET_ALL_CAMPAIGN_MODE = "/campagne?page={number}",
    CHECK_CAMPAIGN_STATUS = "/{id}",
    UPDATE_CAMPAIGN_STATUS = "/{id}",
    UPDATE_CAMPAIGN_STATUS_MODE = "/campagne/{id}/{status}",


    /*CATEGORY_CAMPAIGN_MODE*/

    GET_ALL_CAMPAIGN_CATEGORY_MODE = "/categorie?page={number}",
    STORE_CAMPAIGN_CATEGORY_MODE = "/categorie/store",
    UPDATE_CAMPAIGN_CATEGORY_MODE = "/categorie/{id}/update",
    DELETE_CAMPAIGN_CATEGORY_MODE = "/categorie/{id}/delete",

    UPDATE_CAMPAIGN_CATEGORY = "/categorie/{id}/{status}",
  }
  