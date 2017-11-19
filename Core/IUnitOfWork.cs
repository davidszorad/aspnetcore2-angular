using System.Threading.Tasks;

namespace veganew.Core
{
    public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}