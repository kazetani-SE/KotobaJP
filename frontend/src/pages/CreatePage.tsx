import {useEffect, useState} from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {SaveFolder, LoadFolder} from "../../wailsjs/go/controller/FolderHandler";
import {FLoader} from "@/pages/MainPage";
import {object as BEObj} from "../../wailsjs/go/models";
import Metadata = BEObj.Metadata;
import Data = BEObj.Data;
import FolderCreator = BEObj.FolderCreator;
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import CreateDeck from "@/pages/CreateDeck";
import {AddNewFolder, DeleteItem} from "../../wailsjs/go/service/Service";
import {Input} from "@/components/ui/input";

type FolderStore = {
    [folderName: string]: Metadata;
};

const deckEnd:string = "DECK$$";
const folderEnd:string = "FOLDER&&";

function removeEnd(name: string, deckEnd: string) {
    return name.endsWith(deckEnd)
        ? name.slice(0, -deckEnd.length)
        : name;
}

export default function CreatePage() {
    const [selectedDirs, setSelectedDirs] = useState<string[]>([]);
    const [action, setAction] = useState<boolean>(false);
    const [key, setKey] = useState<number>(0); // used to reset page

    const chosenAction = () => {
        return action ? <CreateDeck setAction={setAction} selectedDirs={selectedDirs}/> :
            <ChoosingPage key={key} setAction={setAction} selectedDirs={selectedDirs} setSelectedDirs={setSelectedDirs} setKey={setKey}/>;
    }

    return chosenAction();
}

function ChoosingPage({setAction, selectedDirs, setSelectedDirs, setKey}:
                      { selectedDirs: string[];
                      setAction:(v:boolean)=>void;
                      setSelectedDirs:React.Dispatch<React.SetStateAction<string[]>>;
                      setKey: React.Dispatch<React.SetStateAction<number>>;
                      }){
    const [dirs, setDirs] = useState<string[]>([]);
    const [folderList, setFolderList] = useState<FolderStore>({});
    const [rootMetadata, setRootMetadata] = useState<Metadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [openFCreator, setOpenFCreator] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isRename, setIsRename] = useState<boolean>(false);

    useEffect(() => {
        const loadRoot = async () => {
            try {
                const fLoader: FLoader = {
                    name: "",
                    dirs: [],
                };

                const rootMD = await LoadFolder(fLoader);
                setRootMetadata(rootMD);
            } catch (err) {
                console.error("Load root folder failed:", err);
            } finally {
                setLoading(false);
            }
        };

        const handleDelete = async () => {
            const subDirs: string[] = [...selectedDirs];
            const lastIndex = subDirs.length - 1;
            let last = subDirs[lastIndex];

            last = removeEnd(last, deckEnd);
            last = removeEnd(last, folderEnd);

            if (selectedDirs[lastIndex].endsWith(deckEnd)) {
                last += ".json";
            }

            subDirs[lastIndex] = last;

            await deleteItem(subDirs);
            setKey(prev => prev + 1);
        };

        if(!isDeleted) {
            loadRoot();
        }
        else{
            handleDelete();
        }
    }, [isDeleted]);

    const deleteItem = async (dirs:string[]) =>{
        await DeleteItem(dirs);
    }

    if (loading) {
        return (
            <Card className="w-[360px] p-3 bg-slate-900 text-indigo-100">
                Loading...
            </Card>
        );
    }

    if (!rootMetadata) {
        return (
            <Card className="w-[360px] p-3 bg-slate-900 text-red-400">
                Failed to load root folder
            </Card>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <Card className="w-[360px] p-3 bg-slate-900 text-indigo-100 border-indigo-400">
                <Parent
                    metadata={rootMetadata}
                    dirs={dirs}
                    setDirs={setSelectedDirs}
                    folderList={folderList}
                    setFolderList={setFolderList}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                />
            </Card>
            <FunctionButton selectedItem={selectedItem} setOpenFCreator={setOpenFCreator}
                            setAction={setAction} setIsDeleted={setIsDeleted} setRename={setIsRename}
            />
            <CreateNewFolder open={openFCreator} setOpen={setOpenFCreator} selectedDirs={selectedDirs}
                             curName={selectedDirs.at(-1) ?? ""} rename={isRename} setKey={setKey}
            />
        </div>
    );
}

function Parent({ metadata, dirs, setDirs, folderList, setFolderList,
                    selectedItem, setSelectedItem }:
                { metadata: Metadata; dirs:string[]; folderList:FolderStore;
                setDirs: React.Dispatch<React.SetStateAction<string[]>>;
                setFolderList:  React.Dispatch<React.SetStateAction<FolderStore>>;
                selectedItem: string|null;
                setSelectedItem:  React.Dispatch<React.SetStateAction<string | null>>;}) {
    const [open, setOpen] = useState(false);
    const pDirs = [...dirs, metadata.name];

    const loadFolder = async (child :Data) =>{
        if (child.proficiency !== 0) return;

        if (folderList[child.name]) return; // do not load again

        const fLoader: FLoader = {
            name: "",
            dirs: [...pDirs, child.name],
        };

        const childMD = await LoadFolder(fLoader);

        setFolderList(prev => ({
            ...prev,
            [child.name]: childMD,
        }));
    }

    const onToggle = async () => {
        setOpen(o => !o);
        setSelectedItem("")

        if (!open) {
            for (const c of metadata.children) {
                if (c.proficiency === 0) {
                    await loadFolder(c);
                }
            }
        }
    };

    return (
        <>
            <div
                className={`flex items-center gap-2 cursor-pointer
                ${selectedItem === metadata.name + folderEnd ? "rounded-md bg-zinc-800" :""}`}
                onClick={() => {
                    setDirs(pDirs);
                    setSelectedItem(metadata.name + folderEnd);
                }}
            >
                {open ? <ChevronDown size={16} onClick={() => onToggle()}/> :
                    <ChevronRight size={16} onClick={() => onToggle()}/>}
                <Folder size={16} className="text-blue-400"/>
                <span>{metadata.name === "" ? "Data" : metadata.name}</span>
            </div>

            {open && (
                <div className="ml-6 mt-2 space-y-2">
                    {metadata.children.map(child => {
                        const childMeta = folderList[child.name];

                        if (childMeta) {
                            return (
                                <Parent
                                    key={child.name}
                                    metadata={childMeta}
                                    dirs={pDirs}
                                    folderList={folderList}
                                    setFolderList={setFolderList}
                                    setDirs={setDirs}
                                    selectedItem={selectedItem}
                                    setSelectedItem={setSelectedItem}
                                />
                            );
                        }

                        return (
                            <Children
                                key={child.name}
                                data={child}
                                dirs={pDirs}
                                setDirs={setDirs}
                                selectedItem={selectedItem}
                                setSelectedItem={setSelectedItem}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
}

function Children({ data, dirs, setDirs, selectedItem, setSelectedItem }:
                  { data: Data; dirs:string[];
                  setDirs: React.Dispatch<React.SetStateAction<string[]>>;
                  selectedItem: string|null;
                  setSelectedItem:  React.Dispatch<React.SetStateAction<string | null>>;}) {
    return (
        <div className={`flex flex-col gap-1 rounded-md px-2 py-1 hover:bg-zinc-800
        ${selectedItem === data.name + deckEnd ? "bg-zinc-800" : ""}`}
            onClick={() => {
                setDirs([...dirs, data.name + deckEnd]);
                setSelectedItem(data.name + deckEnd);
            }}
        >
            <div className="flex items-center gap-2">
                <FileText size={14} className="text-emerald-400" />
                <span className="font-mono text-sm">{data.name}</span>
                <span className="ml-auto text-xs text-zinc-400">
          {data.numOfChildren} items
        </span>
            </div>

            <Progress
                value={data.proficiency}
                className="h-1 bg-zinc-700"
            />
        </div>
    );
}

function FunctionButton({selectedItem, setOpenFCreator, setAction, setIsDeleted, setRename}:
                        {selectedItem:string|null;
                        setOpenFCreator:(v:boolean) => void;
                        setAction:(v:boolean) => void;
                        setIsDeleted:(v:boolean) => void;
                        setRename:(v:boolean) => void;}) {
    const [openDelete, setOpenDelete] = useState(false);
    if (!selectedItem) return null;

    return (
        <>
            <div className='flex flex-row justify-end items-end gap-8 mt-[2vh]'>
                {selectedItem.endsWith(deckEnd) ?
                    <>
                        <Button className='bg-emerald-700 rounded-[2vh] border-[1.4px]
                    border-green-600 hover:bg-emerald-900'
                                onClick={() => setAction(true)}
                        >
                            Update
                        </Button>
                        <Button className='bg-red-700 rounded-[2vh] border-[1.4px]
                    border-red-500 hover:bg-red-900'
                                onClick={() => setOpenDelete(true)}
                        >
                            Delete
                        </Button>
                    </>
                    :
                    selectedItem.endsWith(folderEnd) ?
                        <>
                            <Button className='bg-sky-700 rounded-[2vh] border-[1.4px]
                    border-sky-600 hover:bg-sky-900'
                                    onClick={() => setAction(true)}>
                                New Deck
                            </Button>
                            <Button className='bg-teal-700 rounded-[2vh] border-[1.4px]
                    border-teal-600 hover:bg-teal-900'
                                    onClick={() => {
                                        setOpenFCreator(true);
                                        setRename(false);
                                    }}>
                                New Folder
                            </Button>
                            {selectedItem !== folderEnd ?
                            <>
                                <Button className='bg-amber-700 rounded-[2vh] border-[1.4px]
                    border-amber-600 hover:bg-amber-900'
                                        onClick={() => {
                                            setOpenFCreator(true);
                                            setRename(true);
                                        }}
                                >
                                    Rename
                                </Button>
                                <Button className='bg-red-700 rounded-[2vh] border-[1.4px]
                    border-red-500 hover:bg-red-900'
                                        onClick={() => setOpenDelete(true)}
                                >
                                    Delete
                                </Button>
                            </>
                                : null
                            }
                        </>
                        :
                        null}
            </div>

            {/* Alert Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className='bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-[2.6vh] font-bold text-red-400'>
                            Confirm Delete
                        </AlertDialogTitle>

                        <AlertDialogDescription className='text-indigo-400 text-[2vh]'>
                            You are about to permanently delete:
                            <br />
                            <span className='font-semibold text-red-300 break-all'>
                                {removeEnd(removeEnd(selectedItem, deckEnd), folderEnd)}
                            </span>
                            <br /><br />
                            <span className='text-red-400 font-semibold'>
                                This action is permanent and cannot be undone.
                            </span>
                            <br />
                            All related files and folders will be permanently removed and cannot be recovered.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        {/* Cancel */}
                        <AlertDialogCancel
                            onClick={() => setOpenDelete(false)}
                            className='px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors border-none'
                        >
                            Cancel
                        </AlertDialogCancel>

                        {/* Confirm delete */}
                        <AlertDialogAction
                            onClick={() => {
                                setIsDeleted(true);
                                setOpenDelete(false);
                            }}
                            className='px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors'
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function CreateNewFolder({open,selectedDirs, curName, setOpen, rename, setKey }:
                         {open:boolean; selectedDirs:string[]; curName:string; rename:boolean;
                         setOpen:(v:boolean) => void; setKey: React.Dispatch<React.SetStateAction<number>>;}){
    const [newName, setNewName] = useState(curName);
    useEffect(() => {
        if (open) {
            setNewName(curName);
        }
        if(!rename){
            setNewName('');
        }
    }, [curName, open]);

    const saveFolder = async () => {
        const newFolder = FolderCreator.createFrom({
            name: newName,
            oldname: rename ? curName : "",
            dirs: rename ? selectedDirs.slice(0, -1) : selectedDirs,
            metadata: Metadata.createFrom({
                name: newName,
                children: [],
            })
        })

        await AddNewFolder(newFolder);
    }

    function action(){
        saveFolder();
        setOpen(false);
        setKey(prev => prev + 1);
    }

    return(
        <AlertDialog open={open}>
            <AlertDialogContent className='bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6 w-[520px]'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-xl font-semibold mb-4'>
                        New Folder
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <div className='mb-6'>
                    <Input
                        type='text'
                        placeholder='Untitled folder'
                        className='w-full px-5 py-3 rounded-full bg-transparent border outline-none text-sm'
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>

                <AlertDialogFooter className='flex justify-end gap-4'>
                    <AlertDialogCancel className='bg-transparent border-none px-2 text-lg text-indigo-50 font-bold
                    hover:underline hover:text-rose-400 hover:bg-transparent'
                    onClick={() => setOpen(false)}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction className='px-6 py-2 rounded-full text-lg font-medium text-indigo-50
                    border-[1.4px] border-transparent hover:border-indigo-300
                    bg-indigo-900 hover:bg-indigo-700'
                    onClick={() => action()}
                    >
                        {rename ? "Rename" : "Create"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}