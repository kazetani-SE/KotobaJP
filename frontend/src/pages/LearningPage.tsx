import {object as BEObj} from "../../wailsjs/go/models";
import UICard = BEObj.Card;

import {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {ArrowBigLeft} from "lucide-react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";

interface QItem extends UICard {
    prio: number;
}

export default function LearnPage({card, cardName, setFunc, setCards}:
                                  {card:UICard[]; cardName:string; setFunc: React.Dispatch<React.SetStateAction<number>>;
                                      setCards: React.Dispatch<React.SetStateAction<UICard[]>>;}) {
    const [termPerTurn, setTermPerTurn] = useState<number>(7);
    const [answerWithTerm, setAnswerWithTerm] = useState<boolean>(true);
    const [answerWithDefinition, setAnswerWithDefinition] = useState<boolean>(false);
    const [choosing, setChoosing] = useState<boolean>(true);

    const [index, setIndex] = useState<number>(1);
    // questionSet holds remaining items (with prio) between turns
    const questionSet = useRef<QItem[]>(card.map(c => ({
        ...c,
        prio: (c as any).state ?? 0 // guard if state missing
    })));
    const [questions, setQuestions] = useState<QItem[]>([]);
    const stateChange = useRef<number>(0);

    const [sessionEnd, setSessionEnd] = useState<boolean>(false);

    const takeQuestion = () => {
        // clone current queue
        let pq = [...questionSet.current];

        // bring back current in-progress questions to PQ so we select fresh set
        pq.push(...questions);

        // sort by priority ascending (lower prio = sooner)
        pq.sort((a, b) => a.prio - b.prio);

        const count = Math.max(1, termPerTurn);
        const selected = pq.slice(0, count);
        const remaining = pq.slice(count);

        // decrement priority of remaining so they will surface later
        const lowered = remaining.map(item => ({
            ...item,
            prio: Math.max(0, item.prio - 1) // keep non-negative
        }));

        questionSet.current = lowered;

        setQuestions(selected);
        setIndex(1);
    };


    useEffect(() => {
        const max = questionSet.current.length + questions.length;
        if (termPerTurn > max) {
            setTermPerTurn(Math.max(1, max));
            return;
        }
        takeQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [termPerTurn, answerWithTerm, answerWithDefinition]);

    useEffect(() => {
        if (index <= 1 || questions.length === 0) return;

        const prevIndex = index - 2;
        const prev = questions[prevIndex];
        if (!prev) return;

        const delta = stateChange.current;
        // if delta is 0, do nothing (protect against accidental no-op)
        if (delta === 0) return;

        const upState = delta > 0 ? 1 : -1;

        // ================= UPDATE STATE (bounded 1..4) =================
        setCards(cards =>
            cards.map(c => {
                if (c.term !== prev.term) return c;

                const newState = c.state + upState;

                // clamp to 1..4
                const clamped = Math.min(4, Math.max(1, newState));

                if (clamped === c.state) return c;

                return { ...c, state: clamped };
            })
        );

        // ================= UPDATE PRIO =================
        setQuestions(qs => {
            return qs.map((q, i) => {
                if (i !== prevIndex) return q;

                const newPrio = Math.max(0, q.prio + delta); // prio không âm
                const newState = Math.min(4, Math.max(1, q.state + upState)); // state bounded 1..4

                return {
                    ...q,
                    prio: newPrio,
                    state: newState
                };
            });
        });

        // NOTE: we keep stateChange.current as-is until the next answer overwrites it.
        // This is safe because goNext() always sets stateChange.current before increasing index.
    }, [index, questions.length]);


    // ===================== NEW: AUTO OPEN END SESSION DIALOG =====================
    useEffect(() => {
        if (questions.length > 0 && index > termPerTurn) {
            setSessionEnd(true);
        }
    }, [index, termPerTurn, questions]);

    const updateStateChange = (delta: number) => {
        // ensure delta is integer
        stateChange.current = Math.trunc(delta);
    };

    const saveCards = () => {
        // TODO: save file here
        console.log("Saved.");
    };

    return (
        <div className="flex flex-col gap-0 justify-start items-center mt-[-5vh]">

            {/* ====================== HEADER ======================= */}
            <div className="flex flex-row w-[70vw] items-center justify-between mb-[3vh]">
                <Button
                    className="w-[6vh] h-[6vh]
                    bg-slate-900 text-indigo-300 font-bold
                    border-[2px] border-indigo-600 rounded-full"
                    onClick={() => setFunc(0)}
                >
                    <ArrowBigLeft className="w-7 h-7" />
                </Button>

                <h1 className="font-bold text-indigo-100 text-[6vh]">
                    {cardName}
                </h1>

                {/* ===== OPTIONS BUTTON ===== */}
                <Button
                    className="px-4 py-4 rounded-xl bg-transparent border border-indigo-600 text-[2.5vh] text-indigo-50 font-semibold
                    hover:border-indigo-400 hover:bg-indigo-950 hover:text-indigo-50"
                    onClick={() => setChoosing(true)}
                >
                    Options
                </Button>
            </div>

            {/* ================== MAIN QUESTION CARD =================== */}
            <QuestionCard
                index={index}
                questions={questions}
                setIndex={setIndex}
                setState={updateStateChange}
                answerWithDefinition={answerWithDefinition}
                answerWithTerm={answerWithTerm}
            />

            {/* ================== OPTIONS DIALOG =================== */}
            <ChooseType
                choosing={choosing}
                setChoosing={setChoosing}
                termPerTurn={termPerTurn}
                setTermPerTurn={setTermPerTurn}
                answerWithTerm={answerWithTerm}
                setAnswerWithTerm={setAnswerWithTerm}
                answerWithDefinition={answerWithDefinition}
                setAnswerWithDefinition={setAnswerWithDefinition}
            />

            {/* ================== END SESSION DIALOG =================== */}
            <Dialog open={sessionEnd} onOpenChange={setSessionEnd}>
                <DialogContent className="bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6 w-[55vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-[2.4vh] font-bold text-indigo-200">
                            Continue learning?
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-indigo-300 mt-2">
                        You have completed this set. Do you want to continue with a new batch?
                    </p>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                            onClick={() => {
                                saveCards();
                                setFunc(0); // back
                            }}
                        >
                            Stop
                        </Button>

                        <Button
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    stateChange.current = 0;
                                    setSessionEnd(false);
                                    takeQuestion();
                                }
                            }}
                            onClick={() => {
                                stateChange.current = 0;
                                setSessionEnd(false);
                                takeQuestion();
                            }}
                        >
                            Continue
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ChooseType({choosing, setChoosing, termPerTurn, setTermPerTurn, answerWithTerm,
                        setAnswerWithTerm, answerWithDefinition, setAnswerWithDefinition,
                    }: { choosing: boolean; setChoosing: (v: boolean) => void; termPerTurn: number;
    setTermPerTurn: (v: number) => void; answerWithTerm: boolean; setAnswerWithTerm: (v: boolean) => void;
    answerWithDefinition: boolean; setAnswerWithDefinition: (v: boolean) => void;
}) {

    const [tempTpT, setTempTpT] = useState<number>(termPerTurn);
    const [tempTerm, setTempTerm] = useState<boolean>(answerWithTerm);
    const [tempDef, setTempDef] = useState<boolean>(answerWithDefinition);

    useEffect(() => {
        if (choosing) {
            setTempTpT(termPerTurn);
            setTempTerm(answerWithTerm);
            setTempDef(answerWithDefinition);
        }
    }, [choosing]);

    const handleReset = () => {
        setTempTpT(termPerTurn);
        setTempTerm(answerWithTerm);
        setTempDef(answerWithDefinition);
    };

    const handleApply = () => {
        setTermPerTurn(tempTpT);
        setAnswerWithTerm(tempTerm);
        setAnswerWithDefinition(tempDef);
        setChoosing(false);
    };

    return (
        <Dialog open={choosing} onOpenChange={setChoosing}>
            <DialogContent
                className="bg-slate-900 text-indigo-100 border border-indigo-700/40 rounded-3xl p-6 w-[55vw] max-w-[600px]"
            >
                <DialogHeader>
                    <DialogTitle className="text-[2.6vh] font-bold text-indigo-200">
                        Learn Options
                    </DialogTitle>
                    <DialogDescription className="text-indigo-400 text-[2vh]">
                        You can adjust the learning options to your preference.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 mt-4 text-[2.2vh] font-semibold">
                    {/* Number of questions */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Number of questions per term</h3>
                        <NumberTpTInput value={tempTpT} setValue={setTempTpT} />
                    </div>

                    {/* Answer with term */}
                    <div className="flex flex-row items-center justify-between">
                        <h3 className="text-indigo-300">Answer with term</h3>
                        <Switch
                            checked={tempTerm}
                            onCheckedChange={(checked) => {
                                if (!checked) {
                                    setTempDef(true);
                                }
                                setTempTerm(checked);
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
                                if (!checked) {
                                    setTempTerm(true);
                                }
                                setTempDef(checked);
                            }}
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>
                </div>

                {/* Bottom buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    {/* Reset button */}
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                        Reset
                    </button>

                    {/* Apply button */}
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

export function NumberTpTInput({
                                   value,
                                   setValue
                               }: {
    value: number;
    setValue: (v: number) => void;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (!/^\d*$/.test(val)) return;

        if (val === "") {
            setValue(0);
            return;
        }

        const parsed = parseInt(val, 10);
        if (Number.isNaN(parsed)) return;

        if (parsed < 1) return;

        setValue(parsed);
    };

    const handleBlur = () => {
        if (value < 1) setValue(7);
    };

    return (
        <Input
            // ensure value is always a string for Input component
            value={value === 0 ? "" : String(value)}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-[10vw] min-w-[90px] rounded-full h-[4.5vh]
            bg-slate-800 border border-slate-700 text-indigo-100"
        />
    );
}

function QuestionCard({index, questions, setState, setIndex, answerWithDefinition, answerWithTerm }:
                      {index: number; questions:QItem[]; answerWithDefinition:boolean; answerWithTerm:boolean;
                          setState:(change:number) => void; setIndex: (index: number) => void;}) {

    const [answer, setAnswer] = useState<string>("");
    const [quiz, setQuiz] = useState<string>("");
    const [correct, setCorrect] = useState<boolean | null>(null);
    const [curQuest, setCurQuest] = useState<QItem | null>(questions[index - 1] ?? null);
    const [mode, setMode] = useState<"term" | "definition">("definition");

    // Recalculate question whenever index changes
    useEffect(() => {
        const q = questions[index - 1];
        if (!q) return;

        setCurQuest(q);
        setCorrect(null);
        setAnswer("");

        if (answerWithDefinition && !answerWithTerm) {
            setMode("definition");
            setQuiz(q.term);
            return;
        }

        if (!answerWithDefinition && answerWithTerm) {
            setMode("term");
            setQuiz(q.definition);
            return;
        }

        // Random each time render
        if (answerWithDefinition && answerWithTerm) {
            const r = Math.floor(Math.random() * 100);
            const modeChosen = r % 2 === 0 ? "definition" : "term";
            setMode(modeChosen);

            if (modeChosen === "definition") {
                setQuiz(q.term);       // quiz term
            } else {
                setQuiz(q.definition); // quiz definition
            }
        }

    }, [index, questions, answerWithDefinition, answerWithTerm]);


    const checkAnswer = () => {
        if (!curQuest) return;
        let expected = "";

        // if mode === definition → user enter definition
        if (mode === "definition") {
            expected = curQuest.definition;
        } else {
            expected = curQuest.term;
        }

        const isCorrect =
            answer.trim().toLowerCase() === expected.trim().toLowerCase();

        setCorrect(isCorrect);
    };

    const goNext = (finalCorrect: boolean) => {
        const delta = finalCorrect ? 2 : -1;
        setState(delta);
        setIndex(index + 1);
        setCorrect(null);
        setAnswer("");
    };

    // Use for auto focusing on input
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Use for enter to answer and go next
    const [AsnOrGo, setAsnOrGo] = useState(false);

    const renderState = () => {
        if (!curQuest) return null;
        switch (curQuest.state) {
            case 1:
                return <div className='w-fit text-lg bg-rose-100 text-rose-500
                rounded-full px-5 text-center py-1.5'>Unknown</div>;
            case 2:
                return <div className='w-fit text-lg bg-emerald-100 text-emerald-500
                rounded-full px-5 text-center py-1.5'>Recognized</div>;
            case 3:
                return <div className='w-fit text-lg bg-cyan-100 text-cyan-500
                rounded-full px-5 text-center py-1.5'>Proficient</div>;
            default:
                return <div className='w-fit text-lg bg-violet-100 text-violet-500
                rounded-full px-5 text-center py-1.5'>Mastered</div>;
        }
    };

    if (!curQuest) {
        return (
            <div className="text-indigo-200 text-3xl mt-20">
                Loading questions...
            </div>
        );
    }

    return(
        <Card className='flex flex-col justify-between mt-[5vh] w-[60vw] h-[69vh] bg-slate-900 rounded-2xl text-amber-50 border-none'>

            <CardHeader className='flex flex-row items-center justify-between font-bold text-lg'>
                Question
                {renderState()}
            </CardHeader>

            {/* ------------- CONTENT: TERM ABOVE / DEFINITION BELOW (if wrong) ----------- */}
            <CardContent className='flex flex-col justify-between px-10 h-[40vh] text-2xl font-medium'>
                <h1 className='mt-5'>{quiz}</h1>

                {correct === false && (
                    <p className='text-lg italic text-rose-400 pb-4'>
                        {mode === "term"
                            ? "Correct answer: " + curQuest.term
                            : "Correct answer: " + curQuest.definition
                        }
                        <br/>
                        {mode === "term"
                            ? curQuest.pronounce
                            : curQuest.note}
                    </p>
                )}
            </CardContent>

            {/* ------------------------- FOOTER ------------------------- */}
            <CardFooter className='flex flex-row gap-[1vh] items-center justify-center pb-10'>

                {/* INPUT with dynamic border */}
                <Input
                    ref={inputRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if(!AsnOrGo) checkAnswer();
                            else  goNext(!!correct);
                            setAsnOrGo(!AsnOrGo);
                        }
                    }}
                    className={`
                        h-[8vh] rounded-full text-indigo-100 font-semibold
                        !text-xl !placeholder:text-xl 
                        border-2
                        ${
                        correct === null
                            ? "border-indigo-300"
                            : correct
                                ? "border-emerald-400"
                                : "border-rose-400"
                    }
                    `}
                />

                {/* BEFORE ANSWERING */}
                {correct === null && (
                    <>
                        <Button
                            className='w-fit font-semibold text-lg bg-transparent hover:bg-transparent hover:text-pink-500'
                            // Treat skip as a wrong answer (delta -1) — change this behavior if you prefer no-op
                            onClick={() => {
                                setCorrect(false);
                                setAsnOrGo(!AsnOrGo);
                                }
                            }
                        >
                            Skip
                        </Button>

                        <Button
                            onClick={() => {
                                checkAnswer();
                                setAsnOrGo(!AsnOrGo);
                            }}
                            className='w-fit h-[7vh] font-semibold text-lg px-[4vh] rounded-lg
                               bg-emerald-50 hover:bg-emerald-50 text-emerald-950 hover:text-emerald-800'
                        >
                            Answer
                        </Button>
                    </>
                )}

                {/* AFTER ANSWERING */}
                {correct !== null && (
                    <>
                        {/* WRONG → show "I'm right" (green) */}
                        {/* RIGHT → show "I'm wrong" (red) */}
                        <Button
                            onClick={() => {
                                goNext(!correct);
                                setAsnOrGo(!AsnOrGo);
                            }}
                            className={`
                                w-fit font-semibold text-lg bg-transparent hover:bg-transparent
                                ${correct ? "text-rose-400 hover:text-rose-500" : "text-emerald-400 hover:text-emerald-500"}
                            `}
                        >
                            {correct ? "I'm wrong" : "I'm right"}
                        </Button>

                        <Button
                            onClick={() => {
                                goNext(correct);
                                setAsnOrGo(!AsnOrGo);
                            }}
                            className='w-fit h-[7vh] font-semibold text-lg px-[4vh] rounded-lg
                                bg-emerald-50 hover:bg-emerald-50 text-emerald-950 hover:text-emerald-800'
                        >
                            Next
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
