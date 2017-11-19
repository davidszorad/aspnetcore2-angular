using Microsoft.EntityFrameworkCore;
using veganew.Core.Models;

namespace veganew.Persistance
{
    public class VegaDbContext : DbContext
    {
        public DbSet<Make> Makes { get; set; }  // EF will figure out that it need to create Model as well with navigation property in Make class
        public DbSet<Feature> Features { get; set; }
        public DbSet<Model> Models { get; set; } // we had to add model becasue we want to directly access it from the context
        public DbSet<Vehicle> Vehicles { get; set; }
        
        public VegaDbContext(DbContextOptions<VegaDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VehicleFeature>().HasKey(vf => 
                new { vf.VehicleId, vf.FeatureId } // [new anonymous object] key for this entity has these two properties -> composite primary key
            );
        }
    }
}