using System.Collections.Generic;
using System.Threading.Tasks;
using veganew.Core.Models;

namespace veganew.Core
{
    public interface IPhotoRepository
    {
         Task<IEnumerable<Photo>> GetPhotos(int vehicleId);
    }
}