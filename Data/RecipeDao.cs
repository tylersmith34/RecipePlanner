using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using Domain;

namespace DataAccess
{
	public class RecipeDao
	{
		private static RecipeDao instance;

		public static RecipeDao getInstance()
		{
			if (instance == null)
			{
				instance = new RecipeDao();
			}
			return instance;
		}

		private String FindDataSourceEnvironment()
		{
			var environment = Environment.GetEnvironmentVariable("DataSourceEnv", EnvironmentVariableTarget.Machine);
			if (environment == null)
			{
				return "local";
			}
			else
			{
				return environment;
			}
		}

		private List<Tag> FindTagsForRecipe(int recipeId)
		{
			String sql = "SELECT T.Id, T.Name " +
			" FROM RecipeTagS RT " +
			" JOIN Tag T on RT.TagId = T.Id " +
			" WHERE RT.RecipeId = @recipeId ";

			List<Tag> tags = new List<Tag>();

			using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings[FindDataSourceEnvironment()].ConnectionString))
			using (SqlCommand command = new SqlCommand(sql, connection))
			{
				connection.Open();
				command.Parameters.Add("@recipeId", recipeId.ToString());
				var reader = command.ExecuteReader();
				if (reader.HasRows)
				{
					while (reader.Read())
					{
						tags.Add(new Tag { Id = reader.GetInt32(0), Name = reader.GetString(1) });
					}
					reader.Close();
				}
			}
			return tags;
		}

		public List<Recipe> FindAllRecipes()
		{
			String sql = "SELECT Id, Name, Description FROM Recipe";

			List<Recipe> recipes = new List<Recipe>();

			using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings[FindDataSourceEnvironment()].ConnectionString))
			using (SqlCommand command = new SqlCommand(sql, connection))
			{
				connection.Open();
				var reader = command.ExecuteReader();
				if (reader.HasRows)
				{
					while (reader.Read())
					{
						recipes.Add(new Recipe { Id = reader.GetInt32(0), Name = reader.GetString(1), Description = reader.GetString(2) });
					}
					reader.Close();
				}
			}

			foreach (Recipe recipe in recipes)
			{
				recipe.Tags = FindTagsForRecipe(recipe.Id);
			}

			return recipes;
		}

		public List<Tag> FindAllTags()
		{
			String sql = "SELECT Id, Name FROM Tag";

			List<Tag> tags = new List<Tag>();

			using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings[FindDataSourceEnvironment()].ConnectionString))
			using (SqlCommand command = new SqlCommand(sql, connection))
			{
				connection.Open();
				var reader = command.ExecuteReader();
				if (reader.HasRows)
				{
					while (reader.Read())
					{
						tags.Add(new Tag { Id = reader.GetInt32(0), Name = reader.GetString(1) });
					}
					reader.Close();
				}
			}
			return tags;
		}

		public virtual void UpdateRecipeName(int id, string newValue)
		{
			String sql = "UPDATE Recipe Set Name = @newValue WHERE Id = @recipeId ";

			List<Tag> tags = new List<Tag>();

			//using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings[FindDataSourceEnvironment()].ConnectionString))
			//using (SqlCommand command = new SqlCommand(sql, connection))
			//{
			//	connection.Open();
			//	command.Parameters.Add("@newValue", newValue);
			//	command.Parameters.Add("@recipeId", id);

			//	command.Execute();
			//}
		}

		public virtual void UpdateRecipeDescription(int id, string newValue)
		{

		}
	}
}