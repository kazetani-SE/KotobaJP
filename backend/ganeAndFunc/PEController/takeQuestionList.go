package pecontroller

import (
	"fmt"
	"math/rand"
	"testwails/backend/object"
)

func TakeQuestions(cards []object.Card, num int, typeList []bool) map[string][]object.QuestionCreator {
	test := make(map[string][]object.QuestionCreator)
	mc := make([]object.QuestionCreator, 0, num)
	written := make([]object.QuestionCreator, 0, num)

	// Defensive
	if num <= 0 {
		test["MC"] = mc
		test["Written"] = written
		return test
	}

	// Tính số câu trùng
	numOfSame := len(cards) - 2*(len(cards)-num)
	if numOfSame < 0 {
		numOfSame = 0
	}
	if num > len(cards) {
		numOfSame = len(cards)
	}

	fmt.Println("NumofSame: ", numOfSame)
	termMode := typeList[0]
	defiMode := typeList[1]

	isDual := termMode && defiMode
	r := 0
	if isDual {
		r = rand.Intn(2) // 0 = term, 1 = defi
	}

	tmpCards := make([]object.Card, len(cards))
	copy(tmpCards, cards)

	// 1) Lấy các câu TRÙNG
	for i := 0; i < numOfSame; i++ {
		if len(tmpCards) == 0 {
			break
		}
		idx := rand.Intn(len(tmpCards))
		c := tmpCards[idx]

		var qMC, qWri object.QuestionCreator

		if !isDual {
			// single mode (term-only hoặc defi-only)
			t := termMode
			qMC = buildQuestion(c, t)
			qWri = buildQuestion(c, t)
		} else {
			// Dual mode: **mỗi cặp trùng random lại một lần**
			ri := rand.Intn(2) // per-pair random
			qMC = buildQuestion(c, ri == 0)
			qWri = buildQuestion(c, ri == 1)
		}

		mc = append(mc, qMC)
		written = append(written, qWri)

		// remove used card
		tmpCards[idx] = tmpCards[len(tmpCards)-1]
		tmpCards = tmpCards[:len(tmpCards)-1]
	}

	numRemaining := len(cards) - numOfSame
	if numRemaining < 0 {
		numRemaining = 0
	}
	if numRemaining > len(tmpCards) {
		numRemaining = len(tmpCards)
	}
	half := numRemaining / 2
	if numOfSame == 0 {
		half = num
	}

	for i := 0; i < half; i++ {
		if len(tmpCards) == 0 {
			break
		}

		r = rand.Intn(2)

		var t bool
		if !isDual {
			t = termMode
		} else {
			t = (r == 0)
		}

		q, ok := takeOneQuestion(&tmpCards, t)
		if !ok {
			break
		}

		mc = append(mc, q)
	}

	for i := 0; i < half; i++ {
		if len(tmpCards) == 0 {
			break
		}

		r = rand.Intn(2)

		var t bool
		if !isDual {
			t = termMode
		} else {
			t = (r == 0)
		}

		q, ok := takeOneQuestion(&tmpCards, t)
		if !ok {
			break
		}

		written = append(written, q)
	}

	test["MC"] = mc
	test["Written"] = written

	fmt.Println("MC length: ", len(mc), "\nWritten length: ", len(written))
	fmt.Println(written)
	return test
}

func buildQuestion(c object.Card, t bool) object.QuestionCreator {
	q := object.QuestionCreator{
		AnswerPron: c.Pronounce,
		Type:       t,
	}

	if t {
		q.Quizz = c.Term
		q.AnswerStr = c.Definition
	} else {
		q.Quizz = c.Definition
		q.AnswerStr = c.Term
	}

	return q
}

func takeOneQuestion(cards *[]object.Card, t bool) (object.QuestionCreator, bool) {
	if len(*cards) == 0 {
		return object.QuestionCreator{}, false
	}

	idx := rand.Intn(len(*cards))
	c := (*cards)[idx]

	q := buildQuestion(c, t)

	// remove card
	(*cards)[idx] = (*cards)[len(*cards)-1]
	*cards = (*cards)[:len(*cards)-1]

	return q, true
}
