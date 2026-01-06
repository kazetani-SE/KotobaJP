package pecontroller

import (
	"fmt"
	"strings"
	"testwails/backend/object"
)

type TestHandler struct{}

func NewTestHandler() *TestHandler {
	return &TestHandler{}
}

var checkMap = func() map[string]string {
	return map[string]string{}
}()

func (t *TestHandler) CreateTest(testCreator object.TestCreator) object.TestCreateResult {
	for k := range checkMap {
		delete(checkMap, k)
	}
	// fmt.Println("<=============================================>")
	// fmt.Print("Q creator: ", testCreator)

	quesList := TakeQuestions(testCreator.Cards, testCreator.QuizEachPart, testCreator.Type)
	subMC := quesList["MC"]
	subWritten := quesList["Written"]
	var mc []object.MultipleChoice
	var written []object.QuestionCreator

	// fmt.Println("Take Q result: \nMC: ", subMC, "\nEssay: ", subWritten)

	if testCreator.Format[1] {
		mc = CreateMCList(subMC, testCreator.QuizEachPart, testCreator.Format[2])
		createCheckMap(nil, mc)
	}
	if testCreator.Format[0] {
		written = subWritten
		createCheckMap(written, nil)
	}

	result := object.TestCreateResult{
		Mc:    mc,
		Essay: written,
	}

	fmt.Println(testCreator.QuizEachPart)
	fmt.Println("MC: ", result.Mc)
	fmt.Println("Essay: ", written)

	return result
}

func createCheckMap(written []object.QuestionCreator, mc []object.MultipleChoice) {
	fmt.Println("<====== Check map ======>")

	for _, w := range written {
		fmt.Println("Es: Ques: ", w.Quizz+"e", " corect ans: ", w.AnswerStr)
		checkMap[w.Quizz+"e"] = w.AnswerStr
	}
	for _, mc := range mc {
		fmt.Println("MC: Ques: ", mc.Questions+"m", " corect ans: ", mc.CorrectAns)
		checkMap[mc.Questions+"m"] = mc.CorrectAns
	}
}

func DefaultTestResult() object.TestResult {
	return object.TestResult{
		Score:          0,
		CorrectAnswers: []object.TrueAnswer{},
	}
}

func (t *TestHandler) GetDefaultTestResult() object.TestResult {
	return DefaultTestResult()
}

func (t *TestHandler) TestCheck(ans []object.Answer, key string) object.TestResult {
	fmt.Println("====== CHECK INPUT =====")
	for _, v := range ans {
		fmt.Println(v)
	}
	results := make([]object.TrueAnswer, 0, len(ans))
	score := float32(0)

	for _, a := range ans {
		state := false

		if strings.EqualFold(checkMap[a.Quizz+key], a.Answer) {
			score++
			state = true
		}
		results = append(results, object.TrueAnswer{
			Quizz:      a.Quizz,
			UserAns:    a.Answer,
			CorrectAns: checkMap[a.Quizz+key],
			State:      state,
		})
	}
	score /= float32(len(ans))
	testResult := object.TestResult{
		Score:          score,
		CorrectAnswers: results,
	}

	fmt.Println("Result: ", testResult.Score)
	for _, v := range testResult.CorrectAnswers {
		fmt.Println(v)
	}
	return testResult
}

// GARBAGE
// func TakeQuestions(cards []object.Card, num int, typeList [2]bool) map[string][]object.QuestionCreator {
// 	test := make(map[string][]object.QuestionCreator)
// 	mc := make([]object.QuestionCreator, 0, num)
// 	written := make([]object.QuestionCreator, 0, num)
// 	numOfSame := len(cards) - 2*(len(cards)-num)
// 	if len(cards) < num {
// 		numOfSame = len(cards)
// 	}

// 	for i := 0; i < numOfSame; i++ {
// 		if len(cards) == 0 {
// 			break
// 		}
// 		nextQuiz := rand.Intn(len(cards))
// 		quiz := object.QuestionCreator{
// 			Quizz:      cards[nextQuiz].Term,
// 			AnswerStr:  cards[nextQuiz].Definition,
// 			AnswerPron: cards[nextQuiz].Pronounce,
// 		}
// 		mc = append(mc, quiz)
// 		written = append(written, quiz)
// 		cards[nextQuiz] = cards[len(cards)-1]
// 		cards = cards[:len(cards)-1]
// 	}

// 	test["MC"] = mc
// 	test["Written"] = written

// 	return test
// }
