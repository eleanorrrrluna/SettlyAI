using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SettlyModels;

namespace SettlyApi
{
    public class SettlyDbContextFactory : IDesignTimeDbContextFactory<SettlyDbContext>
    {
        public SettlyDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();

            var connectionString = config["ConnectionStrings__DefaultConnection"];
            if (string.IsNullOrEmpty(connectionString))
                throw new InvalidOperationException("Missing environment variable: ConnectionStrings__DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<SettlyDbContext>();
            optionsBuilder
                .UseNpgsql(connectionString)
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()
                .LogTo(Console.WriteLine);

            return new SettlyDbContext(optionsBuilder.Options);
        }
    }
}