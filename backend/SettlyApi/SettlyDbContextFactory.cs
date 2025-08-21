public class SettlyDbContextFactory : IDesignTimeDbContextFactory<SettlyDbContext>
{
    public SettlyDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory()) // 👈 关键：指定 base path
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = config["ConnectionStrings:DefaultConnection"]; // 注意这里是冒号
        if (string.IsNullOrEmpty(connectionString))
            throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection");

        var optionsBuilder = new DbContextOptionsBuilder<SettlyDbContext>();
        optionsBuilder
            .UseNpgsql(connectionString)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors()
            .LogTo(Console.WriteLine);

        return new SettlyDbContext(optionsBuilder.Options);
    }
}