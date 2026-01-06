package main

import (
	"embed"
	"testwails/backend/controller"
	aicontroller "testwails/backend/ganeAndFunc/AIController"
	mazecontroller "testwails/backend/ganeAndFunc/MazeController"
	pecontroller "testwails/backend/ganeAndFunc/PEcontroller"
	"testwails/backend/service"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	dh := controller.NewDeckHandler()
	fh := controller.NewFolderHandler()
	u := controller.NewUtil()
	m := mazecontroller.NewMaze()
	pe := pecontroller.NewTestHandler()
	ai := aicontroller.NewAI()
	srv := service.NewService(dh, fh)
	// Create application with options
	err := wails.Run(&options.App{
		Title:  "嵐KotobaJP",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown,
		Bind: []interface{}{
			app,
			dh,
			fh,
			u,
			m,
			pe,
			ai,
			srv,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
