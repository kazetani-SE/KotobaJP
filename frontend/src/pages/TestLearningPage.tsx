import {Button} from "@/components/ui/button";

import {ArrowBigLeft} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

class MultipleChoice {
    questions: string;
    answers: string[];
    correctans: string;

    static createFrom(src: any) {
        return new MultipleChoice(src);
    }

    constructor(src: any) {
        this.questions = src.questions;
        this.answers = src.answers;
        this.correctans = src.correctans;
    }
}

// --- Fake Data ---
const fakeMC: MultipleChoice[] = [
    MultipleChoice.createFrom({
        questions: "What is the capital of Japan?",
        answers: ["Tokyo", "Osaka", "Kyoto", "Nagoya"],
        correctans: "Tokyo"
    }),
    MultipleChoice.createFrom({
        questions: "Choose the correct definition of 世界",
        answers: ["World", "Country", "Ocean", "Universe"],
        correctans: "World"
    }),
    MultipleChoice.createFrom({
        questions: "Which kanji means 'fire'?",
        answers: ["水", "火", "木", "土"],
        correctans: "火"
    })
];

const fakeEssay = [
    { question: "Kanji for 'mountain' is ___ ?", answer: "山" },
    { question: "Meaning of 日本 is ___ ?", answer: "Japan" }
];

// ----------------- PAGE PREVIEW -----------------
export function TestLearnPagePreview(){
    return (
        <div className="flex flex-col gap-0 justify-start items-center mt-[-5vh]">
            {/* Header */}
            <div className="flex flex-row w-[70vw] items-center justify-between mb-[3vh]">
                <Button
                    className="w-[6vh] h-[6vh] bg-slate-900 text-indigo-300 font-bold
                    border-[2px] border-indigo-600 rounded-full"
                >
                    <ArrowBigLeft className="w-7 h-7"/>
                </Button>

                <h1 className="font-bold text-indigo-100 text-[6vh]">Practice test</h1>

                <Button
                    className="px-4 py-4 rounded-xl bg-transparent border border-indigo-600
                    text-[2.5vh] text-indigo-50 font-semibold hover:border-indigo-400
                    hover:bg-indigo-950 hover:text-indigo-50"
                >
                    Test option
                </Button>
            </div>

            {/* Main layout */}
            <div className='flex flex-row gap-[2vw] justify-between items-start w-[90vw]'>

                <QuestionListPreview mc={fakeMC} essay={fakeEssay} />

                <div className='max-h-[80vh] overflow-y-auto w-[75vw] hide-scrollbar'>
                    <QuestionsPartPreview mc={fakeMC} essay={fakeEssay} />
                </div>
            </div>
        </div>
    );
}

// ----------------- QUESTIONS PART -----------------
function QuestionsPartPreview({mc, essay}:{mc:MultipleChoice[], essay:any[]}) {
    return (
        <Card
            className='flex flex-col gap-[5vh] justify-start items-start w-full mt-[2vh]
            border-indigo-500 bg-transparent text-indigo-100'
        >
            <CardHeader className='w-full flex flex-row justify-center items-center'>
                <h1 className='font-bold text-[4vh]'>TEST</h1>
            </CardHeader>

            <CardContent className='flex flex-col justify-start items-start mt-[-3vh]'>

                {/* --- Multiple Choice --- */}
                <h1 className='font-bold text-[3.5vh]'>Multiple choice</h1>
                <h3 className='mb-[2vh]'>Choose the best answer for the questions</h3>

                {mc.map((value, idx) => (
                    <MCQuestPreview key={idx} value={value} idx={idx + 1}/>
                ))}

                {/* --- Essay --- */}
                <h1 className='font-bold text-[3.5vh] mt-[5vh]'>Essay</h1>
                <h3 className='mb-[2vh]'>Fill in the blank</h3>

                {essay.map((e, idx) => (
                    <div key={idx} className="mb-[3vh]">
                        <h1>Question {idx + 1}: {e.question}</h1>
                        <input
                            className="mt-2 px-3 py-2 rounded bg-slate-800 border border-indigo-600
                            text-indigo-100 w-[30vw]"
                            placeholder="Your answer..."
                        />
                    </div>
                ))}

            </CardContent>
        </Card>
    );
}

// ----------------- MC ITEM -----------------
function MCQuestPreview({value, idx}:{value:MultipleChoice, idx:number}) {
    return (
        <div className='mb-[3vh]'>
            <h1 className='font-semibold text-[2.5vh]'>
                Question {idx}: {value.questions}
            </h1>

            <div className='mt-2 flex flex-col gap-1'>
                {value.answers.map((ans, i) => (
                    <h3 key={i} className='text-[2.2vh]'>
                        {String.fromCharCode(65 + i)}. {ans}
                    </h3>
                ))}
            </div>
        </div>
    );
}

// ----------------- QUESTION LIST LEFT -----------------
function QuestionListPreview({mc, essay}:{mc:MultipleChoice[], essay:any[]}) {
    return (
        <Card
            className='flex flex-col flex-wrap justify-start items-start w-[23vw] mt-[2vh]
            border-indigo-500 bg-transparent text-indigo-100 rounded-3xl p-4'
        >
            <CardHeader className='font-bold text-2xl mb-4'>
                Questions
            </CardHeader>

            <CardContent className="flex flex-row flex-wrap gap-3">
                {mc.map((_, i) => (
                    <div key={i}
                         className='w-[5vh] h-[5vh] flex justify-center items-center
                         border border-indigo-600 rounded-full text-indigo-100'>
                        {i + 1}
                    </div>
                ))}

                {essay.map((_, i) => (
                    <div key={"e"+i}
                         className='w-[5vh] h-[5vh] flex justify-center items-center
                         border border-purple-600 rounded-full text-purple-200'>
                        E{i + 1}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
