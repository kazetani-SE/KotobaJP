import {Button} from "@/components/ui/button";

import {ArrowBigLeft} from "lucide-react";

import {object as BEObj} from "../../wailsjs/go/models";

import UICard = BEObj.Card;
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {NumberTpTInput} from "@/pages/LearningPage";
import {Switch} from "@/components/ui/switch";
import {useEffect, useRef, useState} from "react";
import {motion, number} from "framer-motion";

export interface FlipCard {
    content: string;
    chosen: boolean;
    cleared: boolean;
}

export function MatchPage({
                              cards,
                              setFunc,
                          }: {
    cards: UICard[];
    setFunc: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [setting, setSetting] = useState(true);
    const [num, setNum] = useState(6);
    const [canFlip, setCanFlip] = useState(false);
    const [disableFlipAnimation, setDisableFlipAnimation] = useState(false);
    const [curIndex, setCurIndex] = useState(0);

    const [flipCards, setFlipCards] = useState<FlipCard[]>([]);
    const [chosenCards, setChosenCards] = useState<UICard[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [copiedDeck, setCopiedDeck] = useState<UICard[]>([]);

    const [timeLimit, setTimeLimit] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [showLoseDialog, setShowLoseDialog] = useState(false);
    const [showEndDialog, setShowEndDialog] = useState(false);

    const isPlaying = !setting && timeLeft > 0 && !showEndDialog && !showLoseDialog;

    function createFlipCardDeck(cards: UICard[], n: number): FlipCard[] {
        let shuffled = [...cards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        let copied = [...shuffled];

        const count = Math.max(1, Math.min(n, copied.length));
        copied = copied.slice(0, count);
        setChosenCards(copied);
        setCopiedDeck(copied);
        for (let i = copied.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copied[i], copied[j]] = [copied[j], copied[i]];
        }

        let result: FlipCard[] = [];

        copied.forEach((c) => {
            result.push({ content: c.term, chosen: false, cleared: false });
            result.push({ content: c.definition, chosen: false, cleared: false });
        });

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }

    function checkMatchByContents(a: string, b: string): boolean {
        return chosenCards.some(
            (c) =>
                (c.term === a && c.definition === b) ||
                (c.term === b && c.definition === a)
        );
    }

    useEffect(() => {
        if (!setting) {
            // reset timer
            if (timerRef.current) clearInterval(timerRef.current);

            setTimeLeft(timeLimit);

            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        setShowLoseDialog(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [setting, canFlip, timeLimit]);

    useEffect(() => {
        if (copiedDeck.length === 0 && flipCards.length > 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setShowEndDialog(true);
        }
    }, [copiedDeck]);

    useEffect(() => {
        const newSet = createFlipCardDeck(cards, num);
        setFlipCards(newSet);
    }, [num, canFlip, cards, setting]);

    useEffect(() => {
        const chosen = flipCards
            .map((c, idx) => ({ ...c, idx }))
            .filter((c) => c.chosen && !c.cleared);

        if (chosen.length < 2) return;
        if (chosen.length > 2) return;

        setIsChecking(true);

        const [first, second] = chosen;
        const matched = checkMatchByContents(first.content, second.content);

        if (matched) {
            const t = setTimeout(() => {
                const next = [...flipCards];
                next[first.idx] = { ...next[first.idx], chosen: false, cleared: true };
                next[second.idx] = {
                    ...next[second.idx],
                    chosen: false,
                    cleared: true,
                };
                setFlipCards(next);
                setCopiedDeck(prev => {
                    const newDeck = prev.filter(c =>
                        !(
                            (c.term === first.content || c.definition === first.content) ||
                            (c.term === second.content || c.definition === second.content)
                        )
                    );
                    return newDeck;
                });
                setIsChecking(false);
            }, 600);

            return () => clearTimeout(t);
        }

        const t = setTimeout(() => {
            const next = [...flipCards];
            next[first.idx] = { ...next[first.idx], chosen: false };
            next[second.idx] = { ...next[second.idx], chosen: false };
            setFlipCards(next);
            setIsChecking(false);
        }, 800);

        return () => clearTimeout(t);
    }, [flipCards, chosenCards]);

    function handleSelect(index: number, fd: FlipCard) {
        if (isChecking) return;
        if (fd.cleared) return;

        const x = [...flipCards];
        x[index] = { ...x[index], chosen: !x[index].chosen };
        setFlipCards(x);
        setCurIndex(index);
    }

    useEffect(() => {
        if (copiedDeck.length === 0 && flipCards.length > 0) {
            setShowEndDialog(true);
        }
    }, [copiedDeck]);

    return (
        <div className="flex flex-col gap-0 justify-start items-center mt-[-5vh]">
            <div className="flex flex-row w-[70vw] items-center justify-between mb-[3vh]">
                <Button
                    className="w-[6vh] h-[6vh] bg-slate-900 text-indigo-300 font-bold border-[2px] border-indigo-600 rounded-full"
                    onClick={() => setFunc(0)}
                >
                    <ArrowBigLeft className="w-7 h-7" />
                </Button>
                <h1 className="font-bold text-indigo-100 text-[6vh]">Match Game</h1>

                <Button
                    className="px-4 py-4 rounded-xl bg-transparent border border-indigo-600 text-[2.5vh] text-indigo-50 font-semibold hover:border-indigo-400 hover:bg-indigo-950 hover:text-indigo-50"
                    onClick={() => {
                        if (isPlaying) return;
                        setSetting(true);
                    }}
                >
                    Setting game
                </Button>
            </div>

            <h2 className="text-[3vh] font-bold text-indigo-300">
                Time left: {timeLeft}s
            </h2>

            <Setting
                setting={setting}
                number={num}
                canFlip={canFlip}
                setCanFlip={setCanFlip}
                setSetting={setSetting}
                setNumber={setNum}
                setTimeLimit={setTimeLimit}
                timeLimit={timeLimit}
            />

            <div className="flex flex-wrap justify-between gap-[2vw] w-[100vw] px-[2vw]">
                {flipCards.map((fd, index) =>
                    canFlip ? (
                        <motion.div
                            key={index}
                            className="relative w-[22vw] aspect-[3/2] cursor-pointer"
                            animate={{ rotateX: fd.chosen ? 180 : 0 }}
                            transition={disableFlipAnimation ? { duration: 0 } : { duration: 0.5, ease: "easeInOut" }}
                            style={{
                                transformStyle: "preserve-3d",
                                visibility: fd.cleared ? "hidden" : "visible",
                                pointerEvents: fd.cleared ? "none" : "auto",
                            }}
                            onClick={() => handleSelect(index, fd)}
                        >
                            <div
                                className="absolute inset-0 bg-indigo-800 text-white flex items-center justify-center font-bold rounded-xl text-[clamp(2rem,4vw,6vh)]"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                ?
                            </div>

                            <div
                                className="absolute inset-0 bg-indigo-500 text-white flex items-center justify-center text-center font-bold rounded-xl px-[1vw] text-[clamp(1rem,3vw,4vh)]"
                                style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
                            >
                                {fd.content}
                            </div>
                        </motion.div>
                    ) : (
                        <div
                            key={index}
                            className="w-[22vw] aspect-[3/2] bg-indigo-600 text-indigo-50 rounded-xl flex items-center justify-center text-center font-bold px-[1vw] cursor-pointer border text-[clamp(1rem,3vw,4vh)]"
                            onClick={() => handleSelect(index, fd)}
                            style={{
                                opacity: fd.cleared ? 0 : 1,
                                pointerEvents: fd.cleared ? "none" : "auto",
                                backgroundColor: fd.chosen ? "#4f46e5" : "#4f46e5AA",
                                borderColor: fd.chosen ? "white" : "#a5b4fc",
                                boxShadow: fd.chosen ? "0 0 20px rgba(255,255,255,0.6)" : "none",
                            }}
                        >
                            {fd.content}
                        </div>
                    )
                )}
            </div>

            <LoosingDialog showLoseDialog={showLoseDialog} setShowLoseDialog={setShowLoseDialog} setSetting={setSetting} setFunc={setFunc}/>
            <EndingDialog showEndDialog={showEndDialog} setShowEndDialog={setShowEndDialog} setSetting={setSetting} setFunc={setFunc}/>
        </div>
    );
}


function Setting({
                     setting, number, canFlip, setCanFlip, setSetting, setNumber,
                     timeLimit, setTimeLimit
                 }:{
    setting:boolean; number:number; canFlip:boolean;
    setCanFlip:(v:boolean)=>void;
    setSetting:(v:boolean)=>void;
    setNumber:(v:number)=>void;
    timeLimit:number;
    setTimeLimit:(v:number)=>void;
}){
    const [subNum, setSubNum] = useState(number);
    const [subCanFlip, setSubCanFlip] = useState(canFlip);
    const [subTime, setSubTime] = useState(timeLimit);

    useEffect(() => {
        if(setting){
            setNumber(subNum);
            setCanFlip(subCanFlip);
        }
    },[setting])

    const handleReset = () => {
        setSubCanFlip(canFlip);
        setSubNum(number);
        setSubTime(timeLimit);
    }

    const handleApply = ()=> {
        setNumber(subNum);
        setCanFlip(subCanFlip);
        setTimeLimit(subTime);
        setSetting(false);
    }

    return(
        <Dialog open={setting} onOpenChange={setSetting}>
            <DialogContent className="bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6 w-[55vw] max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-[2.6vh] font-bold text-indigo-200">Game option</DialogTitle>
                    <DialogDescription className="text-indigo-400 text-[2vh]">
                        Choose the number of card you want the game has and choose the type of game you want
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 mt-4 text-[2.2vh] font-semibold">
                    {/* Number of questions */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Number of cards per term</h3>
                        <NumberTpTInput value={subNum} setValue={setSubNum} />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Time limit (seconds)</h3>
                        <NumberTpTInput value={subTime} setValue={setSubTime} />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">The cards are flipped</h3>
                        <Switch
                            checked={subCanFlip}
                            onCheckedChange={(checked) => {
                                setSubCanFlip(checked);
                            }}
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            Reset
                        </button>

                        <button
                            onClick={handleApply}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function EndingDialog({showEndDialog, setShowEndDialog, setSetting, setFunc}:
                      {showEndDialog:boolean; setShowEndDialog:(e:boolean) => void;
                      setSetting: React.Dispatch<React.SetStateAction<boolean>>;
                      setFunc:(e:number) => void;}) {
    return(
        <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
            <DialogContent className="bg-slate-900 text-indigo-100 border border-indigo-700/40">
                <DialogHeader>
                    <h1 className="text-[4vh] font-bold text-indigo-200">
                        You have finished the game
                    </h1>
                </DialogHeader>

                <p className="text-[2.5vh] mb-4 text-indigo-300">
                    Do you want to play again?
                </p>

                <div className="flex flex-row justify-around mt-4">
                    <Button
                        className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600"
                        onClick={() => {
                            setShowEndDialog(false);
                            setSetting(s => !s);
                        }}
                    >
                        Yes
                    </Button>

                    <Button
                        className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
                        onClick={() => {
                            setShowEndDialog(false);
                            setFunc(0);
                        }}
                    >
                        No
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function LoosingDialog({showLoseDialog, setShowLoseDialog, setSetting, setFunc}:
                       {showLoseDialog:boolean; setShowLoseDialog:(e:boolean) => void;
                       setSetting: React.Dispatch<React.SetStateAction<boolean>>;
                       setFunc:(e:number) => void;}){
    return(
        <Dialog open={showLoseDialog} onOpenChange={setShowLoseDialog}>
            <DialogContent className="bg-slate-900 text-red-200 border border-red-700/40">
                <DialogHeader>
                    <h1 className="text-[4vh] font-bold text-red-400">
                        Time's up!
                    </h1>
                </DialogHeader>

                <p className="text-[2.5vh] mb-4 text-red-300">
                    You have lost the game.
                </p>

                <div className="flex justify-around">
                    <Button
                        className="bg-indigo-500 px-6 py-3"
                        onClick={() => {
                            setShowLoseDialog(false);
                            setSetting(true);
                        }}
                    >
                        Play again
                    </Button>

                    <Button
                        className="bg-red-500 px-6 py-3"
                        onClick={() => {
                            setShowLoseDialog(false);
                            setFunc(0);
                        }}
                    >
                        Exit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}