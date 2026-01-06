// package controller

// import (
// 	"net/http"
// 	"testwails/backend/object"

// 	"github.com/go-fuego/fuego"
// )

// type FolderHandler struct{}

// func (f FolderHandler) createFolder(c fuego.ContextWithBody[object.FolderWriter]) error {
// 	body, err := c.Body()
// 	if err != nil {
// 		return fuego.HTTPError{
// 			Status: http.StatusBadRequest,
// 			Title:  "Wrong body",
// 		}
// 	}

// 	err = writer(body.Dir, body.Folder.Name, body.Folder)
// 	if err != nil {
// 		return fuego.HTTPError{
// 			Status: http.StatusInternalServerError,
// 			Title:  "Cannot write file",
// 			Detail: err.Error(),
// 		}
// 	}

// 	return nil
// }

package controller

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testwails/backend/object"
)

type FolderHandler struct{}

func NewFolderHandler() *FolderHandler {
	return &FolderHandler{}
}

func (f *FolderHandler) SaveFolder(fc object.FolderCreator) (int, error) {
	dataPath, err := dataDir()
	if err != nil {
		fmt.Println("failed to get data path: ", err)
	}

	// Build full path to the new folder
	parentDir := filepath.Join(append([]string{dataPath}, fc.Dirs...)...)
	if _, err := os.Stat(parentDir); os.IsNotExist(err) {
		fmt.Println("parent folder does not exist: ", parentDir)
		return 0, fmt.Errorf("parent folder does not exist: %s", parentDir)
	}

	if fc.OldName != "" && fc.OldName != fc.Name {
		err := Rename(object.Renamer{
			NewName: fc.Name,
			Dirs:    append(fc.Dirs, fc.OldName),
		})
		if err != nil {
			fmt.Println("Can not rename, because: ", err)
			return 0, err
		}

		metadata, err := f.LoadFolder(object.FLoader{
			Name: fc.Name,
			Dirs: fc.Dirs,
		})
		if err != nil {
			fmt.Println("Can not read metadata, becuase: ", err)
			return 0, err
		}
		metadata.Name = fc.Name
		fc.Metadata = metadata
	} else {
		newFolderPath := filepath.Join(parentDir, fc.Name)
		if _, err := os.Stat(newFolderPath); err == nil {
			fmt.Println("folder already exists: ", newFolderPath)
			return 0, fmt.Errorf("folder already exists: %s", newFolderPath)
		}

		// Create folder
		if err := os.Mkdir(newFolderPath, 0755); err != nil {
			fmt.Println("failed to create folder: ", err)
			return 0, err
		}
	}

	// Write metadata.json inside the new folder
	subDirs := append(fc.Dirs, fc.Name)
	if err := Writer(subDirs, "metadata", fc.Metadata); err != nil {
		fmt.Println("failed to write metadata: ", err)
	}

	return len(fc.Metadata.Children), nil
}

func (f *FolderHandler) upSertChild(fl object.FLoader, newChild object.Data, oldName string) (bool, error) {
	fmt.Println("Adding!")
	childMD, err := f.LoadFolder(fl)
	if err != nil {
		return false, err
	}

	for i, child := range childMD.Children {
		if child.Name == oldName {
			// Replace
			childMD.Children[i] = newChild

			if err := Writer(append(fl.Dirs, fl.Name), "metadata", childMD); err != nil {
				fmt.Println("failed to write metadata:", err)
				return false, err
			}
			return false, nil // replaced
		}
	}

	childMD.Children = append(childMD.Children, newChild)

	if err := Writer(append(fl.Dirs, fl.Name), "metadata", childMD); err != nil {
		fmt.Println("failed to write metadata:", err)
		return false, err
	}

	return true, nil // appended
}

func (f *FolderHandler) removeChild(fl object.FLoader, name string) error {
	fmt.Println("Remove!")
	fmt.Println("Name is found: ", name)
	childMD, err := f.LoadFolder(fl)
	if err != nil {
		return err
	}
	newChildLits := []object.Data{}
	for _, c := range childMD.Children {
		if c.Name == name {
			fmt.Println("Founed!")
			continue
		}
		newChildLits = append(newChildLits, c)
	}
	childMD.Children = newChildLits

	if err := Writer(append(fl.Dirs, fl.Name), "metadata", childMD); err != nil {
		fmt.Println("failed to write metadata:", err)
		return err
	}

	return nil
}

func (f *FolderHandler) updateParentFolder(fl object.FLoader, change int) error {
	parentFL := object.FLoader{}

	if len(fl.Dirs) != 0 {
		parentFL = object.FLoader{
			Name: fl.Dirs[len(fl.Dirs)-1],
			Dirs: fl.Dirs[:len(fl.Dirs)-1],
		}
	}

	parentMD, err := f.LoadFolder(parentFL)
	if err != nil {
		return err
	}
	for i, pc := range parentMD.Children {
		if pc.Name == fl.Name {
			parentMD.Children[i].NumOfChildren += change
		}
	}
	if err := Writer(fl.Dirs, "metadata", parentMD); err != nil {
		fmt.Println("failed to write metadata: ", err)
		return err
	}

	return nil
}

// Update the folder's metadata when adding, updating or deleting new deck
func (f *FolderHandler) UpdateFolder(fl object.FLoader, newChild object.Data, oldName string, isDelete bool) error {
	change := 1
	if isDelete {
		change = -1
	}

	if isDelete {
		err := f.removeChild(fl, strings.ReplaceAll(oldName, ".json", ""))
		if err != nil {
			fmt.Println("Can not update curFolder!")
			return err
		}
	} else {
		isNewChild, err := f.upSertChild(fl, newChild, oldName)
		if err != nil {
			fmt.Println("Can not update curFolder!")
			return err
		}

		if !isNewChild {
			return nil
		}
	}

	if fl.Name == "" {
		fmt.Println("This is the root folder!")
		return nil
	}

	err := f.updateParentFolder(fl, change)
	if err != nil {
		fmt.Println("Can not update parentFolder!")
		return err
	}

	fmt.Println("Update Success!")
	return err
}

// Returns all file and folder names inside a given folder in /data.
// Useful for the FE to display a list of decks/folders.
func (f *FolderHandler) LoadFolder(fl object.FLoader) (object.Metadata, error) {
	var meta object.Metadata

	dataPath, err := dataDir()
	if err != nil {
		return meta, fmt.Errorf("failed to get data path: %w", err)
	}

	// Build full folder path (e.g. /data/folder1/sub1/target)
	fullDir := filepath.Join(append([]string{dataPath}, fl.Dirs...)...)
	fullDir = filepath.Join(fullDir, fl.Name)

	if !EnsureDir(fullDir) {
		return meta, fmt.Errorf("folder does not exist: %s", fullDir)
	}

	// Read metadata.json using Reader
	if err := Reader(append(fl.Dirs, fl.Name), "metadata", &meta); err != nil {
		return meta, fmt.Errorf("failed to read metadata: %w", err)
	}

	return meta, nil
}
