using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using veganew.Core;
using veganew.Core.Models;

namespace veganew.Persistance
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;
        public VehicleRepository(VegaDbContext context)
        {
            this.context = context;
        }

        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
        {
            if (!includeRelated)
            {
                return await context.Vehicles.FindAsync(id);
            }
            
            return await context.Vehicles
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .SingleOrDefaultAsync(v => v.Id == id);
        }

        public async Task<IEnumerable<Vehicle>> GetVehicles(VehicleQuery queryObj)
        {
            var query = context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .AsQueryable();
            
            if (queryObj.MakeId.HasValue) 
            {
                query = query.Where(v => v.Model.MakeId == queryObj.MakeId.Value);
            }

            if (queryObj.ModelId.HasValue) 
            {
                query = query.Where(v => v.ModelId == queryObj.ModelId.Value);
            }

            // var columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>>();
            // columnsMap.Add("make", v => v.Model.Make.Name);
            // columnsMap.Add("model", v => v.Model.Name);
            // columnsMap.Add("contactName", v => v.ContactName);
            // columnsMap.Add("id", v => v.Id);
            var columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>>() 
            {
                ["make"] = v => v.Model.Make.Name,
                ["model"] = v => v.Model.Name,
                ["contactName"] = v => v.ContactName,
                ["id"] = v => v.Id
            };

            query = ApplyOrdering(queryObj, query, columnsMap);

            return await query.ToListAsync();
        }

        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        }

        public void Remove(Vehicle vehicle)
        {
            context.Remove(vehicle);
        }

        private IQueryable<Vehicle> ApplyOrdering(VehicleQuery queryObj, IQueryable<Vehicle> query, Dictionary<string, Expression<Func<Vehicle, object>>> columnsMap)
        {
            if (queryObj.IsSortAscending)
                return query.OrderBy(columnsMap[queryObj.SortBy]);
            else
                return query.OrderByDescending(columnsMap[queryObj.SortBy]);

            // if (queryObj.SortBy == "make") {
            //     query = (queryObj.IsSortAscending) ? query.OrderBy(v => v.Model.Make.Name) : query.OrderByDescending(v => v.Model.Make.Name);
            // }
            // if (queryObj.SortBy == "model") {
            //     query = (queryObj.IsSortAscending) ? query.OrderBy(v => v.Model.Name) : query.OrderByDescending(v => v.Model.Name);
            // }
            // if (queryObj.SortBy == "contactName") {
            //     query = (queryObj.IsSortAscending) ? query.OrderBy(v => v.ContactName) : query.OrderByDescending(v => v.ContactName);
            // }
            // if (queryObj.SortBy == "id") {
            //     query = (queryObj.IsSortAscending) ? query.OrderBy(v => v.Id) : query.OrderByDescending(v => v.Id);
            // }
        }
    }
}