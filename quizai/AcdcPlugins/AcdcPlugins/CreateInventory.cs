using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcdcPlugins
{
    public class CreateInventory : IPlugin
    {
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

                if(entity.TryGetAttributeValue<EntityReference>("new_contactid", out var contactRef))
                {

                    var inventory = new Entity("new_inventory");
                    inventory["new_contactid"] = contactRef;
                    inventory["new_challengeid"] = entity.ToEntityReference();
                    service.Create(inventory);

                };
                

            }

        }
    }
}
