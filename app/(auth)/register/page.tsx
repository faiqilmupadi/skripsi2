import React from "react";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
      
      <div className="fixed -right-[90vh] top-1/2 h-[220vh] w-[220vh] -translate-y-1/2 rounded-full bg-[#004aad] lg:-right-[110vh]" />

      <div className="relative z-10 flex h-full w-full max-w-[1920px]">
        
        <div className="hidden h-full w-1/2 lg:block">
        </div>

        <div className="flex h-full w-full flex-col items-center justify-center lg:w-1/2">
           <div className="w-full max-w-md px-8">
             <RegisterForm />
           </div>
        </div>

      </div>
    </main>
  );
}