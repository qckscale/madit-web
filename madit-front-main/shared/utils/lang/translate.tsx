import { en } from "./en";
import { sv } from "./sv";

export function translate(key: string, locale: "sv" | "en" = "sv") {
  switch (locale) {
    case "sv":
      return (sv as any)[key] || key;
    case "en":
      return (en as any)[key] || key;
  }
}

export function getLocale(): "sv" | "en" {
  return "sv";
}
