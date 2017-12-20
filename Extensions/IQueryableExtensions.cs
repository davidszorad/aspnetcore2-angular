using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using veganew.Core.Models;

namespace veganew.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<Vehicle> ApplyFiltering(this IQueryable<Vehicle> query, VehicleQuery queryObj)
        {
            if (queryObj.MakeId.HasValue) 
                query = query.Where(v => v.Model.MakeId == queryObj.MakeId.Value);

            if (queryObj.ModelId.HasValue) 
                query = query.Where(v => v.ModelId == queryObj.ModelId.Value);
            
            return query;
        }

        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, IQueryObject queryObj, Dictionary<string, Expression<Func<T, object>>> columnsMap)
        {
            if (String.IsNullOrWhiteSpace(queryObj.SortBy) || !columnsMap.ContainsKey(queryObj.SortBy))
                return query;
            
            if (queryObj.IsSortAscending)
                return query.OrderBy(columnsMap[queryObj.SortBy]);
            else
                return query.OrderByDescending(columnsMap[queryObj.SortBy]);
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, IQueryObject queryObj)
        {
            if (queryObj.Page <= 0)
                queryObj.Page = 1;
            
            if (queryObj.PageSize <= 0)
                queryObj.PageSize = 10;
            
            return query.Skip((queryObj.Page - 1) * queryObj.PageSize).Take(queryObj.PageSize);  // Paging is done in SQL server not in memory
        }
    }
}