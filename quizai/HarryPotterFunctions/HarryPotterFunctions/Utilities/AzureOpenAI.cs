using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace HarryPotterFunctions.Utilities
{
    public class AzureOpenAi
    {

        private readonly string apiKey;
        private readonly string endpoint;
        private readonly string promt = $"You are a quiz bot that provide question for wizards in the harry potter universe, You must provde a question and three awnser where the questions and awnseres are a bit long, make the awnsers as difficult to awnser like microsoft sertification questions, also add the awnser in the reponse json";

        public AzureOpenAi()
        {
            apiKey = Environment.GetEnvironmentVariable("OpenAiSubscriptionKey", EnvironmentVariableTarget.Process);
            endpoint = Environment.GetEnvironmentVariable("OpenAiEndpoint", EnvironmentVariableTarget.Process);
        }

        //TODO: Add more exception handling
        public async Task<OpenAiResponse> AIGenerateHarryPotterQuiz(string text)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("api-key", apiKey);
                var payload = new
                {
                    messages = new object[]
                    {
                        new
                        {
                            role = "system",
                            content = new object[] {
                                new
                                {
                                    type = "text",
                                    text = promt
                                }
                            }
                        },
                        new
                        {
                            role = "user",
                            content = new object[] {
                                new
                                {
                                    type = "text",
                                    text = text
                                }
                            }
                        }
                    },
                    response_format = new
                    {
                        type = "json_schema",
                        json_schema = new
                        {
                            name = "extracted_data",
                            schema = new
                            {
                                type = "object",
                                properties = new
                                {
                                    Questions = new
                                    {
                                        type = "array",
                                        items = new
                                        {
                                            type = "object",
                                            properties = new
                                            {
                                                QuestionText = new
                                                {
                                                    type = "string"
                                                },
                                                AwnserOptionA = new
                                                {
                                                    type = "string"
                                                },
                                                AwnserOptionB = new
                                                {
                                                    type = "string"
                                                },
                                                AwnserOptionC = new
                                                {
                                                    type = "string"
                                                },
                                                CorrectAwnswerLetter =new
                                                {
                                                    type = "string"
                                                }
                                            },
                                            required = new[] { "QuestionText", "AwnserOptionA", "AwnserOptionB", "AwnserOptionC", "CorrectAwnswerLetter" }
                                        }
                                    }
                                },
                                required = new[] { "Questions" },
                                additionalProperties = false
                            },

                        }
                    },

                    temperature = 0.7,
                    top_p = 0.95,
                    max_tokens = 4000,
                    stream = false,

                };


                try
                {
                    var response = await httpClient.PostAsync(endpoint, new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json"));

                    if (response.IsSuccessStatusCode)
                    {
                        var reponse = JsonConvert.DeserializeObject<ResponseModel>(await response.Content.ReadAsStringAsync());


                        return JsonConvert.DeserializeObject<OpenAiResponse>(reponse.choices[0].Message.content);
                    }
                    else
                    {

                        throw new Exception($"Failed to read document with open ai: {(int)response.StatusCode}, response: {await response.Content.ReadAsStringAsync()}");
                    }
                }
                catch (Exception e)
                {
                    throw new Exception("Failed to read document with open ai", e);
                }
            }
        }

        #region OpenAiResponse
        public class ResponseModel
        {
            public Choices[] choices { get; set; }
        }

        public class Choices
        {
            public string finish_reason { get; set; }
            public string index { get; set; }
            public Message Message { get; set; }
        }

        public class Message
        {
            public string role { get; set; }
            public string content { get; set; }
        }
        #endregion

        #region CustomJsonResponse
        public class OpenAiResponse
        {
            public List<Question> Questions { get; set; }
        }

        public class Question
        {
            public string QuestionText { get; set; }
            public string AwnserOptionA { get; set; }
            public string AwnserOptionB { get; set; }
            public string AwnserOptionC { get; set; }
            public string CorrectAwnswerLetter { get; set; }
        }
        #endregion
    }
}
