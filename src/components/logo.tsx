import Image from "next/image";

export const Logo = ({ size }: { size: number | `${number}` }) => {
  return <Image src="/logo.svg" alt="logo" width={size} height={size} />;
};
