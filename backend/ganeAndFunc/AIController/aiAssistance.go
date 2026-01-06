package aicontroller

import (
	"context"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
)

type AI struct{}

func NewAI() *AI {
	return &AI{}
}

func (*AI) AskAI(prompt string) string {
	client := openai.NewClient(
		option.WithAPIKey("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"), // defaults to os.LookupEnv("OPENAI_API_KEY")
	)
	chatCompletion, err := client.Chat.Completions.New(context.TODO(), openai.ChatCompletionNewParams{
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage(prompt),
		},
		Model: openai.ChatModelGPT4oMini,
	})
	if err != nil {
		return "Can not response"
	}

	return chatCompletion.Choices[0].Message.Content
}
