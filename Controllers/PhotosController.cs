using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using veganew.Controllers.Resources;
using veganew.Core;
using veganew.Core.Models;

namespace veganew.Controllers
{
    // UPLOAD: api/vehicles/1/photos
    // DELETE: api/vehicles/1/photos/1
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        // private readonly int MAX_BYTES = 1 * 1024 * 1024; // 10 MB
        // private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpeg", ".jpg", ".png" };
        
        private readonly IHostingEnvironment host;
        private readonly IPhotoService photoService;
        private readonly IVehicleRepository vehicleRepository;
        private readonly IPhotoRepository photoRepository;
        private readonly IMapper mapper;
        private readonly PhotoSettings photoSettings;
        public PhotosController(
            IHostingEnvironment host,
            IPhotoService photoService,
            IVehicleRepository vehicleRepository,
            IPhotoRepository photoRepository,
            IMapper mapper,
            IOptionsSnapshot<PhotoSettings> options)
        {
            this.mapper = mapper;
            this.vehicleRepository = vehicleRepository;
            this.photoRepository = photoRepository;
            this.host = host;
            this.photoService = photoService;
            this.photoSettings = options.Value;
        }

        public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
        {
            var photos = await photoRepository.GetPhotos(vehicleId);

            return mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoResource>>(photos);
        }
        
        [HttpPost]
        [RequestSizeLimit(100_000_000)] //default 30 MB (~28.6 MiB) max request body size limit -- https://github.com/aspnet/Announcements/issues/267
        public async Task<IActionResult> Upload(int vehicleId, IFormFile file) // for multiple files IFromCollection
        {
            var vehicle = await vehicleRepository.GetVehicle(vehicleId, includeRelated: false);
            if (vehicle == null)
                return NotFound();

            if (file == null) return BadRequest("Null file");
            if (file.Length == 0) return BadRequest("Empty file");
            if (file.Length > photoSettings.MaxBytes) return BadRequest("Maximum file size exceeded");
            if (!photoSettings.IsSupported(file.FileName)) return BadRequest("Invalid file type");

            var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads"); // wwwroot/uploads
            Photo photo = await photoService.UploadPhoto(vehicle, file, uploadsFolderPath);

            return Ok(mapper.Map<Photo, PhotoResource>(photo));
        }
    }
}