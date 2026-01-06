package controller

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"testwails/backend/object"
)

type Util struct{}

func NewUtil() *Util {
	return &Util{}
}

// Returns the absolute path to the "data" folder regardless of whether
// the app is running in `wails dev` or as a compiled `.exe`.
func dataDir() (string, error) {
	exePath, err := os.Executable()
	if err != nil {
		return "", err
	}

	exeDir := filepath.Dir(exePath)
	projectRoot := filepath.Join(exeDir, "..", "..")
	dataPath := filepath.Join(projectRoot, "data")

	return filepath.Clean(dataPath), nil
}

// Checks if a directory exists.
func EnsureDir(dir string) bool {
	info, err := os.Stat(dir)
	return err == nil && info.IsDir()
}

// Checks if a file exists.
func EnsureFile(file string) bool {
	info, err := os.Stat(file)
	return err == nil && !info.IsDir()
}

// Saves JSON data into a file under the /data directory.
// The `dir` is relative to /data, e.g. "FolderTest1" not "./data/FolderTest1".
func Writer(dirs []string, name string, data interface{}) error {
	if len(dirs) == 0 {
		fmt.Println("Empty dirs")
		return fmt.Errorf("Empty dirs")
	}
	// Get root path (works in both Wails dev and build)
	dataPath, err := dataDir()
	if err != nil {
		fmt.Println("cannot resolve data directory: ", err)
		return fmt.Errorf("cannot resolve data directory: %v", err)
	}

	// Safely join all folder levels under /data
	fullDir := filepath.Join(append([]string{dataPath}, dirs...)...)
	fullDir = filepath.Clean(fullDir)

	// Ensure the folder path exists
	if !EnsureDir(fullDir) {
		fmt.Println("this folder does not exist: ", fullDir)
		return fmt.Errorf("this folder does not exist: %s", fullDir)
	}

	// Final file path (always .json)
	filePath := filepath.Join(fullDir, name+".json")

	// Marshal and write JSON
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to encode JSON: %v", err)
	}

	if err := os.WriteFile(filePath, jsonData, 0644); err != nil {
		return fmt.Errorf("failed to write file: %v", err)
	}

	return nil
}

// Reads and unmarshals JSON content from a file inside the /data directory.
// If reading fails, it retries by appending `.json` before returning an error.
func Reader(dirs []string, name string, target interface{}) error {
	// Resolve the root data directory
	dataPath, err := dataDir()
	if err != nil {
		return fmt.Errorf("cannot resolve data directory: %v", err)
	}

	// Construct full path to the directory containing the file
	fullDir := filepath.Join(append([]string{dataPath}, dirs...)...)
	fullDir = filepath.Clean(fullDir)

	// Construct file path (expect JSON file)
	filePath := filepath.Join(fullDir, name+".json")

	// Check file existence
	if !EnsureFile(filePath) {
		// Retry if user included `.json` in name
		altPath := filepath.Join(fullDir, name)
		if EnsureFile(altPath) {
			filePath = altPath
		} else {
			return fmt.Errorf("file not found: %s", filePath)
		}
	}

	// Ensure we’re not trying to read a folder by accident
	info, err := os.Stat(filePath)
	if err != nil {
		return fmt.Errorf("cannot access file: %v", err)
	}
	if info.IsDir() {
		return fmt.Errorf("expected a file but found a directory: %s", filePath)
	}

	// Read and decode JSON
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read file: %v", err)
	}

	if err := json.Unmarshal(data, target); err != nil {
		return fmt.Errorf("failed to parse JSON for %s: %v", filePath, err)
	}

	return nil
}

// Returns 1 if it's a file, 0 if it's a folder, -1 if not found.
func (u *Util) IsFile(dirs []string, name string) (int, error) {
	dataPath, err := dataDir()
	if err != nil {
		return -1, err
	}

	fullPath := filepath.Join(append([]string{dataPath}, append(dirs, name)...)...)
	info, err := os.Stat(fullPath)
	if os.IsNotExist(err) {
		jsonPath := fullPath + ".json"
		info, err = os.Stat(jsonPath)
		if os.IsNotExist(err) {
			return -1, fmt.Errorf("path not found: %s", fullPath)
		} else if err != nil {
			return -1, err
		}
	} else if err != nil {
		return -1, err
	}

	if info.IsDir() {
		return 0, nil
	}
	return 1, nil
}

func Rename(r object.Renamer) error {
	if len(r.Dirs) == 0 {
		return fmt.Errorf("empty dirs")
	}

	dataPath, err := dataDir()
	if err != nil {
		return err
	}

	// OLD path
	oldPath := filepath.Join(
		append([]string{dataPath}, r.Dirs...)...,
	)

	// NEW path (same parent)
	parent := r.Dirs[:len(r.Dirs)-1]
	newPath := filepath.Join(
		append([]string{dataPath}, append(parent, r.NewName)...)...,
	)

	fmt.Println("New path: ", newPath)
	fmt.Println("Old path: ", oldPath)

	// check old exists
	oldInfo, err := os.Stat(oldPath)
	if err != nil {
		fmt.Println("old path not found: ", oldPath)
		return fmt.Errorf("old path not found: %s", oldPath)
	}

	// prevent overwrite
	if _, err := os.Stat(newPath); err == nil {
		fmt.Println("target already exists: ", newPath)
		return fmt.Errorf("target already exists: %s", newPath)
	}

	fmt.Println("OldInfor: ", oldInfo)
	fmt.Println("Ext: ", filepath.Ext(r.NewName))
	// SAFETY: file ↔ folder mismatch
	if oldInfo.IsDir() && filepath.Ext(r.NewName) != "" {
		fmt.Println("cannot rename folder to file")
		return fmt.Errorf("cannot rename folder to file")
	}
	if !oldInfo.IsDir() && filepath.Ext(r.NewName) != ".json" {
		fmt.Println("cannot rename file to folder")
		return fmt.Errorf("cannot rename file to folder")
	}

	return os.Rename(oldPath, newPath)
}

func Delete(dirs []string) (bool, error) {
	if len(dirs) == 0 {
		return false, fmt.Errorf("empty dirs")
	}

	dataPath, err := dataDir()
	if err != nil {
		return false, err
	}

	// target path
	targetPath := filepath.Join(
		append([]string{dataPath}, dirs...)...,
	)

	fmt.Println("Delete target:", targetPath)

	// check exists
	info, err := os.Stat(targetPath)
	if err != nil {
		if os.IsNotExist(err) {
			return false, fmt.Errorf("path not found: %s", targetPath)
		}
		return false, err
	}

	name := dirs[len(dirs)-1]
	ext := filepath.Ext(name)

	// SAFETY: verify file / folder
	if info.IsDir() {
		if ext != "" {
			return false, fmt.Errorf("invalid delete: folder has extension")
		}
		// delete folder (recursive)
		return true, os.RemoveAll(targetPath)
	}

	// file case
	if ext != ".json" {
		return false, fmt.Errorf("invalid delete: file must be .json")
	}

	return true, os.Remove(targetPath)
}
