using Microsoft.AspNetCore.Authentication.JwtBearer;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Application.UseCases.Authentication;
using StudentElectionSystem.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddAuthorization();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Application Services Composition Root
builder.Services.AddScoped<ILoginUseCase, LoginUseCase>();
builder.Services.AddScoped<ICurrentUserService, StudentElectionSystem.Api.Services.CurrentUserServiceImpl>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
