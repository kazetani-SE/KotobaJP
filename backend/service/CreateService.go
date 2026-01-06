package service

import (
	"fmt"
	"testwails/backend/controller"
	"testwails/backend/object"
)

type Service struct {
	dh *controller.DeckHandler
	fh *controller.FolderHandler
}

func NewService(dh *controller.DeckHandler, fh *controller.FolderHandler) *Service {
	return &Service{
		dh: dh,
		fh: fh,
	}
}

func (s *Service) AddNewDeck(body object.DeckCreator) error {
	fmt.Println("New name: ", body.Name)
	fmt.Println("OLd name: ", body.OldName)
	numOfChildren, err := s.dh.SaveDeck(body)
	if err != nil {
		fmt.Println("Can not add new deck")
		return err
	}

	var fl object.FLoader
	if len(body.Dirs) == 0 {
		fl = object.FLoader{
			Name: "",
			Dirs: []string{},
		}
	} else {
		fl = object.FLoader{
			Name: body.Dirs[len(body.Dirs)-1],
			Dirs: body.Dirs[:len(body.Dirs)-1],
		}
	}

	err = s.fh.UpdateFolder(fl, object.Data{
		Name:          body.Name,
		NumOfChildren: numOfChildren,
		Proficiency:   1,
	}, body.OldName, false)

	return err
}

func (s *Service) ExportDeck(body object.DeckExpoter) string {
	result := ""

	cards, err := s.dh.LoadDeck(body.Infor)
	if err != nil {
		fmt.Println("Can not export deck, because: ", err)
		return ""
	}
	for i, c := range cards {
		result += c.Term + body.Divider +
			c.Definition + body.Divider +
			c.Pronounce + body.Divider +
			c.Note
		if i != len(cards)-1 {
			result += body.EndLine
		}
	}

	return result
}

// Dirs does not contain the name
func (s *Service) AddNewFolder(body object.FolderCreator) error {
	fmt.Println("Old name: ", body.OldName)
	fmt.Println("New name: ", body.Name)
	numOfChildren, err := s.fh.SaveFolder(body)
	if err != nil {
		fmt.Println("Can not save new Folder")
		return err
	}

	var fl object.FLoader
	if len(body.Dirs) == 0 {
		fl = object.FLoader{
			Name: "",
			Dirs: []string{},
		}
	} else {
		fl = object.FLoader{
			Name: body.Dirs[len(body.Dirs)-1],
			Dirs: body.Dirs[:len(body.Dirs)-1],
		}
	}

	err = s.fh.UpdateFolder(fl, object.Data{
		Name:          body.Name,
		NumOfChildren: numOfChildren,
		Proficiency:   0,
	}, body.OldName, false)

	return err
}

func (s *Service) DeleteItem(dirs []string) error {
	if len(dirs) == 0 {
		return nil
	}
	deleted, err := controller.Delete(dirs)
	if err != nil {
		return err
	}

	if deleted {
		var fl object.FLoader
		if len(dirs) == 1 {
			fl = object.FLoader{
				Name: "",
				Dirs: []string{},
			}
		} else {
			fl = object.FLoader{
				Name: dirs[len(dirs)-2],
				Dirs: dirs[:len(dirs)-2],
			}
		}
		err = s.fh.UpdateFolder(fl, object.Data{}, dirs[len(dirs)-1], true)
	}

	return nil
}
