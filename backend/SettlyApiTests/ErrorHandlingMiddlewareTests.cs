using System;
using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SettlyApi.Middlewares;
using SettlyModels;
using Xunit;

public class ErrorHandlingMiddlewareTests
{
    private class NullLogger<T> : ILogger<T>
    {
        public IDisposable BeginScope<TState>(TState state) => null!;
        public bool IsEnabled(LogLevel logLevel) => false;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) { }
    }

    private class TestHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Development; // Development mode
        public string ApplicationName { get; set; } = "TestApp";
        public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
        public IFileProvider ContentRootFileProvider { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    }

    private DefaultHttpContext CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new System.IO.MemoryStream();
        return context;
    }

    [Fact]
    public async Task Middleware_Development_ReturnsDetailInResponse()
    {
        // Arrange
        var logger = new NullLogger<ErrorHandlingMiddleware>();
        var env = new TestHostEnvironment(); // Development mode
        var context = CreateHttpContext();

        var middleware = new ErrorHandlingMiddleware(async (innerContext) =>
        {
            throw new InvalidOperationException("Invalid operation for testing");
        }, logger, env);

        // Act
        await middleware.InvokeAsync(context);

        // Assert status code
        Assert.Equal((int)HttpStatusCode.Conflict, context.Response.StatusCode);

        // Assert response body
        context.Response.Body.Seek(0, System.IO.SeekOrigin.Begin);
        var reader = new System.IO.StreamReader(context.Response.Body, Encoding.UTF8);
        var json = await reader.ReadToEndAsync();

        var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(errorResponse);
        Assert.Equal((int)HttpStatusCode.Conflict, errorResponse!.Code);
        Assert.Equal("Operation is invalid in the current state.", errorResponse.Message);
        Assert.Equal(context.TraceIdentifier, errorResponse.TraceId);

        // Development mode should include exception detail
        Assert.Contains("InvalidOperationException", errorResponse.Detail!);
        Assert.Contains("Invalid operation for testing", errorResponse.Detail!);
    }
}
