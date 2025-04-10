AggregateError
import { Button } from "@/components/ui/button";
import "@/assets/css/home.css";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

export default function Home() {

  return (
    <section className="home w-full h-screen">
      {/* HEADER */}
      <Header />
      {/* HEADER */}
      {/* MODAL CADASTRO */}
      <div className="flex w-full h-screen justify-end items-center container">
        <div className="bg-white w-100 p-10 rounded-3xl">
          <div className="mb-5">
            <h2 className="text-2xl">Cadastre sua loja</h2>
            <h3 className="text-zinc-600">Comece a vender hoje mesmo!</h3>
          </div>
          <div className="flex flex-col mb-5">
            <label htmlFor="">E-mail*</label>
            <Input className="" placeholder="email@email.com" name="email" />
          </div>
          <div>
            <Button className="w-full py-6 mb-1">Cadastrar agora</Button>
            <p className="text-xs/tight">
              Ao clicar você coonfirma que concorda com nossa política de
              privacidade!
            </p>
          </div>
        </div>
      </div>
      {/* MODAL CADASTRO */}
    </section>
  );
}
