import { Link } from "@nextui-org/react";
import Image from "next/image";

export const Logo = ({ size }: { size: number | `${number}` }) => {
  return (
    <Link color="foreground" className="items-center gap-x-2" href="/">
      <Image src="/logo.svg" alt="logo" width={size} height={size} />
      <p className="font-semibold text-lg">EatFast</p>
    </Link>
  );
};
