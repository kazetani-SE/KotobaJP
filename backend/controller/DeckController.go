// backend/controller/deck_handler.go
package controller

import (
	"fmt"
	"strings"
	"testwails/backend/object"
)

type DeckHandler struct{}

func NewDeckHandler() *DeckHandler {
	return &DeckHandler{}
}

func (d *DeckHandler) saveDeck(dirs []string, name string, deck object.Deck) error {
	return Writer(dirs, name, deck)
}

func (d *DeckHandler) UpdateDeck(body object.FileCreator) error {
	return d.saveDeck(body.Dirs, body.Name, body.Deck)
}

func (d *DeckHandler) SaveDeck(body object.DeckCreator) (int, error) {
	newDeck := []object.Card{}
	words := strings.Split(body.Content, body.EndLine)
	numOfChild := 0
	for _, w := range words {
		word := strings.Split(w, body.Devider)
		if len(word) < 2 {
			continue
		}
		term := strings.TrimSpace(word[0])
		def := strings.TrimSpace(word[1])

		if term == "" || def == "" {
			continue
		}
		for i := len(word); i < 4; i++ {
			word = append(word, "")
		}
		newDeck = append(newDeck, object.Card{
			Term:       term,
			Definition: def,
			Pronounce:  strings.TrimSpace(word[2]),
			Note:       strings.TrimSpace(word[3]),
			State:      1,
		})
		numOfChild++
	}

	if body.OldName != "" && body.OldName != body.Name {
		err := Rename(object.Renamer{
			Dirs:    append(body.Dirs, body.OldName+".json"),
			NewName: body.Name + ".json",
		})
		if err != nil {
			return 0, err
		}
	}

	return numOfChild, d.saveDeck(body.Dirs, body.Name, object.Deck{Cards: newDeck})
}

func (d *DeckHandler) LoadDeck(body object.FLoader) ([]object.Card, error) {
	var deck object.Deck
	if err := Reader(body.Dirs, body.Name, &deck); err != nil {
		return nil, fmt.Errorf("failed to read deck: %w", err)
	}
	return deck.Cards, nil
}
