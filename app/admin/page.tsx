'use client';

import { useFunQuizContract } from '@/hooks/useFunQuizContract';
import { useFunCardContract } from '@/hooks/useFunCardContract';
import { useAccount } from 'wagmi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';

const AdminPage = () => {
    const { address } = useAccount();
    const { 
        useGetOwner: useGetQuizOwner,
        useGetCreateFee,
        useGetPlayQuizFee,
        useGetContractBalance: useGetQuizBalance,
        setCreateQuizFee,
        setPlayQuizFee,
        withdraw: withdrawQuiz,
        isPending: isQuizPending,
        isConfirming: isQuizConfirming,
        isConfirmed: isQuizConfirmed,
        error: quizError
    } = useFunQuizContract();

    const {
        useGetOwner: useGetCardOwner,
        mintFee: currentMintFee,
        refetchMintFee,
        useGetContractBalance: useGetCardBalance,
        setMintFee,
        withdraw: withdrawCard,
        isPending: isCardPending,
        isConfirming: isCardConfirming,
        isConfirmed: isCardConfirmed,
        error: cardError
    } = useFunCardContract();

    const { data: quizOwnerAddress } = useGetQuizOwner();
    const { data: currentCreateFee, refetch: refetchCreateFee } = useGetCreateFee();
    const { data: currentPlayFee, refetch: refetchPlayFee } = useGetPlayQuizFee();
    const { data: quizContractBalance, refetch: refetchQuizBalance } = useGetQuizBalance();
    
    const { data: cardContractBalance, refetch: refetchCardBalance } = useGetCardBalance();
    
    const [newCreateFee, setNewCreateFee] = useState('');
    const [newPlayFee, setNewPlayFee] = useState('');
    const [newMintFee, setNewMintFee] = useState('');

    const isOwner = address && quizOwnerAddress && address === quizOwnerAddress;
    const isProcessing = isQuizPending || isQuizConfirming || isCardPending || isCardConfirming;

    useEffect(() => {
        if (isQuizConfirmed || isCardConfirmed) {
            toast.success("Transaction successful!");
            refetchCreateFee();
            refetchPlayFee();
            refetchQuizBalance();
            refetchMintFee();
            refetchCardBalance();
        }
        const anyError = quizError || cardError;
        if (anyError) {
            toast.error(anyError.message);
        }
    }, [isQuizConfirmed, isCardConfirmed, quizError, cardError]);


    const handleSetCreateFee = () => { if (parseFloat(newCreateFee) > 0) setCreateQuizFee(newCreateFee); else toast.error("Invalid fee."); }
    const handleSetPlayFee = () => { if (parseFloat(newPlayFee) > 0) setPlayQuizFee(newPlayFee); else toast.error("Invalid fee."); }
    const handleSetMintFee = () => { if (parseFloat(newMintFee) > 0) setMintFee(newMintFee); else toast.error("Invalid fee."); }
    const handleWithdrawQuiz = () => { toast.info("Withdrawing from FunQuiz..."); withdrawQuiz(); }
    const handleWithdrawCard = () => { toast.info("Withdrawing from FunCard..."); withdrawCard(); }

    if (!isOwner) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
                <p className="text-secondary mt-2">You are not the owner of this contract.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-6">Admin Panel</h1>
            <div className="space-y-8 bg-surface p-8 rounded-lg border border-border">
                
                {/* --- STATS KONTRAK FUNQUIZ --- */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">FunQuiz Contract Stats</h2>
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">Create Quiz Fee:</span>
                        <span className="font-bold text-primary">{currentCreateFee !== undefined ? `${formatEther(currentCreateFee)} STT` : '...'}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">Play Quiz Fee:</span>
                        <span className="font-bold text-primary">{currentPlayFee !== undefined ? `${formatEther(currentPlayFee)} STT` : '...'}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">FunQuiz Balance:</span>
                        <span className="font-bold text-primary">{quizContractBalance !== undefined ? `${formatEther(quizContractBalance)} STT` : '...'}</span>
                    </div>
                </div>

                {/* --- STATS KONTRAK FUNCARD --- */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">FunCard NFT Contract Stats</h2>
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">NFT Mint Fee:</span>
                        <span className="font-bold text-primary">{currentMintFee !== undefined ? `${formatEther(currentMintFee)} STT` : '...'}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md">
                        <span className="text-secondary">FunCard Balance:</span>
                        <span className="font-bold text-primary">{cardContractBalance !== undefined ? `${formatEther(cardContractBalance)} STT` : '...'}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Actions</h2>
                    
                    {/* --- AKSI UNTUK FUNQUIZ --- */}
                    <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-300">FunQuiz Settings</h3>
                        <Input label="Set New Create Quiz Fee (in STT)" type="number" step="0.01" value={newCreateFee} onChange={(e) => setNewCreateFee(e.target.value)} placeholder="e.g., 0.01" />
                        <Button onClick={handleSetCreateFee} isLoading={isProcessing} className="w-full">Update Create Fee</Button>
                        <Input label="Set New Play Quiz Fee (in STT)" type="number" step="0.01" value={newPlayFee} onChange={(e) => setNewPlayFee(e.target.value)} placeholder="e.g., 0.001" />
                        <Button onClick={handleSetPlayFee} isLoading={isProcessing} className="w-full">Update Play Fee</Button>
                        <Button onClick={handleWithdrawQuiz} isLoading={isProcessing} className="w-full bg-red-600 hover:bg-red-700">Withdraw from FunQuiz</Button>
                    </div>

                    {/* --- AKSI UNTUK FUNCARD --- */}
                    <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-300">FunCard NFT Settings</h3>
                        <Input label="Set New Mint Fee (in STT)" type="number" step="0.01" value={newMintFee} onChange={(e) => setNewMintFee(e.target.value)} placeholder="e.g., 0.05" />
                        <Button onClick={handleSetMintFee} isLoading={isProcessing} className="w-full">Update Mint Fee</Button>
                        <Button onClick={handleWithdrawCard} isLoading={isProcessing} className="w-full bg-red-600 hover:bg-red-700">Withdraw from FunCard</Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminPage;