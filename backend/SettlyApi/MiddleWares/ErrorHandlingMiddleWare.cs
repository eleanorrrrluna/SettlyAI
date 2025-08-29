using System.Net;
using System.Text.Json;
using SettlyModels;

namespace SettlyApi.Middlewares;

/// <summary>
/// Middleware that catches all unhandled exceptions,
/// logs them, and returns a standardized error response.
/// </summary>
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Continue to the next middleware in the pipeline
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await HandleExceptionAsync(context, ex, _env);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex, IHostEnvironment env)
    {
        HttpStatusCode status;
        string message;

        switch (ex)
        {
            case AppException appEx:
                status = (HttpStatusCode)appEx.StatusCode;
                message = appEx.Message;
                break;

            case UnauthorizedAccessException:
                status = HttpStatusCode.Unauthorized;
                message = "Unauthorized access.";
                break;

            case ArgumentException:
                status = HttpStatusCode.BadRequest;
                message = "Invalid argument provided.";
                break;

            case KeyNotFoundException:
                status = HttpStatusCode.NotFound;
                message = "The requested resource was not found.";
                break;

            case InvalidOperationException:
                status = HttpStatusCode.Conflict;
                message = "The operation is invalid in the current state.";
                break;

            case TimeoutException:
                status = HttpStatusCode.RequestTimeout;
                message = "The request timed out.";
                break;

            default:
                status = HttpStatusCode.InternalServerError;
                message = "An unexpected error occurred.";
                break;
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var errorResponse = new ErrorResponse
        {
            Code = context.Response.StatusCode,
            Message = message,
            Detail = env.IsDevelopment() ? ex.ToString() : null, 
            TraceId = context.TraceIdentifier
        };

        var result = JsonSerializer.Serialize(errorResponse);
        return context.Response.WriteAsync(result);
    }
}
