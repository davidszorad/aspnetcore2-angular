using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace veganew.Controllers.Resources
{
    public class MakeResource
    {
        public ICollection<KeyValuePairResource> Models { get; set; }

        public MakeResource()
        {
            Models = new Collection<KeyValuePairResource>();
        }
    }
}