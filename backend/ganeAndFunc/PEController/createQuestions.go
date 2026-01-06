package pecontroller

import (
	"fmt"
	"math/rand"
	"testwails/backend/object"
)

func CreateMCList(questions []object.QuestionCreator, num int, makePron bool) []object.MultipleChoice {
	result := make([]object.MultipleChoice, 0, num)

	answerDefList := make([]string, 0, len(questions))
	answerTermList := make([]string, 0, len(questions))
	answerPronList := make([]string, 0, len(questions))

	for _, str := range questions {
		if str.Type {
			answerDefList = append(answerDefList, str.AnswerStr)
			answerTermList = append(answerTermList, str.Quizz)
		} else {
			answerDefList = append(answerDefList, str.Quizz)
			answerTermList = append(answerTermList, str.AnswerStr)
		}
		answerPronList = append(answerPronList, str.AnswerPron)
	}

	rand.Shuffle(len(questions), func(i, j int) {
		questions[i], questions[j] = questions[j], questions[i]
	})
	count := 0
	for times, q := range questions {
		if times == num {
			fmt.Println("times: ", times, " and num: ", num)
			break
		}

		var quiz string
		if q.Type {
			quiz = q.Quizz
		} else {
			quiz = q.AnswerStr
		}
		checkKana := []rune(quiz)[0]
		fmt.Printf("ChecKana: %c\n", checkKana)
		if count < num*7/10 && makePron && q.AnswerPron != "" && !isKana(checkKana) {
			//subAns, check := CreatePronounce_C2(q.AnswerPron)
			subAns, check := CreatePronounce_C3(q.AnswerPron)
			if check && count < num*4/10 {
				count++
				subAns = append(subAns, q.AnswerPron)
				rand.Shuffle(len(subAns), func(i, j int) {
					subAns[i], subAns[j] = subAns[j], subAns[i]
				})
				fmt.Println("Sub ans of pron: ", subAns)
				result = append(result, object.MultipleChoice{
					Questions:  quiz,
					Answers:    subAns,
					CorrectAns: q.AnswerPron,
				})
				fmt.Println("Counts: ", count, "\nTimes: ", times, "Add ok times: ", times)
				fmt.Println("Quizz (in pron): ", quiz)
				fmt.Println("Ans (in pron): ", subAns)

			} else {
				count++
				subAns = createChoices(answerPronList, q)
				subAns = append(subAns, q.AnswerPron)
				rand.Shuffle(len(subAns), func(i, j int) {
					subAns[i], subAns[j] = subAns[j], subAns[i]
				})
				fmt.Println("Sub ans of pron: ", subAns)
				result = append(result, object.MultipleChoice{
					Questions:  quiz,
					Answers:    subAns,
					CorrectAns: q.AnswerPron,
				})
			}

			continue
		}

		var subAns []string
		if q.Type {
			subAns = createChoices(answerDefList, q)
		} else {
			subAns = createChoices(answerTermList, q)
		}

		subAns = append(subAns, q.AnswerStr)
		rand.Shuffle(len(subAns), func(i, j int) {
			subAns[i], subAns[j] = subAns[j], subAns[i]
		})
		result = append(result, object.MultipleChoice{
			Questions:  q.Quizz,
			Answers:    subAns,
			CorrectAns: q.AnswerStr,
		})
		fmt.Println("Quizz (out pron): ", q.Quizz)
		fmt.Println("Ans (out pron): ", subAns)
		fmt.Println("Counts: ", count, "\nTimes: ", times, "Add ok times: ", times)
	}
	fmt.Println("Reasul's ;ength: ", len(result))
	return result
}

func createChoices(answers []string, q object.QuestionCreator) []string {
	subAns := make([]string, 0, 3)
	rand.Shuffle(len(answers), func(i, j int) {
		answers[i], answers[j] = answers[j], answers[i]
	})

	for i := 0; i < 3; i++ {
		if answers[i] == q.AnswerStr || answers[i] == q.AnswerPron {
			subAns = append(subAns, answers[len(answers)-1])
			continue
		}
		subAns = append(subAns, answers[i])
	}
	return subAns
}

func isKana(r rune) bool {
	switch {
	case r >= 0x3040 && r <= 0x309F: // Hiragana
		return true
	case r >= 0x30A0 && r <= 0x30FF:
		return true
	// Katakana Phonetic Extensions
	case r >= 0x31F0 && r <= 0x31FF:
		return true
	// Halfwidth Katakana
	case r >= 0xFF66 && r <= 0xFF9D:
		return true
	default:
		return false
	}
}
