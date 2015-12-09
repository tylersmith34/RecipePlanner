using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using DataAccess;
using Domain;
using Newtonsoft.Json;

namespace Service
{
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
	public class RecipeService : IRecipeService
	{
		private RecipeDao _recipeDao = RecipeDao.getInstance();

		public RecipeDao RecipeDao
		{
			get { return _recipeDao; }
			set { _recipeDao = value; }
		}

		public IList<Recipe> FindAllRecipes()
		{
			return RecipeDao.FindAllRecipes();
		}

		public IList<Tag> FindAllTags()
		{
			return RecipeDao.FindAllTags();
		}

		public String Ping()
		{
			return "Alive";
		}

		public HttpStatusCode UpdateRecipe(int id, string data)
		{
			Recipe recipe = JsonConvert.DeserializeObject<Recipe>(data);

			if (recipe.Name != null)
			{
				RecipeDao.UpdateRecipeName(id, recipe.Name);
			}
			if (recipe.Description != null)
			{
				RecipeDao.UpdateRecipeDescription(id, recipe.Description);
			}

			return new HttpStatusCode();
		}
	}
}
