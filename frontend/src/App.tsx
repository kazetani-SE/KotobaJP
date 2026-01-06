import {useState} from 'react';
import './App.css';
import {Button} from "@/components/ui/button";
import MainPage from './pages/MainPage';
import CreatePage from "@/pages/CreatePage";
import AIChattingPage from "@/pages/AIChattingPage";
import InforPage from "@/pages/InforPage";

import {TestLearnPagePreview} from "@/pages/TestLearningPage";

function App() {
    const [page, setPage] = useState<1|2|3|4>(1);

    const renderPage = () => {
        switch (page) {
            case 2: return <CreatePage/>;
            case 3: return <AIChattingPage/>;
            case 4:return <InforPage/>;
            default: return <MainPage/>;
        }
    }

    return (
        // Header
        <div className='flex flex-col min-w-[100vw] w-max min-h-screen bg-slate-950 justify-start items-center' id="App">
            <div className='mb-[5vh] w-[50vw] h-[6vh]'>
                <Button variant='ghost' className={styleButton2Head(page === 1, true)}
                onClick={() => setPage(1)}>
                    MAIN
                </Button>
                <Button variant='ghost' className={styleButtonMiddle(page === 2)}
                onClick={() => setPage(2)}>
                    CREATE
                </Button>
                <Button variant='ghost' className={styleButtonMiddle(page === 3)}
                onClick={() => setPage(3)}>
                    AI ASSISTANT
                </Button>
                <Button variant='ghost' className={styleButton2Head(page === 4, false)}
                onClick={() => setPage(4)}>
                    INFOR
                </Button>
            </div>

            {/* Body*/}
            {renderPage()}
            {/*<TestLearnPagePreview />*/}
        </div>
    )
}

function styleButtonMiddle(action: boolean){
    return `bg-slate-900
    rounded-none hover:bg-transparent
    border-b-[1.4px] border-slate-800 hover:border-indigo-800
    text-indigo-100 hover:text-indigo-100
    ${action ? 'bg-[#11122b] border-indigo-700' : ''}`;
}

function styleButton2Head(action: boolean, isLeft: boolean){
    return `bg-slate-900
    rounded-none hover:bg-transparent
    border-b-[1.4px] border-slate-800 hover:border-indigo-800
    text-indigo-100 hover:text-indigo-100
    ${isLeft ? 'border-l-[1.4px] rounded-bl-lg' : 'border-r-[1.4px] rounded-br-lg'}
    ${action ? 'bg-[#11122b] border-indigo-700' : ''}`;
}

export default App

