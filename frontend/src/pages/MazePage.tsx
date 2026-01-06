import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import {ArrowBigLeft} from "lucide-react";
import {number} from "framer-motion";
import {useEffect, useMemo, useRef, useState} from "react";
import {mazecontroller, mazecontroller as MZC} from "../../wailsjs/go/models";
import {object as BEObj} from "../../wailsjs/go/models";

import QuestBlockObj = MZC.QuestBlock;

import UICard = BEObj.Card;

import {CreateNewMaze} from "../../wailsjs/go/mazecontroller/Maze";
import {CreateQuestionBlock} from "../../wailsjs/go/mazecontroller/Maze";
import QuestBlock = mazecontroller.QuestBlock;

export type QuestBlockController = {
    qb: QuestBlockObj;
    isSolved: boolean;
}

export function MazePage({setFunc, cards}:{
    cards: UICard[];
    setFunc: React.Dispatch<React.SetStateAction<number>> }
){
    const [size, setSize] = useState(10);
    const [maze, setMaze] = useState<number[][]>();
    const [reset, setReset] = useState<boolean>(false);

    useEffect(() => {
        setSize(cards.length);
    }, [cards]);

    useEffect(() => {
        generateMaze();
    }, [size, reset]);

    async function generateMaze() {
        const m = await CreateNewMaze(10);
        setMaze(m);
    }

    return (
        <div className='flex flex-col justify-center items-center gap-8'>
            <div className="flex flex-row gap-0 justify-start items-center mt-[-5vh]">
                <div className="flex flex-row w-[70vw] items-center justify-start mb-[3vh]">
                    <Button
                        className="w-[6vh] h-[6vh]
                    bg-slate-900 text-indigo-300 font-bold
                    border-[2px] border-indigo-600 rounded-full"
                        onClick={() => setFunc(0)}
                    >
                        <ArrowBigLeft className="w-7 h-7" />
                    </Button>
                </div>
            </div>
            <Maze matrix={maze} cards={cards} setFunc={setFunc} setReset={setReset} />
        </div>
    );
}

// Normal
function Maze({ matrix, cards, setFunc, setReset }:
              {matrix?:number[][] | undefined; cards: UICard[]; setReset: (e: boolean) => void;
              setFunc: React.Dispatch<React.SetStateAction<number>>;}) {
    if (!matrix) {
        return(
            <div></div>
        );
    }

    type Pos = { x: number; y: number };

    const LIGHT_RADIUS = 4;
    const SPAWN_RANGE = 7;

    const [ghost, setGhost] = useState<Pos | null>(null);
    const [player, setPlayer] = useState({ x: 1, y: 1 });
    const [ghostActive, setGhostActive] = useState(false);
    const [questBlocks, setQuestBlocks] = useState<QuestBlockController[]>([]);

    // Question controller
    const [curIdx, setCurIdx] = useState(-1);
    const [blockAns, setBlockAns] = useState<QuestBlockController>();
    const [caught, setCaught] = useState(false);
    const [startQuest, setStartQuest] = useState(false);
    const [youWin, setYouWin] = useState(false);

    function randomGhostDelay() {
        return 20_000 + Math.random() * 20_000;
    }

    function isInsideMap(x: number, y: number) {
        return x >= 0 &&
            y >= 0 &&
            // @ts-ignore
            x < matrix.length &&
            // @ts-ignore
            y < matrix[0].length;
    }

    function spawnGhost() {
        if (!matrix) return;

        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 1, dy: 1 },
            { dx: -1, dy: -1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
        ];

        const dir = directions[Math.floor(Math.random() * directions.length)];

        let gx = player.x + dir.dx * SPAWN_RANGE;
        let gy = player.y + dir.dy * SPAWN_RANGE;

        gx = Math.max(0, Math.min(matrix.length - 1, gx));
        gy = Math.max(0, Math.min(matrix[0].length - 1, gy));

        if (gx === player.x && gy === player.y) {
            gx = Math.max(0, Math.min(matrix.length - 1, gx + 1));
            gy = Math.max(0, Math.min(matrix[0].length - 1, gy + 1));
        }

        setGhost({ x: gx, y: gy });
        setGhostActive(true);
    }

    // Spawn
    useEffect(() => {
        if (ghostActive) return;

        const timer = setTimeout(() => {
            spawnGhost();
        }, randomGhostDelay());

        return () => clearTimeout(timer);
    }, [ghostActive, matrix]);

    // Follow
    useEffect(() => {
        if (!ghostActive || !ghost) return;

        const speed = 0.39;

        const interval = setInterval(() => {
            setGhost(g => {
                if (!g) return g;

                const dx = player.x - g.x;
                const dy = player.y - g.y;

                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.2) return g;

                return {
                    x: g.x + (dx / dist) * speed,
                    y: g.y + (dy / dist) * speed,
                };
            });
        }, 60);

        return () => clearInterval(interval);
    }, [ghostActive, ghost, player]);

    // Disappear
    useEffect(() => {
        if (!ghostActive) return;

        const timer = setTimeout(() => {
            setGhost(null);
            setGhostActive(false);
        }, 8_000);

        return () => clearTimeout(timer);
    }, [ghostActive]);

    const PLAYER_RADIUS = 0.35;
    const GHOST_RADIUS = 0.35;

    // Collision
    useEffect(() => {
        if(youWin) return;
        if (!ghost) return;

        const dx = ghost.x - player.x;
        const dy = ghost.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.2) {
            setCaught(true);
        }
    }, [ghost, player]);

    const currentKey = useRef<string | null>(null);
    const intervalRef = useRef<any>(null);

    async function getQuestBlocks() {
        const qb = await CreateQuestionBlock(cards);
        const subQBs: QuestBlockController[] = qb.map((q) => ({
            qb: q,
            isSolved: false,
        }));

        setQuestBlocks(subQBs);
    }

    function movePlayer(dx: number, dy: number) {
        setPlayer(prev => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;
            // @ts-ignore
            if (newX < 0 || newX >= matrix.length) return prev;
            // @ts-ignore
            if (newY < 0 || newY >= matrix[0].length) return prev;
            // @ts-ignore
            if (matrix[newX][newY] === 1) return prev;

            return { x: newX, y: newY };
        });
    }

    function isQuestBlock(x: number, y: number): number {
        const index = questBlocks.findIndex(q =>
            q.qb.Block.x === x &&
            q.qb.Block.y === y
        );

        if(index !== -1 && questBlocks[index].isSolved) {return -1;}

        return  index;
    }

    useEffect(() => {
        getQuestBlocks();
    }, [matrix]);

    useEffect(() => {
        function startMoving(key: string) {
            if (currentKey.current === key) return; // already moving with this key

            currentKey.current = key;

            // clear previous interval if any
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                if (currentKey.current === "w") movePlayer(-1, 0);
                if (currentKey.current === "s") movePlayer(1, 0);
                if (currentKey.current === "a") movePlayer(0, -1);
                if (currentKey.current === "d") movePlayer(0, 1);
            }, 80);
        }

        function stopMoving(key: string) {
            if (currentKey.current === key) {
                currentKey.current = null;
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (startQuest) return;
            if (caught) return;

            startMoving(e.key);
        }

        function handleKeyUp(e: KeyboardEvent) {
            stopMoving(e.key);
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [matrix, caught, startQuest]);

    useEffect(() => {
        const idx = isQuestBlock(player.x, player.y);
        const start = idx !== -1;
        setCurIdx(idx);
        setStartQuest(start);
        if(start){
            const subQB = questBlocks[idx];
            setBlockAns(subQB);
        }
    }, [player]);

    useEffect(() => {
        if (!blockAns?.isSolved) return;
        if (curIdx === -1) return;

        setQuestBlocks(prev => {
            const copy = [...prev];
            copy[curIdx] = blockAns;
            return copy;
        });
    }, [blockAns]);

    function resetGame() {
        setPlayer({ x: 1, y: 1 });
        setGhost(null);
        setGhostActive(false);
        setCaught(false);
        setQuestBlocks([]);
    }

    useEffect(() => {
        if(!caught){
            resetGame();
            //@ts-ignore
            setReset(prev => !prev);
        }
    }, [caught]);

    // Win
    useEffect(() => {
        function isWin(){
            return questBlocks.some(item => !item.isSolved);
        }

        setYouWin(!isWin());
    }, [questBlocks]);

    // @ts-ignore
    return (
        <div style={{ position: "relative", width: matrix[0].length * 25, height: matrix.length * 25 }}>
            {caught ? (
                <GameOver setFunc={setFunc} setCaught={setCaught}/>
            ) : youWin ? (
                <YouWin setFunc={setFunc} setYouWin={setYouWin} />
            ): (
                <>
                    {matrix.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ display: "flex" }}>
                            {row.map((cell, colIndex) => {

                                // Squre
                                const isLit =
                                    rowIndex >= player.x - LIGHT_RADIUS &&
                                    rowIndex <= player.x + LIGHT_RADIUS &&
                                    colIndex >= player.y - LIGHT_RADIUS &&
                                    colIndex <= player.y + LIGHT_RADIUS;

                                const opacity = isLit ? 0.85 : 0;

                                return (
                                    <div
                                        key={colIndex}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            backgroundColor: cell === 1
                                                ? "#1B0032"
                                                : "white",
                                            opacity: opacity,     // site of character
                                            border: "1px solid #ccc",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {isQuestBlock(rowIndex, colIndex) !== -1 && <Chest />}
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    {/* Player */}
                    <div
                        style={{
                            position: "absolute",
                            width: 25,
                            height: 25,
                            left: player.y * 25,
                            top: player.x * 25,
                            transition: "all 0.22s linear",
                            zIndex: 10,
                        }}
                    >
                        {Character()}
                    </div>

                    {/* Ghost */}
                    {ghost && (
                        <div
                            style={{
                                position: "absolute",
                                width: 25,
                                height: 25,
                                left: ghost.y * 25,
                                top: ghost.x * 25,
                                zIndex: 9,
                                transition: "all 0.2s linear",
                            }}
                        >
                            {Ghost()}
                        </div>
                    )}
                    {startQuest && (<ChestQuest questBlock={blockAns?.qb} setBlockAns={setBlockAns} setStartQuest={setStartQuest}/>)}
                </>
            )}
        </div>
    );
}

function YouWin({setFunc, setYouWin}:
                  {setFunc: React.Dispatch<React.SetStateAction<number>>;
                  setYouWin:(e:boolean) => void;}){
    return(
        <AlertDialog open={true}>
            <AlertDialogContent className='bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6'>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[2.6vh] font-bold text-emerald-400">
                        You Escaped!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-indigo-400 text-[2vh]">
                        You have collected enough keys to escape the maze.
                        <br />
                        Every puzzle solved brought you closer to freedom.
                        <br />
                        Would you like to try the maze again or leave the game?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {/* Exit */}
                    <AlertDialogCancel
                        onClick={() => setFunc(0)}
                        className='px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors hover:text-white border-none'
                    >
                        Exit
                    </AlertDialogCancel>

                    {/* Restart */}
                    <AlertDialogAction
                        onClick={() => {
                            setYouWin(false);
                        }}
                        className='px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors'
                    >
                        Restart
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function GameOver({setFunc, setCaught}:
                  {setFunc: React.Dispatch<React.SetStateAction<number>>;
                      setCaught:(e:boolean) => void;}){
    return(
        <AlertDialog open={true}>
            <AlertDialogContent className='bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-[2.6vh] font-bold text-red-400'>
                        Game Over
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-indigo-400 text-[2vh]'>
                        The ghost has caught you.
                        <br />
                        Your journey ends here. Would you like to try again or leave the game?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {/* Exit */}
                    <AlertDialogCancel
                        onClick={() => setFunc(0)}
                        className='px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors hover:text-white border-none'
                    >
                        Exit
                    </AlertDialogCancel>

                    {/* Restart */}
                    <AlertDialogAction
                        onClick={() => {
                            setCaught(false);
                        }}
                        className='px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors'
                    >
                        Restart
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function ChestQuest({questBlock, setBlockAns, setStartQuest}:
                    {questBlock: QuestBlock|undefined; setBlockAns:(e:QuestBlockController) => void;
                    setStartQuest:(e:boolean) => void;})
{
    if(!questBlock) return null;
    const [answer, setAnswer] = useState("");
    const [correct, setCorrect] = useState<boolean | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const mode = useMemo<"term" | "definition">(
        () => (Math.random() < 0.5 ? "term" : "definition"),
        []
    );

    const question =
        mode === "term" ? questBlock.Quest.definition : questBlock.Quest.term;

    const correctAnswer =
        mode === "term" ? questBlock.Quest.term : questBlock.Quest.definition;

    function checkAnswer() {
        return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Tab") {
                e.preventDefault();
                // @ts-ignore
                setStartQuest(false);
                return;
            }

            if (e.key === "Enter") {
                e.preventDefault();

                const isCorrect = checkAnswer();
                setCorrect(isCorrect);

                if (!isCorrect) {
                    setAnswer("");
                    setCorrect(null);
                } else {
                    // @ts-ignore
                    setBlockAns({ qb: questBlock, isSolved: true });
                    setStartQuest(false);
                }
                return;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [answer, questBlock]);

    return(
        <AlertDialog open={true}>
            <AlertDialogContent
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    inputRef.current?.focus();
                }}
                className="
            w-[40vw] min-h-[36vh]
            bg-slate-900 text-indigo-100
            rounded-3xl
            border border-indigo-600/40
            p-6
            shadow-[0_0_35px_-12px_rgba(99,102,241,0.45)]
            flex flex-col justify-between
        "
            >
                {/* -------- HEADER -------- */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-indigo-400 font-extrabold text-[2.4vh] tracking-wide">
                        Question
                    </h2>
                    <p className="text-indigo-300/70 text-[1.6vh]">
                        Answer correctly to proceed
                    </p>
                </div>

                {/* -------- CONTENT -------- */}
                <div className="
            mt-5 px-6 py-6
            rounded-2xl
            bg-slate-800/60
            border border-indigo-500/30
            text-center
        ">
                    <h1 className="text-[2.4vh] font-bold leading-relaxed">
                        {question}
                    </h1>

                    <Input
                        ref={inputRef}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className={`
                    mt-6 h-[6.5vh] rounded-full
                    bg-slate-900
                    text-xl font-extrabold text-center
                    placeholder:text-indigo-300
                    border-2
                    transition-all
                    ${
                            correct === null
                                ? "border-indigo-400 text-indigo-100"
                                : correct
                                    ? "border-indigo-500 text-indigo-200"
                                    : "border-rose-400 text-rose-100"
                        }
                `}
                    />
                </div>

                {/* -------- FOOTER -------- */}
                <div className="flex items-center justify-center gap-8 mt-4">
                    {/* STOP */}
                    <Button
                        className="
                    bg-transparent
                    text-rose-400
                    hover:text-rose-500
                    hover:bg-transparent
                    text-[2vh]
                    font-extrabold
                "
                        onClick={() => setStartQuest(false)}
                    >
                        STOP
                    </Button>

                    {/* ANSWER */}
                    <Button
                        className="
                    h-[6vh] px-12
                    rounded-xl
                    bg-indigo-500 hover:bg-indigo-600
                    text-white
                    text-[2.1vh]
                    font-extrabold
                    shadow-[0_0_18px_rgba(99,102,241,0.6)]
                "
                        onClick={() => {
                            const isCorrect = checkAnswer();
                            setCorrect(isCorrect);

                            if (!isCorrect) {
                                setAnswer("");
                                setCorrect(null);
                            } else {
                                setBlockAns({ qb: questBlock, isSolved: true });
                                setStartQuest(false);
                            }
                        }}
                    >
                        ANSWER
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function Character(){
    return (
        <svg width="110%"
             height="110%"
             viewBox="0 0 240 240"
             xmlns="http://www.w3.org/2000/svg">
            <defs>

                <radialGradient id="brimGrad" cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stop-color="#e6d29b"/>
                    <stop offset="100%" stop-color="#b39152"/>
                </radialGradient>


                <radialGradient id="topGrad" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stop-color="#f2e1b5"/>
                    <stop offset="100%" stop-color="#c8ab6b"/>
                </radialGradient>


                <radialGradient id="shine" cx="35%" cy="30%" r="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </radialGradient>
            </defs>


            <circle cx="124" cy="126" r="95" fill="#000" opacity="0.12"/>


            <circle cx="120" cy="120" r="95"
                    fill="url(#brimGrad)"
                    stroke="#6f562b"
                    stroke-width="6"/>


            <circle cx="120" cy="120" r="88"
                    fill="none"
                    stroke="#7f6536"
                    stroke-width="2"
                    opacity="0.6"/>


            <circle cx="120" cy="120" r="82"
                    fill="none"
                    stroke="#9f8349"
                    stroke-width="2"
                    stroke-dasharray="2 6"/>


            <circle cx="120" cy="120" r="60"
                    fill="url(#topGrad)"
                    stroke="#6f562b"
                    stroke-width="5"/>


            <circle cx="120" cy="120" r="46"
                    fill="none"
                    stroke="#a88e55"
                    stroke-width="2"
                    stroke-dasharray="5 5"/>


            <g stroke="#bfa26a" stroke-width="1.5" opacity="0.6">
                <line x1="120" y1="120" x2="120" y2="64"/>
                <line x1="120" y1="120" x2="176" y2="120"/>
                <line x1="120" y1="120" x2="120" y2="176"/>
                <line x1="120" y1="120" x2="64"  y2="120"/>
                <line x1="120" y1="120" x2="162" y2="78"/>
                <line x1="120" y1="120" x2="78"  y2="78"/>
                <line x1="120" y1="120" x2="162" y2="162"/>
                <line x1="120" y1="120" x2="78"  y2="162"/>
            </g>


            <circle cx="120" cy="120" r="60" fill="url(#shine)"/>


            <g fill="#3f3218">
                <circle cx="120" cy="68" r="6"/>
                <circle cx="172" cy="120" r="6"/>
                <circle cx="120" cy="172" r="6"/>
                <circle cx="68"  cy="120" r="6"/>
            </g>
            <g fill="none" stroke="#d6c18a" stroke-width="2">
                <circle cx="120" cy="68" r="8"/>
                <circle cx="172" cy="120" r="8"/>
                <circle cx="120" cy="172" r="8"/>
                <circle cx="68"  cy="120" r="8"/>
            </g>


            <g fill="#e0cc9a" stroke="#6f562b" stroke-width="1">
                <circle cx="120" cy="58" r="2.2"/>
                <circle cx="182" cy="120" r="2.2"/>
                <circle cx="120" cy="182" r="2.2"/>
                <circle cx="58"  cy="120" r="2.2"/>
            </g>


            <g stroke="#6f562b" stroke-width="2">
                <line x1="120" y1="102" x2="120" y2="138"/>
                <line x1="102" y1="120" x2="138" y2="120"/>
            </g>
            <circle cx="120" cy="120" r="17"
                    fill="none"
                    stroke="#6f562b"
                    stroke-width="2"/>


        </svg>
    );
}

function Ghost(){
    return (
        <svg viewBox="0 0 200 280" width="100%" height="140%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ghostBody" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e8f4f8" stopOpacity={1} />
                    <stop offset="50%" stopColor="#c8e6f0" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a0d4e0" stopOpacity={0.9} />
                </linearGradient>

                <radialGradient id="eyeGlow">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={1} />
                    <stop offset="50%" stopColor="#00cc66" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#009944" stopOpacity={0.3} />
                </radialGradient>

                <radialGradient id="pupil">
                    <stop offset="0%" stopColor="#000000" stopOpacity={1} />
                    <stop offset="70%" stopColor="#1a1a1a" stopOpacity={1} />
                    <stop offset="100%" stopColor="#000000" stopOpacity={0.5} />
                </radialGradient>

                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <pattern id="fabricPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                    <rect width="4" height="4" fill="#a0d4e0"/>
                    <line x1="0" y1="0" x2="4" y2="4" stroke="#80c4d0" stroke-width="0.5" opacity="0.3"/>
                </pattern>
            </defs>

            <circle cx="100" cy="140" r="120" fill="rgba(0, 255, 136, 0.05)" />
            <circle cx="100" cy="140" r="100" fill="rgba(0, 255, 136, 0.03)" />

            <path d="M 100 40
                 C 140 40, 160 70, 160 110
                 C 160 140, 155 160, 150 180
                 L 145 220
                 C 145 235, 140 245, 130 250
                 L 70 250
                 C 60 245, 55 235, 55 220
                 L 50 180
                 C 45 160, 40 140, 40 110
                 C 40 70, 60 40, 100 40 Z"
                  fill="url(#ghostBody)" stroke="#80c4d0" stroke-width="0.5" filter="url(#shadow)"/>

            <path d="M 100 40
                 C 140 40, 160 70, 160 110
                 C 160 140, 155 160, 150 180
                 L 145 220
                 C 145 235, 140 245, 130 250
                 L 70 250
                 C 60 245, 55 235, 55 220
                 L 50 180
                 C 45 160, 40 140, 40 110
                 C 40 70, 60 40, 100 40 Z"
                  fill="url(#fabricPattern)" opacity="0.15"/>

            <ellipse cx="100" cy="100" rx="55" ry="65" fill="rgba(0, 0, 0, 0.1)" opacity="0.4"/>

            <g>
                <rect x="80" y="133" width="3" height="7" fill="#1a3a50" rx="1"/>
                <rect x="87" y="133" width="3" height="7" fill="#1a3a50" rx="1"/>
                <rect x="94" y="133" width="3" height="7" fill="#1a3a50" rx="1"/>
                <rect x="101" y="133" width="3" height="7" fill="#1a3a50" rx="1"/>
                <rect x="108" y="133" width="3" height="7" fill="#1a3a50" rx="1"/>
                <rect x="115" y="133" width="3" height="7" fill="#1a3a50" rx="1"/>
            </g>

            <g>
                <ellipse cx="75" cy="90" rx="16" ry="20" fill="#ffffff" filter="url(#glow)"/>

                <circle cx="75" cy="92" r="11" fill="url(#eyeGlow)" filter="url(#glow)"/>

                <circle cx="76" cy="90" r="7" fill="url(#pupil)"/>

                <circle cx="78" cy="87" r="2.5" fill="#ffffff" opacity="0.9"/>
                <circle cx="77" cy="88" r="1.2" fill="#ffffff" opacity="0.7"/>

                <path d="M 59 70 Q 75 65 91 70" stroke="#609090" stroke-width="1.5" fill="none"/>
                <path d="M 59 112 Q 75 117 91 112" stroke="#609090" stroke-width="1.5" fill="none"/>
            </g>

            <g>
                <ellipse cx="125" cy="90" rx="16" ry="20" fill="#ffffff" filter="url(#glow)"/>

                <circle cx="125" cy="92" r="11" fill="url(#eyeGlow)" filter="url(#glow)"/>

                <circle cx="124" cy="90" r="7" fill="url(#pupil)"/>

                <circle cx="122" cy="87" r="2.5" fill="#ffffff" opacity="0.9"/>
                <circle cx="123" cy="88" r="1.2" fill="#ffffff" opacity="0.7"/>

                <path d="M 109 70 Q 125 65 141 70" stroke="#609090" stroke-width="1.5" fill="none"/>
                <path d="M 109 112 Q 125 117 141 112" stroke="#609090" stroke-width="1.5" fill="none"/>
            </g>

            <g opacity="0.3">
                <circle cx="85" cy="170" r="4" fill="#0a4a6a" opacity="0.6"/>
                <circle cx="115" cy="190" r="3.5" fill="#0a4a6a" opacity="0.6"/>
                <circle cx="70" cy="210" r="3" fill="#0a4a6a" opacity="0.5"/>
                <circle cx="130" cy="215" r="2.5" fill="#0a4a6a" opacity="0.5"/>
            </g>

            <g opacity="0.15" filter="url(#glow)">
                <circle cx="45" cy="100" r="8" fill="#00ff88"/>
                <circle cx="155" cy="120" r="6" fill="#00ff88"/>
                <circle cx="60" cy="200" r="5" fill="#00ff88"/>
                <circle cx="140" cy="180" r="7" fill="#00ff88"/>
            </g>
        </svg>
    );
}

function Chest(){
    return (
        <div className='flex justify-start items-start w-[120%] h-[120%]'>
            <svg viewBox="0 0 300 300"
                 width="100%"
                 height="100%"
                 preserveAspectRatio="xMidYMid meet"
                 xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B4513" stopOpacity={1} />
                        <stop offset="50%" stopColor="#A0522D" stopOpacity={1} />
                        <stop offset="100%" stopColor="#654321" stopOpacity={1} />
                    </linearGradient>

                    <radialGradient id="lidGradient" cx="50%" cy="30%">
                        <stop offset="0%" stopColor="#A0522D" stopOpacity={1} />
                        <stop offset="100%" stopColor="#654321" stopOpacity={1} />
                    </radialGradient>

                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
                        <stop offset="50%" stopColor="#FFA500" stopOpacity={1} />
                        <stop offset="100%" stopColor="#DAA520" stopOpacity={1} />
                    </linearGradient>
                </defs>

                <rect x="50" y="110" width="200" height="35" rx="3" fill="url(#woodGradient)" stroke="#3d2817" stroke-width="2"/>

                <rect x="50" y="145" width="200" height="100" fill="url(#woodGradient)" stroke="#3d2817" stroke-width="2"/>

                <rect x="65" y="150" width="8" height="90" fill="#2C2C2C" rx="1"/>
                <rect x="67" y="150" width="4" height="90" fill="#4A4A4A"/>

                <rect x="146" y="150" width="8" height="90" fill="#2C2C2C" rx="1"/>
                <rect x="148" y="150" width="4" height="90" fill="#4A4A4A"/>

                <rect x="227" y="150" width="8" height="90" fill="#2C2C2C" rx="1"/>
                <rect x="229" y="150" width="4" height="90" fill="#4A4A4A"/>

                <rect x="135" y="120" width="30" height="45" rx="2" fill="url(#goldGradient)" stroke="#B8860B" stroke-width="2"/>
                <circle cx="150" cy="142" r="8" fill="#654321" stroke="#B8860B" stroke-width="2"/>
                <rect x="146" y="142" width="8" height="15" fill="#654321"/>

                <circle cx="140" cy="127" r="2" fill="#B8860B"/>
                <circle cx="160" cy="127" r="2" fill="#B8860B"/>
                <circle cx="140" cy="157" r="2" fill="#B8860B"/>
                <circle cx="160" cy="157" r="2" fill="#B8860B"/>

                <rect x="55" y="115" width="20" height="10" rx="2" fill="#2C2C2C"/>
                <circle cx="60" cy="120" r="3" fill="#4A4A4A"/>
                <circle cx="70" cy="120" r="3" fill="#4A4A4A"/>

                <rect x="225" y="115" width="20" height="10" rx="2" fill="#2C2C2C"/>
                <circle cx="230" cy="120" r="3" fill="#4A4A4A"/>
                <circle cx="240" cy="120" r="3" fill="#4A4A4A"/>
            </svg>
        </div>
    );
}