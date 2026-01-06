import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {object as BEObj} from "../../wailsjs/go/models";
import UICard = BEObj.Card;

import {
    ArrowBigLeft, Trash2, Merge
} from "lucide-react";

import { LoadDeck } from "../../wailsjs/go/controller/DeckHandler";
import { LoadFolder } from "../../wailsjs/go/controller/FolderHandler";
import { IsFile } from "../../wailsjs/go/controller/Util";

import RenderDeckPage from "@/pages/MainDeckPage";

export interface Data {
    name: string;
    numOfChildren: number;
    proficiency: number;
}

export interface Metadata {
    name: string;
    children: Data[];
}

export interface FLoader {
    name: string;
    dirs: string[];
}

export interface FolderCreator {
    name: string;
    dirs: string[];
    metadata: Metadata;
}

export default function MainPage() {
    const [page, setPage] = useState(1);
    const [dirs, setDirs] = useState<string[]>([]);
    const [cards, setCards] = useState<UICard[]>([]);
    const renderPage = () => {
        switch (page) {
            case 2:
                return <DeckPage setPage={setPage} dirs={dirs} setDirs={setDirs} cards={cards} setCards={setCards} />;
            default:
                return <MainContent setPage={setPage} dirs={dirs} setDirs={setDirs} setCards={setCards} />;
        }
    };

    return renderPage();
}

function MainContent({setPage, dirs, setDirs, setCards}:
                     {setPage: (page:number)=>void; dirs: string[]; setDirs: React.Dispatch<React.SetStateAction<string[]>>;
                    setCards: React.Dispatch<React.SetStateAction<UICard[]>>;}) {
    const [isMulti, setIsMulti] = useState(false);
    const [list, setList] = useState<Metadata>();

    const handleOpen = async (name: string) => {
        const check = await IsFile(dirs, name);
        if (check === 0) {
            const fLoader: FLoader = {
                name: "",
                dirs: [...dirs, name],
            };

            try {
                // @ts-ignore
                const curFolder: Metadata = await LoadFolder(fLoader);

                setDirs(prev => [...prev, name]);
                setList(curFolder);
            } catch (err) {
                console.log("Can not open the folder:", err);
            }
        } else {
            const fLoader: FLoader = {
                name: name,
                dirs: [...dirs],
            };
            try {
                const subCards:UICard[] = await LoadDeck(fLoader);
                setCards(subCards);
                setDirs(prev => [...prev, name]);
                setPage(2);
            } catch (err) {
                console.log("Can not open the folder:", err);
            }
        }
    };

    // Load deck while component mount
    useEffect(() => {
        loadList();
    }, [dirs]);

    const loadList = async () => {
        const fLoader : FLoader = {
            name:"",
            dirs: dirs
        }
        try{
            // @ts-ignore
            const curFolder:Metadata = await LoadFolder(fLoader);
            setList(curFolder)
        }catch (err){
            console.log(err);
        }
    }

    const handleBack = async () => {
        if (dirs.length > 1) {
            setDirs(prev => {
                const newDirs = prev.slice(0, -1);
                // Call open with parent folder
                const parentName = newDirs[newDirs.length - 1];
                if (parentName) {
                    handleOpen(parentName);
                }
                return newDirs;
            });
        } else {
            // back to main
            setDirs([]);
            setPage(1);
        }
    };

    return(
        <div className="flex flex-col gap-0 justify-start items-center mt-[-5vh] ">
            {dirs.length >= 1 && (
                <div className="w-[70vw] flex justify-start mb-[3vh]">
                    <Button
                        className="w-[6vh] h-[6vh]
                       bg-slate-900 text-indigo-300 font-bold
                       border-[2px] border-indigo-600 rounded-full"
                        onClick={handleBack}
                    >
                        <ArrowBigLeft className="w-7 h-7" />
                    </Button>
                </div>
            )}

            {dirs.length < 1 && (
                <div className="h-[9vh]"></div>
            )}

            <Card className="w-[70vw]
                    bg-slate-900 rounded-none rounded-t-lg shadow-cyan-900-sm
                    border-indigo-950">
                <CardHeader className="flex flex-row justify-between text-indigo-100
                                font-bold text-[2.6vh]
                                px-[2vw] py-[2vh]">
                    <div className="flex w-[65%] justify-start">
                        <h3>Name</h3>
                    </div>
                    <div className="flex flex-row gap-[8vw] justify-end w-[35%]">
                        <h3>Items</h3>
                    </div>
                </CardHeader>
            </Card>

            <ListContainer
                list={list}
                isMulti={isMulti}
                onOpen={handleOpen}
            />

            <Card className="w-[70vw]
                    bg-slate-900 rounded-none rounded-b-lg shadow-cyan-900-sm
                    border-indigo-950">
                <CardContent className="flex justify-end items-center space-x-10 text-indigo-100">
                    {actonWithMulti(isMulti)}
                    <div className="flex pt-[2.5vh] pb-[-0.5vh] items-center justify-center space-x-1">
                        <Checkbox
                            className="h-5 w-5 border-[0.3vh] border-indigo-800
                               data-[state=checked]:bg-indigo-500"
                            checked={isMulti}
                            onCheckedChange={() => setIsMulti(!isMulti)}
                        />
                        <Label className="text-[2vh] font-bold leading-none">
                            Select multiple
                        </Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ListContainer({list, isMulti, onOpen
                       }: { list: Metadata | undefined; isMulti: boolean; onOpen: (name: string) => void;
                        }) {
    if (!list) {
        return <div className="w-[70vw] text-indigo-300 p-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col w-[70vw] items-center">
            {list.children.map((item, index) => (
                <ListItem
                    key={index}
                    item={item}
                    isMulti={isMulti}
                    onOpen={onOpen}
                />
            ))}
        </div>
    );
}

function ListItem({item, isMulti, onOpen}:
                  {item:Data | undefined, isMulti: boolean,  onOpen: (name: string) => void}){
    if (!item) {
        return <div className="w-[70vw] text-indigo-300 p-4">Loading...</div>;
    }
    return (
        <Card className={cardMiddle()}
              onClick={ (e) => {
                  if (!isMulti) onOpen(item.name);
                  else e.stopPropagation();
              }}
        >
            <CardContent className='flex justify-between text-indigo-100
                            text-[2.2vh] px-[2vw] py-[2vh]'>
                <div className='flex w-[65%] items-center justify-start space-x-1'><CheckboxCard checked={isMulti} /><h3>{item.name}</h3></div>
                <div className='flex flex-row gap-[8vw] justify-between w-[4%]'>
                    <h3>{item.numOfChildren}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

function  DeckPage({setPage, dirs, setDirs, cards, setCards}:
                   {setPage: (page:number)=>void; setDirs: React.Dispatch<React.SetStateAction<string[]>>;
                   dirs: string[]; cards:UICard[]; setCards: React.Dispatch<React.SetStateAction<UICard[]>>;}) {
    return (
        <RenderDeckPage dirs={dirs} setDirs={setDirs} cards={cards} setCards={setCards} setPage={setPage}/>
    );
}

function cardMiddle(){
    return `w-[70vw]
    bg-slate-900 rounded-none shadow-cyan-900-sm
    border-indigo-950
    hover:border-gray-950 hover:bg-gray-950`;
}

function CheckboxCard({checked}:{checked:boolean}){
    const [choosen, setchoosen] = useState(false);
    if(!checked) return null;
    return (
        checked ? <Checkbox className='h-5 w-5 border-[0.25vh] border-indigo-800
        data-[state=checked]:bg-indigo-500'
        checked={choosen}
        onCheckedChange={(value) =>{setchoosen(!choosen)}}
        onClick={(e) => e.stopPropagation()} // <-- very important
        /> : null
    );
}

function actonWithMulti(checked:boolean){
    return checked ? <div className='flex flex-row items-center justify-center space-x-10 pt-[2vh]'>
        <Button className='bg-emerald-700 rounded-[2vh] border-[1.4px]
        border-green-600 hover:bg-emerald-900'>
            <Merge/>
            Merge
        </Button>
        <Button className='bg-red-700 rounded-[2vh] border-[1.4px]
        border-red-500 hover:bg-red-900'>
            <Trash2/>
            Trash
        </Button>
    </div> : null;
}




