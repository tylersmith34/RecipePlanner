using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
	public class DataSourceFactory
	{
		private static DataSourceFactory instance;
		private SqlConnection conn;

		public static DataSourceFactory getInstance()
		{
			if (instance == null)
			{
				instance = new DataSourceFactory();
				instance.conn = new SqlConnection(ConfigurationManager.ConnectionStrings["LocalDatabase"].ConnectionString);
			}
			return instance;
		}

		public SqlConnection getDefaultConnection()
		{
			return conn;
		}
	}
}
