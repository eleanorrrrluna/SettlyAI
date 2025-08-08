using System.Text;
using ISettlyService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddScoped<ISuburbReportService, SuburbReportService>();
        builder.Services.AddTransient<ICreateTokenService, CreateTokenService>();
        builder.Services.AddScoped<ILoginService, LoginService>();
        builder.Services.AddTransient<IPopulationSupplyService, PopulationSupplyService>();

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
        app.UseAuthorization();
        app.MapControllers();

        Console.WriteLine("Starting SettlyAI API server...");
        app.Run();
    }
}
