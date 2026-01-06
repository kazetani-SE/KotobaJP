export namespace mazecontroller {
	
	export class Point {
	    x: number;
	    y: number;
	
	    static createFrom(source: any = {}) {
	        return new Point(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	    }
	}
	export class QuestBlock {
	    Block: Point;
	    Quest: object.Card;
	
	    static createFrom(source: any = {}) {
	        return new QuestBlock(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Block = this.convertValues(source["Block"], Point);
	        this.Quest = this.convertValues(source["Quest"], object.Card);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace object {
	
	export class Answer {
	    quizz: string;
	    answer: string;
	
	    static createFrom(source: any = {}) {
	        return new Answer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quizz = source["quizz"];
	        this.answer = source["answer"];
	    }
	}
	export class Card {
	    term: string;
	    pronounce: string;
	    definition: string;
	    note: string;
	    state: number;
	
	    static createFrom(source: any = {}) {
	        return new Card(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.term = source["term"];
	        this.pronounce = source["pronounce"];
	        this.definition = source["definition"];
	        this.note = source["note"];
	        this.state = source["state"];
	    }
	}
	export class Data {
	    name: string;
	    numOfChildren: number;
	    proficiency: number;
	
	    static createFrom(source: any = {}) {
	        return new Data(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.numOfChildren = source["numOfChildren"];
	        this.proficiency = source["proficiency"];
	    }
	}
	export class Deck {
	    cards: Card[];
	
	    static createFrom(source: any = {}) {
	        return new Deck(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cards = this.convertValues(source["cards"], Card);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DeckCreator {
	    name: string;
	    oldname: string;
	    dirs: string[];
	    content: string;
	    devider: string;
	    endline: string;
	
	    static createFrom(source: any = {}) {
	        return new DeckCreator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.oldname = source["oldname"];
	        this.dirs = source["dirs"];
	        this.content = source["content"];
	        this.devider = source["devider"];
	        this.endline = source["endline"];
	    }
	}
	export class FLoader {
	    name: string;
	    dirs: string[];
	
	    static createFrom(source: any = {}) {
	        return new FLoader(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.dirs = source["dirs"];
	    }
	}
	export class DeckExpoter {
	    infor: FLoader;
	    divider: string;
	    endline: string;
	
	    static createFrom(source: any = {}) {
	        return new DeckExpoter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.infor = this.convertValues(source["infor"], FLoader);
	        this.divider = source["divider"];
	        this.endline = source["endline"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class FileCreator {
	    name: string;
	    deck: Deck;
	    dirs: string[];
	
	    static createFrom(source: any = {}) {
	        return new FileCreator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.deck = this.convertValues(source["deck"], Deck);
	        this.dirs = source["dirs"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Metadata {
	    name: string;
	    children: Data[];
	
	    static createFrom(source: any = {}) {
	        return new Metadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.children = this.convertValues(source["children"], Data);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class FolderCreator {
	    name: string;
	    oldname: string;
	    dirs: string[];
	    metadata: Metadata;
	
	    static createFrom(source: any = {}) {
	        return new FolderCreator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.oldname = source["oldname"];
	        this.dirs = source["dirs"];
	        this.metadata = this.convertValues(source["metadata"], Metadata);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class MultipleChoice {
	    questions: string;
	    answers: string[];
	    correctans: string;
	
	    static createFrom(source: any = {}) {
	        return new MultipleChoice(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.questions = source["questions"];
	        this.answers = source["answers"];
	        this.correctans = source["correctans"];
	    }
	}
	export class QuestionCreator {
	    quizz: string;
	    answerstr: string;
	    answerpron: string;
	    type: boolean;
	
	    static createFrom(source: any = {}) {
	        return new QuestionCreator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quizz = source["quizz"];
	        this.answerstr = source["answerstr"];
	        this.answerpron = source["answerpron"];
	        this.type = source["type"];
	    }
	}
	export class TestCreateResult {
	    mc: MultipleChoice[];
	    essay: QuestionCreator[];
	
	    static createFrom(source: any = {}) {
	        return new TestCreateResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mc = this.convertValues(source["mc"], MultipleChoice);
	        this.essay = this.convertValues(source["essay"], QuestionCreator);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TestCreator {
	    quizeachpart: number;
	    cards: Card[];
	    format: boolean[];
	    type: boolean[];
	
	    static createFrom(source: any = {}) {
	        return new TestCreator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quizeachpart = source["quizeachpart"];
	        this.cards = this.convertValues(source["cards"], Card);
	        this.format = source["format"];
	        this.type = source["type"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TrueAnswer {
	    quizz: string;
	    userans: string;
	    correctans: string;
	    state: boolean;
	
	    static createFrom(source: any = {}) {
	        return new TrueAnswer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quizz = source["quizz"];
	        this.userans = source["userans"];
	        this.correctans = source["correctans"];
	        this.state = source["state"];
	    }
	}
	export class TestResult {
	    score: number;
	    correctanswers: TrueAnswer[];
	
	    static createFrom(source: any = {}) {
	        return new TestResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.score = source["score"];
	        this.correctanswers = this.convertValues(source["correctanswers"], TrueAnswer);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

