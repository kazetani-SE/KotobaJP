package object

type Data struct {
	Name          string `json:"name"`
	NumOfChildren int    `json:"numOfChildren"`
	Proficiency   int    `json:"proficiency"`
}

type Metadata struct {
	Name     string `json:"name"`
	Children []Data `json:"children"`
}

type Deck struct {
	Cards []Card `json:"cards"`
}

type Card struct {
	Term       string `json:"term"`
	Pronounce  string `json:"pronounce"`
	Definition string `json:"definition"`
	Note       string `json:"note"`
	State      int    `json:"state"`
}

type FLoader struct {
	Name string   `json:"name"`
	Dirs []string `json:"dirs"`
}

type DeckCreator struct {
	Name    string   `json:"name"`
	OldName string   `json:"oldname"`
	Dirs    []string `json:"dirs"`
	Content string   `json:"content"`
	Devider string   `json:"devider"`
	EndLine string   `json:"endline"`
}

type DeckExpoter struct {
	Infor   FLoader `json:"infor"`
	Divider string  `json:"divider"`
	EndLine string  `json:"endline"`
}

type FileCreator struct {
	Name string   `json:"name"`
	Deck Deck     `json:"deck"`
	Dirs []string `json:"dirs"`
}

type FolderCreator struct {
	Name     string   `json:"name"`
	OldName  string   `json:"oldname"`
	Dirs     []string `json:"dirs"`
	Metadata Metadata `json:"metadata"`
}

type Renamer struct {
	NewName string   `json:"newname"`
	Dirs    []string `json:"dirs"`
}
