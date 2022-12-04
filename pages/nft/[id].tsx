import React, { useEffect, useState } from "react";
import {
  useMetamask,
  useAddress,
  useDisconnect,
  useContract,
} from "@thirdweb-dev/react";
import { urlFor, sanityClient } from "../../sanity";
import { GetServerSideProps } from "next";
import { Collection } from "../../typing";
import Link from "next/link";
import { BigNumber } from "ethers";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  collection: Collection;
}

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<Number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [priceInEth, setPriceInEth] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const nftDrop = useContract(collection.address, "nft-drop").contract;

  const connectWithMetaMask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (!nftDrop) return;
    setIsLoading(true);
    const fetchNFTDropData = async () => {
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total);

      setIsLoading(false);
    };

    fetchNFTDropData();
  }, [nftDrop]);

  useEffect(() => {
    if (!nftDrop) return;
    const fetchPrice = async () => {
      const claimCondition = await nftDrop.claimConditions.getAll();
      setPriceInEth(claimCondition?.[0].currencyMetadata.displayValue);
    };

    fetchPrice();
  }, [nftDrop]);

  const mintNft = () => {
    if (!nftDrop || !address) return;

    const quantity = 1;
    setIsLoading(true);

    const notification = toast.loading("Minting...", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontSize: "17px",
        padding: "20px",
      },
    });
    nftDrop
      ?.claimTo(address, quantity)
      .then(async (tx) => {
        const recipt = tx[0].receipt;
        const claimedTokenId = tx[0].id;
        const claimedNFT = await tx[0].data();

        toast("NFT Minted Successfully.", {
          duration: 8000,
          style: {
            background: "green",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        toast("Opps Something gone wrong.", {
          duration: 8000,
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontSize: "17px",
            padding: "20px",
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
        toast.dismiss(notification);
      });
  };

  return (
    <div className="flex flex-col h-screen lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />

      <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection?.previewImage).url()}
              alt="apes"
            />
          </div>
          <div className="text-center p-5 space-y-2">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <Link href={"/"}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              A{" "}
              <span className="font-extrabold underline decoration-pink-600/50">
                Sample NFT
              </span>{" "}
              Market Place
            </h1>
          </Link>

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
            src={urlFor(collection.mainImage).url()}
            alt="moreapes"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>

          {isLoading ? (
            <p className="animate-bounce p-2 text-xl text-green-500">
              Loading...
            </p>
          ) : (
            <p className="p-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFT's Claimed
            </p>
          )}

          {isLoading && (
            <img
              className="h-80 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt="loading"
            />
          )}
        </div>

        <button
          onClick={mintNft}
          disabled={
            isLoading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="h-16 w-full text-white rounded-full mt-8 bg-red-600 font-bold disabled:bg-gray-400"
        >
          {isLoading ? (
            <>Loading...</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out...</>
          ) : !address ? (
            <>Log in to Mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug{
      current
    },
    creator->{
      _id,
      name,
      address,
      slug{
        current
      },
    }
  }`;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  console.log("c", collection);

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};
