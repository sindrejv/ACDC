using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using HarryPotterFunctions.Utilities;

namespace HarryPotterFunctions
{
    public static class HarryPotterQuiz
    {
        [FunctionName("HarryPotterQuiz")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var openAi = new AzureOpenAi();

            var response = await openAi.AIGenerateHarryPotterQuiz("Give me questions");

            return new OkObjectResult(JsonConvert.SerializeObject(response));
        }
    }
}
