using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using veganew.Core.Models;

namespace veganew.Core
{
    public interface IPhotoService
    {
        Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadsFolderPath); // IFormFile is tightly coupled to ASP.NET Core so we should create a new interface like IFile
    }
}