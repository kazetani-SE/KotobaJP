package pecontroller

import (
	"fmt"
	"math/rand"
	"sort"

	"golang.org/x/text/unicode/norm"
)

var pronounceTable = func() map[rune]rune {
	return map[rune]rune{
		// あ行
		'あ': 'あ', 'い': 'い', 'う': 'う', 'え': 'い', 'お': 'お',
		'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',

		// か行
		'か': 'あ', 'き': 'い', 'く': 'う', 'け': 'い', 'こ': 'う',

		// さ行
		'さ': 'あ', 'し': 'い', 'す': 'う', 'せ': 'い', 'そ': 'う',

		// た行
		'た': 'あ', 'ち': 'い', 'つ': 'う', 'て': 'い', 'と': 'う',

		// な行
		'な': 'あ', 'に': 'い', 'ぬ': 'う', 'ね': 'え', 'の': 'う',

		// は行
		'は': 'あ', 'ひ': 'い', 'ふ': 'う', 'へ': 'え', 'ほ': 'う',

		// ま行
		'ま': 'あ', 'み': 'い', 'む': 'う', 'め': 'い', 'も': 'う',

		// や行
		'や': 'あ', 'ゆ': 'う', 'よ': 'お',
		'ゃ': 'あ', 'ゅ': 'う', 'ょ': 'う',

		// ら行
		'ら': 'あ', 'り': 'い', 'る': 'う', 'れ': 'え', 'ろ': 'お',

		// わ行
		'わ': 'あ', 'を': 'お',
	}
}()

type pronCreator_C12 struct {
	pron      string
	canChange []int
	idx       int
}

type pronCreator_C3 struct {
	pron     rune
	priority int
	index    int
}

// func CreateProTable() {
// 	pronounceTable = map[rune]rune{
// 		// あ行
// 		'あ': 'あ', 'い': 'い', 'う': 'う', 'え': 'い', 'お': 'お',
// 		'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',

// 		// か行
// 		'か': 'あ', 'き': 'い', 'く': 'う', 'け': 'い', 'こ': 'う',

// 		// さ行
// 		'さ': 'あ', 'し': 'い', 'す': 'う', 'せ': 'い', 'そ': 'う',

// 		// た行
// 		'た': 'あ', 'ち': 'い', 'つ': 'う', 'て': 'い', 'と': 'う',

// 		// な行
// 		'な': 'あ', 'に': 'い', 'ぬ': 'う', 'ね': 'え', 'の': 'う',

// 		// は行
// 		'は': 'あ', 'ひ': 'い', 'ふ': 'う', 'へ': 'え', 'ほ': 'う',

// 		// ま行
// 		'ま': 'あ', 'み': 'い', 'む': 'う', 'め': 'い', 'も': 'う',

// 		// や行
// 		'や': 'あ', 'ゆ': 'う', 'よ': 'お',
// 		'ゃ': 'あ', 'ゅ': 'う', 'ょ': 'う',

// 		// ら行
// 		'ら': 'あ', 'り': 'い', 'る': 'う', 'れ': 'え', 'ろ': 'お',

// 		// わ行
// 		'わ': 'あ', 'を': 'お',
// 	}
// }

func CreatePronounce_C1(pron string) ([]string, bool) {
	//CreateProTable()
	splittedPronCopy := splitKana_C12(pron)
	for _, e := range splittedPronCopy {
		fmt.Println(e.pron, ": ", len(e.canChange))
	}

	result := make([]string, 0, 3)
	for i := 3; i > 0; {
		act := false
		sort.Slice(splittedPronCopy, func(i, j int) bool {
			return len(splittedPronCopy[i].canChange) > len(splittedPronCopy[j].canChange)
		})

		for j := 0; j < len(splittedPronCopy); j++ {
			// to create sub of splittedPronCopy to combine the pron to the right order
			// but do not change the splittedPronCopy, for using later
			subNewPron := make([]pronCreator_C12, len(splittedPronCopy))
			copy(subNewPron, splittedPronCopy)
			if len(splittedPronCopy[j].canChange) == 0 {
				continue
			}
			subNewPron[j].pron = createNewPron_C1(&splittedPronCopy[j])
			act = true

			sort.Slice(subNewPron, func(i, j int) bool {
				return subNewPron[i].idx < subNewPron[j].idx
			})

			i--

			subtr := ""
			subtr += combineKana(subNewPron)
			result = append(result, subtr)
			if i == 0 {
				break
			}
		}
		if !act {
			break
		}
	}

	for _, r := range result {
		fmt.Println(r)
	}

	return result, len(result) == 3
}

func createNewPron_C1(pc *pronCreator_C12) string {
	runePron := []rune(pc.pron)
	if len(pc.canChange) == 0 {
		return pc.pron
	}
	idx := pc.canChange[len(pc.canChange)-1]

	pc.canChange = pc.canChange[:len(pc.canChange)-1]

	if idx < 0 || idx >= len(runePron) {
		return pc.pron
	}

	result := ""
	for i, r := range runePron {
		if i == idx {
			result += createHanDaSokuon(r, pc.idx)
		} else {
			result += string(r)
		}
	}

	return result
}

func createHanDaSokuon(char rune, idx int) string {
	switch char {
	case 'あ', 'い', 'う', 'え', 'お', 'ん', 'っ':
		return ""
	}

	hasDakuten := false
	dc := norm.NFD.String(string(char))
	baseRunes := make([]rune, 0, len(dc))

	for _, r := range dc {
		if r == '\u3099' || r == '\u309A' {
			hasDakuten = true
			continue
		}
		baseRunes = append(baseRunes, r)
	}

	// If char already has dakuten/handakuten → return base form (NFC)
	if hasDakuten {
		return norm.NFC.String(string(baseRunes))
	}

	check := isCantDakuten_C12(char)
	if check {
		if idx == 0 || cannotAddSokuon(char) {
			return string(char) + string(pronounceTable[char])
		}

		if rand.Intn(2) == 0 {
			if isNRow(char) {
				return "ん" + string(char)
			}
			return "っ" + string(char)
		}
		return string(char) + string(pronounceTable[char])

	} else {
		change := rand.Intn(100)
		if isHRow(char) {
			if change == 0 {
				// Dakuten: は→ば
				return norm.NFC.String(string(char) + "\u3099")
			} else {
				// Handakuten: は→ぱ
				return norm.NFC.String(string(char) + "\u309A")
			}
		}

		if change%2 == 0 {
			// Add dakuten
			return norm.NFC.String(string(char) + "\u3099")
		}

		// if change == 1 → っ + char (only if idx > 0)
		if idx > 0 {
			if isNRow(char) {
				return "ん" + string(char)
			}
			return "っ" + string(char)
		}

		// idx == 0 → add dakuten dakuten
		return norm.NFC.String(string(char) + "\u3099")
	}
}

func isCantDakuten_C12(r rune) bool {
	switch r {
	case
		'な', 'に', 'ぬ', 'ね', 'の',
		'ま', 'み', 'む', 'め', 'も',
		'や', 'ゆ', 'よ',
		'ら', 'り', 'る', 'れ', 'ろ',
		'わ', 'を',
		'ん', 'っ', 'ゃ', 'ゅ', 'ょ':
		return true
	}
	return false
}

func isHRow(r rune) bool {
	return r == 'は' || r == 'ひ' || r == 'ふ' || r == 'へ' || r == 'ほ'
}

func isNRow(r rune) bool {
	return r == 'な' || r == 'に' || r == 'ぬ' || r == 'ね' || r == 'の'
}

func splitKana_C12(pron string) []pronCreator_C12 {
	runes := []rune(pron)
	n := len(runes)

	disallowed := map[rune]bool{
		'ゃ': true, 'ゅ': true, 'ょ': true,
		'っ': true,
		'あ': true, 'い': true, 'う': true, 'え': true, 'お': true,
		'ん': true,
		'わ': true, 'を': true,
	}

	result := []string{}
	cur := ""

	for i := 0; i < n; i++ {
		cur += string(runes[i])

		if i == n-1 {
			result = append(result, cur)
			break
		}

		if disallowed[runes[i+1]] {
			continue
		}

		result = append(result, cur)
		cur = ""
	}

	pronList := make([]pronCreator_C12, 0, len(result))
	for i := 0; i < len(result); i++ {
		subResult := []rune(result[i])
		if len(subResult) == 1 {
			pronList = append(pronList, pronCreator_C12{
				pron:      result[i],
				canChange: []int{0},
				idx:       i,
			})
		} else if len(subResult) == 2 {
			first := subResult[0]
			second := subResult[1]
			switch second {
			case 'ん':
				pronList = append(pronList, pronCreator_C12{
					pron:      result[i],
					canChange: []int{0, 1, 0},
					idx:       i,
				})
			case 'ゃ', 'ゅ', 'ょ':
				can := []int{0, 0, 1}

				// nếu ký tự đầu không thể dakuten thì remove 0 thứ hai
				// còn lại: {0,1}
				if !isCantDakuten_C12(first) {
					can = []int{0, 1}
				}

				pronList = append(pronList, pronCreator_C12{
					pron:      result[i],
					canChange: can,
					idx:       i,
				})
			default:
				pronList = append(pronList, pronCreator_C12{
					pron:      result[i],
					canChange: []int{0, 0, 1},
					idx:       i,
				})
			}

		} else if len(subResult) == 3 {
			pronList = append(pronList, pronCreator_C12{
				pron:      result[i],
				canChange: []int{1, 0, 0, 2},
				idx:       i,
			})

		} else {
			pronList = append(pronList, pronCreator_C12{
				pron:      result[i],
				canChange: []int{1, 2, 0, 0, 3},
				idx:       i,
			})
		}
	}
	return pronList
}

func combineKana(parts []pronCreator_C12) string {
	result := ""
	for _, str := range parts {
		result += str.pron
	}
	return result
}

func cannotAddSokuon(char rune) bool {
	switch char {

	case 'あ', 'い', 'う', 'え', 'お',
		'や', 'ゆ', 'よ',

		'わ', 'を', 'ん',

		'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ',
		'ゃ', 'ゅ', 'ょ',
		'ゎ',
		'っ',

		'ら', 'り', 'る', 'れ', 'ろ',

		'は', 'ひ', 'ふ', 'へ', 'ほ':
		return true
	}
	return false
}

// ================== METHOD 2: Choose 2 pron each turn ==================

func CreatePronounce_C2(pron string) ([]string, bool) {
	//CreateProTable()
	splittedPronCopy := splitKana_C12(pron)
	n := 0
	for _, p := range splittedPronCopy {
		n += len(p.canChange)
	}

	fmt.Println("Length of splittedPronCopy", n)
	if n < 4 {
		return nil, false
	}
	n = len(splittedPronCopy)
	if n > 4 {
		return nil, false
	}

	result := []string{}
	used := make(map[int][]int) // pos1 → list pos2 used

	for t := 0; t < 3; t++ {

		// Copy list gốc
		temp := make([]pronCreator_C12, n)
		for i := 0; i < n; i++ {
			temp[i] = pronCreator_C12{
				pron:      splittedPronCopy[i].pron,
				canChange: append([]int{}, splittedPronCopy[i].canChange...),
				idx:       splittedPronCopy[i].idx,
			}
		}

		found := false
		var pos1, pos2 int

		// ======= find pos1 usable (max 10 times) =======
		for try1 := 0; try1 < 20 && !found; try1++ {

			pos1 = rand.Intn(n)

			// ======= find pos2 usable (max 10 times) =======
			for try2 := 0; try2 < 20; try2++ {

				pos2 = rand.Intn(n)
				if pos2 == pos1 {
					continue
				}

				// // chech pos2
				// if contains(used[pos1], pos2) {
				// 	continue
				// }

				// pos2 not in pos1 used
				found = true
				break
			}
		}

		if !found {
			return nil, false
		}

		used[pos1] = append(used[pos1], pos2)

		temp[pos1].pron = createNewPron_C2(temp[pos1])
		temp[pos2].pron = createNewPron_C2(temp[pos2])

		sort.Slice(temp, func(a, b int) bool { return temp[a].idx < temp[b].idx })
		result = append(result, combineKana(temp))
	}

	return result, true
}

func createNewPron_C2(pc pronCreator_C12) string {
	runes := []rune(pc.pron)

	if len(pc.canChange) == 0 {
		return pc.pron
	}

	randIdx := pc.canChange[rand.Intn(len(pc.canChange))]

	if randIdx < 0 || randIdx >= len(runes) {
		return pc.pron
	}

	res := ""
	for i, r := range runes {
		if i == randIdx {
			res += createHanDaSokuon(r, pc.idx)
		} else {
			res += string(r)
		}
	}

	return res
}

// ============= METHOD 3 =========

func CreatePronounce_C3(pron string) ([]string, bool) {
	result := make([]string, 0, 3)

	splittedPron := splitKana_C3(pron)
	splittedPronCopy := make([]pronCreator_C3, len(splittedPron))
	copy(splittedPronCopy, splittedPron)
	n := 0
	for _, s := range splittedPron {
		if s.priority == 100 {
			n++
		}
	}

	if len(splittedPronCopy) < 3 || (len(splittedPron)-n) < 2 {
		return nil, false
	}
	sort.Slice(splittedPronCopy, func(i, j int) bool {
		if splittedPronCopy[i].priority != splittedPronCopy[j].priority {
			return splittedPronCopy[i].priority < splittedPronCopy[j].priority
		}
		return splittedPronCopy[i].index < splittedPronCopy[j].index
	})

	choosenPron := make([]pronCreator_C3, 0, 2)
	choosenPron = append(choosenPron, splittedPronCopy[0])
	for i, s := range splittedPronCopy {
		if i == 0 || s.priority == 100 {
			continue
		}
		if s.priority > 0 {
			choosenPron = append(choosenPron, s)
			break
		}
	}

	var resultPron = func(
		first bool,
		second bool,
		splittedPron []pronCreator_C3,
		choosenPron []pronCreator_C3,
	) string {

		result := ""

		for _, r := range splittedPron {
			if first && r.pron == choosenPron[0].pron {
				result += createNewPron_C3(r)
			} else if second && r.pron == choosenPron[1].pron {
				result += createNewPron_C3(r)
			} else {
				result += string(r.pron)
			}
		}

		return result
	}

	result = append(result, resultPron(true, true, splittedPron, choosenPron))
	result = append(result, resultPron(false, true, splittedPron, choosenPron))
	result = append(result, resultPron(true, false, splittedPron, choosenPron))

	return result, true
}

func createNewPron_C3(pron pronCreator_C3) string {
	pronBase := string(pron.pron)

	switch pron.priority {
	case 0:
		if pron.pron == 'っ' {
			return ""
		}
		return "っ" + pronBase
	case 1:
		return pronBase + "う"
	case 2:
		return transformDakuten_C3(pronBase)
	case 4:
		switch pronBase {
		case "ょ":
			return "よ"
		case "ゅ":
			return "ゆ"
		case "ゃ":
			return "や"
		default:
			return pronBase
		}
	case 3:
		return ""
	default:
		return pronBase
	}
}

func transformDakuten_C3(pron string) string {
	dakutenRune := rune('\u3099')    // ゛
	handakutenRune := rune('\u309A') // ゜

	nfd := norm.NFD.String(pron)

	hasDakuten := false
	hasHandakuten := false
	var baseChar rune

	// Detect marks and extract base character
	for _, r := range nfd {
		switch r {
		case dakutenRune:
			hasDakuten = true
		case handakutenRune:
			hasHandakuten = true
		default:
			baseChar = r
		}
	}

	if hasHandakuten {
		return norm.NFC.String(string(baseChar) + string(dakutenRune))
	}
	if hasDakuten {
		switch baseChar {
		case 'は', 'ひ', 'ふ', 'へ', 'ほ':
			return norm.NFC.String(string(baseChar) + string(handakutenRune))
		default:
			return norm.NFC.String(string(baseChar))
		}
	}
	return norm.NFC.String(string(baseChar) + string(dakutenRune))
}

func splitKana_C3(pron string) []pronCreator_C3 {
	splitted := make([]pronCreator_C3, 0, 4)
	runes := []rune(pron)

	for i, r := range runes {
		var next, prev rune

		if i == 0 {
			prev = rune(0)
		} else {
			prev = runes[i-1]
		}
		if i == len(runes)-1 {
			next = rune(0)
		} else {
			next = runes[i+1]
		}

		vowel := pronCreator_C3{
			pron:     r,
			priority: changeType(r, next, prev),
			index:    i,
		}
		splitted = append(splitted, vowel)
	}

	return splitted
}

func changeType(r rune, next rune, prev rune) int {
	vowels := "あいうえお"
	smallY := "ゃゅょ"

	// dakuten and handakuten bases
	sokuonBase := "かきくけこたてと"
	dakutenBase := "かきくけこさしすせそたてとはひふへほがぎぐげござじずぜぞだでどばびぶべぼ"
	handakutenBase := "はひふへほぱぴぷぺぽ"

	// O-column (お段)
	oColumn := "おこごそぞとどのほぼぽもよょゆくふゅ"

	// inline containsRune
	contains := func(s string, r rune) bool {
		for _, v := range s {
			if v == r {
				return true
			}
		}
		return false
	}

	// --- RULES ---

	// 2: can add dakuten
	// 0: can add sokuon (needs dakuten capability and pre not empty)
	if contains(sokuonBase, r) && prev != 0 && prev != 'つ' && prev != 'っ' && prev != 'ん' {
		return 0
	}

	if r == 'っ' {
		return 0
	}

	// Type B: O-column vowel behavior
	if contains(oColumn, r) && next == 0 {
		return 1
	}

	if contains(dakutenBase, r) {
		return 2
	}

	// 3: can add handakuten
	if contains(handakutenBase, r) {
		return 2
	}

	// 4: can become bigger (small → big)
	if contains(smallY, r) {
		return 4
	}

	// 5: can disappear (あいうえお)
	if contains(vowels, r) && prev != 0 {
		return 3
	}

	// nothing matches
	return 100
}
