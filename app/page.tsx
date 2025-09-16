"use client";
import { useState } from "react";
import { createMintConsume } from "@/lib/createMintConsume";
import { incrementCounterContract } from "@/lib/incrementCounterContract";
import { deployCounterContract } from "@/lib/deployCounterContract";
import { deployCounterContractRust } from "@/lib/deployCounterContractRust";

export default function Home() {
  const [isCreatingNotes, setIsCreatingNotes] = useState(false);
  const [isIncrementCounter, setIsIncrementCounter] = useState(false);
  const [isDeployingCounter, setIsDeployingCounter] = useState(false);
  const [isDeployingCounterRust, setIsDeployingCounterRust] = useState(false);

  const handleCreateMintConsume = async () => {
    setIsCreatingNotes(true);
    await createMintConsume();
    setIsCreatingNotes(false);
  };

  const handleIncrementCounterContract = async () => {
    setIsIncrementCounter(true);
    await incrementCounterContract();
    setIsIncrementCounter(false);
  };

  const handleDeployCounterContract = async () => {
    setIsDeployingCounter(true);
    await deployCounterContract();
    setIsDeployingCounter(false);
  };

  const handleDeployCounterContractRust = async () => {
    setIsDeployingCounterRust(true);
    await deployCounterContractRust();
    setIsDeployingCounterRust(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-slate-800 dark:text-slate-100">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4">Miden Web App</h1>
        <p className="mb-6">Open your browser console to see WebClient logs.</p>

        <div className="max-w-sm w-full bg-gray-800/20 border border-gray-600 rounded-2xl p-6 mx-auto flex flex-col gap-4">
          {/* <button
            onClick={handleCreateMintConsume}
            className="w-full px-6 py-3 text-lg cursor-pointer bg-transparent border-2 border-orange-600 text-white rounded-lg transition-all hover:bg-orange-600 hover:text-white"
          >
            {isCreatingNotes
              ? "Working..."
              : "Tutorial #1: Create, Mint, Consume Notes"}
          </button> */}
          {/* <button
            onClick={handleIncrementCounterContract}
            className="w-full px-6 py-3 text-lg cursor-pointer bg-transparent border-2 border-orange-600 text-white rounded-lg transition-all hover:bg-orange-600 hover:text-white"
          >
            {isIncrementCounter
              ? "Working..."
              : "Tutorial #3: Increment Counter Contract"}
          </button> */}
          <button
            onClick={handleDeployCounterContract}
            className="w-full px-6 py-3 text-lg cursor-pointer bg-transparent border-2 border-orange-600 text-white rounded-lg transition-all hover:bg-orange-600 hover:text-white"
          >
            {isDeployingCounter
              ? "Working..."
              : "Deploy Counter Contract"}
          </button>
          <button
            onClick={handleDeployCounterContractRust}
            className="w-full px-6 py-3 text-lg cursor-pointer bg-transparent border-2 border-orange-600 text-white rounded-lg transition-all hover:bg-orange-600 hover:text-white"
          >
            {isDeployingCounterRust
              ? "Working..."
              : "Deploy Counter Contract Rust"}
          </button>
        </div>
      </div>
    </main>
  );
}
