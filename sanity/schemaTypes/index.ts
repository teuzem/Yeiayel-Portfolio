import type { SchemaTypeDefinition } from "sanity";
import achievement from "./achievement";
import blog from "./blog";
import blogAuthor from "./blogAuthor";
import blogCategory from "./blogCategory";
import blogProduct from "./blogProduct";
import blogSettings from "./blogSettings";
import certification from "./certification";
import contact from "./contact";
import education from "./education";
import experience from "./experience";
import navigation from "./navigation";
import paymentWebhook from "./paymentWebhook";
import profile from "./profile";
import project from "./project";
import service from "./service";
import serviceRequest from "./serviceRequest";
import siteSettings from "./siteSettings";
import skill from "./skill";
import testimonial from "./testimonial";
import twinFeedback from "./twinFeedback";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profile,
    project,
    skill,
    experience,
    education,
    testimonial,
    certification,
    achievement,
    blog,
    blogCategory,
    blogAuthor,
    blogProduct,
    blogSettings,
    service,
    serviceRequest,
    contact,
    siteSettings,
    navigation,
    paymentWebhook,
    twinFeedback,
  ],
};
