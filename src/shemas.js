import { schema } from "normalizr";

export const subject = new schema.Entity("subjects", {});
export const user = new schema.Entity("users", {});
export const item = new schema.Entity("items", {
  author: user,
  subjects: [subject]
});
