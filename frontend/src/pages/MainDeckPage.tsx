import {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";

import {object as BEObj} from "../../wailsjs/go/models";
import UICard = BEObj.Card;
import Deck = BEObj.Deck;
import FileCreator = BEObj.FileCreator;
import DeckExporter = BEObj.DeckExpoter;
import FLoader = BEObj.FLoader;
import {ExportDeck} from "../../wailsjs/go/service/Service";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    Dialog, DialogContent, DialogHeader, DialogFooter,
    DialogTitle, DialogDescription
} from "@/components/ui/dialog";

import {
    ArrowBigLeft, FolderInput, Trash2, Wand,
    Download, SquarePen, GraduationCap, CircleArrowRight,
    Puzzle, BookCheck, Repeat, Earth, SearchCheck,
    ArrowLeft, ArrowRight, Flame
} from "lucide-react";

import {UpdateDeck} from "../../wailsjs/go/controller/DeckHandler";

import LearnPage from "@/pages/LearningPage";
import {MatchPage} from "@/pages/MatchPage";
import {PTPage} from "@/pages/PTPage";
import {SpaceRepPage} from "@/pages/SpaceRepPage";
import {MeteoritePage} from "@/pages/MeteoritePage";
import {FindWordPage} from "@/pages/FindWordPage";
import {MazePage} from "@/pages/MazePage";

// export interface Deck {
//     cards: UICard[];
// }
//
// export interface FileCreator {
//     name: string;
//     deck: Deck;
//     dirs: string[];
// }

export default function RenderDeckPage({setPage, dirs, setDirs, cards, setCards}:
                        {setPage: (page:number)=>void; setDirs: React.Dispatch<React.SetStateAction<string[]>>;
                            dirs: string[]; cards:UICard[]; setCards: React.Dispatch<React.SetStateAction<UICard[]>>;}){

    const [func, setFunc] = useState(0);

    const firstLoad = useRef(true);

    useEffect(() => {
        if (func === 0) {
            if (firstLoad.current) {
                firstLoad.current = false;
                return;
            }

            const body = FileCreator.createFrom({
                dirs: dirs.slice(0, -1),
                name: dirs[dirs.length - 1] ?? "Deck",
                deck: {
                    cards: cards
                }
            });

            // @ts-ignore
            UpdateDeck(body).catch(err => console.error("CreateDeck failed:", err));
        }
    }, [func]);


    const renderPage = () =>{
        switch (func){
            case 1: return <LearnPage card={cards} cardName={dirs[dirs.length - 1]} setFunc={setFunc} setCards={setCards}/>;
            case 2: return <MatchPage cards={cards} setFunc={setFunc}/>;
            case 3: return <PTPage setFunc={setFunc} cards={cards}/>;
            case 4: return <SpaceRepPage setFunc={setFunc}/>;
            case 5: return <MeteoritePage setFunc={setFunc}/>;
            case 6: return <FindWordPage setFunc={setFunc}/>;
            case 7: return <MazePage setFunc={setFunc} cards={cards}/>
            default: return <FlashcardPage setPage={setPage} setDirs={setDirs} dirs={dirs} setCards={setCards} cards={cards} setFunc={setFunc}/>;
        }
    }

    return renderPage();
}

function FlashcardPage({setPage, dirs, setDirs, cards, setCards, setFunc}:
                       {setPage: (page:number)=>void; setDirs: React.Dispatch<React.SetStateAction<string[]>>;
                       dirs: string[]; cards:UICard[]; setCards: React.Dispatch<React.SetStateAction<UICard[]>>;
                       setFunc: React.Dispatch<React.SetStateAction<number>>;}){

    return(
        <div className='flex flex-col w-[65%] gap-[7vh] justify-start items-center
        mt-[-5vh] '>
            <Button className='self-start w-[6vh] h-[6vh]
            bg-slate-900 text-indigo-300 font-bold
            border-[2px] border-indigo-600 rounded-full'
                    onClick={() => {
                        setPage(1);
                        setDirs(prev => prev.slice(0, -1));
                    }}>
                <ArrowBigLeft className='w-7 h-7'/>
            </Button>
            <div>
                <DeckDetail setPage={setPage} dirs={dirs} setDirs={setDirs} cards={cards} setCards={setCards} name={dirs[dirs.length - 1]} />
            </div>
            <div className='flex flex-row flex-wrap justify-between gap-[4vh] w-[80vw]'>
                <LearnFunction setFunc={setFunc}/><MatchFunction setFunc={setFunc}/><TestFunction setFunc={setFunc}/><SpaceRepFunction setFunc={setFunc}/><GameFunction setFunc={setFunc}/><FindWordFunction setFunc={setFunc}/><MazeFunc setFunc={setFunc}/>
            </div>
            <div className='py-[3vh]'/>
        </div>
    );
}

function DeckDetail({setPage, dirs, setDirs, cards, setCards, name}:
                    {setPage: (page:number)=>void; dirs:string[]; setDirs: React.Dispatch<React.SetStateAction<string[]>>;
                        cards:UICard[]; setCards: React.Dispatch<React.SetStateAction<UICard[]>>; name:string} ) {
    const [checkDelete, setCheckDelete] = useState(false);
    const [exported, setExported] = useState(false);
    return(
        <div className='flex flex-col gap-[4vh]'>

            {/*Title of page*/}
            <Card className='w-[70vw] bg-slate-900
        rounded-3xl shadow-cyan-900-sm border-indigo-950'>
                <CardContent className='flex flex-row justify-between items-center
            text-indigo-100 font-bold text-[4vh] p-0 py-[2vh] px-[2vw]'>
                    {name}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className='bg-teal-600 rounded-[4vh] border-[1.4px]
                    border-green-600 hover:border-white hover:bg-teal-600
                    h-[6vh] w-[8vw] font-bold'>
                                <Wand/>
                                Action
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='bg-slate-800 text-indigo-100 font-semibold
                rounded-3xl'>
                            <DropdownMenuItem className='rounded-3xl data-[highlighted]:bg-indigo-100'>
                                <SquarePen/>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className='rounded-3xl data-[highlighted]:bg-indigo-100'>
                                <FolderInput/>
                                Move
                            </DropdownMenuItem>
                            <DropdownMenuItem className='rounded-3xl data-[highlighted]:bg-indigo-100'
                                              onSelect={(e) => {
                                                  setExported(true)
                                              }}>
                                <Download/>
                                Export
                            </DropdownMenuItem>
                            <DropdownMenuItem className='rounded-3xl data-[highlighted]:bg-indigo-100 text-red-500'
                                              onSelect={(e) => {
                                                  setCheckDelete(true)
                                              }}>
                                <Trash2/>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardContent>
                {/*Dialog of deleting*/}
                <AlertDialog open={checkDelete} onOpenChange={setCheckDelete}>
                    <AlertDialogContent className="bg-slate-900 text-indigo-100
                    border border-indigo-700/40
                    rounded-3xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[2.6vh] font-bold text-indigo-200">
                                Are you absolutely sure to delete?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[1.9vh] text-indigo-300">
                                Once deleted, this item cannot be restored.
                                Are you sure you want to continue?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                className="bg-slate-800 text-indigo-200 border border-slate-700
                        hover:bg-slate-700 rounded-xl transition-all duration-150">
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                className="bg-red-600 text-white font-bold
                            hover:bg-red-700 rounded-xl transition-all duration-150"
                                onClick={() => {
                                    setCheckDelete(false)
                                    setPage(1)
                                    setDirs(prev => prev.slice(0, -1));
                                    console.log("Deleting...");
                                }}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <ExportCard exported={exported} setExported={setExported} dirs={dirs} />
            </Card>
            <div className='flex justify-center'>
                <FlashCard cards={cards} setCards={setCards}/>
            </div>

        </div>
    );
}

function ExportCard({exported, setExported, dirs} :
                    {exported : boolean;
                     dirs: string[];
                    setExported : (exported: boolean) => void })
{
    const [divider, setDivider] = useState(';');
    const [endline, setEndline] = useState('\n');
    const [exportedContent, setExportedContent] = useState('');

    const exportDeck = async () =>{
        const exporter = new DeckExporter(
            {
                infor: new FLoader({
                    name: dirs[dirs.length - 1],
                    dirs: dirs.slice(0, -1)
                }),
                divider: divider,
                endline: endline,
            }
        )
        const content = await ExportDeck(exporter);
        setExportedContent(content);
    }

    useEffect(() => {
        exportDeck();
    }, [divider, endline]);

    function displayToValue(v: string) {
        return v
            .replaceAll("\\n", "\n")
            .replaceAll("\\t", "\t")
            .replaceAll("\\r", "\r");
    }

    function valueToDisplay(v: string) {
        return v
            .replaceAll("\n", "\\n")
            .replaceAll("\t", "\\t")
            .replaceAll("\r", "\\r");
    }

    return(
        <Dialog open={exported} onOpenChange={setExported}>
            <DialogContent
                className="bg-slate-900 text-indigo-100
    border border-indigo-700/40
    rounded-3xl p-6 w-[60vw] max-w-[650px]"
            >
                <DialogHeader className="flex flex-col items-start justify-center gap-2">

                    <h1 className='font-bold text-[2.8vh] text-indigo-200'>
                        EXPORT DECK
                    </h1>

                    <h3 className='text-[2.2vh] text-indigo-400'>
                        How you want to export your deck content
                    </h3>

                    <div className="flex w-full flex-row items-center justify-between mt-4">
                        {/* Left input */}
                        <div className="flex flex-col gap-1 font-semibold text-[2.1vh]">
                            <h3 className='text-indigo-300'>Between term and definition</h3>
                            <Input
                                className="rounded-full h-[4.5vh]
            bg-slate-800 border border-slate-700
            text-indigo-100 focus:ring-0"
                                value={valueToDisplay(divider)}
                                onChange={e => setDivider(displayToValue(e.target.value))}
                            />
                        </div>

                        {/* Right input */}
                        <div className="flex flex-col gap-1 font-semibold text-[2.1vh]">
                            <h3 className='text-indigo-300'>Between rows</h3>
                            <Input
                                className="rounded-full h-[4.5vh]
            bg-slate-800 border border-slate-700
            text-indigo-100 focus:ring-0"
                                value={valueToDisplay(endline)}
                                onChange={e => setEndline(displayToValue(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-1 mt-5 font-semibold text-[2.1vh]'>
                        <h3 className='text-indigo-300'>Copy and paste the text below. It is read-only.</h3>
                        <Textarea
                            value= {exportedContent === "" ? "Deck will  be exported here" : exportedContent}
                            readOnly
                            className="rounded-1 min-h-[200px]
          bg-slate-800 border border-slate-700
          text-indigo-400 opacity-90 select-all cursor-default"
                        />
                    </div>

                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

function LearnFunction({setFunc}:
                       {setFunc: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <Card
            className="flex w-[30%] items-center justify-between
                       bg-slate-900 border border-sky-800/40
                       text-sky-200 rounded-2xl shadow-sm
                       transition-colors duration-200
                       hover:bg-slate-800/80 hover:border-sky-500
                       cursor-pointer select-none"
            onClick={() => {setFunc(1)}}
        >
            <CardContent
                className="flex flex-row items-center justify-between w-full
                           px-[2vw] py-[2vh] text-[3vh] font-semibold"
            >
                {/* Cụm bên trái: icon + text */}
                <div className="flex flex-row items-center gap-[1vh]">
                    <GraduationCap className="size-[4vh] text-sky-300" />
                    <span className="tracking-wide text-sky-100">Learn</span>
                </div>

                {/* Mũi tên bên phải */}
                <CircleArrowRight
                    className="size-[4vh] text-sky-400 transition-colors duration-200
                               hover:text-sky-200 cursor-pointer"
                />
            </CardContent>
        </Card>
    );
}

function MatchFunction({setFunc}:
                       {setFunc: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <Card
            className="flex w-[30%] items-center justify-between
                       bg-slate-900 border border-orange-800/40
                       text-orange-200 rounded-2xl shadow-sm
                       transition-colors duration-200
                       hover:bg-slate-800/80 hover:border-orange-500
                       cursor-pointer select-none"
            onClick={() =>{setFunc(2)}}
        >
            <CardContent
                className="flex flex-row items-center justify-between w-full
                           px-[2vw] py-[2vh] text-[3vh] font-semibold"
            >
                {/* Cụm bên trái: icon + text */}
                <div className="flex flex-row items-center gap-[1vh]">
                    <Puzzle className="size-[4vh] text-orange-300" />
                    <span className="tracking-wide text-orange-100">Match</span>
                </div>

                {/* Mũi tên bên phải */}
                <CircleArrowRight
                    className="size-[4vh] text-orange-400 transition-colors duration-200
                               hover:text-orange-200 cursor-pointer"
                />
            </CardContent>
        </Card>
    );
}

function TestFunction({setFunc}:
                      {setFunc: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <Card
            className="flex w-[30%] items-center justify-between
                       bg-slate-900 border border-emerald-800/40
                       text-emerald-200 rounded-2xl shadow-sm
                       transition-colors duration-200
                       hover:bg-slate-800/80 hover:border-emerald-500
                       cursor-pointer select-none"
            onClick={() =>{setFunc(3)}}
        >
            <CardContent
                className="flex flex-row items-center justify-between w-full
                           px-[2vw] py-[2vh] text-[3vh] font-semibold"
            >
                {/* Cụm bên trái: icon + text */}
                <div className="flex flex-row items-center gap-[1vh]">
                    <BookCheck className="size-[4vh] text-emerald-300" />
                    <span className="tracking-wide text-emerald-100">Practice test</span>
                </div>

                {/* Mũi tên bên phải */}
                <CircleArrowRight
                    className="size-[4vh] text-emerald-400 transition-colors duration-200
                               hover:text-emerald-200 cursor-pointer"
                />
            </CardContent>
        </Card>
    );
}

function SpaceRepFunction({setFunc}:
                          {setFunc: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <Card
            className="flex w-[30%] items-center justify-between
                       bg-slate-900 border border-red-800/40
                       text-red-200 rounded-2xl shadow-sm
                       transition-colors duration-200
                       hover:bg-slate-800/80 hover:border-red-500
                       cursor-pointer select-none"
            onClick={()=>{setFunc(4)}}
        >
            <CardContent
                className="flex flex-row items-center justify-between w-full
                           px-[2vw] py-[2vh] text-[3vh] font-semibold"
            >
                {/* Cụm bên trái: icon + text */}
                <div className="flex flex-row items-center gap-[1vh]">
                    <Repeat className="size-[4vh] text-red-300" />
                    <span className="tracking-wide text-red-100">Spaced repetition</span>
                </div>

                {/* Mũi tên bên phải */}
                <CircleArrowRight
                    className="size-[4vh] text-red-400 transition-colors duration-200
                               hover:text-red-200 cursor-pointer"
                />
            </CardContent>
        </Card>
    );
}

function GameFunction({setFunc}:
                      {setFunc: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <Card
            className="flex w-[30%] items-center justify-between
                       bg-slate-900 border border-stone-800/40
                       text-stone-200 rounded-2xl shadow-sm
                       transition-colors duration-200
                       hover:bg-slate-800/80 hover:border-stone-500
                       cursor-pointer select-none"
            onClick={() =>{setFunc(5)}}
        >
            <CardContent
                className="flex flex-row items-center justify-between w-full
                           px-[2vw] py-[2vh] text-[3vh] font-semibold"
            >
                {/* Cụm bên trái: icon + text */}
                <div className="flex flex-row items-center gap-[1vh]">
                    <Earth className="size-[4vh] text-stone-300" />
                    <span className="tracking-wide text-stone-100">Meteorite</span>
                </div>

                {/* Mũi tên bên phải */}
                <CircleArrowRight
                    className="size-[4vh] text-stone-400 transition-colors duration-200
                               hover:text-stone-200 cursor-pointer"
                />
            </CardContent>
        </Card>
    );
}

function FindWordFunction({setFunc}:
                          {setFunc: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <Card
            className="flex w-[30%] items-center justify-between
                       bg-slate-900 border border-fuchsia-800/40
                       text-fuchsia-200 rounded-2xl shadow-sm
                       transition-colors duration-200
                       hover:bg-slate-800/80 hover:border-fuchsia-500
                       cursor-pointer select-none"
            onClick={() => {setFunc(6)}}
        >
            <CardContent
                className="flex flex-row items-center justify-between w-full
                           px-[2vw] py-[2vh] text-[3vh] font-semibold"
            >
                {/* Cụm bên trái: icon + text */}
                <div className="flex flex-row items-center gap-[1vh]">
                    <SearchCheck className="size-[4vh] text-fuchsia-300" />
                    <span className="tracking-wide text-fuchsia-100">Find word</span>
                </div>

                {/* Mũi tên bên phải */}
                <CircleArrowRight
                    className="size-[4vh] text-fuchsia-400 transition-colors duration-200
                               hover:text-fuchsia-200 cursor-pointer"
                />
            </CardContent>
        </Card>
    );
}

function MazeFunc({setFunc}:
                          {setFunc: React.Dispatch<React.SetStateAction<number>>}) {
    return (
        <Card
            className="flex w-[30%] items-center justify-between
                       bg-slate-900 border border-lime-800/40
                       text-lime-200 rounded-2xl shadow-sm
                       transition-colors duration-200
                       hover:bg-slate-800/80 hover:border-lime-500
                       cursor-pointer select-none"
            onClick={() => {setFunc(7)}}
        >
            <CardContent
                className="flex flex-row items-center justify-between w-full
                           px-[2vw] py-[2vh] text-[3vh] font-semibold"
            >
                {/* Cụm bên trái: icon + text */}
                <div className="flex flex-row items-center gap-[1vh]">
                    <Flame className="size-[4vh] text-lime-300" />
                    <span className="tracking-wide text-lime-100">Maze</span>
                </div>

                {/* Mũi tên bên phải */}
                <CircleArrowRight
                    className="size-[4vh] text-lime-400 transition-colors duration-200
                               hover:text-lime-200 cursor-pointer"
                />
            </CardContent>
        </Card>
    );
}

function FlashCard({cards, setCards}:
                   {cards:UICard[]; setCards: React.Dispatch<React.SetStateAction<UICard[]>>;}) {
    const [flipped, setFlipped] = useState(false);
    const [index, setIndex] = useState(1);
    const [showTermFirst, setShowTermFirst] = useState(true);
    const [front, setFront] = useState(cards[index - 1].term);
    const [back, setBack] = useState(cards[index - 1].definition);
    const total:number = cards.length;
    const [shuffled, setShuffled] = useState(false);
    const [originalCards] = useState(cards);
    const [disableFlipAnimation, setDisableFlipAnimation] = useState(false);

    const instantFlipToFront = () => {
        setDisableFlipAnimation(true);
        setFlipped(false);

        requestAnimationFrame(() => {
            setDisableFlipAnimation(false);
        });
    };

    const toggleShuffle = () => {
        if (!shuffled) {
            // Shuffle
            const newCards = [...originalCards].sort(() => Math.random() - 0.5);
            setCards(newCards);
            setIndex(1); // reset to first card
        } else {
            // Restore
            setCards(originalCards);
            setIndex(1);
        }
        setShuffled(!shuffled);
    };

    useEffect(() => {
        const card = cards[index - 1];
        setFront(card.term + "\n" + "(" + card.pronounce + ")");
        setBack(card.definition + "\n" + "(" + card.note + ")");
    }, [index, cards]);

    return (
        <div className="w-full flex flex-col items-center gap-4">

            {/* --- FLASHCARD --- */}
            <div
                className="perspective-1000 w-[80%] aspect-[9/5] mx-auto"
                onClick={() => setFlipped(!flipped)}
            >
                <motion.div
                    className="relative w-full h-full cursor-pointer"
                    animate={{ rotateX: flipped ? 180 : 0 }}
                    transition={disableFlipAnimation ? { duration: 0 } : { duration: 0.5, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                >

                    {/* FRONT */}
                    <Card
                        className="absolute inset-0 h-full backface-hidden bg-slate-900 border border-stone-800/40
            text-blue-100 rounded-2xl shadow-md flex
            transition-colors duration-300 hover:bg-slate-800/80 hover:border-blue-500"
                    >
                        <CardContent className="flex justify-center items-center w-full h-full text-[4vh] font-semibold whitespace-pre-line">
                            {showTermFirst ? front : back}
                        </CardContent>
                    </Card>

                    {/* BACK */}
                    <Card
                        className="absolute inset-0 h-full backface-hidden bg-slate-900 border border-fuchsia-800/40
            text-fuchsia-100 rounded-2xl shadow-md flex
            transition-colors duration-300 hover:bg-slate-800/80 hover:border-violet-500"
                        style={{ transform: "rotateX(180deg)" }}
                    >
                        <CardContent className="flex justify-center items-center w-full h-full text-[4vh] font-semibold whitespace-pre-line">
                            {showTermFirst ? back : front}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* --- NAVIGATION BAR --- */}

            <div className='flex flex-row items-center justify-between w-[80%]'>
                <div className='flex items-center space-x-2'>
                    <Label className='text-indigo-100 font-bold text-lg'>
                        Card Shuffle
                    </Label>
                    <Switch
                        className="
                        data-[state=checked]:bg-indigo-500
                        data-[state=unchecked]:bg-indigo-300
                        transition-colors
                      "
                        onClick={() => {
                            toggleShuffle();
                            instantFlipToFront();
                        }}
                    />
                </div>
                <Card className="bg-slate-900 px-3 py-2 rounded-full border border-slate-800/60 flex items-center gap-4 select-none">
                    <Button
                        className="bg-indigo-400 hover:bg-indigo-400 border border-slate-950
                    w-8 h-8 rounded-full hover:border-white p-0 transition-transform hover:scale-110"
                        onClick={(e) => {
                            if (index > 1) {
                                setIndex((prev) => prev - 1);
                                instantFlipToFront();
                            }
                        } }
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <span className="text-indigo-100 font-bold text-lg">
                  {index}/{total}
                </span>
                    <Button
                        className="bg-indigo-400 hover:bg-indigo-400 border border-slate-950
                      w-8 h-8 rounded-full hover:border-white p-0 transition-transform hover:scale-110"
                        onClick={(e) =>
                        {
                            if (index < total) {
                                setIndex((prev) => prev + 1);
                                instantFlipToFront();
                            }
                        }}
                    >
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Card>
                <div className='flex items-center space-x-2'>
                    <Label className='text-indigo-100 font-bold text-lg'>
                        Answer with term
                    </Label>
                    <Switch
                        className="
                        data-[state=checked]:bg-indigo-500
                        data-[state=unchecked]:bg-indigo-300
                        transition-colors
                      "
                        onClick={() => setShowTermFirst(!showTermFirst)}
                    />
                </div>
            </div>
        </div>
    );
}
