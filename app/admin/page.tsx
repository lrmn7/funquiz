'use client';

import { useFunQuizContract } from '@/hooks/useFunQuizContract';
import { useAccount } from 'wagmi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';

const AdminPage = () => {
    const { address } = useAccount();
    const { 
        useGetOwner,
        useGetCreateFee,
        useGetPlayQuizFee,
        useGetContractBalance,
        setCreateQuizFee,
        setPlayQuizFee,
        withdraw,
        isPending,
        isConfirming,
        isConfirmed,
        error
    } = useFunQuizContract();

    const { data: ownerAddress } = useGetOwner();
    const { data: currentCreateFee, refetch: refetchCreateFee } = useGetCreateFee();
    const { data: currentPlayFee, refetch: refetchPlayFee } = useGetPlayQuizFee();
    const { data: contractBalance, refetch: refetchBalance } = useGetContractBalance();
    
    const [newCreateFee, setNewCreateFee] = useState('');
    const [newPlayFee, setNewPlayFee] = useState('');

    const isOwner = address && ownerAddress && address === ownerAddress;

    useEffect(() => {
        if(isConfirmed) {
            toast.success("Transaction successful!");
            refetchCreateFee();
            refetchPlayFee();
            refetchBalance();
        }
        if(error) {
            toast.error(error.message);
        }
    }, [isConfirmed, error, refetchCreateFee, refetchPlayFee, refetchBalance]);

    const handleSetCreateFee = () => {
        if (parseFloat(newCreateFee) > 0) {
            toast.info("Sending transaction to update create fee...");
            setCreateQuizFee(newCreateFee);
        } else {
            toast.error("Please enter a valid fee.");
        }
    }

    const handleSetPlayFee = () => {
        if (parseFloat(newPlayFee) > 0) {
            toast.info("Sending transaction to update play fee...");
            setPlayQuizFee(newPlayFee);
        } else {
            toast.error("Please enter a valid fee.");
        }
    }
    
    const handleWithdraw = () => {
        toast.info("Sending transaction to withdraw funds...");
        withdraw();
    }

    if (!isOwner) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
                <p className="text-secondary mt-2">You are not the owner of this contract.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-6">Admin Panel</h1>
            <div className="space-y-8 bg-surface p-8 rounded-lg border border-border">
                
                {/* Contract Stats */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">Contract Stats</h2>
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">Current Create Quiz Fee:</span>
                        <span className="font-bold text-primary">{currentCreateFee !== undefined ? `${formatEther(currentCreateFee as bigint)} STT` : 'Loading...'}</span>
                    </div>

                    {/* Tampilkan Play Fee */}
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">Current Play Quiz Fee:</span>
                        <span className="font-bold text-primary">{currentPlayFee !== undefined ? `${formatEther(currentPlayFee as bigint)} STT` : 'Loading...'}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">Total Funds in Contract:</span>
                        <span className="font-bold text-primary">{contractBalance !== undefined ? `${formatEther(contractBalance as bigint)} STT` : 'Loading...'}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Actions</h2>
                    
                    {/* Set Create Fee */}
                    <div className="space-y-2 p-4 border border-gray-700 rounded-lg">
                        <Input 
                            label="Set New Create Quiz Fee (in STT)"
                            type="number"
                            step="0.01"
                            value={newCreateFee}
                            onChange={(e) => setNewCreateFee(e.target.value)}
                            placeholder="e.g., 0.5"
                        />
                        <Button onClick={handleSetCreateFee} isLoading={isPending || isConfirming} className="w-full">
                            Update Create Fee
                        </Button>
                    </div>

                    {/* Form untuk Set Play Fee */}
                    <div className="space-y-2 p-4 border border-gray-700 rounded-lg">
                        <Input 
                            label="Set New Play Quiz Fee (in STT)"
                            type="number"
                            step="0.01"
                            value={newPlayFee}
                            onChange={(e) => setNewPlayFee(e.target.value)}
                            placeholder="e.g., 0.1"
                        />
                        <Button onClick={handleSetPlayFee} isLoading={isPending || isConfirming} className="w-full">
                            Update Play Fee
                        </Button>
                    </div>
                    
                    {/* Withdraw */}
                    <div className="pt-4">
                        <Button onClick={handleWithdraw} isLoading={isPending || isConfirming} className="w-full bg-red-600 hover:bg-red-700">
                           Withdraw All Funds
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;