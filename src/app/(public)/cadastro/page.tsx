"use client";

import "@/assets/css/login.css";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import Logo from "@/assets/svg/logo.svg";
import { createStore } from "@/services/store-service";


export default function Cadastro() {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [visiblePass, setVisiblePass] = useState(false);
  const [visibleConfirmPass, setVisibleConfirmPass] = useState(false);
  const changeVisiblePass = () => {
    setVisiblePass(!visiblePass);
  };
  const changeVisibleConfirmPass = () => {
    setVisibleConfirmPass(!visibleConfirmPass);
  };
  
  
  const formatDocument = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length > 14) {
      return document; // Mantém o valor anterior se exceder o limite
    }
    
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } 
    else {
      return digits
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };
  
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatDocument(value);
    setDocument(formattedValue);
  };
  
  const getCleanDocument = () => {
    return document.replace(/\D/g, '');
  };
  
  const register = async () => {
    setIsLoading(true);
    if(password === confirmPass) {
      const cleanDocument = getCleanDocument();
      const response = await createStore({
        name, 
        document: cleanDocument,
        email, 
        password
      });
      setIsLoading(false);
    } else {
      alert("A senha deve ser igual no campo de confirmação!");
      setIsLoading(false);
    }
  }

  return (
    <section className="login w-full h-screen flex items-center justify-center">
      <div className="bg-white w-80 rounded-md p-5">
        <div className="flex justify-center mb-5">
          <Image className="w-full" alt="Logo" src={Logo} />
        </div>

        <form className="mb-5" action="">
          <div className="flex flex-col mb-3">
            <label className="text-sm" htmlFor="name">
              Nome
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              id="name"
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-sm" htmlFor="document">
              CPF/CNPJ
            </label>
            <Input
              value={document}
              onChange={handleDocumentChange}
              name="document"
              id="document"
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-sm" htmlFor="email">
              E-mail
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              type="email"
            />
          </div>
          <div className="flex flex-col mb-3">
            <label className="text-sm" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                type={visiblePass ? "text" : "password"}
              />
              <Button
                type="button"
                onClick={() => changeVisiblePass()}
                className="bg-transparent hover:bg-transparent absolute right-1 top-[50%] translate-y-[-50%] text-zinc-400"
              >
                {visiblePass ? <EyeClosed /> : <Eye />}
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm" htmlFor="confirmPass">
              Confirme sua senha
            </label>
            <div className="relative">
              <Input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                name="confirmPass"
                id="confirmPass"
                type={visibleConfirmPass ? "text" : "password"}
              />
              <Button
                type="button"
                onClick={() => changeVisibleConfirmPass()}
                className="bg-transparent hover:bg-transparent absolute right-1 top-[50%] translate-y-[-50%] text-zinc-400"
              >
                {visibleConfirmPass ? <EyeClosed /> : <Eye />}
              </Button>
            </div>
          </div>
          <Button onClick={() => register()} type="button" className="w-full mt-5 hover:cursor-pointer">
            {
              isLoading ?<div className="w-6 h-6 border-3 border-white border-t-primary rounded-full animate-spin"></div> : 'Cadastrar'
            }
          </Button>
        </form>

        <div className="flex items-center justify-between mb-5">
          <div className="bg-zinc-300 h-0.5 w-15 rounded-2xl"></div>
          <p className="text-sm">Ou faça login com</p>
          <div className="bg-zinc-300 h-0.5 w-15 rounded-2xl"></div>
        </div>

        <Button className="w-full bg-red-600 hover:bg-red-500 mb-3 hover:cursor-pointer">
          GOOGLE
        </Button>
        <Link href="/login">
          <Button className="w-full  bg-white hover:bg-zinc-100 text-black shadow-none hover:cursor-pointer">
            Já tenho uma conta
          </Button>
        </Link>
      </div>
    </section>
  );
}