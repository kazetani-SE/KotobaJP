// import {Button} from "@/components/ui/button";
//
// import {ArrowBigLeft} from "lucide-react";
//
// import {CreateTest, TestCheck} from "../../wailsjs/go/ganeandfunc/TestHandler";
// import {useEffect, useState} from "react";
//
// import {object as BEObj} from "../../wailsjs/go/models"
// import QuestionCreator = BEObj.QuestionCreator;
// import MultipleChoice = BEObj.MultipleChoice;
// import TestCreator = BEObj.TestCreator;
// import TestCreaterResult = BEObj.TestCreateResult;
// import UICard = BEObj.Card
// import {Card, CardContent, CardHeader} from "@/components/ui/card";
// import {Input} from "@/components/ui/input";
// import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
// import {Label} from "@/components/ui/label";
// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
// import {Switch} from "@/components/ui/switch";
// import {NumberTpTInput} from "@/pages/LearningPage";
//
// export function PTPage({setFunc, cards}:{
//     cards: UICard[];
//     setFunc: React.Dispatch<React.SetStateAction<number>> }
// ){
//     const [choosing, setChoosing] = useState<boolean>(true);
//
//     const [num, setNum] = useState<number>(10);
//     const [answerWithTerm, setAnswerWithTerm] = useState<boolean>(true);
//     const [answerWithDefinition, setAnswerWithDefinition] = useState<boolean>(true);
//     const [answerWithPron, setAnswerWithPron] = useState<boolean>(false);
//
//     const [hasMC, setHasMC] = useState<boolean>(true);
//     const [hasEssay, setHasEssay] = useState<boolean>(true);
//
//
//     // @ts-ignore
//     const [testCreator, setTestCreator] = useState<TestCreator>({
//         quizeachpart: num,
//         cards: cards,
//         format: [hasEssay, hasMC, answerWithPron], // essay, mc, pron
//         type: [answerWithTerm, answerWithDefinition]          // term, def
//     });
//
//     useEffect(() => {
//         // @ts-ignore
//         const temTC: TestCreator = {
//             quizeachpart: num,
//             cards: cards,
//             format: [hasEssay, hasMC, answerWithPron],
//             type: [answerWithTerm, answerWithDefinition]
//         };
//
//         setTestCreator(temTC);
//     }, [choosing]);
//
//     return (
//         <div  className="flex flex-col gap-0 justify-start items-center mt-[-5vh]">
//             <div className="flex flex-row w-[70vw] items-center justify-between mb-[3vh]">
//                 <Button
//                     className="w-[6vh] h-[6vh]
//                     bg-slate-900 text-indigo-300 font-bold
//                     border-[2px] border-indigo-600 rounded-full"
//                     onClick={() => setFunc(0)}
//                 >
//                     <ArrowBigLeft className="w-7 h-7" />
//                 </Button>
//
//                 <h1 className="font-bold text-indigo-100 text-[6vh]">Practice test</h1>
//
//                 <Button
//                     className="px-4 py-4 rounded-xl bg-transparent border border-indigo-600
//                     text-[2.5vh] text-indigo-50 font-semibold hover:border-indigo-400
//                     hover:bg-indigo-950 hover:text-indigo-50"
//                     onClick={() => setChoosing(!choosing)}
//                 >
//                     Test option
//                 </Button>
//             </div>
//             <div className='flex flex-row gap-[2vw] justify-between items-start w-[90vw]'>
//                 <QuestionListPreview/>
//
//                 <div className='max-h-[80vh] overflow-y-auto w-[75vw] hide-scrollbar'>
//                     <TestPart testCreator={testCreator} hasMC={hasMC} hasEssay={hasEssay}/>
//                 </div>
//             </div>
//             <SettingOption choosing={choosing} num={num} answerWithTerm={answerWithTerm} answerWithDefinition={answerWithDefinition} answerWithPron={answerWithPron} hasMC={hasMC} hasEssay={hasEssay} setChoosing={setChoosing} setNum={setNum} setAnswerWithTerm={setAnswerWithTerm} setAnswerWithDefinition={setAnswerWithDefinition} setAnswerWithPron={setAnswerWithPron} setHasMC={setHasMC} setHasEssay={setHasEssay}/>
//         </div>
//     );
// }
//
// function SettingOption({
//                            choosing, num, answerWithTerm, answerWithDefinition, answerWithPron,
//                            hasMC, hasEssay,
//                            setChoosing, setNum, setAnswerWithTerm, setAnswerWithDefinition,
//                            setAnswerWithPron, setHasMC, setHasEssay
//                        }: {
//     choosing: boolean; num: number;
//     answerWithTerm: boolean; answerWithDefinition: boolean; answerWithPron: boolean;
//     hasMC: boolean; hasEssay: boolean;
//     setChoosing: (v: boolean) => void; setNum: (v: number) => void;
//     setAnswerWithTerm: (v: boolean) => void; setAnswerWithDefinition: (v: boolean) => void;
//     setAnswerWithPron: (v: boolean) => void; setHasMC: (v: boolean) => void; setHasEssay: (v: boolean) => void;
// }) {
//
//     const [tempNum, setTempNum] = useState<number>(num);
//     const [tempTerm, setTempTerm] = useState<boolean>(answerWithTerm);
//     const [tempDef, setTempDef] = useState<boolean>(answerWithDefinition);
//     const [tempPron, setTempPron] = useState<boolean>(answerWithPron);
//     const [tempMC, setTempMC] = useState<boolean>(hasMC);
//     const [tempEssay, setTempEssay] = useState<boolean>(hasEssay);
//
//     useEffect(() => {
//         if (choosing) {
//             setTempNum(num);
//             setTempTerm(answerWithTerm);
//             setTempDef(answerWithDefinition);
//             setTempPron(answerWithPron);
//             setTempMC(hasMC);
//             setTempEssay(hasEssay);
//         }
//     }, [choosing]);
//
//     const handleReset = () => {
//         setTempNum(num);
//         setTempTerm(answerWithTerm);
//         setTempDef(answerWithDefinition);
//         setTempPron(answerWithPron);
//         setTempMC(hasMC);
//         setTempEssay(hasEssay);
//     };
//
//     const handleApply = () => {
//         setNum(tempNum);
//         setAnswerWithTerm(tempTerm);
//         setAnswerWithDefinition(tempDef);
//         setAnswerWithPron(tempPron);
//         setHasMC(tempMC);
//         setHasEssay(tempEssay);
//         setChoosing(false);
//     };
//
//     return (
//         <Dialog open={choosing} onOpenChange={setChoosing}>
//             <DialogContent
//                 className="bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6 w-[55vw] max-w-[600px]"
//             >
//                 <DialogHeader>
//                     <DialogTitle className="text-[2.6vh] font-bold text-indigo-200">
//                         Learn Options
//                     </DialogTitle>
//                     <DialogDescription className="text-indigo-400 text-[2vh]">
//                         You can adjust the learning options to your preference.
//                     </DialogDescription>
//                 </DialogHeader>
//
//                 <div className="flex flex-col gap-6 mt-4 text-[2.2vh] font-semibold">
//
//                     {/* Number */}
//                     <div className="flex flex-row items-center justify-between">
//                         <h3 className="text-indigo-300">Number of questions per term</h3>
//                         <NumberTpTInput value={tempNum} setValue={setTempNum} />
//                     </div>
//
//                     {/* Answer with term */}
//                     <div className="flex flex-row items-center justify-between">
//                         <h3 className="text-indigo-300">Answer with term</h3>
//                         <Switch
//                             checked={tempTerm}
//                             onCheckedChange={(checked) => {
//                                 if (!checked) setTempDef(true);
//                                 setTempTerm(checked);
//                             }}
//                             className="data-[state=checked]:bg-indigo-500"
//                         />
//                     </div>
//
//                     {/* Answer with definition */}
//                     <div className="flex flex-row items-center justify-between">
//                         <h3 className="text-indigo-300">Answer with definition</h3>
//                         <Switch
//                             checked={tempDef}
//                             onCheckedChange={(checked) => {
//                                 if (!checked) setTempTerm(true);
//                                 setTempDef(checked);
//                             }}
//                             className="data-[state=checked]:bg-indigo-500"
//                         />
//                     </div>
//
//                     {/* Answer with pronunciation */}
//                     <div className="flex flex-row items-center justify-between">
//                         <h3 className="text-indigo-300">Answer with pronunciation</h3>
//                         <Switch
//                             checked={tempPron}
//                             onCheckedChange={setTempPron}
//                             className="data-[state=checked]:bg-indigo-500"
//                         />
//                     </div>
//
//                     {/* Has MC */}
//                     <div className="flex flex-row items-center justify-between">
//                         <h3 className="text-indigo-300">Multiple choice mode</h3>
//                         <Switch
//                             checked={tempMC}
//                             onCheckedChange={(checked) => {
//                                 if (!checked) setTempEssay(true);
//                                 setTempMC(checked);
//                             }}
//                             className="data-[state=checked]:bg-indigo-500"
//                         />
//                     </div>
//
//                     {/* Has Essay */}
//                     <div className="flex flex-row items-center justify-between">
//                         <h3 className="text-indigo-300">Essay mode</h3>
//                         <Switch
//                             checked={tempEssay}
//                             onCheckedChange={(checked) => {
//                                 if (!checked) setTempMC(true);
//                                 setTempEssay(checked);
//                             }}
//                             className="data-[state=checked]:bg-indigo-500"
//                         />
//                     </div>
//                 </div>
//
//                 {/* Buttons */}
//                 <div className="flex justify-end gap-4 mt-6">
//                     <button
//                         onClick={handleReset}
//                         className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
//                     >
//                         Reset
//                     </button>
//
//                     <button
//                         onClick={handleApply}
//                         className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
//                     >
//                         Apply
//                     </button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
//
// function TestPart({testCreator, hasMC, hasEssay,}:{testCreator:TestCreator; hasMC: boolean; hasEssay: boolean;}) {
//     const [mc, setMC] = useState<MultipleChoice[]>([]);
//     const [essay, setEssay]= useState<QuestionCreator[]>([]);
//
//     const loadMCTest = async () => {
//         const getTest = await CreateTest(testCreator);
//         setMC(getTest.mc);
//         setEssay(getTest.essay)
//     }
//
//     useEffect(() => {
//         loadMCTest();
//     }, [testCreator]);
//
//     return (
//         <div>
//             <Card className='flex flex-col gap-[5vh] justify-start items-start w-full mt-[2vh]
// border-indigo-500 bg-transparent text-indigo-100 mb-2'>
//
//                 <CardHeader className='w-full flex flex-row justify-center items-center'>
//                     <h1 className='font-bold text-[4.3vh]'>
//                         TEST
//                     </h1>
//                 </CardHeader>
//
//                 <CardContent className='flex flex-col justify-start items-start mt-[-3vh]'>
//                     <MultipleChoicePart mc={mc} hasMC={hasMC}/>
//                     <EssayPart essay={essay} hasEssay={hasEssay}/>
//                 </CardContent>
//             </Card>
//
//         </div>
//     );
// }
//
// function  MultipleChoicePart({mc, hasMC}:{mc:MultipleChoice[]; hasMC:boolean})    {
//     if(!hasMC) return null;
//     return(
//         <div className='flex flex-col gap-[2vh] justify-start items-start text-lg'>
//            <div className='flex flex-col justify-start items-start'>
//                <h1 className='font-bold text-[3.8vh]'>
//                    Multiple choice
//                </h1>
//                <h3>
//                    Choose the best answer for the questions
//                </h3>
//            </div>
//             {mc.map((value, idx) =>(
//                 <MCQuest value={value} idx={idx + 1}/>
//             ))}
//         </div>
//     );
// }
//
// function MCQuest({value, idx}:{value:MultipleChoice, idx:number}) {
//     const shuffled = [...value.answers];
//     shuffled.sort(() => Math.random() - 0.5);
//
//     return (
//         <div className="flex flex-col justify-start items-start w-full mt-[2vh]">
//             <h1>Question {idx}: {value.questions}</h1>
//
//             <RadioGroup defaultValue={""}>
//                 <div className="flex items-center gap-3">
//                     <RadioGroupItem value={shuffled[0]} id="r1" />
//                     <Label className='text-lg' htmlFor="r1">{shuffled[0]}</Label>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <RadioGroupItem value={shuffled[1]} id="r2" />
//                     <Label className='text-lg' htmlFor="r2">{shuffled[1]}</Label>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <RadioGroupItem value={shuffled[2]} id="r3" />
//                     <Label className='text-lg' htmlFor="r3">{shuffled[2]}</Label>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <RadioGroupItem value={shuffled[3]} id="r3" />
//                     <Label className='text-lg' htmlFor="r3">{shuffled[3]}</Label>
//                 </div>
//             </RadioGroup>
//         </div>
//     );
// }
//
// function EssayPart({essay, hasEssay}:{essay:QuestionCreator[]; hasEssay:boolean}) {
//     if(!hasEssay) return null;
//     return(
//       <div className="flex flex-col justify-start items-start w-full mt-[4vh] text-lg">
//           <div className='flex flex-col justify-start items-start'>
//               <h1 className='font-bold text-[3.5vh]'>
//                   Essay
//               </h1>
//               <h3>
//                   File in the blank term or definition of vocab
//               </h3>
//           </div>
//
//           {essay.map((value, idx) =>(
//               <EssayQuest value={value} idx={idx + 1}/>
//           ))}
//       </div>
//     );
// }
//
// function EssayQuest({value, idx}:{value:QuestionCreator; idx:number}) {
//     return(
//         <div className="flex flex-col justify-start items-start w-full mb-1">
//             <div className="flex flex-col gap-[1vh] justify-start items-start w-full mt-[2vh]">
//                 <h1>Question {idx}: {value.quizz}</h1>
//                 <Input className='border-indigo-300 rounded-xl !text-base'/>
//             </div>
//         </div>
//     );
// }
//
// function QuestionListPreview() {
//     return (
//         <Card
//             className='flex flex-col flex-wrap justify-start items-start w-[23vw] mt-[2vh]
//             border-indigo-500 bg-transparent text-indigo-100 rounded-3xl p-4'
//         >
//             <CardHeader className='font-bold text-2xl mb-4'>
//                 Questions
//             </CardHeader>
//
//             <CardContent className="flex flex-row flex-wrap gap-3">
//
//             </CardContent>
//         </Card>
//     );
// }

import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import {CreateTest, TestCheck, GetDefaultTestResult} from "../../wailsjs/go/pecontroller/TestHandler";
import {createRef, useEffect, useRef, useState} from "react";

import { object as BEObj } from "../../wailsjs/go/models";
import QuestionCreator = BEObj.QuestionCreator;
import MultipleChoice = BEObj.MultipleChoice;
import TestCreator = BEObj.TestCreator;
import TestCreateResult = BEObj.TestCreateResult;
import Answer = BEObj.Answer;
import TestResultobj = BEObj.TestResult;
import TrueAnswer = BEObj.TrueAnswer;
import UICard = BEObj.Card;

import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { NumberTpTInput } from "@/pages/LearningPage";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React from "react";

export type QuestionState = {
    ref: React.RefObject<HTMLDivElement>;
    filled: boolean;
    answer: Answer;
};

export function PTPage({
                           setFunc,
                           cards,
                       }: {
    cards: UICard[];
    setFunc: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [choosing, setChoosing] = useState<boolean>(true);

    const [num, setNum] = useState<number>(10);
    const [answerWithTerm, setAnswerWithTerm] = useState<boolean>(true);
    const [answerWithDefinition, setAnswerWithDefinition] = useState<boolean>(true);
    const [answerWithPron, setAnswerWithPron] = useState<boolean>(false);
    const [hasMC, setHasMC] = useState<boolean>(true);
    const [hasEssay, setHasEssay] = useState<boolean>(true);

    const [submit, setSubmit] = useState<boolean>(false);
    const [mcQuestState, setMcQuestState] = useState<QuestionState[]>([]);
    const [esQuestState, setEsQuestState] = useState<QuestionState[]>([]);

    // const [mcAnswers, setMcAnswers] = useState<Answer[]>([]);
    // const [esAnswers, setEsAnswers] = useState<Answer[]>([]);
    const [mcResult, setMcResult] = useState<TestResultobj>();
    const [esResult, setEsResult] = useState<TestResultobj>();

    useEffect(() => {
        const load = async () => {
            const def = await GetDefaultTestResult();
            setMcResult(def);
            setEsResult(def);
        };
        load();
    }, []);

    useEffect(() => {
        if (!submit) return;   // chỉ chạy khi submit = true

        const run = async () => {
            // Copy answer từ mcQuest
            const mcAns = mcQuestState.map(q => q.answer);

            // Copy answer từ essay
            const esAns = esQuestState.map(q => q.answer);

            const SubMcResult = await TestCheck(mcAns, "m");
            const SubEsResult = await TestCheck(esAns, "e");

            setMcResult(SubMcResult);
            setEsResult(SubEsResult);
        };

        run();
    }, [submit]);

    return (
        <div className="flex flex-col gap-0 justify-start items-center mt-[-5vh]">
            <div className="flex flex-row w-[70vw] items-center justify-between mb-[3vh]">
                <Button
                    className="w-[6vh] h-[6vh] bg-slate-900 text-indigo-300 font-bold border-[2px] border-indigo-600 rounded-full"
                    onClick={() => setFunc(0)}
                >
                    <ArrowBigLeft className="w-7 h-7" />
                </Button>

                <h1 className="font-bold text-indigo-100 text-[6vh]">Practice test</h1>

                <Button
                    className="px-4 py-4 rounded-xl bg-transparent border border-indigo-600 text-[2.5vh] text-indigo-50 font-semibold hover:border-indigo-400 hover:bg-indigo-950 hover:text-indigo-50"
                    onClick={() => setChoosing(!choosing)}
                >
                    Test option
                </Button>
            </div>

            <div className="flex flex-row gap-[2vw] justify-between items-start w-[90vw]">
                <div className='max-h-[80vh] overflow-y-auto hide-scrollbar'>
                    <QuestionListPreview esQuesState={esQuestState} msQuesState={mcQuestState}/>
                </div>

                {/* Pass all needed values directly instead of using a fragile object */}
                <div className="max-h-[80vh] overflow-y-auto w-[65vw] hide-scrollbar">
                    {/*{//@ts-ignore}*/}
                    {submit?(
                        <TestResult
                            score={((mcResult?.score ?? 0) + (esResult?.score ?? 0)) * 10 / 2}
                            esResult={esResult?.correctanswers ?? []}
                            mcResult={mcResult?.correctanswers ?? []}
                            setSubmit={setSubmit}
                        />
                    ):(
                        <TestPart
                            num={num}
                            cards={cards}
                            answerWithTerm={answerWithTerm}
                            answerWithDefinition={answerWithDefinition}
                            answerWithPron={answerWithPron}
                            hasMC={hasMC}
                            hasEssay={hasEssay}
                            setSubmit={setSubmit}
                            setEsQuestState={setEsQuestState}
                            setMcQuestState={setMcQuestState}
                        />
                    )}
                </div>
            </div>

            {/* Setting Dialog */}
            <SettingOption
                choosing={choosing}
                num={num}
                answerWithTerm={answerWithTerm}
                answerWithDefinition={answerWithDefinition}
                answerWithPron={answerWithPron}
                hasMC={hasMC}
                hasEssay={hasEssay}
                setChoosing={setChoosing}
                setNum={setNum}
                setAnswerWithTerm={setAnswerWithTerm}
                setAnswerWithDefinition={setAnswerWithDefinition}
                setAnswerWithPron={setAnswerWithPron}
                setHasMC={setHasMC}
                setHasEssay={setHasEssay}
                setSubmit={setSubmit}
            />
        </div>
    );
}

/* ==================== SETTING DIALOG (unchanged logic, safe) ==================== */
function SettingOption({
                           choosing,
                           num,
                           answerWithTerm,
                           answerWithDefinition,
                           answerWithPron,
                           hasMC,
                           hasEssay,
                           setChoosing,
                           setNum,
                           setAnswerWithTerm,
                           setAnswerWithDefinition,
                           setAnswerWithPron,
                           setHasMC,
                           setHasEssay,
                           setSubmit,
                       }: {
    choosing: boolean;
    num: number;
    answerWithTerm: boolean;
    answerWithDefinition: boolean;
    answerWithPron: boolean;
    hasMC: boolean;
    hasEssay: boolean;
    setChoosing: (v: boolean) => void;
    setNum: (v: number) => void;
    setAnswerWithTerm: (v: boolean) => void;
    setAnswerWithDefinition: (v: boolean) => void;
    setAnswerWithPron: (v: boolean) => void;
    setHasMC: (v: boolean) => void;
    setHasEssay: (v: boolean) => void;
    setSubmit: (v: boolean) => void;
}) {
    const [tempNum, setTempNum] = useState<number>(num);
    const [tempTerm, setTempTerm] = useState<boolean>(answerWithTerm);
    const [tempDef, setTempDef] = useState<boolean>(answerWithDefinition);
    const [tempPron, setTempPron] = useState<boolean>(answerWithPron);
    const [tempMC, setTempMC] = useState<boolean>(hasMC);
    const [tempEssay, setTempEssay] = useState<boolean>(hasEssay);

    useEffect(() => {
        if (choosing) {
            setTempNum(num);
            setTempTerm(answerWithTerm);
            setTempDef(answerWithDefinition);
            setTempPron(answerWithPron);
            setTempMC(hasMC);
            setTempEssay(hasEssay);
        }
    }, [choosing, num, answerWithTerm, answerWithDefinition, answerWithPron, hasMC, hasEssay]);

    const handleReset = () => {
        setTempNum(num);
        setTempTerm(answerWithTerm);
        setTempDef(answerWithDefinition);
        setTempPron(answerWithPron);
        setTempMC(hasMC);
        setTempEssay(hasEssay);
    };

    const handleApply = () => {
        setSubmit(false);
        setNum(tempNum);
        setAnswerWithTerm(tempTerm);
        setAnswerWithDefinition(tempDef);
        setAnswerWithPron(tempPron);
        setHasMC(tempMC);
        setHasEssay(tempEssay);
        setChoosing(false);
    };

    return (
        <Dialog open={choosing} onOpenChange={setChoosing}>
            <DialogContent className="bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6 w-[55vw] max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-[2.6vh] font-bold text-indigo-200">
                        Learn Options
                    </DialogTitle>
                    <DialogDescription className="text-indigo-400 text-[2vh]">
                        You can adjust the learning options to your preference.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 mt-4 text-[2.2vh] font-semibold">
                    {/* Number */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Number of questions per term</h3>
                        <NumberTpTInput value={tempNum} setValue={setTempNum} />
                    </div>

                    {/* Answer with term */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Answer with term</h3>
                        <Switch
                            checked={tempTerm}
                            onCheckedChange={(checked) => {
                                setTempTerm(checked);
                                if (!checked && !tempDef) setTempDef(true);
                            }}
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>

                    {/* Answer with definition */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Answer with definition</h3>
                        <Switch
                            checked={tempDef}
                            onCheckedChange={(checked) => {
                                setTempDef(checked);
                                if (!checked && !tempTerm) setTempTerm(true);
                            }}
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>

                    {/* Pronunciation */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Answer with pronunciation (just act with kanji)</h3>
                        <Switch
                            checked={tempPron}
                            onCheckedChange={setTempPron}
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>

                    {/* Multiple Choice */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Multiple choice mode</h3>
                        <Switch
                            checked={tempMC}
                            onCheckedChange={(checked) => {
                                setTempMC(checked);
                                if (!checked && !tempEssay) setTempEssay(true);
                            }}
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>

                    {/* Essay */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Essay mode</h3>
                        <Switch
                            checked={tempEssay}
                            onCheckedChange={(checked) => {
                                setTempEssay(checked);
                                if (!checked && !tempMC) setTempMC(true);
                            }}
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>
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
            </DialogContent>
        </Dialog>
    );
}

/* ==================== TEST PART – FIXED & STABLE ==================== */
function TestPart({
                      num,
                      cards,
                      answerWithTerm,
                      answerWithDefinition,
                      answerWithPron,
                      hasMC,
                      hasEssay,
                      setSubmit,
                      setMcQuestState,
                      setEsQuestState,
                  }: {
    num: number;
    cards: UICard[];
    answerWithTerm: boolean;
    answerWithDefinition: boolean;
    answerWithPron: boolean;
    hasMC: boolean;
    hasEssay: boolean;
    setSubmit:(e: boolean)=>void;
    setMcQuestState: (e: QuestionState[]) => void;
    setEsQuestState: (e: QuestionState[]) => void;
}) {
    const [mc, setMC] = useState<MultipleChoice[]>([]);
    const [essay, setEssay] = useState<QuestionCreator[]>([]);
    const mcRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
    const esRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

    // Re-create test whenever any option changes
    useEffect(() => {
        const loadTest = async () => {
            // @ts-ignore
            const tc: TestCreator = {
                quizeachpart: num,
                cards: cards,
                format: [hasEssay, hasMC, answerWithPron],
                type: [answerWithTerm, answerWithDefinition],
            };
            const result = await CreateTest(tc);
            setMC(result.mc || []);
            setEssay(result.essay || []);
        };
        loadTest();
    }, [num, cards, hasEssay, hasMC, answerWithPron, answerWithTerm, answerWithDefinition]);

    useEffect(() => {
        esRefs.current = essay.map((_, idx) => createRef<HTMLDivElement>());
        setEsQuestState(essay.map((value, idx) =>({
            ref: esRefs.current[idx],
            filled: false,
            answer: Answer.createFrom({ quizz: value.quizz, answer: "" })
        })));

        mcRefs.current = mc.map((_, idx) => createRef<HTMLDivElement>());
        setMcQuestState(mc.map((value, idx) =>({
            ref: mcRefs.current[idx],
            filled: false,
            answer: Answer.createFrom({ quizz: value.questions, answer: "" })
        })))
    }, [mc, essay]);

    return (
        <Card className="flex flex-col gap-[5vh] justify-start items-start w-full mt-[2vh] border-indigo-500 bg-transparent text-indigo-100 mb-2">
            <CardHeader className="w-full flex flex-row justify-center items-center">
                <h1 className="font-bold text-[4.3vh]">TEST</h1>
            </CardHeader>

            <CardContent className="flex flex-col justify-start items-start mt-[-3vh] w-full">
                <MultipleChoicePart mc={mc} hasMC={hasMC} mcRefs={mcRefs.current} setMcQuestState={setMcQuestState}/>
                <EssayPart essay={essay} hasEssay={hasEssay} esRefs={esRefs.current} setEsQuestState={setEsQuestState}/>
            </CardContent>
            <CardFooter className='flex flex-col justify-start items-end mt-[-4vh] w-full'>
                <SubmitAlert setSubmit={setSubmit}/>
            </CardFooter>
        </Card>
    );
}

/* ==================== MULTIPLE CHOICE PART – FIXED ==================== */
function MultipleChoicePart({ mc, hasMC, mcRefs, setMcQuestState}:
                            { mc: MultipleChoice[]; hasMC: boolean; mcRefs: React.RefObject<HTMLDivElement>[];
                                setMcQuestState: (e: QuestionState[]) => void;
}) {
    // FIX 1: Return null instead of <div></div> → prevents Radix UI crash on fast mount/unmount
    if (!hasMC) return null;

    const [localMCState, setLocalMCState] = useState<QuestionState[]>([]);
    useEffect(() => {
        const init = mc.map((v, idx) => ({
            ref: mcRefs[idx],
            filled: false,
            answer: Answer.createFrom({ quizz: v.questions, answer: "" })
        }));
        setLocalMCState(init);
        setMcQuestState(init);      // sync lên component cha
    }, [mc]);

    const updateAnswer = (idx: number, ans: string, quizz: string) => {
        const updated = [...localMCState];
        updated[idx] = {
            ...updated[idx],
            filled: true,
            answer: Answer.createFrom({
                quizz,
                answer: ans
            })
        };

        setLocalMCState(updated);   // local update
        setMcQuestState(updated);   // gửi lên component cha
    };

    return (
        <div className="flex flex-col gap-[2vh] justify-start items-start text-lg">
            <div className="flex flex-col justify-start items-start">
                <h1 className="font-bold text-[3.8vh]">Multiple choice</h1>
                <h3>Choose the best answer for the questions</h3>
            </div>

            {mc.map((value, idx) => (
                // FIX 2: Add stable key → required when mapping
                <MCQuest key={`${value.questions}-${idx}`} value={value} idx={idx + 1} ref={mcRefs[idx]} onSelectAnswer={updateAnswer}/>
            ))}
        </div>
    );
}

const MCQuest = React.forwardRef<HTMLDivElement, {
    value: MultipleChoice;
    idx: number;
    onSelectAnswer: (idx: number, ans: string, quizz: string) => void;
}>(({ value, idx, onSelectAnswer }, ref) => {

    // const shuffled = [...value.answers];
    // shuffled.sort(() => Math.random() - 0.5);

    return (
        <div ref={ref} className="flex flex-col justify-start items-start w-full mt-[2vh]">
            <h1>
                Question {idx}: {value.questions}
            </h1>

            <RadioGroup defaultValue=""
                        onValueChange={(ans) => onSelectAnswer(idx - 1, ans, value.questions)}
            >
                {value.answers.map((ans, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <RadioGroupItem
                            className='border-slate-400 h-5 w-5 rounded-full border-2
                                        data-[state=checked]:border-indigo-500
                                        text-indigo-500
                                        peer'
                            value={ans}
                            id={`mc-${idx}-${i}`}
                        />
                        <Label className="text-lg" htmlFor={`mc-${idx}-${i}`}>
                            {ans}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
});

/* ==================== ESSAY PART – FIXED ==================== */
function EssayPart({
                       essay,
                       hasEssay,
                       esRefs,
                       setEsQuestState
                   }: {
    essay: QuestionCreator[];
    hasEssay: boolean;
    esRefs: React.RefObject<HTMLDivElement>[];
    setEsQuestState: (e: QuestionState[]) => void;
}) {
    if (!hasEssay) return null;

    const [localEsState, setLocalEsState] = useState<QuestionState[]>([]);
    useEffect(() => {
        const init = essay.map((v, idx) => ({
            ref: esRefs[idx],
            filled: false,
            answer: Answer.createFrom({ quizz: v.quizz, answer: "" })
        }));
        setLocalEsState(init);
        setEsQuestState(init);      // sync lên component cha
    }, [essay]);

    const updateAnswer = (idx: number, ans: string, quizz: string) => {
        const updated = [...localEsState];
        updated[idx] = {
            ...updated[idx],
            filled: true,
            answer: Answer.createFrom({
                quizz,
                answer: ans
            })
        };

        setLocalEsState(updated);   // local update
        setEsQuestState(updated);   // gửi lên component cha
    };


    return (
        <div className="flex flex-col justify-start items-start w-full mt-[4vh] text-lg">
            <div className="flex flex-col justify-start items-start">
                <h1 className="font-bold text-[3.5vh]">Essay</h1>
                <h3>Fill in the blank term or definition of vocab</h3>
            </div>

            {essay.map((value, idx) => (
                <EssayQuest
                    key={`${value.quizz}-${idx}`}
                    value={value}
                    idx={idx + 1}
                    ref={esRefs[idx]}
                    onSelectAnswer={updateAnswer}
                />
            ))}
        </div>
    );
}

const EssayQuest = React.forwardRef<HTMLDivElement, {
    value: QuestionCreator;
    idx: number;
    onSelectAnswer: (idx: number, ans: string, quizz: string) => void;
}>(({ value, idx, onSelectAnswer }, ref) => {
    const [text, setText] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setText(v);
        onSelectAnswer(idx - 1, v, value.quizz);
    };

    return (
        <div ref={ref} className="flex flex-col justify-start items-start w-full mb-1">
            <div className="flex flex-col gap-[1vh] justify-start items-start w-full mt-[2vh]">
                <h1>
                    Question {idx}: {value.quizz}
                </h1>
                <Input className="border-indigo-300 rounded-xl !text-base"
                       value={text}
                       onChange={handleChange}/>
            </div>
        </div>
    );
});

function SubmitAlert({setSubmit}:{setSubmit:(e: boolean)=>void}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button className='bg-teal-700 text-base font-bold hover:bg-teal-500'>
                    Submit
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-[2.6vh] font-bold text-indigo-200'>
                        Are you absolutely sure to submit?
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-indigo-400 text-[2vh]'>
                        Once submitted, you will not be able to return to the test or change any answers. Your responses will be finalized and scored immediately.
                        Please ensure you have answered all questions before proceeding.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className='px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors hover:text-white border-none'>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => setSubmit(true)}
                    className='px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors'
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function TestResult({
                        score,
                        esResult,
                        mcResult,
                        setSubmit
                    }: {
    score: number;
    esResult: TrueAnswer[];
    mcResult: TrueAnswer[];
    setSubmit:(e: boolean)=>void;
}) {

    const renderPart = (title: string, data: TrueAnswer[]) => {
        if (!data || data.length === 0) return null;

        return (
            <div className="flex flex-col gap-3 w-full mt-4">
                <h2 className="font-bold text-[3vh] text-indigo-300">{title}</h2>

                {data.map((v, idx) => (
                    <div
                        key={idx}
                        className={`w-full p-3 rounded-xl border 
                            ${v.state
                            ? "border-green-500 bg-green-900/20"
                            : "border-red-500 bg-red-900/20"}`
                        }
                    >
                        <p className="text-[2.2vh] font-semibold">
                            <span className="text-indigo-200">Question {idx + 1}: </span>
                            {v.quizz}
                        </p>

                        <p className="mt-1">
                            <span className="text-indigo-400">Your answer:</span>{" "}
                            <span className={`${v.state ? "text-green-400" : "text-red-400"}`}>
                                {v.userans || "—"}
                            </span>
                        </p>

                        <p>
                            <span className="text-indigo-400">Correct answer:</span>{" "}
                            <span className="text-green-300">{v.correctans}</span>
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    const totalCorrect =
        esResult.filter(r => r.state).length +
        mcResult.filter(r => r.state).length;

    const totalQuestions = esResult.length + mcResult.length;

    return (
        <Card className="w-full p-6 bg-transparent border-indigo-600 text-indigo-100">
            <CardHeader>
                <h1 className="text-[4vh] font-bold text-center">RESULT</h1>
            </CardHeader>

            <CardContent className="flex flex-col items-start gap-4">
                <div className="flex flex-row items-center justify-center w-full gap-6 mt-[-1vh]">
                    <div className="text-[5vh] font-extrabold text-indigo-300">
                        {score.toFixed(1)} / 10
                    </div>
                    <div className="text-[2.5vh] text-indigo-400">
                        Correct: {totalCorrect}/{totalQuestions}
                    </div>
                </div>

                {/* Multiple-choice section */}
                {renderPart("Multiple Choice", mcResult)}

                {/* Essay section */}
                {renderPart("Essay", esResult)}
            </CardContent>

            <CardFooter className="w-full flex justify-center mt-4">
                <Button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[2.2vh]"
                    onClick={() => setSubmit(false)} //
                >
                    Try Again
                </Button>
            </CardFooter>
        </Card>
    );
}


function QuestionListPreview({
                                 msQuesState,
                                 esQuesState
                             }: {
    msQuesState: QuestionState[],
    esQuesState: QuestionState[]
}) {

    const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref?.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    };

    return (
        <Card className="flex flex-col flex-wrap justify-start items-start w-[23vw] mt-[2vh]
                         border-indigo-500 bg-transparent text-indigo-100 rounded-3xl  px-[-2vh]">

            <CardHeader className="font-bold text-2xl mb-4">Questions</CardHeader>

            <CardContent className="flex flex-col gap-5">

                {/* ===================== MC SECTION ===================== */}
                {msQuesState.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h1 className="font-bold text-lg">Multiple choice</h1>

                        <div className="flex flex-row flex-wrap gap-3">
                            {msQuesState.map((q, idx) => (
                                <div
                                    key={`mc-${idx}`}
                                    onClick={() => handleScroll(q.ref)}
                                    className={`
                                        h-10 w-10 rounded-full flex justify-center items-center cursor-pointer
                                        border-2 border-indigo-500 select-none
                                        ${q.filled ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-900"}
                                    `}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===================== ESSAY SECTION ===================== */}
                {esQuesState.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h1 className="font-bold text-lg">Essay</h1>

                        <div className="flex flex-row flex-wrap gap-3">
                            {esQuesState.map((q, idx) => (
                                <div
                                    key={`es-${idx}`}
                                    onClick={() => handleScroll(q.ref)}
                                    className={`
                                        h-10 w-10 rounded-full flex justify-center items-center cursor-pointer
                                        border-2 border-indigo-500 select-none
                                        ${q.filled ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-900"}
                                    `}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
