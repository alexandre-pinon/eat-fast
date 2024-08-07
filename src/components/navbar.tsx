import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";
import { SignInButton } from "./sign-in-button";

export const NavBar = () => {
  const t = useTranslations();

  return (
    <Navbar>
      <NavbarBrand className="">
        <Logo size={40} />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="text-foreground" href="#">
            Pricing
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-foreground" href="#">
            FAQ
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <SignInButton text={t("signIn")} color="primary" variant="flat" />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
