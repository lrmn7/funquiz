import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { funCardABI, funCardContractAddress } from "@/constants/abi";

export const useFunCardContract = () => {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const useGetOwner = () => {
    return useReadContract({
      abi: funCardABI,
      address: funCardContractAddress,
      functionName: "owner",
    });
  };

  const { data: mintFee, refetch: refetchMintFee } = useReadContract({
    abi: funCardABI,
    address: funCardContractAddress,
    functionName: "mintFee",
  });

  const useGetContractBalance = () => {
    return useReadContract({
      abi: funCardABI,
      address: funCardContractAddress,
      functionName: "getContractBalance",
    });
  };

  const safeMint = (uri: string, fee: bigint) => {
    if (!address) return;
    writeContract({
      abi: funCardABI,
      address: funCardContractAddress,
      functionName: "safeMint",
      args: [address, uri],
      value: fee,
    });
  };

  const setMintFee = (newFee: string) => {
    writeContract({
      abi: funCardABI,
      address: funCardContractAddress,
      functionName: "setMintFee",
      args: [parseEther(newFee)],
    });
  };

  const withdraw = () => {
    writeContract({
      abi: funCardABI,
      address: funCardContractAddress,
      functionName: "withdraw",
    });
  };

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    address,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    receipt,
    error,
    useGetOwner,
    mintFee,
    refetchMintFee,
    useGetContractBalance,
    safeMint,
    setMintFee,
    withdraw,
  };
};
