package mazecontroller

import (
	"fmt"
	"math/rand"
	"testwails/backend/object"
)

type QuestBlock struct {
	Block Point
	Quest object.Card
}

func (m Maze) CreateQuestionBlock(cards []object.Card) []QuestBlock {
	var result []QuestBlock
	n := len(questIndex)
	if n > len(cards) {
		n = len(cards)
	}

	rand.Shuffle(len(cards), func(i, j int) {
		cards[i], cards[j] = cards[j], cards[i]
	})
	rand.Shuffle(len(questIndex), func(i, j int) {
		questIndex[i], questIndex[j] = questIndex[j], questIndex[i]
	})

	for i := 0; i < n; i++ {
		result = append(result, QuestBlock{
			Block: questIndex[i],
			Quest: cards[i],
		})
	}

	fmt.Println("Quest Block:")
	rand.Shuffle(len(result), func(i, j int) {
		result[i], result[j] = result[j], result[i]
	})
	for i := 0; i < len(result); i++ {
		fmt.Println(result[i])
	}
	return result
}
