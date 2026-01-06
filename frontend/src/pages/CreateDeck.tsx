import {useEffect, useState} from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftRight, Trash2 } from 'lucide-react';
import {object as BEObj} from "../../wailsjs/go/models";
import DeckCreator = BEObj.DeckCreator;
import FLoader = BEObj.FLoader;
import DeckExporter = BEObj.DeckExpoter;
import {AddNewDeck, ExportDeck} from "../../wailsjs/go/service/Service";

const deckEnd:string = "DECK$$";

type ManualCard = {
    id: number;
    term: string;
    definition: string;
    pronunciation: string;
    note: string;
};

export default function CreateDeck({setAction, selectedDirs}:
                                    {setAction:(v:boolean)=>void;
                                    selectedDirs:string[];}) {
    const [title, setTitle] = useState('');
    const [oldName, setOldName] = useState('');
    const [isImport, setIsImport] = useState(false);
    const [divider, setDivider] = useState(';');
    const [endline, setEndline] = useState('\n');
    const [importText, setImportText] = useState('');
    const [addCount, setAddCount] = useState(1);
    const [newDeck, setNewDeck] = useState<DeckCreator>(
        () => new DeckCreator({
            name: title,
            oldname: oldName,
            dirs: selectedDirs,
            content: "",
            devider: ";",
            endline: "\n",
        })
    );
    const [manualCardList, setManualCardList] = useState<ManualCard[]>([])
    const [exportedContent, setExportedContent] = useState('');

    const exportDeck = async () =>{
        const exporter = new DeckExporter(
            {
                infor: new FLoader({
                    name: removeEnd(selectedDirs[selectedDirs.length - 1], deckEnd),
                    dirs: selectedDirs.slice(0, -1)
                }),
                divider: divider,
                endline: endline,
            }
        )
        const content = await ExportDeck(exporter);
        setExportedContent(content);
        setImportText(content);
    }

    function removeEnd(name: string, deckEnd: string) {
        return name.endsWith(deckEnd)
            ? name.slice(0, -deckEnd.length)
            : name;
    }

    function convertToCard(){
        if (!exportedContent.trim()) return;

        const lines = exportedContent
            .split(endline)
            .map(l => l.trim())
            .filter(l => l.length > 0);

        const cards = lines.map((line, index) => {
            const parts = line.split(divider);

            return {
                id: index,
                term: parts[0] ?? "",
                definition: parts[1] ?? "",
                pronunciation: parts[2] ?? "",
                note: parts[3] ?? "",
            };
        });

        setManualCardList(cards);
    }

    useEffect(() => {
        const deckName = selectedDirs[selectedDirs.length - 1];
        if(deckName.endsWith(deckEnd)){
            setTitle(removeEnd(deckName, deckEnd));
            setOldName(removeEnd(deckName, deckEnd));
            exportDeck();
            return;
        }

        setManualCardList(prev => {
            if (prev.length > 0) return prev;

            return Array.from({ length: 5 }, (_, i) => ({
                id: i,
                term: "",
                definition: "",
                pronunciation: "",
                note: "",
            }));
        });
    }, []);

    useEffect(() => {
        if (!exportedContent) return;
        convertToCard();
    }, [exportedContent, divider, endline]);

    const saveAndUpdateNewDeck = async () => {
        let subNewDeck: DeckCreator;
        let savedDirs = [...selectedDirs];
        const last = savedDirs.at(-1);
        if (last?.endsWith(deckEnd)) {
            savedDirs.pop();
        }

        if (isImport) {
            subNewDeck = new DeckCreator({
                name: title.trim() || "Untitled",
                oldname: oldName,
                dirs: savedDirs,
                devider: newDeck.devider || ";",
                endline: newDeck.endline || "\n",
                content: newDeck.content,
            });
        } else {
            let newContent = "";

            manualCardList.forEach((mc, index) => {
                newContent += `${mc.term};${mc.definition};${mc.pronunciation};${mc.note}`;
                if (index !== manualCardList.length - 1) {
                    newContent += "\n";
                }
            });

            subNewDeck = new DeckCreator({
                name: title.trim() || "Untitled",
                oldname:oldName,
                dirs: savedDirs,
                devider: ";",
                endline: "\n",
                content: newContent,
            });
        }

        await AddNewDeck(subNewDeck);
        setAction(false);
    };

    function addItem(n: number) {
        setManualCardList(prev => {
            const startId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 0;

            const newCards: ManualCard[] = Array.from({ length: n }, (_, i) => ({
                id: startId + i,
                term: "",
                definition: "",
                pronunciation: "",
                note: "",
            }));

            return [...prev, ...newCards];
        });
    }

    const swapTermDefinition = (id: number) => {
        setManualCardList(prev =>
            prev.map(card =>
                card.id === id
                    ? {
                        ...card,
                        term: card.definition,
                        definition: card.term,
                    }
                    : card
            )
        );
    };

    function deleteItem(id: number) {
        setManualCardList(prev => prev.filter(card => card.id !== id));
    }

    const updateManualCard = (
        id: number,
        field: keyof ManualCard,
        value: string
    ) => {
        setManualCardList(prev =>
            prev.map(Mcard =>
                Mcard.id === id
                    ? { ...Mcard, [field]: value }
                    : Mcard
            )
        );
    };

    return (
        <div className='flex flex-col gap-4 w-full max-w-4xl mx-auto'>

            {/* ===== Header Card ===== */}
            <Card className='p-4 flex flex-col gap-4
            bg-slate-900 text-indigo-100 border-indigo-400'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-semibold'>
                        Create Deck
                    </h2>

                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setIsImport(false)}
                            className={modeButton(isImport, false)}
                        >
                            Create by cards
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setIsImport(true)}
                            className={modeButton(isImport, true)}
                        >
                            Import text
                        </Button>
                        <Button
                            size='sm'
                            className='text-indigo-50 bg-emerald-600 text-sm font-bold'
                            onClick={()=>saveAndUpdateNewDeck()}
                        >
                            Save & Create
                        </Button>
                    </div>
                </div>

                <Input
                    placeholder='Deck title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className='border-violet-300'
                />
            </Card>

            {/* ===== Content Card ===== */}
            <Card className='p-4 flex flex-col gap-4 bg-slate-900 text-indigo-100 border-indigo-400'>
                {isImport && (<TextImport divider={divider} endline={endline} importText={importText}
                                          setDivider={setDivider} setEndline={setEndline} setImportText={setImportText}
                                          setNewDeck={setNewDeck}
                />)}

                {!isImport && (
                    <div className='flex flex-col gap-4'>
                        {manualCardList.map((card, idx) => (
                            <ManualCardItem
                                key={card.id}
                                index={idx}
                                card={card}
                                onDelete={deleteItem}
                                onChange={updateManualCard}
                                onSwap={swapTermDefinition}
                            />
                        ))}
                    </div>
                )}

                {/* Add cards bar */}
                {!isImport && (
                    <div className='flex items-center justify-center gap-4 mt-4'>
                        <button className='flex items-center gap-2 px-4 py-2 rounded-full
                    bg-indigo-700 text-indigo-50 font-bold text-base hover:bg-indigo-800 transition'
                                onClick={() => addItem(addCount)}
                        >
                            <span className='text-lg leading-none'>+</span>
                            Add card(s)
                        </button>

                        <input
                            type='number'
                            min={1}
                            value={addCount}
                            onChange={e => setAddCount(Number(e.target.value) || 1)}
                            placeholder='1'
                            className='w-16 px-3 py-2 rounded-full bg-zinc-800 text-sm text-center outline-none border border-zinc-700 focus:border-indigo-400'
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}

function TextImport({divider, endline, importText, setDivider, setEndline, setImportText, setNewDeck}:
                    {divider:string, endline:string, importText:string;
                    setDivider: React.Dispatch<React.SetStateAction<string>>;
                    setEndline: React.Dispatch<React.SetStateAction<string>>;
                    setImportText: React.Dispatch<React.SetStateAction<string>>;
                    setNewDeck: React.Dispatch<React.SetStateAction<DeckCreator>>;}
) {
    useEffect(() => {
        setNewDeck(prev =>
            new DeckCreator({
                ...prev,
                endline: endline,
                devider: divider,
                content: importText,
            })
        );
    }, [endline, divider, importText]);

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
        <>
            {/* Divider / Endline */}
            <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm whitespace-nowrap'>Divider</span>
                    <Input
                        className='h-8 border-violet-300'
                        value={valueToDisplay(divider)}
                        onChange={e => setDivider(displayToValue(e.target.value))}
                    />
                </div>

                <div className='flex items-center gap-2'>
                    <span className='text-sm whitespace-nowrap'>Endline</span>
                    <Input
                        className='h-8 border-violet-300'
                        value={valueToDisplay(endline)}
                        onChange={e => setEndline(displayToValue(e.target.value))}
                    />
                </div>
            </div>

            {/* Large Input */}
            <Textarea
                placeholder=' Divider used to split term, deffinition, pronounce and note, while endline to split each card (each line)
                Example:
                Term1;Deffinition1;Pronounce1;Note1
                Term2;Deffinition2;Pronounce2;Note2'
                className='min-h-[200px] border-violet-300'
                value={importText}
                onChange={e => setImportText(e.target.value)}
            />
        </>
    );
}

function ManualCardItem({ index, card, onDelete, onChange, onSwap }:
                        { index: number; card:ManualCard;
                        onDelete:(e:number) => void;
                        onSwap:(e:number) => void;
                        onChange: (id: number, field: keyof ManualCard, value: string) => void;}) {

    return (
        <div className='flex flex-col gap-4 border border-zinc-700 bg-stone-950/60 rounded-xl p-4'>

            {/* Top row */}
            <div className='flex items-center justify-between'>
                <span className='text-sm text-zinc-400'>#{index + 1}</span>

                <div className='flex items-center gap-2'>
                    <button className='p-1 rounded hover:bg-zinc-800'
                    onClick={()=> onSwap(card.id)}
                    >
                        <ArrowLeftRight size={16} />
                    </button>

                    <button className='p-1 rounded hover:bg-zinc-800 text-red-400'
                    onClick={()=> onDelete(card.id)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Term / Definition */}
            <div className='grid grid-cols-2 gap-4'>
                <input
                    value={card.term}
                    placeholder="Term"
                    onChange={e => onChange(card.id, "term", e.target.value)}
                    className='bg-zinc-900/60 border border-zinc-700 focus:border-indigo-400 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none'
                />

                <input
                    value={card.definition}
                    placeholder="Definition"
                    onChange={e => onChange(card.id, "definition", e.target.value)}
                    className='bg-zinc-900/60 border border-zinc-700 focus:border-indigo-400 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none'
                />
            </div>

            {/* Pronounce / Note */}
            <div className='grid grid-cols-2 gap-4'>
                <input
                    value={card.pronunciation}
                    placeholder="Pronunciation"
                    onChange={e => onChange(card.id, "pronunciation", e.target.value)}
                    className='bg-transparent border-b border-zinc-700 focus:border-indigo-400 outline-none py-1 text-xs text-zinc-300'
                />

                <input
                    value={card.note}
                    placeholder="Note"
                    onChange={e => onChange(card.id, "note", e.target.value)}
                    className='bg-transparent border-b border-zinc-700 focus:border-indigo-400 outline-none py-1 text-xs text-zinc-300'
                />
            </div>
        </div>
    );
}

function modeButton(mode:boolean, isRight:boolean){
    return `bg-transparent text-indigo-100 text-sm border-none
    rounded-none hover:bg-indigo-200 hover:text-slate-950
    ${isRight ? "hover:rounded-r-[10px]" : "hover:rounded-l-[10px]"}
    ${mode && isRight ? "rounded-r-[10px] text-slate-950 bg-indigo-200" :
        null}
    ${!(mode || isRight)? "rounded-l-[10px] text-slate-950 bg-indigo-200" : null}`
}