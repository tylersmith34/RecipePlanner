using Domain;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
	public class RecipeDao
	{
		private static RecipeDao instance;
		private SqlConnection connection;

		public static RecipeDao getInstance()
		{
			if (instance == null)
			{
				instance = new RecipeDao();
				instance.connection = DataSourceFactory.getInstance().getDefaultConnection();
			}
			return instance;
		}

		public IEnumerable<Recipe> FindAllRecipes()
		{
			List<Recipe> recipes = new List<Recipe>();
			String sql = "SELECT id, name, description FROM Recipe";

			if (connection.State == System.Data.ConnectionState.Closed)
			{
				connection.Open();
			}

			SqlCommand command = new SqlCommand(sql, connection);
			var reader = command.ExecuteReader();

			if (reader.HasRows)
			{
				while (reader.Read())
				{
					var recipe = new Recipe();
					recipe.Name = reader.GetString(1);
					recipe.Id = reader.GetInt32(0);
					recipe.Description = reader.GetString(2);
					recipes.Add(recipe);
				}
				reader.Close();
			}

			return recipes;
		}
	}
}
