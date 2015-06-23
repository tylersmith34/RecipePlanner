﻿using System;
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
		[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "recipes")]
		IList<Recipe> FindAllRecipes();

		[OperationContract]
		[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "tags")]
		IList<Tag> FindAllTags();

		[OperationContract]
		[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "ping")]
		String Ping();
	}
}
