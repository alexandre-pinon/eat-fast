export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/meals-of-the-week", "/settings", "/shopping-list"],
};
