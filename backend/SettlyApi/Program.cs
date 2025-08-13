using System.Text;
using ISettlyService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SettlyModels;
using SettlyService;

namespace SettlyApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var apiConfigs = builder.Configuration.GetSection("ApiConfigs").Get<ApiConfigs>();
        builder.Services.AddDbContext<SettlyDbContext>(
            options => options
                .UseNpgsql(apiConfigs?.DBConnection ?? throw new InvalidOperationException("Database connection string not found"))
                // The following three options help with debugging, but should
                // be changed or removed for production.
                .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()
        );


        //Register ISearchApi with SearchApiService
        builder.Services.AddScoped<ISettlyService.ISearchService, SettlyService.SearchService>();

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddScoped<ISuburbReportService, SuburbReportService>();
        builder.Services.AddScoped<IPropertyDetailService, PropertyDetailService>();
        builder.Services.AddScoped<IFavouriteService, FavouriteService>();
        builder.Services.AddTransient<IPopulationSupplyService, PopulationSupplyService>();
        builder.Services.AddTransient<ICreateTokenService, CreateTokenService>();
        builder.Services.AddScoped<ILoginService, LoginService>();


        // JWT configration
        builder.Services.Configure<JWTConfig>(builder.Configuration.GetSection(JWTConfig.Section));
        var jwtConfig = builder.Configuration.GetSection(JWTConfig.Section).Get<JWTConfig>();
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtConfig.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwtConfig.Audience,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey))
                };
            });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseRouting();
        app.UseAuthorization();
        app.MapControllers();

        Console.WriteLine("Starting SettlyAI API server...");
        app.Run();
    }
}
