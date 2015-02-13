using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using Domain;
using DataAccess;

namespace Service
{
	[ServiceContract]
	public interface IRecipeService
	{
		[OperationContract]
		IEnumerable<Recipe> FindAllRecipes();
	}
}
