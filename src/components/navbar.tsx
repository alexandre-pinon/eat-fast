import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Logo } from "./logo";
import { SignIn } from "./sign-in";

export const NavBar = () => {
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
          <SignIn color="primary" variant="flat" />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
