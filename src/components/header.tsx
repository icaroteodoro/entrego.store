import Link from "next/link";
import { Button } from "./ui/button";
import { AlignRight } from "lucide-react";
import Logo from '../assets/svg/logo.svg'
import Image from "next/image";

export default function Header() {

  return (
    <nav className="absolute top-0 left-0 flex w-full h-20 align-middle justify-between bg-white">
      <div className="container flex items-center justify-between">
        <div>
          <Image className="w-32" alt="Logo" src={Logo} />
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex align-baseline gap-3">
            <Link className="text-zinc-600 hover:text-zinc-800" href="">
              Como funciona?
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-800" href="">
              Ajuda
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                className="text-sm py-5 lg:py-7 hidden lg:flex hover:cursor-pointer"
                variant="secondary"
              >
                Fazer Login
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button className="text-sm py-5 lg:py-7 hover:cursor-pointer">Cadastrar</Button>
            </Link>
            <AlignRight className="text-primary flex lg:hidden" size={40} />
          </div>
        </div>
      </div>
    </nav>
  );
}
