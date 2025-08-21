using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using SettlyModels;

public class SettlyDbContextFactory : IDesignTimeDbContextFactory<SettlyDbContext>
{
    public SettlyDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = config["ConnectionStrings:DefaultConnection"];
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