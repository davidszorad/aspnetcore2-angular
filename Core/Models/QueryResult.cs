using System.Collections.Generic;

namespace veganew.Core.Models
{
    public class QueryResult<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalItems { get; set; }
    }
}