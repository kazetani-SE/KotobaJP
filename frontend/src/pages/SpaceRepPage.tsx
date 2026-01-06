import {Button} from "@/components/ui/button";

import {ArrowBigLeft} from "lucide-react";

export function SpaceRepPage({setFunc}:{
    setFunc: React.Dispatch<React.SetStateAction<number>> }
){
    return (
        <div className="flex flex-col gap-0 justify-start items-center mt-[-5vh]">
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
            <h1 className="text-indigo-50 text-lg italic">
                This feature is not ready yet. Please try another one.
            </h1>
        </div>
    );
}