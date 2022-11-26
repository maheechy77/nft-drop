import React from "react";
import { useMetamask, useAddress, useDisconnect } from "@thirdweb-dev/react";

const NFTDropPage = () => {
  const connectWithMetaMask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="flex flex-col h-screen lg:grid lg:grid-cols-10">
      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="apes"
            />
          </div>
          <div className="text-center p-5 space-y-2">
            <h1 className="text-4xl font-bold text-white">Sample Apes</h1>
            <h2 className="text-xl text-gray-300">
              A Collection of Sample apes.
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            A{" "}
            <span className="font-extrabold underline decoration-pink-600/50">
              Sample NFT
            </span>{" "}
            Market Place
          </h1>
          <button
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
            className="rounded-full bg-rose-500 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:text-base"
          >
            {address ? "Sign Out " : "Sign in"}
          </button>
        </header>

        <hr className="my-2 border" />

        {address && (
          <p className="text-center text-sm text-rose-400">
            You're logged in with wallet {address.substring(0, 4)}...
            {address.substring(address.length - 4, address.length)}
          </p>
        )}

        <div className="mt-10 flex flex-col flex-1 items-center lg:justify-center space-y-6 text-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src="https://links.papareact.com/bdy"
            alt="moreapes"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            Sample Ape Club | NFT Drops
          </h1>

          <p className="p-2 text-xl text-green-500">7/25 NFT's Claimed</p>
        </div>

        <button className="h-16 w-full text-white rounded-full mt-8 bg-red-600 font-bold">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;