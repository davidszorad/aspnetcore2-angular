using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using veganew.Controllers.Resources;
using veganew.Core;
using veganew.Core.Models;

namespace veganew.Controllers
{
    [Route("/api/vehicles")]
    public class VehiclesController : Controller
    {
        private readonly IMapper mapper;
        private readonly IVehicleRepository repository;
        private readonly IUnitOfWork unitOfWork;

        public VehiclesController(IMapper mapper, IVehicleRepository repository, IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await repository.GetVehicle(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            var vehicleResource = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(vehicleResource);
        }

        [HttpGet]
        public async Task<QueryResultResource <VehicleResource>> GetVehicles(VehicleQueryResource filterResource) 
        {
            var filter = mapper.Map<VehicleQueryResource, VehicleQuery>(filterResource);
            var queryResult = await repository.GetVehicles(filter);
            return mapper.Map<QueryResult<Vehicle>, QueryResultResource<VehicleResource>>(queryResult);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
        {
            // throw new Exception();
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            /* endpoint should know - we don't have to do this extra work
            var model = await context.Models.FindAsync(vehicleResource.ModelId);
            if (model == null)
            {
                ModelState.AddModelError("ModelId", "Invalid Model ID"); // or show internal server error
                return BadRequest(ModelState);
            }
            */

            var vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdate = DateTime.Now;

            repository.Add(vehicle);
            await unitOfWork.CompleteAsync();


            /*
            // we don't need to assign it to vehicle.Model -> EF will do that internally once it is loaded into memory
            await context.Models.Include(m => m.Make).SingleOrDefaultAsync(m => m.Id == vehicle.ModelId);
            */
            vehicle = await repository.GetVehicle(vehicle.Id);

            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vehicle = await repository.GetVehicle(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);  // vehicle is destination
            vehicle.LastUpdate = DateTime.Now;

            await unitOfWork.CompleteAsync();

            /*
            we need to fetch the complete vehicle object from the DB before mapping
            because we had only resource object that we now want to  map again to 
            resource object and we worked only with foreign key properties.

            if I change the model ID from 1 to 2 the related model object is not in the context
            */
            vehicle = await repository.GetVehicle(vehicle.Id);
            var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await repository.GetVehicle(id, includeRelated: false);

            if (vehicle == null)
            {
                return NotFound();
            }

            repository.Remove(vehicle);
            await unitOfWork.CompleteAsync();

            return Ok(id);
        }
    }
}