using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace veganew.Controllers.Resources
{
    public class MakeResource : KeyValuePairResource  // by deriving it from KeyValuePair we get Id and Name properties -> DRY
    {
        public ICollection<KeyValuePairResource> Models { get; set; }

        public MakeResource()
        {
            Models = new Collection<KeyValuePairResource>();
        }
    }
}