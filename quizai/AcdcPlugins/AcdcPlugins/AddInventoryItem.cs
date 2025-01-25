using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace AcdcPlugins
{
    public class AddInventoryItem : IPlugin
    {

        /*
        List<string> ingredients = new List<string>()
        {
            "Billywig Wings", "Ashwinder Egg", "African Sea Salt", "Boom-slang Skin", "Knarl Quills", "Lacewing Flies", "Squill Bulb",
            "Strand of hair from Benedikt", "Strand of hair from Guro","Strand of hair from Johan", "Strand of hair from Johanne", "Strand of hair from Mikae",
            "Strand of hair from Scott"
        };
        */

        public static class RandomNumberGenerator
        {
            public static List<int> GenerateRandomNumbers()
            {
                Random random = new Random();
                List<int> randomNumbers = new List<int>();

                for (int i = 0; i < 3; i++)
                {
                    int number = random.Next(1, 6); // Generates a number between 1 (inclusive) and 6 (exclusive)
                    randomNumbers.Add(number);
                }

                return randomNumbers;
            }
        }


        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            tracingService.Trace($"[{nameof(CreateInventory)}] Is running...");
            tracingService.Trace($"[{nameof(CreateInventory)}] Message name: {context.MessageName}, contextStage: {context.Stage}");

            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity entity)
            {

                var moreData = service.Retrieve(entity.LogicalName, entity.Id, new ColumnSet(true));
                
                EntityReference contactRef = new EntityReference();

                if(moreData.TryGetAttributeValue<EntityReference>("new_contactid", out var contactid))
                {
                    contactRef = contactid;
                }


                QueryExpression query = new QueryExpression("new_ingredients")
                {
                    ColumnSet = new ColumnSet(true)
                };

                var allIngreadients = service.RetrieveMultiple(query);


                if (entity.TryGetAttributeValue<OptionSetValue>("new_stage", out var stageValue))
                {

                    if(stageValue.Value == 100000001)
                    {

                      


                        //0-7

                        /*
                        var randomList = RandomNumberGenerator.GenerateRandomNumbers();

                        foreach (var number in randomList)
                        {

                            int rand = new Random().Next(0, 5);

                            var ingredientsRef = new EntityReference("new_ingredients")
                            {
                                Id = allIngreadients.Entities.First(x => x["new_name"] == ingredients[rand]).Id
                            };

                            var newInventoryItem = new Entity("new_inventory");
                            newInventoryItem["new_ingredientid"]  

                        }
                        */

                    }

                    if (stageValue.Value == 100000002) //Flying
                    {
                        var invEntity = new Entity("new_inventory");
                        invEntity["new_contactid"] = contactRef;
                        invEntity["new_challengeid"] = entity.ToEntityReference();

                        var entityRefIngredients1 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("89a95337-8dd9-ef11-8eea-0022480852f6")
                        };


                        invEntity["new_ingredientid"] = entityRefIngredients1;
                        invEntity["new_quantity"] = 1;
                        service.Create(invEntity);

                        var entityRefIngredients2 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("90066fd1-8cd9-ef11-8eea-0022480852f6")
                        };


                        invEntity["new_ingredientid"] = entityRefIngredients2;
                        invEntity["new_quantity"] = 2;
                        service.Create(invEntity);

                        var entityRefIngredients3 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("4e45e7d8-8cd9-ef11-8eea-0022480852f6")
                        };

                        invEntity["new_ingredientid"] = entityRefIngredients3;
                        invEntity["new_quantity"] = 2;
                        service.Create(invEntity);

                        var entityRefIngredients4 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("ab9197e7-97da-ef11-8eea-0022480852f6")
                        };

                        invEntity["new_ingredientid"] = entityRefIngredients4;
                        invEntity["new_quantity"] = 1;
                        service.Create(invEntity);


                        var entityRefIngredients5 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("e7aa21e8-8cd9-ef11-8eea-0022480852f6")
                        };

                        invEntity["new_ingredientid"] = entityRefIngredients5;
                        invEntity["new_quantity"] = 1;
                        service.Create(invEntity);

                        var entityRefIngredients6 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("e16fd9bc-8cd9-ef11-8eea-0022480852f6")
                        };

                        invEntity["new_ingredientid"] = entityRefIngredients6;
                        invEntity["new_quantity"] = 1;
                        service.Create(invEntity);

                        var entityRefIngredients7 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("3071eefc-97da-ef11-8eea-0022480852f6")
                        };

                        invEntity["new_ingredientid"] = entityRefIngredients7;
                        invEntity["new_quantity"] = 1;
                        service.Create(invEntity);

                        var entityRefIngredients8 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("2b5f5f03-95d9-ef11-8eea-0022480852f6")
                        };

                        invEntity["new_ingredientid"] = entityRefIngredients8;
                        invEntity["new_quantity"] = 1;
                        service.Create(invEntity);

                        var entityRefIngredients9 = new EntityReference("new_ingredients")
                        {
                            Id = Guid.Parse("cff147c7-8cd9-ef11-8eea-0022480852f6")
                        };

                        invEntity["new_ingredientid"] = entityRefIngredients9;
                        invEntity["new_quantity"] = 1;
                        service.Create(invEntity);



                        //0-7
                    }

                    if (stageValue.Value == 100000004)//Questions
                    {
                        //0-7
                    }


                    /*
                    var inventory = new Entity("new_inventory");
                    inventory["new_contactid"] = contactRef;
                    inventory["new_challengeid"] = entity.ToEntityReference();
                    service.Create(inventory);
                    */
                };

            }




        }
    }
}
