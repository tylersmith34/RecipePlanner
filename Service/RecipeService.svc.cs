using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using DataAccess;
using Domain;

namespace Service
{
	public class RecipeService : IRecipeService
	{
		private RecipeDao _recipeDao = RecipeDao.getInstance();

		public IEnumerable<Recipe> FindAllRecipes()
		{
			return _recipeDao.FindAllRecipes();
		}
	}
}
