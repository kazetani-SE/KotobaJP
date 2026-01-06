package mazecontroller

import (
	"fmt"
	"math/rand"
)

type Maze struct{}

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

var questIndex []Point

func NewMaze() *Maze {
	return &Maze{}
}

func (m Maze) CreateNewMaze(N int) [][]int {
	// Create NxN slice
	N = N*3 + 3
	maze := make([][]int, N)
	for i := range maze {
		maze[i] = make([]int, N)
	}

	// Initialize grid (same as your logic)
	for i := 0; i < N; i++ {
		for j := 0; j < N; j++ {
			if i%2 == 0 || j%2 == 0 {
				maze[i][j] = 1
			} else {
				maze[i][j] = 2
			}
		}
	}
	createMaze(maze, Point{1, 1}, N)
	questIndex = findDeadEnds(maze)
	fmt.Println("Quest index: ", questIndex)
	// fmt.Println(takequestIndex(maze))
	return maze
}

func createMaze(maze [][]int, point Point, N int) {
	maze[point.X][point.Y] = 0
	nextPoints := make([]Point, 0, 4)

	// Check 4 directions (same logic)
	dirs := []Point{
		{2, 0}, {-2, 0},
		{0, 2}, {0, -2},
	}

	for _, d := range dirs {
		nx, ny := point.X+d.X, point.Y+d.Y
		if nx > 0 && nx < N && ny > 0 && ny < N && maze[nx][ny] == 2 {
			nextPoints = append(nextPoints, Point{X: nx, Y: ny})
		}
	}

	// Recursive carving
	for len(nextPoints) > 0 {
		randIndex := rand.Intn(len(nextPoints))
		selected := nextPoints[randIndex]
		nextPoints[randIndex] = nextPoints[len(nextPoints)-1]
		nextPoints = nextPoints[:len(nextPoints)-1]

		if maze[selected.X][selected.Y] != 0 {
			// Break wall
			maze[(selected.X+point.X)/2][(selected.Y+point.Y)/2] = 0
			// Recurse
			createMaze(maze, selected, N)
		}
	}
}

func findDeadEnds(maze [][]int) []Point {
	deadEnds := []Point{}
	N := len(maze)

	dirs := []Point{
		{1, 0}, {-1, 0},
		{0, 1}, {0, -1},
	}

	for x := 1; x < N-1; x++ {
		for y := 1; y < N-1; y++ {
			if x == 1 && y == 1 {
				continue
			}

			if maze[x][y] != 0 {
				continue
			}

			openCount := 0
			for _, d := range dirs {
				nx, ny := x+d.X, y+d.Y
				if maze[nx][ny] == 0 {
					openCount++
				}
			}

			if openCount == 1 {
				deadEnds = append(deadEnds, Point{X: x, Y: y})
			}
		}
	}

	return deadEnds
}

// func takequestIndex(maze [][]int) []Point {
// 	var result []Point
// 	n := len(maze)

// 	dirs := []Point{
// 		{1, 0},
// 		{-1, 0},
// 		{0, 1},
// 		{0, -1},
// 	}

// 	for i := 1; i < n-1; i++ {
// 		for j := 1; j < n-1; j++ {
// 			if maze[i][j] != 0 {
// 				continue
// 			}

// 			openCount := 0
// 			for _, d := range dirs {
// 				ni, nj := i+d.X, j+d.Y
// 				if maze[ni][nj] == 0 {
// 					openCount++
// 				}
// 			}

// 			if openCount == 1 {
// 				result = append(result, Point{x: i, y: j})
// 			}
// 		}
// 	}

// 	return result
// }
