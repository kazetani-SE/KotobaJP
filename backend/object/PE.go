package object

type QuestionCreator struct {
	Quizz      string `json:"quizz"`
	AnswerStr  string `json:"answerstr"`
	AnswerPron string `json:"answerpron"`
	Type       bool   `json:"type"`
}

type TrueAnswer struct {
	Quizz      string `json:"quizz"`
	UserAns    string `json:"userans"`
	CorrectAns string `json:"correctans"`
	State      bool   `json:"state"`
}

type TestResult struct {
	Score          float32      `json:"score"`
	CorrectAnswers []TrueAnswer `json:"correctanswers"`
}

// format: [multi, essay, term, def, pron]
type TestCreator struct {
	QuizEachPart int    `json:"quizeachpart"`
	Cards        []Card `json:"cards"`
	Format       []bool `json:"format"` // 0: written, 1: multiple choice, 2: pronounces
	Type         []bool `json:"type"`   // 0: term ques, 1: defi ques
}

type TestCreateResult struct {
	Mc    []MultipleChoice  `json:"mc"`
	Essay []QuestionCreator `json:"essay"`
}

type MultipleChoice struct {
	Questions  string   `json:"questions"`
	Answers    []string `json:"answers"`
	CorrectAns string   `json:"correctans"`
}

type Answer struct {
	Quizz  string `json:"quizz"`
	Answer string `json:"answer"`
}
