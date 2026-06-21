import { projects } from "../_shared/content.js";
import { json } from "../_shared/utils.js";

export async function onRequestGet() {
  return json({ items: projects });
}
