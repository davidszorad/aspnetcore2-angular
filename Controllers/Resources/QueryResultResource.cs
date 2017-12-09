using System.Collections.Generic;

namespace veganew.Controllers.Resources
{
    public class QueryResultResource<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalItems { get; set; }
    }
}